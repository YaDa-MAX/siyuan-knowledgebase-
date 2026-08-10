---
id: excel-datenmodell
title: Datenmodell und Power Pivot in Excel
path: excel/analyse
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [datenmodell, powerpivot, dax, sternschema]
prereqs: [excel-pivot, excel-powerquery]
related: [powerbi-sternschema, powerbi-dax-kontext, excel-performance]
summary: Excel enthält seit 2013 dieselbe Analyse-Engine wie Power BI. Wer sie nutzt, arbeitet mit Beziehungen statt mit SVERWEIS-Ketten.
---

## Kern

Das Datenmodell ist eine **VertiPaq**-Instanz — dieselbe spaltenorientierte In-Memory-Datenbank, auf der Power BI und Analysis Services Tabular laufen. Statt alles in ein flaches Blatt zu ziehen, lädt man mehrere Tabellen und **verbindet** sie über Beziehungen.

Der Gewinn ist dreifach:
1. Kein SVERWEIS mehr zum Anreichern — die Beziehung erledigt das.
2. Kompression: Millionen Zeilen passen in eine Mappe, die kleiner ist als das flache Äquivalent.
3. **DAX-Measures**, die im Pivot korrekt über jede Filterkombination rechnen.

Aktivierung: *Daten ▸ Datenmodell verwalten* bzw. das Add-In Power Pivot (COM-Add-Ins). Beim Erstellen eines Pivots die Option **„Dem Datenmodell diese Daten hinzufügen"** anhaken; oder in Power Query beim Laden *Nur Verbindung erstellen* + *Dem Datenmodell hinzufügen*.

## Sternschema statt Breittabelle

Die Modellform ist dieselbe wie in Power BI: In der Mitte die **Faktentabelle** (Buchungen, Umsätze, Zeiterfassung — viele Zeilen, wenige Attribute), außen die **Dimensionstabellen** (Kalender, Artikel, Kunde, Mitarbeiter — wenige Zeilen, viele Attribute). Beziehungen 1:n von der Dimension zum Fakt, Filterrichtung von der Dimension in den Fakt.

Eine eigene **Kalendertabelle** ist Pflicht, sobald Zeitvergleiche gebraucht werden. Sie muss lückenlos alle Tage der betrachteten Jahre enthalten und im Modell als Datumstabelle markiert werden.

## Measures gegen berechnete Spalten

| | berechnete Spalte | Measure |
|---|---|---|
| berechnet | beim Aktualisieren, je Zeile | zur Abfragezeit, je Filterkontext |
| Speicher | belegt Modellspeicher | belegt keinen |
| verwendbar als | Zeilen-/Spaltenfeld, Filter | Wertfeld |
| Beispiel | `Marge = [Preis] - [EK]` | `Umsatz = SUM(Fakt[Betrag])` |

Faustregel: **Alles, was aggregiert, ist ein Measure.** Berechnete Spalten nur, wenn der Wert als Gruppierungsmerkmal gebraucht wird.

Implizite Measures (Feld einfach in den Wertebereich ziehen) funktionieren, sind aber nicht wiederverwendbar. Besser explizit anlegen:

```dax
Umsatz := SUM(Buchungen[Betrag])
Umsatz VJ := CALCULATE([Umsatz]; SAMEPERIODLASTYEAR(Kalender[Datum]))
Wachstum % := DIVIDE([Umsatz] - [Umsatz VJ]; [Umsatz VJ])
Gäste := DISTINCTCOUNT(Buchungen[GastID])
```

`DISTINCTCOUNT` ist einer der stärksten Gründe für das Datenmodell — im klassischen Pivot gibt es keine korrekte Anzahl eindeutiger Werte über beliebige Filterkombinationen.

## Cube-Funktionen

Sobald ein Datenmodell existiert, lassen sich seine Werte auch ohne Pivot in beliebige Zellen holen:

```
=CUBEWERT("ThisWorkbookDataModel"; "[Measures].[Umsatz]"; $B$2)
=CUBEELEMENT("ThisWorkbookDataModel"; "[Kalender].[Jahr].&[2026]")
=CUBEELEMENTEIGENSCHAFT(...)
```

Damit baut man Berichte in **freiem Layout** — jede Kennzahl steht genau dort, wo sie hingehört, statt im Pivotraster. Ein Pivot lässt sich über *PivotTable-Analyse ▸ OLAP-Tools ▸ In Formeln konvertieren* in genau diese Formeln umwandeln. Das ist der Weg zu Excel-Berichten, die wie gedruckte Reports aussehen und trotzdem live am Modell hängen.

## Grenzen gegenüber Power BI

- Keine bidirektionalen Beziehungen in älteren Versionen, kein Kalkulationsgruppen-Editor, keine RLS-Rollen für Endanwender.
- Das Modell steckt in der Datei — Weitergabe heißt Kopie, nicht gemeinsame Quelle.
- Kein visuelles Berichtswerkzeug jenseits von Pivot und Diagramm.

Der Übergang ist aber fließend: Ein sauber gebautes Excel-Datenmodell lässt sich in Power BI Desktop importieren und weiterverwenden. Wer in Excel Sternschema und DAX lernt, hat Power BI zu drei Vierteln schon gelernt.

::: quiz
F: Wann berechnete Spalte, wann Measure?
A: Aggregationen immer als Measure (kein Speicherverbrauch, filterkontextabhängig). Berechnete Spalte nur, wenn der Wert als Zeilen-, Spalten- oder Filterfeld gebraucht wird.

F: Wie holst du einen einzelnen Modellwert an eine frei gewählte Zelle?
A: Mit `CUBEWERT` — oder einen Pivot über OLAP-Tools in Formeln konvertieren.
:::
