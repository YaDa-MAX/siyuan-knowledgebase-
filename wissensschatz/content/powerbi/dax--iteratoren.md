---
id: powerbi-dax-iteratoren
title: Iteratoren und Tabellenfunktionen
path: powerbi/dax
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [dax, iteratoren, sumx, tabellenfunktionen]
prereqs: [powerbi-dax-kontext]
related: [powerbi-dax-calculate, powerbi-performance]
summary: X-Funktionen rechnen zeilenweise und summieren danach. Der Unterschied zwischen SUM und SUMX entscheidet über Richtigkeit, nicht über Stil.
---

## SUM gegen SUMX

```dax
Umsatz falsch := SUM ( Positionen[Menge] ) * SUM ( Positionen[Preis] )
Umsatz richtig := SUMX ( Positionen; Positionen[Menge] * Positionen[Preis] )
```

Die erste Zeile multipliziert Gesamtmenge mit Gesamtpreis — sinnlos, sobald mehr als eine Zeile beteiligt ist. `SUMX` legt für jede Zeile einen Zeilenkontext an, rechnet dort, und summiert die Einzelergebnisse. **Erst rechnen, dann aggregieren.**

Die Regel: Sobald in der Formel zwei Spalten *multipliziert oder verglichen* werden, braucht es einen Iterator.

## Die X-Familie

`SUMX`, `AVERAGEX`, `MINX`, `MAXX`, `COUNTX`, `PRODUCTX`, `CONCATENATEX`, `RANKX`, `MEDIANX`, `STDEVX.S`, `GEOMEANX` — alle nach demselben Muster: `FUNKTIONX ( <Tabelle>; <Ausdruck> )`.

`CONCATENATEX` ist der unterschätzte Vertreter: Er baut aus einer Spalte einen Text und ist damit das Werkzeug für dynamische Titel und Erläuterungen im Bericht.

```dax
Filtertitel := "Umsatz " & CONCATENATEX ( VALUES ( Region[Name] ); Region[Name]; ", "; Region[Name] )
```

## Tabellenfunktionen

Sie geben Tabellen zurück und dienen als Zwischenschritt:

| Funktion | Wirkung |
|---|---|
| `FILTER(Tabelle; Bedingung)` | Zeilen einschränken (iteriert!) |
| `VALUES(Spalte)` / `DISTINCT(Spalte)` | sichtbare Werte; `VALUES` enthält ggf. die Leerzeile |
| `ALL` / `ALLSELECTED` / `ALLEXCEPT` | Filter entfernen |
| `SUMMARIZE(Tabelle; Gruppierung…)` | gruppieren |
| `SUMMARIZECOLUMNS(…)` | die moderne Variante — bevorzugt für Abfragen |
| `ADDCOLUMNS(Tabelle; Name; Ausdruck)` | Spalten anfügen |
| `SELECTCOLUMNS(…)` | Spalten auswählen und umbenennen |
| `CROSSJOIN` / `UNION` / `INTERSECT` / `EXCEPT` | Mengenoperationen |
| `TOPN(n; Tabelle; Ausdruck; Reihenfolge)` | die n besten Zeilen |
| `GENERATE` / `GENERATEALL` | Zeilen je Zeile erzeugen |
| `NATURALINNERJOIN` / `NATURALLEFTOUTERJOIN` | Verknüpfung über gleichnamige Spalten |
| `TREATAS(Tabelle; Spalte…)` | überträgt Werte als Filter auf eine Spalte ohne Beziehung |
| `DATATABLE(…)` | kleine Konstantentabelle direkt in DAX |

**Wichtige Konvention:** In `SUMMARIZE` nur gruppieren, niemals aggregieren — für berechnete Spalten `ADDCOLUMNS` außen herumlegen. Das umgeht ein bekanntes Verhalten von `SUMMARIZE`, bei dem Aggregationen in ungewohnten Kontexten ausgewertet werden.

```dax
-- gute Form
ADDCOLUMNS ( SUMMARIZE ( Buchungen; Kunde[Name] ); "Umsatz"; [Umsatz] )
```

## TREATAS — Filtern ohne Beziehung

Wenn zwei Tabellen fachlich zusammengehören, aber keine Beziehung haben oder haben sollen:

```dax
Ziel im Kontext :=
CALCULATE (
    SUM ( Ziele[Zielwert] );
    TREATAS ( VALUES ( Kalender[JahrMonat] ); Ziele[Monat] )
)
```

Das ist der saubere Weg für Planwerte auf gröberer Granularität — Monatsziele gegen Tagesbuchungen, ohne eine künstliche Beziehung ins Modell zu zwingen.

## Virtuelle Tabellen als Denkmodell

Fortgeschrittenes DAX besteht darin, in Tabellen statt in Werten zu denken:

```dax
Kunden mit Umsatzsteigerung :=
VAR AktuellerZeitraum =
    ADDCOLUMNS ( VALUES ( Kunde[KundeID] ); "@Jetzt"; [Umsatz]; "@Vorher"; [Umsatz VJ] )
VAR Gewachsen =
    FILTER ( AktuellerZeitraum; [@Jetzt] > [@Vorher] )
RETURN
    COUNTROWS ( Gewachsen )
```

Solche Konstruktionen sind mächtig — und teuer. Jede virtuelle Tabelle wird materialisiert. Bei großen Dimensionen ist das der übliche Grund für Berichte, die plötzlich zehn Sekunden brauchen.

## Performance-Faustregeln

- `FILTER` möglichst auf schmale Spalten (`VALUES(Spalte)`) statt auf ganze Faktentabellen.
- Einfache Prädikate in `CALCULATE` sind schneller als ein ausgeschriebenes `FILTER`.
- `COUNTROWS(Tabelle)` schlägt `COUNTX(Tabelle; 1)`.
- `DIVIDE` statt `/` — fängt Division durch null ohne zusätzliche Verzweigung ab.
- `SELECTEDVALUE` statt `IF(HASONEVALUE(…); VALUES(…))`.
- Iteratoren über Millionen Zeilen mit komplexem Ausdruck sind der teuerste Einzelposten in fast jedem langsamen Modell.

::: quiz
F: Wann brauchst du zwingend einen Iterator wie SUMX?
A: Sobald der Ausdruck zwei Spalten zeilenweise verknüpft (Menge × Preis). Aggregierte Spaltenwerte zuerst zu summieren und dann zu multiplizieren, liefert falsche Ergebnisse.

F: Wie filterst du eine Tabelle nach Werten einer anderen, ohne eine Beziehung anzulegen?
A: Mit `TREATAS` innerhalb von `CALCULATE`.
:::
