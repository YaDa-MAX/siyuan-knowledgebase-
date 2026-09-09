---
id: hotelabr-ledger
title: Die Ledger — wo eine Forderung gerade steht
path: hotelabrechnung/grundlagen
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-09-09
tags: [ledger, guestledger, cityledger, deposit, pmkonto, saldo]
prereqs: [hotelabr-einstieg]
related: [hotelabr-debitoren, hotelabr-storno, hotelabr-monatsabschluss, bwl-liquiditaet]
summary: Guest Ledger, City Ledger, Deposit Ledger und die PM-Konten — was wo liegt, wann es wandert, und warum ein Sammelkonto ohne Eigentümer der gefährlichste Posten im Haus ist.
---

## Vier Töpfe

Ein Hotel führt seine Forderungen in getrennten Beständen. Sie unterscheiden sich danach, **in welchem Verhältnis der Gast gerade zum Haus steht**.

| Ledger | Enthält | Typischer Zeitraum |
|---|---|---|
| **Deposit Ledger** | erhaltene Anzahlungen für künftige Aufenthalte | Wochen bis Monate vor Anreise |
| **Guest Ledger** | Salden von Gästen, die **im Haus** sind | Tage |
| **City Ledger** (Debitoren) | Rechnungen an bereits abgereiste Gäste und Firmen | Wochen bis Monate |
| **PM-Konten** | Sammelkonten ohne Zimmer: Gruppen, Bankett, Dauerposten | je nach Zweck |

Dazu die Zahlungsseite — Kasse, Karten, Bank —, die keine Forderungen enthält, sondern deren Ausgleich.

::: viz ledger-fluss
:::

## Deposit Ledger

Eine Anzahlung ist **Geld ohne Erlös**. Sie steht als Verbindlichkeit im Haus: Man schuldet dem Gast eine Leistung.

Drei Dinge, die daran hängen:

- **Bei Anreise** wird die Anzahlung auf das Zimmerkonto übertragen und gleicht dort die Rechnung ganz oder teilweise aus.
- **Bei Storno** entscheidet der Vertrag: Rückzahlung, Verrechnung mit einer Stornogebühr oder Verfall.
- **Umsatzsteuerlich** entsteht die Steuer bereits mit der **Vereinnahmung** des Geldes, nicht erst mit der Leistung. Das wird regelmäßig übersehen, weil im Deposit Ledger kein Erlös steht.

**Der häufigste Fehler:** Die Anzahlung bleibt nach Anreise oder Storno stehen. Sie ist dann eine Verbindlichkeit, die niemand mehr kennt — und sie taucht im Zweifel Jahre später im Jahresabschluss auf.

## Guest Ledger

Der Bestand der Zimmerkonten. Er ist die einzige Größe, die sich täglich vollständig kontrollieren lässt:

```
Bestand Vortag
  + Buchungen des Tages
  − Zahlungen und Überträge
  = Bestand heute
```

Geht die Rechnung nicht auf, ist eine Buchung mit falschem Datum eingegangen oder eine Korrektur wurde nachträglich vorgenommen. Beides ist wichtig zu wissen, und beides fällt später nicht mehr auf.

**Die zweite Prüfung ist die Altersstruktur.** Ein Guest Ledger enthält per Definition nur Gäste im Haus. Ein Posten, der älter ist als der längste denkbare Aufenthalt, gehört dort nicht hin — meist ist es ein nicht abgeschlossener Check-out oder ein Zimmer, das nie ausgecheckt wurde.

## City Ledger

Nach der Abreise wird aus dem Zimmerkonto eine Rechnung an einen Debitor. Ab hier gilt normales Forderungsmanagement: Rechnung stellen, Zahlungsziel überwachen, mahnen, Altersstruktur beobachten.

**Der Übergang ist die kritische Stelle.** Ein Übertrag beim Check-out gleicht das Zimmerkonto aus — die Forderung besteht aber weiter. Wer nur das Guest Ledger im Blick hat, sieht ein sauberes Haus und übersieht einen wachsenden Berg.

Deshalb gilt: **Jeder Übertrag ins City Ledger braucht sofort eine Rechnung.** Die häufigste Ursache für alte Posten ist nicht der säumige Kunde, sondern die Rechnung, die zwei Wochen liegen blieb.

## PM-Konten

Sammelkonten ohne Zimmerbezug — je nach System *Posting Master*, *Permanent Master* oder schlicht Sammelkonto. Sie sind unverzichtbar und zugleich die gefährlichste Konstruktion im ganzen System.

**Wofür sie gebraucht werden:**

- **Gruppen** — Sammelrechnung für Zimmer, die einzeln bewohnt werden
- **Bankett und Tagung** — Leistungen ohne Übernachtung
- **Dauerposten** — Telefonanlage, Automaten, Mietpartner
- **Zwischenkonten** — Klärfälle, Differenzen, offene Zuordnungen

**Warum sie gefährlich sind:** Ein PM-Konto hat kein Ende. Ein Zimmerkonto wird beim Check-out zwangsläufig ausgeglichen; ein Sammelkonto kann jahrelang mit einem Saldo dastehen, ohne dass ein Vorgang es erzwingt, ihn aufzulösen.

Drei Regeln, die das entschärfen:

1. **Jedes PM-Konto hat einen Verantwortlichen und einen Zweck**, beide dokumentiert. Ein Konto ohne Eigentümer ist ein Konto ohne Kontrolle.
2. **Veranstaltungskonten werden nach der Veranstaltung geschlossen**, nicht „irgendwann".
3. **Zwischenkonten bekommen eine Frist.** Ein Klärfall, der nach vier Wochen noch offen ist, ist kein Klärfall mehr, sondern eine Entscheidung, die niemand trifft.

## Der Gesamtbestand

Alle Ledger zusammen ergeben, was das Haus an Forderungen und Verbindlichkeiten hält. Diese Summe muss mit der Finanzbuchhaltung übereinstimmen — sie ist die Klammer, die PMS und Rechnungswesen verbindet.

Weicht sie ab, kommen in der Praxis fast immer dieselben Ursachen in Frage:

- **Stichtagsversatz** — das PMS wechselt das Datum nachts, die Buchhaltung um Mitternacht. Der Klassiker, und kein Fehler.
- **Ein Übertrag ohne Gegenbuchung** — irgendwo wurde verschoben, ohne dass die Gegenseite es bekam.
- **Manuelle Buchung direkt in der Buchhaltung**, die im PMS nie stattfand.
- **Ein Ledger wird gar nicht übergeben** — typischerweise das Deposit Ledger, weil es „kein Erlös" ist.

## Der Blick, der sich lohnt

Nicht der Bestand ist die interessante Zahl, sondern seine **Zusammensetzung nach Alter**. Ein City Ledger von 80.000 € ist unauffällig, wenn alles unter 30 Tagen liegt, und ein Problem, wenn ein Drittel älter als 90 Tage ist. Dieselbe Summe, zwei völlig verschiedene Lagen.

::: quiz
F: Warum ist eine Anzahlung im Deposit Ledger kein Erlös — und warum fällt trotzdem Umsatzsteuer an?
A: Es ist Geld ohne erbrachte Leistung, also eine Verbindlichkeit. Umsatzsteuerlich entsteht die Steuer aber bereits mit der Vereinnahmung des Entgelts, nicht erst mit der Leistung.

F: Das Guest Ledger enthält einen Posten von vor vier Monaten. Was ist passiert?
A: Dort gehört er nicht hin — das Guest Ledger enthält nur Gäste im Haus. Meist ist es ein nicht abgeschlossener Check-out oder ein Zimmer, das nie ausgecheckt wurde.

F: Warum sieht ein Haus mit sauberem Guest Ledger trotzdem schlecht aus?
A: Weil Überträge beim Check-out das Zimmerkonto ausgleichen, die Forderung aber ins City Ledger verschieben. Wer nur das Guest Ledger prüft, sieht den wachsenden Debitorenberg nicht.

F: Was macht PM-Konten gefährlicher als Zimmerkonten?
A: Ein Zimmerkonto wird beim Check-out zwangsläufig ausgeglichen. Ein Sammelkonto hat kein Ende — es kann jahrelang mit Saldo dastehen, ohne dass irgendein Vorgang zur Auflösung zwingt.

F: Der Ledgerbestand im PMS weicht von der Buchhaltung ab. Welche Ursache ist die harmloseste?
A: Der Stichtagsversatz: Das PMS wechselt das Geschäftsdatum nachts, die Buchhaltung um Mitternacht. Das ist kein Fehler, sondern muss nur bekannt sein.
:::
