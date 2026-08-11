---
id: powerbi-sternschema
title: Sternschema — die wichtigste Entscheidung im Modell
path: powerbi/modellierung
level: 3
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [modellierung, sternschema, beziehungen, dimensionen]
prereqs: [powerbi-komponenten]
related: [powerbi-beziehungen, powerbi-kalendertabelle, powerbi-dax-kontext, excel-datenmodell]
summary: Fakten in der Mitte, Dimensionen außen. Fast jedes DAX-Problem, das sich hartnäckig anfühlt, ist in Wahrheit ein Modellproblem.
---

## Kern

Ein Sternschema trennt zwei Arten von Tabellen:

- **Faktentabelle** — was passiert ist. Viele Zeilen, wenige Spalten: Fremdschlüssel plus Kennzahlen. Buchungen, Umsätze, Zeiterfassungen, Übernachtungen.
- **Dimensionstabellen** — worüber ausgewertet wird. Wenige Zeilen, viele beschreibende Spalten: Kalender, Artikel, Kunde, Mitarbeiter, Zimmerkategorie, Vertriebskanal.

Beziehungen laufen 1:n von der Dimension zur Faktentabelle. Filter fließen von der Dimension in den Fakt.

::: viz sternschema
:::

## Warum nicht einfach eine breite Tabelle?

Die flache Tabelle ist verlockend, weil sie in Excel funktioniert hat. Im Tabular-Modell kostet sie:

1. **Speicher und Tempo.** VertiPaq komprimiert spaltenweise über Wörterbücher. Eine Spalte „Kundenname" mit 500 verschiedenen Werten komprimiert in einer 500-Zeilen-Dimension hervorragend, in einer 20-Millionen-Zeilen-Faktentabelle deutlich schlechter.
2. **Korrekte Filterung.** Zwei Faktentabellen (z. B. Buchungen und Zielwerte) lassen sich nur über gemeinsame Dimensionen zusammen auswerten. Ohne Dimensionstabellen gibt es keinen gemeinsamen Filterpunkt.
3. **Vollständigkeit.** Eine Artikeldimension enthält auch Artikel ohne Umsatz — die flache Tabelle kennt sie nicht. „Welche Zimmerkategorien wurden diesen Monat *nicht* gebucht?" ist nur mit Dimension beantwortbar.
4. **Verständlichkeit.** Nutzer im Feldbereich finden „Kunde ▸ Region" schneller als eine Spalte unter 60 anderen.

## Schneeflocke, und warum man sie meist auflöst

Beim Schneeflockenschema hängen Dimensionen an weiteren Dimensionen (Artikel → Warengruppe → Warenbereich). Das ist normalisiert und aus Datenbanksicht sauber, kostet im Tabular-Modell aber einen zusätzlichen Beziehungssprung je Filter und macht den Feldbereich unübersichtlich. Übliche Praxis: In Power Query **flach ziehen** (denormalisieren) — Warengruppe und Warenbereich als Spalten in die Artikeldimension.

## Typische Sonderfälle

**Rollenspielende Dimension** — der Kalender wird für Buchungsdatum, Anreisedatum und Abreisedatum gebraucht. Eine physische Beziehung ist aktiv, die anderen inaktiv; aktiviert werden sie in DAX mit `USERELATIONSHIP`:

```dax
Anreisen := CALCULATE(COUNTROWS(Buchungen); USERELATIONSHIP(Kalender[Datum]; Buchungen[Anreise]))
```
Alternative: die Dimension mehrfach laden (`Kalender Buchung`, `Kalender Anreise`). Mehr Speicher, dafür für Nutzer selbsterklärend.

**n:m-Beziehung** — ein Gast hat mehrere Präferenzen, eine Präferenz gehört mehreren Gästen. Lösung ist eine **Brückentabelle** mit den eindeutigen Schlüsselpaaren. Die direkte m:n-Beziehung, die Power BI anbietet, funktioniert, verhält sich aber bei Summen und Gesamtzeilen unintuitiv — bewusst einsetzen.

**Kennzahlentabelle** — eine leere Tabelle, die nur Measures enthält. Sie sortiert sich im Feldbereich nach oben und trennt Kennzahlen sichtbar von Feldern. Kostet nichts, hilft jedem Nutzer.

**Junk-Dimension** — viele kleine Ja/Nein- und Statusattribute in einer gemeinsamen Dimension bündeln, statt je Attribut eine Tabelle anzulegen.

## Prüffragen für ein Modell

1. Hat jede Faktentabelle nur Schlüssel und Kennzahlen?
2. Gibt es eine als Datumstabelle markierte Kalendertabelle?
3. Sind alle Beziehungen 1:n mit Einfachrichtung?
4. Sind Schlüsselspalten in der Berichtsansicht ausgeblendet?
5. Haben alle Measures ein Format und eine sinnvolle Anzeigekategorie?
6. Ist die Modellansicht auf einen Blick als Stern erkennbar?

Wenn Frage 6 mit Nein beantwortet wird, ist das kein Schönheitsfehler — es ist die Ursache der DAX-Probleme, die drei Wochen später auftauchen.

::: quiz
F: Warum lassen sich zwei Faktentabellen ohne gemeinsame Dimensionen nicht sinnvoll gemeinsam auswerten?
A: Es fehlt der gemeinsame Filterpunkt. Erst die geteilte Dimension filtert beide Fakten gleichzeitig — sonst reagiert nur eine Tabelle.

F: Wozu dient `USERELATIONSHIP`?
A: Zum Aktivieren einer inaktiven Beziehung innerhalb eines Measures — der Standardweg für rollenspielende Dimensionen wie mehrere Datumsbezüge.
:::
