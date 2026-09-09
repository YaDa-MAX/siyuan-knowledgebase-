---
id: hotelabr-einstieg
title: Wie ein Hotel bucht — vom Zimmerpreis zur Zahlung
path: hotelabrechnung/grundlagen
level: 1
type: theorie
source: ki
status: geprueft
updated: 2026-09-09
tags: [pms, buchung, einstieg, konto, erloes]
prereqs: []
related: [hotelabr-transaktionscodes, hotelabr-ledger, bwl-hotelkennzahlen, bwl-einstieg]
summary: Die vier Ereignisse, aus denen jede Hotelbuchung besteht, der Unterschied zwischen Erlös und Zahlung — und warum die Kennzahlen nur so gut sind wie die Buchung darunter.
---

## Warum dieses Themengebiet vor den Kennzahlen kommt

Das Themengebiet *Betriebswirtschaft* rechnet mit ADR, RevPAR und GOPPAR. Es setzt dabei etwas voraus, das keineswegs selbstverständlich ist: **dass die Zahlen stimmen.**

Sie stimmen aber nur, wenn darunter jede Buchung auf dem richtigen Transaktionscode, im richtigen Ledger und am richtigen Tag steht. Eine falsch zugeordnete Frühstückspauschale verschiebt die ADR. Ein Zimmer mit Preis null ohne Grund senkt sie. Eine Negativbuchung ohne Gegenstück mindert Erlös, den es nie gab.

> **Jede Kennzahl ist eine Zusammenfassung von Buchungen. Wer die Buchungen nicht kontrolliert, wertet Zufall aus.**

## Die vier Ereignisse

Jeder Vorgang im Haus lässt sich auf vier Ereignisse zurückführen. Sie fallen zeitlich auseinander, und genau das ist der Grund für die meisten Verständnisprobleme.

| Ereignis | Was entsteht | Wo |
|---|---|---|
| **Reservierung** | eine Erwartung, noch keine Buchung | Reservierungssystem |
| **Anzahlung** | eine erhaltene Zahlung **ohne** Erlös | Deposit Ledger |
| **Leistung** | ein **Erlös** und eine Forderung | Guest Ledger (Zimmerkonto) |
| **Zahlung** | Ausgleich der Forderung | Kasse, Bank oder City Ledger |

**Der wichtigste Satz für alles Weitere:** *Erlös* und *Zahlung* sind zwei verschiedene Dinge, die zu verschiedenen Zeitpunkten entstehen. Ein Gast, der bar zahlt, erzeugt beides gleichzeitig — deshalb wird der Unterschied im Alltag oft nicht gesehen. Ein Firmengast, der auf Rechnung wohnt, erzeugt heute Erlös und in sechs Wochen Zahlung.

## Das Zimmerkonto

Zwischen Anreise und Abreise hat jeder Gast ein Konto. Es ist ein ganz gewöhnliches Kontokorrent:

```
Zimmerkonto
  +  Logis, Frühstück, Restaurant, Bar, Parken, Spa      Forderungen
  −  Bar, Karte, Gutschein, Übertrag auf Rechnung        Ausgleich
  =  Saldo
```

Beim Check-out muss der Saldo null werden. Er wird null durch eine **Zahlung** — oder durch einen **Übertrag** auf ein anderes Konto: an den Debitor (Firmenrechnung), an ein Sammelkonto (Gruppe, Bankett) oder an ein anderes Zimmerkonto (Gast übernimmt die Rechnung eines anderen).

**Ein Übertrag ist keine Zahlung.** Er verschiebt die Forderung nur woandershin. Genau daran scheitert die Übersicht in vielen Häusern: Der Umsatz sieht bezahlt aus, tatsächlich steht er im City Ledger und altert vor sich hin.

## Erlös, durchlaufender Posten, Zahlung

Drei Arten von Buchungen, die nie vermischt werden dürfen:

- **Erlös** — Logis, Speisen, Getränke, Tagung, Spa. Erhöht den Umsatz.
- **Durchlaufender Posten** — Umsatzsteuer, in vielen Gemeinden die Kur- oder Bettensteuer, weitergeleitete Fremdleistungen. Fließt durch das Haus, gehört ihm aber nicht.
- **Zahlung** — Bar, Karte, Überweisung, Gutschein. Verändert den Umsatz **nicht**.

Der klassische Fehler ist die dritte Zeile: Wer Zahlungsarten als Erlös auswertet, zählt doppelt. Wer die Kurtaxe im Logisumsatz belässt, meldet eine zu hohe ADR und führt trotzdem denselben Betrag ab.

## Der Tagesrhythmus

Ein Hotel schließt jeden Tag ab, nicht jeden Monat. Das hat einen einfachen Grund: Die Leistung *Übernachtung* entsteht jede Nacht neu, und die Auslastung des Vortags ist am nächsten Morgen eine Steuerungsgröße.

```
Tagsüber      buchen: Anreisen, Abreisen, Verzehr, Zahlungen
Abends        Kassenabschluss je Kassierer
Nachts        Nachtlauf: Zimmerpreis buchen, Datum wechseln, Statistik
Morgens       kontrollieren: Handbuchungen, Negativbuchungen, Abstimmung
```

Der letzte Schritt ist der, der am häufigsten ausfällt — und der einzige, der Fehler findet, solange sie noch korrigierbar sind. Nach dem Monatsabschluss ist jede Korrektur eine Umbuchung mit Begründung.

## Die drei Fragen, die jede Kontrolle beantwortet

1. **Ist alles gebucht, was geleistet wurde?** — Vollständigkeit. Das nicht berechnete Frühstück fehlt für immer.
2. **Ist alles richtig zugeordnet?** — Code, Ledger, Datum. Falsch zugeordnet heißt: Der Betrag ist da, aber die Auswertung ist falsch.
3. **Ist jede Minderung erklärt?** — Stornos, Rabatte, Kulanz, Korrekturen. Eine Erlösminderung ohne Grund ist der einzige Vorgang, der aus dem System heraus nicht rekonstruierbar ist.

Frage 3 ist der Kern der täglichen Prüfung. Die ersten beiden fallen meist von selbst auf; die dritte nur, wenn jemand hinsieht.

::: viz dataset:pms-pruefkatalog
Der vollständige Prüfkatalog, nach Bereich und Stufe filterbar. Er wird in den folgenden Knoten Punkt für Punkt erklärt.
:::

## Was in diesem Themengebiet steht

- **Grundlagen** — dieser Knoten, Transaktionscodes, Ledger
- **Ablauf** — Nachtlauf und Tagesabschluss
- **Kontrolle** — Handbuchungen und Negativbuchungen, Abstimmung Manager Flash gegen Transaktionscodes
- **Forderungen** — Storno und Anzahlungen, Debitoren und ihre Altersstruktur
- **Ordnung** — Kassenrecht und GoBD, Schnittstellen, Monatsabschluss

::: quiz
F: Warum sind Erlös und Zahlung zwei verschiedene Dinge, und wann fällt der Unterschied nicht auf?
A: Der Erlös entsteht mit der Leistung, die Zahlung mit dem Geldfluss. Bei Barzahlung fallen beide zusammen — deshalb wird der Unterschied im Alltag oft übersehen. Bei einer Firmenrechnung liegen Wochen dazwischen.

F: Ein Zimmerkonto wird beim Check-out durch Übertrag auf den Debitor ausgeglichen. Ist damit bezahlt?
A: Nein. Der Übertrag verschiebt die Forderung nur ins City Ledger. Der Umsatz sieht ausgeglichen aus, das Geld ist aber nicht da — genau so entstehen alte Posten.

F: Warum darf die Kurtaxe nicht im Logisumsatz stehen?
A: Sie ist ein durchlaufender Posten und gehört dem Haus nicht. Im Logisumsatz erhöht sie die ADR künstlich, während derselbe Betrag abgeführt wird.

F: Welche der drei Kontrollfragen fällt ohne aktive Prüfung nicht auf?
A: Die dritte — ist jede Erlösminderung erklärt? Fehlende oder falsch zugeordnete Buchungen fallen meist von selbst auf; eine Minderung ohne Grund ist aus dem System heraus nicht rekonstruierbar.
:::
