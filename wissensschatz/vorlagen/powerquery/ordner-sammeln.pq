// =====================================================================
// Power Query / M — Alle Dateien eines Ordners einlesen und bereinigen
//
// Einfügen: Daten > Daten abrufen > Aus anderen Quellen > Leere Abfrage
//           > Erweiterter Editor > diesen Text ersetzen
//
// Der Ordnerpfad liegt in einem Parameter, damit die Mappe auf jedem
// Rechner läuft: Start > Parameter verwalten > Neu > "Ordnerpfad" (Text)
// =====================================================================
let
    // ---- Quelle -----------------------------------------------------
    Quelle = Folder.Files(Ordnerpfad),

    // Nur Excel-Dateien, keine temporären (~$...) und keine Unterordner
    NurExcel = Table.SelectRows(
        Quelle,
        each Text.EndsWith([Extension], ".xlsx", Comparer.OrdinalIgnoreCase)
             and not Text.StartsWith([Name], "~$")
    ),

    // ---- Inhalt je Datei lesen --------------------------------------
    // Die Funktion holt aus jeder Datei das erste Blatt.
    LeseDatei = (binaer as binary) as table =>
        let
            Mappe   = Excel.Workbook(binaer, true),
            Blatt   = Table.SelectRows(Mappe, each [Kind] = "Sheet"){0}[Data]
        in
            Blatt,

    MitInhalt = Table.AddColumn(NurExcel, "Inhalt", each LeseDatei([Content])),

    // Herkunft mitführen — unverzichtbar für die spätere Fehlersuche
    Reduziert = Table.SelectColumns(MitInhalt, {"Name", "Date modified", "Inhalt"}),
    Umbenannt = Table.RenameColumns(Reduziert, {{"Name", "Quelldatei"}, {"Date modified", "Dateidatum"}}),

    // ---- Zusammenführen ---------------------------------------------
    Erweitert = Table.ExpandTableColumn(
        Umbenannt, "Inhalt",
        {"Datum", "Haus", "Kanal", "Betrag", "Gaeste"},
        {"Datum", "Haus", "Kanal", "Betrag", "Gaeste"}
    ),

    // ---- Bereinigen -------------------------------------------------
    // Gebietsschema explizit angeben: der Punkt, an dem Importe scheitern.
    Typen = Table.TransformColumnTypes(
        Erweitert,
        {
            {"Quelldatei", type text},
            {"Dateidatum", type datetime},
            {"Datum",      type date},
            {"Haus",       type text},
            {"Kanal",      type text},
            {"Betrag",     type number},
            {"Gaeste",     Int64.Type}
        },
        "de-DE"
    ),

    // Geschützte Leerzeichen entfernen — GLÄTTEN/Trim erwischt sie nicht
    TextSauber = Table.TransformColumns(
        Typen,
        {
            {"Haus",  each Text.Trim(Text.Replace(_ ?? "", Character.FromNumber(160), " ")), type text},
            {"Kanal", each Text.Trim(Text.Replace(_ ?? "", Character.FromNumber(160), " ")), type text}
        }
    ),

    OhneLeerzeilen = Table.SelectRows(TextSauber, each [Datum] <> null and [Betrag] <> null),
    OhneFehler     = Table.RemoveRowsWithErrors(OhneLeerzeilen),

    // ---- Anreichern -------------------------------------------------
    MitZeit = Table.AddColumn(OhneFehler, "JahrMonat",
                  each Date.ToText([Datum], "yyyy-MM"), type text),
    MitKW   = Table.AddColumn(MitZeit, "ISOWoche",
                  each Date.WeekOfYear([Datum], Day.Monday), Int64.Type),
    MitTag  = Table.AddColumn(MitKW, "Wochentag",
                  each Date.DayOfWeekName([Datum], "de-DE"), type text),

    // ---- Prüfspalte -------------------------------------------------
    // Auffälligkeiten markieren statt still zu verwerfen.
    MitPruefung = Table.AddColumn(MitTag, "Pruefhinweis", each
        let
            h = List.RemoveNulls({
                if [Betrag] < 0 then "negativer Betrag" else null,
                if [Datum] > Date.From(DateTime.LocalNow()) then "Datum in der Zukunft" else null,
                if [Haus] = null or Text.Length([Haus]) = 0 then "Haus fehlt" else null
            })
        in
            if List.IsEmpty(h) then null else Text.Combine(h, "; "),
        type nullable text),

    Sortiert = Table.Sort(MitPruefung, {{"Datum", Order.Ascending}, {"Haus", Order.Ascending}})
in
    Sortiert
