---
id: excel-powerquery
title: Power Query und die Sprache M
path: excel/analyse
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [powerquery, etl, m, datenbereinigung, automatisierung]
prereqs: [excel-tabellen]
related: [excel-datenmodell, powerbi-powerquery, prozessauto-werkzeugwahl]
summary: Der ETL-Teil von Excel. Einmal geklickt, danach per Knopfdruck wiederholbar — der größte Zeitgewinn für alle wiederkehrenden Auswertungen.
---

## Kern

Power Query (in der Oberfläche: *Daten ▸ Daten abrufen*) protokolliert jeden Bereinigungsschritt als Liste und wendet ihn beim Aktualisieren erneut an. Das ist der entscheidende Unterschied zur Handarbeit: Der Aufwand fällt **einmal** an.

Der Ablauf ist immer derselbe:
1. **Verbinden** — Datei, Ordner, Datenbank, Web, SharePoint, API
2. **Transformieren** — im Power-Query-Editor
3. **Laden** — als Tabelle, als Verbindung, oder ins Datenmodell

Der typische Anwendungsfall: 30 Monatsdateien in einem Ordner. *Aus Ordner* liest alle, hängt sie aneinander, bereinigt sie in einem Rutsch. Nächsten Monat legt man Datei 31 dazu und drückt Aktualisieren.

## Die Transformationen, die man täglich braucht

- **Erste Zeile als Überschrift**, Typen setzen (mit **Gebietsschema**! — der Punkt, an dem Importe scheitern)
- **Spalten entfernen / andere Spalten entfernen** — letzteres ist robuster, weil neue Fremdspalten nicht durchrutschen
- **Zeilen filtern**, Duplikate entfernen, Fehler entfernen oder ersetzen
- **Spalte teilen** nach Trennzeichen, Position, Groß-/Kleinwechsel
- **Werte ersetzen**, Ausfüllen nach unten (*Fill Down* — rettet jeden Export mit Gruppenüberschriften)
- **Entpivotieren** — die wichtigste Transformation überhaupt: macht aus einer Kreuztabelle wieder eine Liste. *Andere Spalten entpivotieren* ist die stabile Variante
- **Zusammenführen** (Merge = JOIN) und **Anfügen** (Append = UNION)
- **Gruppieren nach** — Aggregation vor dem Laden
- **Benutzerdefinierte Spalte** — der Einstieg in M

## Query Folding

Bei Datenbankquellen versucht Power Query, die Schritte in **SQL zu übersetzen** und den Server rechnen zu lassen. Das ist der Unterschied zwischen 3 Sekunden und 10 Minuten. Rechtsklick auf einen Schritt ▸ *Native Abfrage anzeigen*: Ist der Eintrag aktiv, faltet es noch. Faltungsbrecher sind unter anderem benutzerdefinierte M-Funktionen, `Table.Buffer`, das Hinzufügen von Indexspalten und die meisten Schritte nach einem solchen Bruch. Deshalb: **filtern und reduzieren so früh wie möglich**.

## Sprache M in fünf Sätzen

M ist funktional, **groß-/kleinschreibungssensitiv** und arbeitet mit unveränderlichen Werten. Eine Abfrage ist ein `let`-Ausdruck: eine Folge benannter Schritte, gefolgt von `in` und dem Rückgabeschritt.

```m
let
    Quelle = Excel.CurrentWorkbook(){[Name="Buchungen"]}[Content],
    Typen  = Table.TransformColumnTypes(Quelle, {{"Datum", type date}, {"Betrag", type number}}, "de-DE"),
    Gefiltert = Table.SelectRows(Typen, each [Betrag] > 0),
    Jahr = Table.AddColumn(Gefiltert, "Jahr", each Date.Year([Datum]), Int64.Type)
in
    Jahr
```

`each` ist Kurzform für `(_) =>`, `[Spalte]` greift auf die aktuelle Zeile zu. Schrittnamen mit Leerzeichen stehen in `#"…"`.

**Parameter** (Verwalten ▸ Parameter) machen Dateipfade und Stichtage austauschbar — Pflicht, sobald eine Mappe weitergegeben oder auf einem anderen Rechner betrieben wird.

**Benutzerdefinierte Funktionen** entstehen aus einer parametrisierten Abfrage: `(pfad as text) as table => let … in …`. Damit lässt sich dieselbe Bereinigung auf beliebig viele Dateien anwenden.

## Datenschutzebenen und Fallstricke

- **Datenschutzebenen** (Privacy Levels) können Abfragen dramatisch verlangsamen oder blockieren, weil Excel Datenquellen nicht kombinieren darf. Für interne Auswertungen häufig auf *Organisation* setzen oder bewusst ignorieren.
- **`Table.Buffer`** materialisiert eine Tabelle im Speicher — hilft gegen mehrfache Neuberechnung, bricht aber das Folding.
- **Spaltennamen sind der Vertrag.** Ändert die Quelle eine Überschrift, brechen alle Folgeschritte. Robuster Aufbau nutzt *Andere Spalten entfernen* und benennt früh um.
- **Nur Verbindung erstellen** für Zwischenabfragen, sonst füllt sich die Mappe mit Hilfsblättern.
- Das **Zeilenlimit des Blattes** (1.048.576) gilt beim Laden in eine Tabelle, nicht beim Laden ins Datenmodell.

## Wann Power Query, wann Formeln?

| Aufgabe | Werkzeug |
|---|---|
| wiederkehrender Import, Bereinigung, Zusammenführung | Power Query |
| Berechnung, die sich mit Eingaben live ändert | Formeln |
| Verknüpfung mehrerer Tabellen für die Auswertung | Datenmodell |
| einmalige Sonderauswertung | Formeln oder Blitzvorschau |

Faustregel: Alles, was *vor* der Auswertung passiert, gehört in Power Query. Alles, was *während* der Auswertung passiert, in Formeln oder DAX.

::: quiz
F: Was ist Query Folding und woran erkennst du, dass es noch funktioniert?
A: Übersetzung der Schritte in eine native Datenbankabfrage. Rechtsklick auf den Schritt ▸ „Native Abfrage anzeigen" ist nur aktiv, solange gefaltet wird.

F: Welche Transformation macht aus einer Kreuztabelle mit Monatsspalten wieder eine auswertbare Liste?
A: Entpivotieren — konkret „Andere Spalten entpivotieren", damit neue Monate automatisch mitgehen.
:::
