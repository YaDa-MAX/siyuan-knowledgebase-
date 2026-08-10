---
id: excel-datenvalidierung
title: Datenvalidierung und Blattschutz
path: excel/qualitaet
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [datenvalidierung, schutz, eingabe, formulare]
prereqs: [excel-zellbezuege]
related: [excel-bedingte-formatierung, excel-modellbau]
summary: Falsche Eingaben verhindern, statt sie später zu suchen — und ehrlich benennen, was Blattschutz kann und was nicht.
---

## Datenvalidierung

*Daten ▸ Datenüberprüfung.* Beschränkt, was in eine Zelle eingegeben werden darf.

Zulassungstypen: Ganze Zahl, Dezimal, Liste, Datum, Zeit, Textlänge, **Benutzerdefiniert** (Formel).

Drei Register:
- **Einstellungen** — die Regel
- **Eingabemeldung** — Hinweis beim Anklicken (die beste Stelle für „Format: JJJJ-MM-TT")
- **Fehlermeldung** — Stopp (blockiert), Warnung (erlaubt Bestätigung), Information (nur Hinweis)

### Nützliche benutzerdefinierte Regeln

```
Keine Dubletten          =ZÄHLENWENN($A$2:$A$1000;A2)=1
Nur Großbuchstaben       =IDENTISCH(A2;GROSS(A2))
Nur Werktage             =WOCHENTAG(A2;2)<6
Nicht in der Vergangenheit =A2>=HEUTE()
Nur wenn B gefüllt       =$B2<>""
Muss mit "RE-" beginnen  =LINKS(A2;3)="RE-"
E-Mail grob prüfen       =UND(ISTFEHLER(FINDEN(" ";A2));ISTZAHL(FINDEN("@";A2)))
Summe bleibt unter Budget =SUMME($C$2:$C$100)<=Budget
```

### Auswahllisten

- Statisch: Werte mit Semikolon getrennt direkt eintippen.
- Aus einem Bereich: `=Stammdaten!$A$2:$A$50`.
- **Mitwachsend**: auf eine intelligente Tabellenspalte über einen benannten Bereich, oder direkt auf einen Überlaufbereich: `=$H$2#`.
- **Abhängige Listen**: `=INDIREKT($B2)` mit benannten Bereichen je Kategorie — funktioniert, ist aber volatil und verträgt keine Leerzeichen in Kategorienamen. Moderner: `=FILTER(...)` in eine Hilfsspalte und darauf mit `#` verweisen.

**Wichtig:** Datenvalidierung prüft nur die **Eingabe**. Eingefügte Werte (`Strg`+`V`) umgehen sie vollständig, und bestehende falsche Werte bleiben unbeanstandet. *Ungültige Daten einkreisen* (Datenüberprüfung ▸ Dropdown) markiert Altbestände nachträglich.

## Blattschutz

Zwei Schritte, die in dieser Reihenfolge zusammengehören:

1. **Zellsperrung** setzen: Standardmäßig sind *alle* Zellen gesperrt. Vor dem Schutz die Eingabezellen markieren und die Sperrung **entfernen** (`Strg`+`1` ▸ Schutz ▸ Haken bei „Gesperrt" weg).
2. **Blatt schützen** (Überprüfen ▸ Blatt schützen). Erst jetzt greift die Sperrung.

Im Schutzdialog lassen sich Einzelrechte freigeben: Sortieren, AutoFilter verwenden, PivotTable-Bericht verwenden, Zeilen formatieren. Ohne diese Haken sind gesperrte Blätter für Nutzer oft unbrauchbar — Filtern muss meist erlaubt bleiben.

`Formeln ausblenden` (im selben Dialog des Zellformats) verbirgt Formeln in der Bearbeitungsleiste, sobald das Blatt geschützt ist.

**Arbeitsmappe schützen** (Struktur) verhindert Einfügen, Löschen, Umbenennen und Einblenden von Blättern.

## Was Schutz nicht leistet

Klare Einordnung, damit niemand sich täuscht:

- **Blatt- und Mappenschutz sind Bedienschutz, kein Sicherheitsmechanismus.** Die Passwörter lassen sich mit frei verfügbaren Werkzeugen in Sekunden entfernen. Sie schützen vor Versehen, nicht vor Absicht.
- **Ausgeblendete Blätter** sind mit zwei Klicks sichtbar; „sehr ausgeblendet" (`xlSheetVeryHidden` per VBA) mit fünf.
- **Echter Schutz** ist ausschließlich die **Dateiverschlüsselung** (Datei ▸ Informationen ▸ Arbeitsmappe schützen ▸ Mit Kennwort verschlüsseln). Sie nutzt AES und ist bei ausreichend langer Passphrase belastbar. Vertrauliche Inhalte gehören dorthin — oder gar nicht in eine Excel-Datei, die per Mail wandert.
- Für Zugangsdaten und Wiederherstellungscodes ist ein Tabellenblatt grundsätzlich der falsche Ort. Dafür ist der Tresor dieses Archivs gedacht.

::: quiz
F: Warum reicht „Blatt schützen" allein nicht, um Eingabezellen freizugeben?
A: Alle Zellen sind per Voreinstellung gesperrt. Man muss zuerst die Sperrung der Eingabezellen aufheben und danach schützen.

F: Eine Datenvalidierung „nur Werte aus Liste" wird trotzdem umgangen. Wie?
A: Durch Einfügen aus der Zwischenablage — die Validierung prüft nur Direkteingaben.
:::
