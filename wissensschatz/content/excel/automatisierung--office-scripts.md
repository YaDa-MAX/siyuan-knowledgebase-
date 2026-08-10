---
id: excel-office-scripts
title: Office Scripts und Power Automate
path: excel/automatisierung
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [office-scripts, typescript, power-automate, cloud, automatisierung]
prereqs: [excel-tabellen]
related: [excel-vba, prozessauto-power-platform, prozessauto-werkzeugwahl]
summary: Der Cloud-Nachfolger von VBA — TypeScript, läuft im Browser und lässt sich von einem Flow aufrufen.
---

## Kern

**Office Scripts** sind TypeScript-Skripte, die in Excel im Web (und in der Desktop-App mit M365-Lizenz) laufen. Sie ersetzen VBA dort, wo VBA nicht hinkommt: im Browser, unbeaufsichtigt, als Schritt in einem automatisierten Ablauf.

Aufgezeichnet wird über *Automatisieren ▸ Aktionen aufzeichnen*, bearbeitet im Code-Editor. Der Rekorder erzeugt hier deutlich brauchbareren Code als der VBA-Rekorder, weil das Objektmodell keine Selektion kennt.

```ts
function main(workbook: ExcelScript.Workbook) {
  const blatt = workbook.getWorksheet("Daten");
  const tabelle = blatt.getTable("Buchungen");
  const zeilen = tabelle.getRangeBetweenHeaderAndTotal().getValues();

  let summe = 0;
  for (const zeile of zeilen) summe += zeile[3] as number;

  workbook.getWorksheet("Bericht").getRange("B2").setValue(summe);
}
```

## Unterschiede zu VBA

| | VBA | Office Scripts |
|---|---|---|
| Sprache | VBA | TypeScript |
| Läuft in | Desktop | Web + Desktop (M365) |
| Speicherort | in der Datei (`.xlsm`) | im OneDrive/SharePoint des Nutzers |
| Unbeaufsichtigt | nein | ja, über Power Automate |
| Zugriff außerhalb Excel | ja (Dateisystem, Outlook, COM) | nein — nur die Mappe |
| Ereignisse in der Mappe | ja | nein |
| Dialoge/UserForms | ja | nein |

Die letzte Zeile ist die entscheidende Einschränkung: Ein Office Script kann **nur** die Arbeitsmappe verändern, die es übergeben bekommt. Alles Übrige — Datei holen, Mail senden, Freigabe einholen, in ein anderes System schreiben — macht der umgebende **Power-Automate-Flow**.

## Parameter und Rückgabewerte

Genau das macht Scripts als Flow-Baustein stark:

```ts
function main(workbook: ExcelScript.Workbook, monat: string): { anzahl: number; summe: number } {
  const t = workbook.getWorksheet("Daten").getTable("Buchungen");
  const werte = t.getRangeBetweenHeaderAndTotal().getValues();
  const treffer = werte.filter(z => String(z[0]).startsWith(monat));
  return { anzahl: treffer.length, summe: treffer.reduce((s, z) => s + (z[3] as number), 0) };
}
```

Der Flow übergibt `monat` und verwendet `anzahl`/`summe` in den Folgeschritten — etwa im Text einer Zusammenfassungsmail.

## Typisches Zusammenspiel

Wiederkehrender Monatsbericht ohne einen einzigen Handgriff:

1. **Auslöser**: Wiederholung, am 1. des Monats um 6:00.
2. **SharePoint ▸ Datei abrufen** — die Berichtsmappe.
3. **Excel ▸ Skript ausführen** — Daten aktualisieren, Kennzahlen berechnen, Rückgabewerte liefern.
4. **Bedingung** — nur wenn Abweichung über Schwelle.
5. **Outlook ▸ E-Mail senden** mit den Rückgabewerten im Text und der Mappe im Anhang.
6. **Teams ▸ Nachricht posten** in den Abteilungskanal.

## Grenzen und Betriebsfragen

- **Ausführungslimits**: Laufzeit je Skript ist begrenzt (Größenordnung Minuten); sehr große Bereiche in Blöcken verarbeiten.
- **Performance**: Jeder `get…()`-Aufruf ist ein Roundtrip. Werte einmal per `getValues()` holen, im Speicher rechnen, einmal per `setValues()` zurückschreiben — dasselbe Prinzip wie bei VBA-Arrays.
- **Speicherort**: Skripte liegen im OneDrive des Erstellers. Für den Dauerbetrieb in eine **SharePoint-Bibliothek** legen und im Team freigeben — sonst hängt der Prozess am Konto einer einzelnen Person und stirbt mit deren Austritt.
- **Lizenz**: Erfordert einen kommerziellen M365-Plan; unbeaufsichtigte Läufe brauchen zusätzlich eine passende Power-Automate-Lizenz.
- **Kein Ersatz für Power Query**: Datenbeschaffung und -bereinigung bleiben dort besser aufgehoben.

## Entscheidungshilfe

| Bedarf | Werkzeug |
|---|---|
| lokale Datei-Stapelverarbeitung, Outlook-Steuerung, Dialoge | VBA |
| geplante Aufgabe in der Cloud, Auslöser aus anderen Systemen | Office Scripts + Power Automate |
| Import und Aufbereitung wiederkehrender Daten | Power Query |
| Berechnungslogik, die sich live ändert | Formeln / LAMBDA |

::: quiz
F: Warum kann ein Office Script keine E-Mail senden?
A: Sein Wirkungsbereich endet an der übergebenen Arbeitsmappe. Alles außerhalb übernimmt der Power-Automate-Flow, der es aufruft.

F: Wo sollten produktiv genutzte Skripte liegen und warum?
A: In einer SharePoint-Bibliothek statt im persönlichen OneDrive — sonst hängt der Prozess an einem einzelnen Konto.
:::
