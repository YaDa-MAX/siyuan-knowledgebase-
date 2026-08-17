---
id: meta-fuettern
title: Das Archiv füttern
path: meta/pflege
level: 1
type: meta
source: ki
status: geprueft
updated: 2026-08-10
tags: [einspeisen, workflow, ki, nutzerinhalte]
prereqs: [meta-start]
related: [meta-pflegeroutine, meta-start, lernen-abrufen]
summary: Der Alltagsweg für neues Wissen — aus dem Kopf, aus Gesprächen, aus KI-Antworten. Und wie beides voneinander unterscheidbar bleibt.
---

## Der schnelle Weg

```bash
node tools/feed.mjs --titel "XVERWEIS mit zwei Kriterien" \
                    --pfad excel/formeln \
                    --level 3 \
                    --tags lookup,dynamische-arrays \
                    --quelle nutzer
```

Legt eine ausgefüllte Vorlage an, vergibt eine ID und baut den Index sofort neu. Danach nur noch den Text schreiben.

Eine Notiz direkt aus der Zwischenablage:
```bash
pbpaste | node tools/feed.mjs --titel "Notiz Schichtübergabe" --pfad meta/inbox --stdin
```

## Die Inbox

Nicht jeder Gedanke ist sofort ein fertiger Knoten. `meta/inbox` ist der Ort für Rohes: Notizen aus Gesprächen, Ausschnitte, halbe Gedanken, Fragen ohne Antwort.

Regel dafür: **Lieber unfertig erfassen als gar nicht.** Was in der Inbox liegt, hat `status: entwurf` und ein `> TODO:` — und taucht damit automatisch im Lücken-Backlog auf. Einmal im Monat wird die Inbox durchgegangen: ausformulieren, ins richtige Thema verschieben, oder löschen.

Ein Knoten, der drei Mal nicht ausformuliert wurde, wird gelöscht. Das ist keine Niederlage, sondern Pflege.

## Herkunft sauber trennen

Das Feld `source` unterscheidet drei Fälle, und diese Unterscheidung ist über Jahrzehnte wichtiger, als sie heute wirkt:

| Wert | Bedeutung |
|---|---|
| `ki` | von einem Sprachmodell erzeugt und redaktionell übernommen |
| `nutzer` | eigene Erfahrung, eigene Notizen, eigene Recherche |
| `gemischt` | KI-Entwurf, eigene Erfahrung eingearbeitet |

**Warum das zählt:** Eigene Erfahrung ist unersetzbar — sie steht nirgendwo sonst. KI-generierte Theorie ist jederzeit nachproduzierbar, kann aber Fehler enthalten, die plausibel klingen. Wer in fünf Jahren einen Widerspruch findet, muss wissen, welchem Teil er trauen kann.

Das Statusfeld ergänzt das: `entwurf` heißt ungeprüft, `geprueft` heißt an einer verlässlichen Quelle oder an der eigenen Praxis verifiziert, `veraltet` heißt überholt, aber aus historischen Gründen behalten.

## KI-Inhalte einarbeiten

Ein praktikabler Ablauf, wenn ein Sprachmodell einen Entwurf liefert:

1. **Erzeugen lassen** — mit der Bitte um Struktur nach dem Knotenschema dieses Archivs.
2. **Lesen und kürzen.** Das ist der eigentliche Arbeitsschritt. Rohe KI-Texte sind meist zu lang und zu allgemein.
3. **Prüfen, was prüfbar ist** — Zahlen, Paragrafen, Fristen, Versionsangaben. Was nicht verifiziert wurde, bekommt `status: entwurf` und ein `> TODO:`.
4. **Eigenes ergänzen** — was in der eigenen Praxis anders ist, welche Stolperfallen im eigenen Betrieb auftreten. Dann `source: gemischt`.
5. **Quizfragen schreiben** oder die vorgeschlagenen überarbeiten. Eine Frage, die man selbst formuliert hat, sitzt besser.

## Was einen guten Knoten ausmacht

- **Eine Sache je Knoten.** Wenn die Überschrift ein „und" braucht, sind es meist zwei.
- **Vom Kern zum Detail.** Der erste Absatz muss allein stehen können.
- **Konkret statt vollständig.** Ein durchgerechnetes Beispiel schlägt drei Absätze Definition.
- **Stolperfallen benennen.** Das ist der Teil, den man in einem Jahr wirklich sucht.
- **Voraussetzungen setzen.** Sie füttern die automatische Einstufung und bauen nebenbei den Lernpfad.
- **Ehrlich über Grenzen.** „Das habe ich nicht geprüft" ist eine wertvolle Information, kein Makel.

## Themen aus Gesprächen und aus KI-Sitzungen

Wissen entsteht oft im Gespräch — mit Kollegen, in Sitzungen, im Austausch mit einem Sprachmodell. Der Verlust passiert dabei immer an derselben Stelle: **Es wird nicht sofort festgehalten.**

Der Ablauf, der funktioniert:
1. Während oder direkt nach dem Gespräch die drei bis fünf Kernsätze in die Inbox — roh, ungeordnet, notfalls in Stichworten.
2. Beim nächsten Pflegedurchgang ausformulieren und einsortieren.

**Ein Hinweis in eigener Sache:** Ein Sprachmodell hat kein Gedächtnis über Sitzungen hinweg, sofern ihm nicht ausdrücklich ein Speicher zur Verfügung steht. Was in einer früheren Unterhaltung besprochen wurde, ist in einer neuen nicht automatisch vorhanden. Deshalb ist dieser Weg — Erkenntnisse aus Gesprächen aktiv in die Inbox schreiben — nicht eine Notlösung, sondern der einzige verlässliche. Das Archiv ist das Gedächtnis; das Modell ist nur ein Werkzeug, das beim Formulieren hilft.

Umgekehrt lässt sich ein bestehender Knoten jederzeit als Kontext in eine neue Unterhaltung geben — dann arbeitet das Modell auf dem Stand, den das Archiv hält.

::: quiz
F: Warum unterscheidet das Archiv zwischen `ki`, `nutzer` und `gemischt`?
A: Eigene Erfahrung ist unersetzbar und steht nirgends sonst; KI-Inhalte sind nachproduzierbar, können aber plausibel klingende Fehler enthalten. Bei einem Widerspruch in Jahren muss erkennbar sein, welchem Teil zu trauen ist.

F: Was passiert mit einem Inbox-Knoten, der dreimal nicht ausformuliert wurde?
A: Er wird gelöscht. Das ist Teil der Pflege, keine Niederlage.

F: Warum muss Wissen aus einem KI-Gespräch aktiv ins Archiv geschrieben werden?
A: Weil ein Sprachmodell über Sitzungen hinweg kein Gedächtnis hat. Das Archiv ist der Speicher, das Modell nur das Werkzeug.
:::
