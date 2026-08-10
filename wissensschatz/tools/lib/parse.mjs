/**
 * Minimaler, abhängigkeitsfreier Parser für Wissensknoten.
 *
 * Bewusst simpel gehalten: Dieses Archiv soll in 40 Jahren noch lesbar sein.
 * Deshalb kein YAML-Paket, kein Markdown-Paket — nur Text, den auch ein
 * Mensch ohne Toolchain versteht.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/** Erlaubte Werte, gegen die validiert wird. */
export const TYPES = ["theorie", "technik", "referenz", "rezept", "recht", "checkliste", "meta"];
export const SOURCES = ["ki", "nutzer", "gemischt"];
export const STATUS = ["entwurf", "geprueft", "veraltet"];
export const LEVEL_NAMES = {
  1: "Einstieg",
  2: "Anwender",
  3: "Fortgeschritten",
  4: "Profi",
  5: "Experte",
};

/**
 * Frontmatter-Syntax (zwischen `---`-Zeilen):
 *   key: wert
 *   key: [a, b, c]
 *   key: >
 *     mehrzeiliger Text
 */
export function parseFrontmatter(raw, file) {
  if (!raw.startsWith("---")) {
    throw new Error(`${file}: Frontmatter fehlt (Datei muss mit '---' beginnen)`);
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) throw new Error(`${file}: Frontmatter wird nicht geschlossen`);

  const head = raw.slice(4, end);
  const body = raw.slice(raw.indexOf("\n", end + 1) + 1);
  const meta = {};

  const lines = head.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) throw new Error(`${file}: Frontmatter-Zeile nicht lesbar: "${line}"`);
    const [, key, rest] = m;

    if (rest === ">" || rest === "|") {
      const buf = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) buf.push(lines[++i].trim());
      meta[key] = buf.join(rest === ">" ? " " : "\n");
    } else if (rest.startsWith("[")) {
      meta[key] = rest
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      meta[key] = rest.trim().replace(/^["']|["']$/g, "");
    }
  }
  return { meta, body };
}

/**
 * Blöcke aus dem Fließtext ziehen:
 *   ::: quiz
 *   F: Frage
 *   A: Antwort
 *   :::
 *   ::: viz exposure-triangle
 *   ::: warn
 *   Text
 *   :::
 */
export function extractBlocks(body) {
  const quiz = [];
  const viz = [];
  const text = body.replace(/^:::[ \t]*(\w[\w-]*)[ \t]*([^\n]*)\n([\s\S]*?)^:::[ \t]*$/gm, (all, kind, arg, inner) => {
    if (kind === "quiz") {
      const pairs = inner.split(/\n(?=F:)/);
      for (const p of pairs) {
        const q = p.match(/F:\s*([\s\S]*?)(?:\nA:\s*([\s\S]*))?$/);
        if (q && q[1] && q[2]) quiz.push({ q: q[1].trim(), a: q[2].trim() });
      }
      return ""; // Quiz erscheint in der App als Lernkarte, nicht im Fließtext
    }
    if (kind === "viz") {
      viz.push({ name: arg.trim(), caption: inner.trim() });
      return `\n@@VIZ:${viz.length - 1}@@\n`;
    }
    return all;
  });
  return { text, quiz, viz };
}

/** Alle .md-Dateien unterhalb von dir einsammeln. */
export function walk(dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".md") && !name.startsWith("_")) out.push(full);
  }
  return out;
}

/** Eine Datei -> Knoten. */
export function loadNode(file, contentRoot) {
  const raw = readFileSync(file, "utf8");
  const { meta, body } = parseFrontmatter(raw, file);
  const { text, quiz, viz } = extractBlocks(body);
  const rel = relative(contentRoot, file).split(sep).join("/");

  const missing = ["id", "title", "path", "level"].filter((k) => !meta[k]);
  if (missing.length) throw new Error(`${rel}: Pflichtfelder fehlen: ${missing.join(", ")}`);

  const level = Number(meta.level);
  if (!(level >= 1 && level <= 5)) throw new Error(`${rel}: level muss 1..5 sein, ist "${meta.level}"`);

  const type = meta.type || "theorie";
  if (!TYPES.includes(type)) throw new Error(`${rel}: unbekannter type "${type}" (erlaubt: ${TYPES.join(", ")})`);

  const source = meta.source || "ki";
  if (!SOURCES.includes(source)) throw new Error(`${rel}: unbekannte source "${source}"`);

  const status = meta.status || "entwurf";
  if (!STATUS.includes(status)) throw new Error(`${rel}: unbekannter status "${status}"`);

  const path = String(meta.path).replace(/^\/+|\/+$/g, "");

  return {
    id: String(meta.id),
    title: String(meta.title),
    path,
    topic: path.split("/")[0],
    declaredLevel: level,
    level, // wird vom Rebalancer überschrieben
    tags: meta.tags || [],
    prereqs: meta.prereqs || [],
    related: meta.related || [],
    type,
    source,
    status,
    updated: meta.updated || "",
    summary: meta.summary || "",
    body: text.trim(),
    quiz,
    viz,
    file: rel,
    words: text.split(/\s+/).filter(Boolean).length,
  };
}
