/* =====================================================================
   einspeisen.js — Oberfläche für neues Wissen

   Der Weg eines Gedankens ins Archiv:

     1. Eintippen        hier, offline, ohne Vorbereitung
     2. Einordnen        rechnet kurator.js aus dem Bestand, live beim Tippen
     3. Ausformulieren   der Agent, mit dem hier erzeugten Auftrag
     4. Ablegen          als Datei unter content/, dann build und test

   Schritt 1 und 2 funktionieren immer. Schritt 3 ist Komfort — wer ihn
   auslässt, bekommt einen Entwurfsknoten mit TODO statt eines fertigen.
   Das ist der Unterschied zwischen einem Archiv, das eine Netzverbindung
   braucht, und einem, das sie nutzt, wenn es sie gibt.
   ===================================================================== */
(function () {
  "use strict";

  const KB = window.KB;
  const K = window.KURATOR;
  const esc = VIZ.esc;
  const SPEICHER = "wissensschatz.einspeisung";

  let index = null;                 // Bestandsindex, einmal gebaut
  let Z = laden();                  // Warteschlange
  let entwurf = { titel: "", text: "", quelle: "nutzer" };
  let letzte = null;                // letzte Analyse
  let timer = null;

  function laden() {
    try {
      const d = JSON.parse(localStorage.getItem(SPEICHER));
      if (Array.isArray(d)) return d;
    } catch { /* beschädigt — dann eben leer */ }
    return [];
  }
  function sichern() {
    try { localStorage.setItem(SPEICHER, JSON.stringify(Z)); }
    catch { melden("Speicher voll oder gesperrt — die Sammlung wurde nicht gesichert."); }
  }
  function melden(text) {
    const el = document.createElement("div");
    el.className = "meldung";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /** Text in die Zwischenablage, mit Rückfallweg für ältere Umgebungen. */
  async function kopieren(text, was) {
    try {
      await navigator.clipboard.writeText(text);
      melden(was + " kopiert.");
      return;
    } catch { /* weiter unten */ }
    const t = document.createElement("textarea");
    t.value = text;
    t.style.cssText = "position:fixed;top:-9999px";
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand("copy");
      melden(was + " kopiert.");
    } catch {
      melden("Kopieren nicht möglich — der Text steht unten zum Markieren.");
    }
    t.remove();
  }

  function herunterladen(name, inhalt) {
    const blob = new Blob([inhalt], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ------------------------------------------------------------ Zeichnen */

  function zeichnen(app) {
    if (!index) index = K.indexBauen(KB.nodes);
    app.innerHTML = "";

    const kopf = document.createElement("div");
    kopf.innerHTML = `<h1>Wissen einspeisen</h1>
      <p class="gedaempft" style="max-width:74ch">
        Rohtext eintippen — der Kurator rechnet beim Tippen aus dem vorhandenen Bestand,
        wohin er gehört, woran er anzuknüpfen ist und ob es ihn schon gibt.
        <strong>Die Maschine platziert, der Agent formuliert.</strong></p>
      <div class="hinweisbox" style="margin:14px 0 20px">
        Lieber unfertig erfassen als gar nicht. Ein Entwurf mit <span class="mono">&gt; TODO:</span>
        landet automatisch im Backlog unter <em>Lücken</em> und geht damit nicht verloren.
      </div>`;
    app.appendChild(kopf);

    /* ------------------------------------------------------- Eingabe */

    const eingabe = document.createElement("div");
    eingabe.className = "karte";
    eingabe.style.marginBottom = "16px";
    eingabe.innerHTML = `
      <div class="werkzeugleiste" style="margin-bottom:12px">
        <input type="text" id="e-titel" placeholder="Titel — worum geht es in einem Halbsatz?"
               value="${esc(entwurf.titel)}" style="flex:1;min-width:280px">
        <select id="e-quelle" style="width:auto">
          <option value="nutzer">eigene Erfahrung</option>
          <option value="gemischt">gemischt</option>
          <option value="ki">recherchiert / KI</option>
        </select>
      </div>
      <textarea id="e-text" rows="12" placeholder="Der eigentliche Inhalt. Ganze Sätze, kein Stichwortzettel — was hier steht, muss in fünf Jahren ohne die Erinnerung an heute verständlich sein.&#10;&#10;Ab etwa 60 Wörtern wird die Einordnung belastbar."
        style="width:100%;font:inherit;line-height:1.6;resize:vertical">${esc(entwurf.text)}</textarea>
      <div class="klein gedaempft" id="e-zaehler" style="margin-top:6px"></div>`;
    app.appendChild(eingabe);

    const titelEl = eingabe.querySelector("#e-titel");
    const textEl = eingabe.querySelector("#e-text");
    const quelleEl = eingabe.querySelector("#e-quelle");
    quelleEl.value = entwurf.quelle;

    const ergebnis = document.createElement("div");
    ergebnis.id = "e-ergebnis";
    app.appendChild(ergebnis);

    const anstossen = () => {
      entwurf.titel = titelEl.value;
      entwurf.text = textEl.value;
      entwurf.quelle = quelleEl.value;
      const w = entwurf.text.split(/\s+/).filter(Boolean).length;
      eingabe.querySelector("#e-zaehler").textContent =
        w ? `${w} Wörter${w < 60 ? " — ab etwa 60 wird die Einordnung belastbar" : ""}` : "";
      clearTimeout(timer);
      timer = setTimeout(() => auswerten(ergebnis), 350);
    };
    titelEl.addEventListener("input", anstossen);
    textEl.addEventListener("input", anstossen);
    quelleEl.addEventListener("change", anstossen);

    auswerten(ergebnis);
    sammlungZeichnen(app);
  }

  /* ----------------------------------------------------------- Auswertung */

  function auswerten(ziel) {
    ziel.innerHTML = "";
    if (!entwurf.text.trim()) {
      letzte = null;
      return;
    }
    const a = K.analysiere(entwurf, KB, index);
    letzte = a;

    /* Einordnung */
    const k = document.createElement("div");
    k.className = "karte";
    k.style.marginBottom = "14px";
    const farbe = KB.topicMeta[a.topic]?.color || "var(--ink-3)";
    const konfFarbe = a.konfidenz > 0.6 ? "var(--vz-gruen)" : a.konfidenz > 0.4 ? "var(--vz-orange)" : "var(--vz-rot)";

    // Bei fachfremdem Text darf das Thema nicht groß und selbstbewusst dastehen —
    // die Zahl ist dann ein Rechenergebnis ohne Aussage.
    if (a.fremd) {
      k.style.borderLeft = "3px solid var(--vz-rot)";
    }
    k.innerHTML = `
      <h2 style="margin-top:0;font-size:1.05rem">Einordnung</h2>
      <div class="raster k4" style="margin-bottom:14px">
        <div><div class="klein gedaempft">Themengebiet</div>
          ${a.fremd
            ? `<div style="font-weight:700;color:var(--vz-rot)">keine belastbare Zuordnung</div>
               <div class="klein gedaempft">nächster Knoten nur ${a.bestSim.toFixed(2)} — rechnerisch ${esc(a.topicLabel)}</div>`
            : `<div style="font-weight:700;color:${farbe}">${esc(a.topicLabel)}</div>
               <div class="klein" style="color:${konfFarbe}">${Math.round(a.konfidenz * 100)} % Konfidenz</div>`}</div>
        <div><div class="klein gedaempft">Pfad</div><div class="mono" style="font-size:.86rem">${esc(a.pfad)}</div></div>
        <div><div class="klein gedaempft">Stufe</div>
          <div><span class="chip stufe s${a.level}">${a.level}</span> ${esc(KB.levelNames[a.level])}</div></div>
        <div><div class="klein gedaempft">Typ / Kennung</div>
          <div class="mono" style="font-size:.86rem">${esc(a.typ)}<br>${esc(a.id)}</div></div>
      </div>
      <div class="klein gedaempft">Zieldatei <span class="mono">${esc(a.datei)}</span></div>`;
    ziel.appendChild(k);

    /* Duplikate zuerst — sie sind die wichtigste Auskunft */
    if (a.duplikate.length) {
      const d = document.createElement("div");
      d.className = "karte";
      const hart = a.duplikate.some((x) => x.stufe === "hart");
      d.style.cssText = `margin-bottom:14px;border-left:3px solid ${hart ? "var(--vz-rot)" : "var(--vz-orange)"}`;
      d.innerHTML = `<h2 style="margin-top:0;font-size:1.05rem">Gibt es das schon?</h2>
        <p class="klein gedaempft">Die Ähnlichkeit allein entscheidet das nicht — sie sagt nur, wo man nachsehen sollte.</p>
        ${a.duplikate.map((x) => `
          <div style="margin-top:10px;display:flex;gap:9px;align-items:baseline;flex-wrap:wrap">
            <span class="chip" style="color:${x.stufe === "hart" ? "var(--vz-rot)" : "var(--vz-orange)"};border-color:${x.stufe === "hart" ? "var(--vz-rot)" : "var(--vz-orange)"}">${x.sim.toFixed(2)}</span>
            <a href="#wissen/${esc(x.id)}"><strong>${esc(x.titel)}</strong></a>
            <span class="klein gedaempft mono">${esc(x.id)}</span>
          </div>
          <div class="klein gedaempft" style="margin-left:2px">${esc(x.rat)}</div>`).join("")}`;
      ziel.appendChild(d);
    }

    /* Anknüpfung */
    const v = document.createElement("div");
    v.className = "karte";
    v.style.marginBottom = "14px";
    const liste = (arr, leer) => arr.length
      ? arr.map((x) => `<a href="#wissen/${esc(x.id)}" class="chip" style="text-decoration:none">${esc(x.titel)}
          <span class="gedaempft mono" style="margin-left:5px">${x.sim.toFixed(2)}</span></a>`).join(" ")
      : `<span class="klein gedaempft">${leer}</span>`;
    const alleTags = [...new Set([...a.tags.uebernommen, ...a.tags.bekannt, ...a.tags.neu])];
    v.innerHTML = `<h2 style="margin-top:0;font-size:1.05rem">Anknüpfung an das Netz</h2>
      <div style="margin-bottom:12px"><div class="klein gedaempft" style="margin-bottom:5px">Voraussetzungen</div>
        ${liste(a.voraussetzungen, "keine gefunden — für eine höhere Stufe fehlt dann der Grundlagenknoten davor")}</div>
      <div style="margin-bottom:12px"><div class="klein gedaempft" style="margin-bottom:5px">Querverweise</div>
        ${liste(a.verwandt, "keine — der Text steht bisher allein")}</div>
      <div><div class="klein gedaempft" style="margin-bottom:5px">Tags</div>
        ${alleTags.length
          ? alleTags.map((t) => `<span class="chip"${a.tags.neu.includes(t) ? ' style="border-style:dashed"' : ""}>${esc(t)}</span>`).join(" ") +
            (a.tags.neu.length ? `<div class="klein gedaempft" style="margin-top:6px">Gestrichelt = im Bestand noch nicht vergeben. Neue Tags sparsam — driftende Tags zerlegen ein Archiv leise.</div>` : "")
          : '<span class="klein gedaempft">keine erkannt</span>'}</div>`;
    ziel.appendChild(v);

    /* Hinweise */
    if (a.hinweise.length) {
      const h = document.createElement("div");
      h.className = "karte";
      h.style.cssText = "margin-bottom:14px;border-left:3px solid var(--vz-blau)";
      h.innerHTML = `<h2 style="margin-top:0;font-size:1.05rem">Was dem Kurator auffällt</h2>
        <ul class="klein" style="margin:0;padding-left:20px;line-height:1.7">
          ${a.hinweise.map((x) => `<li style="margin-bottom:4px">${esc(x)}</li>`).join("")}</ul>`;
      ziel.appendChild(h);
    }

    /* Handeln */
    const w = document.createElement("div");
    w.className = "werkzeugleiste";
    w.style.marginTop = "18px";
    w.innerHTML = `
      <button class="knopf haupt" id="e-auftrag">Agentenauftrag kopieren</button>
      <button class="knopf" id="e-datei">Als Knoten speichern</button>
      <button class="knopf" id="e-knoten">Knoten kopieren</button>
      <button class="knopf" id="e-sammeln">In die Sammlung</button>
      <button class="knopf klein" id="e-leeren">Eingabe leeren</button>`;
    ziel.appendChild(w);

    const p = document.createElement("p");
    p.className = "klein gedaempft";
    p.style.marginTop = "10px";
    p.innerHTML = `<strong>Agentenauftrag</strong> enthält die Rohnotiz, die berechnete Einordnung und die
      Hausregeln — er ist so gebaut, dass ein Sprachmodell daraus einen fertigen Knoten machen kann,
      ohne das Archiv erst zu durchsuchen. <strong>Als Knoten speichern</strong> legt die Datei mit
      vollständigem Frontmatter und einer TODO-Marke an; sie gehört nach
      <span class="mono">${esc(a.datei)}</span>, danach <span class="mono">node tools/build.mjs</span>.`;
    ziel.appendChild(p);

    w.querySelector("#e-auftrag").addEventListener("click", () =>
      kopieren(K.agentenauftrag(entwurf, a, KB), "Agentenauftrag"));
    w.querySelector("#e-knoten").addEventListener("click", () =>
      kopieren(K.alsKnoten(entwurf, a), "Knoten"));
    w.querySelector("#e-datei").addEventListener("click", () =>
      herunterladen(a.datei.split("/").pop(), K.alsKnoten(entwurf, a)));
    w.querySelector("#e-sammeln").addEventListener("click", () => {
      Z.unshift({ ...entwurf, angelegt: new Date().toISOString().slice(0, 16).replace("T", " "), ziel: a.datei, topic: a.topic });
      sichern();
      entwurf = { titel: "", text: "", quelle: entwurf.quelle };
      zeichnen(document.getElementById("app"));
      melden("In die Sammlung übernommen.");
    });
    w.querySelector("#e-leeren").addEventListener("click", () => {
      entwurf = { titel: "", text: "", quelle: entwurf.quelle };
      zeichnen(document.getElementById("app"));
    });
  }

  /* ----------------------------------------------------------- Sammlung */

  function sammlungZeichnen(app) {
    const s = document.createElement("div");
    s.style.marginTop = "34px";
    s.innerHTML = `<h2>Sammlung <span class="gedaempft" style="font-weight:400">(${Z.length})</span></h2>
      <p class="gedaempft klein" style="max-width:70ch">Noch nicht abgelegte Einträge, im Browser gespeichert.
      Sie liegen <strong>nicht</strong> im Archiv, solange sie nicht als Datei unter
      <span class="mono">content/</span> stehen — der Browser darf dort nicht schreiben.
      Vor einem Gerätewechsel also exportieren.</p>`;
    app.appendChild(s);

    if (!Z.length) {
      const leer = document.createElement("div");
      leer.className = "karte gedaempft klein";
      leer.textContent = "Nichts gesammelt.";
      app.appendChild(leer);
      return;
    }

    Z.forEach((e, i) => {
      const k = document.createElement("div");
      k.className = "karte";
      k.style.marginBottom = "8px";
      const farbe = KB.topicMeta[e.topic]?.color || "var(--ink-3)";
      k.innerHTML = `
        <div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap">
          <strong>${esc(e.titel || "Ohne Titel")}</strong>
          <span class="chip" style="color:${farbe};border-color:${farbe}">${esc(KB.topicMeta[e.topic]?.label || e.topic || "—")}</span>
          <span class="klein gedaempft">${esc(e.angelegt)} · ${e.text.split(/\s+/).filter(Boolean).length} Wörter</span>
          <span style="margin-left:auto;display:flex;gap:6px">
            <button class="knopf klein" data-holen="${i}">Bearbeiten</button>
            <button class="knopf klein" data-weg="${i}">Entfernen</button>
          </span>
        </div>
        <div class="klein gedaempft" style="margin-top:6px">${esc(e.text.slice(0, 180))}${e.text.length > 180 ? " …" : ""}</div>`;
      k.querySelector("[data-holen]").addEventListener("click", () => {
        entwurf = { titel: e.titel, text: e.text, quelle: e.quelle };
        Z.splice(i, 1); sichern();
        zeichnen(document.getElementById("app"));
        window.scrollTo(0, 0);
      });
      k.querySelector("[data-weg]").addEventListener("click", () => {
        Z.splice(i, 1); sichern(); zeichnen(document.getElementById("app"));
      });
      app.appendChild(k);
    });

    const w = document.createElement("div");
    w.className = "werkzeugleiste";
    w.style.marginTop = "14px";
    w.innerHTML = `<button class="knopf" id="e-export">Sammlung exportieren</button>
      <button class="knopf klein" id="e-alle-auftraege">Aufträge für alle kopieren</button>`;
    app.appendChild(w);

    w.querySelector("#e-export").addEventListener("click", () => {
      const teile = Z.map((e) => {
        const a = K.analysiere(e, KB, index);
        return `<!-- ${a.datei} -->\n${K.alsKnoten(e, a)}`;
      });
      herunterladen(`einspeisung-${new Date().toISOString().slice(0, 10)}.md`,
        `<!-- ${Z.length} Einträge. Je Eintrag den Block in die genannte Datei übernehmen,\n` +
        `     oder: node tools/kuratieren.mjs --datei diese-datei.md --schreiben -->\n\n` +
        teile.join("\n\n"));
    });
    w.querySelector("#e-alle-auftraege").addEventListener("click", () => {
      const t = Z.map((e, i) => `### Eintrag ${i + 1} von ${Z.length}\n\n` +
        K.agentenauftrag(e, K.analysiere(e, KB, index), KB)).join("\n\n---\n\n");
      kopieren(t, `${Z.length} Aufträge`);
    });
  }

  window.EINSPEISEN = { zeichnen };
})();
