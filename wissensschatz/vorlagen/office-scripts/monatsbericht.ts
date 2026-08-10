/**
 * Monatsbericht — Office Script
 *
 * Läuft in Excel im Web und als Schritt in einem Power-Automate-Flow.
 * Der Flow übergibt den Monat und verwendet die Rückgabewerte im Mailtext.
 *
 * Erwartete Struktur: Blatt "Daten" mit Tabelle "Buchungen",
 * Spalten: Datum | Haus | Kanal | Betrag | Gaeste
 *
 * Einfügen: Excel > Automatisieren > Neues Skript > Code ersetzen
 */

interface Kennzahlen {
  monat: string;
  buchungen: number;
  umsatz: number;
  durchschnitt: number;
  gaeste: number;
  bestesHaus: string;
  veraenderungVormonat: number;
}

function main(workbook: ExcelScript.Workbook, monat?: string): Kennzahlen {
  // Ohne Parameter: der abgelaufene Monat
  if (!monat) {
    const heute = new Date();
    heute.setMonth(heute.getMonth() - 1);
    monat = `${heute.getFullYear()}-${String(heute.getMonth() + 1).padStart(2, "0")}`;
  }

  const blatt = workbook.getWorksheet("Daten");
  if (!blatt) throw new Error("Blatt 'Daten' nicht gefunden.");

  const tabelle = blatt.getTable("Buchungen");
  if (!tabelle) throw new Error("Tabelle 'Buchungen' nicht gefunden.");

  // Ein Zugriff für alles — jeder getValues()-Aufruf ist ein Roundtrip
  const kopf = tabelle.getHeaderRowRange().getValues()[0] as string[];
  const zeilen = tabelle.getRangeBetweenHeaderAndTotal().getValues();

  const iDatum = kopf.indexOf("Datum");
  const iHaus = kopf.indexOf("Haus");
  const iBetrag = kopf.indexOf("Betrag");
  const iGaeste = kopf.indexOf("Gaeste");
  if (iDatum < 0 || iBetrag < 0) throw new Error("Spalten 'Datum' und 'Betrag' sind erforderlich.");

  const vormonat = verschiebeMonat(monat, -1);
  const jeHaus = new Map<string, number>();
  let umsatz = 0, buchungen = 0, gaeste = 0, umsatzVormonat = 0;

  for (const zeile of zeilen) {
    const m = monatSchluessel(zeile[iDatum]);
    const betrag = Number(zeile[iBetrag]) || 0;

    if (m === monat) {
      umsatz += betrag;
      buchungen++;
      gaeste += iGaeste >= 0 ? Number(zeile[iGaeste]) || 0 : 0;
      if (iHaus >= 0) {
        const h = String(zeile[iHaus]);
        jeHaus.set(h, (jeHaus.get(h) ?? 0) + betrag);
      }
    } else if (m === vormonat) {
      umsatzVormonat += betrag;
    }
  }

  let bestesHaus = "—", bestWert = -Infinity;
  jeHaus.forEach((wert, haus) => {
    if (wert > bestWert) { bestWert = wert; bestesHaus = haus; }
  });

  const ergebnis: Kennzahlen = {
    monat,
    buchungen,
    umsatz: runde(umsatz),
    durchschnitt: buchungen ? runde(umsatz / buchungen) : 0,
    gaeste,
    bestesHaus,
    veraenderungVormonat: umsatzVormonat ? runde((umsatz - umsatzVormonat) / umsatzVormonat * 100, 1) : 0,
  };

  schreibeBericht(workbook, ergebnis, jeHaus);
  return ergebnis;
}

/** Berichtsblatt aufbauen — Werte in einem Zug schreiben. */
function schreibeBericht(
  workbook: ExcelScript.Workbook,
  k: Kennzahlen,
  jeHaus: Map<string, number>
): void {
  let blatt = workbook.getWorksheet("Bericht");
  if (!blatt) blatt = workbook.addWorksheet("Bericht");
  blatt.getUsedRange()?.clear(ExcelScript.ClearApplyTo.all);

  const kopf = blatt.getRange("A1");
  kopf.setValue(`Monatsbericht ${k.monat}`);
  kopf.getFormat().getFont().setSize(16);
  kopf.getFormat().getFont().setBold(true);

  const kennzahlen: (string | number)[][] = [
    ["Kennzahl", "Wert"],
    ["Buchungen", k.buchungen],
    ["Umsatz", k.umsatz],
    ["Durchschnitt je Buchung", k.durchschnitt],
    ["Gäste", k.gaeste],
    ["Veränderung zum Vormonat in %", k.veraenderungVormonat],
    ["Bestes Haus", k.bestesHaus],
  ];
  const bereich = blatt.getRangeByIndexes(2, 0, kennzahlen.length, 2);
  bereich.setValues(kennzahlen);
  blatt.getRange("A3:B3").getFormat().getFont().setBold(true);
  blatt.getRange(`B5:B7`).setNumberFormat("#.##0,00 €");
  blatt.getRange(`B8`).setNumberFormat("0,0 %");

  // Aufriss je Haus
  if (jeHaus.size > 0) {
    const start = kennzahlen.length + 4;
    const daten: (string | number)[][] = [["Haus", "Umsatz"]];
    Array.from(jeHaus.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([haus, wert]) => daten.push([haus, runde(wert)]));

    blatt.getRangeByIndexes(start, 0, daten.length, 2).setValues(daten);
    blatt.getRangeByIndexes(start, 0, 1, 2).getFormat().getFont().setBold(true);
    blatt.getRangeByIndexes(start + 1, 1, daten.length - 1, 1).setNumberFormat("#.##0,00 €");
  }

  blatt.getRange("D1").setValue(`Stand: ${new Date().toLocaleString("de-DE")}`);
  blatt.getRange("A:D").getFormat().autofitColumns();
}

/** Wandelt einen Zellwert (Datum oder Excel-Seriennummer) in "JJJJ-MM". */
function monatSchluessel(wert: string | number | boolean): string {
  if (typeof wert === "number") {
    // Excel-Seriennummer: Tag 1 = 30.12.1899 (inkl. 1900er-Schaltjahrfehler)
    const d = new Date(Date.UTC(1899, 11, 30) + wert * 86400000);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  }
  const s = String(wert);
  const iso = s.match(/^(\d{4})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}`;
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (de) return `${de[3]}-${de[2].padStart(2, "0")}`;
  return "";
}

function verschiebeMonat(monat: string, delta: number): string {
  const [j, m] = monat.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function runde(x: number, stellen = 2): number {
  const f = Math.pow(10, stellen);
  return Math.round(x * f) / f;
}
