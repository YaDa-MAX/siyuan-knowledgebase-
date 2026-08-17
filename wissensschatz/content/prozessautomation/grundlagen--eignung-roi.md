---
id: prozessauto-eignung
title: Automatisierbarkeit prüfen und den Nutzen rechnen
path: prozessautomation/grundlagen
level: 3
type: checkliste
source: ki
status: geprueft
updated: 2026-08-09
tags: [roi, priorisierung, bewertung, wirtschaftlichkeit]
prereqs: [prozessauto-analyse]
related: [prozessauto-werkzeugwahl, excel-was-waere-wenn, bwl-investition]
summary: Neun Merkmale, die einen Prozess automatisierbar machen — und eine ehrliche Wirtschaftlichkeitsrechnung inklusive Betriebsaufwand.
---

## Neun Eignungsmerkmale

Je mehr zutreffen, desto besser eignet sich ein Prozess:

1. **Regelbasiert** — Entscheidungen folgen benennbaren Regeln, nicht Erfahrung oder Verhandlung.
2. **Strukturierte Eingangsdaten** — Datei, Formular, Datenbank, API. Freitext-E-Mails und handschriftliche Zettel machen es erheblich schwerer (wenn auch mit Dokumenten-KI nicht mehr unmöglich).
3. **Hohe Häufigkeit** — täglich schlägt jährlich. Ein Vorgang, der zwölfmal im Jahr vorkommt, rechtfertigt selten Bau und Pflege.
4. **Stabil** — der Ablauf hat sich in zwei Jahren nicht wesentlich geändert und wird sich nicht bald ändern. Prozesse kurz vor einer Systemablösung nicht automatisieren.
5. **Wenige Ausnahmen** — die 80/20-Frage: Wenn 80 % der Fälle gleich laufen, automatisiert man diese und leitet den Rest an Menschen weiter. Ein Prozess mit 40 % Sonderfällen lohnt selten.
6. **Klare Zuständigkeit** — es gibt eine Person, die den Prozess fachlich verantwortet und Fragen entscheidet.
7. **Messbares Ergebnis** — man kann prüfen, ob das Ergebnis richtig ist.
8. **Geringe rechtliche Klemme** — keine Entscheidung mit erheblicher Rechtsfolge ohne menschliche Prüfung (siehe unten).
9. **Zugängliche Systeme** — es gibt eine Schnittstelle, einen Export oder wenigstens einen stabilen Bildschirmaufbau.

**Ausschlusskriterien:**
- Der Prozess ändert sich in den nächsten Monaten grundlegend.
- Niemand kann die Fachregeln vollständig benennen.
- Die Entscheidung erfordert Ermessen oder Verhandlung.
- Die Datenqualität am Eingang ist so schlecht, dass die Automatisierung überwiegend Fehler weitergibt.
- Vollautomatisierte Einzelentscheidungen mit rechtlicher Wirkung gegenüber Personen — Art. 22 DSGVO schränkt das ausdrücklich ein. Bei Bewerberauswahl, Leistungsbewertung, Kündigungsvorschlägen oder Bonitätsentscheidungen gehört immer ein Mensch in die Schleife.

## Die Wirtschaftlichkeitsrechnung

**Nutzen je Jahr:**
```
Zeitersparnis  = Vorgänge/Jahr × eingesparte Minuten/Vorgang / 60 × Stundensatz
Fehlerkosten   = Fehler/Jahr × Kosten je Fehler (Nacharbeit, Reklamation, Gutschrift)
Qualität       = schwer zu beziffern, aber benennbar: Durchlaufzeit, Termintreue, Zufriedenheit
```

**Kosten:**
```
Einmalig  = Analyse + Bau + Test + Dokumentation + Schulung
Laufend   = Lizenzen + Wartung + Anpassungen + Überwachung + Störungsbehebung
```

Der Posten, der am häufigsten fehlt, ist **laufend**. Eine Faustzahl aus der Praxis: **20–30 % des Bauaufwands pro Jahr** für Pflege. Schnittstellen ändern sich, Oberflächen werden umgebaut, Fachregeln entwickeln sich weiter. Eine Automatisierung ohne Pflegebudget ist eine Automatisierung mit Ablaufdatum.

**Amortisation** = Einmalkosten / (Jahresnutzen − laufende Kosten). Unter zwölf Monaten ist gut, über 24 Monate ist begründungspflichtig.

## Der ehrliche Blick auf die Zeitersparnis

Zwei Korrekturen, die den Business Case oft halbieren:

**Erstens** — eingesparte Minuten sind nicht automatisch eingesparte Kosten. Zehn Minuten täglich bei fünf Personen ergeben rechnerisch 0,1 Vollzeitstellen, aber niemand wird entlassen und niemand arbeitet zehn Minuten weniger. Der Nutzen ist real (die Zeit fließt in andere Arbeit, die Belastung sinkt, Fehler nehmen ab), aber er erscheint nicht als Kostensenkung im Ergebnis. **Das offen zu sagen ist besser, als eine Zahl zu präsentieren, die niemand wiederfindet.**

**Zweitens** — Automatisierung erzeugt neue Arbeit: Ausnahmen prüfen, Fehlermeldungen bearbeiten, Änderungen einpflegen. Rechne mit 10–20 % der eingesparten Zeit als neuem Aufwand.

## Priorisierung

Punktbewertung, um Bauchentscheidungen vergleichbar zu machen:

| Kriterium | Gewicht | 1 Punkt | 3 Punkte | 5 Punkte |
|---|---|---|---|---|
| Häufigkeit | 3 | monatlich | wöchentlich | täglich/stündlich |
| Zeitersparnis je Vorgang | 3 | < 2 min | 2–15 min | > 15 min |
| Regelklarheit | 3 | unklar | teils | vollständig |
| Datenqualität | 2 | schlecht | mittel | gut/strukturiert |
| Stabilität | 2 | Änderung absehbar | teils | stabil |
| Umsetzungsaufwand | 3 | hoch | mittel | gering |
| Risiko bei Fehler | 2 | hoch | mittel | gering |
| Sichtbarkeit für Beteiligte | 1 | gering | mittel | hoch |

Summe über alle Kandidaten bilden und absteigend abarbeiten. Der Wert der Tabelle liegt weniger im Ergebnis als im Gespräch, das beim Ausfüllen entsteht.

## Die Automatisierungsstufen

Automatisierung ist keine Ja/Nein-Frage. Vier Stufen, die sich unterschiedlich schnell erreichen lassen:

1. **Vereinfachen** — Schritte streichen, Felder reduzieren, Freigaben zusammenlegen. Kostet nichts und wirkt sofort.
2. **Unterstützen** — Vorlagen, Textbausteine, Prüfregeln, vorbefüllte Formulare, Nachschlagelisten.
3. **Teilautomatisieren** — der Ablauf läuft, aber der Mensch bestätigt an definierten Punkten. Der Regelfall bei allem, was Ermessen berührt.
4. **Vollautomatisieren** — läuft ohne Eingriff, Mensch nur bei Ausnahmen und in der Überwachung.

Stufe 1 und 2 sind fast immer unterschätzt. Wer in einem Bereich mit ihnen beginnt, erzeugt schnelle sichtbare Erfolge und lernt den Prozess gründlicher kennen als jede Analyse am Whiteboard.

::: quiz
F: Welcher Kostenposten fehlt in Business Cases für Automatisierung am häufigsten?
A: Der laufende Pflegeaufwand — als Faustzahl 20–30 % des Bauaufwands pro Jahr.

F: Warum ist eingesparte Zeit nicht dasselbe wie eingespartes Geld?
A: Weil verteilte Minuten selten zu weniger Personal führen. Der Nutzen ist real, erscheint aber nicht als Kostensenkung — das gehört offen benannt.

F: Welche Grenze setzt Art. 22 DSGVO?
A: Ausschließlich automatisierte Einzelentscheidungen mit rechtlicher oder erheblich beeinträchtigender Wirkung gegenüber Personen sind nur eingeschränkt zulässig — bei Personalentscheidungen gehört ein Mensch in die Schleife.
:::
