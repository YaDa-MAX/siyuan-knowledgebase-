---
id: bwl-menu-engineering
title: Menu Engineering — die Karte als Steuerungsinstrument
path: betriebswirtschaft/kalkulation
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-11
tags: [menuengineering, karte, deckungsbeitrag, sortiment, analyse]
prereqs: [bwl-deckungsbeitrag]
related: [bwl-kalkulation, bwl-wareneinsatz, excel-pivot, excel-diagramme]
summary: Popularität gegen Deckungsbeitrag, die vier Felder und die jeweils richtige Maßnahme — die wirksamste Ergebnisverbesserung, für die weder ein Preis verhandelt noch eine Portion verkleinert wird.
---

## Die Idee

Die Karte ist kein Verzeichnis, sondern eine Steuerung. Jedes Gericht darauf hat zwei Eigenschaften, die unabhängig voneinander sind:

- **Popularität** — wie oft wird es verkauft, gemessen am Anteil an den Verkäufen seiner Kategorie
- **Deckungsbeitrag** — wie viel Euro bleibt je Portion nach Wareneinsatz

Kreuzt man beide, entstehen vier Felder mit vier völlig verschiedenen Maßnahmen. Das Verfahren geht auf Kasavana und Smith (1982) zurück und ist seither Standard.

**Der Reiz des Ansatzes:** Er verbessert das Ergebnis, ohne dass ein Einkaufspreis verhandelt, eine Portion verkleinert oder ein Preis erhöht wird. Er verschiebt nur, was der Gast wählt.

## Die Auswertung

Zwei Schwellen legen die Felder fest:

- **Deckungsbeitrag:** über oder unter dem gewichteten Durchschnitt aller Gerichte der Kategorie.
- **Popularität:** Die übliche Konvention setzt die Schwelle bei **70 % des Gleichverteilungsanteils**. Bei zehn Gerichten wäre die Gleichverteilung 10 %, die Schwelle also 7 %.

Die 70-Prozent-Regel ist keine Naturkonstante, sondern ein Erfahrungswert: Bei strengeren Schwellen landen zu viele Gerichte im schlechtesten Feld, und die Analyse verliert ihre Schärfe.

**Immer innerhalb einer Kategorie auswerten.** Vorspeisen gegen Hauptgerichte zu stellen vergleicht nichts. Getrennte Auswertungen für Vorspeisen, Hauptgänge, Desserts, Getränke.

::: viz menu-engineering
:::

## Die vier Felder und was zu tun ist

**Stars — beliebt und ertragreich.**
Nicht anfassen. Die Versuchung, den Preis zu erhöhen, ist groß und gefährlich: Diese Gerichte sind der Grund, warum Gäste wiederkommen. Sichtbar platzieren, Qualität konstant halten, Verfügbarkeit sichern. Wenn überhaupt eine Preisanpassung, dann klein und beobachtet.

**Renner — beliebt, aber mit geringem Deckungsbeitrag** (im Original *Plowhorses*).
Das häufigste und lohnendste Feld. Sie bringen Gäste ins Haus, tragen aber wenig. Reihenfolge der Maßnahmen:

1. **Wareneinsatz senken**, ohne dass es auffällt — bessere Kondition, andere Beilage, geringerer Verschnitt.
2. **Preis behutsam erhöhen.** Hier sitzt der Preisanker der Gäste am festesten; eine sichtbare Erhöhung fällt genau hier auf.
3. **Weniger prominent platzieren** und ein Puzzle daneben setzen.
4. **Nicht streichen.** Ein Renner ist oft der Anlass des Besuchs; sein Wegfall kostet den ganzen Tisch.

**Puzzles — ertragreich, aber unbeliebt.**
Hier liegt der schnellste Gewinn, denn die Kalkulation stimmt bereits. Warum verkauft es sich nicht?

- **Beschreibung.** Ein Gericht ohne appetitliche Beschreibung wird übersehen. Herkunft, Zubereitung, ein sinnliches Detail — messbar wirksam.
- **Platzierung.** Der Blick wandert nicht gleichmäßig über die Karte. Der erste und der letzte Eintrag einer Rubrik werden am häufigsten gewählt, ebenso hervorgehobene Kästen.
- **Empfehlung durch den Service.** Der wirksamste Hebel überhaupt — und der einzige, der nichts kostet.
- **Preisschwelle.** Manchmal steht ein Puzzle nur wenige Cent über einer psychologischen Grenze.

Wenn nach drei Monaten keine dieser Maßnahmen wirkt: streichen. Ein ertragreiches Gericht, das niemand bestellt, bindet trotzdem Ware, Platz im Kühlhaus und Aufmerksamkeit.

**Dogs — unbeliebt und ertragsschwach.**
Streichen, sofern es keinen anderen Grund gibt. Die legitimen anderen Gründe:

- **Pflichtangebot** — ein vegetarisches, ein veganes, ein Kindergericht. Wer sie streicht, verliert Tische, nicht Gedecke.
- **Ankerfunktion** — das teuerste Gericht darf sich schlecht verkaufen; es macht die anderen günstiger.
- **Zutatenverwertung** — es verwertet, was ohnehin da ist.

Jedes Dog ohne solchen Grund kostet Einkauf, Lagerplatz, Schulung und Karteplatz.

## Die Rechnung in Excel

Aus den Kassendaten je Artikel und Zeitraum:

| Spalte | Berechnung |
|---|---|
| Menge | aus der Kasse |
| Anteil | Menge ÷ Summe der Kategorie |
| Verkaufspreis netto | Bruttopreis ÷ (1 + Steuersatz) |
| Wareneinsatz je Portion | aus der Rezepturkalkulation |
| DB je Portion | Preis netto − Wareneinsatz |
| DB gesamt | DB je Portion × Menge |
| Ø DB der Kategorie | Summe DB gesamt ÷ Summe Menge (**gewichtet**, nicht Mittelwert der Einzel-DB) |
| Feld | `=WENN(DB>ØDB; WENN(Anteil>Schwelle;"Star";"Puzzle"); WENN(Anteil>Schwelle;"Renner";"Dog"))` |

Zwei Fallen: Der **gewichtete** Durchschnitt ist Pflicht — ein Mittelwert über die Einzelgerichte gibt einem Gericht, das dreimal verkauft wurde, dasselbe Gewicht wie einem mit 300 Verkäufen. Und der Zeitraum muss lang genug sein: unter etwa 300 Verkäufen je Kategorie ist die Popularitätsachse Zufall.

## Auswertungsrhythmus und Grenzen

**Zwei- bis viermal im Jahr**, jeweils zum Kartenwechsel. Häufiger erzeugt Aktionismus, seltener verpasst Verschiebungen.

Was das Verfahren nicht sieht:

- **Zubereitungsaufwand.** Ein Gericht mit hohem Deckungsbeitrag, das die Küche in der Spitze blockiert, kann teurer sein als eines mit weniger Deckungsbeitrag und drei Handgriffen. Wer das berücksichtigen will, rechnet den Deckungsbeitrag je Küchenminute.
- **Verbundwirkung.** Ein Gericht, zu dem regelmäßig eine Flasche Wein bestellt wird, trägt mehr bei als seine eigene Zeile zeigt.
- **Der Anlass des Besuchs.** Manche Gerichte sind der Grund, warum jemand kommt — und bringen vier weitere Gedecke mit.

Deshalb: Menu Engineering liefert die Fragen, nicht die Antworten. Die vier Felder sagen, wo hinzusehen ist; entschieden wird mit Kenntnis des Betriebs.

::: quiz
F: Ein Gericht verkauft sich hervorragend, trägt aber wenig zum Deckungsbeitrag bei. Welches Feld, und was ist die falsche Reaktion?
A: Ein Renner (Plowhorse). Falsch wäre, es zu streichen — es ist oft der Anlass des Besuchs. Richtig ist zuerst, den Wareneinsatz unauffällig zu senken; eine Preiserhöhung fällt ausgerechnet hier am ehesten auf.

F: Warum muss der Durchschnitts-Deckungsbeitrag gewichtet gerechnet werden?
A: Sonst zählt ein dreimal verkauftes Gericht so viel wie eines mit 300 Verkäufen. Der gewichtete Durchschnitt ist Summe DB gesamt ÷ Summe Menge.

F: Wo liegt üblicherweise die Popularitätsschwelle, und warum nicht beim Gleichverteilungsanteil?
A: Bei 70 % des Gleichverteilungsanteils — bei zehn Gerichten also 7 % statt 10 %. Bei strengerer Schwelle landen zu viele Gerichte im schlechtesten Feld und die Analyse verliert ihre Trennschärfe.

F: Nenne zwei legitime Gründe, ein Dog auf der Karte zu lassen.
A: Es ist ein Pflichtangebot (vegetarisch, vegan, Kinder) und hält damit ganze Tische; oder es wirkt als Preisanker. Auch die Verwertung ohnehin vorhandener Zutaten zählt.
:::
