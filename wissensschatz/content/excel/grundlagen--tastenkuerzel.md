---
id: excel-tastenkuerzel
title: Tastenkürzel — die 60, die zählen
path: excel/grundlagen
level: 1
type: referenz
source: ki
status: geprueft
updated: 2026-08-09
tags: [tastenkuerzel, tempo, bedienung]
prereqs: []
related: [excel-zellbezuege]
summary: Nach Aufgabe sortiert statt alphabetisch. Wer die ersten zwanzig sitzen hat, arbeitet spürbar anders.
---

## Bewegen und markieren

| Kürzel | Wirkung |
|---|---|
| `Strg` + Pfeil | ans Ende des Datenblocks springen |
| `Strg` + `Umschalt` + Pfeil | bis dorthin markieren |
| `Strg` + `Pos1` / `Strg` + `Ende` | A1 / letzte benutzte Zelle |
| `Strg` + `Leertaste` / `Umschalt` + `Leertaste` | Spalte / Zeile markieren |
| `Strg` + `A` | aktuellen Bereich, dann alles |
| `Strg` + `Bild↓` / `Bild↑` | Blatt wechseln |
| `Alt` + `Bild↓` | einen Bildschirm nach rechts |
| `F5` ▸ Inhalte | gezielt Formeln, Konstanten, Leerzellen markieren |
| `Strg` + `[` / `]` | zu Vorgängern / Nachfolgern springen |

## Eingeben und bearbeiten

| Kürzel | Wirkung |
|---|---|
| `F2` | Zelle bearbeiten |
| `Alt` + `Enter` | Zeilenumbruch in der Zelle |
| `Strg` + `Enter` | Eingabe in **alle** markierten Zellen |
| `Strg` + `D` / `Strg` + `R` | von oben / von links ausfüllen |
| `Strg` + `;` | heutiges Datum (fest) |
| `Strg` + `Umschalt` + `;` | aktuelle Uhrzeit (fest) |
| `Strg` + `E` | Blitzvorschau |
| `Alt` + `↓` | Auswahlliste öffnen / Werte der Spalte anzeigen |
| `Strg` + `+` / `Strg` + `-` | Zeilen/Spalten einfügen / löschen |
| `Alt` + `H`, `O`, `I` | Spaltenbreite optimal anpassen |

## Formeln

| Kürzel | Wirkung |
|---|---|
| `F4` | Bezugsart wechseln ($) — außerhalb der Formel: letzte Aktion wiederholen |
| `F9` | alles neu berechnen; im Bearbeitungsmodus: markierten Teil auswerten |
| `Umschalt` + `F9` | nur aktives Blatt berechnen |
| `Strg` + `Alt` + `F9` | alles vollständig neu berechnen |
| `Alt` + `=` | AutoSumme |
| `F3` | benannten Bereich einfügen |
| `Strg` + `F3` | Namensmanager |
| `Strg` + `#` | Formelanzeige umschalten |
| `Strg` + `Umschalt` + `Enter` | klassische Matrixformel (heute selten nötig) |

## Formatieren

| Kürzel | Wirkung |
|---|---|
| `Strg` + `1` | Zellen formatieren |
| `Strg` + `Umschalt` + `1` | Zahlenformat mit Tausendertrenner |
| `Strg` + `Umschalt` + `3` / `4` / `5` | Datum / Währung / Prozent |
| `Strg` + `Umschalt` + `6` | Rahmen außen |
| `Strg` + `B` / `I` / `U` | fett / kursiv / unterstrichen |
| `Strg` + `Umschalt` + `V` | Inhalte einfügen (Dialog) |
| `Alt` + `H`, `V`, `V` | nur Werte einfügen |

## Tabellen, Filter, Auswertung

| Kürzel | Wirkung |
|---|---|
| `Strg` + `T` | Bereich in intelligente Tabelle |
| `Strg` + `Umschalt` + `L` | AutoFilter ein/aus |
| `Alt` + `↓` im Filterkopf | Filtermenü öffnen |
| `Alt` + `;` | nur sichtbare Zellen markieren |
| `Strg` + `Umschalt` + `T` | Ergebniszeile ein/aus |
| `Alt` + `F1` | Diagramm aus Auswahl (im Blatt) |
| `F11` | Diagramm auf eigenem Blatt |
| `Strg` + `Q` | Schnellanalyse |

## Datei und Fenster

| Kürzel | Wirkung |
|---|---|
| `Strg` + `S` / `F12` | Speichern / Speichern unter |
| `Strg` + `P` | Drucken (mit Vorschau) |
| `Strg` + `W` / `Strg` + `F4` | Mappe schließen |
| `Alt` + `F11` | VBA-Editor |
| `Alt` + `F8` | Makroliste |
| `Strg` + `F1` | Menüband ein-/ausblenden |
| `Strg` + `Umschalt` + `F` | Suchen in Formeln (über Optionen) |

## Der Trick mit Alt

`Alt` allein blendet **Zugriffstasten** über dem gesamten Menüband ein. Damit ist jeder Befehl ohne Maus erreichbar, auch die, für die es kein Kürzel gibt — und die Tastenfolge bleibt über Versionen hinweg meist stabil. `Alt`, `A`, `A` aktualisiert alles; `Alt`, `N`, `V`, `T` erzeugt eine PivotTable.

::: quiz
F: Welches Kürzel schreibt eine Eingabe in alle markierten Zellen gleichzeitig?
A: `Strg` + `Enter`.

F: Wie markierst du nur die sichtbaren Zellen eines gefilterten Bereichs, um sie zu kopieren?
A: `Alt` + `;` (Inhalte auswählen ▸ Nur sichtbare Zellen).
:::
