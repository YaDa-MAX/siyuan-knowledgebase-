---
id: meta-kuratierung
title: Einspeisen und Kuratieren — wie neues Wissen an seinen Platz kommt
path: meta/pflege
level: 3
type: rezept
source: ki
status: geprueft
updated: 2026-08-20
tags: [einspeisen, kurator, agent, duplikate, aehnlichkeit]
prereqs: [meta-fuettern]
related: [meta-wissensarchitektur, meta-neues-thema, meta-pflegeroutine, lernen-lesen]
summary: Die Arbeitsteilung zwischen Maschine und Agent, wie der Kurator rechnet, woran seine Schwellen kalibriert sind — und warum das Platzieren offline funktionieren muss.
---

## Die Arbeitsteilung

> **Die Maschine platziert. Der Agent formuliert.**

Diese Trennung ist keine Bequemlichkeit, sondern die Bedingung dafür, dass das Archiv seine eigene Zusage einhält.

| | Maschine (`web/kurator.js`) | Agent (Sprachmodell) |
|---|---|---|
| **Leistet** | Thema, Pfad, Stufe, Typ, Tags, Voraussetzungen, Querverweise, Duplikatprüfung | Fließtext, Zusammenfassung, Gliederung, Prüffragen, fachliche Einordnung |
| **Braucht** | nichts — läuft offline im Browser | Netzverbindung und einen Dienst |
| **Fällt aus, wenn** | nie | der Dienst verschwindet, sich ändert, kostet |

Ein Archiv, das für vierzig Jahre gedacht ist, darf seinen Aufnahmeweg nicht an einen Dienst hängen, den es in fünf Jahren vielleicht nicht mehr gibt. Deshalb funktioniert die Aufnahme vollständig ohne Agent — man bekommt dann einen Entwurfsknoten mit `> TODO:` statt eines ausformulierten. **Der Agent ist Komfort, kein Fundament.**

## Der Weg in vier Schritten

**1 — Eintippen.** In der App unter *Einspeisen*, oder über die Kommandozeile. Ganze Sätze, kein Stichwortzettel: Was hier steht, muss in fünf Jahren ohne die Erinnerung an heute verständlich sein.

**2 — Einordnen.** Passiert beim Tippen. Der Kurator vergleicht den Text mit jedem vorhandenen Knoten und schlägt Thema, Pfad, Stufe, Tags und Anknüpfungspunkte vor — und meldet, wenn es das schon gibt.

**3 — Ausformulieren.** Der Knopf *Agentenauftrag kopieren* erzeugt einen vollständigen Auftrag: Rohnotiz, berechnete Einordnung, mögliche Überschneidungen, Hausregeln und der nächste Schritt. Er ist so gebaut, dass ein Sprachmodell daraus einen Knoten machen kann, **ohne das Archiv erst durchsuchen zu müssen**.

**4 — Ablegen.** Als Datei unter `content/`, dann `node tools/build.mjs && node tools/test.mjs`.

**Schritt 4 kann der Browser nicht übernehmen** — eine Webseite darf nicht ins Dateisystem schreiben. Deshalb bietet die Oberfläche *Als Knoten speichern* (Download) und *Knoten kopieren* an. Was in der Sammlung liegt, ist noch nicht im Archiv.

## Wie der Kurator rechnet

Für jeden Knoten und für den neuen Text wird derselbe Merkmalsvektor gebildet — aus Tags (Gewicht 3), Titel (2) und Fließtext (1), die Worthäufigkeit mit der Wurzel gedämpft, damit lange Knoten nicht jeden Vergleich gewinnen. Gewichtet wird mit **IDF** über den ganzen Bestand: Ein gemeinsamer *seltener* Begriff zählt mehr als ein gemeinsamer allgegenwärtiger. Verglichen wird über den **Kosinus**.

Daraus folgt alles Weitere:

- **Thema** — gewichtete Abstimmung der zehn ähnlichsten Knoten.
- **Pfad** — häufigster Pfad unter den ähnlichsten Knoten des gewählten Themas.
- **Stufe** — gewichtetes Mittel ihrer deklarierten Stufen.
- **Tags** — Tags der Nachbarn, die auch im Text vorkommen, plus seltene Begriffe des Textes, die mindestens zweimal auftauchen.
- **Voraussetzungen** — ähnliche Knoten desselben Themas mit niedrigerer Stufe.
- **Querverweise** — die ähnlichsten Knoten über alle Themen hinweg.

## Die Schwellen und woran sie gemessen sind

Gemessen an 137 Knoten und 9.316 Knotenpaaren:

| Fall | Ähnlichkeit |
|---|---|
| zwei beliebige Knoten des Bestands | Median 0,017 · 99 % unter 0,118 · Maximum 0,340 |
| Knotentext gegen sich selbst | 0,89 – 0,92 |
| **kurze Paraphrase gegen ihr Original** | **0,146 – 0,264** |
| neue, verwandte Notiz gegen den nächsten Knoten | 0,09 – 0,15 |
| fachfremde Notiz gegen den nächsten Knoten | 0,05 |

Daraus die Schwellen: **ab 0,20** eine deutliche Überschneidungsmeldung (oberhalb von 99,9 % aller echten Paare), **ab 0,10** ein Hinweis zum Nachsehen, **unter 0,065** die Ansage, dass es zu diesem Text im Bestand nichts gibt.

**Die erste Fassung stand bei 0,42** — und hätte nie ausgelöst, weil das ähnlichste echte Knotenpaar 0,34 erreicht. Derselbe Fehler wie damals bei der Neugruppierung: ein Mechanismus, der stillschweigend nichts tut. Deshalb prüft `node tools/test-kurator.mjs` jetzt gegen den echten Bestand — Paraphrasen **müssen** gemeldet werden, fachfremder Text **darf nicht** zuversichtlich einsortiert werden.

## Was der Kurator ausdrücklich nicht kann

- **Er kann nicht entscheiden, ob etwas ein Duplikat ist.** Paraphrase eines vorhandenen Knotens (0,15–0,26) und neue verwandte Notiz (0,09–0,15) überlappen sich in ihrer Ähnlichkeit. Eine Schwelle kann sie nicht trennen. Deshalb *meldet* er die nächsten Nachbarn mit ihrer Zahl und überlässt das Urteil dem Menschen oder dem Agenten.
- **Er versteht den Text nicht.** Er zählt Wörter und gewichtet sie. Ein Text über Belichtung im Sinne der Fotografie und einer über Belichtung im Sinne des Drucks sehen für ihn ähnlich aus.
- **Er rät `type: referenz` nie.** Dieser Typ nimmt einen Knoten von der Stufennormalisierung aus; geraten würde er still die Lernpyramide des ganzen Themas verzerren. Er wird nur vorgeschlagen, wenn tatsächlich ein Datensatz eingebunden ist.
- **Er prüft nichts inhaltlich.** Eine falsche Behauptung wird genauso sauber einsortiert wie eine richtige.

## Über die Kommandozeile

```bash
# analysieren
pbpaste | node tools/kuratieren.mjs --stdin --titel "XVERWEIS mit zwei Kriterien"

# Auftrag für den Agenten
node tools/kuratieren.mjs --datei notiz.md --briefing

# Entwurfsknoten anlegen
node tools/kuratieren.mjs --datei notiz.md --schreiben

# alles aus dem Posteingang
node tools/kuratieren.mjs --inbox
```

`--schreiben` legt immer mit `status: entwurf` und einer TODO-Marke an. Das ist Absicht: Was die Maschine platziert hat, ist noch nicht ausformuliert, und der Reifegrad muss das sagen. Die TODO-Marke sorgt dafür, dass der Knoten im Backlog unter *Lücken* erscheint und nicht in Vergessenheit gerät.

Eine vorhandene Datei wird **nie** überschrieben.

## Die Regeln, an denen sich das Ganze ausrichtet

1. **Lieber unfertig erfassen als gar nicht.** Ein Entwurf mit TODO ist im Archiv; ein Gedanke im Kopf ist es nicht.
2. **Ergänzen schlägt neu anlegen.** Ein zweiter Knoten zur selben Sache ist der häufigste Weg, wie ein Archiv unbrauchbar wird. Deshalb steht die Duplikatprüfung im Ergebnis ganz oben.
3. **Herkunft bleibt stehen.** `source: nutzer` ist eigene Erfahrung und unersetzbar; `ki` ist nachproduzierbar. Bei einem Widerspruch in zehn Jahren muss erkennbar sein, welchem Teil zu trauen ist.
4. **Neue Tags sparsam.** Driftende Tags — `dienstplan`, `dienstplanung`, `schichtplan` nebeneinander — zerlegen ein Archiv leise. Der Kurator zeigt deshalb an, welcher Tag im Bestand noch nicht vergeben ist.
5. **Der Vorschlag ist ein Vorschlag.** Begründet abweichen ist erwünscht. Die Maschine kennt den Bestand, nicht die Absicht.

::: quiz
F: Warum läuft die Einordnung ohne Sprachmodell, obwohl ein Agent den Text ohnehin überarbeiten soll?
A: Weil der Aufnahmeweg eines Archivs, das vierzig Jahre halten soll, nicht an einem Dienst hängen darf, den es in fünf Jahren vielleicht nicht mehr gibt. Ohne Agent entsteht ein Entwurfsknoten mit TODO statt eines ausformulierten — der Agent ist Komfort, kein Fundament.

F: Warum entscheidet der Kurator nicht selbst, ob ein Text ein Duplikat ist?
A: Weil sich die Ähnlichkeitsbereiche überlappen: Eine Paraphrase eines vorhandenen Knotens erreicht 0,15–0,26, eine neue verwandte Notiz 0,09–0,15. Eine Schwelle kann das nicht trennen, also meldet er die Nachbarn mit ihrer Zahl und überlässt das Urteil.

F: Die erste Fassung setzte die Duplikatschwelle auf 0,42. Warum war das falsch?
A: Das ähnlichste echte Knotenpaar im Bestand erreicht 0,34 — die Meldung hätte nie ausgelöst. Derselbe Fehler wie bei der Neugruppierung: ein Mechanismus, der stillschweigend nichts tut.

F: Warum schlägt der Kurator `type: referenz` niemals von sich aus vor?
A: Dieser Typ nimmt einen Knoten von der Stufennormalisierung aus. Geraten würde er still die Lernpyramide des ganzen Themas verzerren — er wird nur vorgeschlagen, wenn tatsächlich ein Datensatz eingebunden ist.

F: Was ist in der Sammlung unter *Einspeisen* gespeichert, und was nicht?
A: Sie liegt im Browser, nicht im Archiv. Ein Eintrag ist erst dann Teil des Archivs, wenn er als Datei unter `content/` steht — eine Webseite darf nicht ins Dateisystem schreiben.
:::
