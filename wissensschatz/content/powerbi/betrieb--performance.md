---
id: powerbi-performance
title: Performance — VertiPaq verstehen und Berichte beschleunigen
path: powerbi/betrieb
level: 5
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [performance, vertipaq, optimierung, dax-studio]
prereqs: [powerbi-dax-kontext, powerbi-sternschema]
related: [powerbi-dax-iteratoren, powerbi-powerquery]
summary: Wie die Speicher-Engine komprimiert, warum Kardinalität alles bestimmt, und in welcher Reihenfolge man einen langsamen Bericht auseinandernimmt.
---

## Wie VertiPaq speichert

Die Engine speichert **spaltenweise**, nicht zeilenweise. Je Spalte entsteht ein Wörterbuch der eindeutigen Werte plus eine Liste von Verweisen darauf, danach folgen Lauflängen- und Bitpacking-Kompression.

Daraus folgt die zentrale Kennzahl: die **Kardinalität** — die Anzahl unterschiedlicher Werte einer Spalte. Sie bestimmt Speicherbedarf und Abfragetempo weit stärker als die Zeilenzahl.

Praktische Konsequenzen:

- **Zeitstempel sind der teuerste Datentyp.** Eine `DateTime`-Spalte mit Sekundengenauigkeit hat pro Tag 86.400 mögliche Werte. In Datum und Uhrzeit **aufteilen**, Uhrzeit auf Minuten oder Viertelstunden runden — das reduziert die Modellgröße oft um zweistellige Prozentwerte.
- **Dezimalzahlen mit vielen Nachkommastellen** haben hohe Kardinalität. Auf die fachlich nötige Genauigkeit runden. Der Datentyp *Festkommazahl* (Currency, 4 Nachkommastellen) ist deutlich günstiger als Dezimal.
- **Textschlüssel** kosten mehr als Ganzzahlschlüssel.
- **Jede nicht benötigte Spalte entfernen.** Nicht ausblenden — entfernen. Eine ungenutzte hochkardinale Spalte kostet Speicher und Aktualisierungszeit, auch wenn sie niemand ansieht.
- Sortierung der Quelldaten kann die Lauflängenkompression verbessern: nach niedrigkardinalen Spalten sortiert laden.

Messen lässt sich das mit **DAX Studio ▸ VertiPaq Analyzer** oder Vertipaq Analyzer in Tabular Editor: Größe je Spalte, Kardinalität, Wörterbuchgröße. Die Top-10-Liste nach Größe zeigt praktisch immer sofort, wo aufzuräumen ist.

## Formel-Engine gegen Speicher-Engine

Eine DAX-Abfrage wird in zwei Teile zerlegt:

- **Speicher-Engine (SE)** — komprimiert, mehrkernig, extrem schnell, aber nur einfache Operationen (Scans, Gruppierungen, einfache Aggregate). Ergebnisse werden zwischengespeichert.
- **Formel-Engine (FE)** — kann alles, arbeitet aber **einkernig** auf unkomprimierten Zwischenergebnissen.

Ziel jeder Optimierung: **so viel wie möglich in der SE**. Ein Measure, das die FE zwingt, zeilenweise über eine Million materialisierter Zeilen zu laufen, ist der klassische Grund für 20-Sekunden-Visuals.

Typische FE-Treiber: komplexe `FILTER`-Ausdrücke über Faktentabellen, verschachtelte Iteratoren, `IF` innerhalb von Iteratoren, Vergleiche über Spalten verschiedener Tabellen ohne Beziehung.

In DAX Studio zeigt *Server Timings* die Aufteilung: viele SE-Abfragen mit kurzen Zeiten sind gut; eine SE-Abfrage plus lange FE-Zeit ist das Warnsignal.

## Vorgehen bei einem langsamen Bericht

1. **Leistungsanalyse** in Power BI Desktop starten, Seite neu laden, Visuals nach Dauer sortieren. Trennung nach DAX-Abfrage, Visualanzeige und Sonstiges.
2. Die langsamste DAX-Abfrage kopieren und in **DAX Studio** ausführen, Server Timings ansehen.
3. Ist die **Visualanzeige** der Engpass (nicht die Abfrage), liegt es an der Menge dargestellter Punkte — Tabelle mit 50.000 Zeilen, Streudiagramm mit zu vielen Marken.
4. **Modell prüfen**: Sternschema vorhanden? Bidirektionale Beziehungen? Hochkardinale Spalten?
5. **Measures prüfen**: Iteratoren über Faktentabellen, `FILTER` auf ganze Tabellen, fehlende Variablen.
6. **Aktualisierung prüfen**: Query Folding intakt? Werden Zeilen erst im Modell gefiltert statt in der Quelle?

## Weitere Hebel

- **Aggregationstabellen**: vorberechnete Zusammenfassungen (z. B. Tag × Region) als eigene Tabelle mit Aggregationszuordnung. Power BI beantwortet passende Abfragen daraus und greift nur bei Detailbedarf auf die große Tabelle zu. Der stärkste Hebel bei DirectQuery.
- **Inkrementelle Aktualisierung**: nur die letzten n Tage neu laden, ältere Partitionen bleiben stehen. Verkürzt Refresh-Zeiten drastisch und ist ab einer gewissen Größe unverzichtbar.
- **Automatische Datums-/Uhrzeit-Hierarchie abschalten** — sie legt hinter *jeder* Datumsspalte eine versteckte Tabelle an.
- **Berechnete Spalten in Power Query verlagern**: dort werden sie beim Laden materialisiert und komprimiert; DAX-berechnete Spalten komprimieren schlechter.
- **Doppelte Kalendertabellen und Hilfstabellen** entfernen.
- **Seiten aufteilen**: eine Übersichtsseite mit wenigen Visuals, Details per Drillthrough.

::: quiz
F: Warum ist eine DateTime-Spalte mit Sekundengenauigkeit ein Performanceproblem?
A: Hohe Kardinalität — bis zu 86.400 verschiedene Werte je Tag. Das Wörterbuch wird groß und die Kompression schlecht. Datum und Uhrzeit trennen, Uhrzeit runden.

F: Woran erkennst du in DAX Studio, dass die Formel-Engine der Engpass ist?
A: Wenige Speicher-Engine-Abfragen bei hoher Gesamtdauer, also ein großer FE-Anteil in den Server Timings.
:::
