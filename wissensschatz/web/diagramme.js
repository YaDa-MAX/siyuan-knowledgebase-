/* =====================================================================
   diagramme.js — Fachgrafiken

   Jede Grafik zeigt einen Mechanismus, nicht eine Dekoration: Sie soll
   etwas sichtbar machen, das im Fließtext erklärt werden müsste.

   Regeln, damit alles zusammenpasst und lange hält:
   · Reines SVG, keine Bibliothek, keine Netzanfrage.
   · Neutraler Text und neutrale Linien mit `currentColor`; alles Farbige
     über die `--vz-*`-Variablen aus app.css. Beides schaltet auf dunkel
     mit um — ein fester Hexwert wäre dort entweder blass oder unlesbar.
   · `viewBox` statt fester Größe.
   · Beschriftung im Bild statt in einer Legende, wo es geht.
   Registriert werden sie unten in VIZ.benannt und mit
   `::: viz <name>` in einen Knoten eingebunden.
   ===================================================================== */
(function () {
  "use strict";

  const esc = VIZ.esc;
  const KB = window.KB;

  /** Rahmen für jede Grafik: figure + SVG + Bildunterschrift. */
  function figur(viewBox, inhalt, beschriftung, label) {
    const f = document.createElement("figure");
    f.className = "viz";
    f.innerHTML =
      `<svg viewBox="${viewBox}" role="img" aria-label="${esc(label || beschriftung || "")}"
            style="font-family:inherit;overflow:visible">${inhalt}</svg>` +
      (beschriftung ? `<figcaption>${beschriftung}</figcaption>` : "");
    return f;
  }

  const txt = (x, y, s, opt = {}) =>
    `<text x="${x}" y="${y}" font-size="${opt.size || 11}" fill="${opt.fill || "currentColor"}"
       text-anchor="${opt.anchor || "start"}" font-weight="${opt.weight || 400}"
       opacity="${opt.op ?? 1}"${opt.rot ? ` transform="rotate(${opt.rot} ${x} ${y})"` : ""}>${esc(s)}</text>`;

  const rechteck = (x, y, b, h, opt = {}) =>
    `<rect x="${x}" y="${y}" width="${b}" height="${h}" rx="${opt.r ?? 5}"
       fill="${opt.fill || "none"}" stroke="${opt.stroke || "none"}"
       stroke-width="${opt.sw || 1}" opacity="${opt.op ?? 1}"${opt.dash ? ` stroke-dasharray="${opt.dash}"` : ""}></rect>`;

  const linie = (x1, y1, x2, y2, opt = {}) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${opt.stroke || "currentColor"}"
       stroke-width="${opt.sw || 1}" opacity="${opt.op ?? 0.35}"${opt.dash ? ` stroke-dasharray="${opt.dash}"` : ""}
       ${opt.marker ? `marker-end="url(#${opt.marker})"` : ""}></line>`;

  const PFEIL = `<defs>
    <marker id="pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity=".55"></path>
    </marker>
    <marker id="pfeilAkzent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--vz-braun)"></path>
    </marker>
  </defs>`;

  /* ============================================ 1 · Bajonett-Auflagemaße */

  function bajonettSkala() {
    const ds = (KB.datasets || {})["kamera-bajonette"];
    if (!ds) return figur("0 0 10 10", "", "Datensatz kamera-bajonette fehlt.");

    const farbe = {
      spiegellos: "var(--vz-blau)", DSLR: "var(--vz-braun)", "SLR": "var(--vz-braun)", "DSLR / SLT": "var(--vz-braun)",
      "SLR / DSLR": "var(--vz-braun)", Messsucher: "var(--vz-tuerkis)", Kino: "var(--vz-grau)",
      Mittelformat: "var(--vz-lila)", "Mittelformat-DSLR": "var(--vz-lila)",
    };

    const B = 900, links = 60, rechts = 40;
    const skalaB = B - links - rechts;
    const maxFd = 80;
    const x = (fd) => links + (fd / maxFd) * skalaB;
    const zeilH = 15, kopf = 74;

    const punkte = [...ds.items].sort((a, b) => a.fd - b.fd);

    // Klammerzusätze und Zweitnamen weg, sobald es eng wird — der vollständige
    // Name steht in der Kurzinfo am Punkt und in der Tabelle darunter.
    const kurz = (name) => {
      const ohneKlammer = name.replace(/\s*\([^)]*\)/g, "").trim();
      return ohneKlammer.length > 16 ? ohneKlammer.replace(/ \/ .*$/, "") : ohneKlammer;
    };

    /*
     * Beschriftungen in Spuren legen, statt sie starr abwechselnd zu setzen.
     * Zwischen 38 und 47 mm liegen zwölf Bajonette auf acht Prozent der Achse;
     * ihre Namen sind um ein Vielfaches breiter als ihr Abstand. Wer hier nur
     * alterniert, erzeugt genau in der interessantesten Zone Buchstabenbrei.
     */
    const beschriftungen = punkte.map((p) => {
      const t = `${kurz(p.mount)}  ${p.fd}`;
      return { p, t, breite: t.length * 5.35 + 14, px: x(p.fd) };
    });

    const spurEnde = { oben: [], unten: [] };
    beschriftungen.forEach((b, i) => {
      // Rechtsbündig, wo der Text sonst über den Rand liefe
      b.rechtsbuendig = b.px + b.breite > B - 6;
      const kante = b.rechtsbuendig ? b.px - b.breite : b.px;
      b.seite = i % 2 === 0 ? "oben" : "unten";
      const enden = spurEnde[b.seite];
      let spur = enden.findIndex((ende) => kante > ende);
      if (spur === -1) { spur = enden.length; enden.push(0); }
      enden[spur] = kante + b.breite;
      b.spur = spur;
    });

    const spurenOben = Math.max(1, spurEnde.oben.length);
    const spurenUnten = Math.max(1, spurEnde.unten.length);
    const achseY = kopf + spurenOben * zeilH + 10;
    const H = achseY + 72 + spurenUnten * zeilH + 14;

    let s = PFEIL;

    // Adaptionsband
    s += rechteck(x(0), 26, x(28) - x(0), achseY + 26 - 26, { fill: "var(--vz-blau)", op: 0.07, r: 8 });
    s += txt(x(14), 46, "spiegellose Systeme", { anchor: "middle", weight: 700, fill: "var(--vz-blau)", size: 12 });
    s += txt(x(14), 61, "16–28 mm — nehmen praktisch jedes Objektiv auf", { anchor: "middle", fill: "var(--vz-blau)", size: 10, op: 0.85 });

    // Achse
    s += linie(links, achseY, B - rechts, achseY, { op: 0.5, sw: 1.5 });
    for (let v = 0; v <= maxFd; v += 10) {
      s += linie(x(v), achseY, x(v), achseY + 6, { op: 0.5 });
      s += txt(x(v), achseY + 20, String(v), { anchor: "middle", size: 10, op: 0.6 });
    }
    s += txt(B - rechts, achseY + 40, "Auflagemaß in mm", { anchor: "end", size: 11, op: 0.7 });

    // Adaptionsrichtung
    s += linie(x(70), achseY + 52, x(6), achseY + 52, { stroke: "var(--vz-braun)", sw: 2, op: 0.9, marker: "pfeilAkzent" });
    s += txt(x(38), achseY + 45, "ein Objektiv lässt sich nur nach links adaptieren", {
      anchor: "middle", size: 11.5, weight: 600, fill: "var(--vz-braun)" });

    // Punkte und Beschriftungen
    beschriftungen.forEach((b) => {
      const f = farbe[b.p.typ] || "var(--vz-grau)";
      const oben = b.seite === "oben";
      const y = oben ? achseY - 18 - b.spur * zeilH : achseY + 72 + b.spur * zeilH;

      s += linie(b.px, achseY, b.px, oben ? y + 4 : y - 9, { stroke: f, op: 0.35 });
      s += `<circle cx="${b.px}" cy="${achseY}" r="4.5" fill="${f}" opacity=".95"><title>${esc(b.p.mount)} — ${b.p.fd} mm, Ø ${b.p.dia} mm, ${esc(b.p.sensor)}</title></circle>`;
      s += txt(b.rechtsbuendig ? b.px - 6 : b.px + 6, y, b.t,
        { size: 10, fill: f, weight: oben ? 600 : 400, anchor: b.rechtsbuendig ? "end" : "start" });
    });

    return figur(`0 0 ${B} ${H}`, s,
      "Jeder Punkt ist ein Bajonett auf der Achse seines Auflagemaßes. Ein Objektiv passt nur an eine Kamera <strong>links davon</strong> — der Adapter füllt genau die Differenz auf. Deshalb nehmen spiegellose Systeme fast alles auf und geben fast nichts ab.",
      "Bajonette nach Auflagemaß, mit der Richtung der Adaptierbarkeit");
  }

  /* ============================================== 2 · Arbeitszeit am Tag */

  function arbeitszeitTag() {
    const B = 900, links = 175, rechts = 30;
    const von = 12, bis = 38;                       // 12:00 Tag 1 bis 14:00 Tag 2
    const skalaB = B - links - rechts;
    const x = (h) => links + ((h - von) / (bis - von)) * skalaB;
    const zeilH = 62, kopf = 46;

    const faelle = [
      { t: "Erwachsene, allgemein", ende: 22.5, ruhe: 11, farbe: "var(--vz-blau)",
        hinweis: "11 h Ruhezeit (§ 5 Abs. 1 ArbZG)" },
      { t: "Gastgewerbe", ende: 22.5, ruhe: 10, farbe: "var(--vz-braun)",
        hinweis: "10 h zulässig — nur mit Ausgleich auf 12 h (§ 5 Abs. 2)" },
      { t: "Jugendliche ab 16", ende: 22, ruhe: 12, farbe: "var(--vz-rot)",
        hinweis: "Ende spätestens 22:00, danach 12 h Freizeit (§§ 13, 14 JArbSchG)" },
    ];

    const zeit = (h) => {
      const hh = Math.floor(h % 24), mm = Math.round((h % 1) * 60);
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };

    let s = PFEIL;

    // Stundenraster
    for (let h = Math.ceil(von); h <= bis; h += 2) {
      const mitternacht = h % 24 === 0;
      s += linie(x(h), kopf - 12, x(h), kopf + faelle.length * zeilH - 6,
        { op: mitternacht ? 0.4 : 0.12, dash: mitternacht ? "" : "2 4", sw: mitternacht ? 1.5 : 1 });
      s += txt(x(h), kopf - 18, zeit(h), { anchor: "middle", size: 9.5, op: mitternacht ? 0.8 : 0.45 });
    }
    s += txt(x(24), 18, "Mitternacht", { anchor: "middle", size: 10, op: 0.7, weight: 600 });

    faelle.forEach((f, i) => {
      const y = kopf + i * zeilH;
      const start = 14;                                    // Spätdienst 14:00
      const naechster = f.ende + f.ruhe;

      s += txt(0, y + 16, f.t, { size: 12, weight: 700 });
      s += txt(0, y + 31, f.hinweis, { size: 9.5, op: 0.6 });

      // Dienst
      s += rechteck(x(start), y, x(f.ende) - x(start), 24, { fill: f.farbe, op: 0.85, r: 4 });
      s += txt((x(start) + x(f.ende)) / 2, y + 16, `Dienst  ${zeit(start)}–${zeit(f.ende)}`,
        { anchor: "middle", size: 10, fill: "#fff", weight: 600 });

      // Ruhezeit
      s += rechteck(x(f.ende), y, x(naechster) - x(f.ende), 24,
        { fill: "currentColor", op: 0.09, r: 4, stroke: "currentColor", sw: 1, dash: "4 3" });
      s += txt((x(f.ende) + x(naechster)) / 2, y + 16, `${f.ruhe} h Ruhezeit`,
        { anchor: "middle", size: 10, op: 0.75, weight: 600 });

      // Frühester nächster Dienstbeginn
      s += linie(x(naechster), y - 6, x(naechster), y + 34, { stroke: f.farbe, sw: 2, op: 0.9 });
      s += txt(x(naechster) + 6, y + 34, `frühestens ${zeit(naechster)}`,
        { size: 10.5, fill: f.farbe, weight: 700 });
    });

    return figur(`0 0 ${B} ${kopf + faelle.length * zeilH + 16}`, s,
      "Derselbe Spätdienst, drei Regelwerke. Die Ruhezeit bestimmt, wann der nächste Dienst frühestens beginnen darf — im Gastgewerbe eine Stunde früher als sonst, bei Jugendlichen eine Stunde später. Die verkürzte Ruhezeit ist nur mit dokumentiertem Ausgleich zulässig.",
      "Zeitachse mit Dienst, Ruhezeit und frühestem nächsten Dienstbeginn für drei Personengruppen");
  }

  /* ==================================================== 3 · Sternschema */

  function sternschema() {
    const B = 760, H = 440, mx = B / 2, my = H / 2 + 6;
    const fw = 190, fh = 96;

    const dims = [
      { t: "Kalender", z: ["Datum", "Jahr", "Monat", "ISO-Woche"], w: -90 },
      { t: "Zimmer", z: ["ZimmerID", "Kategorie", "Etage"], w: -20 },
      { t: "Gast", z: ["GastID", "Land", "Segment"], w: 200 },
      { t: "Kanal", z: ["KanalID", "Typ", "Provision"], w: 160 },
    ];
    const pos = [
      { x: mx - 285, y: 26 }, { x: mx + 95, y: 26 },
      { x: mx - 285, y: H - 140 }, { x: mx + 95, y: H - 140 },
    ];

    let s = PFEIL;

    // Faktentabelle
    s += rechteck(mx - fw / 2, my - fh / 2, fw, fh, { fill: "var(--vz-braun)", op: 0.14, r: 8, stroke: "var(--vz-braun)", sw: 1.5 });
    s += txt(mx, my - fh / 2 + 20, "Faktentabelle", { anchor: "middle", size: 13, weight: 700, fill: "var(--vz-braun)" });
    s += txt(mx, my - fh / 2 + 36, "Buchungen", { anchor: "middle", size: 11, op: 0.75 });
    ["DatumID · ZimmerID · GastID · KanalID", "Betrag · Nächte · Gäste"].forEach((z, i) =>
      s += txt(mx, my - fh / 2 + 56 + i * 15, z, { anchor: "middle", size: 9.5, op: 0.65 }));
    // Der Zusatz gehört in die Box: außerhalb säße er genau auf den
    // „1 : n"-Marken der beiden unteren Beziehungen.
    s += txt(mx, my + fh / 2 - 8, "viele Zeilen · wenige Spalten",
      { anchor: "middle", size: 9.5, op: 0.5 });

    // Dimensionen
    dims.forEach((d, i) => {
      const p = pos[i], dw = 190, dh = 34 + d.z.length * 14;
      s += rechteck(p.x, p.y, dw, dh, { fill: "var(--vz-blau)", op: 0.1, r: 8, stroke: "var(--vz-blau)", sw: 1.2 });
      s += txt(p.x + 12, p.y + 21, d.t, { size: 12, weight: 700, fill: "var(--vz-blau)" });
      d.z.forEach((z, j) => s += txt(p.x + 12, p.y + 38 + j * 14, z, { size: 9.5, op: 0.6 }));

      // Beziehung zur Faktentabelle
      const cx = p.x + dw / 2, cy = p.y + dh / 2;
      const dx = mx - cx, dy = my - cy, len = Math.hypot(dx, dy);
      const x1 = cx + (dx / len) * (dw / 2.1), y1 = cy + (dy / len) * (dh / 1.9);
      const x2 = mx - (dx / len) * (fw / 2.1), y2 = my - (dy / len) * (fh / 2.1);
      s += linie(x1, y1, x2, y2, { sw: 1.6, op: 0.5, marker: "pfeil" });
      s += txt((x1 + x2) / 2 + (dx > 0 ? 8 : -8), (y1 + y2) / 2 - 5, "1 : n",
        { anchor: dx > 0 ? "start" : "end", size: 9.5, op: 0.7, weight: 600 });
    });

    s += txt(mx, H - 12, "Pfeile = Richtung des Filterflusses: Dimensionen filtern den Fakt, nicht umgekehrt",
      { anchor: "middle", size: 10.5, op: 0.7 });

    return figur(`0 0 ${B} ${H}`, s,
      "Die Faktentabelle in der Mitte trägt Schlüssel und Kennzahlen, die Dimensionen ringsum die beschreibenden Merkmale. Alle Beziehungen sind 1:n und filtern in eine Richtung. Ein Modell, das in dieser Form nicht erkennbar ist, erzeugt die DAX-Probleme, die drei Wochen später auftauchen.",
      "Sternschema mit zentraler Faktentabelle und vier Dimensionstabellen");
  }

  /* ============================================== 4 · Auflage und Kosten */

  function auflagenkurve() {
    const B = 760, H = 380, links = 62, unten = 56, oben = 26, rechts = 24;
    const bw = B - links - rechts, hh = H - unten - oben;

    const nMin = 25, nMax = 5000;
    const yMax = 3.0;
    const lx = (n) => links + ((Math.log10(n) - Math.log10(nMin)) / (Math.log10(nMax) - Math.log10(nMin))) * bw;
    const ly = (p) => oben + hh - (Math.min(p, yMax) / yMax) * hh;

    /*
     * Vereinfachte Modelle: Fixkosten/Auflage + variable Stückkosten.
     * Die Fixkosten sind so gewählt, dass sich die Kurven bei 1000 Exemplaren
     * schneiden — dieselbe Zahl, die im Knotentext und auf der Lernkarte steht.
     * Eine Grafik, die der Nachbarzeile widerspricht, kostet mehr Vertrauen,
     * als die zweite Nachkommastelle wert ist.
     */
    const digital = (n) => 0.42 - 0.05 * Math.log10(n);
    const offset = (n) => 215 / n + 0.055;

    // Was über die Skala hinausgeht, wird ausgelassen statt am oberen Rand
    // entlanggeführt — eine waagerechte Linie bei 3,00 € wäre schlicht falsch.
    const pfad = (fn) => {
      let d = "", offen = false;
      for (let i = 0; i <= 160; i++) {
        const n = nMin * Math.pow(nMax / nMin, i / 160);
        const p = fn(n);
        if (p > yMax) { offen = false; continue; }
        d += (offen ? "L" : "M") + lx(n) + "," + ly(p);
        offen = true;
      }
      return d;
    };

    let s = PFEIL;

    // Achsen
    s += linie(links, oben, links, oben + hh, { op: 0.45 });
    s += linie(links, oben + hh, links + bw, oben + hh, { op: 0.45 });
    [25, 100, 500, 1000, 2500, 5000].forEach((n) => {
      s += linie(lx(n), oben + hh, lx(n), oben + hh + 5, { op: 0.4 });
      s += txt(lx(n), oben + hh + 19, n.toLocaleString("de-DE"), { anchor: "middle", size: 10, op: 0.6 });
    });
    [0, 1, 2, 3].forEach((p) => {
      s += linie(links - 5, ly(p), links + bw, ly(p), { op: p ? 0.1 : 0.4, dash: p ? "3 4" : "" });
      s += txt(links - 9, ly(p) + 4, p.toFixed(2).replace(".", ",") + " €", { anchor: "end", size: 10, op: 0.6 });
    });
    s += txt(links + bw / 2, oben + hh + 40, "Auflage (logarithmisch)", { anchor: "middle", size: 11, op: 0.7 });
    s += txt(14, oben + hh / 2, "Kosten je Exemplar", { anchor: "middle", size: 11, op: 0.7, rot: -90 });

    // Schnittpunkt numerisch bestimmen
    let kreuz = nMin;
    for (let i = 0; i <= 400; i++) {
      const n = nMin * Math.pow(nMax / nMin, i / 400);
      if (offset(n) <= digital(n)) { kreuz = n; break; }
    }

    s += rechteck(lx(kreuz), oben, links + bw - lx(kreuz), hh, { fill: "var(--vz-gruen)", op: 0.06, r: 0 });
    s += linie(lx(kreuz), oben, lx(kreuz), oben + hh, { stroke: "var(--vz-gruen)", sw: 1.5, op: 0.8, dash: "5 4" });
    s += txt(lx(kreuz) + 8, oben + 16, `ab rund ${Math.round(kreuz / 50) * 50} Exemplaren`, { size: 11, weight: 700, fill: "var(--vz-gruen)" });
    s += txt(lx(kreuz) + 8, oben + 31, "wird Offset günstiger", { size: 10.5, fill: "var(--vz-gruen)", op: 0.85 });

    s += `<path d="${pfad(offset)}" fill="none" stroke="var(--vz-lila)" stroke-width="2.4"></path>`;
    s += `<path d="${pfad(digital)}" fill="none" stroke="var(--vz-blau)" stroke-width="2.4"></path>`;

    // Kurvenbeschriftung rechts neben die jeweilige Linie, wo Platz ist
    s += txt(lx(150) + 14, ly(offset(150)) - 4, "Offset", { size: 12, weight: 700, fill: "var(--vz-lila)" });
    s += txt(lx(150) + 14, ly(offset(150)) + 11, "hohe Einrichtkosten", { size: 9.5, fill: "var(--vz-lila)", op: 0.85 });
    s += txt(lx(55), ly(digital(55)) - 26, "Digitaldruck", { size: 12, weight: 700, fill: "var(--vz-blau)" });
    s += txt(lx(55), ly(digital(55)) - 12, "praktisch keine Einrichtkosten", { size: 9.5, fill: "var(--vz-blau)", op: 0.85 });

    return figur(`0 0 ${B} ${H}`, s,
      "Schematischer Verlauf, keine Preisliste: Offset verteilt hohe Einrichtkosten (Platten, Einrichten) auf die Auflage, Digitaldruck hat praktisch keine. Deshalb ist die <strong>Auflage das erste Auswahlkriterium</strong> — nicht die Qualität. Der Schnittpunkt verschiebt sich mit Format, Farbigkeit und Papier.",
      "Kostenkurven von Offset und Digitaldruck über der Auflage mit Schnittpunkt");
  }

  /* ================================================= 5 · Eisenhower */

  function eisenhower() {
    const B = 640, H = 400, links = 108, oben = 44;
    const zw = (B - links - 20) / 2, zh = (H - oben - 46) / 2;

    const felder = [
      { sp: 0, ze: 0, t: "Sofort erledigen", u: "Krise, Frist, Störfall", f: "var(--vz-rot)" },
      { sp: 1, ze: 0, t: "Hier entsteht Führung", u: "Entwicklung, Planung,\nGespräche, Prävention", f: "var(--vz-gruen)", stark: true },
      { sp: 0, ze: 1, t: "Delegieren", u: "Unterbrechung, Routine,\nfremde Dringlichkeit", f: "var(--vz-orange)" },
      { sp: 1, ze: 1, t: "Streichen", u: "Zeitfüller, Berichte,\ndie niemand liest", f: "var(--vz-grau)" },
    ];

    let s = PFEIL;
    s += txt(links + zw / 2, oben - 14, "dringend", { anchor: "middle", size: 12, weight: 700, op: 0.75 });
    s += txt(links + zw * 1.5, oben - 14, "nicht dringend", { anchor: "middle", size: 12, weight: 700, op: 0.75 });
    s += txt(links - 14, oben + zh / 2, "wichtig", { anchor: "middle", size: 12, weight: 700, op: 0.75, rot: -90 });
    s += txt(links - 14, oben + zh * 1.5, "nicht wichtig", { anchor: "middle", size: 12, weight: 700, op: 0.75, rot: -90 });

    felder.forEach((f) => {
      const x = links + f.sp * zw, y = oben + f.ze * zh;
      s += rechteck(x + 4, y + 4, zw - 8, zh - 8, {
        fill: f.f, op: f.stark ? 0.16 : 0.07, r: 8,
        stroke: f.f, sw: f.stark ? 2 : 1, dash: f.stark ? "" : "",
      });
      s += txt(x + zw / 2, y + 34, f.t, { anchor: "middle", size: 13, weight: 700, fill: f.f });
      f.u.split("\n").forEach((z, i) =>
        s += txt(x + zw / 2, y + 56 + i * 15, z, { anchor: "middle", size: 10.5, op: 0.65 }));
    });

    const zx = links + zw * 1.5, zy = oben + zh - 26;
    s += txt(zx, zy, "meldet sich nie von selbst", { anchor: "middle", size: 11, weight: 700, fill: "var(--vz-gruen)" });
    s += txt(zx, zy + 15, "→ fester Termin im Kalender", { anchor: "middle", size: 10, fill: "var(--vz-gruen)", op: 0.85 });

    return figur(`0 0 ${B} ${H}`, s,
      "Drei der vier Felder melden sich von allein — durch Anrufe, Fristen und Menschen an der Tür. Das vierte nicht. Deshalb ist es das einzige, das einen geschützten Termin braucht.",
      "Eisenhower-Matrix mit hervorgehobenem Feld wichtig und nicht dringend");
  }

  /* ============================================ 6 · Konflikteskalation */

  function glaslEskalation() {
    const B = 800, H = 430, links = 34, oben = 40;
    const stufen = [
      "Verhärtung", "Debatte und Polemik", "Taten statt Worte",
      "Images und Koalitionen", "Gesichtsverlust", "Drohstrategien",
      "begrenzte Vernichtung", "Zersplitterung", "gemeinsam in den Abgrund",
    ];
    const ebenen = [
      { von: 0, bis: 2, t: "win / win", f: "var(--vz-gruen)", hilfe: "Die Beteiligten lösen es selbst.\nModeriertes Gespräch genügt." },
      { von: 3, bis: 5, t: "win / lose", f: "var(--vz-orange)", hilfe: "Es geht nicht mehr um die Sache.\nExterne Vermittlung nötig." },
      { von: 6, bis: 8, t: "lose / lose", f: "var(--vz-rot)", hilfe: "Eigener Schaden wird in Kauf genommen.\nMachteingriff: Trennung, Versetzung." },
    ];

    const stufeH = 38, breite = 330;
    let s = PFEIL;

    ebenen.forEach((e) => {
      const y0 = oben + e.von * stufeH;
      const hh = (e.bis - e.von + 1) * stufeH;
      s += rechteck(links - 8, y0 - 4, breite + 16, hh, { fill: e.f, op: 0.07, r: 8 });
      s += txt(links + breite + 34, y0 + 20, e.t, { size: 13, weight: 700, fill: e.f });
      e.hilfe.split("\n").forEach((z, i) =>
        s += txt(links + breite + 34, y0 + 40 + i * 15, z, { size: 10.5, op: 0.7 }));
    });

    stufen.forEach((t, i) => {
      const y = oben + i * stufeH;
      const einzug = i * 12;
      s += rechteck(links + einzug, y, breite - einzug, stufeH - 8, {
        fill: ebenen.find((e) => i >= e.von && i <= e.bis).f, op: 0.18, r: 5 });
      s += txt(links + einzug + 10, y + 20, `${i + 1}  ${t}`, { size: 11.5, weight: 600 });
    });

    s += linie(links - 20, oben, links - 20, oben + 9 * stufeH - 8, { sw: 2, op: 0.4, marker: "pfeil" });
    s += txt(links - 26, oben + 4.5 * stufeH, "Eskalation", { anchor: "middle", size: 10.5, op: 0.6, rot: -90 });

    return figur(`0 0 ${B} ${H}`, s,
      "Neun Stufen in drei Ebenen nach Glasl. Die Kenntnis der Stufe bestimmt die richtige Maßnahme — ein Appell an die Vernunft läuft ab Stufe 5 ins Leere. Frühe Konflikte kosten eine halbe Stunde Gespräch, späte kosten Personal.",
      "Neunstufiges Modell der Konflikteskalation mit drei Ebenen und passender Intervention");
  }

  /* ============================================== 7 · Werkzeugleiter */

  function werkzeugleiter() {
    const B = 820, H = 430, links = 30, unten = 40;
    const stufen = [
      { n: 0, t: "Vorlage, Textbaustein, Checkliste", f: "var(--vz-gruen)" },
      { n: 1, t: "Formeln, Datenvalidierung, bedingte Formatierung", f: "var(--vz-gruen)" },
      { n: 2, t: "Power Query — Import und Aufbereitung", f: "var(--vz-tuerkis)" },
      { n: 3, t: "Makros, Office Scripts, Skripte", f: "var(--vz-tuerkis)" },
      { n: 4, t: "Workflow-Dienste (Power Automate, n8n)", f: "var(--vz-blau)" },
      { n: 5, t: "Low-Code-Anwendungen", f: "var(--vz-blau)" },
      { n: 6, t: "RPA — Oberflächen steuern", f: "var(--vz-orange)" },
      { n: 7, t: "API-Integration", f: "var(--vz-orange)" },
      { n: 8, t: "Dokumenten-KI / OCR", f: "var(--vz-lila)" },
      { n: 9, t: "Sprachmodelle und Agenten", f: "var(--vz-lila)" },
      { n: 10, t: "Fachsystem, individuelle Entwicklung", f: "var(--vz-rot)" },
    ];

    const h = (H - unten - 30) / stufen.length;
    let s = PFEIL;

    stufen.forEach((st, i) => {
      const y = H - unten - (i + 1) * h;
      const b = 210 + i * 40;
      s += rechteck(links, y, b, h - 4, { fill: st.f, op: 0.14, r: 4, stroke: st.f, sw: 1 });
      s += txt(links + 10, y + h / 2 + 1, `${st.n}`, { size: 11, weight: 700, fill: st.f });
      s += txt(links + 32, y + h / 2 + 1, st.t, { size: 11 });
    });

    const rx = links + 660;
    s += linie(rx, H - unten - 6, rx, 24, { sw: 2, op: 0.45, marker: "pfeil" });
    s += txt(rx + 10, 36, "mehr Möglichkeiten", { size: 11, weight: 700, op: 0.8 });
    s += txt(rx + 10, 51, "mehr Abhängigkeit", { size: 10.5, op: 0.6 });
    s += txt(rx + 10, 66, "mehr laufende Pflege", { size: 10.5, op: 0.6 });

    s += txt(links, H - 14, "Regel: die niedrigste Stufe nehmen, die die Aufgabe löst.",
      { size: 12, weight: 700, fill: "var(--vz-braun)" });

    return figur(`0 0 ${B} ${H}`, s,
      "Der größte Teil des Nutzens liegt auf den unteren Stufen — dort, wo weder Budget noch Freigabe nötig sind. Jede Stufe höher bedeutet mehr Können, mehr Abhängigkeit und mehr Pflegeaufwand über die Jahre.",
      "Elfstufige Werkzeugleiter der Automatisierung von der Vorlage bis zur individuellen Entwicklung");
  }

  /* ============================================== 8 · Schärfentiefe */

  function schaerfentiefe() {
    const B = 800, H = 330, links = 90, achseY = 205;
    const skalaB = B - links - 40;
    const maxD = 12;                                  // Meter
    const x = (d) => links + (d / maxD) * skalaB;

    // Vereinfacht: DoF ≈ 2·N·c·s² / f²
    const c = 0.03, f = 50;
    const dof = (N, s) => {
      const H0 = (f * f) / (N * c) / 1000;            // Hyperfokal in m
      const nah = (s * H0) / (H0 + (s - f / 1000));
      const fern = s < H0 ? (s * H0) / (H0 - (s - f / 1000)) : maxD;
      return [Math.max(0.2, nah), Math.min(maxD, fern)];
    };

    const faelle = [
      { N: 1.8, s: 2, y: 60, f: "var(--vz-rot)", t: "f/1,8 auf 2 m" },
      { N: 5.6, s: 2, y: 100, f: "var(--vz-orange)", t: "f/5,6 auf 2 m" },
      { N: 5.6, s: 5, y: 140, f: "var(--vz-blau)", t: "f/5,6 auf 5 m" },
    ];

    let s = PFEIL;

    // Achse
    s += linie(links, achseY, B - 40, achseY, { op: 0.5, sw: 1.5 });
    for (let d = 0; d <= maxD; d += 2) {
      s += linie(x(d), achseY, x(d), achseY + 6, { op: 0.4 });
      s += txt(x(d), achseY + 20, d + " m", { anchor: "middle", size: 10, op: 0.6 });
    }
    s += txt(B - 40, achseY + 38, "Entfernung zur Kamera", { anchor: "end", size: 11, op: 0.7 });
    s += txt(links - 6, achseY + 5, "Kamera", { anchor: "end", size: 10.5, weight: 600, op: 0.75 });

    faelle.forEach((k) => {
      const [nah, fern] = dof(k.N, k.s);
      s += rechteck(x(nah), k.y, x(fern) - x(nah), 26, { fill: k.f, op: 0.3, r: 4, stroke: k.f, sw: 1.2 });
      s += linie(x(k.s), k.y - 6, x(k.s), k.y + 32, { stroke: k.f, sw: 2, op: 0.95 });
      s += `<circle cx="${x(k.s)}" cy="${k.y + 13}" r="4" fill="${k.f}"></circle>`;
      s += txt(links - 6, k.y + 17, k.t, { size: 11, weight: 700, fill: k.f, anchor: "end" });
      const spanne = fern >= maxD ? "bis unendlich" : `${(fern - nah).toFixed(1).replace(".", ",")} m tief`;
      s += txt(x(fern) + 8, k.y + 17, spanne, { size: 10.5, op: 0.7 });
    });

    s += txt(links, 268, "Der Abstand ist der stärkste Hebel:", { size: 11.5, weight: 700 });
    s += txt(links, 285, "Schärfentiefe wächst etwa mit dem Quadrat der Entfernung, mit der Blendenzahl dagegen nur linear — also Faktor √2 je Blendenstufe.",
      { size: 10.5, op: 0.7 });
    s += txt(links, 302, "Schematisch für 50 mm an Kleinbild, Zerstreuungskreis 0,03 mm.", { size: 9.5, op: 0.5 });

    return figur(`0 0 ${B} ${H}`, s,
      "Der senkrechte Strich ist die Fokusebene, der Balken der Bereich, der als scharf gilt. Zwei Blendenstufen abblenden verlängert ihn spürbar — den Abstand von 2 auf 5 m zu vergrößern verlängert ihn dramatisch.",
      "Schärfentiefebereiche für drei Kombinationen aus Blende und Aufnahmeabstand");
  }

  /* ------------------------------------------------------- Registrieren */

  Object.assign(VIZ.benannt, {
    "bajonett-skala": bajonettSkala,
    "arbeitszeit-tag": arbeitszeitTag,
    "sternschema": sternschema,
    "auflagenkurve": auflagenkurve,
    "eisenhower": eisenhower,
    "glasl-eskalation": glaslEskalation,
    "werkzeugleiter": werkzeugleiter,
    "schaerfentiefe": schaerfentiefe,
  });
})();
