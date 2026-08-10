/* =====================================================================
   app.js — Oberfläche des Wissensschatzes
   Zustand in der Adresszeile (#hash), Fortschritt im localStorage.
   ===================================================================== */
(function () {
  "use strict";

  const KB = window.KB;
  const esc = VIZ.esc;
  const app = document.getElementById("app");
  const nav = document.getElementById("nav");
  const sucheEl = document.getElementById("suche");

  const nachId = new Map(KB.nodes.map((n) => [n.id, n]));

  const SEITEN = [
    { id: "start", label: "Übersicht" },
    { id: "wissen", label: "Wissen" },
    { id: "lernen", label: "Lernen" },
    { id: "karte", label: "Karte" },
    { id: "organisation", label: "Selbstorganisation" },
    { id: "luecken", label: "Lücken" },
    { id: "tresor", label: "Tresor" },
  ];

  /* ------------------------------------------------------ Fortschritt */

  const SPEICHER = "wissensschatz.fortschritt";
  let F = lade();

  function lade() {
    try {
      return JSON.parse(localStorage.getItem(SPEICHER)) || { karten: {}, gelesen: {}, offen: {} };
    } catch { return { karten: {}, gelesen: {}, offen: {} }; }
  }
  function speichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(F)); } catch { /* Speicher voll oder gesperrt */ }
  }

  function melden(text) {
    const el = document.createElement("div");
    el.className = "meldung";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }

  /* ------------------------------------------------------------ Router */

  function route() {
    const h = location.hash.slice(1);
    if (!h) return { seite: "start" };
    const [seite, ...rest] = h.split("/");
    return { seite, arg: rest.join("/") };
  }

  function gehe(seite, arg) {
    location.hash = arg ? `${seite}/${arg}` : seite;
  }
  window.gehe = gehe;

  function zeichnen() {
    const { seite, arg } = route();
    nav.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-current", b.dataset.seite === seite ? "page" : "false"));
    app.innerHTML = "";
    window.scrollTo(0, 0);

    switch (seite) {
      case "wissen":       return seiteWissen(arg);
      case "lernen":       return seiteLernen();
      case "karte":        return seiteKarte();
      case "organisation": return seiteOrganisation();
      case "luecken":      return seiteLuecken();
      case "tresor":       return VAULT.zeichnen(app);
      case "suche":        return seiteSuche(decodeURIComponent(arg || ""));
      default:             return seiteStart();
    }
  }

  nav.innerHTML = SEITEN.map((s) =>
    `<button data-seite="${s.id}">${esc(s.label)}</button>`).join("");
  nav.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => gehe(b.dataset.seite)));

  window.addEventListener("hashchange", zeichnen);

  /* ------------------------------------------------------------- Suche */

  function suchen(q) {
    const begriffe = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!begriffe.length) return [];
    return KB.searchIndex
      .map((e) => {
        let punkte = 0;
        for (const b of begriffe) {
          if (e.t.includes(b)) punkte += e.t.startsWith(b) ? 14 : 10;
          if (e.g.includes(b)) punkte += 6;
          if (e.s.includes(b)) punkte += 4;
          const treffer = e.b.split(b).length - 1;
          if (treffer) punkte += Math.min(treffer, 5);
        }
        // Alle Begriffe müssen irgendwo vorkommen
        const vollstaendig = begriffe.every((b) =>
          e.t.includes(b) || e.g.includes(b) || e.s.includes(b) || e.b.includes(b));
        return vollstaendig ? { id: e.id, punkte } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.punkte - a.punkte)
      .slice(0, 60)
      .map((r) => ({ node: nachId.get(r.id), punkte: r.punkte }));
  }

  let suchUhr;
  sucheEl.addEventListener("input", () => {
    clearTimeout(suchUhr);
    suchUhr = setTimeout(() => {
      const q = sucheEl.value.trim();
      if (q.length >= 2) gehe("suche", encodeURIComponent(q));
      else if (route().seite === "suche") gehe("wissen");
    }, 180);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== sucheEl && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      e.preventDefault();
      sucheEl.focus();
      sucheEl.select();
    }
    if (e.key === "Escape" && document.activeElement === sucheEl) sucheEl.blur();
  });

  /* -------------------------------------------------------- Bausteine */

  function stufenChip(n) {
    const s = document.createElement("span");
    s.className = `chip stufe s${n}`;
    s.textContent = `${n} · ${KB.levelNames[n]}`;
    return s;
  }

  function chip(text, klasse) {
    const s = document.createElement("span");
    s.className = "chip " + (klasse || "");
    s.textContent = text;
    return s;
  }

  function kennzahl(wert, titel) {
    const d = document.createElement("div");
    d.className = "karte kennzahl";
    d.innerHTML = `<div class="wert">${esc(wert)}</div><div class="titel">${esc(titel)}</div>`;
    return d;
  }

  /* ------------------------------------------------------------- Start */

  function seiteStart() {
    const s = KB.stats;

    const kopf = document.createElement("div");
    kopf.innerHTML = `
      <h1>Wissensschatz</h1>
      <p class="gedaempft" style="max-width:66ch;margin-bottom:26px">
        Ein Archiv, das mit jedem Zuwachs neu geordnet wird: Die Einstufungen werden bei
        jedem Build nachgerechnet, überfüllte Ebenen gruppieren sich automatisch um,
        und offene Lücken stehen in einem eigenen Backlog.
        Stand ${esc(s.builtAt)}.</p>`;
    app.appendChild(kopf);

    const zahlen = document.createElement("div");
    zahlen.className = "raster k4";
    zahlen.style.marginBottom = "34px";
    [
      [s.nodes, "Wissensknoten"],
      [s.words.toLocaleString("de-DE"), "Wörter"],
      [s.cards, "Lernkarten"],
      [s.datasetRows.toLocaleString("de-DE"), "Referenzeinträge"],
    ].forEach(([w, t]) => zahlen.appendChild(kennzahl(w, t)));
    app.appendChild(zahlen);

    const h2 = document.createElement("h2");
    h2.textContent = "Themengebiete";
    app.appendChild(h2);

    const kacheln = document.createElement("div");
    kacheln.className = "raster k2";
    kacheln.style.marginBottom = "34px";

    s.byTopicLevel.forEach((t) => {
      const meta = KB.topicMeta[t.topic] || {};
      const anzahl = t.levels.reduce((a, b) => a + b, 0);
      const karten = KB.nodes.filter((n) => n.topic === t.topic).reduce((a, n) => a + n.quiz.length, 0);

      const b = document.createElement("button");
      b.className = "themenkachel";
      b.style.borderLeftColor = meta.color || "var(--line)";
      b.innerHTML = `
        <div class="kopf"><span class="ikon" style="color:${meta.color}">${esc(meta.icon || "•")}</span>
          ${esc(meta.label || t.topic)}</div>
        <div class="anspruch">${esc(meta.claim || "")}</div>`;
      b.appendChild(VIZ.stufenBalken(t.levels, meta.color || "#888"));
      const z = document.createElement("div");
      z.className = "zahlen";
      z.textContent = `${anzahl} Knoten · ${karten} Lernkarten`;
      b.appendChild(z);
      b.addEventListener("click", () => gehe("wissen", t.topic));
      kacheln.appendChild(b);
    });
    app.appendChild(kacheln);

    const h3 = document.createElement("h2");
    h3.textContent = "Abdeckung über die Stufen";
    app.appendChild(h3);
    app.appendChild(VIZ.abdeckung());

    // Herkunft und Reifegrad
    const meta = document.createElement("div");
    meta.className = "raster k2";
    meta.style.marginTop = "28px";
    const q = s.bySource, st = s.byStatus;
    meta.innerHTML = `
      <div class="karte">
        <h3 style="margin-top:0">Herkunft der Inhalte</h3>
        <table style="margin:0">
          <tr><td>KI-erzeugt und redaktionell übernommen</td><td class="rechts">${q.ki || 0}</td></tr>
          <tr><td>Eigene Inhalte</td><td class="rechts">${q.nutzer || 0}</td></tr>
          <tr><td>Gemischt</td><td class="rechts">${q.gemischt || 0}</td></tr>
        </table>
        <p class="klein gedaempft" style="margin:12px 0 0">Eigene Erfahrung ist unersetzbar,
        KI-Inhalte sind nachproduzierbar — deshalb bleibt die Herkunft dauerhaft am Knoten vermerkt.</p>
      </div>
      <div class="karte">
        <h3 style="margin-top:0">Reifegrad</h3>
        <table style="margin:0">
          <tr><td>Geprüft</td><td class="rechts">${st.geprueft || 0}</td></tr>
          <tr><td>Entwurf</td><td class="rechts">${st.entwurf || 0}</td></tr>
          <tr><td>Veraltet</td><td class="rechts">${st.veraltet || 0}</td></tr>
        </table>
        <p class="klein gedaempft" style="margin:12px 0 0">${KB.gaps.length} offene Punkte
        stehen im Backlog unter <em>Lücken</em>.</p>
      </div>`;
    app.appendChild(meta);
  }

  /* ------------------------------------------------------------ Wissen */

  function seiteWissen(arg) {
    const huelle = document.createElement("div");
    huelle.className = "zwei-spalten";
    const links = document.createElement("aside");
    links.className = "baum";
    const rechts = document.createElement("div");
    huelle.appendChild(links);
    huelle.appendChild(rechts);
    app.appendChild(huelle);

    baumZeichnen(links, arg);

    if (arg && nachId.has(arg)) knotenZeichnen(rechts, nachId.get(arg));
    else if (arg && KB.topicMeta[arg]) themaZeichnen(rechts, arg);
    else themenAuswahl(rechts);
  }

  function themenAuswahl(ziel) {
    ziel.innerHTML = `<h1>Wissen</h1>
      <p class="gedaempft">Links im Baum ein Thema aufklappen, oben suchen, oder unten ein Gebiet wählen.</p>`;
    const r = document.createElement("div");
    r.className = "raster k2";
    r.style.marginTop = "22px";
    Object.entries(KB.topicMeta).forEach(([id, m]) => {
      const anzahl = KB.nodes.filter((n) => n.topic === id).length;
      if (!anzahl) return;
      const b = document.createElement("button");
      b.className = "themenkachel";
      b.style.borderLeftColor = m.color;
      b.innerHTML = `<div class="kopf"><span class="ikon" style="color:${m.color}">${esc(m.icon)}</span>${esc(m.label)}</div>
        <div class="anspruch">${esc(m.desc || "")}</div>
        <div class="zahlen">${anzahl} Knoten</div>`;
      b.addEventListener("click", () => gehe("wissen", id));
      r.appendChild(b);
    });
    ziel.appendChild(r);
  }

  function themaZeichnen(ziel, topic) {
    const m = KB.topicMeta[topic];
    const knoten = KB.nodes.filter((n) => n.topic === topic);
    ziel.innerHTML = `
      <h1><span style="color:${m.color}">${esc(m.icon)}</span> ${esc(m.label)}</h1>
      <p class="zusammenfassung" style="border-color:${m.color}">${esc(m.desc || "")}</p>
      ${m.disclaimer ? `<div class="warnbox">${esc(m.disclaimer)}</div>` : ""}`;

    for (let l = 1; l <= 5; l++) {
      const stufe = knoten.filter((n) => n.level === l);
      if (!stufe.length) continue;
      const h = document.createElement("h2");
      h.innerHTML = `${l} · ${esc(KB.levelNames[l])} <span class="gedaempft klein">(${stufe.length})</span>`;
      ziel.appendChild(h);
      stufe.forEach((n) => {
        const b = document.createElement("button");
        b.className = "treffer";
        b.innerHTML = `<div class="t">${esc(n.title)}</div>
          <div class="p">${esc(n.path)}</div>
          <div class="s">${esc(n.summary)}</div>`;
        b.addEventListener("click", () => gehe("wissen", n.id));
        ziel.appendChild(b);
      });
    }
  }

  function baumZeichnen(ziel, aktiv) {
    ziel.innerHTML = "";
    (KB.tree.children || []).forEach((thema) => {
      const meta = KB.topicMeta[thema.name] || {};
      const kopf = document.createElement("div");
      kopf.className = "themenkopf";
      kopf.innerHTML = `<span class="punkt" style="background:${meta.color || "#888"}"></span>
        <span style="cursor:pointer">${esc(meta.label || thema.name)}</span>`;
      kopf.querySelector("span:last-child").addEventListener("click", () => gehe("wissen", thema.name));
      ziel.appendChild(kopf);
      gruppeZeichnen(ziel, thema, aktiv, 0);
    });
  }

  function gruppeZeichnen(ziel, gruppe, aktiv, tiefe) {
    (gruppe.children || []).forEach((k) => {
      const box = document.createElement("div");
      box.className = "baum-gruppe";
      const anzahl = zaehleKnoten(k);
      const offenSchluessel = k.path;
      const istOffen = F.offen[offenSchluessel] ?? (tiefe === 0 && enthaeltAktiv(k, aktiv));

      const kopf = document.createElement("button");
      kopf.className = "baum-kopf";
      kopf.setAttribute("aria-expanded", String(istOffen));
      kopf.innerHTML = `<span class="pfeil">▶</span>
        <span>${esc(k.name.replace(/^~/, ""))}</span>
        ${k.auto ? '<span class="auto" title="automatisch gebildete Gruppe">auto</span>' : ""}
        <span class="zahl">${anzahl}</span>`;
      box.appendChild(kopf);

      const kinder = document.createElement("div");
      kinder.className = "baum-kinder";
      kinder.style.display = istOffen ? "" : "none";
      gruppeZeichnen(kinder, k, aktiv, tiefe + 1);
      (k.nodes || []).forEach((id) => kinder.appendChild(knotenKnopf(id, aktiv)));
      box.appendChild(kinder);

      kopf.addEventListener("click", () => {
        const jetzt = kinder.style.display === "none";
        kinder.style.display = jetzt ? "" : "none";
        kopf.setAttribute("aria-expanded", String(jetzt));
        F.offen[offenSchluessel] = jetzt;
        speichern();
      });
      ziel.appendChild(box);
    });
    (gruppe.nodes || []).forEach((id) => ziel.appendChild(knotenKnopf(id, aktiv)));
  }

  function knotenKnopf(id, aktiv) {
    const n = nachId.get(id);
    const b = document.createElement("button");
    b.className = "baum-knoten";
    if (id === aktiv) b.setAttribute("aria-current", "true");
    b.innerHTML = `<span class="lvl">${n.level}</span><span>${esc(n.title)}</span>`;
    b.addEventListener("click", () => gehe("wissen", id));
    return b;
  }

  function zaehleKnoten(g) {
    return (g.nodes || []).length + (g.children || []).reduce((a, k) => a + zaehleKnoten(k), 0);
  }
  function enthaeltAktiv(g, aktiv) {
    if (!aktiv) return false;
    if ((g.nodes || []).includes(aktiv)) return true;
    return (g.children || []).some((k) => enthaeltAktiv(k, aktiv));
  }

  /* ------------------------------------------------------------ Knoten */

  function knotenZeichnen(ziel, n) {
    F.gelesen[n.id] = new Date().toISOString();
    speichern();

    const meta = KB.topicMeta[n.topic] || {};
    const art = document.createElement("article");
    art.className = "knoten";

    const kopf = document.createElement("div");
    kopf.innerHTML = `<h1>${esc(n.title)}</h1>`;
    const zeile = document.createElement("div");
    zeile.className = "kopfzeile";
    zeile.appendChild(stufenChip(n.level));
    zeile.appendChild(chip(n.type));
    if (n.source === "nutzer") zeile.appendChild(chip("eigener Inhalt", "quelle-nutzer"));
    if (n.source === "gemischt") zeile.appendChild(chip("gemischt", "quelle-nutzer"));
    if (n.status !== "geprueft") zeile.appendChild(chip(n.status, "status-" + n.status));
    if (n.level !== n.declaredLevel) {
      zeile.appendChild(chip(`neu eingestuft: ${n.declaredLevel} → ${n.level}`));
    }
    n.tags.forEach((t) => zeile.appendChild(chip(t)));
    kopf.appendChild(zeile);
    art.appendChild(kopf);

    if (meta.disclaimer) {
      const w = document.createElement("div");
      w.className = "warnbox";
      w.innerHTML = `<strong>Hinweis:</strong> ${esc(meta.disclaimer)}`;
      art.appendChild(w);
    }

    if (n.summary) {
      const z = document.createElement("p");
      z.className = "zusammenfassung";
      z.textContent = n.summary;
      art.appendChild(z);
    }

    // Fließtext mit eingebetteten Visualisierungen
    const teile = n.body.split(/@@VIZ:(\d+)@@/);
    teile.forEach((teil, i) => {
      if (i % 2 === 1) {
        const v = n.viz[+teil];
        if (v) art.appendChild(VIZ.aufloesen(v.name, v.caption));
      } else if (teil.trim()) {
        const d = document.createElement("div");
        d.innerHTML = VIZ.markdown(teil);
        while (d.firstChild) art.appendChild(d.firstChild);
      }
    });

    // Lernkarten
    if (n.quiz.length) {
      const h = document.createElement("h2");
      h.textContent = `Lernkarten (${n.quiz.length})`;
      art.appendChild(h);
      n.quiz.forEach((q, i) => {
        const d = document.createElement("details");
        d.className = "karte";
        d.style.marginBottom = "8px";
        d.innerHTML = `<summary style="cursor:pointer;font-weight:600">${esc(q.q)}</summary>
          <div style="margin-top:10px;color:var(--ink-2)">${VIZ.markdown(q.a)}</div>`;
        art.appendChild(d);
      });
      const b = document.createElement("button");
      b.className = "knopf";
      b.style.marginTop = "6px";
      b.textContent = "Diese Karten üben";
      b.addEventListener("click", () => { lernFilter = n.id; gehe("lernen"); });
      art.appendChild(b);
    }

    // Verweise
    const v = document.createElement("div");
    v.className = "verweise";
    const bloecke = [
      ["Setzt voraus", n.prereqs],
      ["Verwandt", n.related],
      ["Verweist hierher", n.backlinks],
    ];
    bloecke.forEach(([titel, ids]) => {
      if (!ids.length) return;
      const h = document.createElement("div");
      h.className = "klein gedaempft";
      h.style.marginTop = "14px";
      h.textContent = titel;
      v.appendChild(h);
      const l = document.createElement("div");
      l.className = "verweis-liste";
      ids.forEach((id) => {
        const z = nachId.get(id);
        const b = document.createElement("button");
        if (z) {
          b.textContent = z.title;
          b.addEventListener("click", () => gehe("wissen", id));
        } else {
          b.className = "fehlt";
          b.textContent = `${id} — fehlt noch`;
          b.disabled = true;
        }
        l.appendChild(b);
      });
      v.appendChild(l);
    });

    const fuss = document.createElement("div");
    fuss.className = "klein gedaempft";
    fuss.style.marginTop = "22px";
    fuss.innerHTML = `Quelle: <span class="mono">content/${esc(n.file)}</span> ·
      ${n.words} Wörter · zuletzt geändert ${esc(n.updated)} ·
      ID <span class="mono">${esc(n.id)}</span>`;
    v.appendChild(fuss);
    art.appendChild(v);

    ziel.appendChild(art);
  }

  /* ------------------------------------------------------------- Suche */

  function seiteSuche(q) {
    sucheEl.value = q;
    const treffer = suchen(q);
    const h = document.createElement("div");
    h.innerHTML = `<h1>Suche</h1>
      <p class="gedaempft">${treffer.length} Treffer für <strong>${esc(q)}</strong></p>`;
    app.appendChild(h);

    if (!treffer.length) {
      const l = document.createElement("div");
      l.className = "leer";
      l.innerHTML = `<div class="gross">⌕</div>Nichts gefunden.<br>
        <span class="klein">Andere Begriffe versuchen — die Suche geht über Titel, Zusammenfassung, Tags und Fließtext.</span>`;
      app.appendChild(l);
      return;
    }

    treffer.forEach(({ node }) => {
      const b = document.createElement("button");
      b.className = "treffer";
      const meta = KB.topicMeta[node.topic] || {};
      b.innerHTML = `<div class="t">${hervorheben(node.title, q)}</div>
        <div class="p" style="color:${meta.color}">${esc(meta.label)} · ${esc(node.path)} · Stufe ${node.level}</div>
        <div class="s">${hervorheben(node.summary, q)}</div>`;
      b.addEventListener("click", () => gehe("wissen", node.id));
      app.appendChild(b);
    });
  }

  function hervorheben(text, q) {
    let out = esc(text);
    q.toLowerCase().split(/\s+/).filter((b) => b.length > 1).forEach((b) => {
      out = out.replace(new RegExp(`(${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
    });
    return out;
  }

  /* ------------------------------------------------------------ Lernen */

  let lernFilter = null;

  function alleKarten() {
    const k = [];
    KB.nodes.forEach((n) => n.quiz.forEach((q, i) => k.push({
      schluessel: `${n.id}#${i}`, frage: q.q, antwort: q.a, knoten: n,
    })));
    return k;
  }

  /* Vereinfachtes SM-2: Intervall wächst mit dem Leichtigkeitsfaktor. */
  function planen(schluessel, note) {
    const jetzt = Date.now();
    const k = F.karten[schluessel] || { n: 0, ef: 2.5, faellig: 0, intervall: 0 };
    if (note < 3) {
      k.n = 0;
      k.intervall = note === 1 ? 0 : 1;
    } else {
      k.n += 1;
      k.intervall = k.n === 1 ? 1 : k.n === 2 ? 6 : Math.round(k.intervall * k.ef);
    }
    k.ef = Math.max(1.3, k.ef + (0.1 - (5 - note) * (0.08 + (5 - note) * 0.02)));
    k.faellig = jetzt + k.intervall * 86400000;
    k.zuletzt = jetzt;
    F.karten[schluessel] = k;
    speichern();
  }

  function seiteLernen() {
    let karten = alleKarten();
    if (lernFilter) karten = karten.filter((k) => k.knoten.id === lernFilter);

    const jetzt = Date.now();
    const faellig = karten.filter((k) => {
      const s = F.karten[k.schluessel];
      return !s || s.faellig <= jetzt;
    });

    const kopf = document.createElement("div");
    kopf.innerHTML = `<h1>Lernen</h1>`;
    app.appendChild(kopf);

    const leiste = document.createElement("div");
    leiste.className = "werkzeugleiste";
    const themen = [...new Set(KB.nodes.map((n) => n.topic))];
    leiste.innerHTML = `<select id="l-thema" style="width:auto">
        <option value="">Alle Themen</option>
        ${themen.map((t) => `<option value="${t}">${esc((KB.topicMeta[t] || {}).label || t)}</option>`).join("")}
      </select>`;
    if (lernFilter) {
      const b = document.createElement("button");
      b.className = "knopf klein";
      b.textContent = `Nur „${nachId.get(lernFilter).title}" — Filter aufheben`;
      b.addEventListener("click", () => { lernFilter = null; zeichnen(); });
      leiste.appendChild(b);
    }
    const stand = document.createElement("span");
    stand.className = "klein gedaempft";
    stand.style.marginLeft = "auto";
    const gelernt = Object.keys(F.karten).length;
    stand.textContent = `${faellig.length} fällig · ${gelernt} von ${alleKarten().length} Karten begonnen`;
    leiste.appendChild(stand);
    app.appendChild(leiste);

    leiste.querySelector("#l-thema").addEventListener("change", (e) => {
      lernFilter = null;
      themaFilter = e.target.value;
      zeichnen();
    });

    let auswahl = faellig;
    if (themaFilter) auswahl = auswahl.filter((k) => k.knoten.topic === themaFilter);

    if (!auswahl.length) {
      const l = document.createElement("div");
      l.className = "leer";
      const naechste = Object.values(F.karten).filter((k) => k.faellig > jetzt)
        .sort((a, b) => a.faellig - b.faellig)[0];
      l.innerHTML = `<div class="gross">✓</div>Nichts fällig.
        ${naechste ? `<br><span class="klein">Die nächste Karte ist am
          ${new Date(naechste.faellig).toLocaleDateString("de-DE")} dran.</span>` : ""}
        <br><br><button class="knopf" id="l-trotzdem">Trotzdem üben</button>`;
      app.appendChild(l);
      l.querySelector("#l-trotzdem").addEventListener("click", () => {
        const alle = themaFilter ? karten.filter((k) => k.knoten.topic === themaFilter) : karten;
        uebung(mischen(alle).slice(0, 20));
      });
      return;
    }

    uebung(mischen(auswahl));
  }

  let themaFilter = "";

  function mischen(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  function uebung(stapel) {
    const behaelter = document.createElement("div");
    behaelter.style.maxWidth = "680px";
    behaelter.style.margin = "0 auto";
    app.appendChild(behaelter);

    let i = 0, gezeigt = false;

    function karte() {
      if (i >= stapel.length) {
        behaelter.innerHTML = `<div class="leer"><div class="gross">✓</div>
          Durchgang beendet — ${stapel.length} Karten.<br><br>
          <button class="knopf haupt" id="l-weiter">Weiter üben</button></div>`;
        behaelter.querySelector("#l-weiter").addEventListener("click", zeichnen);
        return;
      }
      const k = stapel[i];
      const meta = KB.topicMeta[k.knoten.topic] || {};
      behaelter.innerHTML = `
        <div class="fortschritt"><i style="width:${(i / stapel.length) * 100}%"></i></div>
        <div class="lernkarte">
          <div class="herkunft" style="color:${meta.color}">${esc(meta.label)} · ${esc(k.knoten.title)}
            · Stufe ${k.knoten.level}</div>
          <div class="frage">${VIZ.markdown(k.frage).replace(/^<p>|<\/p>$/g, "")}</div>
          ${gezeigt ? `<div class="antwort">${VIZ.markdown(k.antwort)}</div>` : ""}
        </div>
        ${gezeigt
          ? `<div class="bewertung">
               <button class="knopf" data-note="1">Nicht gewusst</button>
               <button class="knopf" data-note="3">Mit Mühe</button>
               <button class="knopf" data-note="4">Gewusst</button>
               <button class="knopf" data-note="5">Sicher</button>
             </div>`
          : `<button class="knopf haupt" id="l-zeigen" style="width:100%">Antwort zeigen  <span class="klein">(Leertaste)</span></button>`}
        <div class="klein gedaempft rechts" style="margin-top:12px">
          <button class="knopf klein" id="l-quelle">Zum Knoten</button>
          ${i + 1} / ${stapel.length}
        </div>`;

      if (gezeigt) {
        behaelter.querySelectorAll("[data-note]").forEach((b) =>
          b.addEventListener("click", () => {
            planen(k.schluessel, +b.dataset.note);
            i++; gezeigt = false; karte();
          }));
      } else {
        behaelter.querySelector("#l-zeigen").addEventListener("click", () => { gezeigt = true; karte(); });
      }
      behaelter.querySelector("#l-quelle").addEventListener("click", () => gehe("wissen", k.knoten.id));
    }

    document.addEventListener("keydown", tasten);
    function tasten(e) {
      if (route().seite !== "lernen") { document.removeEventListener("keydown", tasten); return; }
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key === " ") { e.preventDefault(); if (!gezeigt) { gezeigt = true; karte(); } }
      if (gezeigt && ["1", "2", "3", "4"].includes(e.key)) {
        const noten = { 1: 1, 2: 3, 3: 4, 4: 5 };
        planen(stapel[i].schluessel, noten[e.key]);
        i++; gezeigt = false; karte();
      }
    }

    karte();
  }

  /* ------------------------------------------------------------- Karte */

  function seiteKarte() {
    app.innerHTML = `<h1>Wissenskarte</h1>
      <p class="gedaempft" style="max-width:66ch">Jeder Punkt ist ein Knoten, die Größe zeigt die Stufe.
      Durchgezogene Linien sind Voraussetzungen, gestrichelte Querverweise. Klicken öffnet den Knoten.</p>`;
    app.appendChild(VIZ.karte((id) => gehe("wissen", id)));
  }

  /* --------------------------------------------------- Selbstorganisation */

  function seiteOrganisation() {
    app.innerHTML = `<h1>Selbstorganisation</h1>
      <p class="gedaempft" style="max-width:70ch">Bei jedem Build rechnet das Archiv seine Struktur neu:
      Es stuft Knoten anhand ihrer Voraussetzungsketten ein, normalisiert die Skala je Themengebiet
      und gruppiert überfüllte Ebenen automatisch um. Was hier steht, hat niemand von Hand gepflegt.</p>`;

    // Umgruppierungen
    const h1 = document.createElement("h2");
    h1.textContent = `Automatische Gruppierung (${KB.regroupLog.length})`;
    app.appendChild(h1);

    if (!KB.regroupLog.length) {
      const p = document.createElement("p");
      p.className = "gedaempft";
      p.innerHTML = `Noch keine Ebene überschreitet die Schwelle von
        <strong>${KB.config.splitThreshold}</strong> Knoten. Sobald das passiert, clustert der Build
        die betroffene Ebene nach Tag- und Titelähnlichkeit und benennt die Gruppen selbst.`;
      app.appendChild(p);
    } else {
      KB.regroupLog.forEach((r) => {
        const k = document.createElement("div");
        k.className = "karte";
        k.style.marginBottom = "10px";
        k.innerHTML = `<div class="mono klein gedaempft">${esc(r.path)}</div>
          <div style="margin-top:8px">${r.groups.map((g) =>
            `<span class="chip">${esc(g.name)} · ${g.count}</span>`).join(" ")}
            ${r.loose ? `<span class="chip gedaempft">${r.loose} einzeln</span>` : ""}</div>`;
        app.appendChild(k);
      });
    }

    // Neubewertung
    const h2 = document.createElement("h2");
    h2.textContent = `Abweichung von der deklarierten Stufe (${KB.levelChanges.length})`;
    app.appendChild(h2);
    const p2 = document.createElement("p");
    p2.className = "gedaempft klein";
    p2.textContent = "Die Stufe im Frontmatter ist ein Vorschlag. Der Build berücksichtigt zusätzlich die Länge der Voraussetzungskette und die Strukturtiefe und normalisiert anschließend je Themengebiet.";
    app.appendChild(p2);

    if (KB.levelChanges.length) {
      const t = document.createElement("div");
      t.className = "tabellen-huelle";
      t.innerHTML = `<table><thead><tr><th>Knoten</th><th>deklariert</th><th>berechnet</th><th>Begründung</th></tr></thead>
        <tbody>${KB.levelChanges.map((c) => `<tr>
          <td><a href="#wissen/${esc(c.id)}">${esc(c.title)}</a></td>
          <td><span class="chip stufe s${c.from}">${c.from}</span></td>
          <td><span class="chip stufe s${c.to}">${c.to}</span></td>
          <td class="klein gedaempft">${esc(c.reason)}</td></tr>`).join("")}</tbody></table>`;
      app.appendChild(t);
    }

    // Drift gegenüber dem letzten Build
    const h3 = document.createElement("h2");
    h3.textContent = `Verschiebung seit dem letzten Build (${KB.drift.length})`;
    app.appendChild(h3);
    if (!KB.drift.length) {
      const p = document.createElement("p");
      p.className = "gedaempft";
      p.textContent = "Keine Einstufung hat sich seit dem letzten Build verschoben.";
      app.appendChild(p);
    } else {
      const l = document.createElement("div");
      KB.drift.forEach((d) => {
        const k = document.createElement("div");
        k.className = "karte";
        k.style.marginBottom = "8px";
        k.innerHTML = `<a href="#wissen/${esc(d.id)}"><strong>${esc(d.title)}</strong></a>
          <span class="chip stufe s${d.from}">${d.from}</span> →
          <span class="chip stufe s${d.to}">${d.to}</span>
          <div class="klein gedaempft" style="margin-top:6px">Das Themengebiet
          ${esc((KB.topicMeta[d.topic] || {}).label || d.topic)} ist gewachsen — die Skala hat sich mitverschoben.</div>`;
        l.appendChild(k);
      });
      app.appendChild(l);
    }

    // Regeln
    const h4 = document.createElement("h2");
    h4.textContent = "Eingestellte Schwellen";
    app.appendChild(h4);
    const c = KB.config;
    const k = document.createElement("div");
    k.className = "karte";
    k.innerHTML = `<table style="margin:0">
      <tr><td>Ebene wird geclustert ab</td><td class="rechts mono">${c.splitThreshold} Knoten</td></tr>
      <tr><td>Kleinster eigenständiger Cluster</td><td class="rechts mono">${c.minCluster}</td></tr>
      <tr><td>Ähnlichkeitsschwelle</td><td class="rechts mono">${c.simThreshold}</td></tr>
      <tr><td>Normalisierung ab</td><td class="rechts mono">${c.rebalanceMinNodes} Knoten je Thema</td></tr>
      <tr><td>Gewichtung deklariert / Voraussetzung / Tiefe</td>
          <td class="rechts mono">${c.levelWeights.declared} / ${c.levelWeights.prereq} / ${c.levelWeights.depth}</td></tr>
      </table>
      <p class="klein gedaempft" style="margin:12px 0 0">Anpassbar in
      <span class="mono">tools/lib/organize.mjs</span>.</p>`;
    app.appendChild(k);
  }

  /* ------------------------------------------------------------ Lücken */

  function seiteLuecken() {
    const nachArt = {};
    KB.gaps.forEach((g) => (nachArt[g.kind] = nachArt[g.kind] || []).push(g));

    const titel = {
      voraussetzung: "Fehlende Voraussetzungen",
      verweis: "Verweise ins Leere",
      stufe: "Unbesetzte Stufen",
      todo: "Offene Punkte im Text",
    };
    const erklaerung = {
      voraussetzung: "Ein Knoten nennt eine Voraussetzung, die es noch nicht gibt. Das sind die wertvollsten Lücken — sie stehen einem Lernpfad im Weg.",
      verweis: "Ein Querverweis zeigt auf einen Knoten, der noch fehlt.",
      stufe: "In diesem Themengebiet ist eine Stufe unbesetzt. Meist fehlt der Einstieg oder die Vertiefung.",
      todo: "Im Fließtext markierte offene Punkte.",
    };

    app.innerHTML = `<h1>Lücken</h1>
      <p class="gedaempft" style="max-width:70ch">${KB.gaps.length} offene Punkte. Diese Liste
      entsteht beim Build von selbst — aus fehlenden Verweisen, unbesetzten Stufen und
      <span class="mono">&gt; TODO:</span>-Marken im Text. Sie ist die Arbeitsliste des Archivs.</p>`;

    ["voraussetzung", "verweis", "stufe", "todo"].forEach((art) => {
      const liste = nachArt[art];
      if (!liste || !liste.length) return;
      const h = document.createElement("h2");
      h.textContent = `${titel[art]} (${liste.length})`;
      app.appendChild(h);
      const p = document.createElement("p");
      p.className = "gedaempft klein";
      p.textContent = erklaerung[art];
      app.appendChild(p);

      liste.forEach((g) => {
        const k = document.createElement("div");
        k.className = "karte";
        k.style.marginBottom = "8px";
        const q = g.node ? nachId.get(g.node) : null;
        k.innerHTML = `<div>${esc(g.missing)}</div>
          ${q ? `<div class="klein gedaempft" style="margin-top:5px">in
            <a href="#wissen/${esc(q.id)}">${esc(q.title)}</a></div>` : ""}`;
        app.appendChild(k);
      });
    });

    const hinweis = document.createElement("div");
    hinweis.className = "hinweisbox";
    hinweis.style.marginTop = "28px";
    hinweis.innerHTML = `<strong>Lücke schließen:</strong>
      <pre style="margin:8px 0 0">node tools/feed.mjs --titel "…" --pfad thema/unterthema --level 2</pre>`;
    app.appendChild(hinweis);
  }

  /* ------------------------------------------------------------- Start */

  zeichnen();
})();
