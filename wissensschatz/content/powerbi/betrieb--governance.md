---
id: powerbi-betrieb
title: Betrieb — Arbeitsbereiche, Berechtigungen, RLS, Aktualisierung
path: powerbi/betrieb
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [governance, rls, deployment, sicherheit, betrieb]
prereqs: [powerbi-komponenten]
related: [powerbi-performance, prozessauto-governance, meta-pflegeroutine]
summary: Was nach dem Veröffentlichen kommt: Rollen, Zeilensicherheit, Gateway, Deployment-Pipelines und die Frage, wer nachts den Refresh repariert.
---

## Arbeitsbereiche und Rollen

| Rolle | Darf |
|---|---|
| **Admin** | alles, inklusive Arbeitsbereich löschen und Zugriffe vergeben |
| **Member** | Inhalte veröffentlichen, teilen, bearbeiten, App aktualisieren |
| **Contributor** | Inhalte erstellen und bearbeiten, aber nicht teilen |
| **Viewer** | nur lesen |

**Apps** sind der richtige Verteilweg an größere Empfängerkreise: Der Arbeitsbereich bleibt Werkstatt, die App ist die veröffentlichte Fassung mit eigener Navigation und eigenem Berechtigungssatz. Direktes Teilen einzelner Berichte skaliert nicht und wird nach einem Jahr unübersichtlich.

Bewährte Struktur: je Fachbereich ein Arbeitsbereich, zusätzlich ein separater für zentrale semantische Modelle. Berichte verbinden sich per Live-Connection mit dem zentralen Modell.

## Zeilensicherheit (RLS)

Rollen werden im Desktop definiert (Modellierung ▸ Rollen verwalten), Mitglieder im Service zugewiesen.

**Statische Rolle:**
```dax
[Region] = "Nord"
```

**Dynamische Rolle** — eine Regel für alle:
```dax
[MitarbeiterEmail] = USERPRINCIPALNAME ()
```
Dazu eine Berechtigungstabelle (Benutzer ▸ erlaubte Regionen/Häuser), die über eine Beziehung in die Dimensionen filtert.

Wichtige Punkte:

- RLS wirkt **nur auf Viewer**. Wer Bearbeitungsrechte im Arbeitsbereich hat, sieht alles.
- **Bidirektionale Beziehungen können RLS aushebeln.** Bei aktivierter RLS erfordert bidirektionales Filtern die ausdrückliche Option „Sicherheitsfilter in beide Richtungen anwenden" — und sorgfältige Prüfung.
- Testen über *Als Rolle anzeigen* im Desktop und *Testen als Rolle* im Service. Beides gehört zur Abnahme, nicht zur Kür.
- **OLS** (Objektsicherheit, ganze Tabellen/Spalten ausblenden) gibt es nur über externe Werkzeuge wie Tabular Editor.
- RLS schützt die Daten im Bericht — nicht die Datei. Wer die `.pbix` bekommt, hat alles.

## Aktualisierung

- **Geplante Aktualisierung**: Pro bis 8×/Tag, Premium/PPU bis 48×/Tag. Zeitzone beachten.
- **Gateway** für lokale Quellen: als **Standardmodus** (zentral, mehrere Nutzer, ausfallsicher clusterbar), nicht im persönlichen Modus. Der persönliche Modus hängt an einem Konto und stirbt mit dessen Austritt.
- **Datenquellen-Anmeldeinformationen** liegen beim Veröffentlichenden. Ein Dienstkonto statt eines persönlichen Kontos verwenden — sonst bricht die Aktualisierung, wenn jemand das Passwort ändert oder das Haus verlässt.
- **Fehlerbenachrichtigung** an einen Verteiler, nicht an eine Einzelperson.
- **Inkrementelle Aktualisierung** ab mittleren Datenmengen einrichten: Parameter `RangeStart`/`RangeEnd` in Power Query, Richtlinie am Modell.

## Deployment-Pipelines

Premium/PPU-Funktion: drei Stufen — Entwicklung, Test, Produktion. Inhalte werden zwischen den Stufen befördert, **Regeln** tauschen dabei Datenquellen und Parameter aus (Testdatenbank gegen Produktivdatenbank).

Ohne Premium bleibt der Behelf: getrennte Arbeitsbereiche plus Parameter in Power Query, die per Hand umgestellt werden. Funktioniert, ist aber fehleranfällig — der Schritt zur Pipeline ist meist die erste echte Premium-Rechtfertigung.

## Dokumentation und Übergabe

Was in jedem produktiven Modell hinterlegt sein sollte:

- **Beschreibungen** an Tabellen und Measures (im Desktop pflegbar, erscheinen als QuickInfo im Feldbereich).
- **Datenwörterbuch**: Was heißt „Umsatz"? Netto? Storno enthalten? Welcher Datumsbezug?
- **Herkunft und Rhythmus** jeder Quelle.
- **Verantwortliche**: fachlich und technisch, je mit Vertretung.
- **Herkunftsansicht** (Lineage View) im Service nutzen, um Abhängigkeiten sichtbar zu machen, bevor etwas gelöscht wird.
- **Sensitivity Labels** (Vertraulichkeitsbezeichnungen), wo Personaldaten im Spiel sind — sie wandern beim Export nach Excel und PDF mit.

## Datenschutz

Sobald personenbezogene Daten verarbeitet werden — und bei Personal-, Zeiterfassungs- oder Gästedaten ist das immer der Fall:

- Verarbeitungszweck und Rechtsgrundlage klären, Verzeichnis von Verarbeitungstätigkeiten ergänzen.
- **Datenminimierung**: aggregiert statt personenscharf, wo es fachlich reicht.
- Löschfristen auch im Modell umsetzen, nicht nur im Quellsystem.
- **Mitbestimmung beachten**: Auswertungen, die Leistung oder Verhalten von Beschäftigten überwachen können, sind in Betrieben mit Betriebsrat mitbestimmungspflichtig — siehe Betriebsverfassung. Das gilt schon für ein Dashboard mit Produktivität je Mitarbeiter.

::: quiz
F: Warum ist der persönliche Gateway-Modus für produktive Berichte ungeeignet?
A: Er hängt am Konto und Rechner einer einzelnen Person. Fällt sie aus oder verlässt das Haus, bricht die Aktualisierung. Der Standardmodus ist zentral und clusterbar.

F: Wer sieht trotz eingerichteter RLS alle Daten?
A: Alle mit Bearbeitungsrechten im Arbeitsbereich (Admin, Member, Contributor). RLS greift nur für Viewer.
:::
