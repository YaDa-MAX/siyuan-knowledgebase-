---
id: excel-dashboard
title: Dashboards in Excel aufbauen
path: excel/visualisierung
level: 4
type: rezept
source: ki
status: geprueft
updated: 2026-08-09
tags: [dashboard, berichtswesen, layout, interaktivitaet]
prereqs: [excel-pivot, excel-diagramme, excel-modellbau]
related: [excel-datenmodell, powerbi-visuals, excel-bedingte-formatierung]
summary: Drei-Schichten-Architektur, ein Datenschnitt für alles, und die Frage, die das Dashboard beantworten soll — in dieser Reihenfolge.
---

## Vor dem ersten Diagramm

Ein Dashboard ist kein Datenabladeplatz, sondern die Antwort auf eine **Entscheidungsfrage**. Drei Fragen vorab klären:

1. **Wer** schaut drauf und welche Entscheidung trifft diese Person danach?
2. **Wie oft** — täglich im Vorbeigehen oder monatlich in einer Sitzung?
3. **Was ist die Handlung**, wenn eine Zahl rot ist?

Kennzahlen, auf die niemand reagieren kann, gehören nicht aufs Dashboard.

## Drei-Schichten-Architektur

Die einzige Struktur, die auf Dauer trägt:

| Schicht | Blätter | Inhalt |
|---|---|---|
| **Daten** | `d_…` | Rohdaten und Power-Query-Ausgaben. Niemand formatiert hier etwas. |
| **Berechnung** | `b_…` | Pivots, Zwischenaggregate, Hilfstabellen für Diagramme. Ausgeblendet. |
| **Ausgabe** | `Dashboard` | nur Anzeige: Diagramme, Kacheln, Datenschnitte. Keine Rohdaten. |

Ein Wert wird an genau einer Stelle berechnet und überall referenziert. Sobald derselbe Wert zweimal gerechnet wird, driften die beiden Stellen irgendwann auseinander — garantiert.

## Interaktivität

- **Datenschnitte + Berichtsverbindungen**: Ein Datenschnitt steuert alle Pivots gleichzeitig (Datenschnitt ▸ Berichtsverbindungen). Setzt voraus, dass alle Pivots denselben Cache oder dasselbe Datenmodell nutzen.
- **Zeitachse** für Datumsfilter.
- **Formularsteuerelemente** (Entwicklertools ▸ Einfügen): Kombinationsfeld, Optionsfelder, Bildlaufleiste schreiben in eine verknüpfte Zelle. Diese Zelle steuert dann `XVERWEIS` oder `FILTER`. Kein VBA nötig.
- **`FILTER`-basierte Diagrammquellen** (siehe dynamische Arrays) — der modernste Weg, ganz ohne Pivot.
- **Kamera-Werkzeug** (Schnellzugriffsleiste anpassen ▸ „Kamera"): liefert ein Live-Bild eines Bereichs, das sich frei platzieren und skalieren lässt. Der Trick für Layouts, die nicht ins Zellraster passen.

## Layout

- **Lesereihenfolge Z**: Wichtigstes oben links, Details unten rechts.
- **Kennzahlenzeile oben**: 3–5 Kacheln mit Wert, Vergleich und Miniverlauf (Sparkline).
- **Ein Bildschirm.** Was Scrollen erfordert, wird nicht gelesen. Zielformat vorher festlegen (meist 1920 × 1080 abzüglich Menüband).
- **Raster**: Alle Zeilen und Spalten schmal setzen (z. B. 20 px) und Objekte am Raster ausrichten — dann sitzt alles bündig. Objekte über *Ausrichten ▸ Am Raster* fixieren, Eigenschaft „Von Zellposition und -größe unabhängig" setzen, damit Filtern nichts verschiebt.
- **Gitternetzlinien aus**, Blattschutz an, Bildlauf über `ScrollArea` begrenzen.
- Zurückhaltende Palette, eine Akzentfarbe, konsistente Zahlenformate (gleiche Nachkommastellen in einer Spalte).

## Kacheln bauen

Eine Kennzahlkachel ohne Bastelei: Zelle verbunden oder breit, großer Wert per Zahlenformat, darunter eine kleinere Zeile mit Vorjahresvergleich, daneben eine Sparkline, und ein Symbolsatz oder Pfeil per bedingter Formatierung. Für den Pfeil:

```
Zahlenformat:  ▲ 0,0 %;▼ 0,0 %;–
```
Das dreiteilige Format setzt Richtung und Vorzeichen ohne jede Formel.

## Übergabefähigkeit

Ein Dashboard, das nur sein Erbauer aktualisieren kann, ist eine Zeitbombe. Deshalb:

- **Ein Aktualisierungsweg**: `Daten ▸ Alle aktualisieren` muss alles erledigen. Wenn zusätzlich noch etwas von Hand kopiert werden muss, gehört das in Power Query.
- **Blatt „Info"** mit Quelle, Aktualisierungsrhythmus, Kennzahldefinitionen, Ansprechpartner und Änderungsprotokoll.
- **Stand-Anzeige** auf dem Dashboard: `="Stand: " & TEXT(Aktualisierungszeit;"TT.MM.JJJJ hh:mm")` — als Power-Query-Schritt gefüllt, nicht mit `JETZT()`.
- Keine externen Dateiverknüpfungen auf Pfade, die nur auf einem Rechner existieren.

::: quiz
F: Warum liegen Rohdaten, Berechnung und Anzeige auf getrennten Blättern?
A: Damit jede Zahl genau eine Quelle hat und die Anzeige umgebaut werden kann, ohne die Berechnung anzufassen — die Voraussetzung dafür, dass das Dashboard Jahre überlebt.

F: Ein Datenschnitt filtert nur einen von vier Pivots. Was fehlt?
A: Die Berichtsverbindungen — und ggf. ein gemeinsamer Cache bzw. das gemeinsame Datenmodell.
:::
