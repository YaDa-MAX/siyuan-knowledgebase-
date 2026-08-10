---
id: powerbi-dax-calculate
title: CALCULATE — die eine Funktion, die alles verändert
path: powerbi/dax
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [dax, calculate, filter]
prereqs: [powerbi-dax-kontext]
related: [powerbi-dax-iteratoren, powerbi-dax-time-intelligence]
summary: Auswertungsreihenfolge, Filterüberschreibung und KEEPFILTERS — die drei Dinge, die man an CALCULATE verstanden haben muss.
---

## Syntax und Ablauf

```dax
CALCULATE ( <Ausdruck>; <Filter1>; <Filter2>; … )
```

Die Reihenfolge der Auswertung ist nicht die Schreibreihenfolge:

1. Die **Filterargumente** werden im *äußeren* Filterkontext ausgewertet.
2. Eine eventuelle **Kontexttransition** findet statt (Zeilenkontext wird zu Filterkontext).
3. Der neue Filterkontext entsteht: Die Filterargumente **überschreiben** bestehende Filter auf denselben Spalten, alle übrigen bleiben.
4. Erst jetzt wird der **Ausdruck** ausgewertet.

Punkt 3 ist der Kern: `CALCULATE` *ersetzt* Filter auf derselben Spalte, es engt nicht ein.

```dax
Umsatz Nord := CALCULATE ( [Umsatz]; Region[Name] = "Nord" )
```
In einer Zeile „Süd" der Matrix steht trotzdem der Nord-Umsatz — der Spaltenfilter „Süd" wurde ersetzt.

## KEEPFILTERS

Soll stattdessen die Schnittmenge entstehen:

```dax
Umsatz Nord (geschnitten) := CALCULATE ( [Umsatz]; KEEPFILTERS ( Region[Name] = "Nord" ) )
```
In der Zeile „Süd" ist das Ergebnis nun leer — Süd **und** Nord ergibt nichts. Genau das ist meist gewollt, wenn eine Kennzahl innerhalb einer bestehenden Aufgliederung eingeschränkt werden soll.

## Filterargumente

Einfache Prädikate sind Kurzschreibweisen:

```dax
CALCULATE ( [Umsatz]; Produkt[Kategorie] = "Getränke" )
-- ist intern
CALCULATE ( [Umsatz]; FILTER ( ALL ( Produkt[Kategorie] ); Produkt[Kategorie] = "Getränke" ) )
```

Das erklärt das Überschreibungsverhalten: Das implizite `ALL` entfernt den bestehenden Filter der Spalte.

Komplexere Bedingungen brauchen eine Tabelle:

```dax
Große Buchungen := CALCULATE ( [Umsatz]; FILTER ( Buchungen; Buchungen[Betrag] > 1000 ) )
```
Achtung: `FILTER` über die gesamte Faktentabelle iteriert zeilenweise. Wo möglich, auf eine schmale Spalte filtern:
```dax
CALCULATE ( [Umsatz]; FILTER ( VALUES ( Buchungen[Betragsklasse] ); … ) )
```

Mehrere Filterargumente werden **UND**-verknüpft. Für ODER innerhalb einer Spalte:
```dax
CALCULATE ( [Umsatz]; Region[Name] IN { "Nord"; "West" } )
```
Für ODER über verschiedene Spalten braucht es eine Tabellenfunktion mit `||`.

## Filter entfernen

```dax
Gesamtumsatz     := CALCULATE ( [Umsatz]; REMOVEFILTERS () )
Umsatz aller Jahre := CALCULATE ( [Umsatz]; REMOVEFILTERS ( Kalender ) )
Anteil an Kategorie := DIVIDE ( [Umsatz]; CALCULATE ( [Umsatz]; REMOVEFILTERS ( Produkt[Artikel] ) ) )
```

`REMOVEFILTERS` ist der lesbarere Name für `ALL` in der Rolle als Filterentferner. `ALL` bleibt richtig, wenn eine Tabelle als *Tabellenwert* gebraucht wird.

## Variablen und Auswertungszeitpunkt

`VAR` wird **einmal** ausgewertet, und zwar in dem Kontext, in dem es steht — nicht dort, wo es verwendet wird:

```dax
Wachstum % :=
VAR Aktuell = [Umsatz]
VAR Vorjahr = CALCULATE ( [Umsatz]; SAMEPERIODLASTYEAR ( Kalender[Datum] ) )
RETURN DIVIDE ( Aktuell - Vorjahr; Vorjahr )
```

Eine Variable innerhalb eines späteren `CALCULATE` behält ihren ursprünglichen Wert — sie ist immun gegen die Kontextänderung. Das ist häufig genau die Rettung und gelegentlich die Überraschung.

Variablen machen DAX außerdem schneller (einmal statt mehrfach berechnet) und lesbar. Faustregel: Sobald ein Measure länger als drei Zeilen wird, mit `VAR` strukturieren.

## Häufige Muster

```dax
-- Sicherer Nenner
Marge % := DIVIDE ( [Deckungsbeitrag]; [Umsatz] )        -- kein #DIV/0

-- Kennzahl nur auf Detailebene zeigen
Auslastung % := IF ( ISINSCOPE ( Zimmer[Kategorie] ); [Belegt] / [Verfügbar] )

-- Rangliste
Rang := IF ( HASONEVALUE ( Produkt[Artikel] );
             RANKX ( ALLSELECTED ( Produkt[Artikel] ); [Umsatz]; ; DESC ) )

-- Vorjahresvergleich in einem Measure
vs. VJ % := VAR VJ = CALCULATE ( [Umsatz]; SAMEPERIODLASTYEAR ( Kalender[Datum] ) )
            RETURN DIVIDE ( [Umsatz] - VJ; VJ )

-- Kumuliert seit Jahresbeginn
YTD := CALCULATE ( [Umsatz]; DATESYTD ( Kalender[Datum] ) )
```

::: quiz
F: Warum zeigt `CALCULATE([Umsatz]; Region[Name]="Nord")` in der Matrixzeile „Süd" trotzdem den Nord-Wert?
A: Filterargumente überschreiben bestehende Filter auf derselben Spalte. Mit `KEEPFILTERS` entsteht stattdessen die Schnittmenge — und die ist hier leer.

F: In welchem Kontext wird eine `VAR` ausgewertet?
A: In dem, in dem sie definiert wurde — nicht in dem, in dem sie verwendet wird. Spätere `CALCULATE`-Kontextänderungen ändern ihren Wert nicht mehr.
:::
