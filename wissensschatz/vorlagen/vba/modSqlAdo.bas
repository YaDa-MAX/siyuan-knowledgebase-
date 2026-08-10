Attribute VB_Name = "modSqlAdo"
' =====================================================================
' modSqlAdo — SQL aus Excel heraus, ohne Zusatzsoftware
'
' Nutzt ADO über späte Bindung (kein Verweis nötig, läuft überall).
' Drei Einsatzfälle:
'   A) SQL gegen die eigene Arbeitsmappe
'   B) SQL gegen eine geschlossene Excel-Datei
'   C) SQL gegen SQL Server / MySQL / Access
'
' SICHERHEIT: Werte niemals in den SQL-Text hineinformatieren.
' Immer Parameter verwenden — siehe AbfrageMitParameter.
' =====================================================================
Option Explicit

Private Const AD_OPEN_STATIC As Long = 3
Private Const AD_LOCK_READONLY As Long = 1
Private Const AD_CMD_TEXT As Long = 1
Private Const AD_VAR_WCHAR As Long = 202
Private Const AD_DATE As Long = 7
Private Const AD_CURRENCY As Long = 6
Private Const AD_PARAM_INPUT As Long = 1

' --- Verbindungszeichenfolgen ----------------------------------------

Public Function VerbindungExcel(Optional ByVal pfad As String = "") As String
    If Len(pfad) = 0 Then pfad = ThisWorkbook.FullName
    ' HDR=YES  : erste Zeile ist Kopfzeile
    ' IMEX=1   : gemischte Spalten als Text lesen statt zu raten
    VerbindungExcel = "Provider=Microsoft.ACE.OLEDB.12.0;" & _
                      "Data Source=" & pfad & ";" & _
                      "Extended Properties=""Excel 12.0 Xml;HDR=YES;IMEX=1"";"
End Function

Public Function VerbindungSqlServer(ByVal server As String, ByVal datenbank As String) As String
    ' Windows-Authentifizierung — keine Zugangsdaten im Code.
    VerbindungSqlServer = "Provider=MSOLEDBSQL;Server=" & server & ";" & _
                          "Database=" & datenbank & ";Trusted_Connection=yes;"
End Function

' --- A) Abfrage ausführen und in ein Blatt schreiben ------------------

Public Sub AbfrageNachBlatt(ByVal sql As String, ByVal zielBlatt As String, _
                            Optional ByVal verbindung As String = "")
    Dim cn As Object, rs As Object, ws As Worksheet
    Dim i As Long

    If Len(verbindung) = 0 Then verbindung = VerbindungExcel

    On Error GoTo Fehler
    Set cn = CreateObject("ADODB.Connection")
    cn.Open verbindung

    Set rs = CreateObject("ADODB.Recordset")
    rs.Open sql, cn, AD_OPEN_STATIC, AD_LOCK_READONLY

    Set ws = BlattHolen(zielBlatt)
    ws.Cells.Clear

    ' Kopfzeile aus den Feldnamen
    For i = 0 To rs.Fields.Count - 1
        ws.Cells(1, i + 1).Value = rs.Fields(i).name
    Next i
    ws.Rows(1).Font.Bold = True

    ' Daten in einem Zug
    If Not rs.EOF Then ws.Range("A2").CopyFromRecordset rs

    ws.Columns.AutoFit
    ws.Rows(1).AutoFilter

    rs.Close: cn.Close
    Set rs = Nothing: Set cn = Nothing
    Exit Sub

Fehler:
    MsgBox "SQL-Fehler:" & vbCrLf & vbCrLf & Err.Description & vbCrLf & vbCrLf & _
           "Abfrage:" & vbCrLf & Left$(sql, 500), vbExclamation, "Abfrage fehlgeschlagen"
    On Error Resume Next
    If Not rs Is Nothing Then If rs.State = 1 Then rs.Close
    If Not cn Is Nothing Then If cn.State = 1 Then cn.Close
End Sub

' --- B) Parametrisierte Abfrage — der sichere Weg ---------------------
' Verhindert SQL-Injection und Formatprobleme bei Datum und Dezimaltrenner.

Public Sub AbfrageMitParameter(ByVal verbindung As String, ByVal sql As String, _
                               ByRef werte() As Variant, ByVal zielBlatt As String)
    Dim cn As Object, cmd As Object, rs As Object, ws As Worksheet
    Dim i As Long, p As Object

    On Error GoTo Fehler
    Set cn = CreateObject("ADODB.Connection")
    cn.Open verbindung

    Set cmd = CreateObject("ADODB.Command")
    Set cmd.ActiveConnection = cn
    cmd.CommandText = sql          ' Platzhalter: ? je Parameter
    cmd.CommandType = AD_CMD_TEXT

    For i = LBound(werte) To UBound(werte)
        Set p = cmd.CreateParameter("p" & i, TypVon(werte(i)), AD_PARAM_INPUT, 255, werte(i))
        cmd.Parameters.Append p
    Next i

    Set rs = cmd.Execute
    Set ws = BlattHolen(zielBlatt)
    ws.Cells.Clear
    For i = 0 To rs.Fields.Count - 1
        ws.Cells(1, i + 1).Value = rs.Fields(i).name
    Next i
    ws.Rows(1).Font.Bold = True
    If Not rs.EOF Then ws.Range("A2").CopyFromRecordset rs
    ws.Columns.AutoFit

    rs.Close: cn.Close
    Exit Sub
Fehler:
    MsgBox "SQL-Fehler: " & Err.Description, vbExclamation
    On Error Resume Next
    If Not cn Is Nothing Then If cn.State = 1 Then cn.Close
End Sub

Private Function TypVon(ByVal v As Variant) As Long
    Select Case VarType(v)
        Case vbDate:                        TypVon = AD_DATE
        Case vbCurrency, vbDouble, vbSingle: TypVon = AD_CURRENCY
        Case Else:                          TypVon = AD_VAR_WCHAR
    End Select
End Function

' --- C) Beispielaufrufe ----------------------------------------------

Public Sub Beispiel_EigeneMappeAbfragen()
    Dim sql As String
    sql = "SELECT [Haus], FORMAT([Datum],'yyyy-mm') AS Monat, " & _
          "       SUM([Betrag]) AS Umsatz, COUNT(*) AS Buchungen " & _
          "FROM   [Buchungen$] " & _
          "WHERE  [Betrag] > 0 " & _
          "GROUP BY [Haus], FORMAT([Datum],'yyyy-mm') " & _
          "ORDER BY [Haus], Monat"
    AbfrageNachBlatt sql, "Auswertung"
End Sub

Public Sub Beispiel_MitParameter()
    Dim sql As String, p(0 To 1) As Variant
    sql = "SELECT * FROM dbo.Buchungen WHERE Datum >= ? AND Datum < ?"
    p(0) = DateSerial(2026, 1, 1)
    p(1) = DateSerial(2027, 1, 1)
    AbfrageMitParameter VerbindungSqlServer("SQLSRV01", "Hotel"), sql, p, "Rohdaten"
End Sub

Public Sub Beispiel_GeschlosseneDatei()
    Dim pfad As String, sql As String
    pfad = ThisWorkbook.Path & Application.PathSeparator & "Vorjahr.xlsx"
    If Not DateiExistiert(pfad) Then MsgBox "Datei fehlt: " & pfad, vbExclamation: Exit Sub
    sql = "SELECT * FROM [Buchungen$] WHERE [Betrag] > 100"
    AbfrageNachBlatt sql, "Vorjahr", VerbindungExcel(pfad)
End Sub

' --- Diagnose --------------------------------------------------------

Public Sub TreiberPruefen()
    Dim cn As Object, meldung As String
    On Error Resume Next
    Set cn = CreateObject("ADODB.Connection")
    cn.Open VerbindungExcel
    If Err.Number = 0 Then
        meldung = "ACE-OLEDB-Treiber vorhanden und funktionsfähig."
        cn.Close
    Else
        meldung = "Kein passender ACE-Treiber:" & vbCrLf & Err.Description & vbCrLf & vbCrLf & _
                  "Die Bitversion des Treibers muss zu Office passen (32/64). " & _
                  "Abhilfe: Microsoft Access Database Engine Redistributable installieren."
    End If
    On Error GoTo 0
    MsgBox meldung, vbInformation, "Treiberprüfung"
End Sub
