---
id: hotelabr-storno
title: Storno, No-Show und Anzahlungen
path: hotelabrechnung/forderungen
level: 3
type: recht
source: ki
status: geprueft
updated: 2026-09-09
tags: [storno, noshow, anzahlung, umsatzsteuer, schadensersatz]
prereqs: [hotelabr-ledger]
related: [hotelabr-debitoren, hotelabr-monatsabschluss, bwl-revenue, arbeitsrecht-rechtsquellen]
summary: Der Unterschied zwischen Entgelt und Schadensersatz und warum er über die Umsatzsteuer entscheidet, die Behandlung von Anzahlungen — und was im PMS getrennt gebucht gehört.
---

> **Kein Steuer- oder Rechtsrat.** Die Abgrenzung zwischen steuerbarem Entgelt und nicht steuerbarem Schadensersatz wird im Einzelfall unterschiedlich beurteilt und hat sich mehrfach geändert. Die Buchungslogik unten ist so aufgebaut, dass beide Behandlungen abbildbar bleiben — welche gilt, klärt die Steuerberatung.

## Die Unterscheidung, an der alles hängt

Wenn ein Gast nicht kommt, kann das Haus Geld behalten oder fordern. Wofür — das ist die entscheidende Frage:

| | Entgelt für eine Leistung | Schadensersatz |
|---|---|---|
| **Grund** | das Haus hat etwas geleistet | das Haus hat einen Nachteil erlitten |
| **Umsatzsteuer** | fällt an | fällt nicht an (echter Schadensersatz) |
| **Beispiel** | Zimmer bereitgestellt und abgerechnet | Ausfall wegen kurzfristiger Absage |

**Der Fehler, der daraus entsteht, ist immer derselbe:** Alle Stornofälle laufen über einen einzigen Transaktionscode. Damit ist die Unterscheidung nicht mehr abbildbar — weder für die Steuer noch für die Auswertung. Und sie lässt sich später nicht nachholen, weil im Buchungssatz nichts mehr steht, woran man sie festmachen könnte.

**Die Konsequenz ist eine Stammdatenentscheidung, keine Einzelfallentscheidung:** getrennte Codes für Stornoentgelt und Stornoentschädigung, angelegt bevor der erste Fall kommt.

## Die drei Fälle

**Storno vor Anreise, innerhalb der Frist.** Kostenfrei. Die Reservierung wird storniert, eine Anzahlung zurückgezahlt. Keine Erlösbuchung. Steuerlich unproblematisch — was zurückgezahlt wird, korrigiert eine gegebenenfalls schon entstandene Steuer auf die Anzahlung.

**Storno nach Ablauf der Frist.** Die vereinbarte Gebühr wird berechnet oder mit der Anzahlung verrechnet. Ob sie Entgelt oder Entschädigung ist, hängt davon ab, was der Vertrag vorsieht und ob dem eine Leistung gegenübersteht.

**No-Show.** Der Gast erscheint nicht und sagt nicht ab. Das Zimmer wurde bereitgehalten. Die Behandlung ist umstritten — teilweise wird das Bereithalten als Leistung gesehen, teilweise der Ausfall als Schaden.

> TODO: Aktuellen Stand zur umsatzsteuerlichen Behandlung von Stornogebühren und No-Show-Entgelten in der Beherbergung mit Datum und Fundstelle ergänzen und jährlich mit der Steuerberatung prüfen.

## Was im Nachtlauf mit No-Shows geschieht

Der Lauf kennzeichnet erwartete Anreisen, die nicht erschienen sind. **Er entscheidet nicht, ob berechnet wird** — das ist eine kaufmännische Entscheidung, und sie muss aktiv fallen.

Zwei Wege, und beide sind vertretbar:

- **Berechnen.** Buchung auf den Storno-Code, Rechnung an Gast oder Firma, Übertrag ins City Ledger.
- **Verzichten.** Ebenfalls eine Entscheidung — bei Stammkunden, bei erkennbaren Missverständnissen, bei Kulanz.

**Nicht vertretbar ist die dritte Variante: keine Entscheidung.** Ein No-Show, der weder berechnet noch ausdrücklich erlassen wurde, ist ein Umsatz, den niemand verantwortet hat. Deshalb gehört in beide Fälle ein Vermerk, und deshalb steht der Punkt im täglichen Prüfkatalog.

## Anzahlungen

Eine Anzahlung ist Geld ohne Leistung. Sie steht als Verbindlichkeit im Deposit Ledger — und trotzdem entsteht die Umsatzsteuer bereits mit der **Vereinnahmung**, nicht erst mit der Übernachtung (§ 13 Abs. 1 Nr. 1 Buchst. a Satz 4 UStG).

Das ist die Stelle, an der es im Alltag schiefgeht: Im Deposit Ledger steht kein Erlös, also fühlt es sich an, als sei steuerlich noch nichts passiert. Ist es aber.

Der Lebenslauf einer Anzahlung:

```
Eingang        Deposit Ledger, Verbindlichkeit, Steuer entsteht
Anreise        Übertrag auf das Zimmerkonto, gleicht die Rechnung aus
Storno         Rückzahlung  → Steuerkorrektur
               Verrechnung  → wird zu Storno-Erlös oder -Entschädigung
               Verfall      → Erlös, aber erst wenn er tatsächlich verfallen ist
Nie angereist  bleibt stehen — der Fehler, der Jahre überdauert
```

**Der letzte Fall ist der praktisch wichtigste.** Eine Anzahlung, die nach Anreise oder Storno im Deposit Ledger stehen bleibt, ist eine Verbindlichkeit, die niemand mehr kennt. Sie taucht im Jahresabschluss auf, wenn die Vorgänge nicht mehr rekonstruierbar sind. Deshalb: **Deposits täglich gegen die Anreisen des Tages prüfen** — es ist ein Blick, und er verhindert einen Klärfall, der später Stunden kostet.

## Verfall und Verjährung

Eine nicht abgerufene Anzahlung verfällt nicht automatisch, weil das Haus sie gern behalten würde. Sie verfällt nach dem, was vereinbart wurde — und wenn nichts vereinbart wurde, besteht ein Rückzahlungsanspruch, der regelmäßigen Verjährungsfristen unterliegt.

**Praktisch heißt das:** Anzahlungen ohne zugehörigen Aufenthalt nicht stillschweigend ausbuchen. Entweder man findet den Vorgang und klärt ihn, oder man dokumentiert die Ausbuchung mit Grund und Datum. Das ist auch der Grund, warum diese Posten in den Prüfkatalog gehören: Je älter sie werden, desto teurer wird ihre Klärung.

## Was getrennt gebucht gehört

Die Mindestausstattung an Codes für diesen ganzen Bereich:

| Code | Wofür | Erlös? |
|---|---|---|
| Stornoentgelt | Gebühr mit Leistungsbezug | ja, mit Steuer |
| Stornoentschädigung | echter Schadensersatz | ja, ohne Steuer |
| No-Show-Berechnung | eigener Code, damit auswertbar | je nach Einordnung |
| Anzahlungseingang | Deposit Ledger | nein |
| Anzahlungsrückzahlung | Deposit Ledger | nein |
| Verfallene Anzahlung | Auflösung der Verbindlichkeit | ja |

Sechs Codes statt einem. Der Aufwand fällt einmal an, die Auswertbarkeit bleibt.

::: quiz
F: Warum entscheidet die Frage „Entgelt oder Schadensersatz" über die Umsatzsteuer?
A: Steht der Zahlung eine Leistung gegenüber, ist sie steuerbares Entgelt. Echter Schadensersatz — ein Ausgleich für einen Nachteil ohne Gegenleistung — ist nicht steuerbar.

F: Warum ist ein einziger Storno-Code die schlechteste Lösung?
A: Er macht die Unterscheidung zwischen Entgelt und Entschädigung unabbildbar, und sie lässt sich später nicht nachholen — im Buchungssatz steht nichts mehr, woran man sie festmachen könnte.

F: Wann entsteht die Umsatzsteuer auf eine Anzahlung?
A: Mit der Vereinnahmung des Geldes, nicht mit der Leistung. Weil im Deposit Ledger kein Erlös steht, fühlt es sich an, als sei noch nichts passiert — das ist der Irrtum.

F: Ein No-Show wird weder berechnet noch ausdrücklich erlassen. Warum ist das die schlechteste der drei Möglichkeiten?
A: Beide anderen sind Entscheidungen und vertretbar. Keine Entscheidung ist ein Umsatz, den niemand verantwortet hat — deshalb gehört in beide Fälle ein Vermerk.

F: Eine Anzahlung steht ohne zugehörigen Aufenthalt im Deposit Ledger. Ausbuchen?
A: Nicht stillschweigend. Sie verfällt nach dem, was vereinbart wurde; ohne Vereinbarung besteht ein Rückzahlungsanspruch. Entweder den Vorgang klären oder die Ausbuchung mit Grund und Datum dokumentieren.
:::
