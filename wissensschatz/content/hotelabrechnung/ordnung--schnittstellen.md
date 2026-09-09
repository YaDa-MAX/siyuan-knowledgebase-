---
id: hotelabr-schnittstellen
title: Schnittstellen und ihre Abstimmung
path: hotelabrechnung/ordnung
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-09-09
tags: [schnittstelle, interface, uebergabe, fehlerprotokoll, systeme]
prereqs: [hotelabr-abstimmung]
related: [hotelabr-kassenrecht, hotelabr-monatsabschluss, prozessauto-werkzeugwahl, powerbi-powerquery]
summary: Warum stille Schnittstellenfehler teurer sind als laute, welche Übergaben ein Hotel tatsächlich hat — und die Abstimmung, die den Monatsabschluss entlastet.
---

## Die Kette

Ein Hotel ist selten ein System, sondern meistens sechs bis zehn, die miteinander sprechen:

```
Kanäle / OTA ──▶ PMS ◀── Kassensysteme (Restaurant, Bar, Spa)
                  │
                  ├──▶ Zahlungsdienstleister
                  ├──▶ Türschloss, Telefon, Parken, Pay-TV
                  └──▶ Finanzbuchhaltung
```

Jeder Pfeil ist eine Stelle, an der Daten verloren gehen, doppelt ankommen oder falsch zugeordnet werden können. Und jeder Pfeil ist eine Stelle, an der niemand zuständig ist, weil beide Seiten den jeweils anderen für zuständig halten.

## Laute und stille Fehler

**Laute Fehler** brechen ab: Die Schnittstelle steht, nichts kommt an, jemand ruft an. Unangenehm, aber sie werden bemerkt und behoben.

**Stille Fehler** laufen weiter. Sie sind die teureren:

| Stiller Fehler | Wirkung |
|---|---|
| Ein Artikel läuft auf einen falschen Transaktionscode | Bereichserlöse dauerhaft verschoben |
| Nur ein Teil der Umsätze kommt an | Erlös fehlt, fällt erst im Wareneinsatz auf |
| Buchungen kommen doppelt | Erlös zu hoch, Gast bekommt eine falsche Rechnung |
| Zeitversatz um den Datumswechsel | Umsätze auf dem falschen Geschäftstag |
| Steuersatz wird nicht übergeben | falscher Steuerausweis, systematisch |
| Ein neuer Artikel ist nicht gemappt | landet auf „Sonstiges" oder gar nicht |

**Der letzte Fall ist der häufigste im Alltag.** Die Küche legt ein neues Gericht an, die Zuordnung im Schnittstellen-Mapping fehlt, und der Umsatz landet irgendwo. Niemand merkt es, weil die Gesamtsumme stimmt.

## Die Prüfung, die das findet

Nicht in den Systemen suchen, sondern **Summen gegeneinander stellen**. Täglich, für jede Übergabe eine Zeile:

| Übergabe | Quelle | Ziel | Prüfgröße |
|---|---|---|---|
| Restaurantkasse → PMS | Tagesabschluss der Kasse | Erlöse F&B im PMS | Summe je Bereich |
| Zahlungsdienstleister → Bank | Kartenumsätze im PMS | Gutschriften auf dem Konto | Summe je Marke, mit Zeitversatz |
| PMS → Buchhaltung | Exportprotokoll | gebuchte Summen | Erlös, Steuer, Ledgerbestände |
| Kanäle → PMS | Buchungen im Portal | Reservierungen im PMS | Anzahl und Rate |

Der Aufwand liegt bei wenigen Minuten, wenn die Zahlen an einer Stelle stehen. Genau dafür lohnt sich eine kleine Abstimmungstabelle mehr als jedes Dashboard: Sie zeigt vier Zahlenpaare und ob sie gleich sind.

## Das Fehlerprotokoll

Jede Schnittstelle schreibt eines. In den meisten Häusern liest es niemand — bis zum Monatsabschluss, wenn eine Differenz auftaucht und die Ursache drei Wochen zurückliegt.

**Die Regel, die den größten Unterschied macht:** Das Protokoll wird täglich angesehen, und zwar von der Person, die ohnehin die Tageskontrolle macht. Nicht gelesen, sondern überflogen — Einträge nach Schweregrad, und alles außer „ok" wird notiert.

Ein Fehler, der heute auffällt, ist eine Korrektur. Derselbe Fehler am Monatsende ist eine Rekonstruktion.

## Was beim Anlegen schiefgeht

Die meisten Schnittstellenprobleme entstehen nicht im Betrieb, sondern beim Ändern von Stammdaten — und sie entstehen, weil zwei Seiten unabhängig voneinander arbeiten:

1. **Neuer Artikel in der Kasse** ohne Mapping im PMS
2. **Neuer Transaktionscode im PMS** ohne Konto in der Buchhaltung
3. **Geänderter Steuersatz** nur auf einer Seite gepflegt
4. **Neue Zahlungsart** ohne Zuordnung beim Dienstleister
5. **Umbenannter Bereich** — die Schnittstelle sucht den alten Namen

**Die organisatorische Antwort ist unspektakulär und wirksam:** Stammdatenänderungen sind nie eine Einzelentscheidung. Wer einen Artikel, einen Code oder einen Steuersatz anlegt, informiert die anderen Seiten — am besten über eine feste, sehr kurze Liste, wer bei welcher Art von Änderung Bescheid bekommt.

## Die Übergabe an die Buchhaltung

Die wichtigste Schnittstelle, und die am wenigsten beobachtete. Sie überträgt am Ende des Geschäftstages Erlöse, Steuern, Zahlungen und Ledgerbewegungen.

Drei Prüfungen, die den Monatsabschluss deutlich entlasten:

- **Summengleichheit.** Was das PMS als Tagesumsatz ausweist, muss in der Buchhaltung ankommen. Differenzen sind fast immer Stichtagsversatz — oder ein Ledger, das gar nicht übergeben wird.
- **Vollständigkeit der Tage.** Fehlt ein Geschäftstag, fällt das im Monat kaum auf und im Jahresabschluss sehr.
- **Steuerausweis.** Die Aufteilung nach Steuersätzen muss auf beiden Seiten gleich sein. Eine Verschiebung hier ist der teuerste stille Fehler von allen.

## Wenn eine Schnittstelle ausfällt

- **Nicht improvisieren, ohne es zu notieren.** Manuell nachgebuchte Umsätze sind zulässig und normal — undokumentiert sind sie ein Problem. Der Eintrag gehört ins Störungsprotokoll.
- **Nicht doppelt nachbuchen.** Läuft die Schnittstelle später an und holt die Daten nach, entstehen Doppelbuchungen. Vor dem Nachholen klären, was die Schnittstelle selbst noch liefert.
- **Den betroffenen Tag anschließend prüfen.** Belegung, Erlös je Bereich und Ledgerbestand sind die schnellste Probe.

## Warum das in dieses Themengebiet gehört

Schnittstellen wirken wie ein IT-Thema. Sie sind es nicht: **Jede Zahl, mit der später gesteuert wird, ist einmal über eine Schnittstelle gelaufen.** Ein falsch gemappter Artikel verschiebt die F&B-Wareneinsatzquote, ein fehlender Steuersatz die Voranmeldung, ein doppelter Umsatz die ADR. Wer die Kennzahlen verantwortet, verantwortet die Übergaben mit.

::: quiz
F: Warum sind stille Schnittstellenfehler teurer als laute?
A: Laute brechen ab und werden bemerkt. Stille laufen weiter — ein falsch gemappter Artikel verschiebt Bereichserlöse dauerhaft, ohne dass die Gesamtsumme auffällig wird.

F: Was ist der häufigste stille Schnittstellenfehler im Alltag?
A: Ein neuer Artikel in der Kasse ohne Zuordnung im PMS. Der Umsatz landet auf einem Sammelcode oder gar nicht, und die Gesamtsumme stimmt trotzdem.

F: Wie prüft man Schnittstellen, ohne in den Systemen zu suchen?
A: Summen gegeneinander stellen — je Übergabe ein Zahlenpaar, täglich. Vier Paare und die Frage, ob sie gleich sind.

F: Eine Schnittstelle war ausgefallen und die Umsätze wurden manuell nachgebucht. Was ist die Gefahr beim Wiederanlauf?
A: Doppelbuchungen, wenn die Schnittstelle die Daten selbst nachholt. Vor dem manuellen Nachbuchen klären, was sie noch liefert — und den Vorgang ins Störungsprotokoll eintragen.

F: Warum ist die Schnittstellenpflege kein reines IT-Thema?
A: Jede Zahl, mit der gesteuert wird, ist einmal über eine Schnittstelle gelaufen. Ein falsch gemappter Artikel verschiebt die Wareneinsatzquote, ein fehlender Steuersatz die Voranmeldung.
:::
