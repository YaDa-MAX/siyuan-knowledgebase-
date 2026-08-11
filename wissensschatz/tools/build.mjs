#!/usr/bin/env node
/**
 * Baut aus content/ den Index für die Web-App.
 *
 * Ausgabe ist bewusst eine .js-Datei (kein .json): So lässt sich web/index.html
 * per Doppelklick direkt aus dem Dateisystem öffnen, ohne Webserver und ohne
 * CORS-Ärger. Für ein Archiv, das Jahrzehnte überdauern soll, ist das die
 * robustere Wahl.
 *
 *   node tools/build.mjs [--quiet]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { walk, loadNode, ohneCode, LEVEL_NAMES } from "./lib/parse.mjs";
import { rebalanceLevels, buildTree, CONFIG } from "./lib/organize.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const DATA = join(CONTENT, "_data");
const STATE = join(ROOT, ".state");
const OUT = join(ROOT, "web", "kb-data.js");
const quiet = process.argv.includes("--quiet");
const log = (...a) => !quiet && console.log(...a);

/* ------------------------------------------------------------ Knoten laden */

const files = walk(CONTENT);
const nodes = [];
const errors = [];
for (const f of files) {
  try {
    nodes.push(loadNode(f, CONTENT));
  } catch (e) {
    errors.push(e.message);
  }
}
if (errors.length) {
  console.error("\n Fehlerhafte Knoten:\n" + errors.map((e) => "   " + e).join("\n") + "\n");
  process.exit(1);
}

const dupes = nodes.map((n) => n.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupes.length) {
  console.error(` Doppelte IDs: ${[...new Set(dupes)].join(", ")}`);
  process.exit(1);
}

/* --------------------------------------------- Referenzdatensätze einlesen */

const datasets = {};
if (existsSync(DATA)) {
  for (const f of readdirSync(DATA).filter((f) => f.endsWith(".json")).sort()) {
    const key = f.replace(/\.json$/, "");
    datasets[key] = JSON.parse(readFileSync(join(DATA, f), "utf8"));
  }
}

/* -------------------------------------------- Selbstorganisation ausführen */

const levelChanges = rebalanceLevels(nodes);
const { tree, log: regroupLog } = buildTree(nodes);

// Vergleich mit dem letzten Build: Was hat sich beim Wachsen verschoben?
mkdirSync(STATE, { recursive: true });
const stateFile = join(STATE, "levels.json");
const prev = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : {};
const drift = [];
for (const n of nodes) {
  if (prev[n.id] !== undefined && prev[n.id] !== n.level) {
    drift.push({ id: n.id, title: n.title, from: prev[n.id], to: n.level, topic: n.topic });
  }
}
writeFileSync(stateFile, JSON.stringify(Object.fromEntries(nodes.map((n) => [n.id, n.level])), null, 2));

/* --------------------------------------------- Verweise & Lücken auswerten */

const byId = new Map(nodes.map((n) => [n.id, n]));
const gaps = [];

for (const n of nodes) {
  for (const p of n.prereqs) {
    if (!byId.has(p)) gaps.push({ kind: "voraussetzung", node: n.id, missing: p, topic: n.topic });
  }
  for (const r of n.related) {
    if (!byId.has(r)) gaps.push({ kind: "verweis", node: n.id, missing: r, topic: n.topic });
  }
  // Rückwärtsverweise für die Navigation
  n.backlinks = [];
}
for (const n of nodes) {
  for (const ref of [...n.prereqs, ...n.related]) {
    const t = byId.get(ref);
    if (t && !t.backlinks.includes(n.id)) t.backlinks.push(n.id);
  }
}

// Offene Punkte, die im Text markiert wurden
for (const n of nodes) {
  const todos = ohneCode(n.body).match(/^>\s*TODO:\s*(.+)$/gim) || [];
  for (const t of todos) gaps.push({ kind: "todo", node: n.id, missing: t.replace(/^>\s*TODO:\s*/i, ""), topic: n.topic });
}

// Level-Lücken: Themen, in denen eine Stufe komplett fehlt
const topics = [...new Set(nodes.map((n) => n.topic))];
for (const t of topics) {
  const have = new Set(nodes.filter((n) => n.topic === t && n.type !== "referenz").map((n) => n.level));
  for (let l = 1; l <= 5; l++) {
    if (!have.has(l) && have.size > 0) {
      gaps.push({ kind: "stufe", node: null, missing: `${t}: Stufe ${l} (${LEVEL_NAMES[l]}) unbesetzt`, topic: t });
    }
  }
}

/* ------------------------------------------------------------- Suchindex */

const searchIndex = nodes.map((n) => ({
  id: n.id,
  t: n.title.toLowerCase(),
  s: (n.summary || "").toLowerCase(),
  g: n.tags.join(" ").toLowerCase(),
  b: n.body.toLowerCase().replace(/\s+/g, " ").slice(0, 4000),
}));

/* ---------------------------------------------------------------- Statistik */

const topicMeta = JSON.parse(readFileSync(join(CONTENT, "_topics.json"), "utf8"));
const stats = {
  nodes: nodes.length,
  words: nodes.reduce((s, n) => s + n.words, 0),
  cards: nodes.reduce((s, n) => s + n.quiz.length, 0),
  topics: topics.length,
  datasetRows: Object.values(datasets).reduce((s, d) => s + (Array.isArray(d) ? d.length : (d.items?.length || 0)), 0),
  bySource: nodes.reduce((m, n) => ((m[n.source] = (m[n.source] || 0) + 1), m), {}),
  byStatus: nodes.reduce((m, n) => ((m[n.status] = (m[n.status] || 0) + 1), m), {}),
  byTopicLevel: topics.map((t) => ({
    topic: t,
    levels: [1, 2, 3, 4, 5].map((l) => nodes.filter((n) => n.topic === t && n.level === l).length),
  })),
  builtAt: new Date().toISOString().slice(0, 10),
};

/* ------------------------------------------------------------------ Ausgabe */

const payload = {
  version: 1,
  stats,
  config: CONFIG,
  levelNames: LEVEL_NAMES,
  topicMeta,
  tree,
  regroupLog,
  levelChanges,
  drift,
  gaps,
  datasets,
  searchIndex,
  nodes: nodes.map((n) => ({
    id: n.id, title: n.title, path: n.path, topic: n.topic,
    level: n.level, declaredLevel: n.declaredLevel,
    tags: n.tags, prereqs: n.prereqs, related: n.related, backlinks: n.backlinks,
    type: n.type, source: n.source, status: n.status, updated: n.updated,
    summary: n.summary, body: n.body, quiz: n.quiz, viz: n.viz, file: n.file, words: n.words,
  })),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  "/* Automatisch erzeugt von tools/build.mjs — nicht von Hand bearbeiten. */\n" +
    "window.KB = " + JSON.stringify(payload) + ";\n"
);

log(`\n  Wissensschatz gebaut  ${stats.builtAt}`);
log(`  ${stats.nodes} Knoten · ${stats.words.toLocaleString("de-DE")} Wörter · ${stats.cards} Lernkarten · ${stats.datasetRows.toLocaleString("de-DE")} Referenzeinträge`);
log(`  ${topics.length} Themengebiete: ${topics.join(", ")}`);
if (levelChanges.length) log(`  ${levelChanges.length} Knoten automatisch neu eingestuft (Normalisierung je Thema)`);
if (drift.length) log(`  ${drift.length} Einstufungen haben sich gegenüber dem letzten Build verschoben`);
if (regroupLog.length) {
  log(`  ${regroupLog.length} Ebene(n) automatisch neu gruppiert:`);
  for (const r of regroupLog) log(`     ${r.path} -> ${r.groups.map((g) => `${g.name} (${g.count})`).join(", ")}`);
}
log(`  ${gaps.length} offene Lücken im Backlog`);
log(`  -> ${OUT.replace(ROOT + "/", "")}\n`);
