---
id: excel-namen
title: Namen und Namensmanager
path: excel/grundlagen
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [namen, bezuege, wartbarkeit]
prereqs: [excel-zellbezuege]
related: [excel-let-lambda, excel-modellbau]
summary: Ein benannter Bereich macht aus $B$4 einen Begriff. Gültigkeitsbereich und dynamische Namen sind die beiden Punkte, an denen es interessant wird.
---

## Kern

`Strg` + `F3` öffnet den Namensmanager. Ein Name bindet einen Bezug, eine Konstante oder eine Formel an einen Bezeichner. Aus `=B4*$F$2` wird `=Menge*MwSt_Satz` — selbsterklärend und beim Umbau des Blattes stabil.

Regeln: Buchstabe oder `_` am Anfang, keine Leerzeichen, keine Zeichenfolge, die wie ein Zellbezug aussieht (`A1`, `XFD10`, aber auch `Q1` in neueren Versionen), maximal 255 Zeichen, nicht `C` oder `R` allein.

## Gültigkeitsbereich

Der am häufigsten übersehene Punkt: Ein Name gilt entweder für die **Arbeitsmappe** oder nur für **ein Blatt**.

- Mappenweit: überall `=Steuersatz` — der Normalfall.
- Blattweit: derselbe Name kann auf jedem Blatt etwas anderes bedeuten. Angesprochen wird er als `Januar!Umsatz`. Das ist mächtig für identisch aufgebaute Monatsblätter — und die häufigste Ursache für „die Formel rechnet auf Blatt 3 falsch".

Beim Kopieren eines Blattes werden blattweite Namen mitkopiert, mappenweite entstehen als Duplikat mit Suffix `Umsatz_1`. Nach vielen Kopien ist der Namensmanager zugemüllt — regelmäßig aufräumen.

## Namen mit Formel statt Bezug

Ein Name muss auf keinen Bereich zeigen. Er kann eine **Formel** enthalten:

```
MwSt          =0,19                            Konstante
Heute_Monat   =TEXT(HEUTE();"JJJJ-MM")         berechneter Wert
Umsatzliste   =BEREICH.VERSCHIEBEN(Daten!$A$2;0;0;ANZAHL2(Daten!$A:$A)-1;1)
```

Die dritte Variante — der **dynamische Name** — war jahrelang die Standardlösung für mitwachsende Bereiche. Sie hat zwei Nachteile: `BEREICH.VERSCHIEBEN` und `INDIREKT` sind volatil und rechnen bei jeder Änderung neu. Die Alternative mit `INDEX` ist nicht volatil:

```
=Daten!$A$2:INDEX(Daten!$A:$A; ANZAHL2(Daten!$A:$A))
```

Heute erledigen intelligente Tabellen das ohnehin besser. Dynamische Namen bleiben relevant für Fälle, in denen eine Tabelle nicht geht — etwa als Quelle für Diagrammreihen oder Datenvalidierungslisten in alten Dateien.

## Praxis

- **Parameterblatt**: Alle Stellgrößen eines Modells (Sätze, Grenzwerte, Stichtage) auf ein Blatt, jede mit Namen versehen. Dann sind alle Annahmen an einem Ort und in jeder Formel lesbar.
- **Namen aus Auswahl erstellen** (`Strg`+`Umschalt`+`F3`) benennt einen ganzen Block anhand seiner Kopfzeile oder Vorspalte in einem Schritt.
- **`F3`** fügt beim Formelschreiben einen Namen aus der Liste ein.
- **LAMBDA-Funktionen** leben im Namensmanager — dort werden sie definiert und dokumentiert (das Kommentarfeld erscheint in der Formel-QuickInfo).

::: quiz
F: Warum liefert derselbe benannte Bereich auf zwei Blättern verschiedene Werte?
A: Der Name hat Blattgültigkeit statt Mappengültigkeit — meist durch Blattkopie entstanden.

F: Welche Formel macht einen Namen mitwachsend, ohne volatil zu sein?
A: Die INDEX-Variante `=$A$2:INDEX($A:$A;ANZAHL2($A:$A))`. `BEREICH.VERSCHIEBEN` und `INDIREKT` sind volatil.
:::
