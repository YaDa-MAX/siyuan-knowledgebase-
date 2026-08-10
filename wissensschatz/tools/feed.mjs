#!/usr/bin/env node
/**
 * Wissen einspeisen — der Alltagsweg, um das Archiv zu füttern.
 *
 *   node tools/feed.mjs --titel "XVERWEIS" --pfad excel/formeln/nachschlagen \
 *                       --level 3 --tags lookup,dynamische-arrays --quelle nutzer
 *
 *   cat notiz.md | node tools/feed.mjs --titel "Notiz vom Meeting" --pfad meta/inbox --stdin
 *
 * Ohne --stdin wird eine Vorlage angelegt, die nur noch gefüllt werden muss.
 * Danach läuft automatisch der Build, damit Einstufung und Gruppierung sofort
 * neu berechnet werden.
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith("--")) continue;
  const key = argv[i].slice(2);
  const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
  args[key] = val;
}

if (args.hilfe || args.help || !args.titel) {
  console.log(`
  Wissen einspeisen

    --titel   <text>     Pflicht. Überschrift des Knotens.
    --pfad    <a/b/c>    Pflicht bei neuem Thema. Standard: meta/inbox
    --level   <1..5>     Vorschlag; die Endeinstufung berechnet der Build.
    --tags    <a,b,c>    Kommagetrennt.
    --typ     <t>        theorie | technik | referenz | rezept | recht | checkliste | meta
    --quelle  <q>        ki | nutzer | gemischt   (Standard: nutzer)
    --voraus  <id,id>    IDs von Voraussetzungen.
    --stdin              Fließtext von der Standardeingabe lesen.
    --kein-build         Index danach nicht neu bauen.
`);
  process.exit(args.titel ? 0 : 1);
}

const slug = (s) =>
  s.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const path = String(args.pfad || "meta/inbox").replace(/^\/+|\/+$/g, "");
const topic = path.split("/")[0];
const base = slug(args.titel);
const id = `${topic}-${base}`.slice(0, 70);
const dir = join(ROOT, "content", topic);
const file = join(dir, `${path.split("/").slice(1).map(slug).filter(Boolean).join("--") || "root"}--${base}.md`);

if (existsSync(file)) {
  console.error(` Existiert bereits: ${file}\n   Vorhandenen Knoten bearbeiten statt neu anlegen.`);
  process.exit(1);
}

let body = "";
if (args.stdin) {
  body = readFileSync(0, "utf8").trim();
} else {
  body = `## Kern

<!-- Worum geht es in drei Sätzen? -->

## Details

<!-- Ausführung, Beispiele, Stolperfallen. -->

## Praxis

<!-- Wann setze ich das konkret ein? -->

::: quiz
F: <!-- Prüffrage -->
A: <!-- Antwort -->
:::

> TODO: ausformulieren`;
}

const today = new Date().toISOString().slice(0, 10);
const tags = String(args.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
const voraus = String(args.voraus || "").split(",").map((s) => s.trim()).filter(Boolean);

const doc = `---
id: ${id}
title: ${args.titel}
path: ${path}
level: ${args.level || 2}
type: ${args.typ || "theorie"}
source: ${args.quelle || "nutzer"}
status: entwurf
updated: ${today}
tags: [${tags.join(", ")}]
prereqs: [${voraus.join(", ")}]
summary: >
  ${args.zusammenfassung || "Noch keine Zusammenfassung."}
---

${body}
`;

mkdirSync(dir, { recursive: true });
writeFileSync(file, doc);
console.log(` Angelegt: ${file.replace(ROOT + "/", "")}   (id: ${id})`);

if (!args["kein-build"]) {
  execFileSync("node", [join(ROOT, "tools", "build.mjs")], { stdio: "inherit" });
}
