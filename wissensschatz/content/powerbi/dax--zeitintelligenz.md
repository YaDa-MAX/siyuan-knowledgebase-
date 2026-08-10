---
id: powerbi-dax-time-intelligence
title: Zeitintelligenz — Vorjahr, YTD, gleitende Werte
path: powerbi/dax
level: 4
type: rezept
source: ki
status: geprueft
updated: 2026-08-09
tags: [dax, zeitintelligenz, vorjahr, ytd]
prereqs: [powerbi-kalendertabelle, powerbi-dax-calculate]
related: [powerbi-dax-iteratoren]
summary: Die Standardmuster für Zeitvergleiche — und die drei Voraussetzungen, ohne die sie stillschweigend leer bleiben.
---

## Voraussetzungen

Alle Zeitintelligenzfunktionen setzen dreierlei voraus:

1. Eine **eigene Kalendertabelle**, lückenlos, mit eindeutiger Datumsspalte.
2. Diese Tabelle ist **als Datumstabelle markiert**.
3. Gefiltert wird über die **Kalendertabelle**, nicht über das Datum der Faktentabelle.

Fehlt eine davon, liefern die Measures leere Werte oder — schlimmer — plausibel aussehende falsche.

## Die Standardmuster

```dax
Umsatz := SUM ( Buchungen[Betrag] )

-- Vergleich zum Vorjahr
Umsatz VJ   := CALCULATE ( [Umsatz]; SAMEPERIODLASTYEAR ( Kalender[Datum] ) )
Umsatz VJ 2 := CALCULATE ( [Umsatz]; DATEADD ( Kalender[Datum]; -1; YEAR ) )
Delta VJ    := [Umsatz] - [Umsatz VJ]
Delta VJ %  := DIVIDE ( [Umsatz] - [Umsatz VJ]; [Umsatz VJ] )

-- Vormonat
Umsatz VM   := CALCULATE ( [Umsatz]; DATEADD ( Kalender[Datum]; -1; MONTH ) )

-- Kumuliert
YTD := CALCULATE ( [Umsatz]; DATESYTD ( Kalender[Datum] ) )
QTD := CALCULATE ( [Umsatz]; DATESQTD ( Kalender[Datum] ) )
MTD := CALCULATE ( [Umsatz]; DATESMTD ( Kalender[Datum] ) )

-- Geschäftsjahr, das im November beginnt
YTD GJ := CALCULATE ( [Umsatz]; DATESYTD ( Kalender[Datum]; "31.10" ) )

-- Gleitende 12 Monate
R12M := CALCULATE ( [Umsatz]; DATESINPERIOD ( Kalender[Datum]; MAX ( Kalender[Datum] ); -12; MONTH ) )

-- Gleitender Durchschnitt über 7 Tage
Ø 7 Tage :=
AVERAGEX ( DATESINPERIOD ( Kalender[Datum]; MAX ( Kalender[Datum] ); -7; DAY ); [Umsatz] )

-- Laufende Summe über alles
Kumuliert :=
CALCULATE ( [Umsatz]; FILTER ( ALLSELECTED ( Kalender[Datum] ); Kalender[Datum] <= MAX ( Kalender[Datum] ) ) )

-- Bestandsgröße: letzter Wert der Periode statt Summe
Bestand := CALCULATE ( SUM ( Bestand[Menge] ); LASTNONBLANK ( Kalender[Datum]; CALCULATE ( SUM ( Bestand[Menge] ) ) ) )
```

## SAMEPERIODLASTYEAR gegen DATEADD

`SAMEPERIODLASTYEAR` verschiebt exakt ein Jahr. `DATEADD` kann beliebige Einheiten und ist damit flexibler. Beide behandeln den 29. Februar über eine eingebaute Konvention — bei tagesgenauen Vergleichen im Schaltjahr lohnt eine Kontrolle.

Für Branchen mit starkem Wochentagseffekt — Hotellerie, Gastronomie, Handel — ist der Vergleich „gleicher Kalendertag im Vorjahr" oft irreführend, weil ein Samstag mit einem Dienstag verglichen wird. Der fachlich richtige Vergleich ist dann **52 Wochen zurück**:

```dax
Umsatz VJ (Wochentagstreu) := CALCULATE ( [Umsatz]; DATEADD ( Kalender[Datum]; -364; DAY ) )
```
364 Tage sind exakt 52 Wochen — der Wochentag stimmt, der Kalendertag verschiebt sich leicht. Welche Variante richtig ist, hängt vom Geschäft ab und gehört ins Datenwörterbuch geschrieben.

## Der abstürzende Verlauf

Ein YTD-Verlauf im laufenden Monat fällt am Monatsende auf null, weil für zukünftige Tage keine Daten existieren. Zwei Lösungen:

```dax
-- 1) Measure blendet Zukunft aus
YTD := IF ( MAX ( Kalender[Datum] ) <= TODAY (); CALCULATE ( [Umsatz]; DATESYTD ( Kalender[Datum] ) ) )

-- 2) Besser: Kalenderspalte "Ist Vergangenheit" als Berichtsfilter
```

Variante 2 ist vorzuziehen — sie wirkt für alle Measures gleichzeitig statt in jedem einzeln.

## Vergleich unvollständiger Perioden

Der laufende Monat gegen den vollen Vormonat ist kein fairer Vergleich. Der übliche Kunstgriff schneidet das Vorjahr auf denselben Tagesstand:

```dax
Umsatz VJ bis heute :=
VAR LetzterTag = MAX ( Kalender[Datum] )
VAR TagImJahr  = DATEDIFF ( DATE ( YEAR ( LetzterTag ); 1; 1 ); LetzterTag; DAY )
RETURN
CALCULATE (
    [Umsatz];
    DATESYTD ( Kalender[Datum] );
    Kalender[Tag im Jahr] <= TagImJahr;
    SAMEPERIODLASTYEAR ( Kalender[Datum] )
)
```

## Kalkulationsgruppen

Wenn `[Umsatz]`, `[Deckungsbeitrag]`, `[Gäste]` und `[Auslastung]` jeweils Vorjahr, YTD und Wachstum brauchen, entstehen aus 4 Kennzahlen schnell 20 Measures. **Kalkulationsgruppen** (Tabular Editor bzw. der Editor in Power BI Desktop) definieren die Zeitlogik **einmal** und wenden sie auf jede beliebige Kennzahl an:

```dax
-- Kalkulationselement "VJ"
CALCULATE ( SELECTEDMEASURE (); SAMEPERIODLASTYEAR ( Kalender[Datum] ) )
```

Der Nutzer zieht die Kennzahl ins Visual und wählt über einen Datenschnitt die Zeitvariante. Das ist der größte Einzelhebel gegen wuchernde Measure-Listen — und die Grenze, an der aus einem Bericht ein gepflegtes Modell wird.

::: quiz
F: Warum ist der Vorjahresvergleich in der Hotellerie oft besser mit −364 Tagen als mit SAMEPERIODLASTYEAR?
A: Weil der Wochentag die Nachfrage stärker treibt als das Kalenderdatum. 364 Tage sind exakt 52 Wochen und halten den Wochentag konstant.

F: Wozu dienen Kalkulationsgruppen?
A: Die Zeitlogik (VJ, YTD, Wachstum) wird einmal definiert und auf jede beliebige Kennzahl angewendet, statt sie je Kennzahl zu duplizieren.
:::
