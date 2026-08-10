---
id: powerbi-dax-kontext
title: Der Auswertungskontext — das Herz von DAX
path: powerbi/dax
level: 4
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [dax, filterkontext, zeilenkontext, calculate]
prereqs: [powerbi-sternschema, powerbi-beziehungen]
related: [powerbi-dax-calculate, powerbi-dax-iteratoren, excel-datenmodell]
summary: Filterkontext und Zeilenkontext sind zwei verschiedene Dinge. Wer sie auseinanderhält, versteht DAX. Wer nicht, rät.
---

## Zwei Kontexte

**Filterkontext** — die Menge der gerade aktiven Filter. Er entsteht aus allem, was das Visual, die Datenschnitte, die Zeilen- und Spaltenüberschriften, die Seitenfilter und `CALCULATE` beitragen. Jede Zelle in einer Matrix hat ihren eigenen Filterkontext.

**Zeilenkontext** — die Vorstellung „aktuelle Zeile". Er entsteht nur an zwei Stellen: in einer **berechneten Spalte** und innerhalb eines **Iterators** (`SUMX`, `AVERAGEX`, `FILTER`, `ADDCOLUMNS`, …).

Der entscheidende Satz: **Ein Zeilenkontext filtert nicht.**

```dax
Falsch := SUM ( Buchungen[Betrag] ) -- in einer berechneten Spalte: liefert IMMER die Gesamtsumme,
                                     -- weil SUM den Filterkontext liest, und der ist leer
```

Ein Aggregat sieht die aktuelle Zeile nicht, weil Zeilenkontext und Filterkontext getrennte Konzepte sind.

## Kontexttransition

`CALCULATE` schlägt die Brücke: Es wandelt den bestehenden Zeilenkontext in einen Filterkontext um. Diese **Kontexttransition** ist der wichtigste Einzelmechanismus in DAX.

```dax
-- Berechnete Spalte in der Kundentabelle
Umsatz je Kunde = CALCULATE ( SUM ( Buchungen[Betrag] ) )
```

Ohne `CALCULATE` käme die Gesamtsumme. Mit `CALCULATE` wird aus „aktuelle Zeile ist Kunde 4711" der Filter „Kunde = 4711", und die Beziehung trägt ihn in die Faktentabelle.

**Jeder Measure-Aufruf enthält ein implizites `CALCULATE`.** Deshalb funktioniert

```dax
Kunden über 1000 := COUNTROWS ( FILTER ( Kunde; [Umsatz] > 1000 ) )
```
auch ohne sichtbares `CALCULATE`: Der Aufruf von `[Umsatz]` innerhalb des Iterators löst die Transition selbst aus. Das ist bequem und zugleich die Quelle vieler Überraschungen — ein Measure verhält sich in einem Iterator anders als derselbe Ausdruck ausgeschrieben.

## Filterkontext lesen

```dax
Anteil am Gesamtjahr :=
DIVIDE (
    [Umsatz];
    CALCULATE ( [Umsatz]; ALLEXCEPT ( Kalender; Kalender[Jahr] ) )
)
```

Der Nenner entfernt alle Filter auf der Kalendertabelle **außer** dem Jahr. So bleibt der Jahresbezug erhalten, während Monat und Quartal entfernt werden.

Die Werkzeuge zum Verändern des Filterkontexts:

| Funktion | Wirkung |
|---|---|
| `ALL(Tabelle)` | entfernt alle Filter der Tabelle |
| `ALL(Spalte)` | entfernt Filter dieser Spalte |
| `ALLEXCEPT(Tabelle; Spalte…)` | entfernt alle außer den genannten |
| `ALLSELECTED()` | respektiert die äußere Nutzerauswahl, ignoriert die Visual-interne Gruppierung |
| `REMOVEFILTERS()` | dasselbe wie `ALL`, aber ausdrücklich als Filterentfernung lesbar |
| `KEEPFILTERS()` | verhindert das Überschreiben bestehender Filter durch `CALCULATE` |
| `VALUES(Spalte)` | die im Kontext sichtbaren Werte, als Tabelle |
| `SELECTEDVALUE(Spalte; alt)` | der einzige sichtbare Wert, sonst der Ersatzwert |
| `HASONEVALUE(Spalte)` | prüft, ob genau ein Wert sichtbar ist |
| `ISINSCOPE(Spalte)` | prüft, ob die Spalte im Visual gruppiert wird — die richtige Wahl für Zwischensummenlogik |

## Der Unterschied ALL / ALLSELECTED

Ein Balkendiagramm zeigt Umsatz je Region, ein Datenschnitt beschränkt auf drei Regionen.

- `CALCULATE([Umsatz]; ALL(Region))` → Summe **aller** Regionen, auch der weggefilterten. Der prozentuale Anteil summiert sich nicht auf 100 %.
- `CALCULATE([Umsatz]; ALLSELECTED(Region))` → Summe der **drei ausgewählten**. Anteile summieren sich auf 100 %.

Für „Anteil am Sichtbaren" ist `ALLSELECTED` fast immer die gewollte Variante.

## Debugging-Reihenfolge

Wenn ein Measure nicht das tut, was es soll:

1. Welcher Filterkontext gilt in dieser Zelle wirklich? (Visual, Datenschnitte, Seiten- und Berichtsfilter, Kreuzhervorhebung, RLS)
2. Bin ich in einem Zeilenkontext, in dem ich Filterung erwarte? Dann fehlt `CALCULATE`.
3. Überschreibt ein `CALCULATE` einen Filter, den ich behalten wollte? Dann `KEEPFILTERS`.
4. Kommt der Filter über die Beziehung überhaupt an? Richtung und Aktivität prüfen.
5. Zwischenschritte mit `VAR` sichtbar machen und einzeln in eine Karte legen.

Werkzeuge: **Leistungsanalyse** in Desktop (zeigt die generierte DAX-Abfrage) und **DAX Studio** (Serverzeiten, Speicher-Engine gegen Formel-Engine).

::: quiz
F: Warum liefert `SUM(Buchungen[Betrag])` in einer berechneten Spalte der Kundentabelle immer denselben Wert?
A: Aggregatfunktionen lesen den Filterkontext, und der Zeilenkontext der berechneten Spalte filtert nicht. Erst `CALCULATE` wandelt ihn per Kontexttransition in einen Filter um.

F: Wann `ALLSELECTED` statt `ALL`?
A: Wenn sich Anteile auf die vom Nutzer ausgewählte Menge beziehen sollen — dann summieren sich die Prozentwerte auf 100 %.
:::
