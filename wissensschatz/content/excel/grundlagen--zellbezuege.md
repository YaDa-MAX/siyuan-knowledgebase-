---
id: excel-zellbezuege
title: Zellbezüge — relativ, absolut, gemischt
path: excel/grundlagen
level: 1
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [bezuege, formelaufbau, kopieren]
prereqs: []
related: [excel-namen, excel-tabellen]
summary: Das Dollarzeichen entscheidet, was beim Kopieren einer Formel mitwandert. Wer Bezüge beherrscht, schreibt eine Formel statt hundert.
---

## Kern

Eine Formel in Excel ist nicht an eine Zelle gebunden, sondern an eine **Richtung**. `=A1` bedeutet intern nicht „Zelle A1", sondern „die Zelle eine Spalte links, gleiche Zeile". Genau deshalb verschiebt sich der Bezug beim Kopieren. Das `$` friert eine Koordinate ein.

| Schreibweise | Spalte | Zeile | Verhalten beim Kopieren |
|---|---|---|---|
| `A1` | relativ | relativ | wandert in beide Richtungen |
| `$A$1` | fix | fix | bleibt immer auf A1 |
| `$A1` | fix | relativ | Spalte bleibt, Zeile wandert |
| `A$1` | relativ | fix | Zeile bleibt, Spalte wandert |

`F4` schaltet beim Bearbeiten durch alle vier Varianten.

## Details

**Die Kreuztabelle ist der Klassiker.** Steht in Zeile 1 die Kopfzeile und in Spalte A die Vorspalte, funktioniert eine einzige Formel für den gesamten Block:

```
=$A2*B$1
```

Nach rechts kopiert bleibt `$A` auf der Vorspalte, nach unten kopiert bleibt `B$1` auf der Kopfzeile. Eine Formel, ein Ziehen, fertiges Raster.

**Bereichsbezüge** kombinieren beides: `=SUMME($B$2:$B$100)` bleibt stabil, `=SUMME(B$2:B2)` erzeugt beim Herunterziehen eine kumulierte Summe, weil der Anfang festhängt und das Ende mitwächst.

**Dreidimensionale Bezüge** greifen über Blätter hinweg: `=SUMME(Januar:Dezember!B5)` addiert B5 über alle Blätter zwischen Januar und Dezember — inklusive später dazwischen eingefügter Blätter. Praktisch für Monatsmappen, aber fragil, wenn jemand die Blattreihenfolge ändert.

**Externe Bezüge** auf andere Dateien sehen so aus: `='C:\Pfad\[Datei.xlsx]Blatt'!$A$1`. Sie sind bequem und der häufigste Grund für kaputte Mappen nach zwei Jahren. In dauerhaften Modellen besser durch Power Query ersetzen — das behält die Quelle als dokumentierten, aktualisierbaren Schritt.

**Der Schnittmengen-Operator** ist das unbekannteste Zeichen der Formelsprache: ein Leerzeichen. `=Umsatz Q1` liefert die Zelle, in der sich die benannten Bereiche `Umsatz` und `Q1` überschneiden.

## Stolperfallen

- Eine Zeile einfügen verschiebt auch absolute Bezüge — `$` schützt vor dem Kopieren, nicht vor Strukturänderungen.
- `INDIREKT("A1")` erzeugt einen Textbezug, der Strukturänderungen *nicht* mitgeht und zusätzlich volatil ist (siehe Performance).
- Beim Kopieren zwischen Dateien werden relative Bezüge stillschweigend zu externen Bezügen auf die Quelldatei.

::: quiz
F: Welche Bezugsart braucht die Formel in einer Kreuztabelle, die Vorspalte mal Kopfzeile rechnet?
A: Gemischt: `=$A2*B$1` — Spalte der Vorspalte fix, Zeile der Kopfzeile fix.

F: Warum ist eine kumulierte Summe `=SUMME(B$2:B2)` und nicht `=SUMME(B2:B$2)`?
A: Beides rechnet gleich, aber die Leserichtung ist Konvention: fixer Startpunkt zuerst, mitwachsendes Ende danach. Entscheidend ist, dass genau eine der beiden Grenzen fixiert ist.
:::
