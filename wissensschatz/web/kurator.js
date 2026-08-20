/* =====================================================================
   kurator.js — Einordnung neuen Wissens in das bestehende Netz

   Die Arbeitsteilung, auf der alles hier beruht:

     Die Maschine PLATZIERT.   Sie rechnet aus dem vorhandenen Bestand,
                               wohin ein Text gehört, woran er anzuknüpfen
                               ist und ob es ihn schon gibt.
     Der Agent FORMULIERT.     Er macht aus der Rohnotiz einen Knoten mit
                               Fließtext, Zusammenfassung und Prüffragen.

   Diese Trennung ist keine Bequemlichkeit, sondern Voraussetzung für die
   Haltbarkeit: Das Platzieren läuft offline, ohne Netz und ohne fremden
   Dienst — es funktioniert also auch dann noch, wenn es das Sprachmodell
   von heute längst nicht mehr gibt. Der Agent ist Komfort, kein Fundament.

   Reines Rechnen ohne DOM, damit dieselbe Datei im Browser läuft und im
   Selbsttest von Node geprüft werden kann.
   ===================================================================== */
(function () {
  "use strict";

  /*
   * Schwellen, an echtem Bestand gemessen statt geschätzt (137 Knoten,
   * 9.316 Paare). Die erste Fassung stand bei 0,42 für „Duplikat" — und
   * hätte nie ausgelöst, weil das ähnlichste echte Knotenpaar 0,34 erreicht.
   * Genau der Fehler, den die Neugruppierung schon einmal hatte.
   *
   *   Bestandspaare untereinander   Median 0,017 · 99 % 0,118 · 99,9 % 0,225 · max 0,340
   *   Knotentext gegen sich selbst  0,89 – 0,92
   *   kurze Paraphrase eines Knotens gegen ihr Original   0,146 – 0,264
   *   neue, verwandte Notiz gegen den nächsten Knoten     0,09 – 0,15
   *   fachfremde Notiz gegen den nächsten Knoten          0,05
   *
   * Paraphrase und neue verwandte Notiz überlappen sich — eine Schwelle kann
   * sie nicht sauber trennen. Deshalb entscheidet der Kurator das auch nicht,
   * sondern meldet die nächsten Nachbarn mit ihrer Ähnlichkeit und überlässt
   * das Urteil dem Menschen oder dem Agenten.
   */
  const CFG = {
    nachbarn: 10,          // so viele ähnlichste Knoten gehen in die Auswertung
    dupHart: 0.20,         // oberhalb der 99,9 % aller Bestandspaare — sehr ungewöhnliche Nähe
    dupWeich: 0.10,        // oberhalb der 99 % — einen Blick wert
    verwandtMin: 0.05,     // absolute Untergrenze; darunter ist es Rauschen
    verwandtRelativ: 0.45, // zusätzlich: Anteil am besten Treffer
    fremdSchwelle: 0.065,  // bester Treffer darunter: gehört in kein vorhandenes Thema
    maxVerwandt: 4,
    maxVoraussetzungen: 2,
    maxNeueTags: 3,
    gewichte: { tag: 3.0, titel: 2.0, text: 1.0 },
  };

  // Dieselbe Liste wie in tools/lib/organize.mjs. Sie steht hier bewusst
  // noch einmal, statt geteilt zu werden: Beide Dateien müssen für sich
  // allein lauffähig bleiben — die eine im Browser, die andere in Node.
  const STOPWORDS = new Set([
    "und", "oder", "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "eines", "im", "in", "für", "fur",
    "mit", "von", "zu", "zur", "zum", "auf", "aus", "bei", "als", "ist", "sind", "wie", "was", "the", "of", "and",
    "warum", "wann", "wer", "wo", "wohin", "woran", "welche", "welcher", "welches", "wofür", "wofur", "womit",
    "man", "sich", "nicht", "kein", "keine", "alle", "alles", "jede", "jeder", "jedes", "mehr", "weniger",
    "kann", "können", "koennen", "muss", "müssen", "muessen", "soll", "sollte", "wird", "werden", "haben", "hat",
    "sein", "seine", "ihre", "ihrer", "dass", "damit", "durch", "über", "ueber", "nach", "vor", "ohne", "gegen",
    "zwischen", "beim", "sowie", "dabei", "dafür", "dafur", "daraus", "dann", "noch", "nur", "auch", "schon",
    "grundlagen", "einführung", "einfuhrung", "überblick", "uberblick", "basics", "praxis", "alltag",
    "richtig", "richtige", "richtigen", "gute", "guten", "beste", "besten", "wichtig", "wichtigsten",
    "thema", "themen", "teil", "einzelnen", "allgemein", "aber", "wenn", "sondern", "etwa", "immer",
    "eher", "sehr", "meist", "meisten", "oft", "bereits", "jeweils", "deshalb", "weil", "denn", "hier",
    "also", "somit", "jedoch", "allerdings", "trotzdem", "etwas", "andere", "anderen", "anderem",
    "diese", "dieser", "dieses", "diesem", "einen", "einem", "seiner", "seinem", "unter", "während",
    "waehrend", "wegen", "statt", "sowohl", "weder", "solche", "solchen", "damals", "später", "spaeter",
    // Zahlwörter: Sie stehen in fast jedem Fachtext und ergeben nie ein
    // brauchbares Tag — „zwei Kriterien" wurde sonst zum Tag „zwei".
    "zwei", "drei", "vier", "fünf", "fuenf", "sechs", "sieben", "acht", "neun", "zehn", "hundert",
    "erste", "ersten", "erster", "zweite", "zweiten", "dritte", "dritten", "letzte", "letzten",
    "einmal", "zweimal", "mehrere", "mehreren", "beide", "beiden", "halb", "ganze", "ganzen",
  ]);

  const tokenize = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-zäöüß0-9]+/g, " ")
      .split(" ")
      .filter((t) => t.length > 2 && !STOPWORDS.has(t));

  /**
   * Merkmalsvektor. Beide Seiten — Bestandsknoten und neuer Text — werden
   * mit derselben Funktion gebildet, sonst wären die Ähnlichkeiten nicht
   * vergleichbar.
   *
   * Die Worthäufigkeit geht mit der Wurzel ein: Ein Begriff, der zwanzigmal
   * vorkommt, ist nicht zwanzigmal so aussagekräftig wie einer, der einmal
   * vorkommt — sonst gewinnen lange Knoten jeden Vergleich.
   */
  function vektor({ titel, tags, text }) {
    const roh = new Map();
    const add = (k, g) => roh.set(k, (roh.get(k) || 0) + g);

    for (const t of tags || []) {
      add("tag:" + t, CFG.gewichte.tag);
      for (const teil of tokenize(t.replace(/-/g, " "))) add("w:" + teil, CFG.gewichte.tag * 0.4);
    }
    for (const w of tokenize(titel)) add("w:" + w, CFG.gewichte.titel);
    for (const w of tokenize(text)) add("w:" + w, CFG.gewichte.text);

    // Wurzel auf die aufsummierten Wortgewichte
    const v = new Map();
    for (const [k, g] of roh) v.set(k, k.startsWith("tag:") ? g : Math.sqrt(g));
    return v;
  }

  function cosinus(va, vb, idf) {
    let punkt = 0, na = 0, nb = 0;
    for (const [k, w] of va) {
      const g = w * (idf.get(k) || 1);
      na += g * g;
      if (vb.has(k)) punkt += g * vb.get(k) * (idf.get(k) || 1);
    }
    for (const [k, w] of vb) {
      const g = w * (idf.get(k) || 1);
      nb += g * g;
    }
    return na && nb ? punkt / Math.sqrt(na * nb) : 0;
  }

  /** Bestandsindex einmal aufbauen; er wird für jede Analyse wiederverwendet. */
  function indexBauen(nodes) {
    const eintraege = nodes.map((n) => ({
      n,
      v: vektor({
        titel: n.title,
        tags: n.tags,
        text: [n.summary, n.path.split("/").slice(1).join(" "), n.body].join(" "),
      }),
    }));

    const df = new Map();
    for (const e of eintraege) for (const k of e.v.keys()) df.set(k, (df.get(k) || 0) + 1);
    const N = Math.max(1, eintraege.length);
    const idf = new Map();
    for (const [k, d] of df) idf.set(k, Math.log((N + 1) / (d + 0.5)));

    // ID-Präfix je Thema aus dem Bestand ableiten, damit neue Knoten der
    // gewachsenen Namensgebung folgen, ohne dass sie irgendwo gepflegt wird.
    const praefix = new Map();
    for (const n of nodes) {
      const p = n.id.split("-")[0];
      if (!praefix.has(n.topic)) praefix.set(n.topic, new Map());
      const m = praefix.get(n.topic);
      m.set(p, (m.get(p) || 0) + 1);
    }
    const themaPraefix = new Map();
    for (const [topic, m] of praefix) {
      themaPraefix.set(topic, [...m.entries()].sort((a, b) => b[1] - a[1])[0][0]);
    }

    const alleTags = new Set(nodes.flatMap((n) => n.tags));
    return { eintraege, idf, themaPraefix, alleTags, ids: new Set(nodes.map((n) => n.id)) };
  }

  const slug = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "ohne-titel";

  /**
   * Kernfunktion: Wohin gehört dieser Text?
   *
   * @param {{titel?: string, text: string, quelle?: string}} eingabe
   * @param {object} KB   der gebaute Index (window.KB)
   * @param {object} [idx] vorbereiteter Bestandsindex; sonst wird er gebaut
   */
  function analysiere(eingabe, KB, idx) {
    const index = idx || indexBauen(KB.nodes);
    const titel = (eingabe.titel || "").trim();
    const text = (eingabe.text || "").trim();
    const hinweise = [];

    const wortzahl = text.split(/\s+/).filter(Boolean).length;
    if (!text) return { leer: true, hinweise: ["Kein Text eingegeben."] };
    if (wortzahl < 25) hinweise.push(`Nur ${wortzahl} Wörter — für eine belastbare Einordnung sind rund 60 nötig. Der Vorschlag ist entsprechend unsicher.`);
    if (!titel) hinweise.push("Ohne Titel fällt die Einordnung schwerer; der Titel wiegt doppelt so schwer wie der Fließtext.");

    const v = vektor({ titel, tags: [], text });
    const treffer = index.eintraege
      .map((e) => ({ n: e.n, sim: cosinus(v, e.v, index.idf) }))
      .filter((t) => t.sim > 0)
      .sort((a, b) => b.sim - a.sim);

    const nachbarn = treffer.slice(0, CFG.nachbarn);
    if (!nachbarn.length) {
      return {
        leer: false, wortzahl, hinweise: [...hinweise,
          "Keine inhaltliche Nähe zu vorhandenen Knoten gefunden. Das spricht für ein neues Themengebiet — siehe den Knoten „Ein neues Themengebiet anlegen“."],
        topic: null, nachbarn: [], duplikate: [], verwandt: [], voraussetzungen: [],
        tags: { uebernommen: [], neu: [] },
      };
    }

    /* ---------------------------------------------------------- Thema */

    const themaPunkte = new Map();
    for (const t of nachbarn) themaPunkte.set(t.n.topic, (themaPunkte.get(t.n.topic) || 0) + t.sim);
    const themen = [...themaPunkte.entries()].sort((a, b) => b[1] - a[1]);
    const summe = themen.reduce((a, [, p]) => a + p, 0) || 1;
    const topic = themen[0][0];
    const konfidenz = themen[0][1] / summe;

    if (konfidenz < 0.5 && themen.length > 1) {
      hinweise.push(`Die Zuordnung ist nicht eindeutig: ${themen.slice(0, 3)
        .map(([t, p]) => `${KB.topicMeta[t]?.label || t} ${Math.round((p / summe) * 100)} %`).join(", ")}. ` +
        "Das kann heißen, dass der Text zwei Dinge zugleich behandelt und geteilt gehört.");
    }

    /* ----------------------------------------------------------- Pfad */

    const imThema = nachbarn.filter((t) => t.n.topic === topic);
    const pfadPunkte = new Map();
    for (const t of imThema) pfadPunkte.set(t.n.path, (pfadPunkte.get(t.n.path) || 0) + t.sim);
    const pfade = [...pfadPunkte.entries()].sort((a, b) => b[1] - a[1]);
    const pfad = pfade[0][0];

    /* ---------------------------------------------------------- Stufe */

    const gewichtet = imThema.reduce((a, t) => a + t.n.declaredLevel * t.sim, 0);
    const gewicht = imThema.reduce((a, t) => a + t.sim, 0) || 1;
    const level = Math.min(5, Math.max(1, Math.round(gewichtet / gewicht)));

    /* ----------------------------------------------------------- Tags */

    const inputWorte = new Set(tokenize(titel + " " + text));
    const nachbarTags = new Map();
    for (const t of imThema) for (const tag of t.n.tags) nachbarTags.set(tag, (nachbarTags.get(tag) || 0) + t.sim);

    const uebernommen = [...nachbarTags.entries()]
      .filter(([tag]) => tokenize(tag.replace(/-/g, " ")).some((w) => inputWorte.has(w)))
      .sort((a, b) => b[1] - a[1]).slice(0, 4).map(([tag]) => tag);

    // Begriffe aus dem Text, die im Bestand selten sind — sie beschreiben das
    // Neue am Knoten und sind deshalb die besseren Tag-Kandidaten.
    const kandidaten = [...inputWorte]
      .filter((w) => !uebernommen.some((t) => t.includes(w)))
      .map((w) => ({ w, idf: index.idf.get("w:" + w) ?? Math.log(index.eintraege.length + 1) }))
      .filter((k) => (text.toLowerCase().split(k.w).length - 1) >= 2)
      .sort((a, b) => b.idf - a.idf)
      .slice(0, CFG.maxNeueTags);
    const neu = kandidaten.map((k) => k.w).filter((w) => !index.alleTags.has(w));
    const bekannt = kandidaten.map((k) => k.w).filter((w) => index.alleTags.has(w));

    /* ------------------------------------------------------ Duplikate */

    const duplikate = treffer
      .filter((t) => t.sim >= CFG.dupWeich)
      .slice(0, 5)
      .map((t) => ({
        id: t.n.id, titel: t.n.title, topic: t.n.topic, sim: t.sim,
        stufe: t.sim >= CFG.dupHart ? "hart" : "weich",
        rat: t.sim >= CFG.dupHart
          ? "Sehr wahrscheinlich schon vorhanden. Prüfen, ob der neue Text dort ergänzt statt neu angelegt gehört."
          : "Inhaltlich nah. Möglich, dass es eine Ergänzung dieses Knotens ist.",
      }));

    /* ------------------------------------- Verweise und Voraussetzungen */

    /*
     * Untergrenze für Querverweise: absolut UND relativ zum besten Treffer.
     * Rein absolut würde eine fachfremde Notiz vier zufällige Verweise
     * bekommen; rein relativ bekäme sie dieselben vier, nur mit anderer
     * Begründung. Erst beide zusammen schweigen, wenn es nichts zu sagen gibt.
     */
    const bestSim = treffer[0].sim;
    const schwelle = Math.max(CFG.verwandtMin, CFG.verwandtRelativ * bestSim);

    /*
     * Auch ein als Duplikat gemeldeter Knoten bleibt als Querverweis stehen.
     * Wird zusammengeführt, verschwindet der neue Knoten ohnehin; wird er
     * behalten, wäre er ohne den Verweis eine Insel — und ein überflüssiger
     * Querverweis ist der billigere Fehler als ein fehlender.
     */
    const verwandt = treffer
      .filter((t) => t.sim >= schwelle)
      .slice(0, CFG.maxVerwandt)
      .map((t) => ({ id: t.n.id, titel: t.n.title, topic: t.n.topic, level: t.n.level, sim: t.sim }));

    const voraussetzungen = treffer
      .filter((t) => t.n.topic === topic && t.n.declaredLevel < level && t.sim >= schwelle)
      .slice(0, CFG.maxVoraussetzungen)
      .map((t) => ({ id: t.n.id, titel: t.n.title, level: t.n.level, sim: t.sim }));

    // Was Voraussetzung ist, muss nicht zusätzlich als Querverweis stehen
    const vorausIds = new Set(voraussetzungen.map((x) => x.id));
    const verwandtOhne = verwandt.filter((x) => !vorausIds.has(x.id));

    /* --------------------------------------------------- Kennung, Datei */

    const praefix = index.themaPraefix.get(topic) || slug(topic).split("-")[0];
    const basis = slug(titel || tokenize(text).slice(0, 4).join("-"));
    let id = `${praefix}-${basis}`.slice(0, 60);
    let n = 2;
    while (index.ids.has(id)) id = `${praefix}-${basis}-${n++}`.slice(0, 60);
    const pfadEnde = pfad.split("/").slice(1).join("-") || "allgemein";
    const datei = `content/${topic}/${pfadEnde}--${basis}.md`;

    /* -------------------------------------------------------- Typvorschlag */

    /*
     * `referenz` wird nie geraten. Der Typ nimmt einen Knoten von der
     * Stufennormalisierung aus — er darf nur dort stehen, wo tatsächlich ein
     * Datensatz eingebunden ist, sonst verzerrt er stillschweigend die
     * Lernpyramide des ganzen Themas.
     */
    const istReferenz = /:::\s*viz\s+dataset:/.test(text);
    const typPunkte = new Map();
    for (const t of imThema) {
      if (t.n.type === "referenz" && !istReferenz) continue;
      typPunkte.set(t.n.type, (typPunkte.get(t.n.type) || 0) + t.sim);
    }
    const typ = typPunkte.size
      ? [...typPunkte.entries()].sort((a, b) => b[1] - a[1])[0][0]
      : (istReferenz ? "referenz" : "theorie");

    if (duplikate.some((d) => d.stufe === "hart")) {
      hinweise.push("Es gibt einen sehr ähnlichen Knoten. Ein zweiter Knoten zur selben Sache ist der häufigste Weg, wie ein Archiv unbrauchbar wird — lieber ergänzen.");
    }
    if (!voraussetzungen.length && level > 2) {
      hinweise.push(`Für Stufe ${level} wurde keine passende Voraussetzung im Bestand gefunden. Entweder ist die Stufe zu hoch angesetzt, oder es fehlt der Grundlagenknoten davor.`);
    }

    const fremd = bestSim < CFG.fremdSchwelle;
    if (fremd) {
      hinweise.unshift(
        `Der nächste Knoten liegt nur bei ${bestSim.toFixed(2)} Ähnlichkeit — im Bestand gibt es zu diesem Text praktisch nichts. ` +
        `Die Zuordnung zu ${KB.topicMeta[topic]?.label || topic} ist deshalb nicht belastbar; das spricht für ein eigenes Themengebiet ` +
        "(siehe „Ein neues Themengebiet anlegen“) oder dafür, zuerst ein paar Grundlagenknoten dazu anzulegen.");
    }

    return {
      leer: false, wortzahl, fremd, bestSim,
      topic, topicLabel: KB.topicMeta[topic]?.label || topic,
      konfidenz,
      themenAlternativen: themen.slice(0, 3).map(([t, p]) => ({ topic: t, label: KB.topicMeta[t]?.label || t, anteil: p / summe })),
      pfad, pfadAlternativen: pfade.slice(0, 3).map(([p, s]) => ({ pfad: p, punkte: s })),
      level, typ,
      tags: { uebernommen, bekannt, neu },
      verwandt: verwandtOhne, voraussetzungen, duplikate,
      nachbarn: nachbarn.map((t) => ({ id: t.n.id, titel: t.n.title, topic: t.n.topic, sim: t.sim })),
      id, datei, hinweise,
    };
  }

  /* ------------------------------------------------------- Ausgabeformate */

  const heute = () => new Date().toISOString().slice(0, 10);

  /** Ein vollständiger Knoten aus Vorschlag und Rohtext — bereit zum Ablegen. */
  function alsKnoten(eingabe, a, opt = {}) {
    const tags = [...new Set([...a.tags.uebernommen, ...a.tags.bekannt, ...a.tags.neu])].slice(0, 6);
    const kopf = [
      `id: ${a.id}`,
      `title: ${eingabe.titel || "Ohne Titel"}`,
      `path: ${a.pfad}`,
      `level: ${a.level}`,
      `type: ${a.typ}`,
      `source: ${eingabe.quelle || "nutzer"}`,
      `status: ${opt.status || "entwurf"}`,
      `updated: ${heute()}`,
      `tags: [${tags.join(", ")}]`,
      `prereqs: [${a.voraussetzungen.map((v) => v.id).join(", ")}]`,
      `related: [${a.verwandt.map((v) => v.id).join(", ")}]`,
      // Einzeilig und ohne Zeilenumbruch — das Frontmatter liest Werte zeilenweise
      `summary: ${(eingabe.summary || (eingabe.text.split(/[.!?]\s/)[0] || "")).replace(/\s+/g, " ").trim().slice(0, 180)}`,
    ].join("\n");

    const offen = [
      "> TODO: Rohfassung — vom Agenten oder von Hand ausformulieren:",
      ">   · Zusammenfassung auf einen tragenden Satz bringen",
      ">   · Fließtext gliedern, Zwischenüberschriften setzen",
      ">   · mindestens zwei Prüffragen ergänzen (::: quiz)",
      ...(a.duplikate.length
        ? [`>   · Überschneidung prüfen mit: ${a.duplikate.map((d) => d.id).join(", ")}`]
        : []),
    ].join("\n");

    return `---\n${kopf}\n---\n\n## Kern\n\n${eingabe.text.trim()}\n\n${offen}\n`;
  }

  /**
   * Auftrag für den Agenten: alles, was er braucht, um daraus einen fertigen
   * Knoten zu machen — ohne dass er das Archiv erst durchsuchen muss.
   */
  function agentenauftrag(eingabe, a, KB) {
    const z = [];
    z.push("Du kuratierst einen Eintrag für ein bestehendes Wissensarchiv.");
    z.push("");
    z.push("## Rohnotiz");
    z.push("");
    z.push(`Titel (vorläufig): ${eingabe.titel || "— keiner —"}`);
    z.push(`Herkunft: ${eingabe.quelle || "nutzer"}`);
    z.push("");
    z.push(eingabe.text.trim());
    z.push("");
    z.push("## Berechnete Einordnung");
    z.push("");
    z.push("Ermittelt aus der Ähnlichkeit zum vorhandenen Bestand (IDF-gewichteter Kosinus).");
    z.push("Sie ist ein Vorschlag — begründet abweichen ist ausdrücklich erwünscht.");
    z.push("");
    z.push(`- Themengebiet: **${a.topicLabel}** (\`${a.topic}\`), Konfidenz ${Math.round(a.konfidenz * 100)} %`);
    if (a.themenAlternativen.length > 1) {
      z.push(`  - Alternativen: ${a.themenAlternativen.slice(1).map((t) => `${t.label} ${Math.round(t.anteil * 100)} %`).join(", ")}`);
    }
    z.push(`- Pfad: \`${a.pfad}\``);
    z.push(`- Stufe: ${a.level} (${KB.levelNames[a.level]}) — gewichtetes Mittel der ähnlichsten Knoten`);
    z.push(`- Typ: \`${a.typ}\``);
    z.push(`- Kennung: \`${a.id}\``);
    z.push(`- Zieldatei: \`${a.datei}\``);
    z.push("");
    if (a.duplikate.length) {
      z.push("### Mögliche Überschneidungen — zuerst prüfen");
      z.push("");
      for (const d of a.duplikate) {
        z.push(`- \`${d.id}\` — „${d.titel}“ (Ähnlichkeit ${d.sim.toFixed(2)}, ${d.stufe === "hart" ? "hoch" : "mittel"})`);
        z.push(`  ${d.rat}`);
      }
      z.push("");
    }
    if (a.voraussetzungen.length) {
      z.push("### Vorgeschlagene Voraussetzungen (prereqs)");
      z.push("");
      for (const v of a.voraussetzungen) z.push(`- \`${v.id}\` — „${v.titel}“ (Stufe ${v.level})`);
      z.push("");
    }
    if (a.verwandt.length) {
      z.push("### Vorgeschlagene Querverweise (related)");
      z.push("");
      for (const v of a.verwandt) z.push(`- \`${v.id}\` — „${v.titel}“ (${v.topic}, Ähnlichkeit ${v.sim.toFixed(2)})`);
      z.push("");
    }
    const tags = [...new Set([...a.tags.uebernommen, ...a.tags.bekannt, ...a.tags.neu])];
    if (tags.length) {
      z.push(`### Tag-Vorschlag`);
      z.push("");
      z.push(tags.map((t) => `\`${t}\``).join(", ") +
        (a.tags.neu.length ? `  — davon neu im Bestand: ${a.tags.neu.map((t) => `\`${t}\``).join(", ")}` : ""));
      z.push("");
    }
    if (a.hinweise.length) {
      z.push("### Hinweise des Kurators");
      z.push("");
      for (const h of a.hinweise) z.push(`- ${h}`);
      z.push("");
    }
    z.push("## Was zu tun ist");
    z.push("");
    z.push("1. Die Überschneidungen prüfen. Gehört der Inhalt in einen vorhandenen Knoten, dann diesen ergänzen statt einen neuen anzulegen — ein zweiter Knoten zur selben Sache ist der häufigste Weg, wie ein Archiv unbrauchbar wird.");
    z.push("2. Die Rohnotiz zu einem Knoten ausformulieren: Fließtext mit Zwischenüberschriften, keine Stichwortlisten ohne Satz.");
    z.push("3. `summary` auf **einen** tragenden Satz bringen — er erscheint in Suche und Übersicht.");
    z.push("4. Mindestens zwei Prüffragen in einem `::: quiz`-Block. Eine Sache je Frage, nicht mit Ja/Nein beantwortbar, nach dem Warum fragen. Der Selbsttest schlägt ohne Karten fehl.");
    z.push("5. `source` unverändert lassen — eigene Erfahrung muss von nachproduzierbarem Wissen unterscheidbar bleiben.");
    z.push("6. `status: entwurf` beibehalten, bis die Angaben geprüft sind. Nicht verifizierte Zahlen, Fristen und Beträge mit `> TODO:` markieren; sie landen dann im Backlog.");
    z.push("7. Datei anlegen, danach `node tools/build.mjs && node tools/test.mjs`.");
    z.push("");
    z.push("## Format eines Knotens");
    z.push("");
    z.push("```markdown");
    z.push(alsKnoten(eingabe, a).split("\n").slice(0, 15).join("\n"));
    z.push("...");
    z.push("```");
    return z.join("\n");
  }

  window.KURATOR = { analysiere, indexBauen, alsKnoten, agentenauftrag, slug, tokenize, vektor, cosinus, CFG };
})();
