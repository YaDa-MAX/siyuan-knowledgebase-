#!/usr/bin/env node
/**
 * Regeltest des Dienstplan-Prüfers.
 *
 *   node tools/test-dienstplan.mjs
 *
 * Der Prüfer macht Aussagen über geltendes Recht. Eine Regel, die falsch
 * rechnet, ist schlimmer als eine fehlende: Sie erzeugt ein grünes Ergebnis,
 * auf das sich jemand verlässt. Deshalb steht hinter jeder Regel mindestens
 * ein Fall, der auslösen muss, und einer, der es nicht darf.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// dienstplan.js ist bewusst ein schlichtes Skript ohne Modulsystem, damit es
// per Doppelklick im Browser läuft. Hier wird es mit einem Ersatz-`window`
// ausgeführt — dieselbe Datei, dieselben Regeln.
const ctx = createContext({ window: {} });
runInContext(readFileSync(join(ROOT, "web", "dienstplan.js"), "utf8"), ctx);
const DP = ctx.window.DIENSTPLAN;

const feiertagsDaten = JSON.parse(
  readFileSync(join(ROOT, "content", "_data", "feiertage-de.json"), "utf8")).items;

let bestanden = 0, gescheitert = 0;
const pruefe = (name, bedingung, detail = "") => {
  if (bedingung) { bestanden++; console.log(`  ok    ${name}`); }
  else { gescheitert++; console.log(`  FEHL  ${name}${detail ? "  — " + detail : ""}`); }
};

/** Kurzform: eine Person, eine Liste von Schichten. */
function lauf(schichten, opt = {}) {
  return DP.pruefen({
    gastgewerbe: opt.gastgewerbe ?? true,
    land: opt.land ?? "BY",
    feiertagsDaten,
    personen: [{ id: "x", name: "Testfall", gruppe: opt.gruppe || "erwachsen" }],
    schichten: schichten.map((s) => ({
      person: "x", datum: s[0], von: s[1], bis: s[2], pause: s[3] ?? 30,
    })),
  });
}
const regeln = (e) => e.befunde.map((b) => b.regel + " · " + b.titel);
const hat = (e, teil) => e.befunde.some((b) => (b.regel + " " + b.titel).includes(teil));
const schwere = (e, teil) => e.befunde.find((b) => (b.regel + " " + b.titel).includes(teil))?.schwere;

console.log("\nDienstplan-Prüfer\n");

/* ----------------------------------------------------------- Feiertage */

console.log("Feiertagsberechnung");
pruefe("Ostersonntag 2026 ist der 5. April",
  new Date(DP.ostern(2026)).toISOString().slice(0, 10) === "2026-04-05",
  new Date(DP.ostern(2026)).toISOString().slice(0, 10));
pruefe("Ostersonntag 2027 ist der 28. März",
  new Date(DP.ostern(2027)).toISOString().slice(0, 10) === "2027-03-28",
  new Date(DP.ostern(2027)).toISOString().slice(0, 10));
pruefe("Ostersonntag 2024 ist der 31. März",
  new Date(DP.ostern(2024)).toISOString().slice(0, 10) === "2024-03-31",
  new Date(DP.ostern(2024)).toISOString().slice(0, 10));

const fBY = DP.feiertageFuer(2026, "BY", feiertagsDaten);
const fBE = DP.feiertageFuer(2026, "BE", feiertagsDaten);
pruefe("Neujahr ist bundesweit Feiertag", fBY.get("2026-01-01") === "Neujahr");
pruefe("Karfreitag 2026 fällt auf den 3. April", fBY.get("2026-04-03") === "Karfreitag");
pruefe("Christi Himmelfahrt 2026 fällt auf den 14. Mai", fBY.get("2026-05-14") === "Christi Himmelfahrt");
pruefe("Fronleichnam gilt in Bayern", fBY.has("2026-06-04"), [...fBY.keys()].join(" "));
pruefe("Fronleichnam gilt nicht in Berlin", !fBE.has("2026-06-04"));
pruefe("Frauentag gilt in Berlin", fBE.get("2026-03-08") === "Internationaler Frauentag");
pruefe("Frauentag gilt nicht in Bayern", !fBY.has("2026-03-08"));
pruefe("Heiligabend ist kein gesetzlicher Feiertag", !fBY.has("2026-12-24"));
pruefe("Buß- und Bettag 2026 ist der 18. November (nur SN)",
  DP.feiertageFuer(2026, "SN", feiertagsDaten).get("2026-11-18") === "Buß- und Bettag" && !fBY.has("2026-11-18"));

/* --------------------------------------------------------- Erwachsene */

console.log("\nErwachsene (ArbZG)");

// § 3
pruefe("8-Stunden-Schicht ist unauffällig",
  !hat(lauf([["2026-08-10", "10:00", "18:30", 30]]), "§ 3"),
  regeln(lauf([["2026-08-10", "10:00", "18:30", 30]])).join(" | "));
pruefe("9,5 Stunden erzeugen Ausgleichspflicht, keine Unzulässigkeit",
  schwere(lauf([["2026-08-10", "09:00", "19:00", 30]]), "§ 3 ArbZG") === "pruefen");
pruefe("10,5 Stunden sind unzulässig",
  schwere(lauf([["2026-08-10", "08:00", "19:00", 30]]), "Werktägliche Höchstarbeitszeit") === "unzulaessig");
// Geteilter Dienst — der Normalfall der Hotellerie und die Stelle, an der ein
// naiver Prüfer jeden zweiten Dienstplan fälschlich als rechtswidrig meldet.
const geteilt = [["2026-08-10", "11:00", "14:00", 0], ["2026-08-10", "17:00", "22:00", 0]];
pruefe("geteilter Dienst gilt als ein Arbeitstag, nicht als zwei",
  !hat(lauf(geteilt), "§ 5"), regeln(lauf(geteilt)).join(" | "));
pruefe("die Unterbrechung des geteilten Dienstes deckt die Pausenpflicht",
  !hat(lauf(geteilt), "Ruhepause"));
pruefe("geteilter Dienst wird als Anwesenheitsspanne ausgewiesen",
  schwere(lauf(geteilt), "Geteilter Dienst") === "hinweis");
pruefe("Arbeitszeit beider Teile wird addiert",
  hat(lauf([["2026-08-10", "06:00", "12:00", 0], ["2026-08-10", "15:00", "18:30", 0]]), "Über 8 Stunden") &&
  hat(lauf([["2026-08-10", "06:00", "12:00", 0], ["2026-08-10", "15:00", "22:00", 0]]), "Werktägliche Höchstarbeitszeit"));
pruefe("Ruhezeit wird zwischen Arbeitstagen gemessen, nicht zwischen Teilen",
  hat(lauf([...geteilt, ["2026-08-11", "08:00", "16:00", 30]]), "Verkürzte Ruhezeit") &&
  hat(lauf([...geteilt, ["2026-08-11", "07:00", "15:00", 30]]), "Ruhezeit unter 10 Stunden"));

// § 4
pruefe("7 Stunden ohne Pause verletzen § 4",
  schwere(lauf([["2026-08-10", "10:00", "17:00", 0]]), "Ruhepause zu kurz") === "unzulaessig");
pruefe("7 Stunden mit 30 Minuten Pause sind in Ordnung",
  !hat(lauf([["2026-08-10", "10:00", "17:30", 30]]), "Ruhepause"));
pruefe("9,5 Stunden brauchen 45 Minuten Pause",
  hat(lauf([["2026-08-10", "09:00", "19:00", 30]]), "Ruhepause zu kurz") &&
  !hat(lauf([["2026-08-10", "09:00", "19:15", 45]]), "Ruhepause zu kurz"));
pruefe("6 Stunden brauchen keine Pause",
  !hat(lauf([["2026-08-10", "10:00", "16:00", 0]]), "Ruhepause"));

// § 5
const spaetFrueh = [["2026-08-10", "14:00", "22:30", 30], ["2026-08-11", "08:30", "16:00", 30]];
pruefe("10 Stunden Ruhezeit sind im Gastgewerbe prüfpflichtig, nicht verboten",
  schwere(lauf(spaetFrueh, { gastgewerbe: true }), "Verkürzte Ruhezeit") === "pruefen");
pruefe("dieselben 10 Stunden sind außerhalb des Gastgewerbes unzulässig",
  schwere(lauf(spaetFrueh, { gastgewerbe: false }), "Ruhezeit unter 11 Stunden") === "unzulaessig");
pruefe("unter 10 Stunden ist auch im Gastgewerbe unzulässig",
  schwere(lauf([["2026-08-10", "14:00", "22:30", 30], ["2026-08-11", "08:00", "15:00", 30]]), "Ruhezeit unter 10 Stunden") === "unzulaessig");
pruefe("11 Stunden Ruhezeit lösen nichts aus",
  !hat(lauf([["2026-08-10", "14:00", "22:00", 30], ["2026-08-11", "09:00", "17:00", 30]]), "§ 5"));

// § 5 Abs. 2 — Ausgleichsbilanz
const ohneAusgleich = [
  ["2026-08-10", "14:00", "22:30", 30], ["2026-08-11", "08:30", "16:00", 30],
  ["2026-08-12", "14:00", "22:30", 30], ["2026-08-13", "08:30", "16:00", 30],
];
pruefe("zwei Verkürzungen ohne 12-Stunden-Ruhezeit melden fehlenden Ausgleich",
  schwere(lauf(ohneAusgleich), "Ausgleich fehlt") === "unzulaessig");
const mitAusgleich = [
  ["2026-08-10", "14:00", "22:30", 30], ["2026-08-11", "08:30", "16:00", 30],
  ["2026-08-13", "10:00", "18:00", 30],                       // Ruhezeit > 12 h
];
pruefe("eine Verkürzung mit anschließender 12-Stunden-Ruhezeit ist gedeckt",
  !hat(lauf(mitAusgleich), "Ausgleich fehlt"),
  regeln(lauf(mitAusgleich)).join(" | "));

// § 6
pruefe("Nachtschicht wird erkannt",
  hat(lauf([["2026-08-10", "20:00", "04:00", 30]]), "Nachtschicht"));
pruefe("Spätschicht bis 22:30 ist keine Nachtarbeit",
  !hat(lauf([["2026-08-10", "14:00", "22:30", 30]]), "Nachtschicht"));

// §§ 9–11
pruefe("Sonntagsarbeit außerhalb des Gastgewerbes ist unzulässig",
  schwere(lauf([["2026-08-09", "10:00", "16:00", 30]], { gastgewerbe: false }), "§ 9") === "unzulaessig");
pruefe("Sonntagsarbeit im Gastgewerbe ist zulässig",
  schwere(lauf([["2026-08-09", "10:00", "16:00", 30]], { gastgewerbe: true }), "§ 10") === "hinweis");
pruefe("Feiertagsarbeit außerhalb des Gastgewerbes ist unzulässig",
  hat(lauf([["2026-10-03", "10:00", "16:00", 30]], { gastgewerbe: false }), "§ 9"));

// Woche
const sechsMalZehn = Array.from({ length: 6 }, (_, i) =>
  [`2026-08-${10 + i}`, "08:00", "19:00", 60]);
pruefe("60 Stunden in der Woche gelten als Spitze, nicht als Verstoß",
  !hat(lauf(sechsMalZehn), "über 60 Stunden") && hat(lauf(sechsMalZehn), "über 48 Stunden"));

/* -------------------------------------------------------- Jugendliche */

console.log("\nJugendliche (JArbSchG)");
const J = { gruppe: "jugend16", gastgewerbe: true };
const J15 = { gruppe: "jugend15", gastgewerbe: true };

pruefe("Schicht bis 22 Uhr ist ab 16 im Gastgewerbe zulässig",
  !hat(lauf([["2026-08-10", "13:00", "22:00", 60]], J), "§ 14"),
  regeln(lauf([["2026-08-10", "13:00", "22:00", 60]], J)).join(" | "));
pruefe("dieselbe Schicht ist mit 15 Jahren unzulässig",
  hat(lauf([["2026-08-10", "13:00", "22:00", 60]], J15), "§ 14"));
pruefe("Ende um 22:30 ist auch ab 16 unzulässig",
  hat(lauf([["2026-08-10", "13:00", "22:30", 60]], J), "§ 14"));
pruefe("Beginn um 5 Uhr ist unzulässig",
  hat(lauf([["2026-08-10", "05:00", "12:00", 60]], J), "Beginn vor 6 Uhr"));
pruefe("Schicht bis 20 Uhr ist auch außerhalb des Gastgewerbes zulässig",
  !hat(lauf([["2026-08-10", "12:00", "20:00", 60]], { gruppe: "jugend16", gastgewerbe: false }), "§ 14"));

pruefe("über 6 Stunden brauchen 60 Minuten Pause",
  hat(lauf([["2026-08-10", "12:00", "19:00", 30]], J), "Ruhepause zu kurz") &&
  !hat(lauf([["2026-08-10", "12:00", "19:00", 60]], J), "Ruhepause zu kurz"));
pruefe("5 Stunden brauchen 30 Minuten Pause",
  hat(lauf([["2026-08-10", "12:00", "17:00", 0]], J), "Ruhepause zu kurz"));
pruefe("Schichtzeit über 11 Stunden ist auch im Gastgewerbe unzulässig",
  hat(lauf([["2026-08-10", "09:00", "20:30", 120]], J), "Schichtzeit"));
pruefe("Schichtzeit von 10,5 Stunden ist im Gastgewerbe zulässig, sonst nicht",
  !hat(lauf([["2026-08-10", "09:30", "20:00", 150]], J), "Schichtzeit") &&
  hat(lauf([["2026-08-10", "09:30", "20:00", 150]], { gruppe: "jugend16", gastgewerbe: false }), "Schichtzeit"));

pruefe("Freizeit von 11 Stunden ist für Jugendliche zu kurz",
  hat(lauf([["2026-08-10", "12:00", "20:00", 60], ["2026-08-11", "07:00", "14:00", 60]], J), "Freizeit unter 12"));
pruefe("Freizeit von 12 Stunden genügt",
  !hat(lauf([["2026-08-10", "12:00", "20:00", 60], ["2026-08-11", "08:00", "15:00", 60]], J), "Freizeit unter 12"));

pruefe("sechs Arbeitstage in einer Woche sind unzulässig",
  hat(lauf(Array.from({ length: 6 }, (_, i) => [`2026-08-${10 + i}`, "12:00", "18:00", 60]), J), "§ 15"));
pruefe("fünf Arbeitstage sind zulässig",
  !hat(lauf(Array.from({ length: 5 }, (_, i) => [`2026-08-${10 + i}`, "12:00", "18:00", 60]), J), "§ 15"));
// Bei Jugendlichen zählt die Unterbrechung in die Schichtzeit hinein — 11 bis 22 Uhr
// sind exakt die zulässigen 11 Stunden, eine halbe Stunde früher beginnen sprengt sie.
pruefe("geteilter Dienst von genau 11 Stunden ist ab 16 im Gastgewerbe zulässig",
  !hat(lauf(geteilt, J), "§ 12"), regeln(lauf(geteilt, J)).join(" | "));
pruefe("eine halbe Stunde mehr Spanne sprengt die Schichtzeit Jugendlicher",
  hat(lauf([["2026-08-10", "10:30", "14:00", 0], ["2026-08-10", "17:00", "22:00", 0]], J), "§ 12"));

pruefe("41 Stunden in der Woche sind unzulässig",
  hat(lauf(Array.from({ length: 5 }, (_, i) => [`2026-08-${10 + i}`, "09:00", "18:15", 60]), J), "Wochenarbeitszeit"));
pruefe("8,5 Stunden am Tag sind ausgleichspflichtig, 9 Stunden unzulässig",
  schwere(lauf([["2026-08-10", "09:00", "18:00", 30]], J), "§ 8") === "pruefen" &&
  schwere(lauf([["2026-08-10", "09:00", "18:30", 30]], J), "§ 8") === "unzulaessig");

pruefe("1. Mai ist für Jugendliche absolut gesperrt — auch im Gastgewerbe",
  schwere(lauf([["2026-05-01", "12:00", "18:00", 60]], J), "Absolutes Beschäftigungsverbot") === "unzulaessig");
pruefe("Ostersonntag ist absolut gesperrt",
  hat(lauf([["2026-04-05", "12:00", "18:00", 60]], J), "Absolutes Beschäftigungsverbot"));
pruefe("Tag der Deutschen Einheit ist im Gastgewerbe nur ein Hinweis",
  schwere(lauf([["2026-10-03", "12:00", "18:00", 60]], J), "Feiertagsarbeit") === "hinweis");
pruefe("derselbe Feiertag ist außerhalb des Gastgewerbes unzulässig",
  schwere(lauf([["2026-10-03", "12:00", "18:00", 60]], { gruppe: "jugend16", gastgewerbe: false }), "Feiertagsarbeit") === "unzulaessig");
pruefe("Heiligabend nach 14 Uhr ist gesperrt",
  hat(lauf([["2026-12-24", "10:00", "16:00", 30]], J), "nach 14 Uhr") &&
  !hat(lauf([["2026-12-24", "08:00", "13:30", 30]], J), "nach 14 Uhr"));

pruefe("Samstagsarbeit außerhalb des Gastgewerbes ist unzulässig",
  hat(lauf([["2026-08-08", "12:00", "18:00", 60]], { gruppe: "jugend16", gastgewerbe: false }), "§ 16"));
pruefe("Sonntagsarbeit außerhalb des Gastgewerbes ist unzulässig",
  hat(lauf([["2026-08-09", "12:00", "18:00", 60]], { gruppe: "jugend16", gastgewerbe: false }), "§ 17"));

/* ------------------------------------------------------------- Rahmen */

console.log("\nRahmen");
pruefe("Schicht über Mitternacht wird richtig gerechnet",
  Math.abs(lauf([["2026-08-10", "20:00", "02:00", 30]]).schichten[0].arbeit - 330) < 0.01,
  String(lauf([["2026-08-10", "20:00", "02:00", 30]]).schichten[0].arbeit));
pruefe("leere Eingabe erzeugt keine Befunde", lauf([]).befunde.length === 0);
pruefe("Grenzen werden immer mitgeliefert", lauf([]).grenzen.length >= 6);
pruefe("Kennzahlen zählen Schichten und Stunden",
  lauf([["2026-08-10", "10:00", "18:30", 30]]).kennzahlen.schichten === 1 &&
  Math.abs(lauf([["2026-08-10", "10:00", "18:30", 30]]).kennzahlen.stunden - 8) < 0.01);
pruefe("jeder Befund nennt Paragraf und Titel",
  lauf(ohneAusgleich).befunde.every((b) => b.regel && b.titel && b.text));
pruefe("Befunde sind nach Schwere sortiert",
  (() => {
    const e = lauf(ohneAusgleich).befunde.map((b) => DP.SCHWERE.indexOf(b.schwere));
    return e.every((v, i) => i === 0 || e[i - 1] <= v);
  })());

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert\n`);
process.exit(gescheitert ? 1 : 0);
