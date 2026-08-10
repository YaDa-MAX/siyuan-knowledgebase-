---
id: excel-fehlersuche
title: Fehlersuche und Formelüberwachung
path: excel/qualitaet
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [fehlersuche, audit, formelueberwachung]
prereqs: [excel-formelsprache]
related: [excel-modellbau, excel-datenvalidierung]
summary: Spur zum Vorgänger, Formelauswertung, F9 im Bearbeitungsmodus — die drei Werkzeuge, mit denen sich jede Formel zerlegen lässt.
---

## Die drei Werkzeuge

**1. Spur zum Vorgänger / Nachfolger** (Formeln ▸ Formelüberwachung). Zeigt Pfeile zu allen Zellen, von denen eine Formel abhängt bzw. die von ihr abhängen. Ein gestricheltes Pfeilsymbol mit Tabellensymbol bedeutet: Der Vorgänger liegt auf einem anderen Blatt oder in einer anderen Datei — Doppelklick auf den Pfeil springt hin.

**2. Formel auswerten** (`Formeln ▸ Formel auswerten`). Rechnet die Formel schrittweise durch und zeigt jedes Zwischenergebnis. Das ist der schnellste Weg zu der Frage „an welcher Stelle kippt es?".

**3. `F9` im Bearbeitungsmodus.** Formel per `F2` öffnen, einen Teilausdruck markieren, `F9` drücken: Der markierte Teil wird durch sein Ergebnis ersetzt. Danach `Esc` — **nicht Enter**, sonst ist der Teilausdruck dauerhaft durch eine Konstante ersetzt. Das ist das Werkzeug für Matrixausdrücke: Man sieht das komplette Array, mit dem gerechnet wird.

## Systematische Fehlerursachen

| Symptom | Wahrscheinliche Ursache |
|---|---|
| `#NV` bei Suche, obwohl der Wert sichtbar ist | Leerzeichen, geschütztes Leerzeichen, Text gegen Zahl |
| Summe stimmt nicht mit der Anzeige überein | gerundete Anzeige, aber ungerundete Werte |
| Zahl links ausgerichtet | Text statt Zahl |
| Formel zeigt sich selbst als Text | Zelle war als Text formatiert, bevor die Formel kam |
| Ergebnis ändert sich nicht | Berechnung steht auf Manuell |
| Werte ändern sich ohne Zutun | volatile Funktionen |
| Summe zählt gefilterte Zeilen mit | `SUMME` statt `TEILERGEBNIS`/`AGGREGAT` |
| Vergleich zweier gleicher Zahlen ergibt `FALSCH` | Gleitkomma-Restbeträge — mit `RUNDEN` vergleichen |

**Der Text-gegen-Zahl-Test:** `=ISTZAHL(A2)` und `=ISTZAHL(B2)` für Such- und Zielwert. Oder `=ANZAHL(A:A)` gegen `=ANZAHL2(A:A)` — die Differenz sind die Textzellen.

**Der Leerzeichen-Test:** `=LÄNGE(A2)` gegen `=LÄNGE(GLÄTTEN(A2))`. Ist die Differenz größer als erwartet, stecken geschützte Leerzeichen drin (`ZEICHEN(160)`), die `GLÄTTEN` nicht entfernt.

## Weitere Diagnosewerkzeuge

- **`Strg` + `#`** schaltet die Formelanzeige für das ganze Blatt um — der schnellste Überblick über hart eingetippte Zahlen zwischen Formeln.
- **Inhalte auswählen** (`F5` ▸ Inhalte): Formeln, Konstanten, Leerzellen, Zeilenunterschiede. „Konstanten" in einem Rechenbereich sind fast immer der Fund des Tages.
- **`Strg` + `[`** springt zu den Vorgängern der aktiven Zelle, `Strg` + `]` zu den Nachfolgern.
- **Überwachungsfenster** (Formeln ▸ Überwachungsfenster): zeigt ausgewählte Zellen dauerhaft an, auch beim Arbeiten auf anderen Blättern. Ideal für Kontrollsummen während eines Umbaus.
- **Fehlerüberprüfung** (Formeln ▸ Fehlerüberprüfung): findet inkonsistente Formeln, ausgelassene Zellen in Bezügen, Zahlen als Text.
- **Dokumentprüfung** (Datei ▸ Informationen ▸ Auf Probleme prüfen) findet ausgeblendete Blätter, externe Verknüpfungen und Metadaten vor der Weitergabe.
- **Arbeitsmappenstatistik** (Überprüfen ▸ Arbeitsmappenstatistik) zählt Formeln, Blätter und Objekte — nützlich zur Einschätzung eines fremden Modells.

## Zirkelbezüge

Excel meldet einen Zirkelbezug beim Entstehen und zeigt die betroffene Zelle in der Statusleiste. Später geöffnete Dateien melden nur noch „Zirkelbezüge" ohne Adresse — dann hilft *Formeln ▸ Fehlerüberprüfung ▸ Zirkelbezüge*, das die Liste anzeigt.

Iterative Berechnung (Optionen ▸ Formeln) macht Zirkelbezüge legal. Das ist in wenigen Fällen richtig (Zinseszins auf den eigenen Saldo, Umlagerechnungen zwischen Kostenstellen) und in allen anderen Fällen eine Fehlerquelle, die stillschweigend falsche Ergebnisse liefert. Wer sie einschaltet, dokumentiert das auf dem Infoblatt.

## Ein fremdes Modell prüfen

1. `Strg`+`Ende` — wie groß ist es wirklich?
2. Formelanzeige an, über alle Blätter scrollen — wo stehen Konstanten in Formeln?
3. Namensmanager öffnen — Fehler in Namen, Duplikate, blattweite Namen?
4. Datei ▸ Informationen ▸ Verknüpfungen bearbeiten — externe Abhängigkeiten?
5. Berechnungsmodus prüfen — steht er auf Manuell?
6. `F5` ▸ Inhalte ▸ Konstanten in den Rechenbereichen.
7. Stichprobe: drei Kennzahlen von Hand nachrechnen.

::: quiz
F: Du markierst in einer langen Formel einen Teilausdruck und drückst F9. Womit musst du danach unbedingt beenden?
A: Mit `Esc`. `Enter` würde den Teilausdruck dauerhaft durch seinen berechneten Wert ersetzen.

F: `LÄNGE(A2)` ist 7, `LÄNGE(GLÄTTEN(A2))` ist auch 7, trotzdem findet der SVERWEIS nichts. Was prüfst du als Nächstes?
A: Geschützte Leerzeichen `ZEICHEN(160)` (die GLÄTTEN nicht entfernt) und ob Such- und Zielwert unterschiedliche Datentypen haben (`ISTZAHL`).
:::
