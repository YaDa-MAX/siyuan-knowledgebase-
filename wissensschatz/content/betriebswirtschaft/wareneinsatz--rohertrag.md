---
id: bwl-wareneinsatz
title: Wareneinsatz, Inventur und Schwund
path: betriebswirtschaft/wareneinsatz
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-11
tags: [wareneinsatz, inventur, schwund, rohertrag, einkauf]
prereqs: [bwl-einstieg]
related: [bwl-kalkulation, bwl-deckungsbeitrag, excel-pivot, prozessauto-einstieg]
summary: Der Unterschied zwischen Einkauf und Verbrauch, die Formel mit Bestandsveränderung — und warum eine Schwundquote fast immer Organisation misst und nicht Diebstahl.
---

## Einkauf ist nicht Verbrauch

Die häufigste Fehlrechnung der Branche in einem Satz: **Wer die Einkaufsrechnungen eines Monats durch den Umsatz teilt, misst nicht den Wareneinsatz.** Er misst, wann der Lieferant geliefert hat.

Die richtige Formel bezieht die Bestände ein:

```
Wareneinsatz = Anfangsbestand + Einkauf − Endbestand
```

Wer im Dezember das Lager für Silvester füllt, hat im Dezember einen hohen Einkauf und einen hohen Endbestand — der Wareneinsatz bleibt normal. Ohne Inventur sieht der Dezember katastrophal aus und der Januar hervorragend, obwohl sich nichts geändert hat.

**Wareneinsatzquote** = Wareneinsatz ÷ Nettoumsatz. Immer netto, immer getrennt nach Bereich.

## Warum Küche und Getränke getrennt gehören

Beide Bereiche haben strukturell verschiedene Quoten: Getränke liegen deutlich niedriger als Speisen. Eine gemeinsame Quote ist deshalb kein Mittelwert, sondern eine Funktion des Umsatzmixes.

Der praktische Effekt: Verschiebt sich der Mix zugunsten der Getränke — etwa durch eine gut laufende Bar —, sinkt die Gesamtquote, ohne dass in der Küche irgendetwas besser geworden wäre. Wer daraus auf gute Küchenarbeit schließt, zieht die falsche Konsequenz.

**Mindesttrennung:** Küche und Getränke. Sinnvolle Verfeinerung: Getränke nach alkoholfrei, Bier, Wein und Spirituosen — die Quoten unterscheiden sich dort erheblich, und Weinbestände binden das meiste Kapital.

## Inventur: wie oft und wie genau

| Rhythmus | Wofür geeignet |
|---|---|
| **Jährlich** | steuerliche Pflicht, betriebswirtschaftlich wertlos |
| **Monatlich** | Standard für Steuerung; Quoten werden monatlich belastbar |
| **Wöchentlich für Teilbereiche** | Bar und teure Warengruppen; findet Probleme, solange sie noch klein sind |

Zwei Regeln, an denen Inventuren scheitern:

- **Immer zum gleichen Zeitpunkt.** Ein Bestand nach dem Wochenende und einer vor der Lieferung sind nicht vergleichbar. Der Monatsletzte nach Geschäftsschluss, ohne Ausnahme.
- **Bewertung konsistent halten.** Einkaufspreis netto, ohne Skonto, ohne Transport — oder eben mit. Beides ist vertretbar, ein Wechsel mitten im Jahr macht die Zeitreihe unbrauchbar.

Angebrochene Gebinde sind der Punkt, an dem Genauigkeit teuer wird. Pragmatisch: Bei Spirituosen und Wein zählen, bei Grundnahrungsmitteln schätzen. Der Aufwand muss in einem Verhältnis zum gebundenen Wert stehen.

## Schwund: was die Zahl wirklich misst

**Schwund** ist die Differenz zwischen dem Verbrauch, den die Verkäufe erwarten lassen (Sollverbrauch aus den Rezepturen), und dem tatsächlichen Verbrauch aus der Inventur.

```
Schwundquote = (Istverbrauch − Sollverbrauch) / Sollverbrauch
```

Die reflexhafte Deutung ist Diebstahl. Nach Häufigkeit geordnet sind die Ursachen aber fast immer andere:

1. **Rezepturen stimmen nicht mehr.** Die Portion ist über Jahre gewachsen, die Kalkulation steht auf dem Stand von 2019. Größte Einzelursache.
2. **Portionierung ohne Maß.** Wer nach Augenmaß schöpft, streut um 20 % und mehr. Ein Portionierer kostet weniger als ein Prozentpunkt Wareneinsatz.
3. **Personalverpflegung nicht erfasst.** Sie ist eine reale Leistung an die Mitarbeitenden und gehört als solche gebucht, nicht in den Schwund.
4. **Bruch, Verderb, Retouren.** Muss dokumentiert werden, sonst ist sie nicht von Punkt 5 unterscheidbar.
5. **Freigetränke und Kulanz.** Gehört über die Kasse als Rabatt erfasst, nicht als Nicht-Buchung.
6. **Kassenfehler.** Falsche Artikel gebucht, Storno nicht dokumentiert.
7. **Diebstahl.** Existiert, ist aber die letzte Hypothese, nicht die erste.

**Die eigentliche Botschaft der Kennzahl:** Eine hohe Schwundquote ist zuerst ein Hinweis auf fehlende Erfassungswege — und erst danach auf Menschen. Wer bei Punkt 7 anfängt, beschädigt das Team und behebt das Problem nicht.

## Einkauf: die drei Hebel

Die Wareneinsatzquote lässt sich an drei Stellen bewegen, und sie sind unterschiedlich gesund:

| Hebel | Wirkung | Preis |
|---|---|---|
| **Einkaufskonditionen** | direkt und dauerhaft | Verhandlungsaufwand, Abhängigkeit von einem Lieferanten |
| **Rezeptur und Portion** | direkt | wird vom Gast bemerkt — der teuerste Hebel auf Dauer |
| **Verkaufsmix** | indirekt, oft der größte | verlangt Kenntnis der Deckungsbeiträge je Artikel |

Der dritte ist der unterschätzte: Eine Karte, die den Gast zu Gerichten mit hohem Deckungsbeitrag führt, verbessert das Ergebnis, ohne dass ein Einkaufspreis verhandelt oder eine Portion verkleinert wird. Das ist der Gegenstand des Menu Engineerings.

## Praktische Umsetzung in Excel

- **Eine Bewegungstabelle** je Zeile: Datum, Bereich, Warengruppe, Lieferant, Netto. Keine Monatsblätter — sie verhindern jede Auswertung.
- **Bestandsstichtage** als eigene Tabelle mit Datum, Bereich, Wert.
- **Pivot** über beide, mit einer Kennzahl „Wareneinsatz" als berechnetem Feld.
- **Rollierende zwölf Monate** statt Einzelmonaten, sonst dominiert die Saison jede Aussage.

Wer das nicht monatlich schafft, macht es quartalsweise. Eine Quote, die viermal im Jahr stimmt, ist mehr wert als eine, die monatlich geschätzt wird.

::: quiz
F: Warum ist „Einkaufsrechnungen des Monats ÷ Umsatz" keine Wareneinsatzquote?
A: Weil sie den Einkauf misst, nicht den Verbrauch. Ohne Bestandsveränderung (Anfangsbestand + Einkauf − Endbestand) verschiebt jede Lagerauffüllung die Quote in den falschen Monat.

F: Warum müssen Küche und Getränke getrennt ausgewertet werden?
A: Ihre Quoten liegen strukturell weit auseinander. Eine gemeinsame Quote ist deshalb eine Funktion des Umsatzmixes — sie sinkt schon, wenn die Bar besser läuft, ohne dass die Küche besser gearbeitet hat.

F: Die Schwundquote steigt. Was ist die letzte Hypothese, nicht die erste?
A: Diebstahl. Deutlich häufiger sind veraltete Rezepturen, unkontrollierte Portionierung, nicht erfasste Personalverpflegung, undokumentierter Bruch und Kassenfehler.

F: Welcher Hebel auf die Wareneinsatzquote ist der teuerste auf Dauer?
A: Rezeptur und Portionsgröße. Er wirkt sofort, wird aber vom Gast bemerkt und schlägt mit Verzögerung auf Frequenz und Bewertungen durch.
:::
