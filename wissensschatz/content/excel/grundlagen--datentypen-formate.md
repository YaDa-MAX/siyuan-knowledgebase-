---
id: excel-datentypen
title: Datentypen und Zahlenformate
path: excel/grundlagen
level: 1
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [datentypen, formatierung, datum, zahlen]
prereqs: []
related: [excel-datum-zeit, excel-text-funktionen]
summary: Excel kennt nur vier Werttypen. Alles andere ist Anzeige. Diese Trennung erklärt fast alle Import- und Rechenprobleme.
---

## Kern

Intern gibt es genau vier Werttypen: **Zahl**, **Text**, **Wahrheitswert** und **Fehlerwert**. Datum, Uhrzeit, Währung und Prozent sind keine eigenen Typen — sie sind Zahlen mit einem Anzeigeformat. Wer das trennt, versteht sofort, warum `01.05.2026` mal rechenbar ist und mal nicht.

- **Zahl**: 64-Bit-Gleitkomma (IEEE 754), rund 15 signifikante Stellen. Rechtsbündig per Standard.
- **Text**: bis 32.767 Zeichen je Zelle. Linksbündig per Standard — die Ausrichtung ist der schnellste Typcheck ohne Formel.
- **Wahrheitswert**: `WAHR`/`FALSCH`, in Berechnungen 1 und 0.
- **Fehlerwert**: `#DIV/0!`, `#NV`, `#WERT!`, `#BEZUG!`, `#NAME?`, `#ZAHL!`, `#NULL!`, `#ÜBERLAUF!`, `#KALK!`.

## Details

**Datum ist eine Zahl.** Der 1.1.1900 ist die Seriennummer 1, jeder Tag zählt eins weiter. Uhrzeit ist der Nachkommateil: 0,5 = 12:00 Uhr. Daraus folgt: `=B1-A1` liefert Tage zwischen zwei Daten, `=A1+30` ist „in 30 Tagen", und eine Uhrzeit über 24 Stunden braucht das Format `[hh]:mm`, sonst wird bei Mitternacht zurückgesetzt.

Der berüchtigte Schaltjahrfehler von 1900 ist Absicht: Excel behandelt 1900 fälschlich als Schaltjahr, um zu Lotus 1-2-3 kompatibel zu bleiben. Für Daten ab dem 1.3.1900 spielt es keine Rolle. Am Mac gilt optional die 1904-Datumswerte-Einstellung — mischt man Mappen beider Systeme, verschieben sich Daten um vier Jahre und einen Tag.

**Zahlenformate** sind vierteilig, getrennt durch Semikolon:

```
positiv;negativ;null;text
#.##0,00 €;[Rot]-#.##0,00 €;"–";@
```

Nützliche Bausteine: `0` erzwingt eine Ziffer, `#` unterdrückt führende Nullen, `?` reserviert Platz zum Ausrichten, `.` als Tausendertrenner am Ende teilt durch 1000 (`#.##0.` zeigt Tausender), `@` steht für den Textinhalt, `*` füllt mit dem Folgezeichen auf, `_` reserviert die Breite eines Zeichens.

**Der klassische Importfehler**: Zahlen kommen als Text an, meist wegen Dezimalpunkt statt Komma, wegen geschützter Leerzeichen als Tausendertrenner (`U+00A0`) oder wegen nachgestellter Minuszeichen (`1234-`). Diagnose mit `=ISTTEXT(A1)` oder `=ANZAHL(A:A)` gegen `=ANZAHL2(A:A)`. Sanierung über Power Query mit explizitem Gebietsschema ist dauerhaft, `WERT()` oder Text-in-Spalten sind der schnelle Weg.

**Genauigkeit**: `=0,1+0,2-0,3` ergibt nicht exakt null, sondern rund 5,5E-17 — Binärdarstellung, kein Excel-Fehler. Beim Vergleichen deshalb runden statt auf Gleichheit prüfen: `=RUNDEN(A1-B1;10)=0`. Über 15 Stellen wird abgeschnitten, weshalb IBAN, Artikel- und Sozialversicherungsnummern **immer** Text sein müssen.

## Praxis

Für Importlisten: Spalten vor dem Einfügen als Text formatieren, wenn führende Nullen erhalten bleiben sollen (Postleitzahlen, Kostenstellen). Nachträgliches Umformatieren stellt verlorene Nullen nicht wieder her.

::: quiz
F: Warum wird aus der Artikelnummer 0041500000000123 in Excel plötzlich 4,15E+13?
A: Zahlen haben nur 15 signifikante Stellen und verlieren führende Nullen. Solche Kennungen gehören als Text importiert.

F: Eine Zeiterfassung summiert 8:00 + 8:00 + 8:00 und zeigt 0:00. Warum?
A: Standard-Zeitformat rollt bei 24 Stunden über. Nötig ist das Format `[hh]:mm`.
:::
