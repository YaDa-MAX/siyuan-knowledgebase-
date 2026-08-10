-- =====================================================================
-- SQL gegen Excel-Dateien und aus Excel heraus
-- Drei Wege, jeweils mit lauffähigem Beispiel.
-- =====================================================================

-- ---------------------------------------------------------------------
-- WEG 1: SQL innerhalb einer Excel-Mappe über ADO (VBA)
-- ---------------------------------------------------------------------
-- Die Mappe wird über den ACE-Treiber wie eine Datenbank angesprochen.
-- Blattnamen bekommen ein $ und eckige Klammern: [Buchungen$]
-- Benannte Bereiche und Tabellen gehen ohne $: [Umsatzdaten]
--
-- Diese Abfrage funktioniert 1:1 im VBA-Beispiel weiter unten:

SELECT
      [Haus]
    , FORMAT([Datum], 'yyyy-mm')          AS Monat
    , SUM([Betrag])                       AS Umsatz
    , COUNT(*)                            AS Buchungen
FROM  [Buchungen$]
WHERE [Betrag] > 0
  AND [Datum] >= #2026-01-01#             -- Datumsliterale in Rauten
  AND [Datum] <  #2027-01-01#
GROUP BY [Haus], FORMAT([Datum], 'yyyy-mm')
ORDER BY [Haus], Monat;

-- Zwei Blätter verbinden (JOIN funktioniert auch hier):
SELECT
      b.[BuchungID]
    , g.[Nachname]
    , b.[Betrag]
FROM  [Buchungen$] AS b
INNER JOIN [Gaeste$] AS g ON g.[GastID] = b.[GastID];

-- Auf eine ANDERE, geschlossene Datei zugreifen:
SELECT * FROM [Excel 12.0;HDR=YES;DATABASE=C:\Daten\Vorjahr.xlsx].[Buchungen$];

-- Grenzen des ACE-Treibers:
--   * kein Fensterfunktions-Support (kein LAG, kein ROW_NUMBER)
--   * Spaltentypen werden aus den ersten Zeilen geraten
--     -> gemischte Spalten liefern NULL. Abhilfe: IMEX=1 im Verbindungsstring
--   * kein UPDATE auf Formelzellen
--   * Bitversion muss zu Excel passen (32/64)


-- ---------------------------------------------------------------------
-- WEG 2: Native Abfrage in Power Query
-- ---------------------------------------------------------------------
-- Daten > Daten abrufen > Aus Datenbank > Erweiterte Optionen
-- Der SQL-Text wird direkt an den Server geschickt.
--
-- WICHTIG: Eine native Abfrage bricht das Query Folding für alle
-- nachfolgenden Schritte. Deshalb hier bereits so weit filtern und
-- aggregieren wie möglich — nicht die Rohtabelle laden.

SELECT
      k.Kategorie
    , CAST(b.Datum AS date)               AS Datum
    , COUNT(*)                            AS Naechte
    , SUM(b.Betrag)                       AS Logisumsatz
    , SUM(b.Betrag) / NULLIF(COUNT(*), 0) AS ADR
FROM        dbo.Buchungen        AS b
INNER JOIN  dbo.Zimmerkategorien AS k ON k.KategorieID = b.KategorieID
WHERE       b.Datum >= DATEADD(YEAR, -2, CAST(GETDATE() AS date))
        AND b.Storniert = 0
GROUP BY    k.Kategorie, CAST(b.Datum AS date);

-- Parametrisierte Variante für die inkrementelle Aktualisierung:
-- In Power Query zwei Parameter RangeStart und RangeEnd anlegen und
-- den Filter als M-Schritt setzen statt im SQL — nur so bleibt das
-- Folding für die Partitionierung erhalten.


-- ---------------------------------------------------------------------
-- WEG 3: Sicht (View) in der Datenbank statt Abfrage in Excel
-- ---------------------------------------------------------------------
-- Der sauberste Weg: Die Logik lebt in der Datenbank, Excel und Power BI
-- greifen nur zu. Eine Änderung wirkt sofort für alle Berichte.

CREATE OR ALTER VIEW dbo.v_Tagesumsatz AS
SELECT
      CAST(b.Datum AS date)                            AS Datum
    , h.Haus
    , k.Kategorie
    , COUNT(*)                                         AS VerkaufteZimmer
    , SUM(b.Betrag)                                    AS Logisumsatz
    , SUM(b.Betrag) / NULLIF(COUNT(*), 0)              AS ADR
    , SUM(b.Betrag) / NULLIF(MAX(h.ZimmerGesamt), 0)   AS RevPAR
FROM        dbo.Buchungen        AS b
INNER JOIN  dbo.Haeuser          AS h ON h.HausID      = b.HausID
INNER JOIN  dbo.Zimmerkategorien AS k ON k.KategorieID = b.KategorieID
WHERE       b.Storniert = 0
GROUP BY    CAST(b.Datum AS date), h.Haus, k.Kategorie;

-- Danach in Excel/Power BI schlicht:
--   SELECT * FROM dbo.v_Tagesumsatz WHERE Datum >= '2026-01-01';


-- ---------------------------------------------------------------------
-- Kalendertabelle in SQL erzeugen
-- ---------------------------------------------------------------------
-- Jedes Datenmodell braucht sie. Einmal anlegen, überall nutzen.

WITH tage AS (
    SELECT CAST('2020-01-01' AS date) AS d
    UNION ALL
    SELECT DATEADD(DAY, 1, d) FROM tage WHERE d < '2035-12-31'
)
SELECT
      d                                                   AS Datum
    , YEAR(d)                                             AS Jahr
    , MONTH(d)                                            AS Monatsnr
    , DATENAME(MONTH, d)                                  AS Monat
    , FORMAT(d, 'yyyy-MM')                                AS JahrMonat
    , DATEPART(QUARTER, d)                                AS Quartal
    , DATEPART(ISO_WEEK, d)                               AS ISOWoche
    , DATEPART(WEEKDAY, d)                                AS Wochentagnr
    , DATENAME(WEEKDAY, d)                                AS Wochentag
    , CASE WHEN DATEPART(WEEKDAY, d) IN (1, 7) THEN 1 ELSE 0 END AS IstWochenende
    , CASE WHEN d <= CAST(GETDATE() AS date) THEN 1 ELSE 0 END   AS IstVergangenheit
INTO  dbo.Kalender
FROM  tage
OPTION (MAXRECURSION 0);

-- Hinweis: DATEPART(WEEKDAY) hängt von DATEFIRST ab. Für ISO-Verhalten
-- vorher SET DATEFIRST 1 setzen (Montag = 1).
