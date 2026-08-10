# Wissensschatz

Ein kontinuierlich fütterbares Wissensarchiv, das sich beim Wachsen selbst neu ordnet.
Es dient gleichzeitig dem **Erleben** von Wissen (Lernkarten mit Wiederholungsplan) und
dem **Aufbewahren** (Nachschlagen, Querverweise, verschlüsselter Tresor).

Ausgelegt auf Jahrzehnte: Alle Inhalte liegen als gewöhnliche Textdateien vor und sind
mit jedem Texteditor lesbar. Die App ist Komfort, nicht Voraussetzung.

---

## Sofort loslegen

```
wissensschatz/web/index.html
```

Im Browser öffnen — kein Server, keine Installation, keine Internetverbindung nötig.

Nach Änderungen am Inhalt:

```bash
cd wissensschatz
node tools/build.mjs   # Index neu bauen
node tools/test.mjs    # Selbsttest
```

Node.js ≥ 18, keine Abhängigkeiten.

---

## Was drin ist

| Thema | Umfang |
|---|---|
| **Excel** | Bezüge, Formelsprache, dynamische Arrays, LET/LAMBDA, Pivot, Power Query, Datenmodell, Diagramme, Dashboards, VBA, Office Scripts, SQL, Performance, Modellarchitektur — plus komplette Funktionsreferenz |
| **Power BI** | Komponenten und Lizenzen, Sternschema, Beziehungen, Kalendertabelle, DAX-Auswertungskontext, CALCULATE, Iteratoren, Zeitintelligenz, Visuals, VertiPaq-Performance, RLS und Betrieb |
| **Fotografie** | Belichtungsdreieck, Schärfentiefe und Beugung, Verschluss und Bewegung, ISO und Dynamik, Optik und Perspektive, Sensorformate, Autofokus und Messung, Licht und Weißabgleich, Blitz, Filter, Abbildungsfehler — plus Bajonett- und Adapterdatenbank, Objektivkürzel aller Hersteller und 35 Motivrezepte |
| **Druck** | 21 Druckverfahren von Thermodirekt bis Tiefdruck, Entscheidungshilfe nach Aufgabe, Farbmanagement und Druckvorstufe, Medien und Archivbeständigkeit |
| **Prozessautomation** | Prozessanalyse und BPMN, Automatisierbarkeit und ROI, Werkzeugleiter von der Formel bis zum KI-Agenten, Power Platform, Einführung, Governance und Mitbestimmung |
| **Führung & HR** | Führungs- und Motivationstheorien, Führungsstile und Delegation, Gesprächsführung, Entwicklungsbegleitung, Team- und Konfliktdynamik, HR-Kennzahlen inkl. Hotelkennzahlen |
| **Arbeitsrecht DE** | Rechtsquellen, Vertrag und Befristung, Arbeitszeit mit den Gaststätten-Ausnahmen, Jugendarbeitsschutz, Vergütung und Mindestlohn, Urlaub und Krankheit, Mutterschutz und Schwerbehinderung, Betriebsrat und Arbeitsschutz, Ausbildung, Beendigung — mit durchgehendem Fokus Hotellerie |
| **Meta** | Aufbau, Fütterungswege, Pflegeroutine, Sicherung, Tresor und Übergabe |

Dazu einsatzfertige Vorlagen unter `vorlagen/`: VBA-Module, SQL-Referenzen,
Office Scripts, Power-Query-Abfragen und Tabellenvorlagen.

> **Zum Arbeitsrecht:** Aufbereitete Theorie zum Stand der Recherche, kein Rechtsrat.
> Beträge, Fristen und Rechtsprechung ändern sich — vor jeder Anwendung prüfen.

---

## Die drei Mechanismen der Selbstorganisation

Sie laufen bei **jedem** Build und sorgen dafür, dass die Struktur mit dem Inhalt mitwächst.

**1 — Stufen werden neu bewertet.**
Das Level im Frontmatter ist ein Vorschlag. Der Build berechnet daraus ein effektives
Level aus deklarierter Stufe (55 %), Länge der Voraussetzungskette (28 %) und
Strukturtiefe (17 %) und normalisiert anschließend **je Themengebiet** auf eine
Lernpyramide. Bei fünf Knoten bedeutet „Experte" etwas anderes als bei fünfhundert.

**2 — Volle Ebenen gruppieren sich um.**
Überschreitet ein Ordner die Schwelle (Standard 12 Knoten), clustert der Build seine
Knoten in drei Schritten:

1. **Merkmalsvektor** je Knoten aus Tags (Gewicht 2,0), Titel (1,0), Pfadende (1,2) und
   Zusammenfassung (0,45), gewichtet mit **IDF** über die Geschwistermenge — was auf
   *dieser* Ebene selten ist, trennt sie am besten.
2. **Kerne bilden** per Average Linkage über der Hauptschwelle, danach Einzelknoten per
   Single Linkage gegen eine niedrigere Schwelle **anlagern**. Ohne diesen zweiten
   Schritt bleiben alle Cluster bei Paaren stehen, weil die mittlere Ähnlichkeit beim
   Verschmelzen sofort unter die Schwelle fällt.
3. **Benennung aus dem TF-IDF-Schwerpunkt** — der Begriff, der im Cluster dicht vorkommt
   und ihn zugleich von den Geschwistern abhebt.

Zu kleine Cluster werden wieder aufgelöst. Die Gruppen sind **virtuell** — sie existieren
nur im Index, nie im Dateisystem. Umgruppieren ist damit verlustfrei umkehrbar.

**3 — Lücken werden verfolgt.**
Fehlende Verweise, unbesetzte Stufen je Thema und `> TODO:`-Marken landen automatisch
in einem Backlog. Das Archiv weiß selbst, was ihm fehlt.

Alles nachvollziehbar in der App unter *Selbstorganisation*. Schwellen einstellbar in
`tools/lib/organize.mjs`, empirisch kalibriert und durch `node tools/test.mjs` abgesichert —
ein dokumentierter Mechanismus, der stillschweigend nie auslöst, wäre schlimmer als keiner.

---

## Wissen einspeisen

```bash
node tools/feed.mjs --titel "XVERWEIS mit zwei Kriterien" \
                    --pfad excel/formeln --level 3 \
                    --tags lookup,dynamische-arrays --quelle nutzer
```

Legt eine Vorlage an, vergibt eine ID und baut den Index neu. `--hilfe` zeigt alle Optionen.
Rohes darf in `meta/inbox` — lieber unfertig erfassen als gar nicht.

Jeder Knoten trägt seine **Herkunft** (`ki` / `nutzer` / `gemischt`) und seinen
**Reifegrad** (`entwurf` / `geprueft` / `veraltet`). Eigene Erfahrung ist unersetzbar,
KI-Inhalte sind nachproduzierbar — bei einem Widerspruch in Jahren muss erkennbar
bleiben, welchem Teil zu trauen ist.

---

## Aufbau eines Knotens

```markdown
---
id: excel-nachschlagen        eindeutig, ändert sich nie
title: Nachschlagen
path: excel/formeln           bildet den Navigationsbaum
level: 3                      Vorschlag 1–5, der Build rechnet nach
type: technik                 theorie|technik|referenz|rezept|recht|checkliste|meta
source: ki                    ki|nutzer|gemischt
status: geprueft              entwurf|geprueft|veraltet
updated: 2026-08-09
tags: [lookup, sverweis]
prereqs: [excel-formelsprache]
related: [excel-performance]
summary: Ein Satz.
---

## Kern
Fließtext …

::: viz dataset:excel-funktionen
Bildunterschrift
:::

::: quiz
F: Prüffrage
A: Antwort
:::

> TODO: was noch fehlt
```

---

## Tresor

Für Passwörter und Wiederherstellungscodes — mit **zwei Faktoren in der Verschlüsselung selbst**:

- **AES-256-GCM**, Schlüssel aus **PBKDF2-HMAC-SHA-256 mit 600.000 Iterationen**
- Ausgangsmaterial ist die Verkettung aus **Passphrase** (Wissen) und dem Geheimnis einer
  **externen Schlüsseldatei** mit 256 Bit Zufall (Besitz). Einer allein genügt nicht.
- Zusätzlich ein **TOTP-Gate** (RFC 6238) aus einer Authenticator-App auf einem anderen
  Gerät, bevor Geheimnisse angezeigt werden — eine Zugriffssperre, ausdrücklich keine
  weitere Verschlüsselungsebene.
- Automatische Sperre nach 5 Minuten, Zwischenablage wird nach 30 Sekunden geleert,
  keine Netzverbindung, nichts im Klartext gespeichert.
- **Notfallkit** auf Knopfdruck: ein druckbares Blatt ohne Geheimnisse, das den Weg zu
  ihnen beschreibt — für die Übergabe.

Es gibt **keine Wiederherstellung**. Passphrase vergessen oder Schlüsseldatei verloren
heißt: endgültig weg. Details und Grenzen im Knoten *Tresor, Sicherheitsmodell und Übergabe*.

Der verschlüsselte Blob liegt im `localStorage` des Browsers und wird per Export als Datei
gesichert. `tresor/` und Schlüsseldateien sind von der Versionsverwaltung ausgenommen.

---

## Ordner

```
wissensschatz/
  content/          Wissen (Markdown) + _data/ (Referenzdatensätze) + _topics.json
  vorlagen/         VBA · SQL · Office Scripts · Power Query · Tabellen
  tools/            build.mjs · feed.mjs · test.mjs · lib/
  web/              index.html · app.js · viz.js · vault.js · app.css · kb-data.js
  tresor/           verschlüsselte Sicherungen (nicht versioniert)
  .state/           Gedächtnis des Builds für die Neubewertung
```

---

## Warum dieser Aufbau

| Entscheidung | Grund |
|---|---|
| Markdown statt Datenbank | in 40 Jahren mit jedem Texteditor lesbar |
| `kb-data.js` statt `.json` | die App läuft per Doppelklick ohne Server und ohne CORS-Ärger |
| keine Abhängigkeiten | nichts, was in fünf Jahren nicht mehr installierbar ist |
| virtuelle Gruppen | Umstrukturierung ohne Dateiverschiebungen, jederzeit umkehrbar |
| Herkunft am Knoten | eigene Erfahrung von nachproduzierbarem Wissen unterscheidbar halten |
| Tresor im Browser | Geheimnisse verlassen das Gerät nie |
