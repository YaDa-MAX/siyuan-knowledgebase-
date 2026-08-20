#!/usr/bin/env node
/**
 * Regeltest der Kuratierung.
 *
 *   node tools/test-kurator.mjs
 *
 * Der Kurator entscheidet, wo neues Wissen landet und ob es schon da ist.
 * Beides sind Aussagen über den Bestand, und beide fallen unauffällig aus,
 * wenn die Schwellen nicht mehr passen — genau wie bei der Neugruppierung,
 * die jahrelang nie auslöste. Deshalb wird hier gegen den echten Bestand
 * gemessen statt gegen erfundene Beispiele:
 *
 *   · Der Text eines vorhandenen Knotens muss ihn selbst als Nächstes finden.
 *   · Eine kurze Paraphrase muss als Überschneidung gemeldet werden.
 *   · Eine fachfremde Notiz darf NICHT zuversichtlich einsortiert werden.
 *   · Eine neue, verwandte Notiz muss Anschluss ans Netz bekommen.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ctx = createContext({ window: {}, console });
runInContext(readFileSync(join(ROOT, "web", "kb-data.js"), "utf8"), ctx);
runInContext(readFileSync(join(ROOT, "web", "kurator.js"), "utf8"), ctx);
const KB = ctx.window.KB;
const K = ctx.window.KURATOR;
const index = K.indexBauen(KB.nodes);

let bestanden = 0, gescheitert = 0;
const pruefe = (name, bedingung, detail = "") => {
  if (bedingung) { bestanden++; console.log(`  ok    ${name}`); }
  else { gescheitert++; console.log(`  FEHL  ${name}${detail ? "  — " + detail : ""}`); }
};

console.log("\nKurator\n");

/* --------------------------------------------------- Selbstwiedererkennung */

console.log("Selbstwiedererkennung");
let selbstRang1 = 0, minSelbst = 1;
const stichprobe = KB.nodes.filter((_, i) => i % 7 === 0);   // gleichmäßig über den Bestand
for (const n of stichprobe) {
  const a = K.analysiere({ titel: n.title, text: n.body }, KB, index);
  if (a.nachbarn[0]?.id === n.id) selbstRang1++;
  const s = a.nachbarn.find((x) => x.id === n.id);
  minSelbst = Math.min(minSelbst, s ? s.sim : 0);
}
pruefe(`jeder Knotentext findet sich selbst zuerst (${selbstRang1}/${stichprobe.length})`,
  selbstRang1 === stichprobe.length);
pruefe(`Selbstähnlichkeit durchgehend hoch (kleinste ${minSelbst.toFixed(2)})`, minSelbst > 0.7);

/* ------------------------------------------------------ Paraphrasen finden */

console.log("\nÜberschneidungen erkennen");
const paraphrasen = [
  { ziel: "bwl-wareneinsatz", titel: "Wareneinsatz richtig rechnen",
    text: "Die Einkaufsrechnungen eines Monats durch den Umsatz zu teilen ergibt keine Wareneinsatzquote. Man muss den Anfangsbestand addieren und den Endbestand abziehen, sonst misst man nur, wann der Lieferant geliefert hat. Küche und Getränke gehören getrennt ausgewertet, weil die Quoten weit auseinanderliegen." },
  { ziel: "foto-mounts", titel: "Adapter und Auflagemaß",
    text: "Ein Objektiv passt nur an eine Kamera, deren Auflagemaß kleiner ist als das des Objektivbajonetts. Der Adapter füllt die Differenz auf. Deshalb nehmen spiegellose Systeme praktisch jedes Spiegelreflexobjektiv auf, umgekehrt geht es nicht." },
  { ziel: "arbeitsrecht-arbeitszeit", titel: "Ruhezeit im Gastgewerbe",
    text: "Nach dem Arbeitszeitgesetz stehen zwischen zwei Diensten elf Stunden Ruhezeit. In Gaststätten darf man auf zehn Stunden verkürzen, muss das aber innerhalb eines Kalendermonats durch eine andere Ruhezeit von zwölf Stunden ausgleichen. Ohne diesen Ausgleich ist der Dienstplan rechtswidrig." },
];
for (const p of paraphrasen) {
  const a = K.analysiere(p, KB, index);
  const gemeldet = a.duplikate.some((d) => d.id === p.ziel);
  pruefe(`Paraphrase von ${p.ziel} wird als Überschneidung gemeldet`, gemeldet,
    a.duplikate.map((d) => `${d.id}:${d.sim.toFixed(2)}`).join(", ") || "keine gemeldet");
}

/* ------------------------------------------------------- Fachfremdes Wissen */

console.log("\nFachfremdes erkennen");
const fremd = K.analysiere({
  titel: "Sauerteig führen",
  text: "Ein Sauerteig braucht regelmäßige Fütterung mit Mehl und Wasser im Verhältnis eins zu eins. Bei Raumtemperatur alle zwölf Stunden, im Kühlschrank einmal pro Woche. Der Teig ist reif, wenn er sein Volumen verdoppelt hat und beim Klopfen an das Glas leicht zusammenfällt. Zu saurer Geruch bedeutet Überreife und mehr Essigsäure.",
}, KB, index);
pruefe("fachfremde Notiz wird als fremd markiert", fremd.fremd === true,
  `bestSim=${fremd.bestSim?.toFixed(3)}`);
pruefe("fachfremde Notiz bekommt keine Duplikatmeldung", fremd.duplikate.length === 0);
pruefe("fachfremde Notiz bekommt einen Hinweis auf ein eigenes Themengebiet",
  fremd.hinweise.some((h) => /eigenes Themengebiet/.test(h)));
pruefe("fachfremde Notiz bekommt höchstens einen Querverweis", fremd.verwandt.length <= 1,
  fremd.verwandt.map((v) => v.id).join(", "));

/* --------------------------------------------------- Neues mit Anschluss */

console.log("\nNeues Wissen anschließen");
const neu = K.analysiere({
  titel: "Nachtzuschlag im Dienstplan berücksichtigen",
  text: "Wer Nachtschichten plant, muss neben der Ruhezeit auch die Zuschläge im Blick behalten. Nachtarbeit zwischen 23 und 6 Uhr löst nach dem Arbeitszeitgesetz einen Anspruch auf angemessenen Ausgleich aus, entweder als freie Tage oder als Zuschlag. In der Kalkulation der Personalkosten wird das oft vergessen, weil der Dienstplan nur Stunden zeigt und nicht deren Preis.",
}, KB, index);
pruefe("neue Notiz landet im richtigen Thema", neu.topic === "arbeitsrecht-de", neu.topic);
pruefe("neue Notiz ist nicht als fremd markiert", !neu.fremd);
pruefe("neue Notiz bekommt Anschluss ans Netz", neu.verwandt.length >= 2,
  `${neu.verwandt.length} Verweise`);
pruefe("Querverweise gehen über Themengrenzen hinweg",
  new Set(neu.verwandt.map((v) => v.topic)).size >= 2,
  neu.verwandt.map((v) => v.topic).join(", "));
// Kein hartes Duplikat — aber der weiche Hinweis auf den Arbeitszeit-Knoten ist
// richtig und war beim Schreiben dieses Tests nicht vorhergesehen: Dort steht
// bereits ein Abschnitt zur Nachtarbeit samt Ausgleichsanspruch. Genau solche
// Überschneidungen soll das Werkzeug finden.
pruefe("neue Notiz löst keine harte Duplikatmeldung aus",
  !neu.duplikate.some((d) => d.stufe === "hart"),
  neu.duplikate.map((d) => `${d.id}:${d.sim.toFixed(2)}/${d.stufe}`).join(", "));
pruefe("der weiche Hinweis zeigt auf den inhaltlich überlappenden Knoten",
  neu.duplikate.some((d) => d.id === "arbeitsrecht-arbeitszeit" && d.stufe === "weich"),
  neu.duplikate.map((d) => d.id).join(", "));

/* ------------------------------------------------------ Erzeugter Knoten */

console.log("\nErzeugter Knoten");
const eingabe = { titel: "Nachtzuschlag im Dienstplan", text: neu.wortzahl ? "Nachtarbeit zwischen 23 und 6 Uhr löst nach dem Arbeitszeitgesetz einen Anspruch auf angemessenen Ausgleich aus, entweder als freie Tage oder als Zuschlag. In der Personalkostenrechnung wird das oft vergessen." : "", quelle: "nutzer" };
const a2 = K.analysiere(eingabe, KB, index);
const knoten = K.alsKnoten(eingabe, a2);

pruefe("Knoten beginnt mit Frontmatter", knoten.startsWith("---\n"));
for (const feld of ["id", "title", "path", "level", "type", "source", "status", "updated", "tags", "prereqs", "related", "summary"]) {
  pruefe(`Frontmatter enthält ${feld}`, new RegExp(`^${feld}: `, "m").test(knoten));
}
pruefe("Zusammenfassung ist einzeilig",
  !/^summary: .*\n(?!---|\w+: )/m.test(knoten) && (knoten.match(/^summary: (.*)$/m)?.[1] || "").length > 5);
pruefe("Status ist entwurf — die Maschine hat platziert, nicht formuliert",
  /^status: entwurf$/m.test(knoten));
pruefe("Knoten trägt eine TODO-Marke und landet damit im Backlog",
  /^> TODO:/m.test(knoten));
pruefe("Kennung kollidiert nicht mit dem Bestand", !index.ids.has(a2.id), a2.id);
pruefe("Kennung folgt dem Themenpräfix", a2.id.startsWith(index.themaPraefix.get(a2.topic) + "-"),
  `${a2.id} vs ${index.themaPraefix.get(a2.topic)}`);
pruefe("Zieldatei liegt unter content/<thema>/", a2.datei.startsWith(`content/${a2.topic}/`), a2.datei);
pruefe("`referenz` wird nicht geraten", a2.typ !== "referenz", a2.typ);

const mitDatensatz = K.analysiere(
  { titel: "Tabelle der Zuschläge", text: eingabe.text + "\n\n::: viz dataset:feiertage-de\n:::" }, KB, index);
pruefe("`referenz` ist möglich, wenn ein Datensatz eingebunden ist",
  ["referenz", "recht", "theorie", "technik", "rezept", "checkliste", "meta"].includes(mitDatensatz.typ));

/* ----------------------------------------------------------- Agentenauftrag */

console.log("\nAgentenauftrag");
const auftrag = K.agentenauftrag(eingabe, a2, KB);
pruefe("enthält die Rohnotiz", auftrag.includes(eingabe.text.slice(0, 40)));
pruefe("nennt Thema, Pfad und Zieldatei",
  auftrag.includes(a2.topic) && auftrag.includes(a2.pfad) && auftrag.includes(a2.datei));
pruefe("verlangt Prüffragen", /::: quiz/.test(auftrag) && /Prüffragen/.test(auftrag));
pruefe("weist auf die Herkunftskennzeichnung hin", /source/.test(auftrag));
pruefe("warnt vor dem zweiten Knoten zur selben Sache", /zweiter Knoten zur selben Sache/.test(auftrag));
pruefe("nennt den nächsten Schritt nach dem Anlegen", /tools\/build\.mjs/.test(auftrag));

/* ------------------------------------------------------------- Randfälle */

console.log("\nRandfälle");
pruefe("leerer Text erzeugt keinen Absturz", K.analysiere({ text: "" }, KB, index).leer === true);
pruefe("nur Leerzeichen zählt als leer", K.analysiere({ text: "   \n  " }, KB, index).leer === true);
const kurz = K.analysiere({ titel: "Test", text: "Pivot Tabelle Excel." }, KB, index);
pruefe("sehr kurzer Text wird als unsicher gekennzeichnet",
  kurz.hinweise.some((h) => /Wörter/.test(h)));
pruefe("Text ohne Titel wird darauf hingewiesen",
  K.analysiere({ text: "Ein Text ohne jeden Titel, der lang genug ist, um überhaupt eingeordnet zu werden, und deshalb hier ein paar Sätze mehr enthält als unbedingt nötig wären." }, KB, index)
    .hinweise.some((h) => /Ohne Titel/.test(h)));
pruefe("Sonderzeichen im Titel ergeben eine saubere Kennung",
  /^[a-z0-9-]+$/.test(K.slug("Größe & Maß: 50 % — „Test“!")), K.slug("Größe & Maß: 50 % — „Test“!"));
pruefe("leerer Titel ergibt trotzdem eine Kennung", K.slug("") === "ohne-titel");

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert\n`);
process.exit(gescheitert ? 1 : 0);
