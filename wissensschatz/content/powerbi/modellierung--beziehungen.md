---
id: powerbi-beziehungen
title: Beziehungen — Kardinalität, Filterrichtung, Fallstricke
path: powerbi/modellierung
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [beziehungen, kardinalitaet, filterrichtung, modellierung]
prereqs: [powerbi-sternschema]
required: []
related: [powerbi-dax-kontext, powerbi-kalendertabelle]
summary: Ein Pfeil im Modell entscheidet darüber, was ein Measure überhaupt sehen kann. Die vier Kardinalitäten und wann bidirektional gefährlich wird.
---

## Kardinalität

| Typ | Bedeutung | Einsatz |
|---|---|---|
| **1:n** (`1:*`) | eine Dimensionszeile, viele Faktzeilen | der Normalfall |
| **n:1** (`*:1`) | dasselbe aus Sicht der Faktentabelle | identisch, nur Blickrichtung |
| **1:1** | genau eine Zeile je Seite | selten; meist besser zusammenführen |
| **n:m** (`*:*`) | beide Seiten mehrdeutig | nur mit klarem Grund; besser Brückentabelle |

Power BI schlägt beim Laden Beziehungen automatisch vor. Diese Vorschläge sind regelmäßig falsch — die Automatik unter *Optionen ▸ Aktuelle Datei ▸ Beziehungen* abschalten und Beziehungen bewusst setzen. Das ist eine der lohnendsten Einstellungen überhaupt.

## Filterrichtung

Der Pfeil auf der Beziehungslinie zeigt, wohin der Filter fließt.

- **Einfach** (Standard): Dimension filtert Fakt. Nicht umgekehrt.
- **Beide** (bidirektional): Filter fließt in beide Richtungen.

Bidirektional wirkt oft wie die Lösung, ist aber die häufigste Ursache für schwer auffindbare Fehler:

1. **Mehrdeutige Pfade.** Bei mehreren Tabellen entstehen Filterkreise; Power BI verweigert dann die Beziehung oder wählt einen Pfad, den niemand erwartet hat.
2. **Performance.** Jeder bidirektionale Pfad vergrößert den Suchraum der Engine.
3. **Sicherheitsleck.** In Kombination mit Zeilensicherheit (RLS) kann ein bidirektionaler Filter Daten sichtbar machen, die eine Rolle nicht sehen dürfte.

Gezielter Ersatz statt globaler Einstellung — im einzelnen Measure:

```dax
Gäste mit Buchung := CALCULATE(DISTINCTCOUNT(Gast[GastID]); CROSSFILTER(Buchung[GastID]; Gast[GastID]; BOTH))
```

Legitim ist bidirektional vor allem bei Brückentabellen in n:m-Konstellationen und bei Datenschnitten, die nur Werte zeigen sollen, zu denen es Fakten gibt.

## Aktiv und inaktiv

Zwischen zwei Tabellen kann nur **eine** Beziehung aktiv sein; weitere liegen gestrichelt daneben. Aktiviert werden sie je Measure mit `USERELATIONSHIP` innerhalb von `CALCULATE`.

## Typische Fehlerbilder

| Symptom | Ursache |
|---|---|
| Jede Zeile zeigt denselben Gesamtwert | keine Beziehung, oder Filterrichtung falsch herum |
| „Die Beziehung kann nicht erstellt werden, da eine Seite nicht eindeutig ist" | Duplikate in der Dimension — meist Leerzeilen oder Groß-/Kleinschreibung |
| Zahlen zu hoch nach Filterung | mehrdeutiger Pfad durch bidirektionale Beziehung |
| Einzelne Fakten fehlen in der Auswertung | Fremdschlüssel ohne Gegenstück; Power BI legt eine unsichtbare Leerzeile an — sichtbar als leeres Element im Datenschnitt |
| Zeitvergleiche liefern leer | Kalendertabelle nicht als Datumstabelle markiert oder lückenhaft |

**Referenzielle Integrität** prüfen: Ein Measure `=COUNTROWS(FILTER(Fakt; ISBLANK(RELATED(Dim[Schlüssel]))))` zählt die verwaisten Zeilen. Diese Prüfung gehört in jedes produktive Modell.

## Datentypen der Schlüssel

Beziehungen über **ganze Zahlen** sind deutlich schneller als über Text, weil VertiPaq Integer-Wörterbücher effizienter durchsucht. Bei großen Modellen lohnt es, in Power Query einen numerischen Ersatzschlüssel zu erzeugen. Beziehungen über Datum/Zeit-Spalten mit Uhrzeitanteil sind eine klassische Falle — die Uhrzeit muss weg, sonst passt nichts zusammen.

::: quiz
F: Warum ist „Beziehungsrichtung: beide" als Standardeinstellung riskant?
A: Sie erzeugt mehrdeutige Filterpfade, kostet Performance und kann in Kombination mit RLS Daten sichtbar machen, die eine Rolle nicht sehen darf.

F: Ein Datenschnitt zeigt ein leeres Element, das es in den Stammdaten nicht gibt. Woher kommt es?
A: Aus der automatisch angelegten Leerzeile für Faktzeilen, deren Fremdschlüssel keine Entsprechung in der Dimension hat — ein Hinweis auf verletzte referenzielle Integrität.
:::
