/* =====================================================================
   viz.js — Markdown-Darstellung, Datensatztabellen und Visualisierungen
   Alles als SVG bzw. reines DOM. Keine Bibliothek, keine Netzanfrage.
   ===================================================================== */
(function () {
  "use strict";

  const KB = window.KB;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ------------------------------------------------------- Markdown */

  // Bewusst schmal gehalten: genau die Teilmenge, die in den Knoten vorkommt.
  function markdown(src) {
    const codeBloecke = [];
    let t = String(src || "");

    // Codeblöcke herausnehmen, damit sie unangetastet bleiben
    t = t.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      codeBloecke.push(`<pre><code data-sprache="${esc(lang)}">${esc(code.replace(/\n$/, ""))}</code></pre>`);
      return `\u0000CODE${codeBloecke.length - 1}\u0000`;
    });

    t = esc(t);

    // Tabellen
    t = t.replace(/(?:^\|.*\|[ \t]*\n)(?:^\|[ :|-]+\|[ \t]*\n)(?:^\|.*\|[ \t]*\n?)*/gm, (block) => {
      const zeilen = block.trim().split("\n").filter((z) => z.trim());
      if (zeilen.length < 2) return block;
      const zellen = (z) => z.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const kopf = zellen(zeilen[0]);
      const koerper = zeilen.slice(2).map(zellen);
      let html = '<div class="tabellen-huelle"><table><thead><tr>';
      kopf.forEach((c) => (html += `<th>${c}</th>`));
      html += "</tr></thead><tbody>";
      koerper.forEach((r) => {
        html += "<tr>";
        kopf.forEach((_, i) => (html += `<td>${r[i] || ""}</td>`));
        html += "</tr>";
      });
      return html + "</tbody></table></div>\n";
    });

    // Überschriften, Zitate, Trenner
    t = t.replace(/^###### (.*)$/gm, "<h6>$1</h6>")
         .replace(/^##### (.*)$/gm, "<h5>$1</h5>")
         .replace(/^#### (.*)$/gm, "<h4>$1</h4>")
         .replace(/^### (.*)$/gm, "<h3>$1</h3>")
         .replace(/^## (.*)$/gm, "<h2>$1</h2>")
         .replace(/^# (.*)$/gm, "<h1>$1</h1>")
         .replace(/^&gt; TODO:\s*(.*)$/gim, '<blockquote class="todo"><strong>Offen:</strong> $1</blockquote>')
         .replace(/(?:^&gt; ?.*(?:\n|$))+/gm, (b) => `<blockquote>${b.replace(/^&gt; ?/gm, "").trim()}</blockquote>`)
         .replace(/^---+$/gm, "<hr>");

    // Listen
    t = t.replace(/(?:^[-*] .*(?:\n|$))+/gm, (b) => {
      const li = b.trim().split("\n").map((z) => `<li>${z.replace(/^[-*] /, "")}</li>`).join("");
      return `<ul>${li}</ul>\n`;
    });
    t = t.replace(/(?:^\d+\. .*(?:\n|$))+/gm, (b) => {
      const li = b.trim().split("\n").map((z) => `<li>${z.replace(/^\d+\. /, "")}</li>`).join("");
      return `<ol>${li}</ol>\n`;
    });

    // Inline
    t = t.replace(/`([^`\n]+)`/g, "<code>$1</code>")
         .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
         .replace(/(^|[^*\w])\*([^*\n]+)\*/g, "$1<em>$2</em>")
         .replace(/\$\$([^$]+)\$\$/g, '<code class="formel">$1</code>')
         .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>');

    // Absätze
    t = t.split(/\n{2,}/).map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (/^<(h\d|ul|ol|table|div|pre|blockquote|hr)/.test(b) || /^\u0000CODE/.test(b)) return b;
      return `<p>${b.replace(/\n/g, " ")}</p>`;
    }).join("\n");

    return t.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codeBloecke[+i]);
  }

  /* --------------------------------------------- Datensatz als Tabelle */

  function datensatz(name, caption) {
    const ds = KB.datasets[name];
    const huelle = document.createElement("figure");
    huelle.className = "viz";
    if (!ds) {
      huelle.innerHTML = `<div class="hinweisbox">Datensatz <code>${esc(name)}</code> nicht gefunden.</div>`;
      return huelle;
    }

    const spalten = ds.columns;
    const zeilen = ds.items || [];
    const gruppierSpalte = spalten.find((s) => ["kat", "marke", "typ", "art"].includes(s.key));

    const werkzeuge = document.createElement("div");
    werkzeuge.className = "ds-werkzeuge";

    const suche = document.createElement("input");
    suche.type = "search";
    suche.placeholder = "Filtern …";
    suche.setAttribute("aria-label", "Datensatz filtern");
    werkzeuge.appendChild(suche);

    let gruppeWahl = null;
    if (gruppierSpalte) {
      gruppeWahl = document.createElement("select");
      gruppeWahl.setAttribute("aria-label", gruppierSpalte.label);
      const werte = [...new Set(zeilen.map((r) => r[gruppierSpalte.key]).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b), "de"));
      gruppeWahl.innerHTML = `<option value="">Alle ${esc(gruppierSpalte.label)}</option>` +
        werte.map((w) => `<option>${esc(w)}</option>`).join("");
      werkzeuge.appendChild(gruppeWahl);
    }

    let stufeWahl = null;
    if (spalten.some((s) => s.type === "level")) {
      stufeWahl = document.createElement("select");
      stufeWahl.setAttribute("aria-label", "Stufe");
      stufeWahl.innerHTML = '<option value="">Alle Stufen</option>' +
        [1, 2, 3, 4, 5].map((l) => `<option value="${l}">bis Stufe ${l} — ${KB.levelNames[l]}</option>`).join("");
      werkzeuge.appendChild(stufeWahl);
    }

    const zaehler = document.createElement("span");
    zaehler.className = "ds-zahl";
    werkzeuge.appendChild(zaehler);

    const tabHuelle = document.createElement("div");
    tabHuelle.className = "ds-tabelle";

    let sortSpalte = null, sortRichtung = 1;

    function zeichnen() {
      const q = suche.value.trim().toLowerCase();
      const g = gruppeWahl ? gruppeWahl.value : "";
      const maxL = stufeWahl && stufeWahl.value ? +stufeWahl.value : 0;

      let gefiltert = zeilen.filter((r) => {
        if (g && String(r[gruppierSpalte.key]) !== g) return false;
        if (maxL) {
          const lvlKey = spalten.find((s) => s.type === "level").key;
          if ((+r[lvlKey] || 1) > maxL) return false;
        }
        if (!q) return true;
        return spalten.some((s) => String(r[s.key] ?? "").toLowerCase().includes(q));
      });

      if (sortSpalte) {
        gefiltert = [...gefiltert].sort((a, b) => {
          const x = a[sortSpalte], y = b[sortSpalte];
          const beideZahl = typeof x === "number" && typeof y === "number";
          return (beideZahl ? x - y : String(x ?? "").localeCompare(String(y ?? ""), "de")) * sortRichtung;
        });
      }

      zaehler.textContent = `${gefiltert.length} von ${zeilen.length}`;

      let html = "<table><thead><tr>";
      spalten.forEach((s) => {
        const pfeil = sortSpalte === s.key ? (sortRichtung > 0 ? " ▲" : " ▼") : "";
        html += `<th data-key="${esc(s.key)}" style="cursor:pointer" title="Sortieren">${esc(s.label)}${pfeil}</th>`;
      });
      html += "</tr></thead><tbody>";
      gefiltert.forEach((r) => {
        html += "<tr>";
        spalten.forEach((s) => {
          const v = r[s.key];
          if (s.type === "level") {
            const l = +v || 1;
            html += `<td><span class="chip stufe s${l}">${l}</span></td>`;
          } else {
            html += `<td>${esc(v ?? "")}</td>`;
          }
        });
        html += "</tr>";
      });
      tabHuelle.innerHTML = html + "</tbody></table>";

      tabHuelle.querySelectorAll("th[data-key]").forEach((th) => {
        th.addEventListener("click", () => {
          const k = th.dataset.key;
          if (sortSpalte === k) sortRichtung *= -1; else { sortSpalte = k; sortRichtung = 1; }
          zeichnen();
        });
      });
    }

    suche.addEventListener("input", zeichnen);
    if (gruppeWahl) gruppeWahl.addEventListener("change", zeichnen);
    if (stufeWahl) stufeWahl.addEventListener("change", zeichnen);
    zeichnen();

    huelle.appendChild(werkzeuge);
    huelle.appendChild(tabHuelle);
    const bu = document.createElement("figcaption");
    bu.textContent = caption || ds.note || "";
    if (bu.textContent) huelle.appendChild(bu);
    return huelle;
  }

  /* ------------------------------------------------- Stufenverteilung */

  function stufenBalken(werte, farbe) {
    const gesamt = werte.reduce((a, b) => a + b, 0) || 1;
    const el = document.createElement("div");
    el.className = "balken";
    werte.forEach((w, i) => {
      const i2 = document.createElement("i");
      i2.style.width = (w / gesamt) * 100 + "%";
      i2.style.background = farbe;
      i2.style.opacity = 0.28 + i * 0.18;
      i2.title = `${KB.levelNames[i + 1]}: ${w}`;
      el.appendChild(i2);
    });
    return el;
  }

  /* --------------------------------------------------- Abdeckungsraster */

  function abdeckung() {
    const themen = KB.stats.byTopicLevel;
    const max = Math.max(1, ...themen.flatMap((t) => t.levels));
    // Zwei Kopfzeilen und breitere Spalten: „3 · Fortgeschritten" ist einzeilig
    // deutlich breiter als eine Zelle und lief in die Nachbarspalte hinein.
    const zellB = 88, zellH = 34, linksB = 150, obenH = 46;
    const b = linksB + zellB * 5 + 12;
    const h = obenH + zellH * themen.length + 8;

    let s = `<svg viewBox="0 0 ${b} ${h}" role="img" aria-label="Abdeckung je Thema und Stufe" style="font-family:inherit">`;
    for (let l = 1; l <= 5; l++) {
      const x = linksB + zellB * (l - 0.5);
      s += `<text x="${x}" y="17" text-anchor="middle" font-size="12" font-weight="700"
             fill="currentColor" opacity=".65">${l}</text>`;
      s += `<text x="${x}" y="32" text-anchor="middle" font-size="9.5"
             fill="currentColor" opacity=".5">${esc(KB.levelNames[l])}</text>`;
    }
    themen.forEach((t, ti) => {
      const meta = KB.topicMeta[t.topic] || {};
      const y = obenH + ti * zellH;
      s += `<text x="${linksB - 10}" y="${y + zellH / 2 + 4}" text-anchor="end" font-size="12"
             fill="currentColor" font-weight="600">${esc(meta.label || t.topic)}</text>`;
      t.levels.forEach((n, li) => {
        const x = linksB + li * zellB;
        const stark = n === 0 ? 0.07 : 0.18 + (n / max) * 0.78;
        s += `<rect x="${x + 2}" y="${y + 2}" width="${zellB - 4}" height="${zellH - 5}" rx="5"
               fill="${meta.color || "#888"}" opacity="${stark.toFixed(2)}"></rect>`;
        s += `<text x="${x + zellB / 2}" y="${y + zellH / 2 + 4}" text-anchor="middle" font-size="11"
               fill="${n === 0 ? "currentColor" : "#fff"}" opacity="${n === 0 ? ".35" : ".95"}"
               font-weight="600">${n || "–"}</text>`;
      });
    });
    s += "</svg>";

    const f = document.createElement("figure");
    f.className = "viz";
    f.innerHTML = s + '<figcaption>Wie viele Knoten je Thema und Stufe vorliegen. Blasse Felder sind Lücken — sie stehen im Backlog.</figcaption>';
    return f;
  }

  /* ------------------------------------------------------ Wissenskarte */

  function karte(aufKlick) {
    const knoten = KB.nodes;
    const nachId = new Map(knoten.map((n) => [n.id, n]));
    const themen = [...new Set(knoten.map((n) => n.topic))];

    const B = 900, H = 620, mx = B / 2, my = H / 2;
    const pos = new Map();

    // Radiale Anordnung: Themen als Sektoren, Stufe als Radius.
    themen.forEach((t, ti) => {
      const imThema = knoten.filter((n) => n.topic === t);
      const sektor = (Math.PI * 2) / themen.length;
      const start = ti * sektor;
      imThema.forEach((n, i) => {
        const radius = 78 + (n.level - 1) * 46 + ((i % 4) - 1.5) * 11;
        const winkel = start + (sektor * (i + 0.7)) / (imThema.length + 0.6);
        pos.set(n.id, { x: mx + Math.cos(winkel) * radius, y: my + Math.sin(winkel) * radius * 0.72 });
      });
    });

    let s = `<svg viewBox="0 0 ${B} ${H}" role="img" aria-label="Beziehungsnetz der Wissensknoten">`;

    // Kanten: Voraussetzungen deutlich, Querverweise blass
    knoten.forEach((n) => {
      const a = pos.get(n.id);
      if (!a) return;
      n.prereqs.forEach((p) => {
        const b = pos.get(p);
        if (b) s += `<line x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${a.x.toFixed(1)}" y2="${a.y.toFixed(1)}"
                       stroke="currentColor" stroke-width="1.1" opacity=".26"></line>`;
      });
      n.related.forEach((r) => {
        const b = pos.get(r);
        if (b && r > n.id) s += `<line x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${a.x.toFixed(1)}" y2="${a.y.toFixed(1)}"
                       stroke="currentColor" stroke-width=".7" opacity=".1" stroke-dasharray="3 3"></line>`;
      });
    });

    // Knoten
    knoten.forEach((n) => {
      const p = pos.get(n.id);
      if (!p) return;
      const meta = KB.topicMeta[n.topic] || {};
      const r = 4 + n.level * 1.5;
      s += `<circle class="kn" data-id="${esc(n.id)}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}"
             fill="${meta.color || "#888"}" opacity=".88" style="cursor:pointer">
             <title>${esc(n.title)} — ${esc(KB.levelNames[n.level])}</title></circle>`;
    });

    // Themenbeschriftung am Rand
    themen.forEach((t, ti) => {
      const meta = KB.topicMeta[t] || {};
      const sektor = (Math.PI * 2) / themen.length;
      const w = ti * sektor + sektor / 2;
      const x = mx + Math.cos(w) * 285, y = my + Math.sin(w) * 218;
      s += `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" text-anchor="middle" font-size="12" font-weight="700"
             fill="${meta.color || "#888"}">${esc(meta.label || t)}</text>`;
    });

    s += "</svg>";

    const f = document.createElement("figure");
    f.className = "viz";
    f.innerHTML = s;
    f.querySelectorAll("circle.kn").forEach((c) => {
      c.addEventListener("click", () => aufKlick && aufKlick(c.dataset.id));
    });
    const leg = document.createElement("div");
    leg.className = "legende";
    leg.innerHTML = themen.map((t) => {
      const m = KB.topicMeta[t] || {};
      return `<span><i style="background:${m.color || "#888"}"></i>${esc(m.label || t)}</span>`;
    }).join("") +
      '<span class="gedaempft">Kreisgröße = Stufe · durchgezogen = Voraussetzung · gestrichelt = Querverweis</span>';
    f.appendChild(leg);
    return f;
  }

  /* -------------------------------------------- Benannte Fachgrafiken */

  function belichtungsdreieck() {
    const f = document.createElement("figure");
    f.className = "viz";
    const reihen = [
      { t: "Blende", w: ["1.0", "1.4", "2.0", "2.8", "4.0", "5.6", "8", "11", "16", "22"], n: "Schärfentiefe", farbe: "var(--vz-blau)" },
      { t: "Zeit", w: ["1s", "1/2", "1/4", "1/8", "1/15", "1/30", "1/60", "1/125", "1/250", "1/500"], n: "Bewegung", farbe: "var(--vz-braun)" },
      { t: "ISO", w: ["100", "200", "400", "800", "1600", "3200", "6400", "12800", "25600", "51200"], n: "Rauschen", farbe: "var(--vz-tuerkis)" },
    ];
    const B = 780, zellB = 62, linksB = 92, zeilH = 62;
    let s = `<svg viewBox="0 0 ${B} ${reihen.length * zeilH + 46}" role="img" aria-label="Blendenstufen von Blende, Zeit und ISO">`;
    reihen.forEach((r, ri) => {
      const y = ri * zeilH + 26;
      s += `<text x="0" y="${y + 20}" font-size="12" font-weight="700" fill="currentColor">${r.t}</text>`;
      s += `<text x="0" y="${y + 36}" font-size="10" fill="currentColor" opacity=".55">${r.n}</text>`;
      r.w.forEach((w, i) => {
        const x = linksB + i * zellB;
        s += `<rect x="${x}" y="${y}" width="${zellB - 5}" height="34" rx="6" fill="${r.farbe}"
               opacity="${(0.2 + i * 0.075).toFixed(2)}"></rect>`;
        s += `<text x="${x + (zellB - 5) / 2}" y="${y + 22}" text-anchor="middle" font-size="11"
               fill="currentColor" font-weight="600">${w}</text>`;
      });
    });
    s += `<text x="${linksB}" y="${reihen.length * zeilH + 38}" font-size="10.5" fill="currentColor" opacity=".6">
           ← weniger Licht · jede Spalte ist eine volle Blendenstufe (Faktor 2) · mehr Licht →</text>`;
    f.innerHTML = s + "</svg>";
    const bu = document.createElement("figcaption");
    bu.textContent = "Ein Schritt nach rechts oder links verdoppelt bzw. halbiert die Lichtmenge — egal in welcher Reihe. Deshalb lassen sich die drei gegeneinander verrechnen.";
    f.appendChild(bu);
    return f;
  }

  const benannt = { "exposure-triangle": belichtungsdreieck, "belichtungsdreieck": belichtungsdreieck };

  /* ------------------------------------------------------------ Export */

  window.VIZ = {
    markdown,
    datensatz,
    stufenBalken,
    abdeckung,
    karte,
    benannt,
    esc,
    /** Löst einen ::: viz-Block auf. */
    aufloesen(spec, caption) {
      const m = /^dataset:(.+)$/.exec(spec.trim());
      if (m) return datensatz(m[1].trim(), caption);
      const fn = benannt[spec.trim()];
      if (fn) {
        const el = fn();
        if (caption) {
          const bu = el.querySelector("figcaption");
          if (bu) bu.textContent = caption;
        }
        return el;
      }
      const f = document.createElement("div");
      f.className = "hinweisbox";
      f.textContent = `Visualisierung „${spec}" ist noch nicht umgesetzt.`;
      return f;
    },
  };
})();
