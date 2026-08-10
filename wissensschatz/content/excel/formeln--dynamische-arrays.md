---
id: excel-dynamische-arrays
title: Dynamische Arrays und der Überlaufbereich
path: excel/formeln
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [dynamische-arrays, filter, sortieren, m365]
prereqs: [excel-formelsprache]
related: [excel-let-lambda, excel-matrix-legacy, excel-nachschlagen]
summary: Seit 2019 gibt eine Formel ganze Bereiche zurück. Das ändert nicht nur die Syntax, sondern die Art, Modelle zu bauen.
---

## Kern

Eine Formel liefert nicht mehr einen Wert, sondern ein **Array**, das in die Nachbarzellen **überläuft** (spill). Die Formel steht nur in der linken oberen Zelle; der Rest ist Ergebnis und nicht bearbeitbar. Der Bereich wird blau umrandet und schrumpft oder wächst automatisch mit der Datenmenge.

Der **Überlaufoperator** `#` referenziert den gesamten Bereich: Steht die Formel in `D2`, meint `D2#` alles, was sie ausgibt — unabhängig davon, ob das gerade 3 oder 3.000 Zeilen sind.

## Die Kernfunktionen

| Funktion | Zweck |
|---|---|
| `FILTER(Array; Einschluss; [leer])` | Zeilen nach Bedingung |
| `SORTIEREN(Array; [Index]; [Reihenfolge]; [nach_Spalte])` | sortieren |
| `SORTIERENNACH(Array; nach1; ord1; …)` | nach fremden Spalten sortieren |
| `EINDEUTIG(Array; [nach_Spalte]; [genau_einmal])` | Duplikate entfernen |
| `SEQUENZ(Zeilen; [Spalten]; [Start]; [Schritt])` | Zahlenfolge erzeugen |
| `ZUFALLSMATRIX(...)` | Zufallsmatrix |
| `XVERWEIS` / `XVERGLEICH` | Nachschlagen mit Array-Rückgabe |

Ab 2024 kamen die Umform-Funktionen dazu: `TEXTTEILEN`, `TEXTVOR`, `TEXTNACH`, `ZUSPALTE`, `ZUZEILE`, `WRAPCOLS`/`WRAPROWS`, `VSTAPELN`, `HSTAPELN`, `SPALTENWAHL`, `ZEILENWAHL`, `NACHZEILE`, `NACHSPALTE`, `MATRIXERSTELLEN`, `GRUPPIERENNACH`, `PIVOTBY`.

## Muster, die den Alltag verändern

**Dynamische Auswahlliste ohne Hilfsspalten** — das Ergebnis einer `EINDEUTIG`-Formel als Quelle einer Datenvalidierung, referenziert über `=$H$2#`. Die Liste pflegt sich selbst.

**Abhängige Auswahllisten** in zwei Formeln:
```
H2:  =SORTIEREN(EINDEUTIG(Daten[Land]))
I2:  =SORTIEREN(FILTER(Daten[Stadt]; Daten[Land]=$B$1))
```

**Mehrere Kriterien mit Boolescher Algebra** — `*` ist UND, `+` ist ODER:
```
=FILTER(Daten; (Daten[Region]="Nord")*(Daten[Umsatz]>1000); "keine Treffer")
```

**Top-N-Auswertung** ohne Pivot:
```
=ZEILENWAHL(SORTIERENNACH(Daten; Daten[Umsatz]; -1); SEQUENZ(10))
```

**Kreuztabelle in einer Formel** (ab 2024):
```
=PIVOTBY(Daten[Region]; Daten[Monat]; Daten[Umsatz]; SUMME)
```

## Stolperfallen

- **`#ÜBERLAUF!`** entsteht, wenn im Zielbereich irgendetwas steht — auch ein Leerzeichen oder eine unsichtbar formatierte Zelle. Der blau gestrichelte Rahmen zeigt den beanspruchten Platz.
- **Nicht in intelligente Tabellen**: ListObjects erlauben keinen Überlauf. Ausgabe in einen normalen Bereich.
- **Leere Zellen werden zu 0**, nicht zu Leerstring. `FILTER` auf einer Spalte mit Lücken liefert Nullen — mit `WENN(A2:A100="";"";A2:A100)` abfangen.
- **Abwärtskompatibilität**: In Excel 2016/2019 erscheinen die Formeln mit `_xlfn.`-Präfix als `#NAME?`. Für Dateien, die geteilt werden, ist das die entscheidende Frage.
- **Ganze Spalten vermeiden**: `=FILTER(A:A; B:B="x")` zwingt Excel, über eine Million Zeilen zu arbeiten. Immer auf Tabellen oder begrenzte Bereiche zeigen.

## Warum das mehr ist als Syntaxzucker

Vor den dynamischen Arrays bestand ein Excel-Modell aus vorgefüllten Bereichen: Man zog Formeln 5.000 Zeilen weit „auf Vorrat" herunter und lebte mit leeren Zeilen, `WENN(A2="";"";…)`-Ketten und dem ständigen Risiko, eine Zeile zu vergessen. Jetzt beschreibt eine Formel das **Ergebnis als Ganzes**. Die Mappe kennt ihre eigene Größe. Das reduziert Formelzahl, Dateigröße und Fehlerfläche gleichzeitig — und bringt Excel näher an die Denkweise von Power Query und DAX, wo ohnehin immer über Tabellen gerechnet wird.

::: quiz
F: Was bedeutet `D2#` in einer Formel?
A: Der gesamte Überlaufbereich der Formel in D2 — er passt sich automatisch an, wenn das Ergebnis wächst oder schrumpft.

F: Wie formulierst du „Region Nord UND Umsatz über 1000" in FILTER?
A: Bedingungen multiplizieren: `(Daten[Region]="Nord")*(Daten[Umsatz]>1000)`. Für ODER wird addiert.
:::
