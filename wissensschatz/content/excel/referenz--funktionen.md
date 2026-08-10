---
id: excel-funktionsreferenz
title: Funktionsreferenz — alle Kategorien im Überblick
path: excel/referenz
level: 2
type: referenz
source: ki
status: geprueft
updated: 2026-08-09
tags: [referenz, funktionen, nachschlagen]
prereqs: []
related: [excel-formelsprache, excel-nachschlagen, excel-dynamische-arrays]
summary: Durchsuchbare Liste der Excel-Funktionen mit deutschem und englischem Namen, Syntax, Wirkung und Einstiegsstufe.
---

## Nutzung

::: viz dataset:excel-funktionen
Filtern nach Kategorie und Stufe, suchen nach deutschem oder englischem Namen.
:::

## Die Kategorien und wofür sie stehen

| Kategorie | Was hier zu finden ist |
|---|---|
| **Mathematik & Trigonometrie** | Grundrechenarten, Runden, Matrizen, Winkelfunktionen |
| **Statistik** | Lage- und Streuungsmaße, Verteilungen, Tests, Regression, Prognose |
| **Logik** | Verzweigungen, Wahrheitswerte, Fehlerbehandlung, LET/LAMBDA |
| **Nachschlagen & Verweisen** | Suchen, Positionieren, Bezüge erzeugen |
| **Dynamische Arrays** | Filtern, Sortieren, Umformen, LAMBDA-Helfer (ab M365/2021) |
| **Text** | Zerlegen, Zusammensetzen, Säubern, Formatieren |
| **Datum & Zeit** | Kalenderrechnen, Arbeitstage, Zinsusancen |
| **Information** | Typprüfungen, Zell- und Umgebungsinformationen |
| **Finanzmathematik** | Barwert, Annuität, Rendite, Abschreibung, Wertpapiere |
| **Datenbank** | Aggregation über einen Kriterienbereich |
| **Technisch** | Einheiten, Zahlensysteme, Bitoperationen, komplexe Zahlen |
| **Web** | HTTP-Abruf und XPath (nur Windows-Desktop) |
| **Cube** | Direktzugriff auf das Datenmodell bzw. OLAP-Würfel |

## Sprachfrage

Excel speichert Funktionen intern **immer englisch** und übersetzt nur die Anzeige. Deshalb:

- Eine Formel, die in einer deutschen Installation geschrieben wurde, funktioniert in jeder anderen Sprachversion — angezeigt wird sie dort in Landessprache.
- **Text in Formeln wird nicht übersetzt.** Formatcodes (`TEXT(A1;"JJJJ-MM")`) und Kriterien brechen bei Sprachwechsel.
- **VBA und Power Query nutzen ausschließlich englische Namen**: `Application.WorksheetFunction.VLookup`, `Excel.CurrentWorkbook`.
- Beim Suchen im Internet ist der englische Name der bessere Suchbegriff — deshalb steht er hier in jeder Zeile.
- Formeln aus dem Netz mit Komma statt Semikolon als Argumenttrennzeichen: Das Trennzeichen hängt an den Regions­einstellungen. Beim Einfügen in eine deutsche Installation Komma durch Semikolon ersetzen.

## Was hier bewusst nicht steht

Die veralteten Doppelgänger, die Microsoft aus Kompatibilitätsgründen weiterführt: `NORMVERT` (ersetzt durch `NORM.VERT`), `STABW` (→ `STABW.S`), `MODALWERT` (→ `MODUS.EINF`), `QUARTILE` (→ `QUARTILE.INKL`), `RANG` (→ `RANG.GLEICH`) und die übrigen Funktionen der Kategorie „Kompatibilität". Sie funktionieren weiterhin, sollten in neuen Modellen aber nicht mehr verwendet werden.

> TODO: Kategorie „Kompatibilität" als eigene Gegenüberstellung alt/neu ergänzen

::: quiz
F: Warum funktioniert eine deutsche Formel auch in einer englischen Excel-Installation, ein `TEXT(A1;"TT.MM.JJJJ")` aber nicht?
A: Funktionsnamen werden intern englisch gespeichert und lokalisiert angezeigt. Zeichenkettenargumente wie Formatcodes sind einfacher Text und werden nicht mitübersetzt.

F: Welche Funktionsnamen brauchst du, wenn du in VBA oder Power Query arbeitest?
A: Die englischen — beide Sprachen kennen keine Lokalisierung.
:::
