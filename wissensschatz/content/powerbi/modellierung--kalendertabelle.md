---
id: powerbi-kalendertabelle
title: Kalendertabelle und Zeitintelligenz
path: powerbi/modellierung
level: 3
type: rezept
source: ki
status: geprueft
updated: 2026-08-09
tags: [kalender, zeitintelligenz, dax, modellierung]
prereqs: [powerbi-sternschema]
related: [powerbi-dax-time-intelligence, powerbi-beziehungen]
summary: Ohne eigene Datumstabelle funktioniert keine Zeitintelligenz zuverlässig. Ein fertiges DAX-Rezept plus die Regeln, die sie erfüllen muss.
---

## Warum eine eigene Tabelle

Die Datumsspalte der Faktentabelle enthält nur Tage, an denen etwas passiert ist. Für Vorjahresvergleiche, laufende Summen und Monatsverläufe braucht die Engine eine **lückenlose** Datumsachse — sonst fehlen genau die Perioden ohne Umsatz, und das Vorjahr steht auf leer.

Die automatische Datums­hierarchie von Power BI (Optionen ▸ Datum/Uhrzeit automatisch) legt hinter jeder Datumsspalte eine versteckte Tabelle an. Das bläht das Modell auf, ist nicht anpassbar und funktioniert nicht über mehrere Tabellen hinweg. **Abschalten** und eine eigene Kalendertabelle bauen.

## Die vier Regeln

1. Eine Zeile je Tag, **lückenlos**, vom 1. Januar des frühesten bis zum 31. Dezember des spätesten Jahres.
2. Die Datumsspalte ist **eindeutig** und vom Typ Datum ohne Uhrzeit.
3. Die Tabelle ist als **Datumstabelle markiert** (Tabellentools ▸ Als Datumstabelle markieren).
4. Alle Auswertungen filtern über die Kalendertabelle, nicht über das Datum der Faktentabelle.

## Fertiges Rezept

```dax
Kalender =
VAR Start = DATE ( YEAR ( MIN ( Buchungen[Datum] ) ); 1; 1 )
VAR Ende  = DATE ( YEAR ( MAX ( Buchungen[Datum] ) ); 12; 31 )
RETURN
ADDCOLUMNS (
    CALENDAR ( Start; Ende );
    "Jahr";            YEAR ( [Date] );
    "Monatsnr";        MONTH ( [Date] );
    "Monat";           FORMAT ( [Date]; "MMM" );
    "JahrMonat";       FORMAT ( [Date]; "YYYY-MM" );
    "Quartal";         "Q" & QUARTER ( [Date] );
    "JahrQuartal";     YEAR ( [Date] ) & "-Q" & QUARTER ( [Date] );
    "Tag im Monat";    DAY ( [Date] );
    "Wochentagnr";     WEEKDAY ( [Date]; 2 );
    "Wochentag";       FORMAT ( [Date]; "ddd" );
    "ISO-Woche";       WEEKNUM ( [Date]; 21 );
    "Ist Wochenende";  WEEKDAY ( [Date]; 2 ) > 5;
    "Ist Vergangenheit"; [Date] <= TODAY ();
    "Tage bis heute";  DATEDIFF ( [Date]; TODAY (); DAY );
    "Saison";          SWITCH ( TRUE ();
                          MONTH ( [Date] ) IN { 12; 1; 2 }; "Winter";
                          MONTH ( [Date] ) IN { 3; 4; 5 };  "Frühjahr";
                          MONTH ( [Date] ) IN { 6; 7; 8 };  "Sommer";
                          "Herbst" )
)
```

## Sortierung der Textspalten

`Monat` als Text sortiert alphabetisch — April vor Januar. Deshalb: Spalte markieren ▸ *Nach Spalte sortieren* ▸ `Monatsnr`. Dasselbe für Wochentag (nach `Wochentagnr`) und Quartal. Ohne diesen Schritt sieht jeder Bericht falsch aus.

Voraussetzung: Die Sortierspalte muss je Textwert **eindeutig** sein. „Jan" darf nicht einmal auf 1 und einmal auf 13 zeigen.

## Erweiterungen für die Praxis

**Relative Perioden** — Spalten wie `Monatsversatz = DATEDIFF(TODAY(); [Date]; MONTH)`. Damit filtert man „letzte 12 Monate" in einem Datenschnitt ohne jede DAX-Akrobatik, und der Filter bleibt bei jeder Aktualisierung richtig.

**Geschäftsjahr**, falls es nicht dem Kalenderjahr entspricht (in der Hotellerie oft Saisonjahre):
```dax
"Geschäftsjahr"; IF ( MONTH ( [Date] ) >= 11; YEAR ( [Date] ) + 1; YEAR ( [Date] ) )
```

**Feiertage und Sperrzeiten** als zusätzliche Spalten aus einer gepflegten Liste, per Merge in Power Query. Für Hotel- und Gastronomieauswertungen ist die Unterscheidung Feiertag/Brückentag/Ferien oft aussagekräftiger als der Wochentag.

**`Ist Vergangenheit`** ist die eleganteste Lösung gegen den abstürzenden Verlauf am Monatsende: Alle Visuals auf `Ist Vergangenheit = WAHR` filtern, dann endet die Linie am letzten Tag mit Daten statt bei null weiterzulaufen.

## Alternative: Kalender in Power Query

Statt DAX lässt sich die Tabelle auch in M erzeugen (`List.Dates`). Vorteil: Sie ist Teil der Datenaufbereitung, kann in mehreren Modellen als Dataflow wiederverwendet werden und lässt sich mit Feiertagsquellen zusammenführen. Nachteil: Sie braucht eine Aktualisierung, um in die Zukunft zu wachsen. Für ein zentrales Modell ist die M-Variante der sauberere Weg.

::: quiz
F: Warum sortiert „Monat" falsch und wie behebt man es dauerhaft?
A: Als Text wird alphabetisch sortiert. Lösung: „Nach Spalte sortieren" auf eine numerische Monatsspalte, die je Textwert eindeutig ist.

F: Wozu dient eine Spalte `Ist Vergangenheit` in der Kalendertabelle?
A: Um Verlaufsvisuals am letzten Tag mit Daten enden zu lassen, statt sie für Resttage des Monats auf null abstürzen zu lassen.
:::
