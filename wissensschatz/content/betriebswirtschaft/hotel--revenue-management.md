---
id: bwl-revenue
title: Revenue Management — Preise als Steuerungsgröße
path: betriebswirtschaft/hotel
level: 4
type: theorie
source: ki
status: geprueft
updated: 2026-08-11
tags: [revenue, preissteuerung, verdraengung, vertrieb, segmentierung]
prereqs: [bwl-hotelkennzahlen, bwl-deckungsbeitrag]
related: [bwl-budget, bwl-personalkosten, powerbi-visuals, fuehrung-kennzahlen]
summary: Warum Preissteuerung nur bei verderblicher Kapazität funktioniert, was Verdrängung kostet, wie eine Vorbuchungskurve gelesen wird — und wo der Ansatz in Misstrauen umschlägt.
---

## Die vier Voraussetzungen

Revenue Management funktioniert nicht überall. Es setzt vier Eigenschaften voraus, die im Beherbergungsgeschäft alle zutreffen:

1. **Verderbliche Kapazität.** Ein heute nicht verkauftes Zimmer ist morgen wertlos. Es lässt sich nicht lagern.
2. **Fixkostendominanz.** Die Kosten fallen weitgehend unabhängig vom Verkauf an; die variablen Kosten je Zimmer sind gering.
3. **Vorausbuchung.** Es gibt einen Zeitraum, in dem Nachfrage sichtbar wird, bevor sie realisiert wird.
4. **Segmentierbare Zahlungsbereitschaft.** Verschiedene Gäste zahlen für dieselbe Nacht verschieden viel — und lassen sich unterscheiden.

Die vierte ist die anspruchsvollste. Segmentierung braucht einen **Zaun**, der verhindert, dass der zahlungskräftige Gast den günstigen Tarif nimmt: Vorausbuchungsfrist, Stornierbarkeit, Mindestaufenthalt, Vorauszahlung, Zielgruppennachweis. Ein Rabatt ohne Zaun ist keine Segmentierung, sondern eine Preissenkung für alle.

## Die zentrale Rechnung: Verdrängung

Die einzige Frage, die Revenue Management wirklich beantwortet: **Soll ich diese Buchung annehmen?**

Sie ist nur dann trivial, wenn genug Kapazität da ist. Wird es eng, kostet jede angenommene Buchung die beste Alternative, die dadurch nicht mehr passt — die **Verdrängungskosten**.

Ein Beispiel: Eine Gruppe fragt 30 Zimmer für Donnerstag bis Samstag zu 89 € an. Donnerstag und Freitag wären ohne sie halb leer, Samstag ist Messetag mit erwarteten 165 €.

| | Erlös |
|---|---|
| Gruppe: 30 × 3 × 89 | 8.010 € |
| verdrängte Samstagnächte: 30 × 165 | −4.950 € |
| **Netto zusätzlich** | **3.060 €** |

Ohne den Samstag wären es 5.340 € gewesen. Die Gruppe ist trotzdem gut — aber nur, weil Donnerstag und Freitag schwach sind. Die richtige Antwort ist deshalb selten „ja" oder „nein", sondern **„ja, wenn"**: ohne den Samstag, oder zu einem Preis, der ihn bezahlt.

**Der Fehler, der hier gemacht wird**, ist die Betrachtung der Gruppe als Ganzes zu einem Durchschnittspreis. Gerechnet wird je Anreisetag, gegen die jeweilige Alternative.

## Vorbuchungskurve lesen

Die **Pickup-Kurve** zeigt für einen bestimmten Anreisetag, wie sich die Buchungen über die Zeit aufgebaut haben — verglichen mit demselben Tag im Vorjahr oder mit dem Durchschnitt vergleichbarer Tage.

Sie ist das einzige Instrument, das **rechtzeitig** warnt. Alle Kennzahlen des Vormonats schauen zurück; die Pickup-Kurve zeigt in vier Wochen, was in vier Wochen passiert.

Drei Muster und ihre Deutung:

| Muster | Wahrscheinliche Ursache | Reaktion |
|---|---|---|
| **Kurve läuft flach unter Vorjahr** | Nachfrage fehlt oder Preis zu hoch | Preis prüfen, Sichtbarkeit erhöhen — je früher, desto milder die nötige Maßnahme |
| **Kurve läuft über Vorjahr, früh voll** | zu billig verkauft | Preise anheben, günstige Kategorien schließen |
| **Kurve springt spät** | Buchungsverhalten hat sich verschoben | nicht überreagieren; Vergleichsbasis prüfen |

Der häufigste teure Fehler ist die **späte Panikreaktion**: Zwei Wochen vor Anreise fällt die schwache Buchungslage auf, der Preis wird halbiert — und trifft nur noch das kurzfristige Segment, das ohnehin gekommen wäre, während die Preiswahrnehmung Schaden nimmt. Dieselbe Maßnahme acht Wochen früher hätte einen Bruchteil gekostet.

## Länge des Aufenthalts

Preissteuerung über den Tagespreis allein greift zu kurz, wenn einzelne Tage stark nachgefragt sind. Zwei Instrumente:

- **Mindestaufenthalt (MinLOS).** Am Messedienstag nur Buchungen ab zwei Nächten annehmen, damit der schwache Mittwoch mitgeht. Wirksam — und riskant, wenn die Nachfrage dafür nicht reicht: Dann bleibt der starke Tag ebenfalls leer.
- **Anreisesperre (CTA).** Keine Anreise an diesem Tag, Durchreisende dürfen bleiben. Milder als MinLOS, weil bestehende Aufenthalte nicht zerschnitten werden.

Beides sind Eingriffe, die Nachfrage abweisen. Sie brauchen eine belastbare Prognose — sonst optimieren sie einen Tag und beschädigen drei.

## Kanäle und ihre wahren Kosten

Ein Kanal kostet mehr als seine Provision:

| Kostenart | Beispiel |
|---|---|
| Provision | Portalprovision je Buchung |
| Kanalgebühren | Channel Manager, Buchungsmaschine, Zahlungsdienstleister |
| Ratenschaden | die Rate ist überall sichtbar und wird zum Anker |
| Datenverlust | keine Gästedaten, kein Direktkontakt für die Wiederbuchung |
| Abhängigkeit | Sichtbarkeit hängt an einem Ranking, das man nicht kontrolliert |

Dagegen steht ein realer Nutzen, der oft unterschätzt wird: **Reichweite in Märkten, die man selbst nicht erreicht**, und der Billboard-Effekt — Portalpräsenz erzeugt Direktbuchungen. Die Konsequenz ist deshalb nicht der Ausstieg, sondern die **bewusste Steuerung des Kanalmixes** und ein Direktkanal, der mindestens so gut funktioniert wie das Portal.

## Wo der Ansatz kippt

Revenue Management optimiert eine messbare Größe und ist blind für alles andere. Vier Grenzen, die in der Praxis regelmäßig überschritten werden:

- **Der Stammgast, der mehr zahlt als der Neukunde.** Er merkt es, und er merkt es genau einmal. Die Kennzahl zeigt einen Erfolg, das Verhältnis ist beschädigt.
- **Preissprünge, die der Gast nicht erklären kann.** Nachvollziehbare Saisonpreise werden akzeptiert; eine Verdreifachung wegen eines Konzerts erzeugt Empörung, die in den Bewertungen landet und dort bleibt.
- **Der Betrieb dahinter.** Eine Auslastungsspitze, die der Dienstplan nicht abbildet, kostet in Servicequalität und Krankenstand mehr, als der Zusatzerlös bringt. **Preissteuerung ohne Kapazitätssteuerung ist unvollständig.**
- **Die Kennzahl als Selbstzweck.** Wer auf RevPAR incentiviert, bekommt RevPAR — auch dann, wenn GOPPAR dabei sinkt.

Die nüchterne Zusammenfassung: Revenue Management ist ein Werkzeug zur Verteilung knapper Kapazität auf zahlungsbereite Nachfrage. Es erzeugt keine Nachfrage, und es ersetzt kein Konzept.

::: quiz
F: Eine Gruppe will 30 Zimmer Do–Sa zu 89 €. Der Samstag ist Messetag mit erwarteten 165 €. Wie rechnet man?
A: Je Anreisetag gegen die jeweilige Alternative. 8.010 € Gruppenerlös minus 4.950 € verdrängter Samstagserlös ergibt 3.060 € netto. Sinnvoll — aber ohne den Samstag wären es 5.340 €, also besser „ja, wenn".

F: Was ist ein Zaun, und warum ist ein Rabatt ohne Zaun keine Segmentierung?
A: Eine Bedingung, die verhindert, dass zahlungskräftige Gäste den günstigen Tarif nehmen — Vorausbuchungsfrist, Stornierbarkeit, Mindestaufenthalt, Vorauszahlung. Ohne sie ist es schlicht eine Preissenkung für alle.

F: Warum ist die späte Preissenkung zwei Wochen vor Anreise die teure Variante?
A: Sie erreicht nur noch das kurzfristige Segment, das ohnehin gebucht hätte, und beschädigt die Preiswahrnehmung. Dieselbe Korrektur acht Wochen früher, aus der Pickup-Kurve abgelesen, kostet einen Bruchteil.

F: Warum ist Preissteuerung ohne Kapazitätssteuerung unvollständig?
A: Eine Auslastungsspitze, die der Dienstplan nicht abbildet, kostet über Servicequalität und Krankenstand mehr, als der Zusatzerlös bringt. Der Erlös steht in einer Kennzahl, der Schaden in einer anderen.
:::
