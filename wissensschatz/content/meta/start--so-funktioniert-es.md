---
id: meta-start
title: Wie dieses Archiv funktioniert
path: meta/start
level: 1
type: meta
source: ki
status: geprueft
updated: 2026-08-10
tags: [anleitung, konventionen, einstieg]
prereqs: []
related: [meta-fuettern, meta-pflegeroutine, meta-sicherung, meta-uebergabe]
summary: Aufbau, Bedienung und die drei Mechanismen, die dafür sorgen, dass sich das Archiv beim Wachsen selbst neu ordnet.
---

## Der Zweck

Ein Wissensspeicher, der über Jahrzehnte gefüttert wird und dabei benutzbar bleibt. Zwei Aufgaben gleichzeitig:

1. **Erleben** — Wissen aufnehmen, verstehen, mit Lernkarten festigen.
2. **Aufbewahren** — später wiederfinden, nachlesen, weitergeben.

Beides schließt sich meist aus: Kurse sind nicht nachschlagbar, Wikis sind nicht lernbar. Dieses Archiv hält beides in denselben Dateien, weil jeder Knoten sowohl Fließtext als auch Prüffragen enthält.

## Aufbau

```
wissensschatz/
  content/          das Wissen — Markdown-Dateien, ein Knoten je Datei
    _topics.json    Themengebiete mit Farbe und Beschreibung
    _data/*.json    Referenzdatensätze (Funktionen, Bajonette, Verfahren …)
  vorlagen/         einsatzfertige Dateien (VBA, SQL, M, Skripte, Tabellen)
  tools/            Build- und Feed-Skripte (Node.js, ohne Abhängigkeiten)
  web/              die App — index.html per Doppelklick öffnen
  tresor/           verschlüsselte Zugangsdaten (nie im Klartext)
  .state/           Gedächtnis des Builds für die Neubewertung
```

**Warum Markdown und keine Datenbank?** Weil eine Textdatei in vierzig Jahren garantiert lesbar ist. Selbst wenn Node.js, dieser Browser und dieses Dateiformat verschwunden sind, bleibt der Inhalt mit jedem Texteditor zugänglich. Die App ist eine Bequemlichkeit, nicht die Voraussetzung.

## Aufbau eines Knotens

```markdown
---
id: excel-nachschlagen          eindeutig, ändert sich nie
title: Nachschlagen              Überschrift
path: excel/formeln              Themenpfad, bildet den Baum
level: 3                         Vorschlag 1–5; der Build rechnet nach
type: technik                    theorie|technik|referenz|rezept|recht|checkliste|meta
source: ki                       ki|nutzer|gemischt
status: geprueft                 entwurf|geprueft|veraltet
updated: 2026-08-09
tags: [lookup, sverweis]
prereqs: [excel-formelsprache]   was man vorher verstanden haben sollte
related: [excel-performance]     Querverweise
summary: Ein Satz.
---

## Kern
Fließtext …

::: quiz
F: Prüffrage
A: Antwort
:::

> TODO: was noch fehlt
```

Die `id` ist der Anker. Alles andere darf sich ändern — die `id` bleibt, damit Verweise über Jahre halten.

## Die drei Mechanismen der Selbstorganisation

**1 — Automatische Neubewertung der Stufen.** Das Level im Frontmatter ist ein Vorschlag. Der Build berechnet daraus ein effektives Level, indem er die Voraussetzungskette (wie tief muss man einsteigen?) und die Strukturtiefe einbezieht und anschließend **je Themengebiet normalisiert**. Wenn zu einem Thema erst fünf Knoten existieren, bedeutet „Experte" etwas anderes als bei fünfhundert. Verschiebungen gegenüber dem letzten Build stehen in der App unter *Selbstorganisation*.

**2 — Automatische Neugruppierung.** Wird ein Ordner zu voll (Standard: mehr als zwölf Knoten), clustert der Build seine Knoten nach Tag- und Titelähnlichkeit und legt automatisch benannte Untergruppen an. Zu kleine Cluster wandern zurück. Diese Gruppen sind **virtuell** — sie stehen nur im Index, nie im Dateisystem. Umgruppieren ist damit jederzeit verlustfrei rückgängig zu machen.

**3 — Lückenverfolgung.** Der Build sammelt fehlende Verweise, unbesetzte Stufen je Thema und alle `> TODO:`-Marken in ein Backlog. Das Archiv weiß dadurch selbst, was ihm fehlt — die Voraussetzung dafür, dass es über Jahre gezielt wächst statt zufällig.

## Bedienung der App

`web/index.html` im Browser öffnen. Kein Server, keine Installation, keine Internetverbindung.

| Ansicht | Wozu |
|---|---|
| **Übersicht** | Themen, Kennzahlen, Verteilung über die Stufen |
| **Wissen** | Baum, Suche, Lesen — der Alltagsmodus |
| **Lernen** | Karteikarten mit Wiederholungsplan |
| **Karte** | Beziehungsnetz der Knoten |
| **Selbstorganisation** | was der Build zuletzt neu bewertet und gruppiert hat |
| **Lücken** | das Backlog |
| **Tresor** | verschlüsselte Zugangsdaten |

Suche: `/` fokussiert das Suchfeld. Sie durchsucht Titel, Zusammenfassung, Tags und Fließtext.

## Nach jeder Änderung

```bash
cd wissensschatz
node tools/build.mjs
```

Der Build validiert alle Knoten, rechnet Stufen und Gruppen neu und schreibt `web/kb-data.js`. Fehlerhafte Dateien bricht er mit einer Zeilenangabe ab — nichts Halbfertiges landet im Index.

::: quiz
F: Warum liegt das Wissen in Markdown-Dateien statt in einer Datenbank?
A: Weil Textdateien ohne Spezialsoftware lesbar bleiben. Die App ist Komfort, nicht Voraussetzung — das ist die Bedingung für ein Archiv, das Jahrzehnte überdauern soll.

F: Was passiert mit einem Ordner, der mehr als zwölf Knoten enthält?
A: Der Build clustert ihn automatisch nach Tag- und Titelähnlichkeit in benannte Untergruppen. Diese sind virtuell und existieren nur im Index.

F: Welches Feld eines Knotens darf sich nie ändern?
A: Die `id` — an ihr hängen alle Querverweise.
:::
