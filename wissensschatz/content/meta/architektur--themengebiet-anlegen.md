---
id: meta-neues-thema
title: Ein neues Themengebiet anlegen
path: meta/architektur
level: 4
type: rezept
source: ki
status: geprueft
updated: 2026-08-11
tags: [erweitern, themengebiet, datensatz, visualisierung, anleitung]
prereqs: [meta-fuettern, meta-wissensarchitektur]
related: [meta-pflegeroutine, meta-start]
summary: Der vollständige Ablauf vom leeren Thema bis zur eigenen Visualisierung — die Anleitung, die in fünf Jahren gebraucht wird, wenn niemand mehr weiß, wie es ging.
---

## Wofür dieser Knoten da ist

Ein Archiv, das vierzig Jahre gefüttert wird, bekommt Themen, an die heute niemand denkt. Dieser Knoten beschreibt den Weg dorthin so, dass ihn auch jemand gehen kann, der das System nicht gebaut hat — in fünf Jahren, ohne Vorwissen, ohne Rückfragemöglichkeit.

## Schritt 1 — Das Thema anmelden

In `content/_topics.json` einen Eintrag ergänzen:

```json
"segeln": {
  "label": "Segeln",
  "icon": "⛵",
  "color": "#2f6a8f",
  "claim": "Wind, Wasser, Vorfahrt",
  "desc": "Navigation, Manöver, Seemannschaft und die Regeln auf dem Wasser.",
  "disclaimer": "Optional — erscheint als Warnhinweis auf jedem Knoten des Themas."
}
```

| Feld | Wofür |
|---|---|
| `label` | Anzeigename in Navigation und Kacheln |
| `icon` | ein Zeichen, das im Text steht (kein Bild) — erscheint neben dem Namen |
| `color` | Themenfarbe für Kacheln, Baum und Wissenskarte |
| `claim` | ein Halbsatz, der das Thema charakterisiert |
| `desc` | ein bis zwei Sätze für die Themenübersicht |
| `disclaimer` | optional; für Themen mit Rechts- oder Sicherheitsbezug |

**Farbe** so wählen, dass sie sich von den vorhandenen unterscheidet — sie ist in der Wissenskarte das einzige Unterscheidungsmerkmal.

## Schritt 2 — Den Einstiegsknoten schreiben

```bash
node tools/feed.mjs --titel "Segeln — die Grundbegriffe" \
                    --pfad segeln/grundlagen --level 1 \
                    --tags einstieg,grundbegriffe --quelle nutzer
```

Der Ordner `content/segeln/` entsteht dabei automatisch. Danach den Text schreiben.

**Der erste Knoten sollte immer ein Einstiegsknoten sein**, kein Spezialthema. Grund: Die automatische Einstufung normalisiert je Thema. Ein Thema, das nur aus Expertenknoten besteht, bekommt trotzdem eine Stufe-1-Zuweisung — und die trifft dann den falschen Knoten.

## Schritt 3 — Auf acht Knoten bringen

Unterhalb von acht Lernknoten je Thema greift die Normalisierung nicht (`rebalanceMinNodes` in `tools/lib/organize.mjs`); es gelten die deklarierten Stufen. Das ist Absicht — bei fünf Knoten wäre eine Verteilung über fünf Stufen willkürlich.

Eine tragfähige Grundausstattung sieht so aus:

| Stufe | Knoten |
|---|---|
| 1 | Einstieg und Grundbegriffe |
| 2 | zwei bis drei Anwendungsthemen |
| 3 | zwei bis drei Vertiefungen |
| 4 | ein anspruchsvolles Praxisthema |
| 5 | ein Spezialthema mit langer Voraussetzungskette |

Dazu ein Unterordner je Themenbereich im `path` (`segeln/grundlagen`, `segeln/navigation`, `segeln/manoever`). Ab zwölf Knoten in einem Ordner übernimmt das automatische Clustering.

## Schritt 4 — Verknüpfen

Ein Thema, das nicht mit den übrigen verbunden ist, bleibt eine Insel. Beim Schreiben mitdenken:

- **`prereqs`** innerhalb des Themas — sie bauen den Lernpfad und speisen die Einstufung.
- **`related` über Themengrenzen hinweg** — hier entsteht der eigentliche Wert eines gemeinsamen Archivs. Navigation verweist auf Fotografie (Kompass, Sonnenstand), Seerecht auf Arbeitsrecht (Haftung), Törnplanung auf Prozessautomation (Checklisten).
- Ein Verweis auf einen noch nicht geschriebenen Knoten ist **kein Fehler**, sondern eine Notiz. Er erscheint im Backlog unter *Lücken*.

## Schritt 5 — Referenzdatensatz anlegen (optional)

Für Nachschlagewerke mit vielen gleichförmigen Einträgen — Funktionen, Bauteile, Verfahren, Normen — ist eine Tabelle besser als Fließtext. Datei unter `content/_data/<name>.json`:

```json
{
  "title": "Knoten und ihre Verwendung",
  "topic": "segeln",
  "note": "Kurzer Hinweis, der unter der Tabelle erscheint.",
  "columns": [
    { "key": "name",  "label": "Knoten" },
    { "key": "kat",   "label": "Kategorie" },
    { "key": "txt",   "label": "Wofür" },
    { "key": "lvl",   "label": "Stufe", "type": "level" }
  ],
  "items": [
    { "name": "Palstek", "kat": "Schlinge", "txt": "Feste Schlaufe, die sich nicht zuzieht.", "lvl": 1 }
  ]
}
```

Regeln:

- Eine Spalte mit `"key": "kat"`, `"marke"`, `"typ"` oder `"art"` erzeugt automatisch ein **Filter-Auswahlfeld**.
- `"type": "level"` stellt die Spalte als farbigen Stufen-Chip dar und erzeugt zusätzlich einen Stufenfilter.
- Alle Spalten sind sortierbar und durchsuchbar, ohne dass etwas konfiguriert werden muss.

Eingebunden wird der Datensatz in einem beliebigen Knoten:

```
::: viz dataset:segeln-knoten
Bildunterschrift, die unter der Tabelle erscheint.
:::
```

Der Knoten, der einen Datensatz einbindet, sollte `type: referenz` tragen — dann wird er von der Stufennormalisierung ausgenommen und verzerrt den Lernpfad nicht.

## Schritt 6 — Eigene Visualisierung (optional)

Für Fachgrafiken, die keine Tabelle sind. In `web/viz.js` eine Funktion ergänzen, die ein `<figure class="viz">` zurückgibt, und sie im Verzeichnis `benannt` registrieren:

```js
function windrose() {
  const f = document.createElement("figure");
  f.className = "viz";
  f.innerHTML = `<svg viewBox="0 0 400 400" role="img"
      aria-label="Windrose mit Kursbezeichnungen"> … </svg>`;
  return f;
}

const benannt = {
  "exposure-triangle": belichtungsdreieck,
  "belichtungsdreieck": belichtungsdreieck,
  "windrose": windrose,          // neu
};
```

Aufruf im Knoten: `::: viz windrose`.

Drei Vorgaben, damit es zum Rest passt:

- **Reines SVG**, keine Bibliothek, keine Netzanfrage. Das Archiv muss offline und in zwanzig Jahren funktionieren.
- **`fill="currentColor"`** für Text und Linien, damit die Grafik im hellen wie im dunklen Erscheinungsbild lesbar bleibt.
- **`viewBox` statt fester Größe**, damit sie auf jedem Bildschirm skaliert.

## Schritt 7 — Bauen und prüfen

```bash
node tools/build.mjs   # Index neu erzeugen
node tools/test.mjs    # Selbsttest
```

Der Selbsttest prüft unter anderem, dass jeder Fachknoten Lernkarten hat, dass keine IDs doppelt vorkommen, dass die Stufen streuen und dass keine Zyklen in den Voraussetzungen bestehen. Er schlägt fehl, wenn ein neues Thema nur halb angelegt ist — das ist gewollt.

Danach `web/index.html` öffnen und durchsehen: Erscheint das Thema auf der Übersicht? Stimmen Farbe und Kachel? Sind die Stufen sinnvoll verteilt? Funktioniert der Datensatzfilter?

## Was erfahrungsgemäß schiefgeht

| Symptom | Ursache |
|---|---|
| Thema erscheint nicht | Eintrag in `_topics.json` fehlt oder JSON ist ungültig (Komma!) |
| Knoten erscheint nicht | Dateiname beginnt mit `_`, oder der Ordner mit `.` — beide werden übersprungen |
| Build bricht ab | Pflichtfeld im Frontmatter fehlt, oder eine ID ist doppelt vergeben |
| Alle Knoten auf derselben Stufe | weniger als acht Lernknoten — Normalisierung greift noch nicht |
| Stufen wirken willkürlich | zu wenige `prereqs` gesetzt; die Kettenlänge trägt 28 % der Einstufung |
| Datensatz leer | `key` in `columns` stimmt nicht mit den Feldnamen in `items` überein |
| Umlaute zerstört | Datei nicht als UTF-8 gespeichert |

## Die Reihenfolge, wenn wenig Zeit ist

Wer ein Thema nicht in einem Zug fertigstellen kann, geht in dieser Reihenfolge vor — jeder Zwischenstand ist dann nutzbar:

1. Themeneintrag anlegen
2. Einstiegsknoten schreiben (Stufe 1)
3. Die zwei bis drei Knoten schreiben, die man selbst am häufigsten nachschlägt
4. Querverweise zu bestehenden Themen setzen — auch auf noch fehlende Knoten
5. Den Rest über Monate ergänzen, geführt vom Backlog

Punkt 4 ist der wichtigste. Die offenen Verweise werden zur Arbeitsliste, und das Thema wächst danach von selbst in die richtige Richtung.

::: quiz
F: Warum sollte der erste Knoten eines neuen Themas ein Einstiegsknoten sein?
A: Die Stufennormalisierung verteilt je Thema über alle fünf Stufen. Besteht das Thema nur aus Expertenknoten, bekommt trotzdem einer die Stufe 1 zugewiesen — und dann der falsche.

F: Ab wie vielen Knoten greift die automatische Stufennormalisierung?
A: Ab acht Lernknoten je Thema (`rebalanceMinNodes`). Darunter gelten die deklarierten Stufen.

F: Warum sollte ein Knoten, der einen Referenzdatensatz einbindet, `type: referenz` tragen?
A: Referenzknoten werden von der Stufennormalisierung ausgenommen und verzerren dadurch die Verteilung des Lernpfads nicht.
:::
