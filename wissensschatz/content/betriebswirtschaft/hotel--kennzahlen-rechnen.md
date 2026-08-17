---
id: bwl-hotelkennzahlen
title: Hotelkennzahlen richtig rechnen
path: betriebswirtschaft/hotel
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-11
tags: [revpar, adr, goppar, usali, belegung, hotel]
prereqs: [bwl-einstieg, bwl-personalkosten]
related: [bwl-revenue, fuehrung-kennzahlen, powerbi-sternschema, bwl-budget]
summary: Was RevPAR wirklich misst und was nicht, warum GOPPAR die ehrlichere Größe ist — und die Abgrenzungsfehler, die jeden Vergleich zwischen zwei Häusern wertlos machen.
---

## Die Kette der Hotelkennzahlen

```
Belegung  = verkaufte Zimmer / verfügbare Zimmer
ADR       = Logisumsatz netto / verkaufte Zimmer
RevPAR    = Logisumsatz netto / verfügbare Zimmer  =  Belegung × ADR
TRevPAR   = Gesamtumsatz netto / verfügbare Zimmer
GOPPAR    = Bruttobetriebsergebnis / verfügbare Zimmer
```

Die Kette ist keine Aufzählung, sondern eine Verschärfung: Jede Stufe beantwortet, was die vorherige offenlässt.

| Kennzahl | Beantwortet | Blind für |
|---|---|---|
| Belegung | Wie voll? | zu welchem Preis |
| ADR | Zu welchem Preis? | wie voll |
| **RevPAR** | Wie voll **und** zu welchem Preis? | alle Kosten, alle Nebenerlöse |
| TRevPAR | Was bringt der Gast insgesamt? | alle Kosten |
| **GOPPAR** | Was bleibt? | Kapitaldienst und Steuern |

**Der wichtigste Satz dazu:** RevPAR ist eine *Erlös*kennzahl, keine *Ertrags*kennzahl. Ein Haus kann seinen RevPAR steigern und dabei Geld verlieren — etwa durch Gruppen, die viel Housekeeping, viel Frühstück und hohe Provision verursachen. Deshalb ist GOPPAR die Steuerungsgröße für die Hausleitung, RevPAR die für den Vertrieb.

## Warum Belegung und ADR gegeneinander laufen

Dieselben 100 Zimmer bringen bei beiden Strategien fast denselben RevPAR:

| | Belegung | ADR | RevPAR |
|---|---|---|---|
| Preisstrategie | 65 % | 145 € | 94,25 € |
| Volumenstrategie | 85 % | 112 € | 95,20 € |

Betriebswirtschaftlich sind sie trotzdem **nicht gleichwertig**. Die Volumenstrategie verkauft 20 Zimmer mehr und verursacht dafür 20-mal Reinigung, Wäsche, Frühstück, Verbrauch und meist mehr Provision. Bei variablen Kosten von etwa 25 € je belegtem Zimmer kostet das rund 500 € — ein Betrag, den die 95 Cent Mehr-RevPAR nicht ansatzweise tragen.

**Die Regel, die daraus folgt:** Bei gleichem RevPAR ist die Variante mit der höheren ADR wirtschaftlich überlegen. Der Grund ist einfach — ein Zimmer, das nicht verkauft wird, verursacht auch keine variablen Kosten.

Die Gegenrichtung gilt allerdings auch: Ein Haus mit dauerhaft 55 % Belegung hat ein strukturelles Nachfrageproblem, das kein Preis löst. Und Auslastung erzeugt Nebenerlöse — Bar, Restaurant, Spa —, die im RevPAR nicht auftauchen. Genau dafür gibt es TRevPAR.

## Die Abgrenzungsfehler

Diese fünf machen jeden Vergleich wertlos — zwischen Häusern, zwischen Jahren, gegen jede Benchmark:

**1 — Verfügbare Zimmer nicht bereinigt.**
Zimmer, die wegen Renovierung dauerhaft aus dem Verkauf sind (*Out of Order*), gehören nicht in den Nenner; kurzfristig gesperrte (*Out of Service*) schon. Wer 20 renovierte Zimmer mitzählt, drückt RevPAR und Belegung künstlich.

**2 — Frühstück im Logisumsatz.**
Der Logisumsatz ist die Übernachtung ohne Verpflegung. Bleibt das Frühstück drin, ist die ADR zu hoch und der F&B-Umsatz zu niedrig — beide Kennzahlen falsch, in entgegengesetzte Richtungen. Bei Halbpension wird das zur Aufteilungsübung, die einmal sauber definiert und dann konstant angewendet werden muss.

**3 — Kurtaxe und Servicegebühren im Umsatz.**
Durchlaufende Posten. Sie gehören dem Gast beziehungsweise der Gemeinde, nicht dem Betrieb.

**4 — Brutto statt netto.**
Derselbe Fehler wie überall, hier besonders folgenreich, weil Beherbergung und Verpflegung verschiedenen Steuersätzen unterliegen können. Eine ADR aus Bruttozahlen ist mit keiner anderen vergleichbar.

**5 — Provisionen als Marketingkosten.**
Eine OTA-Provision ist eine Vertriebskostenquote auf genau diese Buchung. Wer sie unter Marketing bucht, sieht eine ADR, die es so nie gab.

## Netto-ADR: was wirklich ankommt

```
Netto-ADR = (Logisumsatz − Provisionen − Vertriebskosten) / verkaufte Zimmer
```

Eine Buchung über ein Portal zu 140 € mit 15 % Provision bringt 119 €. Eine Direktbuchung zu 130 € bringt 130 €. **Der niedrigere Bruttopreis ist der bessere Erlös** — und das ist der ganze betriebswirtschaftliche Grund für Direktbuchungsanreize.

Die Rechnung geht allerdings nur auf, wenn der Anreiz die Buchung wirklich verlagert. Ein Rabatt an Gäste, die ohnehin direkt gebucht hätten, ist reiner Erlösverzicht. Die ehrliche Kennzahl dafür ist der **Anteil der Direktbuchungen im Zeitvergleich**, nicht die absolute Zahl.

## USALI — warum Vergleichbarkeit eine Norm braucht

Das *Uniform System of Accounts for the Lodging Industry* ist der Branchenkontenrahmen der Hotellerie. Sein Kern ist eine Gliederung nach **Bereichen mit direkt zurechenbaren Erlösen und Kosten** (Rooms, F&B, Other Operated Departments) und darunter die **nicht zurechenbaren Kosten** (Verwaltung, Vertrieb, Instandhaltung, Energie). Was danach bleibt, ist der GOP.

Der praktische Wert liegt genau in dieser Trennung: Sie entspricht der Deckungsbeitragslogik und macht Häuser vergleichbar, deren Eigentums-, Pacht- und Finanzierungsstrukturen völlig verschieden sind. Ein GOPPAR-Vergleich ist deshalb aussagekräftig, ein Vergleich der Jahresüberschüsse nicht.

**Ohne diese Norm sind Benchmarks Zufallszahlen.** Wer sich mit fremden Häusern vergleicht, muss zuerst klären, ob deren GOP dieselbe Abgrenzung hat.

## Was in kein Dashboard gehört, aber gerechnet werden sollte

- **Deckungsbeitrag je Segment.** Firmenkunden, Gruppen, OTA, Direkt, Wholesale — sie unterscheiden sich in ADR, Nebenerlösen, Vertriebskosten und Aufwand deutlich stärker als in der Belegung.
- **Vorbuchungskurve (Pickup).** Buchungen je Anreisetag im Zeitverlauf, verglichen mit dem Vorjahr. Sie ist das einzige, was rechtzeitig warnt — alle Kennzahlen oben schauen zurück.
- **Kosten je belegtem Zimmer.** Reinigung, Wäsche, Verbrauch, Frühstück. Die Zahl, die man braucht, um über jeden Sonderpreis entscheiden zu können.

::: quiz
F: Warum ist RevPAR keine Ertragskennzahl?
A: Er misst nur den Logiserlös je verfügbarem Zimmer. Kosten und Nebenerlöse kommen darin nicht vor — ein Haus kann RevPAR steigern und dabei Geld verlieren. Die Ertragsgröße ist GOPPAR.

F: Zwei Strategien ergeben denselben RevPAR: 65 % zu 145 € und 85 % zu 112 €. Welche ist besser und warum?
A: Die mit der höheren ADR. Die Volumenvariante verkauft 20 Zimmer mehr und verursacht 20-mal variable Kosten — Reinigung, Wäsche, Frühstück, Provision —, die der marginal höhere RevPAR nicht deckt.

F: Eine Portalbuchung bringt 140 € bei 15 % Provision, eine Direktbuchung 130 €. Welche ist besser?
A: Die Direktbuchung: 130 € gegen 119 € Netto-ADR. Das ist der betriebswirtschaftliche Grund für Direktbuchungsanreize — der ins Leere läuft, wenn der Rabatt Gäste erreicht, die ohnehin direkt gebucht hätten.

F: Warum ist ein GOPPAR-Vergleich zwischen zwei Häusern aussagekräftiger als ein Vergleich der Jahresüberschüsse?
A: Weil USALI den GOP vor Pacht, Kapitaldienst und Steuern abgrenzt. Damit vergleicht man die operative Leistung statt der Eigentums- und Finanzierungsstruktur.
:::
