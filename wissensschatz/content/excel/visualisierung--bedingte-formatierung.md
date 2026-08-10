---
id: excel-bedingte-formatierung
title: Bedingte Formatierung
path: excel/visualisierung
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [formatierung, visualisierung, regeln]
prereqs: [excel-zellbezuege, excel-formelsprache]
related: [excel-diagramme, excel-datenvalidierung]
summary: Regeln, die Zellen selbst sprechen lassen. Der entscheidende Punkt ist die Bezugsart in der Formelregel.
---

## Kern

Bedingte Formatierung wendet ein Format an, solange eine Bedingung gilt. Sie verändert den Wert nicht — nur die Darstellung. Reihenfolge und „Anhalten"-Kennzeichen im Regelmanager (Start ▸ Bedingte Formatierung ▸ Regeln verwalten) entscheiden, welche Regel bei Überschneidung gewinnt.

## Die eingebauten Regeltypen

- **Zellwert-Regeln** — größer/kleiner/zwischen/enthält Text/Datum in
- **Obere/untere Regeln** — Top 10, obere 10 %, über/unter Durchschnitt
- **Doppelte/eindeutige Werte**
- **Datenbalken** — Länge im Zellhintergrund; „Nur Balken anzeigen" blendet die Zahl aus
- **Farbskalen** — 2 oder 3 Farben, Heatmap-Effekt
- **Symbolsätze** — Ampeln, Pfeile, Bewertungen

Bei Datenbalken und Farbskalen lohnt es, Minimum und Maximum **fest zu setzen** statt automatisch — sonst ändert sich der Maßstab bei jeder Datenänderung und die Reihen sind zwischen Berichten nicht vergleichbar.

Symbolsätze arbeiten standardmäßig mit Perzentilen. Für Ampeln nach fachlichen Grenzwerten (z. B. Auslastung ≥ 80 % grün) muss man den Typ auf *Zahl* oder *Formel* umstellen.

## Die Formelregel — das eigentliche Werkzeug

„Formel zur Ermittlung der zu formatierenden Zellen verwenden" nimmt eine Formel, die `WAHR` oder `FALSCH` liefert. Entscheidend: Die Formel wird **relativ zur linken oberen Zelle des ausgewählten Bereichs** ausgewertet und dann auf alle übrigen übertragen — exakt wie beim Kopieren einer Formel.

**Ganze Zeile einfärben**, wenn Status „offen":
```
Bereich A2:F500,  Formel: =$E2="offen"
```
Spalte fixiert (`$E`), Zeile relativ — sonst wandert die Prüfung mit nach rechts.

**Jede zweite Zeile schattieren**, filterfest:
```
=REST(TEILERGEBNIS(103;$A$2:$A2);2)=0
```

**Wochenenden im Dienstplan**:
```
=WOCHENTAG(B$1;2)>5
```

**Fällige Termine**:
```
=UND($C2<>""; $C2<HEUTE(); $D2="")
```

**Abweichung vom Zeilenmaximum**:
```
=B2=MAX($B2:$M2)
```

**Suchtreffer live hervorheben** — Suchfeld in `$B$1`:
```
=UND($B$1<>""; ISTZAHL(SUCHEN($B$1;A2)))
```

## Regeln für die Praxis

- **Auf Tabellen anwenden**: Bei intelligenten Tabellen erweitert sich der Geltungsbereich automatisch auf neue Zeilen.
- **Kopieren erzeugt Regelmüll.** Nach vielen Kopier- und Einfügevorgängen zerfällt eine Regel in dutzende Teilbereiche. Regelmäßig im Manager konsolidieren — das ist auch ein spürbarer Performance-Faktor.
- **Performance**: Bedingte Formatierung wird bei jeder Neuberechnung und jedem Bildlauf ausgewertet. Volatile Funktionen (`HEUTE`, `INDIREKT`, `BEREICH.VERSCHIEBEN`) in Regeln über zehntausende Zellen bremsen die ganze Mappe. Stichtag lieber einmal in eine Zelle rechnen und darauf verweisen.
- **Bezug auf andere Blätter** ist seit Excel 2010 direkt möglich, in älteren Dateien nur über einen Namen.
- Regeln sind **nicht** über den Formelpinsel allein steuerbar — Format übertragen kopiert sie mit, was oft ungewollt ist.

::: quiz
F: Du willst die ganze Zeile einfärben, wenn Spalte E „offen" enthält. Wie lautet die Formel?
A: `=$E2="offen"` — Spalte absolut, Zeile relativ, angewendet auf den gesamten Zeilenbereich ab Zeile 2.

F: Warum verändert sich die Aussage eines Datenbalkens zwischen zwei Monatsberichten?
A: Minimum/Maximum stehen auf Automatisch und skalieren jeweils auf die aktuellen Daten. Für Vergleichbarkeit feste Grenzen setzen.
:::
