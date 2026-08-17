---
id: bwl-deckungsbeitrag
title: Deckungsbeitrag und Break-even
path: betriebswirtschaft/kalkulation
level: 3
type: theorie
source: ki
status: geprueft
updated: 2026-08-11
tags: [deckungsbeitrag, breakeven, fixkosten, teilkosten, entscheidung]
prereqs: [bwl-kalkulation, bwl-einstieg]
related: [bwl-menu-engineering, bwl-budget, excel-was-waere-wenn, excel-finanzmathematik]
summary: Die Rechnung, die entscheidet, ob sich ein Mittagstisch, eine zusätzliche Öffnungszeit oder ein Sonderpreis lohnt — und warum Vollkostendenken dabei regelmäßig zur falschen Antwort führt.
---

## Die Grundidee

Der **Deckungsbeitrag** ist das, was ein verkauftes Stück zur Deckung der Fixkosten beiträgt:

```
Deckungsbeitrag = Erlös − variable Kosten
```

Erst wenn die Summe aller Deckungsbeiträge die Fixkosten übersteigt, entsteht Gewinn. Davor deckt sie nur.

Die Stufung, die in der Praxis trägt:

| Stufe | Rechnung | Aussage |
|---|---|---|
| **DB 1** | Erlös − Wareneinsatz | trägt das Produkt seine Ware? |
| **DB 2** | DB 1 − direkt zurechenbare Personalkosten | trägt der Bereich seine Leute? |
| **DB 3** | DB 2 − bereichsfixe Kosten | trägt der Bereich sich selbst? |
| **Ergebnis** | DB 3 − Unternehmensfixkosten | trägt der Betrieb sich? |

Der Nutzen der Stufung liegt in der Zurechenbarkeit: Der Bankettbereich hat eigene Personal- und Raumkosten, aber keine eigene Buchhaltung. Wer ihm anteilig die Verwaltung zurechnet, erzeugt eine Zahl, die von einem Verteilungsschlüssel abhängt statt von seiner Leistung.

## Warum Vollkostendenken in die Irre führt

Die klassische Fehlentscheidung, in einer Zeile: **„Das Gericht trägt seinen Anteil an der Miete nicht, also nehmen wir es von der Karte."**

Die Miete fällt weiter an. Verschwindet das Gericht, verschwindet sein Deckungsbeitrag — und die Miete verteilt sich auf weniger Gerichte, von denen dann das nächste unrentabel aussieht. Diese Spirale hat schon Karten leergeräumt.

**Die richtige Frage lautet nie „deckt es seine Vollkosten?", sondern „ist sein Deckungsbeitrag positiv, und gibt es eine bessere Verwendung derselben Kapazität?"**

Drei Anwendungen, bei denen der Unterschied über die Entscheidung bestimmt:

- **Mittagstisch.** Die Küche ist besetzt, der Raum bezahlt, das Personal da. Ein Mittagsgeschäft mit magerem Deckungsbeitrag ist trotzdem richtig, solange es keine zusätzlichen Fixkosten auslöst und den Abend nicht beschädigt. Sobald es eine zusätzliche Kraft erfordert, ändert sich die Rechnung — das ist der Sprung in den sprungfixen Kosten.
- **Zusätzliche Öffnungszeit.** Nur die *zusätzlichen* Kosten zählen: Personal, Energie, Ware. Die Miete zählt nicht, sie läuft ohnehin.
- **Sonderpreis für eine Gruppe.** Jeder Preis oberhalb der variablen Kosten verbessert das Ergebnis — solange die Gruppe nicht Gäste verdrängt, die den regulären Preis gezahlt hätten. Bei ausgebuchtem Haus ist genau diese Verdrängung der entscheidende Kostenblock, und sie taucht in keiner Kostenrechnung auf.

## Break-even

Der Punkt, an dem die Deckungsbeiträge die Fixkosten genau decken:

```
Break-even-Umsatz = Fixkosten / Deckungsbeitragsquote
Deckungsbeitragsquote = Deckungsbeitrag / Umsatz
```

Ein Betrieb mit 38.000 € monatlichen Fixkosten und einer Deckungsbeitragsquote von 68 % braucht 55.882 € Nettoumsatz im Monat, um bei null zu landen. Bei 26 Öffnungstagen sind das 2.149 € Tagesumsatz, bei einem Durchschnittsbon von 34 € rund 63 Gäste am Tag.

**Diese letzte Umrechnung ist der eigentliche Wert der Rechnung.** „Break-even bei 55.882 €" ist eine Zahl für den Steuerberater. „63 Gäste am Tag" ist eine Zahl, die eine Serviceleitung im Kopf behält und abends abgleichen kann.

**Sicherheitsstrecke** = (Istumsatz − Break-even-Umsatz) ÷ Istumsatz. Sie sagt, um wie viel Prozent der Umsatz einbrechen darf, bevor Verluste entstehen. Unter 10 % ist jeder verregnete Monat ein Problem.

Zwei Warnungen zur Anwendung:

- **Nicht auf Jahresbasis rechnen.** Ein Saisonbetrieb, der übers Jahr eine Sicherheitsstrecke von 25 % hat, kann im November trotzdem tief im Minus stehen. Die Rechnung gehört auf Monatsebene.
- **Kalkulatorische Kosten einbeziehen.** Wer als Inhaber mitarbeitet, muss einen Unternehmerlohn ansetzen; wer im eigenen Gebäude wirtschaftet, eine ortsübliche Miete. Sonst zeigt der Break-even eine Rentabilität, die nur durch unbezahlte Arbeit und nicht bewerteten Besitz entsteht.

::: viz break-even
:::

## Kapazität als eigentliche Knappheit

Im Gastgewerbe ist selten das Geld der Engpass, sondern **Sitzplatz-Stunden**, **Zimmer-Nächte** und **Küchen-Kapazität in der Spitze**. Deshalb ist die relevante Größe oft nicht der Deckungsbeitrag je Stück, sondern der **Deckungsbeitrag je Engpasseinheit**:

```
DB je Sitzplatzstunde = DB je Gast / durchschnittliche Verweildauer
```

Zwei Gerichte mit demselben Deckungsbeitrag sind nicht gleichwertig, wenn eines am Zweiertisch in 40 Minuten gegessen wird und das andere in zwei Stunden. An einem voll besetzten Samstagabend entscheidet die Verweildauer über das Ergebnis — an einem leeren Dienstag ist sie irrelevant.

Dasselbe im Hotel: Eine Buchung über drei Nächte zu 110 € ist einer Einzelnacht zu 140 € überlegen, wenn die Nächte davor und danach sonst leer bleiben — und unterlegen, wenn sie eine ausgebuchte Messenacht blockiert.

## Was die Rechnung nicht kann

- **Sie kennt keine Zeitverzögerung.** Ein Sonderpreis, der heute den Deckungsbeitrag verbessert, kann die Preiserwartung dauerhaft senken.
- **Sie kennt keine Qualität.** Eine Kürzung, die den Deckungsbeitrag hebt und den Gast vergrault, sieht in der Rechnung gut aus.
- **Sie unterstellt lineare variable Kosten.** Realistisch sind Sprünge: der dritte Koch, der zweite Kühlraum, die zusätzliche Lieferung.

Deshalb ist die Deckungsbeitragsrechnung ein Werkzeug für **einzelne, klar abgegrenzte Entscheidungen** — nicht für die Dauersteuerung. Für die braucht es die Vollkostensicht daneben, mit dem Wissen, dass ihre Verteilungsschlüssel willkürlich sind.

::: quiz
F: Ein Gericht deckt seinen rechnerischen Anteil an der Miete nicht. Von der Karte nehmen?
A: Nicht deshalb. Die Miete fällt weiter an; verschwindet das Gericht, verschwindet nur sein Deckungsbeitrag. Entscheidend ist, ob der Deckungsbeitrag positiv ist und ob dieselbe Kapazität besser genutzt werden könnte.

F: Fixkosten 38.000 €, Deckungsbeitragsquote 68 %. Wie hoch ist der Break-even-Umsatz, und warum rechnet man weiter?
A: 38.000 ÷ 0,68 = 55.882 € im Monat. Man rechnet weiter in Gäste je Tag, weil das die Zahl ist, die im Betrieb tatsächlich verwendet wird.

F: Warum ist der Deckungsbeitrag je Sitzplatzstunde am Samstagabend die bessere Größe als der Deckungsbeitrag je Gericht?
A: Weil dann die Kapazität der Engpass ist. Zwei Gerichte mit gleichem Deckungsbeitrag sind nicht gleichwertig, wenn eines den Tisch doppelt so lange bindet.

F: Warum gehören Unternehmerlohn und ortsübliche Miete in die Break-even-Rechnung, auch wenn sie nicht gezahlt werden?
A: Sonst zeigt die Rechnung eine Rentabilität, die nur durch unbezahlte Arbeit und nicht bewerteten Besitz zustande kommt — und der Betrieb sieht tragfähig aus, obwohl er es nicht ist.
:::
