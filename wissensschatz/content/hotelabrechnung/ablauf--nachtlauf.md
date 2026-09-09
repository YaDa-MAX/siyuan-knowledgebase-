---
id: hotelabr-nachtlauf
title: Nachtlauf und Tagesabschluss
path: hotelabrechnung/ablauf
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-09-09
tags: [nachtlauf, nightaudit, geschaeftsdatum, kassenabschluss, ablauf]
prereqs: [hotelabr-ledger]
related: [hotelabr-kontrolle, hotelabr-abstimmung, hotelabr-schnittstellen, prozessauto-analyse]
summary: Was der Nachtlauf tatsächlich tut, was vorher stimmen muss, und warum das Geschäftsdatum nicht dasselbe ist wie der Kalendertag.
---

## Warum ein Hotel jede Nacht abschließt

Die Leistung *Übernachtung* entsteht jede Nacht neu und wird jede Nacht gebucht. Damit das automatisch geschehen kann, braucht das System einen definierten Moment, in dem der eine Tag endet und der nächste beginnt — das **Geschäftsdatum** wechselt.

Dieser Moment ist **nicht** Mitternacht. Er liegt dort, wo der Betrieb am ruhigsten ist, typischerweise zwischen zwei und vier Uhr morgens. Ein Gast, der um 1:30 Uhr an der Bar zahlt, bucht auf den gestrigen Geschäftstag; einer, der um 4:30 Uhr eincheckt, auf den heutigen.

**Daraus folgt eine Regel, die im Alltag ständig gebraucht wird:** *Geschäftsdatum ist nicht Kalenderdatum.* Wer PMS-Zahlen mit Kassen-, Bank- oder Buchhaltungszahlen vergleicht, vergleicht zwei unterschiedlich geschnittene Tage. Das ist kein Fehler, es muss nur bekannt sein — und es erklärt einen erheblichen Teil aller Abstimmungsdifferenzen.

## Was der Nachtlauf tut

Der Ablauf ist in allen Systemen im Kern derselbe:

| Schritt | Was passiert |
|---|---|
| **1 Prüfen** | offene Anreisen, offene Abreisen, nicht abgeschlossene Kassen |
| **2 No-Shows** | erwartete Anreisen, die nicht erschienen sind, werden gekennzeichnet |
| **3 Zimmer und Steuer** | für jedes belegte Zimmer werden Preis und Steuer automatisch gebucht |
| **4 Datumswechsel** | das Geschäftsdatum springt auf den Folgetag |
| **5 Statistik** | Belegung, ADR, RevPAR, Erlöse je Bereich werden festgeschrieben |
| **6 Berichte** | Tagesberichte werden erzeugt und abgelegt |
| **7 Übergabe** | Export an Finanzbuchhaltung und angeschlossene Systeme |

Schritt 3 ist der eigentliche Kern: **Erst hier entsteht der Logisumsatz.** Vorher ist der Zimmerpreis nur eine Erwartung aus der Reservierung.

## Was vorher stimmen muss

Der Nachtlauf korrigiert nichts. Er schreibt fest, was da ist — und das ist der Grund, warum die Prüfungen davor wichtiger sind als der Lauf selbst.

**Offene Abreisen.** Ein Gast, der abgereist ist, aber nicht ausgecheckt wurde, gilt als anwesend. Der Nachtlauf bucht ihm eine weitere Nacht. Der Fehler wird am nächsten Tag entdeckt und muss storniert werden — mit einer Negativbuchung, die dann in der Kontrolle auftaucht und erklärt werden will.

**Offene Anreisen.** Eine erwartete Anreise, die weder eingecheckt noch als No-Show behandelt wurde, ist eine unbeantwortete Frage. Der Lauf entscheidet sie stillschweigend, und die Entscheidung ist selten die richtige.

**Nicht abgeschlossene Kassen.** Ein Kassierer, der seine Schicht nicht abgeschlossen hat, hinterlässt Buchungen ohne Abrechnung. Sie landen im richtigen Geschäftstag, aber ohne Gegenüberstellung von Soll und Ist — und die lässt sich später nicht mehr rekonstruieren.

**Preis null.** Zimmer ohne Preisbuchung sind manchmal richtig (Mitarbeiterzimmer, Kulanz, Kompensation) und manchmal ein vergessener Ratenschlüssel. Sie senken die ADR und sind hinterher kaum zu unterscheiden — deshalb gehört zu jedem Nullpreis ein Vermerk, und zwar vor dem Lauf.

## Der Morgen danach

Der Nachtlauf erzeugt Zahlen. Ob sie stimmen, entscheidet sich am Morgen. Die Reihenfolge, die sich bewährt hat:

1. **Lief der Lauf fehlerfrei durch?** Protokoll lesen, nicht nur auf „fertig" schauen.
2. **Stimmt der Ledgerbestand?** Vortag plus Buchungen minus Zahlungen ergibt heute.
3. **Was wurde von Hand gebucht?** Und was davon war erlösmindernd?
4. **Passt Manager Flash zur Codeauswertung?**
5. **Sind Kassen und Zahlungsarten abgestimmt?**

Fünf Punkte, für die eingespielt zwanzig Minuten reichen. Der Wert liegt nicht darin, jeden Tag etwas zu finden, sondern darin, dass ein Fehler **am nächsten Tag** gefunden wird statt am Monatsende — solange die Person, die ihn gemacht hat, sich noch erinnert und die Korrektur noch im selben Monat möglich ist.

## Der Unterschied zwischen Lauf und Kontrolle

Ein verbreiteter Irrtum: Der Nachtlauf sei die Kontrolle. Er ist das Gegenteil — er ist der Vorgang, der kontrolliert werden muss.

| | Nachtlauf | Tageskontrolle |
|---|---|---|
| **Macht** | die Maschine | ein Mensch |
| **Leistet** | buchen, festschreiben, rechnen | beurteilen, hinterfragen, entscheiden |
| **Findet Fehler** | nur technische | fachliche |
| **Dauert** | Minuten | zwanzig Minuten |

Ein Haus, in dem der Nachtlauf zuverlässig läuft und niemand morgens hinsieht, hat eine perfekt dokumentierte Sammlung ungeprüfter Zahlen.

## Wenn der Lauf abbricht

Es passiert selten und dann meist zum ungünstigsten Zeitpunkt. Was hilft:

- **Nicht mehrfach starten**, bevor klar ist, wie weit er gekommen war. Ein zweiter Lauf über denselben Tag erzeugt doppelte Zimmerbuchungen.
- **Protokoll sichern**, bevor irgendetwas anderes geschieht.
- **Manuelles Vorgehen dokumentieren.** Was von Hand nachgeholt wurde, gehört in die Verfahrensdokumentation — bei einer Prüfung ist ein nachvollziehbarer Ausnahmefall unproblematisch, ein undokumentierter nicht.
- **Am Folgetag die Statistik prüfen.** Belegung und ADR des betroffenen Tages sind die schnellste Probe, ob der Lauf vollständig war.

::: quiz
F: Warum ist das Geschäftsdatum nicht dasselbe wie das Kalenderdatum, und welche Folge hat das?
A: Der Tageswechsel liegt dort, wo der Betrieb am ruhigsten ist, meist zwischen zwei und vier Uhr. Wer PMS-Zahlen mit Kassen-, Bank- oder Buchhaltungszahlen vergleicht, vergleicht deshalb unterschiedlich geschnittene Tage — das erklärt einen großen Teil aller Abstimmungsdifferenzen.

F: In welchem Schritt des Nachtlaufs entsteht der Logisumsatz?
A: Beim automatischen Buchen von Zimmerpreis und Steuer. Vorher ist der Preis nur eine Erwartung aus der Reservierung.

F: Ein Gast ist abgereist, wurde aber nicht ausgecheckt. Was macht der Nachtlauf?
A: Er bucht eine weitere Nacht, weil der Gast als anwesend gilt. Die Korrektur am Folgetag erzeugt eine Negativbuchung, die dann in der Kontrolle erklärt werden muss.

F: Warum ist der Nachtlauf nicht die Kontrolle?
A: Er ist der Vorgang, der kontrolliert werden muss. Er findet technische Fehler, keine fachlichen — ein Haus ohne Morgenkontrolle hat eine perfekt dokumentierte Sammlung ungeprüfter Zahlen.

F: Der Nachtlauf bricht ab. Was ist der gefährlichste Reflex?
A: Ihn sofort erneut zu starten. Ein zweiter Lauf über denselben Tag erzeugt doppelte Zimmerbuchungen — zuerst muss klar sein, wie weit er gekommen war.
:::
