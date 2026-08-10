---
id: prozessauto-analyse
title: Prozesse verstehen, bevor man sie automatisiert
path: prozessautomation/grundlagen
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [prozessanalyse, bpmn, lean, verschwendung]
prereqs: []
related: [prozessauto-eignung, prozessauto-werkzeugwahl, fuehrung-team]
summary: Ein automatisierter schlechter Prozess ist ein schneller schlechter Prozess. Aufnahme, Notation und die sieben Verschwendungsarten.
---

## Die Reihenfolge

```
verstehen → vereinfachen → standardisieren → automatisieren → überwachen
```

Diese Reihenfolge ist nicht verhandelbar. Die häufigste teure Fehlentscheidung in Automatisierungsprojekten ist, einen historisch gewachsenen Ablauf eins zu eins in ein Werkzeug zu übertragen — samt aller Schleifen, Doppelerfassungen und Sonderregeln, die sich niemand mehr erklären kann.

Oft zeigt sich beim Verstehen, dass **der Prozess ganz entfallen kann**. Der billigste automatisierte Schritt ist der, den man streicht.

## Prozess aufnehmen

**Nicht am Schreibtisch.** Prozesse werden dort aufgenommen, wo sie stattfinden — durch Zusehen und Fragen. Die Beschreibung im Handbuch und die gelebte Praxis unterscheiden sich fast immer, und die Abweichung ist die interessante Information: Sie zeigt, wo das Soll nicht funktioniert.

Fünf Fragen je Schritt:
1. **Was** passiert genau, mit welchem Ergebnis?
2. **Wer** macht es, und wer entscheidet?
3. **Womit** — welches System, welche Datei, welches Formular?
4. **Wie lange** dauert es, und wie lange **wartet** es davor?
5. **Warum** — was passiert, wenn man diesen Schritt weglässt?

Frage 5 ist die produktivste. Nicht selten lautet die ehrliche Antwort: „Weiß ich nicht, das war schon immer so."

Messen, was messbar ist: Durchlaufzeit (von Anstoß bis Ergebnis), Bearbeitungszeit (tatsächliche Arbeit), Häufigkeit, Fehlerquote, Nacharbeitsquote, Anzahl Beteiligter, Anzahl Systemwechsel.

Das Verhältnis von Bearbeitungs- zu Durchlaufzeit ist die aussagekräftigste Einzelzahl. Liegt es bei 2 % — 20 Minuten Arbeit in 3 Tagen Durchlauf —, ist Warten das Problem, nicht die Arbeitsgeschwindigkeit. Dann hilft keine schnellere Bearbeitung, sondern das Entfernen von Liege- und Genehmigungszeiten.

## Notation

**BPMN 2.0** ist der Standard und mit wenigen Symbolen bereits nützlich:

| Symbol | Bedeutung |
|---|---|
| Kreis dünn | Startereignis (was löst aus?) |
| Kreis dick | Endereignis |
| Rechteck mit runden Ecken | Aufgabe/Tätigkeit |
| Raute | Gateway (Verzweigung: exklusiv ×, parallel +, inklusiv ○) |
| Pfeil durchgezogen | Sequenzfluss |
| Pfeil gestrichelt | Nachrichtenfluss zwischen Beteiligten |
| Pool / Lane | Beteiligter / Rolle |

Der wichtigste Teil sind die **Lanes**: Jede Rolle bekommt eine Bahn, jede Aufgabe liegt in genau einer. Jeder Übergang zwischen Bahnen ist eine Übergabe — und Übergaben sind die Stellen, an denen Zeit und Information verloren gehen. Ein Diagramm mit acht Lane-Wechseln zeigt sein Problem ohne weitere Analyse.

Für den Anfang genügt oft eine **Wertstromskizze** auf Papier: Schritte in einer Reihe, darunter Bearbeitungs- und Wartezeit. Vollständige BPMN-Modellierung lohnt erst, wenn der Prozess wirklich in einer Engine laufen soll.

## Die sieben Verschwendungsarten im Büro

Aus dem Lean-Ansatz, übersetzt auf Verwaltungs- und Dienstleistungsprozesse:

| Art | Im Büro / Betrieb |
|---|---|
| **Überproduktion** | Berichte, die niemand liest; Daten „auf Vorrat" erfassen |
| **Bestände** | Volle Postfächer, Stapel unbearbeiteter Vorgänge, offene Tickets |
| **Transport** | Dokumente zwischen Systemen hin- und herkopieren |
| **Bewegung** | Suchen nach Dateien, Informationen, Zuständigkeiten |
| **Wartezeit** | Auf Freigaben, Rückmeldungen, Systemantworten |
| **Überbearbeitung** | Doppelte Prüfungen, dreifache Freigaben, Formatierarbeit |
| **Fehler / Nacharbeit** | Rückfragen wegen unvollständiger Angaben, Korrekturbuchungen |

Ergänzt um die achte: **ungenutztes Mitarbeiterpotenzial** — Fachkräfte, die Daten abtippen.

Für die Automatisierung ist die Zuordnung praktisch: **Transport, Bewegung und Wartezeit** lassen sich sehr gut automatisieren. **Überbearbeitung und Überproduktion** löst man durch Streichen, nicht durch Technik. **Fehler** löst man an der Quelle, meist durch bessere Eingabemasken und Pflichtfelder.

## Ist und Soll

Immer beides aufnehmen — und die Differenz benennen:

- **Ist**: wie es heute wirklich läuft, inklusive Umgehungslösungen.
- **Soll**: wie es nach Vereinfachung laufen soll, **bevor** Werkzeuge gewählt werden.
- **Delta**: Was ändert sich für wen? Genau daraus entsteht der Aufwand für Kommunikation, Schulung und Begleitung — der Teil, der in Projekten regelmäßig unterschätzt wird.

## Prozesse priorisieren

Nicht alles gleichzeitig. Bewertung in zwei Dimensionen:

- **Nutzen** = Häufigkeit × eingesparte Zeit je Vorgang × (Fehlerkosten + Qualitätsgewinn)
- **Aufwand** = Umsetzungsaufwand + Abstimmungsaufwand + laufende Betreuung

Daraus die klassische Vier-Felder-Matrix. Die erste Automatisierung in einer Organisation sollte **nicht** die größte sein, sondern die mit dem klarsten Nutzen und dem geringsten Risiko: sichtbarer Erfolg, wenig Schaden bei Fehlschlag, positive Erzählung für alles Weitere.

::: quiz
F: Warum ist das Verhältnis von Bearbeitungs- zu Durchlaufzeit die aussagekräftigste Kennzahl?
A: Ein niedriger Wert zeigt, dass der Vorgang überwiegend wartet. Dann liegt der Hebel bei Liege- und Genehmigungszeiten, nicht bei der Arbeitsgeschwindigkeit.

F: Welche Verschwendungsarten löst man besser durch Streichen als durch Automatisierung?
A: Überproduktion und Überbearbeitung — Berichte, die niemand liest, und mehrfache Freigaben werden durch Automatisierung nur schneller sinnlos.

F: Warum zeigen BPMN-Lanes die Schwachstellen eines Prozesses?
A: Jeder Wechsel zwischen Bahnen ist eine Übergabe. Übergaben sind die Stellen mit Warte-, Informations- und Verantwortungsverlust.
:::
