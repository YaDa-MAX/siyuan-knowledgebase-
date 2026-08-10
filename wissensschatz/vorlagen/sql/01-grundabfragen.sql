-- =====================================================================
-- SQL-Grundmuster für Auswertungen, die sonst in Excel entstehen
-- Dialekt: ANSI-nah, Hinweise auf T-SQL (SQL Server) und MySQL/MariaDB.
-- Diese Datei ist ein Nachschlagewerk, kein lauffähiges Skript am Stück.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Der Grundaufbau und die tatsächliche Auswertungsreihenfolge
-- ---------------------------------------------------------------------
-- Geschrieben wird:   SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY
-- Ausgewertet wird:   FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY
--
-- Daraus folgt der häufigste Anfängerfehler: Ein im SELECT vergebener Alias
-- steht im WHERE noch nicht zur Verfügung, im ORDER BY dagegen schon.

SELECT
      b.Datum
    , b.Haus
    , SUM(b.Betrag)                    AS Umsatz
    , COUNT(*)                         AS Buchungen
    , AVG(b.Betrag)                    AS Durchschnitt
FROM        Buchungen AS b
WHERE       b.Datum >= '2026-01-01'
        AND b.Datum <  '2027-01-01'
        AND b.Storniert = 0
GROUP BY    b.Datum, b.Haus
HAVING      SUM(b.Betrag) > 0
ORDER BY    b.Datum, Umsatz DESC;


-- ---------------------------------------------------------------------
-- 2) JOINs — das SQL-Gegenstück zu SVERWEIS
-- ---------------------------------------------------------------------
-- INNER JOIN  = nur Zeilen mit Treffer auf beiden Seiten
-- LEFT  JOIN  = alle Zeilen links, rechts NULL wenn kein Treffer
--               (entspricht SVERWEIS mit WENNNV)
-- FULL  JOIN  = beide Seiten vollständig
-- CROSS JOIN  = jede Zeile mit jeder (Kalender × Zimmer erzeugen)

SELECT
      b.BuchungID
    , g.Nachname
    , z.Kategorie
    , b.Betrag
FROM        Buchungen  AS b
INNER JOIN  Gaeste     AS g ON g.GastID   = b.GastID
LEFT  JOIN  Zimmer     AS z ON z.ZimmerID = b.ZimmerID;

-- Verwaiste Datensätze finden (Fremdschlüssel ohne Gegenstück):
SELECT      b.*
FROM        Buchungen AS b
LEFT JOIN   Gaeste    AS g ON g.GastID = b.GastID
WHERE       g.GastID IS NULL;


-- ---------------------------------------------------------------------
-- 3) NULL richtig behandeln
-- ---------------------------------------------------------------------
-- NULL ist nicht 0 und nicht Leerstring. Jeder Vergleich mit NULL
-- ergibt UNKNOWN — auch NULL = NULL.

SELECT
      COALESCE(b.Bemerkung, '(keine)')          AS Bemerkung
    , COALESCE(b.Rabatt, 0)                     AS Rabatt
    , CASE WHEN b.Betrag IS NULL THEN 'offen'
           ELSE 'gebucht' END                   AS Status
FROM  Buchungen AS b
WHERE b.Bemerkung IS NOT NULL;          -- NICHT: <> NULL

-- Achtung bei Aggregaten: COUNT(*) zählt Zeilen, COUNT(Spalte) zählt
-- Nicht-NULL-Werte. AVG ignoriert NULL — das ist selten das Gewollte.


-- ---------------------------------------------------------------------
-- 4) Datumsfilter, die einen Index nutzen können
-- ---------------------------------------------------------------------
-- Falsch (Funktion auf der Spalte verhindert Indexnutzung):
--   WHERE YEAR(Datum) = 2026
-- Richtig — Halboffenes Intervall, funktioniert auch mit Uhrzeitanteil:
--   WHERE Datum >= '2026-01-01' AND Datum < '2027-01-01'

-- Monatsgruppierung ohne Funktionsfilter:
SELECT
      CAST(DATEADD(DAY, 1 - DAY(b.Datum), CAST(b.Datum AS date)) AS date) AS Monat  -- T-SQL
    , SUM(b.Betrag) AS Umsatz
FROM  Buchungen AS b
WHERE b.Datum >= '2026-01-01' AND b.Datum < '2027-01-01'
GROUP BY CAST(DATEADD(DAY, 1 - DAY(b.Datum), CAST(b.Datum AS date)) AS date)
ORDER BY Monat;
-- MySQL:      DATE_FORMAT(b.Datum, '%Y-%m-01')
-- PostgreSQL: DATE_TRUNC('month', b.Datum)


-- ---------------------------------------------------------------------
-- 5) Bedingte Aggregation — die Kreuztabelle in SQL
-- ---------------------------------------------------------------------
-- Das SQL-Gegenstück zu SUMMEWENNS und zur Pivot-Spaltenaufteilung.

SELECT
      b.Haus
    , SUM(CASE WHEN b.Kanal = 'Direkt' THEN b.Betrag ELSE 0 END) AS Direkt
    , SUM(CASE WHEN b.Kanal = 'OTA'    THEN b.Betrag ELSE 0 END) AS OTA
    , SUM(CASE WHEN b.Kanal = 'Firma'  THEN b.Betrag ELSE 0 END) AS Firma
    , COUNT(DISTINCT b.GastID)                                   AS Gaeste
    , SUM(b.Betrag)                                              AS Gesamt
FROM     Buchungen AS b
GROUP BY b.Haus
ORDER BY Gesamt DESC;


-- ---------------------------------------------------------------------
-- 6) Fensterfunktionen — Rang, Vorperiode, laufende Summe
-- ---------------------------------------------------------------------
-- Der Teil von SQL, der Excel-Denkweisen am direktesten ersetzt.
-- Verfügbar in SQL Server 2012+, MySQL 8+, MariaDB 10.2+, PostgreSQL, SQLite 3.25+.

SELECT
      b.Haus
    , b.Datum
    , b.Betrag
    , SUM(b.Betrag)  OVER (PARTITION BY b.Haus ORDER BY b.Datum
                           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS Kumuliert
    , AVG(b.Betrag)  OVER (PARTITION BY b.Haus ORDER BY b.Datum
                           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)         AS Schnitt7Tage
    , LAG(b.Betrag, 1)  OVER (PARTITION BY b.Haus ORDER BY b.Datum)          AS Vortag
    , b.Betrag - LAG(b.Betrag, 1) OVER (PARTITION BY b.Haus ORDER BY b.Datum) AS Delta
    , RANK()       OVER (PARTITION BY b.Haus ORDER BY b.Betrag DESC)         AS Rang
    , ROW_NUMBER() OVER (PARTITION BY b.Haus ORDER BY b.Datum DESC)          AS Zeilennr
FROM Buchungen AS b;

-- Jüngsten Datensatz je Gruppe holen (das SQL-Pendant zu XVERWEIS mit Suchmodus -1):
WITH nummeriert AS (
    SELECT b.*,
           ROW_NUMBER() OVER (PARTITION BY b.GastID ORDER BY b.Datum DESC) AS rn
    FROM   Buchungen AS b
)
SELECT * FROM nummeriert WHERE rn = 1;


-- ---------------------------------------------------------------------
-- 7) CTE (WITH) — lesbare Zerlegung statt verschachtelter Unterabfragen
-- ---------------------------------------------------------------------
WITH basis AS (
    SELECT b.Haus, b.Datum, b.Betrag
    FROM   Buchungen AS b
    WHERE  b.Storniert = 0
), monat AS (
    SELECT Haus,
           DATE_FORMAT(Datum, '%Y-%m') AS Monat,     -- MySQL-Schreibweise
           SUM(Betrag)                 AS Umsatz
    FROM   basis
    GROUP  BY Haus, DATE_FORMAT(Datum, '%Y-%m')
)
SELECT
      m.Haus
    , m.Monat
    , m.Umsatz
    , LAG(m.Umsatz) OVER (PARTITION BY m.Haus ORDER BY m.Monat) AS Vormonat
    , ROUND( (m.Umsatz - LAG(m.Umsatz) OVER (PARTITION BY m.Haus ORDER BY m.Monat))
             / NULLIF(LAG(m.Umsatz) OVER (PARTITION BY m.Haus ORDER BY m.Monat), 0) * 100, 1)
      AS Veraenderung_Prozent
FROM  monat AS m
ORDER BY m.Haus, m.Monat;

-- NULLIF(x, 0) ist das SQL-Gegenstück zu DIVIDE bzw. WENNFEHLER:
-- es verhindert die Division durch null.


-- ---------------------------------------------------------------------
-- 8) Datenqualität prüfen — das SQL-Pendant zum Kontrollblock
-- ---------------------------------------------------------------------
SELECT 'Dubletten Schluessel' AS Pruefung, COUNT(*) AS Treffer
FROM  (SELECT Schluessel FROM Stammdaten GROUP BY Schluessel HAVING COUNT(*) > 1) AS d
UNION ALL
SELECT 'Pflichtfeld leer', COUNT(*) FROM Stammdaten WHERE Name IS NULL OR LTRIM(RTRIM(Name)) = ''
UNION ALL
SELECT 'Datum in der Zukunft', COUNT(*) FROM Buchungen WHERE Datum > CURRENT_DATE
UNION ALL
SELECT 'Negativer Betrag ohne Storno', COUNT(*) FROM Buchungen WHERE Betrag < 0 AND Storniert = 0
UNION ALL
SELECT 'Verwaiste Fremdschluessel', COUNT(*)
FROM   Buchungen b LEFT JOIN Gaeste g ON g.GastID = b.GastID
WHERE  g.GastID IS NULL;


-- ---------------------------------------------------------------------
-- 9) Gruppen finden, die etwas NICHT haben
-- ---------------------------------------------------------------------
-- Die Frage, die in Excel ohne Dimensionstabelle nicht beantwortbar ist:
-- "Welche Zimmerkategorien wurden im März nicht gebucht?"

SELECT z.Kategorie
FROM   Zimmerkategorien AS z
WHERE  NOT EXISTS (
        SELECT 1
        FROM   Buchungen AS b
        WHERE  b.Kategorie = z.Kategorie
          AND  b.Datum >= '2026-03-01' AND b.Datum < '2026-04-01'
       );
-- NOT EXISTS ist gegenüber NOT IN vorzuziehen: NOT IN liefert bei
-- einem einzigen NULL in der Unterabfrage gar keine Zeilen.


-- ---------------------------------------------------------------------
-- 10) Performance-Grundregeln
-- ---------------------------------------------------------------------
-- * SELECT * vermeiden — nur benötigte Spalten holen.
-- * Keine Funktion auf der gefilterten Spalte (verhindert Indexnutzung).
-- * Früh filtern: WHERE vor JOIN-Erweiterung wirken lassen.
-- * Index auf Fremdschlüssel und häufig gefilterte Spalten.
-- * DISTINCT ist oft ein Hinweis auf einen fehlerhaften JOIN, nicht die Lösung.
-- * Ausführungsplan ansehen (T-SQL: SET SHOWPLAN_ALL / STATISTICS IO,
--   MySQL: EXPLAIN, PostgreSQL: EXPLAIN ANALYZE).
