---
id: bwl-kalkulation
title: Preiskalkulation für Speisen und Getränke
path: betriebswirtschaft/kalkulation
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-11
tags: [kalkulation, aufschlag, rezeptur, verkaufspreis, psychologie]
prereqs: [bwl-wareneinsatz]
related: [bwl-deckungsbeitrag, bwl-menu-engineering, excel-was-waere-wenn, excel-vorlagen]
summary: Die Aufschlagkalkulation und ihre eingebaute Schwäche, die Rückwärtsrechnung vom Marktpreis, der Weg von der Rezeptur zum Portionspreis — und warum der Faktor nie auf den Bruttopreis angewandt wird.
---

## Der Aufschlagfaktor

Die Standardrechnung der Branche:

```
Verkaufspreis netto = Wareneinsatz je Portion × Faktor
Faktor = 1 / Zielwareneinsatzquote
```

Bei einer Zielquote von 30 % ist der Faktor 3,33; bei 25 % genau 4. Ein Gericht mit 3,20 € Wareneinsatz kostet demnach 10,67 € netto, brutto entsprechend mehr.

**Drei Fehler, die dabei regelmäßig passieren:**

1. **Der Faktor wird auf den Bruttowareneinsatz angewandt.** Der Einkauf ist netto zu rechnen; die Vorsteuer bekommt der Betrieb zurück.
2. **Der errechnete Preis wird als Bruttopreis auf die Karte geschrieben.** Dann fehlt die Umsatzsteuer im Erlös, und die Quote ist um den Steuersatz schlechter als geplant.
3. **Nebenkosten fehlen.** Beilagen, Garnitur, Gewürze, Öl, Serviette — je Gericht Cent-Beträge, in Summe ein Prozentpunkt Quote oder mehr. Entweder einzeln erfassen oder pauschal aufschlagen, aber nicht ignorieren.

## Die eingebaute Schwäche

Die Aufschlagkalkulation behandelt jedes Gericht gleich — und das ist ökonomisch falsch.

Ein Beispiel mit demselben Zielfaktor 3,33:

| Gericht | Wareneinsatz | Preis netto | Deckungsbeitrag |
|---|---|---|---|
| Rindersteak | 9,00 € | 30,00 € | 21,00 € |
| Pasta | 2,00 € | 6,67 € | 4,67 € |

Beide haben exakt 30 % Wareneinsatzquote. Verkauft man 100 Pasta statt 100 Steaks, fehlen über 16.000 € Deckungsbeitrag — bei identischer, scheinbar perfekter Quote.

**Der Schluss daraus:** Die Wareneinsatzquote ist eine Kontrollgröße, kein Steuerungsziel. Gesteuert wird über den **Deckungsbeitrag in Euro je Gericht** — und über die Frage, welches Gericht wie oft verkauft wird.

Umgekehrt gilt: Bei teuren Waren ist der starre Faktor oft nicht durchsetzbar. Ein Steak für 30 € verkauft sich, ein Steak für 40 € nicht — und der Deckungsbeitrag von 21 € ist immer noch mehr als jede Pasta einbringt. **Bei hohem Wareneinsatz mit einem niedrigeren Faktor rechnen** ist keine Nachlässigkeit, sondern richtig.

## Rückwärts rechnen

In der Praxis ist der Preis oft vorgegeben — vom Wettbewerb, von der Preisschwelle, von der Erwartung des Gastes. Dann läuft die Rechnung andersherum:

```
zulässiger Wareneinsatz = Verkaufspreis netto × Zielwareneinsatzquote
```

Soll ein Mittagsgericht 12,90 € brutto kosten und die Zielquote 30 % betragen, ergibt sich bei 19 % Umsatzsteuer ein Nettopreis von 10,84 € und ein Wareneinsatzrahmen von 3,25 €. **Danach** wird das Gericht entworfen — nicht umgekehrt.

Diese Richtung ist die ehrlichere: Sie zwingt zur Entscheidung, bevor Arbeit in eine Rezeptur gesteckt wird, die sich nie rechnen wird.

## Von der Rezeptur zum Portionspreis

Die Rechnung, die in jeder Kalkulationsvorlage steckt:

```
Einkaufspreis je Einheit (netto)
÷ verwertbarer Anteil          → Preis je verwertbarer Einheit
× Einsatzmenge je Portion      → Wareneinsatz je Portion
+ Nebenkomponenten
= Wareneinsatz gesamt
```

Der **verwertbare Anteil** ist die Stelle, an der die meisten Kalkulationen falsch liegen. Ein Kilogramm Rinderfilet im Einkauf ergibt nach Parieren deutlich weniger verkaufsfähiges Fleisch; Gemüse verliert beim Putzen, Fisch beim Filetieren, Bratenfleisch beim Garen. Wer mit dem Einkaufsgewicht rechnet, unterschätzt den Wareneinsatz systematisch — und zwar bei genau den teuren Produkten am stärksten.

**Praktische Konsequenz:** Die Ausbeute einmal messen, nicht schätzen. Einmal wiegen vor und nach dem Zuschnitt, Faktor notieren, in die Vorlage eintragen. Das ist eine Viertelstunde je Produkt und die zuverlässigste Wareneinsatzverbesserung überhaupt.

## Getränke

Getränke werden meist über den **Ausschankverlust** gerechnet: Aus einer 0,7-l-Flasche Spirituose lassen sich nicht 35 Portionen à 2 cl gewinnen, sondern etwas weniger. Ein Abschlag von rund 5 % ist üblich; bei Bier vom Fass liegt der Verlust durch Schaum und Anschluss deutlich höher.

Bei Wein kommt ein zweiter Effekt hinzu: Der offene Ausschank rechnet sich nur, wenn die Flasche in vertretbarer Zeit leer wird. Eine geöffnete Flasche, die nach drei Tagen weggeschüttet wird, hat den Deckungsbeitrag der verkauften Gläser aufgezehrt.

## Preispsychologie — kurz und ohne Aberglauben

Ein paar Effekte sind gut belegt und im Gastgewerbe unmittelbar anwendbar:

- **Ankerwirkung.** Ein teures Gericht am Anfang der Karte lässt die folgenden günstiger erscheinen und hebt den Durchschnittsbon. Es muss sich nicht gut verkaufen, um zu wirken.
- **Kompromisseffekt.** Bei drei Optionen wählt die Mehrheit die mittlere. Wer nur zwei Weine offen anbietet, verzichtet auf diese Steuerung.
- **Kein Währungszeichen und keine Nachkommanullen.** „24" wird als weniger schmerzhaft wahrgenommen als „24,00 €". Der Effekt ist klein, aber messbar.
- **Preisspalten vermeiden.** Eine rechtsbündige Preisspalte lädt zum Vergleichen nach Preis ein statt nach Lust. Preis direkt hinter die Beschreibung setzen.
- **Runde Preise bei gehobenem Anspruch, gebrochene bei Preisorientierung.** „19" signalisiert Qualität, „18,90" signalisiert Angebot. Beides ist richtig — an der jeweils passenden Stelle.

Wichtige Einschränkung: Diese Effekte verschieben Anteile um wenige Prozent. Sie ersetzen keine Kalkulation, und sie halten keinen Betrieb über Wasser, dessen Grundrechnung nicht stimmt.

## Preiserhöhungen

- **Nicht alles gleichzeitig und nicht überall gleich.** Eine gleichmäßige Erhöhung um 5 % ist am leichtesten zu bemerken. Gezielt bei Artikeln mit niedrigem Deckungsbeitrag und geringer Preissensibilität anheben.
- **Preisanker im Kopf des Gastes kennen.** Bei Kaffee, Bier und dem meistverkauften Gericht ist die Erinnerung präzise; bei allem anderen ungenau.
- **Nicht auf einen Schlag nachholen.** Wer drei Jahre nichts geändert hat und dann 12 % aufschlägt, erzeugt genau die Reaktion, die er vermeiden wollte. Kleinere Schritte in kürzeren Abständen sind unauffälliger und betriebswirtschaftlich besser.
- **Die Karte gleichzeitig überarbeiten.** Eine neue Karte mit neuen Preisen wird anders wahrgenommen als dieselbe Karte mit geänderten Zahlen.

::: quiz
F: Zwei Gerichte haben beide 30 % Wareneinsatzquote — Steak für 30 € netto und Pasta für 6,67 € netto. Warum ist das nicht gleichwertig?
A: Der Deckungsbeitrag ist völlig verschieden: 21 € gegen 4,67 € je Portion. Die Quote ist eine Kontrollgröße; gesteuert wird über den Deckungsbeitrag in Euro und den Verkaufsmix.

F: Ein Mittagsgericht soll 12,90 € brutto kosten, Zielwareneinsatz 30 %, Umsatzsteuer 19 %. Wie viel darf die Ware kosten?
A: 12,90 ÷ 1,19 = 10,84 € netto; davon 30 % ergibt einen Wareneinsatzrahmen von rund 3,25 €. Danach wird das Gericht entworfen, nicht umgekehrt.

F: Was ist der verwertbare Anteil, und warum ist er die häufigste Fehlerquelle?
A: Der Anteil der Einkaufsmenge, der nach Parieren, Putzen oder Garen tatsächlich verkauft wird. Wer mit dem Einkaufsgewicht rechnet, unterschätzt den Wareneinsatz — bei teuren Produkten am stärksten.

F: Warum ist eine gleichmäßige Preiserhöhung über die ganze Karte die schlechteste Variante?
A: Sie fällt am ehesten auf. Besser sind gezielte Anhebungen bei Artikeln mit niedrigem Deckungsbeitrag und geringer Preissensibilität — die Preisanker der Gäste sitzen nur bei wenigen Artikeln präzise.
:::
