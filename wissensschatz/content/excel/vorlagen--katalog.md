---
id: excel-vorlagen
title: Vorlagen und Skripte — einsatzfertig
path: excel/vorlagen
level: 3
type: referenz
source: ki
status: geprueft
updated: 2026-08-09
tags: [vorlagen, vba, skripte, powerquery, office-scripts, sql]
prereqs: [excel-tabellen]
related: [excel-vba, excel-sql, excel-office-scripts, excel-powerquery, excel-modellbau]
summary: Der Werkzeugkasten des Archivs — VBA-Module, SQL-Referenzen, Office Scripts, M-Abfragen und Tabellenvorlagen, alle kommentiert und einzeln nutzbar.
---

## Wo die Dateien liegen

```
wissensschatz/vorlagen/
  vba/             modWerkzeuge.bas · modAblaeufe.bas · modSqlAdo.bas
  sql/             01-grundabfragen.sql · 02-excel-als-datenquelle.sql
  office-scripts/  monatsbericht.ts
  powerquery/      ordner-sammeln.pq · kalender.pq
  tabellen/        zeiterfassung-vorlage.csv · modell-kontrollblock.csv
```

::: viz dataset:vorlagen-katalog
Alle Vorlagen mit Zweck, Einbauweg und Einstiegsstufe.
:::

## VBA-Module einbauen

1. `Alt` + `F11` öffnet den VBA-Editor.
2. **Datei ▸ Datei importieren** und die `.bas`-Datei wählen.
3. Mappe als `.xlsm` oder `.xlsb` speichern — in `.xlsx` geht der Code beim Speichern verloren.
4. `Extras ▸ Optionen ▸ Variablendeklaration erforderlich` anhaken, damit `Option Explicit` in neuen Modulen automatisch steht.

`modWerkzeuge` ist die Basis und wird von den anderen beiden vorausgesetzt. Es enthält nichts Projektspezifisches und kann in jede Mappe wandern.

**Zum Ausführen**: `Alt` + `F8` zeigt die Makroliste. Für den täglichen Gebrauch eine Schaltfläche auf der Schnellzugriffsleiste anlegen (Datei ▸ Optionen ▸ Symbolleiste für den Schnellzugriff ▸ Makros).

**Sicherheit**: Aus dem Internet geladene Dateien werden seit 2022 blockiert (Mark of the Web). Die richtige Lösung ist ein **vertrauenswürdiger Speicherort** (Datei ▸ Optionen ▸ Trust Center ▸ Einstellungen ▸ Vertrauenswürdige Speicherorte) oder eine digitale Signatur — nicht das Absenken der Makrosicherheit.

## Was die Module können

**`modWerkzeuge`** — die Bausteine, die man in jedem Projekt neu schreiben würde:

| Prozedur | Wozu |
|---|---|
| `TurboAn` / `TurboAus` | Bildschirm, Ereignisse und Berechnung anhalten und **sicher** zurücksetzen |
| `LetzteZeile` / `LetzteSpalte` | belastbar über `End(xlUp)` statt über `UsedRange` |
| `BlattHolen` | Blatt zurückgeben oder anlegen |
| `BereichAlsArray` / `ArrayNachBereich` | der Performance-Hebel: zwei Übergänge statt zwei je Zelle |
| `Protokoll` | Zeitstempel, Stufe und Meldung in ein verstecktes Blatt |
| `SauberText` / `Slug` | geschützte Leerzeichen, Umbrüche, dateinamenfreundliche Umschrift |
| `ArbeitsStunden` | Nachtschicht über Mitternacht korrekt in Stunden |
| `MindestPauseMinuten` | 30 bzw. 45 Minuten nach § 4 ArbZG |
| `Ostersonntag` / `IstFeiertagBundesweit` | Gauß-Formel und die bundesweiten Feiertage |

**`modAblaeufe`** — sieben fertige Abläufe:

1. **Gerüst mit Fehlerbehandlung** — die Vorlage, aus der jede eigene Prozedur entsteht.
2. **Dateien aus Ordner sammeln** — ersetzt das monatliche Zusammenkopieren.
3. **Blätter als PDF exportieren** — je Blatt eine Datei mit ISO-Datum im Namen.
4. **Nach Spalte aufteilen** — eine Liste in Blätter je Haus, Abteilung oder Kostenstelle.
5. **Serienmail über Outlook** — mit persönlicher Anlage; ohne `.Send` erscheint erst der Entwurf.
6. **Arbeitszeitprüfung** — markiert Verstöße gegen Höchstarbeitszeit, Mindestpause und Ruhezeit. Die Konstante `RUHEZEIT_STUNDEN` steht auf 11 und wird für das Gastgewerbe auf 10 gesetzt (mit dokumentiertem Ausgleich, § 5 Abs. 2 ArbZG).
7. **Mappe aufräumen** — benutzten Bereich zurücksetzen und defekte Namen entfernen; danach speichern, schließen, neu öffnen.

**`modSqlAdo`** — SQL ohne Zusatzsoftware. Späte Bindung, deshalb kein Verweis nötig. Enthält `AbfrageMitParameter` — der einzige Weg, bei dem Nutzereingaben sicher in eine Abfrage gelangen.

## Tabellenvorlagen

Die beiden CSV-Dateien sind bewusst formatfrei: Sie öffnen in jeder Excel-Version und in jedem Tabellenprogramm, auch in zwanzig Jahren.

**`zeiterfassung-vorlage.csv`** bringt die Formeln für Nachtschicht (`=REST(Ende-Beginn;1)*24`), gesetzliche Mindestpause und einen Prüfhinweis mit. Nach dem Öffnen den Bereich mit `Strg`+`T` in eine intelligente Tabelle wandeln, dann wachsen die Formeln mit.

**`modell-kontrollblock.csv`** ist der Prüfblock aus der Modellarchitektur in ausformulierter Form: elf Prüfungen, die alle `WAHR` ergeben müssen, plus eine Gesamtampel fürs Dashboard.

## Hinweise zur Weitergabe

- **VBA läuft nicht** in Excel im Browser, nicht auf Mobilgeräten und nicht in der Cloud. Wo das gebraucht wird: Office Scripts.
- **Power Query und Office Scripts** sind versionsabhängig — vor dem Verteilen prüfen, welche Excel-Version die Empfänger haben.
- **Pfade** gehören in Parameter, nicht in den Code. Alle Vorlagen hier arbeiten mit `ThisWorkbook.Path` oder einem Parameter.
- **Zugangsdaten** stehen in keiner dieser Dateien und gehören auch in keine. Für Datenbankverbindungen Windows-Authentifizierung oder ein Dienstkonto verwenden; Passwörter in den Tresor dieses Archivs.

::: quiz
F: Warum ist `BereichAlsArray` schneller als eine Schleife über Zellen?
A: Jeder einzelne Zellzugriff überquert die Grenze zwischen VBA und Excel. Das Array braucht zwei Übergänge insgesamt statt zwei je Zelle.

F: Was ist der richtige Weg, damit Makros aus einer heruntergeladenen Datei laufen?
A: Ein vertrauenswürdiger Speicherort oder eine digitale Signatur — nicht das Absenken der Makrosicherheit.

F: Welche Konstante muss im Arbeitszeit-Prüfmakro für das Gastgewerbe angepasst werden?
A: `RUHEZEIT_STUNDEN` von 11 auf 10 — zulässig nach § 5 Abs. 2 ArbZG, aber nur mit dokumentiertem Ausgleich auf 12 Stunden.
:::
