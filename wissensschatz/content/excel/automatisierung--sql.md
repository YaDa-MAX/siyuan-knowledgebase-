---
id: excel-sql
title: SQL für Excel-Anwender
path: excel/automatisierung
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [sql, datenbank, ado, abfragen, joins]
prereqs: [excel-tabellen, excel-nachschlagen]
related: [excel-powerquery, excel-vorlagen, excel-datenmodell, powerbi-powerquery]
summary: Von SVERWEIS zu JOIN, von SUMMEWENNS zu GROUP BY — SQL aus der Excel-Denkweise heraus erklärt, plus drei Wege, es aus Excel heraus zu nutzen.
---

## Warum das für Excel-Anwender lohnt

Ab einer gewissen Datenmenge hört Excel auf, das richtige Werkzeug zu sein — nicht weil es zu wenig kann, sondern weil es die Daten in die Datei holen muss. SQL dreht das um: Die Berechnung passiert dort, wo die Daten liegen, und nur das Ergebnis kommt an.

Der Einstieg ist leichter, als er wirkt, weil die Konzepte bereits vertraut sind:

| Excel | SQL |
|---|---|
| Tabelle | Tabelle bzw. Sicht |
| Spalte | Spalte |
| Zeile filtern (AutoFilter) | `WHERE` |
| `SVERWEIS` / `XVERWEIS` | `LEFT JOIN` |
| PivotTable | `GROUP BY` mit Aggregaten |
| `SUMMEWENNS` | `SUM(...)` mit `WHERE`/`GROUP BY` |
| `ZÄHLENWENNS` | `COUNT(*)` mit `WHERE` |
| Bedingte Spalte, verschachteltes `WENN` | `CASE WHEN ... THEN ... END` |
| Berechnete Spalte in der Pivot-Wertansicht | `HAVING` (Filter **nach** Aggregation) |
| `KGRÖSSTE` / Top-N-Filter | `ORDER BY ... DESC` mit `TOP` / `LIMIT` |
| Duplikate entfernen | `DISTINCT` bzw. `GROUP BY` |
| Tabellen untereinander hängen | `UNION ALL` |
| `WENNFEHLER(x/y;0)` | `x / NULLIF(y, 0)` |
| Hilfsspalte mit kumulierter Summe | Fensterfunktion `SUM(...) OVER (...)` |
| `XVERWEIS` mit Suchmodus −1 | `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ... DESC)` |

## Die eine Sache, die anders funktioniert

**Die Auswertungsreihenfolge ist nicht die Schreibreihenfolge.**

```
geschrieben:  SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY
ausgewertet:  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

Daraus folgen die beiden häufigsten Anfängerfehler:
- Ein im `SELECT` vergebener Alias steht im `WHERE` **nicht** zur Verfügung (im `ORDER BY` dagegen schon).
- `WHERE` filtert **vor** der Aggregation, `HAVING` **danach**. „Nur Häuser mit über 100.000 € Umsatz" gehört ins `HAVING`, „nur Buchungen ab Januar" ins `WHERE`.

Und der zweite Denkwechsel: **SQL arbeitet mengenorientiert.** Man beschreibt, *was* man haben will, nicht *wie* es Zeile für Zeile berechnet wird. Wer in SQL Schleifen baut, hat meist die falsche Formulierung gewählt.

## NULL — der Stolperstein

`NULL` ist nicht 0 und nicht Leerstring, sondern „unbekannt". **Jeder** Vergleich mit `NULL` ergibt `UNKNOWN`, auch `NULL = NULL`.

```sql
WHERE Bemerkung IS NOT NULL      -- richtig
WHERE Bemerkung <> NULL          -- liefert nie eine Zeile
```

Folgen im Alltag: `COUNT(*)` zählt Zeilen, `COUNT(Spalte)` nur Nicht-NULL-Werte. `AVG` ignoriert `NULL` — das ist selten das Gewollte. `SUM` über lauter `NULL` ergibt `NULL`, nicht 0. Und `NOT IN` mit einem einzigen `NULL` in der Unterabfrage liefert **gar keine** Zeilen — deshalb ist `NOT EXISTS` die sichere Wahl.

Werkzeuge: `COALESCE(x, ersatz)` (das SQL-`WENNFEHLER` für Leerwerte) und `NULLIF(x, 0)` (verhindert Division durch null).

## Fensterfunktionen — der Grund, warum sich SQL für Auswerter lohnt

Sie berechnen etwas über eine Gruppe, **ohne** die Zeilen zusammenzufassen. Genau das, wofür man in Excel Hilfsspalten baut:

```sql
SELECT
      Datum, Haus, Betrag
    , SUM(Betrag) OVER (PARTITION BY Haus ORDER BY Datum
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS Kumuliert
    , AVG(Betrag) OVER (PARTITION BY Haus ORDER BY Datum
                        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)         AS Schnitt7Tage
    , LAG(Betrag) OVER (PARTITION BY Haus ORDER BY Datum)                 AS Vortag
    , RANK()      OVER (PARTITION BY Haus ORDER BY Betrag DESC)           AS Rang
FROM Buchungen;
```

`PARTITION BY` ist das „je Gruppe", `ORDER BY` die Reihenfolge innerhalb der Gruppe, `ROWS BETWEEN` das gleitende Fenster. Verfügbar in SQL Server 2012+, MySQL 8+, MariaDB 10.2+, PostgreSQL und SQLite 3.25+.

## Drei Wege, SQL aus Excel zu nutzen

**1 — Power Query mit nativer Abfrage** *(der Regelfall)*
Daten ▸ Daten abrufen ▸ Aus Datenbank ▸ Erweiterte Optionen. Der Text geht direkt an den Server.
Wichtig: Eine native Abfrage **bricht das Query Folding** für alle nachfolgenden Schritte. Deshalb bereits im SQL filtern und aggregieren, nicht die Rohtabelle laden und danach in Power Query einschränken.

**2 — ADO aus VBA** *(wenn Excel selbst die Abfrage steuern soll)*
Das Modul `vorlagen/vba/modSqlAdo.bas` erledigt Verbindung, Ausführung und das Schreiben ins Blatt. `CopyFromRecordset` schreibt das gesamte Ergebnis in einem Zug.

Damit lässt sich auch **die eigene Arbeitsmappe** wie eine Datenbank abfragen — Blattnamen bekommen ein `$`:
```sql
SELECT [Haus], SUM([Betrag]) AS Umsatz
FROM   [Buchungen$]
GROUP BY [Haus]
```
Grenzen des ACE-Treibers: keine Fensterfunktionen, Spaltentypen werden aus den ersten Zeilen geraten (Abhilfe: `IMEX=1`), und die Bitversion des Treibers muss zu Office passen.

**3 — Sicht in der Datenbank** *(der sauberste Weg)*
Die Logik lebt einmal in einer `VIEW`, Excel und Power BI holen nur noch `SELECT * FROM v_Tagesumsatz`. Eine Änderung wirkt sofort für alle Berichte — und niemand pflegt dieselbe Kennzahldefinition an fünf Stellen.

## Sicherheit

**Werte niemals in den Abfragetext hineinformatieren.** Was in Excel harmlos aussieht, ist in SQL eine Einfallstelle:

```vb
' falsch — SQL-Injection und Formatprobleme bei Datum und Dezimaltrenner
sql = "SELECT * FROM Buchungen WHERE Haus = '" & Range("B1").Value & "'"

' richtig — Parameter, siehe AbfrageMitParameter in modSqlAdo.bas
sql = "SELECT * FROM Buchungen WHERE Haus = ? AND Datum >= ?"
```

Weiter: Zugangsdaten gehören nicht in Code oder Tabellen, sondern in die Windows-Authentifizierung, ein Dienstkonto oder einen Secret Store. Lesende Zugriffe mit einem Konto, das **nur** lesen darf. Und personenbezogene Auswertungen unterliegen denselben Regeln wie jede andere Verarbeitung — Zweckbindung, Löschfristen, Mitbestimmung.

## Wann SQL, wann Excel?

| Situation | Werkzeug |
|---|---|
| Daten liegen in einer Datenbank, Auswertung wiederkehrend | SQL, am besten als Sicht |
| Daten in Dateien, Aufbereitung wiederkehrend | Power Query |
| Einmalige Sonderauswertung mit vorhandenen Daten | Excel-Formeln |
| Rechenmodell, das sich mit Eingaben live ändert | Excel |
| Millionen Zeilen, verknüpfte Tabellen, viele Berichte | Datenmodell / Power BI auf SQL-Basis |
| Dieselbe Kennzahl in mehreren Berichten | Sicht oder semantisches Modell — nie mehrfach |

::: quiz
F: Warum steht ein im SELECT vergebener Alias im WHERE nicht zur Verfügung?
A: Weil WHERE vor SELECT ausgewertet wird. Im ORDER BY funktioniert er, weil dieses zuletzt läuft.

F: Was ist der Unterschied zwischen WHERE und HAVING?
A: WHERE filtert einzelne Zeilen vor der Gruppierung, HAVING filtert Gruppen nach der Aggregation.

F: Warum ist `NOT EXISTS` gegenüber `NOT IN` vorzuziehen?
A: Enthält die Unterabfrage von `NOT IN` auch nur einen NULL-Wert, liefert die gesamte Abfrage keine Zeilen — bei `NOT EXISTS` passiert das nicht.
:::
