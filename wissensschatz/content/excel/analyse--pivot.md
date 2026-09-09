---
id: excel-pivot
title: PivotTables — von der Liste zur Auswertung
path: excel/analyse
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [pivot, auswertung, aggregation]
prereqs: [excel-tabellen]
related: [excel-datenmodell, excel-dashboard, powerbi-sternschema, hotelabr-abstimmung]
summary: Vier Ablagebereiche, ein Cache und eine Handvoll Einstellungen, die über brauchbar oder frustrierend entscheiden.
---

## Kern

Eine PivotTable aggregiert eine Liste, ohne sie zu verändern. Vier Ablagebereiche:

- **Filter** — schneidet die gesamte Auswertung zu
- **Zeilen** — Gruppierung nach unten (hierarchisch bei mehreren Feldern)
- **Spalten** — Gruppierung nach rechts
- **Werte** — was gerechnet wird

Grundvoraussetzung ist eine saubere Liste: eine Kopfzeile, eine Beobachtung je Zeile, keine Leerzeilen, keine verbundenen Zellen, keine Zwischensummen. Quelle immer eine **intelligente Tabelle** — dann wächst der Pivot beim Aktualisieren automatisch mit.

## Einstellungen, die den Unterschied machen

**Berichtslayout** (PivotTable-Entwurf ▸ Berichtslayout): Standard ist *Kurzformat*, das alle Zeilenfelder in eine Spalte quetscht. Für weiterverarbeitbare Ergebnisse: *Tabellenformat* + *Alle Elementnamen wiederholen* + Teilergebnisse aus. Damit entsteht wieder eine flache Liste.

**Zahlenformat** immer über *Wertfeldeinstellungen ▸ Zahlenformat* setzen, nie über die Zellformatierung — sonst ist es nach dem nächsten Umbau weg.

**Spaltenbreite bei Aktualisierung nicht anpassen** und **Zellformatierung beibehalten** (PivotTable-Optionen ▸ Layout & Format) — sonst zerlegt jede Aktualisierung das Layout.

**Leere Zellen anzeigen als** `0` oder `–`, damit Lücken nicht als Fehler gelesen werden.

**„Aus Datenquelle gelöschte Elemente beibehalten" auf Keine** (Optionen ▸ Daten) — sonst spuken alte Werte jahrelang in den Filterlisten herum.

## Wertfelder: Aggregation und Anzeige

Die Aggregation (`Summe`, `Anzahl`, `Mittelwert`, `Max`, `Min`, `Produkt`, `StdAbw`, `Varianz`) ist die eine Hälfte. Die andere ist **Werte anzeigen als**:

| Option | Ergebnis |
|---|---|
| % des Gesamtergebnisses | Anteil an allem |
| % des Zeilen-/Spaltenergebnisses | Anteil innerhalb der Gruppe |
| % von … | Vergleich gegen ein festes Element (z. B. Vorjahr, Basisfiliale) |
| Differenz von … | absolute Abweichung |
| % Differenz von … | Wachstumsrate |
| Ergebnis in … | laufende Summe |
| Rangfolge | Ranking |
| Index | Bedeutung relativ zum Gesamtmuster |

„% Differenz von ▸ Vorheriges" auf einem Monatsfeld ist die Monatsveränderung — in zwei Klicks, ohne eine Formel.

## Gruppieren

Datumsfelder lassen sich per Rechtsklick in Jahre/Quartale/Monate/Tage gruppieren; Zahlen in gleich breite Klassen (Histogramm ohne Formel); Textelemente manuell zu eigenen Gruppen zusammenfassen. Die automatische Datumsgruppierung in neueren Versionen lässt sich in den Optionen abschalten, wenn sie stört.

**Achtung:** Gruppierungen gehören zum Cache. Zwei Pivots auf derselben Quelle teilen sich den Cache — gruppiert man in einem, ändert sich der andere mit. Wer das nicht will, muss den Cache trennen (beim Erstellen über den alten PivotTable-Assistenten, `Alt`+`D`, `P`).

## Berechnetes Feld und berechnetes Element

- **Berechnetes Feld** rechnet auf *Summenebene*: `=Umsatz/Menge` ergibt den Durchschnittspreis der Gruppe — nicht den Durchschnitt der Einzelpreise. Genau das ist meist gewollt, überrascht aber.
- **Berechnetes Element** fügt einer Dimension eine neue Ausprägung hinzu (z. B. „Nord+West").

Beide sind gegenüber DAX-Measures im Datenmodell deutlich eingeschränkt. Sobald es über einfache Verhältnisse hinausgeht, ist das Datenmodell der richtige Ort.

## Datenschnitte und Zeitachsen

Datenschnitte (Slicer) filtern klickbar, Zeitachsen tun dasselbe für Datumsfelder. **Berichtsverbindungen** verbinden einen Datenschnitt mit mehreren Pivots — das ist die Grundlage jedes Excel-Dashboards. Voraussetzung: Alle beteiligten Pivots hängen am selben Cache bzw. am Datenmodell.

## PIVOTDATENZUORDNEN

Klickt man in einer Formel auf eine Pivotzelle, entsteht `=PIVOTDATENZUORDNEN("Umsatz";$A$3;"Region";"Nord")`. Das ist robuster als ein Zellbezug (es folgt dem Feld, nicht der Position) und die richtige Wahl, um Pivotwerte in ein Berichtslayout zu ziehen. Abschaltbar über PivotTable-Analyse ▸ Optionen ▸ GetPivotData generieren.

::: quiz
F: Warum ändert sich die Gruppierung im zweiten Pivot mit, wenn du im ersten gruppierst?
A: Beide teilen denselben PivotCache. Gruppierungen sind Cache-Eigenschaften. Getrennte Caches erzwingt man über den klassischen Assistenten.

F: Du brauchst aus einem Pivot wieder eine flache Liste zur Weiterverarbeitung. Welche drei Einstellungen?
A: Tabellenformat, alle Elementnamen wiederholen, Teilergebnisse ausschalten.
:::
