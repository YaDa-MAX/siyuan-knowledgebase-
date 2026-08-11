/* =====================================================================
   dienstplan-ui.js — Oberfläche des Dienstplan-Prüfers

   Die Regeln stehen in dienstplan.js und werden dort von tools/test-
   dienstplan.mjs geprüft. Hier steht nur Eingabe und Darstellung, damit
   das Rechnen testbar bleibt und nicht am DOM klebt.
   ===================================================================== */
(function () {
  "use strict";

  const KB = window.KB;
  const DP = window.DIENSTPLAN;
  const esc = VIZ.esc;
  const SPEICHER = "wissensschatz.dienstplan";

  const LAENDER = [
    ["", "— ohne Landesbezug (nur bundesweite Feiertage) —"],
    ["BW", "Baden-Württemberg"], ["BY", "Bayern"], ["BE", "Berlin"],
    ["BB", "Brandenburg"], ["HB", "Bremen"], ["HH", "Hamburg"],
    ["HE", "Hessen"], ["MV", "Mecklenburg-Vorpommern"], ["NI", "Niedersachsen"],
    ["NW", "Nordrhein-Westfalen"], ["RP", "Rheinland-Pfalz"], ["SL", "Saarland"],
    ["SN", "Sachsen"], ["ST", "Sachsen-Anhalt"], ["SH", "Schleswig-Holstein"],
    ["TH", "Thüringen"],
  ];

  const SCHWERE_TEXT = {
    unzulaessig: { label: "unzulässig", farbe: "var(--vz-rot)" },
    pruefen: { label: "prüfen", farbe: "var(--vz-orange)" },
    hinweis: { label: "Hinweis", farbe: "var(--vz-blau)" },
  };

  /* ----------------------------------------------------------- Zustand */

  function leer() {
    return { gastgewerbe: true, land: "BY", personen: [], schichten: [] };
  }

  function laden() {
    try {
      const d = JSON.parse(localStorage.getItem(SPEICHER));
      if (d && Array.isArray(d.personen)) return d;
    } catch { /* beschädigt oder gesperrt — dann eben leer */ }
    return null;
  }

  let Z = laden() || beispiel();

  function sichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(Z)); }
    catch { /* Speicher voll oder gesperrt; die Prüfung läuft trotzdem */ }
  }

  /** Eine Woche, wie sie in einem Hotel tatsächlich aussieht — mit Absicht mit Fehlern. */
  function beispiel() {
    // Montag der laufenden Woche, damit das Beispiel nie veraltet wirkt
    const heute = new Date();
    const mo = new Date(Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate()));
    mo.setUTCDate(mo.getUTCDate() - ((mo.getUTCDay() + 6) % 7));
    const t = (n) => new Date(mo.getTime() + n * 86400000).toISOString().slice(0, 10);

    return {
      gastgewerbe: true, land: "BY",
      personen: [
        { id: "p1", name: "Serviceleitung", gruppe: "erwachsen" },
        { id: "p2", name: "Aushilfe, 16 Jahre", gruppe: "jugend16" },
      ],
      schichten: [
        // Klassischer Spät-Früh-Wechsel: 10 Stunden Ruhezeit, im Gastgewerbe
        // zulässig — aber nur mit Ausgleich, und der fehlt in dieser Woche.
        { person: "p1", datum: t(0), von: "15:00", bis: "23:00", pause: 30 },
        { person: "p1", datum: t(1), von: "09:00", bis: "17:00", pause: 30 },
        { person: "p1", datum: t(2), von: "15:00", bis: "23:30", pause: 30 },
        { person: "p1", datum: t(3), von: "09:30", bis: "18:00", pause: 30 },
        // Geteilter Dienst — ein Arbeitstag, kein Verstoß
        { person: "p1", datum: t(4), von: "11:00", bis: "14:00", pause: 0 },
        { person: "p1", datum: t(4), von: "17:00", bis: "22:00", pause: 0 },
        { person: "p1", datum: t(5), von: "12:00", bis: "23:00", pause: 45 },
        // Jugendliche: eine zulässige Schicht und eine, die 22 Uhr reißt
        { person: "p2", datum: t(4), von: "16:00", bis: "22:00", pause: 60 },
        { person: "p2", datum: t(5), von: "16:00", bis: "23:00", pause: 60 },
        { person: "p2", datum: t(6), von: "11:00", bis: "19:00", pause: 60 },
      ],
    };
  }

  /* ------------------------------------------------------------ Zeichnen */

  function zeichnen(app) {
    app.innerHTML = "";

    const kopf = document.createElement("div");
    kopf.innerHTML = `<h1>Dienstplan prüfen</h1>
      <p class="gedaempft" style="max-width:72ch">
        Schichten eintragen, prüfen lassen. Jeder Befund nennt den Paragrafen, die
        konkrete Zahl und den Knoten, der die Regel erklärt — das ist der Weg von der
        Theorie in den konkreten Fall, den der Lernmodus allein nicht leisten kann.</p>
      <div class="hinweisbox" style="margin:14px 0 22px">
        <strong>Prüfhilfe, kein Rechtsrat.</strong> Sie kennt einen Teil des Arbeitszeitrechts
        und weiß nichts von eurem Tarifvertrag. Ein Ergebnis ohne Befunde heißt
        „hier ist nichts aufgefallen", nicht „das ist zulässig". Was nicht geprüft wird,
        steht unter dem Ergebnis.
      </div>`;
    app.appendChild(kopf);

    /* --------------------------------------------------------- Betrieb */

    const betrieb = document.createElement("div");
    betrieb.className = "karte";
    betrieb.style.marginBottom = "16px";
    betrieb.innerHTML = `
      <div class="werkzeugleiste" style="margin-bottom:0">
        <label style="display:flex;align-items:center;gap:7px;font-size:.9rem">
          <input type="checkbox" id="dp-gast" ${Z.gastgewerbe ? "checked" : ""}>
          Gaststätten- oder Beherbergungsbetrieb
        </label>
        <label style="display:flex;align-items:center;gap:7px;font-size:.9rem;margin-left:8px">
          Bundesland
          <select id="dp-land">${LAENDER.map(([k, v]) =>
            `<option value="${k}"${k === Z.land ? " selected" : ""}>${esc(v)}</option>`).join("")}</select>
        </label>
      </div>
      <p class="klein gedaempft" style="margin:10px 0 0">
        Der Haken schaltet die Branchenausnahmen frei: verkürzte Ruhezeit (§ 5 Abs. 2 ArbZG),
        Sonntagsarbeit (§ 10 Abs. 1 Nr. 4), bei Jugendlichen die Beschäftigung bis 22 Uhr
        sowie an Samstagen und Sonntagen. Das Bundesland bestimmt die Feiertage.</p>`;
    app.appendChild(betrieb);

    betrieb.querySelector("#dp-gast").addEventListener("change", (e) => {
      Z.gastgewerbe = e.target.checked; sichern(); zeichnen(app);
    });
    betrieb.querySelector("#dp-land").addEventListener("change", (e) => {
      Z.land = e.target.value; sichern(); zeichnen(app);
    });

    /* -------------------------------------------------------- Personen */

    const pk = document.createElement("div");
    pk.className = "karte";
    pk.style.marginBottom = "16px";
    pk.innerHTML = `<h2 style="margin-top:0">Personen</h2>
      <div class="tabellen-huelle"><table><thead><tr>
        <th style="width:52%">Name</th><th>Altersgruppe</th><th style="width:1%"></th>
      </tr></thead><tbody id="dp-personen"></tbody></table></div>
      <button class="knopf klein" id="dp-person-neu">Person hinzufügen</button>`;
    app.appendChild(pk);

    const ptb = pk.querySelector("#dp-personen");
    Z.personen.forEach((p, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="text" value="${esc(p.name)}" data-f="name" style="width:100%"></td>
        <td><select data-f="gruppe">${Object.entries(DP.GRUPPEN).map(([k, v]) =>
          `<option value="${k}"${k === p.gruppe ? " selected" : ""}>${esc(v.label)}</option>`).join("")}</select></td>
        <td><button class="knopf klein" data-weg="1" title="Person entfernen">×</button></td>`;
      tr.querySelectorAll("[data-f]").forEach((el) =>
        el.addEventListener("change", () => { p[el.dataset.f] = el.value; sichern(); }));
      tr.querySelector("[data-weg]").addEventListener("click", () => {
        Z.schichten = Z.schichten.filter((s) => s.person !== p.id);
        Z.personen.splice(i, 1); sichern(); zeichnen(app);
      });
      ptb.appendChild(tr);
    });
    pk.querySelector("#dp-person-neu").addEventListener("click", () => {
      Z.personen.push({ id: "p" + Date.now().toString(36), name: "Neue Person", gruppe: "erwachsen" });
      sichern(); zeichnen(app);
    });

    /* -------------------------------------------------------- Schichten */

    const sk = document.createElement("div");
    sk.className = "karte";
    sk.style.marginBottom = "16px";
    sk.innerHTML = `<h2 style="margin-top:0">Schichten</h2>
      <div class="tabellen-huelle"><table><thead><tr>
        <th>Person</th><th>Datum</th><th>Von</th><th>Bis</th><th>Pause (min)</th>
        <th>Arbeitszeit</th><th style="width:1%"></th>
      </tr></thead><tbody id="dp-schichten"></tbody></table></div>
      <div class="werkzeugleiste" style="margin:0">
        <button class="knopf klein" id="dp-schicht-neu">Schicht hinzufügen</button>
        <button class="knopf klein" id="dp-beispiel">Beispielwoche laden</button>
        <button class="knopf klein" id="dp-leeren">Alles leeren</button>
      </div>
      <p class="klein gedaempft" style="margin:12px 0 0">
        Ein Ende vor dem Beginn wird als Schicht über Mitternacht gelesen. Mehrere Schichten
        am selben Tag gelten als <strong>ein Arbeitstag mit Unterbrechung</strong> — der geteilte
        Dienst der Hotellerie, nicht zwei Arbeitstage mit kurzer Ruhezeit dazwischen.</p>`;
    app.appendChild(sk);

    const stb = sk.querySelector("#dp-schichten");
    if (!Z.schichten.length) {
      stb.innerHTML = `<tr><td colspan="7" class="gedaempft klein">Noch keine Schichten.</td></tr>`;
    }
    Z.schichten
      .map((s, i) => ({ s, i }))
      .sort((a, b) => (a.s.datum + a.s.von).localeCompare(b.s.datum + b.s.von))
      .forEach(({ s, i }) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><select data-f="person">${Z.personen.map((p) =>
            `<option value="${esc(p.id)}"${p.id === s.person ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select></td>
          <td><input type="date" value="${esc(s.datum)}" data-f="datum"></td>
          <td><input type="time" value="${esc(s.von)}" data-f="von"></td>
          <td><input type="time" value="${esc(s.bis)}" data-f="bis"></td>
          <td><input type="number" value="${Number(s.pause) || 0}" data-f="pause" min="0" step="5" style="width:74px"></td>
          <td class="mono klein gedaempft">${dauerText(s)}</td>
          <td><button class="knopf klein" data-weg="1" title="Schicht entfernen">×</button></td>`;
        tr.querySelectorAll("[data-f]").forEach((el) =>
          el.addEventListener("change", () => {
            s[el.dataset.f] = el.dataset.f === "pause" ? Number(el.value) || 0 : el.value;
            sichern(); zeichnen(app);
          }));
        tr.querySelector("[data-weg]").addEventListener("click", () => {
          Z.schichten.splice(i, 1); sichern(); zeichnen(app);
        });
        stb.appendChild(tr);
      });

    sk.querySelector("#dp-schicht-neu").addEventListener("click", () => {
      const letzte = Z.schichten[Z.schichten.length - 1];
      const datum = letzte
        ? new Date(new Date(letzte.datum).getTime() + 86400000).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      Z.schichten.push({
        person: Z.personen[0]?.id || "", datum,
        von: letzte?.von || "09:00", bis: letzte?.bis || "17:30", pause: letzte?.pause ?? 30,
      });
      sichern(); zeichnen(app);
    });
    sk.querySelector("#dp-beispiel").addEventListener("click", () => {
      Z = beispiel(); sichern(); zeichnen(app);
    });
    sk.querySelector("#dp-leeren").addEventListener("click", () => {
      Z = leer(); Z.personen.push({ id: "p1", name: "Person 1", gruppe: "erwachsen" });
      sichern(); zeichnen(app);
    });

    /* --------------------------------------------------------- Ergebnis */

    if (!Z.schichten.length) return;

    const e = DP.pruefen({
      gastgewerbe: Z.gastgewerbe, land: Z.land,
      feiertagsDaten: (KB.datasets["feiertage-de"] || {}).items || [],
      personen: Z.personen, schichten: Z.schichten,
    });

    const zahlen = document.createElement("div");
    zahlen.className = "raster k4";
    zahlen.style.margin = "26px 0 18px";
    [
      [e.kennzahlen.schichten, "Schichten"],
      [e.kennzahlen.stunden.toFixed(1).replace(".", ",") + " h", "Arbeitszeit gesamt"],
      [e.kennzahlen.unzulaessig, "unzulässig", e.kennzahlen.unzulaessig ? "var(--vz-rot)" : ""],
      [e.kennzahlen.pruefen, "zu prüfen", e.kennzahlen.pruefen ? "var(--vz-orange)" : ""],
    ].forEach(([wert, titel, farbe]) => {
      const k = document.createElement("div");
      k.className = "karte kennzahl";
      k.innerHTML = `<div class="wert"${farbe ? ` style="color:${farbe}"` : ""}>${esc(String(wert))}</div>
        <div class="titel">${esc(titel)}</div>`;
      zahlen.appendChild(k);
    });
    app.appendChild(zahlen);

    const h = document.createElement("h2");
    h.textContent = "Befunde";
    app.appendChild(h);

    if (!e.befunde.length) {
      const ok = document.createElement("div");
      ok.className = "karte";
      ok.innerHTML = `<strong>Nichts aufgefallen.</strong>
        <p class="klein gedaempft" style="margin:6px 0 0">Das heißt: keine der geprüften Regeln
        wurde verletzt. Es heißt nicht, dass der Plan zulässig ist — siehe die Grenzen unten.</p>`;
      app.appendChild(ok);
    }

    for (const p of Z.personen) {
      const meine = e.befunde.filter((b) => b.person === p.id);
      if (!meine.length) continue;
      const kopfP = document.createElement("h3");
      kopfP.style.margin = "22px 0 10px";
      kopfP.innerHTML = `${esc(p.name)}
        <span class="klein gedaempft" style="font-weight:400">
          · ${esc(DP.GRUPPEN[p.gruppe].label)} · ${esc(DP.GRUPPEN[p.gruppe].gesetz)}</span>`;
      app.appendChild(kopfP);

      meine.forEach((b) => {
        const s = SCHWERE_TEXT[b.schwere];
        const k = document.createElement("div");
        k.className = "karte";
        k.style.cssText = `margin-bottom:9px;border-left:3px solid ${s.farbe}`;
        const knoten = b.knoten ? KB.nodes.find((n) => n.id === b.knoten) : null;
        k.innerHTML = `
          <div style="display:flex;gap:9px;align-items:baseline;flex-wrap:wrap">
            <span class="chip" style="color:${s.farbe};border-color:${s.farbe}">${esc(s.label)}</span>
            <strong>${esc(b.titel)}</strong>
            <span class="klein gedaempft mono">${esc(b.regel)}</span>
          </div>
          <p style="margin:8px 0 0">${esc(b.text)}</p>
          ${knoten ? `<div class="klein" style="margin-top:8px">
            → <a href="#wissen/${esc(knoten.id)}">${esc(knoten.title)}</a> nachlesen</div>` : ""}`;
        app.appendChild(k);
      });
    }

    /* ---------------------------------------------------------- Grenzen */

    const gr = document.createElement("div");
    gr.className = "karte";
    gr.style.marginTop = "30px";
    gr.innerHTML = `<h2 style="margin-top:0;font-size:1rem">Was hier nicht geprüft wird</h2>
      <p class="klein gedaempft">Ein Prüfer, der seine Grenzen verschweigt, ist gefährlicher als
      keiner — ein leeres Ergebnis würde sonst als Freigabe gelesen.</p>
      <ul class="klein" style="margin:10px 0 0;padding-left:20px;line-height:1.65">
        ${e.grenzen.map((g) => `<li style="margin-bottom:5px">${esc(g)}</li>`).join("")}
      </ul>`;
    app.appendChild(gr);

    const quellen = document.createElement("p");
    quellen.className = "klein gedaempft";
    quellen.style.marginTop = "14px";
    quellen.innerHTML = `Die Regeln stehen in <span class="mono">web/dienstplan.js</span> und werden
      von <span class="mono">node tools/test-dienstplan.mjs</span> gegen Fälle geprüft, die auslösen
      müssen, und solche, die es nicht dürfen. Hintergrund in
      <a href="#wissen/arbeitsrecht-arbeitszeit">Arbeitszeit</a>,
      <a href="#wissen/arbeitsrecht-jugendarbeitsschutz">Jugendarbeitsschutz</a> und
      <a href="#wissen/arbeitsrecht-dienstplan-pruefer">Dienstplan prüfen — Regeln und Grenzen</a>.`;
    app.appendChild(quellen);
  }

  function dauerText(s) {
    if (!s.datum || !s.von || !s.bis) return "";
    const start = DP.hilfen.parseTs(s.datum, s.von);
    let ende = DP.hilfen.parseTs(s.datum, s.bis);
    if (ende <= start) ende += 86400000;
    const min = (ende - start) / 60000 - (Number(s.pause) || 0);
    return min > 0 ? DP.hilfen.std(min) : "—";
  }

  window.DIENSTPLAN_UI = { zeichnen };
})();
