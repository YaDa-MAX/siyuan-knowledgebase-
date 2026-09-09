/*
   smoke.mjs — Browsertest der Oberfläche

   Optional. Braucht als einziges Werkzeug im Projekt eine externe Abhängigkeit
   (Playwright) und wird deshalb NICHT von test.mjs aufgerufen. Fehlt Playwright,
   endet dieser Test mit einem Hinweis und ohne Fehler — das Archiv selbst bleibt
   abhängigkeitsfrei.

       node tools/smoke.mjs            alle Prüfungen
       node tools/smoke.mjs --grafik   nur die Fachgrafiken

   Er prüft drei Dinge, die ein Node-Test grundsätzlich nicht sehen kann:

   1. Läuft die App überhaupt — ohne Konsolenfehler, mit allen Ansichten.
   2. Rendert jede Fachgrafik ein SVG mit plausiblen Maßen statt einer Fehlerbox.
   3. Überlappen sich Beschriftungen? Das war bisher Augenmaß am Screenshot und
      damit die einzige Qualität im Projekt, die niemand nachprüfen konnte.
      getBBox() im echten Browser kennt die tatsächlichen Textmaße.
*/

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nurGrafik = process.argv.includes("--grafik");

/* Playwright wird üblicherweise global installiert, und global installierte
   Module findet Node beim ESM-Import nicht von selbst. Deshalb zusätzlich
   dort nachsehen, wo npm sie ablegt — sonst überspringt sich der Test
   stillschweigend, obwohl er laufen könnte. */
async function ladePlaywright() {
  const orte = ["playwright"];
  try {
    const { execSync } = await import("node:child_process");
    const global = execSync("npm root -g", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (global) orte.push(pathToFileURL(resolve(global, "playwright/index.mjs")).href);
  } catch { /* npm nicht da: dann eben nur der normale Weg */ }
  if (process.env.PLAYWRIGHT_MODUL) orte.unshift(process.env.PLAYWRIGHT_MODUL);

  for (const ort of orte) {
    try { return (await import(ort)).chromium; } catch { /* nächster Ort */ }
  }
  return null;
}

const chromium = await ladePlaywright();
if (!chromium) {
  console.log("\n  Playwright nicht gefunden — Browsertest übersprungen.");
  console.log("  Das ist kein Fehler: node tools/test.mjs deckt die Regeln ab.");
  console.log("  Nachrüsten: npm i -g playwright  (oder PLAYWRIGHT_MODUL=<pfad> setzen)\n");
  process.exit(0);
}

/* --------------------------------------------------------------- Rahmen */

let bestanden = 0;
const fehler = [];

function pruefe(name, bedingung, detail) {
  if (bedingung) {
    bestanden++;
    console.log(`  ok    ${name}`);
  } else {
    fehler.push(name + (detail ? ` — ${detail}` : ""));
    console.log(`  FEHL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/* Welche Grafik wird in welchem Knoten gezeigt? Nicht neben dem Build her neu
   parsen, sondern dessen Ergebnis lesen: Der Build hat die :::-Blöcke bereits
   ausgewertet und dabei Codebeispiele ausgeschlossen. Ein zweiter, eigener
   Parser wäre eine zweite Wahrheit — und die wäre irgendwann die falsche. */
function grafikOrte() {
  const quelle = readFileSync(resolve(wurzel, "web/kb-data.js"), "utf8");
  const KB = new Function(`const window={};${quelle};return window.KB;`)();
  const orte = new Map();
  for (const k of KB.nodes) {
    for (const v of k.viz || []) {
      const spec = String(v.name || "").trim();
      if (!spec || spec.startsWith("dataset:")) continue;
      if (!orte.has(spec)) orte.set(spec, k.id);
    }
  }
  return orte;
}

/* Zwei Textrahmen gelten als Kollision, wenn sie sich in beiden Achsen
   deutlich überschneiden. Toleranz, weil Schriftrahmen oben und unten
   Luft enthalten, die optisch nicht zum Zeichen gehört. */
const TOL = 1.5;

function ueberlappung(a, b) {
  const x = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const y = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return x > TOL && y > TOL ? { x, y } : null;
}

/* ---------------------------------------------------------------- Start */

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PFAD || "/opt/pw-browsers/chromium",
});
const seite = await browser.newPage({ viewport: { width: 1280, height: 960 } });

const konsole = [];
seite.on("console", (m) => m.type() === "error" && konsole.push(m.text()));
seite.on("pageerror", (e) => konsole.push(String(e)));

await seite.goto(pathToFileURL(resolve(wurzel, "web/index.html")).href);
await seite.waitForTimeout(500);

console.log("\nGrundlage");

const stats = await seite.evaluate(() => window.KB && window.KB.stats);
pruefe("App lädt und kennt den Index", !!stats && stats.nodes > 0,
  stats ? `${stats.nodes} Knoten` : "window.KB fehlt");
pruefe("keine Konsolenfehler beim Start", konsole.length === 0, konsole[0]);

/* ------------------------------------------------------------- Grafiken */

console.log("\nFachgrafiken");

const orte = grafikOrte();

/* Manche Grafiken sind unter zwei Namen erreichbar (exposure-triangle und
   belichtungsdreieck sind dieselbe Funktion). Gefragt ist, ob jede *Grafik*
   gezeigt wird, nicht jeder Name — sonst hinge das Ergebnis daran, welchen
   Alias die Registrierung zufällig zuerst nennt. Deshalb nach Funktion
   gruppieren und Namensgruppen prüfen. */
const gruppen = await seite.evaluate(() => {
  const nachFn = new Map();
  for (const [name, fn] of Object.entries(window.VIZ.benannt)) {
    if (!nachFn.has(fn)) nachFn.set(fn, []);
    nachFn.get(fn).push(name);
  }
  return [...nachFn.values()];
});

const unbenutzt = gruppen.filter((namen) => !namen.some((n) => orte.has(n)));
pruefe("jede registrierte Grafik wird irgendwo gezeigt", unbenutzt.length === 0,
  unbenutzt.map((n) => n.join("/")).join(", "));

const kollisionen = [];
let geprueft = 0;

for (const [name, knoten] of orte) {
  const vorher = konsole.length;
  await seite.evaluate((h) => { location.hash = h; }, "wissen/" + knoten);
  await seite.waitForTimeout(260);

  const messung = await seite.evaluate((spec) => {
    const figuren = [...document.querySelectorAll("article.knoten figure.viz")];
    const fig = figuren.find((f) => (f.dataset.spec || "").trim() === spec) || figuren[0];
    if (!fig) return { fehlt: true };
    const svg = fig.querySelector("svg");
    if (!svg) return { keinSvg: true, text: fig.textContent.slice(0, 120) };

    const vb = (svg.getAttribute("viewBox") || "").split(/\s+/).map(Number);

    /* getBoundingClientRect statt getBBox: Es liefert den Rahmen NACH allen
       Transformationen. Für eine um 90° gedrehte Beschriftung ist das die
       schmale Spalte, die sie tatsächlich einnimmt — getBBox liefert dafür
       den ungedrehten, breiten Balken und würde jede senkrechte Achsen-
       beschriftung als Kollision melden. */
    const texte = [...svg.querySelectorAll("text")]
      .filter((t) => t.textContent.trim() && +(t.getAttribute("opacity") ?? 1) > 0.15)
      .map((t) => {
        const r = t.getBoundingClientRect();
        return { s: t.textContent.trim().slice(0, 34),
                 x: r.left, y: r.top, w: r.width, h: r.height };
      })
      .filter((t) => t.w > 0 && t.h > 0);

    return { vb, texte, hatCaption: !!fig.querySelector("figcaption") };
  }, name);

  geprueft++;

  if (messung.fehlt || messung.keinSvg) {
    pruefe(`${name} rendert ein SVG`, false,
      messung.fehlt ? `keine figure.viz in ${knoten}` : messung.text);
    continue;
  }

  const [, , bb, hh] = messung.vb;
  const masseOk = bb >= 200 && bb <= 1400 && hh >= 100 && hh <= 900;
  const neueFehler = konsole.length - vorher;

  const kandidaten = messung.texte;
  const treffer = [];
  for (let i = 0; i < kandidaten.length; i++) {
    for (let j = i + 1; j < kandidaten.length; j++) {
      const u = ueberlappung(kandidaten[i], kandidaten[j]);
      if (u) treffer.push(`„${kandidaten[i].s}" × „${kandidaten[j].s}" ` +
        `(${u.x.toFixed(1)}×${u.y.toFixed(1)} px)`);
    }
  }
  if (treffer.length) kollisionen.push({ name, knoten, treffer });

  pruefe(`${name}`,
    masseOk && neueFehler === 0 && messung.hatCaption && treffer.length === 0,
    !masseOk ? `viewBox ${bb}×${hh}`
      : neueFehler ? konsole[konsole.length - 1]
      : !messung.hatCaption ? "keine Bildunterschrift"
      : `${treffer.length} Textkollision${treffer.length > 1 ? "en" : ""}`);
}

console.log(`  Hinweis: ${geprueft} Grafiken gerendert, ` +
  (kollisionen.length
    ? `${kollisionen.length} mit überlappenden Beschriftungen.`
    : "alle Beschriftungen überlappungsfrei."));

if (kollisionen.length) {
  console.log("\n  Kollisionen im Detail:");
  for (const k of kollisionen) {
    console.log(`    ${k.name} (${k.knoten}):`);
    for (const t of k.treffer.slice(0, 6)) console.log(`      ${t}`);
    if (k.treffer.length > 6) console.log(`      … und ${k.treffer.length - 6} weitere`);
  }
}

/* -------------------------------------------------------------- Ansichten */

if (!nurGrafik) {
  console.log("\nAnsichten");

  const ansichten = [
    ["Startseite", ""],
    ["Wissensknoten", "wissen/hotelabr-ledger"],
    ["Lernmodus", "lernen"],
    ["Kartenansicht", "karte"],
    ["Organisation", "organisation"],
    ["Lückenliste", "luecken"],
    ["Suche", "suche/ledger"],
    ["Einspeisen", "einspeisen"],
    ["Dienstplan-Prüfer", "dienstplan"],
    ["Tresor", "tresor"],
  ];

  for (const [titel, hash, sel = "#app"] of ansichten) {
    const vorher = konsole.length;
    await seite.evaluate((h) => { location.hash = h; }, hash);
    await seite.waitForTimeout(300);
    const inhalt = await seite.evaluate((s) => {
      const el = document.querySelector(s.split(",")[0].trim());
      return el ? el.textContent.trim().length : 0;
    }, sel);
    pruefe(`${titel} zeigt Inhalt`, inhalt > 80 && konsole.length === vorher,
      konsole.length !== vorher ? konsole[konsole.length - 1] : `${inhalt} Zeichen`);
  }

  /* Der Kurator im Browser: Text eingeben, Vorschlag erwarten. */
  console.log("\nKurator in der Oberfläche");
  await seite.evaluate((h) => { location.hash = h; }, "einspeisen");
  await seite.waitForTimeout(300);

  const feld = seite.locator("#e-text");
  const daIst = await feld.count();
  if (daIst) {
    await feld.fill(
      "Beim Nachtlauf ist aufgefallen, dass eine Anzahlung im Deposit Ledger " +
      "stehen blieb, obwohl der Gast längst abgereist ist. Der Transaktionscode " +
      "war falsch zugeordnet und der Betrag wurde nie ins Guest Ledger übertragen."
    );
    await seite.waitForTimeout(600);
    const vorschlag = await seite.evaluate(() => {
      const el = document.querySelector("#e-ergebnis");
      return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    });
    pruefe("Kurator schlägt live eine Einordnung vor", vorschlag.length > 40,
      vorschlag.slice(0, 90) || "keine Analyse");
    pruefe("Vorschlag trifft das Themengebiet", /Hotelabrechnung/i.test(vorschlag),
      vorschlag.slice(0, 140));
  } else {
    pruefe("Eingabefeld für neues Wissen vorhanden", false, "#e-text fehlt");
  }
}

/* ---------------------------------------------------------------- Ende */

await browser.close();

console.log(`\n${bestanden} bestanden, ${fehler.length} gescheitert\n`);
if (fehler.length) process.exit(1);
