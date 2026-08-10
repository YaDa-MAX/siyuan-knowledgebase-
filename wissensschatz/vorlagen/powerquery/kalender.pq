// =====================================================================
// Kalendertabelle in M — inklusive deutscher Feiertage je Bundesland
//
// Vorteil gegenüber der DAX-Variante: Sie ist Teil der Datenaufbereitung,
// lässt sich als Dataflow in mehreren Modellen wiederverwenden und
// wächst über den Parameter automatisch mit.
//
// Parameter anlegen: Startjahr (Zahl), Endjahr (Zahl), Bundesland (Text, z. B. "BY")
// =====================================================================
let
    Start = #date(Startjahr, 1, 1),
    Ende  = #date(Endjahr, 12, 31),
    Tage  = List.Dates(Start, Duration.Days(Ende - Start) + 1, #duration(1, 0, 0, 0)),

    AlsTabelle = Table.FromList(Tage, Splitter.SplitByNothing(), {"Datum"}),
    Typisiert  = Table.TransformColumnTypes(AlsTabelle, {{"Datum", type date}}),

    // ---- Ostersonntag (Gauß) ----------------------------------------
    Ostern = (jahr as number) as date =>
        let
            a = Number.Mod(jahr, 19),
            b = Number.Mod(255 - 11 * a, 32),
            c = b + 21 - (if b > 28 then 1 else 0),
            basis = Date.AddDays(#date(jahr, 3, 1), c - 1),
            d = c + 7 - Date.DayOfWeek(basis, Day.Monday) - 1
        in
            Date.AddDays(#date(jahr, 3, 1), d),

    // ---- Feiertage je Jahr ------------------------------------------
    FeiertageJahr = (jahr as number) as list =>
        let
            os = Ostern(jahr),
            bundesweit = {
                [d = #date(jahr, 1, 1),   n = "Neujahr",                laender = "*"],
                [d = Date.AddDays(os,-2), n = "Karfreitag",             laender = "*"],
                [d = Date.AddDays(os, 1), n = "Ostermontag",            laender = "*"],
                [d = #date(jahr, 5, 1),   n = "Tag der Arbeit",         laender = "*"],
                [d = Date.AddDays(os,39), n = "Christi Himmelfahrt",    laender = "*"],
                [d = Date.AddDays(os,50), n = "Pfingstmontag",          laender = "*"],
                [d = #date(jahr,10, 3),   n = "Tag der Deutschen Einheit", laender = "*"],
                [d = #date(jahr,12,25),   n = "1. Weihnachtstag",       laender = "*"],
                [d = #date(jahr,12,26),   n = "2. Weihnachtstag",       laender = "*"]
            },
            regional = {
                [d = #date(jahr, 1, 6),   n = "Heilige Drei Könige",    laender = "BW,BY,ST"],
                [d = #date(jahr, 3, 8),   n = "Internationaler Frauentag", laender = "BE,MV"],
                [d = Date.AddDays(os,60), n = "Fronleichnam",           laender = "BW,BY,HE,NW,RP,SL"],
                [d = #date(jahr, 8,15),   n = "Mariä Himmelfahrt",      laender = "SL,BY"],
                [d = #date(jahr, 9,20),   n = "Weltkindertag",          laender = "TH"],
                [d = #date(jahr,10,31),   n = "Reformationstag",        laender = "BB,HB,HH,MV,NI,SN,ST,SH,TH"],
                [d = #date(jahr,11, 1),   n = "Allerheiligen",          laender = "BW,BY,NW,RP,SL"]
                // Buß- und Bettag (SN): Mittwoch vor dem 23. November
            },
            bussBettag =
                let
                    stichtag = #date(jahr, 11, 23),
                    versatz  = Date.DayOfWeek(stichtag, Day.Wednesday),
                    tag      = Date.AddDays(stichtag, -(if versatz = 0 then 7 else versatz))
                in
                    [d = tag, n = "Buß- und Bettag", laender = "SN"]
        in
            List.Combine({bundesweit, regional, {bussBettag}}),

    AlleJahre  = List.Numbers(Startjahr, Endjahr - Startjahr + 1),
    AlleFeiert = List.Combine(List.Transform(AlleJahre, each FeiertageJahr(_))),

    GiltHier = (eintrag as record) as logical =>
        eintrag[laender] = "*" or List.Contains(Text.Split(eintrag[laender], ","), Bundesland),

    RelevanteFeiertage = List.Select(AlleFeiert, each GiltHier(_)),
    FeiertagsListe     = List.Transform(RelevanteFeiertage, each [d]),
    FeiertagsNamen     = Record.FromList(
                            List.Transform(RelevanteFeiertage, each [n]),
                            List.Transform(RelevanteFeiertage, each Date.ToText([d], "yyyy-MM-dd"))
                         ),

    // ---- Spalten anreichern -----------------------------------------
    Erweitert = Table.AddColumn(Typisiert, "Jahr",         each Date.Year([Datum]), Int64.Type),
    S2  = Table.AddColumn(Erweitert, "Monatsnr",           each Date.Month([Datum]), Int64.Type),
    S3  = Table.AddColumn(S2,  "Monat",                    each Date.ToText([Datum], "MMM", "de-DE"), type text),
    S4  = Table.AddColumn(S3,  "MonatLang",                each Date.ToText([Datum], "MMMM", "de-DE"), type text),
    S5  = Table.AddColumn(S4,  "JahrMonat",                each Date.ToText([Datum], "yyyy-MM"), type text),
    S6  = Table.AddColumn(S5,  "Quartal",                  each "Q" & Text.From(Date.QuarterOfYear([Datum])), type text),
    S7  = Table.AddColumn(S6,  "JahrQuartal",              each Text.From(Date.Year([Datum])) & "-Q" & Text.From(Date.QuarterOfYear([Datum])), type text),
    S8  = Table.AddColumn(S7,  "TagImMonat",               each Date.Day([Datum]), Int64.Type),
    S9  = Table.AddColumn(S8,  "TagImJahr",                each Date.DayOfYear([Datum]), Int64.Type),
    S10 = Table.AddColumn(S9,  "Wochentagnr",              each Date.DayOfWeek([Datum], Day.Monday) + 1, Int64.Type),
    S11 = Table.AddColumn(S10, "Wochentag",                each Date.ToText([Datum], "ddd", "de-DE"), type text),
    S12 = Table.AddColumn(S11, "ISOWoche",                 each Date.WeekOfYear([Datum], Day.Monday), Int64.Type),
    S13 = Table.AddColumn(S12, "IstWochenende",            each Date.DayOfWeek([Datum], Day.Monday) >= 5, type logical),
    S14 = Table.AddColumn(S13, "IstFeiertag",              each List.Contains(FeiertagsListe, [Datum]), type logical),
    S15 = Table.AddColumn(S14, "Feiertag",
              each Record.FieldOrDefault(FeiertagsNamen, Date.ToText([Datum], "yyyy-MM-dd"), null), type nullable text),
    S16 = Table.AddColumn(S15, "IstArbeitstag",
              each not [IstWochenende] and not [IstFeiertag], type logical),
    S17 = Table.AddColumn(S16, "IstVergangenheit",
              each [Datum] <= Date.From(DateTime.LocalNow()), type logical),
    S18 = Table.AddColumn(S17, "Monatsversatz",
              each (Date.Year([Datum]) - Date.Year(DateTime.LocalNow())) * 12
                   + (Date.Month([Datum]) - Date.Month(DateTime.LocalNow())), Int64.Type),
    S19 = Table.AddColumn(S18, "Saison",
              each if List.Contains({12, 1, 2}, Date.Month([Datum])) then "Winter"
                   else if List.Contains({3, 4, 5}, Date.Month([Datum])) then "Frühjahr"
                   else if List.Contains({6, 7, 8}, Date.Month([Datum])) then "Sommer"
                   else "Herbst", type text)
in
    S19

// Nach dem Laden im Modell: Tabellentools > Als Datumstabelle markieren,
// und "Monat" nach "Monatsnr" sortieren lassen.
