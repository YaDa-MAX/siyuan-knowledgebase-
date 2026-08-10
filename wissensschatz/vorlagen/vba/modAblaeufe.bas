Attribute VB_Name = "modAblaeufe"
' =====================================================================
' modAblaeufe — fertige Abläufe für den Alltag
' Setzt modWerkzeuge voraus.
' =====================================================================
Option Explicit

' =====================================================================
' 1) Gerüst mit Fehlerbehandlung — Vorlage für jede eigene Prozedur
' =====================================================================
Public Sub Vorlage_MitFehlerbehandlung()
    On Error GoTo Fehler
    TurboAn
    StoppuhrStart

    ' ---- Arbeit hier ----

    Protokoll "Fertig in " & StoppuhrEnde
    GoTo Ende

Fehler:
    Protokoll "Fehler " & Err.Number & ": " & Err.Description, "FEHLER"
    MsgBox "Der Ablauf wurde abgebrochen." & vbCrLf & vbCrLf & _
           Err.Description, vbExclamation, "Fehler"
Ende:
    TurboAus
End Sub

' =====================================================================
' 2) Alle Dateien eines Ordners einlesen und untereinander sammeln
'    Ersetzt das monatliche Zusammenkopieren von Hand.
' =====================================================================
Public Sub DateienAusOrdnerSammeln()
    Dim ordner As String, datei As String
    Dim wbQuelle As Workbook, wsZiel As Worksheet
    Dim lzQuelle As Long, lzZiel As Long, anzahl As Long

    With Application.FileDialog(msoFileDialogFolderPicker)
        .Title = "Ordner mit den Quelldateien wählen"
        If .Show <> -1 Then Exit Sub
        ordner = .SelectedItems(1) & Application.PathSeparator
    End With

    On Error GoTo Fehler
    TurboAn
    StoppuhrStart

    Set wsZiel = BlattHolen("Sammlung")
    wsZiel.Cells.Clear
    wsZiel.Range("A1:E1").Value = Array("Quelldatei", "Blatt", "Zeile", "Spalte A", "Spalte B")
    wsZiel.Range("A1:E1").Font.Bold = True
    lzZiel = 1

    datei = Dir$(ordner & "*.xls*")
    Do While Len(datei) > 0
        Set wbQuelle = Workbooks.Open(fileName:=ordner & datei, ReadOnly:=True, UpdateLinks:=0)
        With wbQuelle.Worksheets(1)
            lzQuelle = LetzteZeile(.Parent.Worksheets(1))
            If lzQuelle > 1 Then
                .Range("A2:B" & lzQuelle).Copy
                wsZiel.Cells(lzZiel + 1, 4).PasteSpecial xlPasteValues
                wsZiel.Range(wsZiel.Cells(lzZiel + 1, 1), wsZiel.Cells(lzZiel + lzQuelle - 1, 1)).Value = datei
                wsZiel.Range(wsZiel.Cells(lzZiel + 1, 2), wsZiel.Cells(lzZiel + lzQuelle - 1, 2)).Value = .name
                lzZiel = lzZiel + lzQuelle - 1
            End If
        End With
        wbQuelle.Close SaveChanges:=False
        anzahl = anzahl + 1
        datei = Dir$
    Loop
    Application.CutCopyMode = False

    Protokoll anzahl & " Dateien gesammelt in " & StoppuhrEnde
    MsgBox anzahl & " Dateien eingelesen.", vbInformation
    GoTo Ende

Fehler:
    Protokoll "Fehler beim Sammeln: " & Err.Description, "FEHLER"
    If Not wbQuelle Is Nothing Then wbQuelle.Close SaveChanges:=False
    MsgBox Err.Description, vbExclamation
Ende:
    TurboAus
End Sub

' =====================================================================
' 3) Blätter als einzelne PDF exportieren
' =====================================================================
Public Sub BlaetterAlsPdfExportieren()
    Dim ws As Worksheet, ziel As String, zaehler As Long
    ziel = ThisWorkbook.Path & Application.PathSeparator & "PDF" & Application.PathSeparator
    If Dir$(ziel, vbDirectory) = "" Then MkDir ziel

    On Error GoTo Fehler
    TurboAn
    For Each ws In ThisWorkbook.Worksheets
        If ws.Visible = xlSheetVisible And Left$(ws.name, 3) <> "zz_" Then
            ws.ExportAsFixedFormat _
                Type:=xlTypePDF, _
                fileName:=ziel & Format$(Date, "yyyy-mm-dd") & "_" & Slug(ws.name) & ".pdf", _
                Quality:=xlQualityStandard, OpenAfterPublish:=False
            zaehler = zaehler + 1
        End If
    Next ws
    Protokoll zaehler & " PDF erzeugt"
    MsgBox zaehler & " PDF-Dateien liegen in:" & vbCrLf & ziel, vbInformation
    GoTo Ende
Fehler:
    Protokoll "PDF-Export: " & Err.Description, "FEHLER"
    MsgBox Err.Description, vbExclamation
Ende:
    TurboAus
End Sub

' =====================================================================
' 4) Nach Spaltenwert in einzelne Blätter aufteilen
'    Beispiel: eine Buchungsliste je Abteilung / Kostenstelle / Haus
' =====================================================================
Public Sub NachSpalteAufteilen(Optional ByVal schluesselSpalte As Long = 1)
    Dim wsQuelle As Worksheet, wsZiel As Worksheet
    Dim rngDaten As Range, lz As Long, i As Long
    Dim schluessel As String
    Dim gesehen As Object

    Set wsQuelle = ActiveSheet
    lz = LetzteZeile(wsQuelle)
    If lz < 2 Then MsgBox "Keine Daten.", vbInformation: Exit Sub

    On Error GoTo Fehler
    TurboAn
    Set gesehen = CreateObject("Scripting.Dictionary")

    For i = 2 To lz
        schluessel = CStr(wsQuelle.Cells(i, schluesselSpalte).Value)
        If Len(schluessel) > 0 Then
            If Not gesehen.Exists(schluessel) Then
                Set wsZiel = BlattHolen(Left$(schluessel, 31))
                wsZiel.Cells.Clear
                wsQuelle.Rows(1).Copy wsZiel.Rows(1)
                gesehen.Add schluessel, 2
            Else
                Set wsZiel = ThisWorkbook.Worksheets(Left$(schluessel, 31))
            End If
            wsQuelle.Rows(i).Copy wsZiel.Rows(gesehen(schluessel))
            gesehen(schluessel) = gesehen(schluessel) + 1
        End If
    Next i
    Application.CutCopyMode = False

    Protokoll "Aufgeteilt in " & gesehen.Count & " Blätter"
    MsgBox gesehen.Count & " Blätter erzeugt.", vbInformation
    GoTo Ende
Fehler:
    Protokoll "Aufteilen: " & Err.Description, "FEHLER"
    MsgBox Err.Description, vbExclamation
Ende:
    TurboAus
End Sub

' =====================================================================
' 5) Serienmail über Outlook mit persönlicher Anlage
'    Tabelle "Verteiler" mit Spalten: Name | Email | Anlage | Betreff
'    Ohne .Send zeigt Outlook den Entwurf zur Kontrolle.
' =====================================================================
Public Sub SerienmailVorbereiten(Optional ByVal sofortSenden As Boolean = False)
    Dim ws As Worksheet, i As Long, lz As Long
    Dim ol As Object, mail As Object, anhang As String, gesendet As Long

    If Not BlattExistiert("Verteiler") Then
        MsgBox "Blatt 'Verteiler' fehlt.", vbExclamation: Exit Sub
    End If
    Set ws = ThisWorkbook.Worksheets("Verteiler")
    lz = LetzteZeile(ws)

    On Error GoTo Fehler
    Set ol = CreateObject("Outlook.Application")

    For i = 2 To lz
        If InStr(ws.Cells(i, 2).Value, "@") > 0 Then
            Set mail = ol.CreateItem(0)
            With mail
                .To = ws.Cells(i, 2).Value
                .Subject = ws.Cells(i, 4).Value
                .Body = "Guten Tag " & ws.Cells(i, 1).Value & "," & vbCrLf & vbCrLf & _
                        "anbei die Unterlagen." & vbCrLf & vbCrLf & _
                        "Freundliche Grüße"
                anhang = CStr(ws.Cells(i, 3).Value)
                If Len(anhang) > 0 Then
                    If DateiExistiert(anhang) Then .Attachments.Add anhang
                End If
                If sofortSenden Then .Send Else .Display
            End With
            gesendet = gesendet + 1
        End If
    Next i

    Protokoll gesendet & " Mails " & IIf(sofortSenden, "gesendet", "als Entwurf geöffnet")
    Exit Sub
Fehler:
    Protokoll "Serienmail: " & Err.Description, "FEHLER"
    MsgBox Err.Description, vbExclamation
End Sub

' =====================================================================
' 6) Arbeitszeitprüfung — markiert Verstöße gegen ArbZG
'    Tabelle mit Spalten: Datum | Person | Beginn | Ende | Pause(Min)
'    Prüft Höchstarbeitszeit, Mindestpause und 11-h-Ruhezeit
'    (10 h Gastgewerbe-Ausnahme über die Konstante einstellbar).
' =====================================================================
Private Const RUHEZEIT_STUNDEN As Double = 11    ' Gastgewerbe: 10 mit Ausgleich

Public Sub ArbeitszeitPruefen()
    Dim ws As Worksheet, i As Long, lz As Long
    Dim brutto As Double, netto As Double, pause As Double
    Dim vorEnde As Date, hinweise As String, treffer As Long

    Set ws = ActiveSheet
    lz = LetzteZeile(ws)
    If lz < 2 Then Exit Sub

    On Error GoTo Fehler
    TurboAn
    ws.Range("F1").Value = "Prüfhinweis"
    ws.Range("F1").Font.Bold = True
    ws.Range("F2:F" & lz).ClearContents
    ws.Range("A2:F" & lz).Interior.ColorIndex = xlColorIndexNone

    For i = 2 To lz
        hinweise = ""
        pause = Val(ws.Cells(i, 5).Value)
        brutto = ArbeitsStunden(ws.Cells(i, 3).Value, ws.Cells(i, 4).Value, 0)
        netto = brutto - pause / 60

        If netto > 10 Then
            hinweise = hinweise & "Über 10 h Arbeitszeit (§ 3 ArbZG). "
        ElseIf netto > 8 Then
            hinweise = hinweise & "Über 8 h — Ausgleich im Zeitraum nötig. "
        End If

        If pause < MindestPauseMinuten(brutto) Then
            hinweise = hinweise & "Pause zu kurz: " & MindestPauseMinuten(brutto) & " min nötig. "
        End If

        ' Ruhezeit gegenüber der Vorzeile derselben Person
        If i > 2 Then
            If ws.Cells(i, 2).Value = ws.Cells(i - 1, 2).Value Then
                vorEnde = CDate(ws.Cells(i - 1, 1).Value) + CDbl(ws.Cells(i - 1, 4).Value)
                If CDbl(ws.Cells(i - 1, 4).Value) < CDbl(ws.Cells(i - 1, 3).Value) Then
                    vorEnde = vorEnde + 1     ' Vorschicht endete nach Mitternacht
                End If
                If (CDate(ws.Cells(i, 1).Value) + CDbl(ws.Cells(i, 3).Value) - vorEnde) * 24 _
                   < RUHEZEIT_STUNDEN - 0.001 Then
                    hinweise = hinweise & "Ruhezeit unter " & RUHEZEIT_STUNDEN & " h (§ 5 ArbZG). "
                End If
            End If
        End If

        If Len(hinweise) > 0 Then
            ws.Cells(i, 6).Value = Trim$(hinweise)
            ws.Range(ws.Cells(i, 1), ws.Cells(i, 6)).Interior.Color = RGB(255, 235, 235)
            treffer = treffer + 1
        End If
    Next i

    ws.Columns("F").ColumnWidth = 60
    Protokoll treffer & " Prüfhinweise zur Arbeitszeit"
    MsgBox treffer & " Zeilen mit Hinweisen." & vbCrLf & vbCrLf & _
           "Hinweis: Ergebnis ersetzt keine rechtliche Prüfung.", vbInformation
    GoTo Ende
Fehler:
    Protokoll "Arbeitszeitprüfung: " & Err.Description, "FEHLER"
Ende:
    TurboAus
End Sub

' =====================================================================
' 7) Mappe aufräumen — Regelmüll und Altlasten entfernen
' =====================================================================
Public Sub MappeAufraeumen()
    Dim ws As Worksheet, ergebnis As String, n As Long

    On Error Resume Next
    TurboAn
    For Each ws In ThisWorkbook.Worksheets
        ' Benutzten Bereich zurücksetzen
        n = ws.UsedRange.Rows.Count
        ' Leere Formatierungen unterhalb der Daten löschen
        If LetzteZeile(ws) < ws.UsedRange.Row + ws.UsedRange.Rows.Count - 1 Then
            ws.Rows(LetzteZeile(ws) + 1 & ":" & ws.Rows.Count).Delete
        End If
        ergebnis = ergebnis & ws.name & ": " & n & " -> " & ws.UsedRange.Rows.Count & vbCrLf
    Next ws

    ' Fehlerhafte Namen entfernen
    Dim nm As name, entfernt As Long
    For Each nm In ThisWorkbook.Names
        If InStr(nm.RefersTo, "#REF") > 0 Or InStr(nm.RefersTo, "#BEZUG") > 0 Then
            nm.Delete
            entfernt = entfernt + 1
        End If
    Next nm

    TurboAus
    MsgBox "Benutzter Bereich je Blatt:" & vbCrLf & vbCrLf & ergebnis & vbCrLf & _
           entfernt & " defekte Namen entfernt." & vbCrLf & _
           "Jetzt speichern, schließen und neu öffnen.", vbInformation
End Sub
