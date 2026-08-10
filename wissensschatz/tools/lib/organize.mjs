/**
 * Selbstorganisation des Wissensbaums.
 *
 * Zwei Mechanismen, die bei jedem Build neu laufen — deshalb ordnet sich das
 * Archiv beim Wachsen von allein um, statt in der Struktur von Tag 1 zu erstarren:
 *
 *  1. NEUBEWERTUNG (rebalanceLevels)
 *     Das im Frontmatter deklarierte Level ist nur ein Vorschlag. Das effektive
 *     Level ergibt sich zusätzlich aus der Voraussetzungskette (wie tief muss man
 *     einsteigen, um hierher zu kommen?) und der Strukturtiefe. Anschließend wird
 *     je Themengebiet auf eine sinnvolle Verteilung normalisiert: Wenn zu einem
 *     Thema erst 5 Knoten existieren, ist "Experte" etwas anderes als bei 500.
 *
 *  2. NEUGRUPPIERUNG (buildTree)
 *     Wird ein Ordner zu voll, werden seine Knoten geclustert und in
 *     automatisch benannte Untergruppen gelegt. Zu kleine Gruppen wandern
 *     zurück nach oben. Diese Gruppen sind virtuell — sie stehen nur im Index,
 *     nie im Dateisystem. Dadurch ist Umgruppieren verlustfrei umkehrbar.
 *
 *     Das Verfahren in drei Schritten:
 *       a) Merkmalsvektor je Knoten aus Tags, Titel, Zusammenfassung und
 *          Pfadende, gewichtet mit IDF über die Geschwistermenge.
 *       b) Kerne bilden per Average Linkage über der Hauptschwelle, danach
 *          Einzelknoten per Single Linkage gegen eine niedrigere Schwelle
 *          anlagern. Ohne diesen zweiten Schritt bleiben alle Cluster bei
 *          Paaren stehen, weil die mittlere Ähnlichkeit beim Verschmelzen
 *          sofort unter die Schwelle fällt.
 *       c) Benennung aus dem TF-IDF-Schwerpunkt des Clusters — der Begriff,
 *          der im Cluster dicht vorkommt und ihn zugleich von den
 *          Geschwistern abhebt.
 *
 *     Die Schwellen sind an echtem Inhalt kalibriert; `node tools/test.mjs`
 *     prüft, dass die Mechanik weiterhin greift.
 */

export const CONFIG = {
  splitThreshold: 12, // ab so vielen direkten Knoten wird ein Ordner geclustert
  minCluster: 3, // kleinere Cluster werden wieder aufgelöst
  simThreshold: 0.16, // Kosinusähnlichkeit, ab der zwei Knoten einen Kern bilden (empirisch kalibriert)
  attachFaktor: 0.6, // Anteil davon, ab dem sich ein Einzelknoten anlagert
  gewichte: { tag: 2.0, titel: 1.0, summary: 0.45, pfad: 1.2 }, // Merkmalsgewichte
  levelWeights: { declared: 0.55, prereq: 0.28, depth: 0.17 },
  rebalanceMinNodes: 8, // erst ab so vielen Knoten je Thema wird normalisiert
};

// Wörter, die nie einen Gruppennamen tragen sollten: Funktionswörter,
// Frageformen und inhaltsleere Allgemeinplätze. Ohne diese Liste entstehen
// Gruppen wie "Warum" oder "Richtig".
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
  "thema", "themen", "teil", "einzelnen", "allgemein",
]);

const tokenize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-zäöüß0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));

/* ------------------------------------------------------------------ Level */

/** Längster Pfad im Voraussetzungs-DAG bis zu diesem Knoten (Zyklen werden gekappt). */
function prereqDepth(node, byId, seen = new Set()) {
  if (seen.has(node.id)) return 0; // Zyklus: hier abbrechen statt endlos laufen
  seen.add(node.id);
  let max = 0;
  for (const pid of node.prereqs) {
    const p = byId.get(pid);
    if (!p) continue;
    max = Math.max(max, 1 + prereqDepth(p, byId, new Set(seen)));
  }
  return max;
}

export function rebalanceLevels(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const w = CONFIG.levelWeights;
  const changes = [];

  // Rohwert je Knoten
  for (const n of nodes) {
    n.prereqDepth = prereqDepth(n, byId);
    n.structDepth = n.path.split("/").length;
  }

  const maxPrereq = Math.max(1, ...nodes.map((n) => n.prereqDepth));
  const maxStruct = Math.max(1, ...nodes.map((n) => n.structDepth));

  for (const n of nodes) {
    n._raw =
      w.declared * ((n.declaredLevel - 1) / 4) +
      w.prereq * (n.prereqDepth / maxPrereq) +
      w.depth * ((n.structDepth - 1) / Math.max(1, maxStruct - 1));
  }

  // Normalisierung je Themengebiet: Rangbasiert, damit die Skala mitwächst.
  // Referenzknoten (Nachschlagewerke) bleiben auf ihrem deklarierten Level —
  // sie sollen die Verteilung des Lernpfads nicht verzerren.
  const byTopic = new Map();
  for (const n of nodes) {
    if (!byTopic.has(n.topic)) byTopic.set(n.topic, []);
    byTopic.get(n.topic).push(n);
  }

  for (const [, group] of byTopic) {
    const learn = group.filter((n) => n.type !== "referenz");
    if (learn.length < CONFIG.rebalanceMinNodes) {
      for (const n of group) n.level = n.declaredLevel;
      continue;
    }
    const sorted = [...learn].sort((a, b) => a._raw - b._raw);
    // Zielverteilung: breite Basis, schmale Spitze (Lernpyramide)
    const quota = [0.24, 0.26, 0.24, 0.16, 0.10];
    let idx = 0;
    quota.forEach((share, i) => {
      const take = i === 4 ? sorted.length - idx : Math.max(1, Math.round(share * sorted.length));
      for (let k = 0; k < take && idx < sorted.length; k++, idx++) sorted[idx].level = i + 1;
    });
    for (const n of group) {
      if (n.type === "referenz") n.level = n.declaredLevel;
    }
  }

  for (const n of nodes) {
    if (n.level !== n.declaredLevel) {
      changes.push({ id: n.id, title: n.title, from: n.declaredLevel, to: n.level, reason: reasonFor(n) });
    }
    delete n._raw;
  }
  return changes;
}

function reasonFor(n) {
  if (n.level > n.declaredLevel) {
    return n.prereqDepth >= 2
      ? `setzt eine Kette von ${n.prereqDepth} Voraussetzungen voraus`
      : "im Themenvergleich anspruchsvoller als deklariert";
  }
  return n.prereqDepth === 0
    ? "ohne Voraussetzungen zugänglich"
    : "im Themenvergleich einsteigerfreundlicher als deklariert";
}

/* -------------------------------------------------------------- Gruppierung */

/**
 * Merkmalsvektor eines Knotens.
 *
 * Reine Jaccard-Ähnlichkeit über Tags scheitert in der Praxis: In einem
 * gewachsenen Archiv sind die meisten Tags einmalig, sodass selbst inhaltlich
 * eng verwandte Knoten kaum Überschneidung zeigen. Deshalb hier ein gewichteter
 * Merkmalsvektor aus Tags, Titel, Zusammenfassung und Pfadende — mit
 * IDF-Gewichtung, damit ein gemeinsamer *seltener* Begriff mehr zählt als ein
 * gemeinsamer allgegenwärtiger.
 */
function merkmale(n) {
  const v = new Map();
  const add = (begriff, gewicht) => {
    if (!begriff) return;
    v.set(begriff, (v.get(begriff) || 0) + gewicht);
  };
  const g = CONFIG.gewichte;
  for (const t of n.tags) {
    add("tag:" + t, g.tag);
    // Zusammengesetzte Tags zusätzlich in Bestandteilen, damit
    // "dynamische-arrays" und "arrays" zueinanderfinden.
    for (const teil of tokenize(t.replace(/-/g, " "))) add("w:" + teil, g.tag * 0.4);
  }
  for (const w of tokenize(n.title)) add("w:" + w, g.titel);
  for (const w of tokenize(n.summary || "")) add("w:" + w, g.summary);
  const pfadEnde = n.path.split("/").slice(1).join(" ");
  for (const w of tokenize(pfadEnde)) add("w:" + w, g.pfad);
  return v;
}

/** Kosinusähnlichkeit zweier Merkmalsvektoren mit IDF-Gewichtung. */
function cosinus(va, vb, idf) {
  let punkt = 0, na = 0, nb = 0;
  for (const [k, w] of va) {
    const gew = w * (idf.get(k) || 1);
    na += gew * gew;
    if (vb.has(k)) punkt += gew * vb.get(k) * (idf.get(k) || 1);
  }
  for (const [k, w] of vb) {
    const gew = w * (idf.get(k) || 1);
    nb += gew * gew;
  }
  return na && nb ? punkt / Math.sqrt(na * nb) : 0;
}

/**
 * Agglomeratives Clustern mit Average Linkage.
 * IDF wird über die zu gruppierende Geschwistermenge berechnet — was in
 * *dieser* Ebene selten ist, trennt sie am besten.
 */
function cluster(nodes) {
  const vektoren = new Map(nodes.map((n) => [n.id, merkmale(n)]));

  const dokZahl = new Map();
  for (const v of vektoren.values()) {
    for (const k of v.keys()) dokZahl.set(k, (dokZahl.get(k) || 0) + 1);
  }
  const idf = new Map();
  for (const [k, c] of dokZahl) idf.set(k, Math.log(1 + nodes.length / c));

  // Ähnlichkeitsmatrix einmal vorberechnen
  const sim = new Map();
  const schluessel = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      sim.set(schluessel(nodes[i].id, nodes[j].id),
        cosinus(vektoren.get(nodes[i].id), vektoren.get(nodes[j].id), idf));
    }
  }

  const paar = (a, b) => sim.get(schluessel(a.id, b.id)) || 0;
  const mittel = (ca, cb) => {
    let s = 0;
    for (const a of ca) for (const b of cb) s += paar(a, b);
    return s / (ca.length * cb.length);
  };
  const maximum = (ca, cb) => {
    let m = 0;
    for (const a of ca) for (const b of cb) m = Math.max(m, paar(a, b));
    return m;
  };

  let clusters = nodes.map((n) => [n]);

  // Phase 1 — Kerne bilden: Average Linkage über der Hauptschwelle.
  for (;;) {
    let best = { score: CONFIG.simThreshold, i: -1, j: -1 };
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const score = mittel(clusters[i], clusters[j]);
        if (score > best.score) best = { score, i, j };
      }
    }
    if (best.i < 0) break;
    clusters[best.i] = clusters[best.i].concat(clusters[best.j]);
    clusters.splice(best.j, 1);
  }

  // Phase 2 — Anlagern: Ohne diesen Schritt bleiben die Cluster bei Paaren
  // stehen. Sobald zwei Knoten verschmolzen sind, verwässert die mittlere
  // Ähnlichkeit zu einem dritten unter die Schwelle, obwohl er inhaltlich
  // eindeutig dazugehört. Deshalb hier Single Linkage gegen eine niedrigere
  // Anlagerungsschwelle: Ein Knoten kommt dazu, wenn er zu *irgendeinem*
  // Mitglied deutlich ähnlich ist.
  const anlagern = CONFIG.simThreshold * CONFIG.attachFaktor;
  for (;;) {
    let best = { score: anlagern, i: -1, j: -1 };
    for (let i = 0; i < clusters.length; i++) {
      for (let j = 0; j < clusters.length; j++) {
        if (i === j) continue;
        // Nur Einzelknoten bzw. zu kleine Cluster dürfen sich anlagern,
        // damit gewachsene Kerne nicht ineinanderlaufen.
        if (clusters[j].length >= CONFIG.minCluster) continue;
        const score = maximum(clusters[i], clusters[j]);
        if (score > best.score) best = { score, i, j };
      }
    }
    if (best.i < 0) break;
    clusters[best.i] = clusters[best.i].concat(clusters[best.j]);
    clusters.splice(best.j, 1);
  }

  clusters.sort((a, b) => b.length - a.length);
  return { clusters, vektoren, idf };
}

/**
 * Name eines Clusters aus seinem TF-IDF-Schwerpunkt.
 *
 * Ein reiner Häufigkeitszähler über Tags scheitert daran, dass die meisten Tags
 * einmalig sind. Hier zählt stattdessen, welcher Begriff im Cluster *dicht*
 * vorkommt und ihn zugleich von den Geschwistern abhebt — genau die beiden
 * Eigenschaften, die einen guten Gruppennamen ausmachen.
 */
function nameCluster(members, vektoren, idf) {
  const schwerpunkt = new Map();
  const abdeckung = new Map();
  for (const n of members) {
    const v = vektoren.get(n.id);
    for (const [k, w] of v) {
      schwerpunkt.set(k, (schwerpunkt.get(k) || 0) + w);
      abdeckung.set(k, (abdeckung.get(k) || 0) + 1);
    }
  }

  // In Stufen absteigen: Erst nach einem Begriff suchen, den die Mehrheit
  // trägt. Findet sich keiner, genügt auch ein Drittel — ein etwas schwächerer
  // Name ist immer noch besser als "Weitere Themen".
  let best = null;
  for (const mindestDeckung of [0.5, 0.4, 1 / 3]) {
    for (const [k, w] of schwerpunkt) {
      const deckung = abdeckung.get(k) / members.length;
      if (deckung < mindestDeckung) continue;
      const begriff = k.slice(k.indexOf(":") + 1);
      if (begriff.length < 4) continue;              // zu kurze Wörter benennen nichts
      const istTag = k.startsWith("tag:");
      const punkte = w * (idf.get(k) || 1) * deckung * (istTag ? 1.35 : 1);
      if (!best || punkte > best.punkte) best = { begriff, punkte, deckung };
    }
    if (best) break;
  }

  if (!best) return "Weitere Themen";
  return best.begriff
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Baut den Navigationsbaum und clustert überfüllte Ebenen automatisch nach.
 * Rückgabe: { tree, log } — log dokumentiert jede automatische Umgruppierung.
 */
export function buildTree(nodes) {
  const root = { name: "", path: "", children: new Map(), nodes: [], auto: false };
  const log = [];

  for (const n of nodes) {
    const parts = n.path.split("/");
    let cur = root;
    for (const part of parts) {
      if (!cur.children.has(part)) {
        cur.children.set(part, {
          name: part,
          path: cur.path ? `${cur.path}/${part}` : part,
          children: new Map(),
          nodes: [],
          auto: false,
        });
      }
      cur = cur.children.get(part);
    }
    cur.nodes.push(n);
  }

  const visit = (group) => {
    for (const child of group.children.values()) visit(child);

    // Nur clustern, wenn eine Ebene wirklich unübersichtlich wird und sie nicht
    // ohnehin schon durch echte Unterordner gegliedert ist.
    if (group.nodes.length > CONFIG.splitThreshold && group.children.size === 0) {
      const { clusters, vektoren, idf } = cluster(group.nodes);
      const keep = clusters.filter((c) => c.length >= CONFIG.minCluster);
      const loose = clusters.filter((c) => c.length < CONFIG.minCluster).flat();

      if (keep.length >= 2) {
        const used = new Set();
        for (const members of keep) {
          let name = nameCluster(members, vektoren, idf);
          while (used.has(name)) name += " ·";
          used.add(name);
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          group.children.set(slug, {
            name,
            path: `${group.path}/~${slug}`,
            children: new Map(),
            nodes: members.sort((a, b) => a.level - b.level || a.title.localeCompare(b.title, "de")),
            auto: true,
          });
        }
        group.nodes = loose;
        log.push({
          path: group.path,
          groups: keep.map((c, i) => ({ name: [...group.children.values()].filter((g) => g.auto)[i]?.name, count: c.length })),
          loose: loose.length,
        });
      }
    }

    group.nodes.sort((a, b) => a.level - b.level || a.title.localeCompare(b.title, "de"));
  };
  visit(root);

  const serialize = (g) => ({
    name: g.name,
    path: g.path,
    auto: g.auto,
    nodes: g.nodes.map((n) => n.id),
    children: [...g.children.values()]
      .map(serialize)
      .sort((a, b) => Number(a.auto) - Number(b.auto) || a.name.localeCompare(b.name, "de")),
  });

  return { tree: serialize(root), log };
}
