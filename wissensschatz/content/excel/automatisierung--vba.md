---
id: excel-vba
title: VBA — Grundlagen und Objektmodell
path: excel/automatisierung
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [vba, makros, automatisierung, programmierung]
prereqs: [excel-formelsprache]
related: [excel-office-scripts, prozessauto-werkzeugwahl, excel-performance]
summary: Objektmodell, Ereignisse und die fünf Muster, mit denen 90 % aller Excel-Makros auskommen.
---

## Kern

VBA steuert Excel über ein **Objektmodell**. Die Hierarchie ist die halbe Miete:

```
Application ▸ Workbook ▸ Worksheet ▸ Range
```

Jedes Objekt hat Eigenschaften (`.Value`, `.Font.Bold`) und Methoden (`.Copy`, `.Delete`). Der Makrorekorder (Entwicklertools ▸ Makro aufzeichnen) ist der beste Einstieg: Er zeigt, wie eine Aktion heißt. Sein Code ist allerdings unbrauchbar für den Dauerbetrieb, weil er alles über `Select` und `ActiveCell` macht.

## Die wichtigste Regel: nicht selektieren

```vb
' Rekorder-Stil — langsam und fragil
Sheets("Daten").Select
Range("A1").Select
Selection.Value = 5

' Direkt — schnell und unabhängig davon, was gerade aktiv ist
ThisWorkbook.Worksheets("Daten").Range("A1").Value = 5
```

`Select` und `Activate` braucht man fast nie. Sie kosten Bildschirmaktualisierungen und brechen, sobald der Nutzer währenddessen klickt.

## Bereiche ansprechen

```vb
Dim ws As Worksheet: Set ws = ThisWorkbook.Worksheets("Daten")
Dim letzte As Long
letzte = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row      ' letzte belegte Zeile
Dim rng As Range: Set rng = ws.Range("A2:D" & letzte)

Set rng = ws.ListObjects("Buchungen").DataBodyRange       ' besser: über die Tabelle
```

`UsedRange` ist unzuverlässig (bläht sich durch Formatierungen auf). `End(xlUp)` oder das ListObject sind die belastbaren Wege.

## Arrays statt Zellzugriff — der Performance-Hebel

Jeder einzelne Zellzugriff kostet einen Übergang zwischen VBA und Excel. Bei 100.000 Zellen ist das der Unterschied zwischen Minuten und Sekundenbruchteilen:

```vb
Dim daten As Variant
daten = rng.Value                    ' ein Zugriff: alles ins Array
Dim i As Long
For i = 1 To UBound(daten, 1)
    daten(i, 4) = daten(i, 2) * daten(i, 3)
Next i
rng.Value = daten                    ' ein Zugriff zurück
```

Dazu der Standardrahmen für alles Längere:

```vb
Application.ScreenUpdating = False
Application.Calculation = xlCalculationManual
Application.EnableEvents = False
On Error GoTo Ende
' ... Arbeit ...
Ende:
Application.EnableEvents = True
Application.Calculation = xlCalculationAutomatic
Application.ScreenUpdating = True
```

Das Zurücksetzen **muss** auch im Fehlerfall laufen — sonst bleibt Excel in einem halb toten Zustand zurück.

## Ereignisse

Im Modul des Arbeitsblatts bzw. `DieseArbeitsmappe`:

```vb
Private Sub Worksheet_Change(ByVal Target As Range)
    If Intersect(Target, Me.Range("B2:B100")) Is Nothing Then Exit Sub
    Application.EnableEvents = False
    Me.Range("C" & Target.Row).Value = Now
    Application.EnableEvents = True
End Sub
```

Zwei Pflichtzeilen: `Intersect` als Wächter (sonst feuert es bei jeder Änderung im Blatt) und `EnableEvents = False`, wenn das Ereignis selbst schreibt — sonst löst es sich endlos selbst aus.

Weitere häufige Ereignisse: `Workbook_Open`, `Workbook_BeforeSave`, `Workbook_BeforeClose`, `Worksheet_SelectionChange`, `Worksheet_BeforeDoubleClick`.

## Fehlerbehandlung und Sauberkeit

- `Option Explicit` in jedes Modul (Extras ▸ Optionen ▸ Variablendeklaration erforderlich). Ohne das kostet ein Tippfehler in einem Variablennamen Stunden.
- `On Error GoTo Marke` mit Aufräumteil; `On Error Resume Next` nur eng begrenzt und sofort wieder `On Error GoTo 0`.
- Typen deklarieren (`Dim n As Long`, nicht `Dim n`), `Long` statt `Integer` (Zeilennummern überschreiten 32.767).
- `Set` bei Objektzuweisungen, `Nothing` prüfen vor Zugriff.

## Sicherheit und Verteilung

Makros leben in `.xlsm`/`.xlsb`. Aus dem Internet geladene Dateien werden seit 2022 standardmäßig blockiert (Mark of the Web) — Abhilfe ist ein **vertrauenswürdiger Speicherort** oder eine digitale Signatur, nicht das Abschalten der Makrosicherheit. VBA-Projektpasswörter sind kein Schutz gegen ernsthafte Angreifer; Geschäftslogik mit echtem Schutzbedarf gehört nicht in VBA.

## Wann VBA — und wann nicht mehr

VBA ist unschlagbar für lokale Automatisierung in der Desktop-Excel: Dateien stapelweise verarbeiten, Berichte erzeugen, Outlook ansteuern, Dialoge (UserForms) bauen. Es läuft **nicht** in Excel im Browser, nicht auf Mobilgeräten, nicht in der Cloud, und es lässt sich nicht ordentlich versionieren. Für alles Geteilte oder Cloud-basierte sind **Office Scripts** und **Power Automate** die Nachfolger; für reine Datenaufbereitung ist **Power Query** fast immer die bessere Antwort.

::: quiz
F: Warum ist `rng.Value` in ein Array lesen, rechnen und zurückschreiben so viel schneller als eine Schleife über Zellen?
A: Jeder Zellzugriff überquert die Grenze zwischen VBA und Excel. Das Array braucht nur zwei Übergänge statt zwei je Zelle.

F: Welche zwei Zeilen gehören in jedes Worksheet_Change-Ereignis, das selbst schreibt?
A: Ein `Intersect`-Wächter am Anfang und `Application.EnableEvents = False/True` um den Schreibvorgang.
:::
