---
id: powerbi-powerquery
title: Datenbeschaffung — Connectoren, Folding, Dataflows
path: powerbi/datenbeschaffung
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [powerquery, etl, dataflow, folding, aktualisierung]
prereqs: [powerbi-komponenten]
related: [excel-powerquery, powerbi-performance, powerbi-sternschema]
summary: Dieselbe Engine wie in Excel, aber mit anderen Betriebsfragen: Folding, Parameter, inkrementelle Aktualisierung und wiederverwendbare Dataflows.
---

## Der Grundsatz

**Transformiere so weit stromaufwärts wie möglich.** Die Rangfolge:

1. In der **Quelle** (Sicht in der Datenbank, ETL im Data Warehouse) — am besten.
2. In **Power Query mit Folding** — sehr gut.
3. In Power Query **ohne Folding** — brauchbar.
4. Als **berechnete Spalte in DAX** — nur wenn nötig.
5. Im **Visual** — nur für Anzeigefragen.

Jede Stufe abwärts kostet Aktualisierungszeit, Speicher und Nachvollziehbarkeit.

## Query Folding in der Praxis

Power Query übersetzt Schritte in die Sprache der Quelle (meist SQL), solange es geht. Prüfen: Rechtsklick auf den Schritt ▸ *Native Abfrage anzeigen*. Ist der Eintrag ausgegraut, ist das Folding an dieser Stelle gebrochen.

Bekannte Faltungsbrecher: `Table.Buffer`, Indexspalten hinzufügen, benutzerdefinierte M-Funktionen, einige Datums- und Textfunktionen, das Kombinieren von Quellen unterschiedlicher Art — und alles, was nach einem Bruch folgt.

Deshalb: **Filtern und Spalten entfernen zuerst.** Ein Schritt, der 90 % der Zeilen aussortiert, gehört an den Anfang, damit die Datenbank ihn ausführt.

## Parameter

Parameter sind Pflicht, sobald ein Modell mehr als einen Lebenslauf hat:

- `Server`, `Datenbank` — für den Wechsel zwischen Test und Produktion.
- `Pfad` — für Dateiquellen auf verschiedenen Rechnern.
- `RangeStart` / `RangeEnd` (Typ Datum/Uhrzeit) — technische Voraussetzung für die inkrementelle Aktualisierung.
- Fachliche Parameter wie `Startjahr`, um Entwicklungsdateien klein zu halten.

## Inkrementelle Aktualisierung

Einrichten in zwei Schritten:

1. In Power Query die Faktentabelle mit `RangeStart`/`RangeEnd` auf die Datumsspalte filtern (`>= RangeStart` und `< RangeEnd`).
2. Am Modell die Richtlinie setzen: Daten archivieren ab *n* Jahren, aktualisieren die letzten *m* Tage.

Der Service legt daraus Partitionen an und lädt nur die jüngsten neu. Voraussetzung ist **funktionierendes Folding** auf dem Datumsfilter — sonst zieht Power BI trotzdem alles und filtert nachträglich.

Die Option „Nur vollständige Perioden aktualisieren" verhindert halb geladene Tage. „Änderungen erkennen" über eine Zeitstempelspalte spart weitere Läufe.

## Dataflows

Ein **Dataflow** ist Power Query im Service: Die Abfrage läuft zentral und legt das Ergebnis im Data Lake ab. Mehrere Modelle greifen darauf zu.

Wann sinnvoll:
- Dieselbe Bereinigung wird von mehreren Modellen gebraucht (Kalender, Kunden-, Artikelstammdaten).
- Die Quelle soll nur einmal statt zehnmal belastet werden.
- Fachbereiche sollen Daten nutzen, ohne Zugriff auf das Quellsystem zu bekommen.

Nachteil: eine zusätzliche Ebene mit eigenem Aktualisierungsplan, eigener Fehlerquelle und eigener Abhängigkeitskette. Für ein einzelnes Modell lohnt sich das nicht.

## Verbindungsmodi

| Modus | Wann |
|---|---|
| **Import** | Standard. Beste Performance, volle DAX-Funktionalität. |
| **DirectQuery** | Echtzeitanforderung oder Datenmenge zu groß. Langsamer, DAX eingeschränkt, Quelle wird belastet. |
| **Dual** | Dimensionstabellen, die je nach Abfrage importiert oder durchgereicht werden — Grundlage für Aggregationen. |
| **Live Connection** | Verbindung zu einem bestehenden Modell (AAS, Fabric, anderes Power-BI-Modell). Kein eigenes Modell. |

## Datenschutzebenen

Die Privacy Levels (Öffentlich / Organisation / Privat) verhindern, dass Daten einer Quelle beim Kombinieren an eine andere übertragen werden. Sie sind ein echtes Sicherheitsmerkmal — und zugleich die häufigste Ursache dafür, dass eine Abfrage plötzlich um Größenordnungen langsamer wird oder mit einer Formel-Firewall-Meldung abbricht.

Sauberer Umgang: Quellen konsistent einstufen und die Abfragen so bauen, dass Kombinationen erst in einer eigenen Abfrage stattfinden. Das pauschale Abschalten der Prüfung ist bequem, aber bei personenbezogenen Daten die falsche Antwort.

::: quiz
F: Warum gehören Filterschritte an den Anfang einer Abfrage?
A: Damit sie noch gefaltet und von der Datenquelle ausgeführt werden. Nach einem Faltungsbruch verarbeitet Power Query alle Zeilen selbst.

F: Welche technische Voraussetzung hat die inkrementelle Aktualisierung?
A: Zwei Parameter `RangeStart`/`RangeEnd` als Datumsfilter auf der Faktentabelle — und funktionierendes Query Folding auf diesem Filter.
:::
