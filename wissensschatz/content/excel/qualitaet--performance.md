---
id: excel-performance
title: Performance — warum Mappen langsam werden
path: excel/qualitaet
level: 4
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [performance, berechnungskette, volatil, optimierung]
prereqs: [excel-formelsprache, excel-nachschlagen]
related: [excel-modellbau, excel-datenmodell, excel-vba]
summary: Die Berechnungskette, volatile Funktionen und der Unterschied zwischen langsamer Formel und langsamer Mappe.
---

## Wie Excel rechnet

Excel führt eine **Abhängigkeitskette**: Jede Formel kennt ihre Vorgänger. Bei einer Änderung wird nur der betroffene Teilbaum als „schmutzig" markiert und neu berechnet. Deshalb ist eine Mappe mit 500.000 Formeln nicht zwangsläufig langsam — solange die Ketten kurz und die Abhängigkeiten lokal sind.

Langsam wird es, wenn die Kette gesprengt wird. Drei Hauptursachen:

## 1. Volatile Funktionen

Volatile Funktionen werden bei **jeder** Neuberechnung ausgeführt, unabhängig davon, ob sich ihre Eingaben geändert haben — und sie markieren alles, was von ihnen abhängt, ebenfalls als schmutzig.

`JETZT`, `HEUTE`, `ZUFALLSZAHL`, `ZUFALLSBEREICH`, `BEREICH.VERSCHIEBEN`, `INDIREKT`, `ZELLE`, `INFO`, teilweise `TEILERGEBNIS` und `SUMMEWENN` mit bestimmten Argumenten.

Eine einzige `INDIREKT`-Formel, von der 50.000 Zellen abhängen, macht jede Tastatureingabe zäh. Ersatz:
- `BEREICH.VERSCHIEBEN` → `INDEX` (`=A2:INDEX(A:A;ANZAHL2(A:A))`)
- `INDIREKT` für Blattnamen → `XVERWEIS` über eine Zuordnungstabelle oder Power Query
- `HEUTE()` in tausenden Zellen → einmal in eine Zelle, überall darauf verweisen

## 2. Ganze Spalten und überdimensionierte Bereiche

`=SUMMEWENN(A:A;"x";B:B)` zwingt Excel im ungünstigsten Fall über 1.048.576 Zeilen. Bei 200 solchen Formeln ist die Mappe erledigt. Immer auf intelligente Tabellen oder begrenzte Bereiche verweisen.

Verwandt: der aufgeblähte **benutzte Bereich**. `Strg`+`Ende` springt in Zelle `XFD1048576`, obwohl nur 300 Zeilen belegt sind — meist durch Formatierungen ganzer Spalten. Sanierung: überflüssige Zeilen/Spalten **löschen** (nicht nur Inhalte), speichern, neu öffnen.

## 3. Teure Formelmuster

| Langsam | Schneller |
|---|---|
| lineare exakte Suche über 500.000 Zeilen | Binärsuche auf sortierten Daten (`XVERWEIS` Modus 2) |
| `SUMMENPRODUKT` über ganze Spalten | `SUMMEWENNS` (nutzt interne Optimierungen) |
| verschachtelte `WENN`-Ketten mit wiederholten Suchen | `LET` mit einmaliger Berechnung |
| viele einzelne Matrixformeln | ein dynamisches Array |
| `SVERWEIS` auf breite Matrix | `INDEX`/`VERGLEICH` auf zwei Spalten |
| bedingte Formatierung mit Volatilen über 100.000 Zellen | Stichtag in Zelle auslagern, Regelbereiche konsolidieren |

## Weitere Bremsen

- **Regelmüll in der bedingten Formatierung**: hunderte fragmentierte Regelbereiche durch Kopiervorgänge.
- **Zu viele unterschiedliche Zellformate**: Excel verwaltet maximal 64.000 Formatkombinationen; kurz davor wird alles zäh.
- **Formen und Objekte**: hunderte kopierte Steuerelemente oder Bilder (oft unbemerkt durch Autofilter-Kopien) blähen die Datei auf. Prüfen über *Start ▸ Suchen ▸ Inhalte auswählen ▸ Objekte*.
- **Externe Verknüpfungen** auf geschlossene Dateien: jeder Zugriff öffnet die Quelle im Hintergrund.
- **Defined Names mit Fehlern** (`#BEZUG!`), die bei jedem Öffnen ausgewertet werden.
- **Dateiformat**: `.xlsb` (binär) lädt und speichert bei großen Modellen deutlich schneller als `.xlsx`.

## Vorgehen bei einer trägen Mappe

1. **Messen statt raten**: Berechnung auf Manuell (`Formeln ▸ Berechnungsoptionen`), dann `F9` mit Stoppuhr. `Umschalt`+`F9` rechnet nur das aktive Blatt — so grenzt man ein.
2. `Strg`+`Ende` prüfen → benutzten Bereich sanieren.
3. Nach volatilen Funktionen suchen (`Strg`+`F` in Formeln nach `INDIREKT`, `BEREICH.VERSCHIEBEN`, `HEUTE`).
4. Ganze-Spalten-Bezüge suchen (`:A` bzw. `A:A`).
5. Formelanzahl je Blatt bestimmen (`Inhalte auswählen ▸ Formeln`, Statusleiste zeigt die Anzahl).
6. Formate und Objekte aufräumen, in `.xlsb` speichern.
7. Wenn es dann noch klemmt: Die Aufgabe ist keine Formelaufgabe mehr — **Power Query** für die Aufbereitung, **Datenmodell** für die Aggregation.

## Die Schwelle

Ab ungefähr 100.000 Zeilen Rohdaten mit mehreren verknüpften Tabellen ist die Formelebene das falsche Werkzeug. Das Datenmodell komprimiert spaltenweise, rechnet mit mehreren Kernen und braucht keine einzige Nachschlageformel. Der Umstieg spart mehr Zeit als jede Formeloptimierung.

::: quiz
F: Was macht eine Funktion „volatil" und warum ist das teuer?
A: Sie wird bei jeder Neuberechnung ausgeführt, auch ohne Änderung ihrer Eingaben, und markiert alle abhängigen Zellen als neu zu berechnen — die Kette wird bei jedem Tastendruck durchlaufen.

F: Womit ersetzt du `BEREICH.VERSCHIEBEN` für einen mitwachsenden Bereich?
A: Mit `INDEX`: `=A2:INDEX(A:A;ANZAHL2(A:A))` — nicht volatil. Oder gleich mit einer intelligenten Tabelle.
:::
