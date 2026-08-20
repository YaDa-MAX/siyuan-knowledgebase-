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
node tools/test.mjs    # Selbsttest, inklusive der Regeln von Prüfer und Kurator
```

Node.js ≥ 18, keine Abhängigkeiten.

---

## Was drin ist

| Thema | Umfang |
|---|---|
| **Excel** | Bezüge, Formelsprache, dynamische Arrays, LET/LAMBDA, Pivot, Power Query, Datenmodell, Diagramme, Dashboards, VBA, Office Scripts, SQL, Finanzmathematik, Performance, Modellarchitektur — plus Funktionsreferenz, Kompatibilitätsfunktionen und Feiertagsdatensatz |
| **Power BI** | Komponenten und Lizenzen, Sternschema, Beziehungen, Kalendertabelle, DAX-Auswertungskontext, CALCULATE, Iteratoren, Zeitintelligenz, Visuals, VertiPaq-Performance, RLS und Betrieb |
| **Fotografie** | Belichtungsdreieck, Schärfentiefe und Beugung, Verschluss und Bewegung, ISO und Dynamik, Optik und Perspektive, Sensorformate, Autofokus und Messung, Licht und Weißabgleich, Blitz, Filter, Abbildungsfehler — plus Bajonett- und Adapterdatenbank, Objektivkürzel aller Hersteller, 35 Motivrezepte und acht Motiv-Vertiefungen (Landschaft, Porträt, Sport/Wildlife, Astro, Architektur, Nacht, Produkt, Event) |
| **Druck** | Grundbegriffe, 21 Druckverfahren von Thermodirekt bis Tiefdruck, Entscheidungshilfe nach Aufgabe, Farbmanagement und Druckvorstufe, Medien und Archivbeständigkeit, Etiketten und Kennzeichnung, Großformat und Werbetechnik, Fine-Art-Fotodruck |
| **Prozessautomation** | Kleine Hebel für den Einstieg, Prozessanalyse und BPMN, Automatisierbarkeit und ROI, Werkzeugleiter, Power Platform, KI im Prozess mit Grenzen und Absicherung, Einführung, Governance und Mitbestimmung |
| **Betriebswirtschaft** | Umsatz-Kosten-Ergebnis-Kette und Umsatzsteuer im Gastgewerbe, Wareneinsatz mit Bestandsveränderung, Schwund und seine wahren Ursachen, Personalkosten und Vollzeitäquivalente, Preiskalkulation und Rückwärtsrechnung, Deckungsbeitrag und Break-even, Menu Engineering, Hotelkennzahlen bis GOPPAR und USALI, Budget und Abweichungszerlegung, Revenue Management, Liquidität im Saisonbetrieb, Investitionsrechnung — plus 27 Kennzahlen mit ihren typischen Fehlerquellen |
| **Führung & HR** | Die ersten 100 Tage, Führungs- und Motivationstheorien, Führungsstile und Delegation, Gesprächsführung, Entwicklungsbegleitung, Team- und Konfliktdynamik, Vergütung und Anreize, Recruiting und Bindung, Selbstführung, HR-Kennzahlen inkl. Hotelkennzahlen |
| **Arbeitsrecht DE** | Rechtsquellen, Vertrag und Befristung, Arbeitszeit mit den Gaststätten-Ausnahmen, Jugendarbeitsschutz, Vergütung und Mindestlohn, Urlaub und Krankheit, Mutterschutz und Schwerbehinderung, Betriebsrat und Arbeitsschutz, Ausbildung, Beendigung — mit durchgehendem Fokus Hotellerie |
| **Lernen** | Gedächtnis und Konsolidierung, Vergessenskurve und der Unterschied zwischen Speicher- und Abrufstärke, Abrufeffekt, verteiltes und verschachteltes Üben, Elaboration und Dual Coding, wünschenswerte Erschwernisse, Metakognition, Motivation und Volition, Lernplanung, Textarbeit und Notizen, Mnemotechniken, Transfer im Beruf, Anleiten mit Cognitive Load Theory — **und ein eigener Teil zur Befundlage**: Lerntypen und die verbreiteten Lernmythen, jeweils mit Herkunft, Studienlage und dem, was übrig bleibt |
| **Meta** | Aufbau, Fütterungswege, Kuratierung neuen Wissens, Pflegeroutine, Sicherung, Tresor und Übergabe, Lerntheorie hinter dem Lernmodus, Wissensarchitektur, Anleitung für neue Themengebiete |

Dazu einsatzfertige Vorlagen unter `vorlagen/`: VBA-Module, SQL-Referenzen,
Office Scripts, Power-Query-Abfragen und Tabellenvorlagen.

**Dreizehn Fachgrafiken** (`web/diagramme.js`) zeigen jeweils einen Mechanismus, den
Fließtext nur umständlich erklärt — etwa alle Bajonette auf einer Auflagemaß-Achse
mit der Richtung der Adaptierbarkeit, denselben Spätdienst unter drei
Arbeitszeitregimen mit dem jeweils frühesten nächsten Dienstbeginn, eine
Speisekarte in den vier Feldern des Menu Engineerings, oder die Vergessenskurve
mit und ohne Wiederholung.

> **Zum Themengebiet Lernen:** Es enthält ausdrücklich auch, was sich als
> **unwirksam** erwiesen hat — die Lerntypen-Modelle nach Vester, VAK/VARK und Kolb,
> die Lernpyramide mit ihren erfundenen Prozentzahlen, die Gehirnhälften-Typologie.
> Jeweils mit Herkunft, der Prüfung, an der sie scheitern, und dem, was von der
> Grundidee übrig bleibt. Weglassen wäre bei „aus Studien und Büchern" unehrlich,
> und der Schaden dieser Modelle liegt weniger im Irrtum als darin, dass sie die
> drei kostenlosen und wirksamen Verfahren verdrängen.

---

## Dienstplan prüfen

Der Menüpunkt **Dienstplan** ist die Brücke von der Theorie in den konkreten Fall —
den Schritt, den Karteikarten nicht leisten. Schichten eintragen, und jeder Befund
nennt den Paragrafen, die konkrete Zahl und den Knoten, der die Regel erklärt.

Geprüft werden **ArbZG** (Höchstarbeitszeit, Pausen, Ruhezeit, Nachtarbeit, Sonn- und
Feiertagsarbeit, Wochenarbeitszeit) und **JArbSchG** (Dauer, Pausen, Schichtzeit,
Freizeit, Nachtruhe, Fünf-Tage-Woche, Samstags-, Sonntags- und Feiertagsruhe) —
jeweils mit den Branchenausnahmen des Gastgewerbes. Die Feiertage werden je Bundesland
aus dem Datensatz `feiertage-de` berechnet, Ostern über den gregorianischen Osteralgorithmus.

Zwei Dinge, die das Werkzeug von einer Checkliste unterscheiden:

- **Die Ausgleichsbilanz nach § 5 Abs. 2 ArbZG.** Verkürzte Ruhezeit im Gastgewerbe ist
  nur zulässig, wenn *jede* Verkürzung durch eine Ruhezeit von 12 Stunden ausgeglichen
  wird. Der Prüfer rechnet das je Kalendermonat gegen — genau die Stelle, an der
  Dienstpläne der Branche kippen.
- **Der geteilte Dienst.** 11–14 Uhr und 17–22 Uhr sind ein Arbeitstag mit Unterbrechung,
  nicht zwei Arbeitstage mit drei Stunden Ruhezeit. Wer das nicht trennt, meldet jeden
  zweiten Dienstplan fälschlich als rechtswidrig und wird nach dem dritten Fehlalarm
  ignoriert.

> **Prüfhilfe, kein Rechtsrat.** Ein Ergebnis ohne Befunde heißt „hier ist nichts
> aufgefallen", nicht „das ist zulässig". Die Liste dessen, was **nicht** geprüft wird —
> allen voran Tarifverträge — steht unter jedem Ergebnis und im Knoten
> *Dienstplan prüfen — Regeln, Grenzen und die Fallen der Branche*.

Die Regeln liegen in `web/dienstplan.js`, getrennt von der Oberfläche, und werden von
`node tools/test-dienstplan.mjs` gegen 66 Fälle geprüft — solche, die auslösen **müssen**,
und solche, die es **nicht dürfen**. Der Selbsttest startet sie mit.

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

### Einspeisen und kuratieren

Für alles, was noch keinen Platz hat, gibt es den Menüpunkt **Einspeisen** — und dahinter
eine klare Arbeitsteilung:

> **Die Maschine platziert. Der Agent formuliert.**

Beim Tippen vergleicht `web/kurator.js` den Text mit jedem vorhandenen Knoten
(IDF-gewichteter Kosinus über Tags, Titel und Fließtext) und schlägt vor: Themengebiet,
Pfad, Stufe, Typ, Tags, Voraussetzungen und Querverweise — **und meldet, wenn es das
schon gibt**. Drei Knöpfe führen weiter: *Agentenauftrag kopieren* erzeugt einen
vollständigen Auftrag für ein Sprachmodell, *Als Knoten speichern* legt die Datei mit
fertigem Frontmatter an, *In die Sammlung* parkt den Entwurf.

Dasselbe über die Kommandozeile:

```bash
pbpaste | node tools/kuratieren.mjs --stdin --titel "…" --briefing   # Auftrag
node tools/kuratieren.mjs --datei notiz.md --schreiben               # Entwurfsknoten
node tools/kuratieren.mjs --inbox                                    # Posteingang
```

Die Einordnung läuft **offline und ohne fremden Dienst**. Das ist keine Bequemlichkeit:
Ein Archiv für vierzig Jahre darf seinen Aufnahmeweg nicht an ein Sprachmodell hängen,
das es in fünf Jahren vielleicht nicht mehr gibt. Ohne Agent entsteht ein Entwurfsknoten
mit `> TODO:` statt eines ausformulierten — der Agent ist Komfort, kein Fundament.

Die Schwellen sind an echtem Bestand gemessen, nicht geschätzt: Zwei beliebige Knoten
erreichen im Median 0,017 Ähnlichkeit, das ähnlichste echte Paar 0,34; eine kurze
Paraphrase eines vorhandenen Knotens 0,15–0,26. Die erste Fassung setzte die
Duplikatschwelle auf 0,42 — sie hätte nie ausgelöst. Deshalb prüft
`node tools/test-kurator.mjs` gegen den echten Bestand: Paraphrasen **müssen** gemeldet,
fachfremde Notizen dürfen **nicht** zuversichtlich einsortiert werden.

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
  tools/            build.mjs · feed.mjs · kuratieren.mjs · test.mjs · test-*.mjs · lib/
  web/              index.html · app.css · app.js · kb-data.js (erzeugt)
                    viz.js · diagramme.js · dienstplan.js · kurator.js · vault.js
                    dienstplan-ui.js · einspeisen.js
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
| Prüfregeln getrennt von der Oberfläche | dieselbe Datei läuft im Browser und im Selbsttest — Regeln über geltendes Recht müssen prüfbar sein, nicht behauptet |
| Kuratierung ohne Sprachmodell | der Aufnahmeweg darf nicht an einem Dienst hängen, den es in fünf Jahren vielleicht nicht mehr gibt |
