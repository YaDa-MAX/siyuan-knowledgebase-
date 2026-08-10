---
id: powerbi-komponenten
title: Die Power-BI-Landschaft — Komponenten und Lizenzen
path: powerbi/grundlagen
level: 1
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [grundlagen, lizenzen, architektur, service]
prereqs: []
related: [powerbi-betrieb, excel-datenmodell]
summary: Desktop, Service, Gateway, Fabric — wer was macht, und welche Lizenz wofür nötig ist.
---

## Die Bausteine

| Komponente | Rolle |
|---|---|
| **Power BI Desktop** | Kostenloses Windows-Programm. Hier entstehen Modell, DAX und Bericht. Der eigentliche Entwicklungsplatz. |
| **Power BI Service** (app.powerbi.com) | Cloud-Plattform: Veröffentlichen, Teilen, Aktualisieren, Dashboards, Abonnements, Berechtigungen. |
| **Mobile Apps** | iOS/Android; eigene Telefonlayouts je Berichtsseite. |
| **Report Server** | On-Premises-Variante für Häuser, die nichts in die Cloud geben dürfen. Funktionsumfang hinkt dem Service hinterher. |
| **Data Gateway** | Brücke zwischen Cloud-Service und lokalen Datenquellen. Ohne Gateway keine Aktualisierung lokaler Daten. |
| **Fabric** | Übergreifende Datenplattform (Lakehouse, Warehouse, Pipelines), in die Power BI als Analyseschicht eingebettet ist. |

## Der Weg einer Auswertung

```
Quelle → Power Query (Transformation) → Datenmodell (Beziehungen, DAX) → Bericht → Service → Nutzer
```

Jede Stufe hat ihre Zuständigkeit. Der häufigste Anfängerfehler ist, Arbeit in der falschen Stufe zu erledigen: Zeilen filtern gehört in Power Query (oder in die Quelle), nicht in ein Visual; Kennzahlen gehören ins Modell, nicht in ein Diagrammfeld.

## Semantisches Modell, Bericht, Dashboard

Diese drei werden ständig verwechselt:

- **Semantisches Modell** (früher: Dataset) — Daten plus Beziehungen plus Measures. Die wiederverwendbare Wahrheit.
- **Bericht** — eine oder mehrere Seiten mit Visuals, hängt an genau einem Modell.
- **Dashboard** — nur im Service; eine Pinnwand aus angehefteten Kacheln, die aus mehreren Berichten stammen können. Es hat kein eigenes Modell.

Ein Modell kann viele Berichte tragen. Das ist der Kern jeder sauberen Governance: **ein zentrales Modell, viele Berichte** — statt zwanzig Dateien mit zwanzig leicht abweichenden Umsatzdefinitionen.

## Lizenzen

| Lizenz | Was geht |
|---|---|
| **Free** | Desktop nutzen, im Service nur im eigenen persönlichen Arbeitsbereich arbeiten. Kein Teilen. |
| **Pro** | Veröffentlichen, teilen, Arbeitsbereiche nutzen — Empfänger brauchen ebenfalls Pro. Der Normalfall in kleineren Häusern. |
| **Premium per User (PPU)** | Pro plus Premium-Funktionen (größere Modelle, häufigere Aktualisierung, Deployment Pipelines, XMLA). Alle Beteiligten brauchen PPU. |
| **Kapazität (Premium/Fabric F-SKU)** | Dedizierte Rechenkapazität. Empfänger können mit Free-Lizenz lesen, wenn der Inhalt in einer Kapazität liegt — der übliche Weg für große Empfängerkreise. |

Die praktische Konsequenz: Solange keine Kapazität gebucht ist, braucht **jeder Leser** eine Pro-Lizenz. Das ist regelmäßig die entscheidende Kostenfrage bei der Einführung.

## Aktualisierung

- **Import-Modus**: Daten liegen komprimiert im Modell. Schnell, aber Stand ist der letzte Refresh. Geplante Aktualisierung im Service: bis 8-mal täglich mit Pro, 48-mal mit Premium/PPU.
- **DirectQuery**: Jede Interaktion fragt die Quelle. Immer aktuell, dafür langsamer und mit DAX-Einschränkungen.
- **Composite / Dual**: Mischung — große Faktentabellen per DirectQuery, Dimensionen importiert.
- **Live Connection**: Verbindung zu einem bestehenden Modell (Analysis Services oder ein anderes Power-BI-Modell). Kein eigenes Modell im Bericht.

Faustregel: **Import**, solange die Datenmenge es zulässt. DirectQuery nur bei echter Echtzeitanforderung oder wenn die Datenmenge das Modell sprengt — es kostet Geschwindigkeit und Modellierungsfreiheit.

::: quiz
F: Worin unterscheidet sich ein Dashboard von einem Bericht?
A: Der Bericht hängt an genau einem semantischen Modell und hat eigene Seiten; das Dashboard existiert nur im Service und ist eine Pinnwand aus Kacheln, die aus mehreren Berichten stammen können.

F: Warum ist „ein Modell, viele Berichte" mehr als eine Aufräumfrage?
A: Weil sonst jede Datei ihre eigene Kennzahldefinition mitbringt und dieselbe Frage je nach Bericht unterschiedlich beantwortet wird.
:::
