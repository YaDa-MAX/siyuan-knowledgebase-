---
id: excel-matrix-legacy
title: Klassische Matrixformeln und SUMMENPRODUKT
path: excel/formeln
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [matrixformeln, summenprodukt, kompatibilitaet]
prereqs: [excel-formelsprache]
related: [excel-dynamische-arrays, excel-performance]
summary: Was man vor 2019 gebaut hat — und weiterhin braucht, wenn eine Datei in älteren Excel-Versionen laufen muss.
---

## Warum das noch relevant ist

Dynamische Arrays gibt es erst ab Microsoft 365 und Excel 2021. Wer eine Datei an Empfänger mit Excel 2016 oder 2019 gibt, kann `FILTER` und `EINDEUTIG` nicht verwenden — dort erscheinen sie als `#NAME?`. Die klassischen Muster sind deshalb keine Nostalgie, sondern die Kompatibilitätsebene. Und `SUMMENPRODUKT` ist bis heute in jeder Version dasselbe.

## SUMMENPRODUKT als Bedingungsmaschine

`SUMMENPRODUKT` multipliziert Arrays elementweise und summiert das Ergebnis — und rechnet dabei ohne `Strg`+`Umschalt`+`Enter` über Arrays. Der Trick ist, Wahrheitswerte als 1 und 0 zu benutzen:

```
Zählen mit UND      =SUMMENPRODUKT((A2:A99="Nord")*(B2:B99>1000))
Summieren mit UND   =SUMMENPRODUKT((A2:A99="Nord")*(B2:B99>1000)*C2:C99)
ODER                =SUMMENPRODUKT(((A2:A99="Nord")+(A2:A99="West"))*C2:C99)
Gewichteter Schnitt =SUMMENPRODUKT(Menge;Preis)/SUMME(Menge)
```

`*` ist UND, `+` ist ODER. Beim ODER muss man aufpassen: Trifft ein Element beide Bedingungen, wird es zu 2 — dann `--((…)+(…)>0)` verwenden.

Das doppelte Minus (`--`) wandelt `WAHR`/`FALSCH` in 1/0. Nötig, wenn keine Multiplikation stattfindet: `=SUMMENPRODUKT(--(A2:A99>0))`.

**Grenzen:** `SUMMENPRODUKT` kann keine ganzen Spalten sinnvoll verarbeiten (Rechenzeit) und verträgt keine Fehlerwerte im Bereich — ein einziges `#NV` macht das Ergebnis zu `#NV`. Wo `SUMMEWENNS` und `ZÄHLENWENNS` reichen, sind sie schneller, weil sie intern optimiert sind.

## Klassische Matrixformeln (CSE)

Mit `Strg`+`Umschalt`+`Enter` abgeschlossen, erkennbar an den geschweiften Klammern `{=…}`, die Excel selbst setzt.

```
{=MAX(WENN(A2:A99="Nord"; C2:C99))}                Maximum unter Bedingung (vor MAXWENNS)
{=SUMME(WENN(ZÄHLENWENN(A2:A99;A2:A99)=1;1;0))}    Anzahl einmaliger Werte
{=SUMME(1/ZÄHLENWENN(A2:A99;A2:A99))}              Anzahl eindeutiger Werte
{=INDEX(C:C;VERGLEICH(1;(A:A=X)*(B:B=Y);0))}       Nachschlagen mit zwei Kriterien
{=KKLEINSTE(WENN(Bed;ZEILE(Bereich));ZEILE()-1)}   n-ter Treffer — Basis für FILTER-Ersatz
```

Der letzte Ausdruck ist das Herz aller vor-2019er „Filterformeln": Man erzeugt ein Array aus Zeilennummern der Treffer und holt daraus per `KKLEINSTE` den ersten, zweiten, dritten Treffer — heruntergezogen ergibt das eine gefilterte Liste.

Vorsicht bei `ZÄHLENWENN`-basierten Eindeutigkeitsformeln: Leere Zellen im Bereich führen zu `#DIV/0!`. Absichern mit `=SUMME(WENN(A2:A99<>"";1/ZÄHLENWENN(A2:A99;A2:A99)))`.

## Umstieg auf dynamische Arrays

| Klassisch | Modern |
|---|---|
| `{=SUMME(1/ZÄHLENWENN(…))}` | `=ANZAHL2(EINDEUTIG(…))` |
| `{=MAX(WENN(Bed;Werte))}` | `=MAXWENNS(Werte;Bereich;Krit)` |
| `{=KKLEINSTE(WENN(…))}`-Kaskade | `=FILTER(…)` |
| `=SUMMENPRODUKT((A=x)*(B=y)*C)` | `=SUMMEWENNS(C;A;x;B;y)` |
| `{=INDEX(…;VERGLEICH(1;(…)*(…);0))}` | `=XVERWEIS(1;(…)*(…);Rückgabe)` |
| Hilfsspalte mit Rang | `=SORTIERENNACH(…)` |

Beim Öffnen alter Dateien in neuem Excel bleiben CSE-Formeln erhalten und rechnen unverändert. Umgekehrt gilt: In einer alten Version zeigen moderne Funktionen `#NAME?` mit `_xlfn.`-Präfix. Prüfen lässt sich das über *Datei ▸ Informationen ▸ Auf Probleme prüfen ▸ Kompatibilität prüfen*.

::: quiz
F: Wofür steht das doppelte Minus in `=SUMMENPRODUKT(--(A2:A99>0))`?
A: Es wandelt Wahrheitswerte in 1/0. Ohne Multiplikation mit einem anderen Array würde SUMMENPRODUKT sonst nur Wahrheitswerte sehen und 0 liefern.

F: Warum liefert `{=SUMME(1/ZÄHLENWENN(A2:A99;A2:A99))}` einen Fehler, wenn der Bereich Leerzellen enthält?
A: Für leere Zellen ist ZÄHLENWENN 0 → Division durch null. Bedingung `A2:A99<>""` vorschalten.
:::
