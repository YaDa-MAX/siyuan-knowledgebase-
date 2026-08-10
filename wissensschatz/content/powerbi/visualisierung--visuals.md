---
id: powerbi-visuals
title: Visuals, Interaktionen und Berichtsaufbau
path: powerbi/visualisierung
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [visuals, interaktion, bericht, ux]
prereqs: [powerbi-komponenten]
related: [excel-diagramme, powerbi-performance, powerbi-betrieb]
summary: Filterhierarchie, Interaktionssteuerung, Drillthrough und Lesezeichen — die Mechanik hinter einem Bericht, der sich bedienen lässt.
---

## Die Filterhierarchie

Von außen nach innen — jede Ebene engt weiter ein:

1. **RLS** (Zeilensicherheit, serverseitig)
2. **Berichtsfilter** — gelten auf allen Seiten
3. **Seitenfilter**
4. **Visualfilter**
5. **Datenschnitte** (Slicer) — wirken auf ihrer Seite, optional synchronisiert
6. **Kreuzfilterung/-hervorhebung** durch Klick in ein anderes Visual
7. Filter aus **Drillthrough** oder **Q&A**

Wer eine Zahl nicht erklären kann, arbeitet diese Liste von oben nach unten durch. Der Bereich *Filter* zeigt alles außer RLS.

## Interaktionen steuern

Standardmäßig **hebt** ein Klick in einem Visual die übrigen **hervor** (Highlight), statt sie zu filtern. Unter *Format ▸ Interaktionen bearbeiten* lässt sich je Visualpaar zwischen Filtern, Hervorheben und Keine wählen.

Das ist keine Kosmetik: Auf einer Seite mit einer KPI-Zeile oben sollte ein Klick ins Detaildiagramm die KPIs meist **nicht** verändern — sonst verliert der Nutzer die Bezugsgröße.

## Navigation im Bericht

- **Drillthrough**: Zielseite mit einem Drillthrough-Feld anlegen; Rechtsklick auf einen Datenpunkt springt dorthin, der Kontext wandert mit. Der Standardweg von der Übersicht ins Detail.
- **Drill Down** innerhalb einer Hierarchie (Jahr ▸ Quartal ▸ Monat) über die Pfeilsymbole. Wichtig: „Auf nächste Ebene erweitern" gegen „zur nächsten Ebene wechseln" verhalten sich unterschiedlich.
- **Lesezeichen** speichern Filter-, Sichtbarkeits- und Sortierzustand. In Kombination mit dem **Auswahlbereich** entstehen daraus Umschalter, Filterpanels und geführte Erzählungen.
- **Schaltflächen** mit Aktion „Lesezeichen", „Seitennavigation", „Detailinformationen" oder „Zurück".
- **Tooltip-Seiten**: eine Seite im Format „Tooltip" anlegen, im Zielvisual als QuickInfo referenzieren — ein Mini-Bericht beim Überfahren.
- **Feld- und numerische Parameter**: erzeugen einen Datenschnitt, mit dem der Nutzer Kennzahl oder Dimension eines Visuals selbst wählt. Ersetzt eine Menge Lesezeichen-Bastelei.

## Visualauswahl

Die Kriterien sind dieselben wie in Excel (siehe Diagrammtypen). Power-BI-spezifisch:

- **Karte / Mehrzeilige Karte / KPI** für Einzelwerte; die KPI-Karte trägt Ziel und Trend mit.
- **Matrix** statt Tabelle, sobald hierarchisch gruppiert wird — mit Ein-/Ausklappen und schrittweisem Aufriss.
- **Kleine Vielfache** (Small Multiples) statt zwanzig überlagerter Linien: dieselbe Grafik je Kategorie, gemeinsame Achse.
- **Dekompositionsbaum** für die Frage „warum ist die Zahl so?" — er zerlegt eine Kennzahl interaktiv nach beliebigen Dimensionen.
- **Wichtigste Einflussfaktoren** (Key Influencers) für den ersten statistischen Blick auf Treiber. Als Hinweis lesen, nicht als Beweis.
- **Benutzerdefinierte Visuals** aus AppSource: mit Bedacht. Sie sind Fremdcode, teils kostenpflichtig, teils unbetreut, und einige senden Daten an externe Dienste. Für dauerhafte Berichte auf zertifizierte Visuals beschränken.

## Layout und Barrierefreiheit

- Raster und Fanglinien einschalten, Objekte ausrichten und gleich groß halten.
- Konsistente Kennzahlformate über das **Modell** setzen (Format am Measure), nicht je Visual.
- **Alternativtext** je Visual pflegen, Tabulatorreihenfolge im Auswahlbereich festlegen — Bildschirmleser folgen genau dieser.
- Farbkontrast prüfen; Bedeutung nie allein über Rot/Grün transportieren.
- **Telefonlayout** je Seite anlegen, wenn mobil gelesen wird — sonst wird die Seite unbrauchbar skaliert.
- Seitentitel als Aussage, nicht als Feldliste.

## Was den Bericht langsam macht

- Mehr als etwa 15 Visuals je Seite — jedes erzeugt mindestens eine eigene DAX-Abfrage.
- Tabellen mit vielen Spalten und hoher Granularität.
- Visuals, die den Detailgrad der Faktentabelle abfragen.
- Ausgeblendete, aber weiterhin geladene Visuals in Lesezeichenkonstruktionen.
- Komplexe Measures in Matrizen mit vielen Zeilen — jede Zelle ist eine eigene Auswertung.

::: quiz
F: Was ist der Unterschied zwischen Kreuzfilterung und Kreuzhervorhebung?
A: Filtern entfernt die nicht ausgewählten Daten aus den anderen Visuals, Hervorheben zeigt sie weiterhin abgeschwächt im Gesamtkontext. Einstellbar unter „Interaktionen bearbeiten".

F: Wie ermöglichst du dem Nutzer, die angezeigte Kennzahl selbst zu wählen?
A: Mit einem Feldparameter — er erzeugt einen Datenschnitt, über den Kennzahl oder Dimension eines Visuals umgeschaltet wird.
:::
