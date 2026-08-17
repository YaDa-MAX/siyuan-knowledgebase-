---
id: bwl-investition
title: Investitionsrechnung — lohnt sich die Anschaffung?
path: betriebswirtschaft/steuerung
level: 5
type: theorie
source: ki
status: geprueft
updated: 2026-08-11
tags: [investition, kapitalwert, amortisation, leasing, abschreibung]
prereqs: [bwl-budget, bwl-deckungsbeitrag]
related: [excel-finanzmathematik, excel-was-waere-wenn, druck-entscheidung, prozessauto-eignung]
summary: Warum die Amortisationsdauer die beliebteste und schwächste Methode ist, wie der Kapitalwert rechnet, was Leasing wirklich kostet — und der Unterschied zwischen Auszahlung und Aufwand, an dem Liquiditätsplanungen scheitern.
---

## Die Frage hinter jeder Anschaffung

Eine Investition verlagert Geld von heute nach morgen. Die Beurteilung braucht deshalb drei Dinge, die alle unsicher sind: die **Höhe** der künftigen Rückflüsse, ihren **Zeitpunkt** und den **Maßstab**, mit dem man Geld zu verschiedenen Zeitpunkten vergleicht.

Alle Verfahren unterscheiden sich nur darin, wie ernst sie diese drei Punkte nehmen.

## Amortisationsdauer — beliebt und schwach

```
Amortisationsdauer = Investitionssumme / jährlicher Rückfluss
```

Eine Spülmaschine für 18.000 €, die jährlich 6.000 € an Personal- und Energiekosten spart, amortisiert sich in drei Jahren.

**Warum die Zahl so beliebt ist:** Sie ist in fünf Sekunden gerechnet, jeder versteht sie, und sie misst etwas real Empfundenes — Risiko. Je kürzer, desto weniger Zukunft muss man erraten.

**Warum sie als alleiniges Kriterium in die Irre führt:**

- Sie **ignoriert alles nach dem Amortisationszeitpunkt.** Eine Maschine, die sich in drei Jahren amortisiert und dann kaputtgeht, schneidet gleich ab wie eine, die danach zehn Jahre weiterspart.
- Sie **ignoriert den Zeitwert des Geldes.** 6.000 € im fünften Jahr werden wie 6.000 € heute behandelt.
- Sie **bevorzugt systematisch kurzfristige Investitionen** — und benachteiligt genau die, die einen Betrieb über zwanzig Jahre tragen: Gebäude, Küche, Haustechnik.

Als **Vorfilter** ist sie brauchbar: Was sich nicht innerhalb der Nutzungsdauer amortisiert, braucht keine weitere Rechnung.

## Kapitalwert — die saubere Methode

Alle Zahlungen werden auf den heutigen Zeitpunkt abgezinst und summiert:

```
Kapitalwert = −Investition + Σ  Rückfluss(t) / (1 + i)^t
```

Ist der Kapitalwert positiv, verdient die Investition mehr als der Kalkulationszins verlangt.

Dieselbe Spülmaschine, 18.000 €, 6.000 € jährlich, acht Jahre Nutzungsdauer, Kalkulationszins 7 %:

| Jahr | Rückfluss | Barwert |
|---|---|---|
| 1 | 6.000 | 5.607 |
| 2 | 6.000 | 5.240 |
| 3 | 6.000 | 4.897 |
| 4 | 6.000 | 4.577 |
| 5 | 6.000 | 4.277 |
| 6 | 6.000 | 3.997 |
| 7 | 6.000 | 3.735 |
| 8 | 6.000 | 3.491 |
| **Summe** | 48.000 | **35.821** |

Kapitalwert = 35.821 − 18.000 = **17.821 €**. Deutlich lohnend — und die Amortisationsrechnung hatte den größten Teil dieses Werts gar nicht gesehen.

In Excel: `=NBW(0,07; Rückflüsse) - Investition`. Wichtig — **NBW zinst bereits die erste Zahlung ab**, die Anfangsauszahlung gehört deshalb außerhalb der Funktion.

**Der Kalkulationszins ist die entscheidende und meistmissbrauchte Annahme.** Er ist nicht der Kreditzins, sondern der Anspruch: die Rendite, die man mit dem Geld alternativ erzielen würde, plus einen Risikozuschlag für dieses Vorhaben. Wer ihn zu niedrig ansetzt, rechnet sich jede Investition schön.

## Interner Zinsfuß und seine Tücke

Der interne Zinsfuß ist der Zins, bei dem der Kapitalwert genau null wird — die „Rendite" der Investition (`=IKV()`). Er ist angenehm kommunizierbar: „Diese Anschaffung bringt 23 %."

Zwei Fallen: Bei wechselnden Vorzeichen der Zahlungsreihe kann es mehrere Lösungen geben, und der interne Zinsfuß unterstellt, dass Rückflüsse zum selben hohen Satz wiederangelegt werden — was selten stimmt. **Bei Widerspruch zwischen Kapitalwert und internem Zinsfuß entscheidet der Kapitalwert.**

## Leasing, Miete oder Kauf

Der Vergleich wird fast immer falsch geführt, weil Leasingraten mit dem Kaufpreis verglichen werden. Richtig ist der Vergleich der **Barwerte aller Zahlungen** über dieselbe Laufzeit, einschließlich Restwert, Wartung und Rückgabebedingungen.

| | Spricht dafür | Spricht dagegen |
|---|---|---|
| **Kauf** | am Ende billigster Barwert; freie Verfügung; Restwert bleibt | bindet Liquidität; Ausfallrisiko; technische Veralterung |
| **Leasing** | schont Liquidität; planbare Rate; oft Wartung enthalten | teurer im Barwert; Bindung an Laufzeit; Rückgabestreit über Zustand |
| **Miete** | volle Flexibilität; kein Restwertrisiko | teuerste Variante bei Dauerbedarf |

**Die ehrliche Regel:** Leasing ist selten billiger. Es kauft Liquidität und Planbarkeit, und beides hat einen Preis. Für einen Betrieb mit knapper Liquidität kann dieser Preis richtig sein — die Entscheidung sollte nur bewusst so fallen und nicht als Rechenergebnis verkleidet werden.

## Auszahlung ist nicht Aufwand

Der Punkt, an dem Liquiditätsplanungen im Gastgewerbe regelmäßig scheitern:

- Die **Auszahlung** erfolgt bei Anschaffung — 18.000 € auf einmal.
- Der **Aufwand** verteilt sich über die Abschreibungsdauer — bei acht Jahren jährlich 2.250 €.

Die Gewinn- und Verlustrechnung zeigt den Aufwand, das Bankkonto die Auszahlung. Ein Betrieb kann deshalb Gewinn ausweisen und trotzdem zahlungsunfähig sein, wenn er investiert hat. Die umgekehrte Lage — hohe Liquidität bei Verlust — entsteht in Jahren mit hohen Abschreibungen und ohne Neuinvestition.

**Für die Praxis heißt das:** Neben die Investitionsrechnung gehört immer eine Liquiditätsvorschau. Sie ist im Saisonbetrieb die wichtigere von beiden — die Insolvenz kommt über die Zahlungsunfähigkeit, nicht über den Verlust.

## Was keine Rechnung erfasst

- **Instandhaltungsstau.** Nicht getätigte Investitionen erzeugen keine Zahlen, bis der Kühlraum ausfällt. Ein Investitionsplan über die Nutzungsdauern aller wesentlichen Anlagen ist die einzige Absicherung.
- **Qualitätswirkung.** Neue Betten und eine renovierte Lobby wirken über Bewertungen auf die durchsetzbare ADR — verzögert, schwer zurechenbar, aber real.
- **Der Zwang zur Investition.** Eine Auflage, eine Norm oder ein defektes Gerät machen die Rentabilitätsfrage gegenstandslos. Dann lautet die Frage nur noch, welche Variante den besten Barwert hat.

::: quiz
F: Warum ist die Amortisationsdauer als alleiniges Entscheidungskriterium ungeeignet?
A: Sie ignoriert alles nach dem Amortisationszeitpunkt und den Zeitwert des Geldes. Damit benachteiligt sie systematisch langlebige Investitionen — genau die, die einen Betrieb tragen.

F: Was ist der Kalkulationszins, und warum ist er nicht der Kreditzins?
A: Er ist der Anspruch an die Investition: die alternativ erzielbare Rendite plus Risikozuschlag. Wer den Kreditzins einsetzt, rechnet sich jede Investition schön.

F: Ein Betrieb weist Gewinn aus und kann trotzdem die Rechnungen nicht zahlen. Wie kommt das?
A: Auszahlung und Aufwand fallen auseinander. Die Investition wird sofort bezahlt, aber über die Nutzungsdauer abgeschrieben. Deshalb gehört neben jede Investitionsrechnung eine Liquiditätsvorschau.

F: Warum ist Leasing selten billiger als Kauf?
A: Im Barwertvergleich über dieselbe Laufzeit ist Kauf meist günstiger. Leasing kauft Liquidität und Planbarkeit — beides hat einen Preis, der bewusst akzeptiert werden sollte, statt als Rechenergebnis zu erscheinen.
:::
