#!/usr/bin/env node
/**
 * kuratieren.mjs — neues Wissen einordnen und ablegen.
 *
 * Der Weg über die Kommandozeile, parallel zur Oberfläche unter „Einspeisen".
 * Beide benutzen dieselbe Rechenlogik (web/kurator.js), damit es keine zwei
 * Wahrheiten darüber gibt, wohin etwas gehört.
 *
 *   node tools/kuratieren.mjs --titel "…" --stdin              analysieren
 *   node tools/kuratieren.mjs --titel "…" --stdin --briefing   Auftrag für den Agenten
 *   node tools/kuratieren.mjs --titel "…" --stdin --schreiben  Datei anlegen
 *   node tools/kuratieren.mjs --datei entwurf.md --schreiben   fertige Datei einordnen
 *   node tools/kuratieren.mjs --inbox                          alles in content/meta/inbox
 *
 * `--schreiben` legt einen Knoten mit `status: entwurf` und einer TODO-Marke an.
 * Das ist Absicht: Was die Maschine platziert hat, ist noch nicht ausformuliert,
 * und der Reifegrad muss das sagen.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";
import { parseFrontmatter } from "./lib/parse.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------ Argumente */

const argv = process.argv.slice(2);
const hat = (n) => argv.includes(n);
const wert = (n, s) => {
  const i = argv.indexOf(n);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : s;
};

if (hat("--hilfe") || hat("-h") || !argv.length) {
  console.log(`
Wissen einordnen und ablegen.

  --stdin                Text von der Standardeingabe lesen
  --text "…"             Text direkt übergeben
  --datei <pfad>         Datei lesen (Markdown, Frontmatter optional)
  --inbox                alle .md aus content/meta/inbox verarbeiten

  --titel "…"            Titel (sonst aus Frontmatter oder erster Zeile)
  --quelle nutzer|ki|gemischt      Standard: nutzer

  --briefing             Auftrag für den Agenten ausgeben statt der Analyse
  --schreiben            Knoten als Datei anlegen
  --ziel <pfad>          Zieldatei überschreiben
  --json                 Analyse als JSON
  --trocken              nur zeigen, was geschrieben würde

Beispiel:
  pbpaste | node tools/kuratieren.mjs --stdin --titel "XVERWEIS mit zwei Kriterien" --briefing
`);
  process.exit(0);
}

/* ------------------------------------------------ Kurator und Index laden */

// kurator.js ist bewusst ein schlichtes Skript ohne Modulsystem, damit es per
// Doppelklick im Browser läuft. Hier wird es mit einem Ersatz-`window`
// ausgeführt — dieselbe Datei, dieselbe Rechnung.
const ctx = createContext({ window: {}, console });
const kbPfad = join(ROOT, "web", "kb-data.js");
if (!existsSync(kbPfad)) {
  console.error("web/kb-data.js fehlt. Zuerst: node tools/build.mjs");
  process.exit(1);
}
runInContext(readFileSync(kbPfad, "utf8"), ctx);
runInContext(readFileSync(join(ROOT, "web", "kurator.js"), "utf8"), ctx);
const KB = ctx.window.KB;
const K = ctx.window.KURATOR;
const index = K.indexBauen(KB.nodes);

/* ------------------------------------------------------------- Einlesen */

async function stdinLesen() {
  const stuecke = [];
  for await (const s of process.stdin) stuecke.push(s);
  return Buffer.concat(stuecke).toString("utf8");
}

/** Aus einer Datei einen Eintrag machen — Frontmatter wird berücksichtigt. */
function ausDatei(pfad) {
  const roh = readFileSync(pfad, "utf8");
  let titel = wert("--titel", ""), text = roh, quelle = wert("--quelle", "nutzer");
  if (roh.startsWith("---")) {
    try {
      const { meta, body } = parseFrontmatter(roh, pfad);
      titel = titel || meta.title || "";
      quelle = meta.source || quelle;
      text = body;
    } catch { /* kein gültiges Frontmatter — dann eben roh */ }
  }
  if (!titel) {
    const erste = text.split("\n").find((z) => z.trim());
    titel = (erste || "").replace(/^#+\s*/, "").trim().slice(0, 90);
  }
  // Überschriften und TODO-Marken tragen nichts zur Einordnung bei
  text = text.replace(/^#+\s.*$/gm, "").replace(/^>\s*TODO:.*$/gim, "").trim();
  return { titel, text, quelle, herkunft: pfad };
}

const eintraege = [];

if (hat("--inbox")) {
  const dir = join(ROOT, "content", "meta", "inbox");
  if (!existsSync(dir)) {
    console.log(`Kein Posteingang unter content/meta/inbox — nichts zu tun.
Rohnotizen können dort abgelegt werden; sie werden nicht in den Index gebaut,
solange die Datei mit _ beginnt oder der Ordner leer ist.`);
    process.exit(0);
  }
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    eintraege.push(ausDatei(join(dir, f)));
  }
  if (!eintraege.length) { console.log("Posteingang ist leer."); process.exit(0); }
} else if (hat("--datei")) {
  const p = wert("--datei", "");
  if (!p || !existsSync(p)) { console.error(`Datei nicht gefunden: ${p}`); process.exit(1); }
  eintraege.push(ausDatei(p));
} else if (hat("--text")) {
  eintraege.push({ titel: wert("--titel", ""), text: wert("--text", ""), quelle: wert("--quelle", "nutzer") });
} else if (hat("--stdin")) {
  eintraege.push({ titel: wert("--titel", ""), text: await stdinLesen(), quelle: wert("--quelle", "nutzer") });
} else {
  console.error("Keine Eingabe. --stdin, --text, --datei oder --inbox angeben (--hilfe zeigt alles).");
  process.exit(1);
}

/* ------------------------------------------------------------- Ausgabe */

const F = {
  fett: (s) => `\x1b[1m${s}\x1b[0m`,
  grau: (s) => `\x1b[90m${s}\x1b[0m`,
  gruen: (s) => `\x1b[32m${s}\x1b[0m`,
  gelb: (s) => `\x1b[33m${s}\x1b[0m`,
  rot: (s) => `\x1b[31m${s}\x1b[0m`,
};

function bericht(e, a) {
  const konf = Math.round(a.konfidenz * 100);
  const farbe = konf > 60 ? F.gruen : konf > 40 ? F.gelb : F.rot;
  console.log("");
  console.log(F.fett(e.titel || "Ohne Titel") + F.grau(`   ${a.wortzahl} Wörter` + (e.herkunft ? `   ${e.herkunft}` : "")));
  console.log("");
  console.log(`  Thema      ${a.topicLabel} ${farbe(konf + " %")}` +
    (a.themenAlternativen.length > 1
      ? F.grau(`   sonst: ${a.themenAlternativen.slice(1).map((t) => `${t.label} ${Math.round(t.anteil * 100)} %`).join(", ")}`)
      : ""));
  console.log(`  Pfad       ${a.pfad}`);
  console.log(`  Stufe      ${a.level} — ${KB.levelNames[a.level]}`);
  console.log(`  Typ        ${a.typ}`);
  console.log(`  Kennung    ${a.id}`);
  console.log(`  Datei      ${a.datei}`);

  const tags = [...new Set([...a.tags.uebernommen, ...a.tags.bekannt, ...a.tags.neu])];
  if (tags.length) {
    console.log(`  Tags       ${tags.join(", ")}` + (a.tags.neu.length ? F.grau(`   (neu: ${a.tags.neu.join(", ")})`) : ""));
  }

  if (a.duplikate.length) {
    console.log("");
    console.log(F.fett("  Gibt es das schon?"));
    for (const d of a.duplikate) {
      const m = d.stufe === "hart" ? F.rot : F.gelb;
      console.log(`    ${m(d.sim.toFixed(2))}  ${d.id}  ${F.grau(d.titel)}`);
    }
  }
  if (a.voraussetzungen.length) {
    console.log("");
    console.log("  prereqs    " + a.voraussetzungen.map((v) => `${v.id} (${v.sim.toFixed(2)})`).join(", "));
  }
  if (a.verwandt.length) {
    console.log("  related    " + a.verwandt.map((v) => `${v.id} (${v.sim.toFixed(2)})`).join(", "));
  }
  if (a.hinweise.length) {
    console.log("");
    for (const h of a.hinweise) console.log(F.gelb("  ! ") + h.replace(/\n/g, " "));
  }
}

let geschrieben = 0;

for (const e of eintraege) {
  const a = K.analysiere(e, KB, index);
  if (a.leer) { console.error(`Übersprungen (leer): ${e.herkunft || e.titel}`); continue; }

  if (hat("--json")) { console.log(JSON.stringify({ eingabe: e, analyse: a }, null, 2)); continue; }
  if (hat("--briefing")) {
    if (eintraege.length > 1) console.log(`\n${"=".repeat(70)}\n`);
    console.log(K.agentenauftrag(e, a, KB));
    continue;
  }

  bericht(e, a);

  if (hat("--schreiben") || hat("--trocken")) {
    const ziel = join(ROOT, wert("--ziel", a.datei));
    const inhalt = K.alsKnoten(e, a);
    if (existsSync(ziel)) {
      console.log("");
      console.log(F.rot(`  Datei existiert bereits: ${ziel}`));
      console.log(F.grau("  Nicht überschrieben. Mit --ziel einen anderen Namen wählen."));
      continue;
    }
    if (hat("--trocken")) {
      console.log("");
      console.log(F.grau(`  --- ${ziel} ---`));
      console.log(inhalt.split("\n").map((z) => "  " + z).join("\n"));
      continue;
    }
    mkdirSync(dirname(ziel), { recursive: true });
    writeFileSync(ziel, inhalt, "utf8");
    geschrieben++;
    console.log("");
    console.log(F.gruen(`  angelegt: ${ziel.replace(ROOT + "/", "")}`));
  }
}

if (!hat("--json") && !hat("--briefing")) {
  console.log("");
  if (geschrieben) {
    console.log(`${geschrieben} Knoten angelegt, alle mit ${F.gelb("status: entwurf")} und einer TODO-Marke.`);
    console.log("Weiter: ausformulieren, Prüffragen ergänzen, dann");
    console.log("  node tools/build.mjs && node tools/test.mjs");
  } else if (!hat("--trocken")) {
    console.log(F.grau("Nur analysiert. --schreiben legt die Datei an, --briefing gibt den Agentenauftrag aus."));
  }
  console.log("");
}
