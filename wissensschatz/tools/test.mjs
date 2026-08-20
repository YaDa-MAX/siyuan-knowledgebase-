#!/usr/bin/env node
/**
 * Selbsttest des Archivs.
 *
 *   node tools/test.mjs
 *
 * Prüft die Mechanik, auf die sich das Archiv verlässt — insbesondere, dass die
 * automatische Neugruppierung tatsächlich greift. Diese Prüfung existiert, weil
 * sie einmal *nicht* gegriffen hat: Die ursprüngliche Jaccard-Ähnlichkeit über
 * Tags konnte die Schwelle nie erreichen, weil die meisten Tags einmalig sind.
 * Ein dokumentierter Mechanismus, der stillschweigend nie ausgelöst wird, ist
 * schlimmer als keiner.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { walk, loadNode, TYPES, STATUS, SOURCES } from "./lib/parse.mjs";
import { rebalanceLevels, buildTree, CONFIG } from "./lib/organize.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const WEB = join(ROOT, "web");

let bestanden = 0, gescheitert = 0;
const pruefe = (name, bedingung, detail = "") => {
  if (bedingung) { bestanden++; console.log(`  ok    ${name}`); }
  else { gescheitert++; console.log(`  FEHL  ${name}${detail ? "  — " + detail : ""}`); }
};

console.log("\nSelbsttest\n");

/* ------------------------------------------------------------ Inhalt */

const dateien = walk(CONTENT);
const nodes = [];
const parseFehler = [];
for (const f of dateien) {
  try { nodes.push(loadNode(f, CONTENT)); } catch (e) { parseFehler.push(e.message); }
}

console.log("Inhalt");
pruefe(`${dateien.length} Dateien gelesen`, dateien.length > 0);
pruefe("alle Knoten lesbar", parseFehler.length === 0, parseFehler[0]);

const ids = nodes.map((n) => n.id);
pruefe("keine doppelten IDs", new Set(ids).size === ids.length,
  ids.filter((id, i) => ids.indexOf(id) !== i).join(", "));

pruefe("alle Typen gültig", nodes.every((n) => TYPES.includes(n.type)));
pruefe("alle Status gültig", nodes.every((n) => STATUS.includes(n.status)));
pruefe("alle Quellen gültig", nodes.every((n) => SOURCES.includes(n.source)));
pruefe("alle Knoten haben eine Zusammenfassung", nodes.every((n) => n.summary.length > 10),
  nodes.filter((n) => n.summary.length <= 10).map((n) => n.id).join(", "));
pruefe("alle Knoten haben Fließtext", nodes.every((n) => n.words > 50),
  nodes.filter((n) => n.words <= 50).map((n) => n.id).join(", "));

const ohneKarten = nodes.filter((n) => n.quiz.length === 0 && n.type !== "meta");
pruefe("jeder Fachknoten hat Lernkarten", ohneKarten.length === 0,
  ohneKarten.map((n) => n.id).join(", "));

const kaputteKarten = nodes.flatMap((n) =>
  n.quiz.filter((q) => !q.q || !q.a).map(() => n.id));
pruefe("keine halben Lernkarten", kaputteKarten.length === 0, kaputteKarten.join(", "));

/* ------------------------------------------------------------ Stufen */

console.log("\nNeubewertung der Stufen");
const changes = rebalanceLevels(nodes);
pruefe("alle Stufen im Bereich 1–5", nodes.every((n) => n.level >= 1 && n.level <= 5));
pruefe("Referenzknoten behalten ihre deklarierte Stufe",
  nodes.filter((n) => n.type === "referenz").every((n) => n.level === n.declaredLevel));
pruefe("Neubewertung findet statt", changes.length > 0,
  "keine einzige Abweichung — die Normalisierung greift nicht");

/*
 * Sobald die Normalisierung greift, muss sie ALLE fünf Stufen besetzen — das
 * ist ihr Zweck. Die frühere Schwelle von drei Stufen ließ genau den Fehler
 * durch, den sie hätte finden sollen: Bei elf Lernknoten blieb Stufe 5 leer,
 * weil die einzeln gerundeten Quotenanteile die Menge schon aufgebraucht
 * hatten. Der Test war grün, und das Archiv meldete gleichzeitig eine
 * unbesetzte Expertenstufe im Backlog.
 */
for (const topic of [...new Set(nodes.map((n) => n.topic))].sort()) {
  const lern = nodes.filter((n) => n.topic === topic && n.type !== "referenz");
  if (lern.length < CONFIG.rebalanceMinNodes) continue;
  const stufen = new Set(lern.map((n) => n.level));
  pruefe(`${topic}: alle fünf Stufen besetzt (${[...stufen].sort().join(",")})`,
    stufen.size === 5, `${lern.length} Lernknoten, aber nur ${stufen.size} Stufen`);
}

/* ----------------------------------------------------- Neugruppierung */

console.log("\nAutomatische Neugruppierung");

// Simuliert den Zustand nach weiterem Wachstum: alle Knoten eines Themas
// liegen auf einer Ebene, sodass die Schwelle überschritten wird.
const flach = nodes.map((n) => ({ ...n, path: n.topic }));
const alteSchwelle = CONFIG.splitThreshold;
CONFIG.splitThreshold = 6;
const { tree, log } = buildTree(flach);
CONFIG.splitThreshold = alteSchwelle;

pruefe("überfüllte Ebenen werden umgruppiert", log.length > 0,
  "keine einzige Ebene geclustert — die Ähnlichkeitsschwelle ist unerreichbar");

const alleGruppen = log.flatMap((r) => r.groups);
pruefe("mindestens zwei Gruppen je umgruppierter Ebene",
  log.every((r) => r.groups.length >= 2));
pruefe("Gruppen erreichen die Mindestgröße",
  alleGruppen.every((g) => g.count >= CONFIG.minCluster),
  alleGruppen.filter((g) => g.count < CONFIG.minCluster).map((g) => g.name).join(", "));
pruefe("Gruppen tragen sprechende Namen",
  alleGruppen.filter((g) => g.name === "Weitere Themen").length <= alleGruppen.length / 3,
  alleGruppen.map((g) => g.name).join(", "));
pruefe("Gruppennamen sind eindeutig je Ebene",
  log.every((r) => new Set(r.groups.map((g) => g.name)).size === r.groups.length));

// Kein Knoten darf beim Umgruppieren verloren gehen
const zaehle = (g) => (g.nodes || []).length + (g.children || []).reduce((a, k) => a + zaehle(k), 0);
pruefe("kein Knoten geht beim Umgruppieren verloren",
  zaehle(tree) === flach.length, `${zaehle(tree)} statt ${flach.length}`);

console.log("\n  Gebildete Gruppen:");
for (const r of log) {
  console.log(`    ${r.path}: ` + r.groups.map((g) => `${g.name} (${g.count})`).join(", ") +
    (r.loose ? ` · ${r.loose} einzeln` : ""));
}

/* ------------------------------------------------------------ Verweise */

console.log("\nVerweise");
const byId = new Map(nodes.map((n) => [n.id, n]));
const fehlendeVoraus = nodes.flatMap((n) => n.prereqs.filter((p) => !byId.has(p)));
const fehlendeVerweise = nodes.flatMap((n) => n.related.filter((r) => !byId.has(r)));
console.log(`  Hinweis: ${fehlendeVoraus.length} offene Voraussetzungen, ` +
  `${fehlendeVerweise.length} offene Querverweise — beide stehen im Backlog.`);

const zyklen = [];
for (const n of nodes) {
  const gesehen = new Set();
  const lauf = (id) => {
    if (gesehen.has(id)) return id === n.id;
    gesehen.add(id);
    return (byId.get(id)?.prereqs || []).some(lauf);
  };
  if ((n.prereqs || []).some(lauf)) zyklen.push(n.id);
}
pruefe("keine Zyklen in den Voraussetzungen", zyklen.length === 0, zyklen.join(", "));

/* ------------------------------------------------------ Visualisierungen */

/*
 * Gleiche Sorge wie bei der Neugruppierung: Ein `::: viz`-Name, den niemand
 * registriert hat, erzeugt in der App still eine graue Hinweisbox statt einer
 * Grafik. Und eine Grafik, die niemand einbindet, ist geschriebener Code ohne
 * Wirkung. Beide Richtungen werden hier geprüft.
 */
console.log("\nVisualisierungen");

// Registrierte Namen aus den Skripten lesen — bewusst textuell, damit der
// Selbsttest ohne Browser und ohne Modulsystem im Web-Ordner auskommt.
const skripte = ["viz.js", "diagramme.js"]
  .filter((f) => existsSync(join(WEB, f)))
  .map((f) => readFileSync(join(WEB, f), "utf8"))
  .join("\n");
// Name -> Zeichenfunktion. Mehrere Namen dürfen auf dieselbe Funktion zeigen
// (`exposure-triangle` und `belichtungsdreieck` sind dieselbe Grafik); für die
// Nutzungsprüfung zählt deshalb die Funktion, nicht der einzelne Alias.
const zeichner = new Map(
  [...skripte.matchAll(/["']([a-z0-9][a-z0-9-]*)["']\s*:\s*([A-Za-z_$][\w$]*)\s*[,}]/g)]
    .map((m) => [m[1], m[2]]),
);
const registriert = new Set(zeichner.keys());

// Verfügbare Datensätze
const datenDir = join(CONTENT, "_data");
const datensaetze = new Set(
  existsSync(datenDir)
    ? readdirSync(datenDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))
    : [],
);

const eingebunden = new Set();
const unaufloesbar = [];
for (const n of nodes) {
  for (const v of n.viz) {
    const ds = /^dataset:(.+)$/.exec(v.name);
    if (ds) {
      if (!datensaetze.has(ds[1].trim())) unaufloesbar.push(`${n.id} → ${v.name}`);
      continue;
    }
    eingebunden.add(v.name);
    if (!registriert.has(v.name)) unaufloesbar.push(`${n.id} → ${v.name}`);
  }
}

pruefe("jede eingebundene Visualisierung ist auflösbar", unaufloesbar.length === 0,
  unaufloesbar.join(", "));

const genutzteZeichner = new Set([...eingebunden].map((n) => zeichner.get(n)));
const ungenutzt = [...new Set([...zeichner.values()].filter((fn) => !genutzteZeichner.has(fn)))];
pruefe("jede Fachgrafik wird in mindestens einem Knoten gezeigt", ungenutzt.length === 0,
  ungenutzt.join(", ") + " — geschrieben, aber nirgends eingebunden");

console.log(`  Hinweis: ${eingebunden.size} Fachgrafiken und ` +
  `${[...new Set(nodes.flatMap((n) => n.viz.map((v) => v.name)))].length - eingebunden.size}` +
  ` Datensatztabellen eingebunden.`);

/* ------------------------------------------------------- Dienstplan-Prüfer */

/*
 * Die Regeln des Dienstplan-Prüfers haben ihren eigenen, ausführlichen Test.
 * Er wird von hier aus mitgestartet, damit es einen Befehl gibt und nicht zwei
 * — eine zweite Testdatei, an die man denken muss, wird irgendwann nicht mehr
 * ausgeführt, und dann rechnet ein Werkzeug jahrelang unbemerkt falsch.
 */
for (const [titel, datei] of [["Dienstplan-Prüfer", "test-dienstplan.mjs"], ["Kurator", "test-kurator.mjs"]]) {
  console.log(`\n${titel}`);
  const r = spawnSync(process.execPath, [join(ROOT, "tools", datei)], { encoding: "utf8" });
  const zeile = (r.stdout || "").trim().split("\n").pop() || "";
  const fehler = (r.stdout || "").split("\n").filter((z) => z.includes("FEHL"));
  pruefe(`Regeltest bestanden (${zeile})`, r.status === 0,
    fehler.join(" · ") || (r.stderr || "").slice(0, 200));
}

/* ------------------------------------------------------------ Ergebnis */

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert\n`);
process.exit(gescheitert ? 1 : 0);
