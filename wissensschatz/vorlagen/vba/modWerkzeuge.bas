Attribute VB_Name = "modWerkzeuge"
' =====================================================================
' modWerkzeuge — Grundbausteine für jedes VBA-Projekt
' Import: VBA-Editor (Alt+F11) > Datei > Datei importieren
' Alle Prozeduren sind unabhängig voneinander einsetzbar.
' =====================================================================
Option Explicit

' --- Bildschirm und Berechnung anhalten -------------------------------
' Immer paarweise verwenden. TurboAn ganz am Anfang, TurboAus im
' Aufräumteil der Fehlerbehandlung — sonst bleibt Excel halb tot zurück.

Private lngCalcAlt As Long
Private blnTurbo As Boolean

Public Sub TurboAn()
    If blnTurbo Then Exit Sub
    lngCalcAlt = Application.Calculation
    Application.ScreenUpdating = False
    Application.EnableEvents = False
    Application.Calculation = xlCalculationManual
    Application.DisplayAlerts = False
    blnTurbo = True
End Sub

Public Sub TurboAus()
    Application.DisplayAlerts = True
    On Error Resume Next
    Application.Calculation = IIf(lngCalcAlt = 0, xlCalculationAutomatic, lngCalcAlt)
    On Error GoTo 0
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    blnTurbo = False
End Sub

' --- Letzte belegte Zeile / Spalte ------------------------------------
' UsedRange ist unzuverlässig (bläht sich durch Formatierungen auf).
' Diese beiden Funktionen sind der belastbare Weg.

Public Function LetzteZeile(ws As Worksheet, Optional spalte As Variant = 1) As Long
    LetzteZeile = ws.Cells(ws.Rows.Count, spalte).End(xlUp).Row
End Function

Public Function LetzteSpalte(ws As Worksheet, Optional zeile As Long = 1) As Long
    LetzteSpalte = ws.Cells(zeile, ws.Columns.Count).End(xlToLeft).Column
End Function

' --- Existenzprüfungen ------------------------------------------------

Public Function BlattExistiert(ByVal name As String, Optional wb As Workbook) As Boolean
    Dim ws As Worksheet
    If wb Is Nothing Then Set wb = ThisWorkbook
    On Error Resume Next
    Set ws = wb.Worksheets(name)
    On Error GoTo 0
    BlattExistiert = Not ws Is Nothing
End Function

Public Function TabelleExistiert(ByVal name As String, Optional wb As Workbook) As Boolean
    Dim ws As Worksheet, lo As ListObject
    If wb Is Nothing Then Set wb = ThisWorkbook
    For Each ws In wb.Worksheets
        For Each lo In ws.ListObjects
            If StrComp(lo.name, name, vbTextCompare) = 0 Then
                TabelleExistiert = True
                Exit Function
            End If
        Next lo
    Next ws
End Function

Public Function DateiExistiert(ByVal pfad As String) As Boolean
    DateiExistiert = (Len(Dir$(pfad, vbNormal)) > 0)
End Function

' --- Blatt sicher holen oder anlegen ----------------------------------

Public Function BlattHolen(ByVal name As String, Optional wb As Workbook) As Worksheet
    If wb Is Nothing Then Set wb = ThisWorkbook
    If BlattExistiert(name, wb) Then
        Set BlattHolen = wb.Worksheets(name)
    Else
        Set BlattHolen = wb.Worksheets.Add(After:=wb.Worksheets(wb.Worksheets.Count))
        BlattHolen.name = name
    End If
End Function

Public Sub BlattLeeren(ws As Worksheet, Optional abZeile As Long = 2)
    Dim lz As Long
    lz = LetzteZeile(ws)
    If lz >= abZeile Then ws.Rows(abZeile & ":" & lz).Delete
End Sub

' --- Bereich als Array lesen und schreiben ----------------------------
' Der wichtigste Performance-Hebel überhaupt: ein Übergang statt
' zwei je Zelle. Bei 100.000 Zellen der Unterschied zwischen Minuten
' und Sekundenbruchteilen.

Public Function BereichAlsArray(rng As Range) As Variant
    If rng.Cells.Count = 1 Then
        Dim tmp(1 To 1, 1 To 1) As Variant
        tmp(1, 1) = rng.Value
        BereichAlsArray = tmp
    Else
        BereichAlsArray = rng.Value
    End If
End Function

Public Sub ArrayNachBereich(daten As Variant, zielObenLinks As Range)
    zielObenLinks.Resize(UBound(daten, 1) - LBound(daten, 1) + 1, _
                         UBound(daten, 2) - LBound(daten, 2) + 1).Value = daten
End Sub

' --- Protokoll --------------------------------------------------------
' Jeder produktive Ablauf braucht eine Spur. Schreibt in ein
' ausgeblendetes Blatt "zz_Protokoll".

Public Sub Protokoll(ByVal text As String, Optional ByVal stufe As String = "INFO")
    Dim ws As Worksheet, z As Long
    Set ws = BlattHolen("zz_Protokoll")
    ws.Visible = xlSheetHidden
    If ws.Cells(1, 1).Value = "" Then
        ws.Range("A1:D1").Value = Array("Zeitpunkt", "Stufe", "Prozedur", "Meldung")
        ws.Range("A1:D1").Font.Bold = True
    End If
    z = LetzteZeile(ws) + 1
    ws.Cells(z, 1).Value = Now
    ws.Cells(z, 1).NumberFormat = "TT.MM.JJJJ hh:mm:ss"
    ws.Cells(z, 2).Value = stufe
    ws.Cells(z, 3).Value = Application.Caller
    ws.Cells(z, 4).Value = text
End Sub

' --- Zeitmessung ------------------------------------------------------

Private dblStart As Double

Public Sub StoppuhrStart()
    dblStart = Timer
End Sub

Public Function StoppuhrEnde() As String
    StoppuhrEnde = Format$(Timer - dblStart, "0.00") & " s"
End Function

' --- Text- und Zahlwerkzeuge -----------------------------------------

Public Function NurZiffern(ByVal s As String) As String
    Dim i As Long, c As String
    For i = 1 To Len(s)
        c = Mid$(s, i, 1)
        If c >= "0" And c <= "9" Then NurZiffern = NurZiffern & c
    Next i
End Function

Public Function SauberText(ByVal s As String) As String
    ' Entfernt geschützte Leerzeichen, Zeilenumbrüche und Steuerzeichen
    s = Replace(s, Chr$(160), " ")
    s = Replace(s, vbCrLf, " ")
    s = Replace(s, vbLf, " ")
    s = Replace(s, vbTab, " ")
    Do While InStr(s, "  ") > 0
        s = Replace(s, "  ", " ")
    Loop
    SauberText = Trim$(s)
End Function

Public Function Slug(ByVal s As String) As String
    ' Dateinamenfreundlich, ohne Umlaute
    s = LCase$(SauberText(s))
    s = Replace(s, ChrW(228), "ae"): s = Replace(s, ChrW(246), "oe")
    s = Replace(s, ChrW(252), "ue"): s = Replace(s, ChrW(223), "ss")
    Dim i As Long, c As String, erg As String
    For i = 1 To Len(s)
        c = Mid$(s, i, 1)
        If (c >= "a" And c <= "z") Or (c >= "0" And c <= "9") Then
            erg = erg & c
        ElseIf Len(erg) > 0 Then
            If Right$(erg, 1) <> "-" Then erg = erg & "-"
        End If
    Next i
    Slug = Left$(Trim$(erg), 60)
    Do While Right$(Slug, 1) = "-"
        Slug = Left$(Slug, Len(Slug) - 1)
    Loop
End Function

' --- Arbeitszeit ------------------------------------------------------
' Nachtschicht über Mitternacht korrekt in Stunden.

Public Function ArbeitsStunden(ByVal beginn As Date, ByVal ende As Date, _
                               Optional ByVal pauseMinuten As Double = 0) As Double
    Dim d As Double
    d = CDbl(ende) - CDbl(beginn)
    d = d - Int(d)                       ' nur Tagesanteil
    If d < 0 Then d = d + 1              ' über Mitternacht
    ArbeitsStunden = d * 24 - pauseMinuten / 60
End Function

' Gesetzliche Mindestpause nach § 4 ArbZG in Minuten
Public Function MindestPauseMinuten(ByVal bruttoStunden As Double) As Long
    If bruttoStunden > 9 Then
        MindestPauseMinuten = 45
    ElseIf bruttoStunden > 6 Then
        MindestPauseMinuten = 30
    Else
        MindestPauseMinuten = 0
    End If
End Function

' --- Ostersonntag und bewegliche Feiertage ---------------------------

Public Function Ostersonntag(ByVal jahr As Integer) As Date
    Dim a As Integer, b As Integer, c As Integer, d As Integer
    a = jahr Mod 19
    b = (255 - 11 * a) Mod 32
    c = b + 21 - IIf(b > 28, 1, 0)
    d = c + 7 - Weekday(DateSerial(jahr, 3, 1) + c - 1, vbMonday)
    Ostersonntag = DateSerial(jahr, 3, 1) + d - 1
End Function

Public Function IstFeiertagBundesweit(ByVal d As Date) As Boolean
    Dim j As Integer, os As Date
    j = Year(d): os = Ostersonntag(j)
    Select Case d
        Case DateSerial(j, 1, 1), DateSerial(j, 5, 1), DateSerial(j, 10, 3), _
             DateSerial(j, 12, 25), DateSerial(j, 12, 26), _
             os - 2, os + 1, os + 39, os + 50
            IstFeiertagBundesweit = True
    End Select
End Function
