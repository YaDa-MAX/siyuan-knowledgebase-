---
id: excel-diagramme
title: Diagrammtypen richtig wählen
path: excel/visualisierung
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [diagramme, visualisierung, wahrnehmung]
prereqs: [excel-tabellen]
related: [excel-dashboard, excel-bedingte-formatierung, powerbi-visuals]
summary: Die Diagrammwahl folgt der Aussage, nicht dem Geschmack. Position schlägt Länge schlägt Fläche schlägt Farbe.
---

## Die Rangfolge der Wahrnehmung

Menschen lesen visuelle Kodierungen unterschiedlich genau. Von präzise nach ungenau:

1. **Position** auf gemeinsamer Skala (Punkt-, Linien-, Balkendiagramm)
2. **Länge** (Balken ohne gemeinsame Basis)
3. **Winkel / Steigung**
4. **Fläche**
5. **Volumen**, **Farbsättigung**

Daraus folgt die wichtigste Regel: Wer Werte **vergleichbar** machen will, kodiert sie als Position oder Länge. Das ist der sachliche Grund, warum Kreisdiagramme (Winkel + Fläche) schlecht abschneiden und 3D-Diagramme (Volumen + Perspektivverzerrung) durchfallen.

## Zuordnung nach Aussage

| Aussage | Diagramm |
|---|---|
| Vergleich zwischen Kategorien | Balken (waagerecht, sortiert) |
| Verlauf über Zeit | Linie; Säulen bei wenigen Perioden |
| Anteil am Ganzen | gestapelte Balken (100 %); Kreis nur bei 2–3 Teilen |
| Zusammenhang zweier Größen | Punkt (XY-Streudiagramm) |
| Verteilung | Histogramm, Boxplot |
| Abweichung von einer Referenz | Wasserfall, abweichender Balken um Nulllinie |
| Rangfolge | sortierter Balken, Lolliop |
| Anteilsentwicklung über Zeit | Flächendiagramm gestapelt |
| Zusammensetzung eines Wertes | Wasserfall |
| Fortschritt gegen Ziel | Balken mit Zielmarkierung (Bullet Chart) |
| geografische Verteilung | Kartendiagramm |
| Prozessverlust über Stufen | Trichter |

## Die Sonderfälle in Excel

- **Kombinationsdiagramm** mit Sekundärachse: legitim, wenn zwei Größen unterschiedlicher Einheit verglichen werden (Umsatz als Säule, Marge in % als Linie). **Nie** für zwei gleichartige Größen — die Sekundärachse lässt sich so skalieren, dass jede beliebige Aussage entsteht.
- **XY-Streudiagramm gegen Linie**: Beim Liniendiagramm ist die X-Achse eine Kategorie mit gleichem Abstand, beim Streudiagramm ein echter Zahlenwert. Zeitreihen mit ungleichmäßigen Abständen gehören ins Streudiagramm.
- **Wasserfall, Histogramm, Boxplot, Trichter, Treemap, Sunburst** gibt es ab Excel 2016 nativ.
- **Sparklines** (Einfügen ▸ Sparklines) setzen einen Mini-Verlauf in eine einzelne Zelle — ideal neben einer Kennzahlentabelle.
- **Bullet Chart** baut man aus einem gestapelten Balken (Hintergrundzonen) plus einer Reihe als Punkt/Strich für das Ziel.

## Handwerkliche Regeln

- **Balken beginnen bei null.** Immer. Bei Linien ist eine gestauchte Achse zulässig, weil dort die *Veränderung* die Aussage trägt.
- **Kategorien sortieren** — nach Wert, nicht alphabetisch, außer die Reihenfolge ist inhaltlich (Monate, Schulnoten).
- **Gitternetz zurücknehmen**, Rahmen weg, Legende nur wenn nötig — besser direkt an der Linie beschriften.
- **Farbe sparsam**: eine Akzentfarbe für die Aussage, Grau für den Rest. Farbe kodiert Bedeutung, nicht Dekoration.
- **Rot/Grün nicht allein tragend** — rund 8 % der Männer sehen den Unterschied nicht. Zusätzlich Form, Position oder Vorzeichen einsetzen.
- **Titel als Aussage** schreiben: nicht „Umsatz nach Monat", sondern „Umsatz seit April rückläufig".
- **Datenreihen aus Tabellen** speisen, damit neue Zeilen automatisch im Diagramm landen.

## Dynamische Diagramme

- Diagrammquelle als intelligente Tabelle → wächst mit.
- Reihe an einen **benannten dynamischen Bereich** binden (`=Mappe!Umsatzreihe`) → per Steuerelement umschaltbare Anzeige.
- Reihe an eine `FILTER`-Ausgabe binden (über einen Namen auf `$H$2#`) → filterbare Diagramme ohne Makro.
- **Datenschnitte** auf Pivot-Diagrammen sind der einfachste interaktive Weg.

::: quiz
F: Warum ist ein Balkendiagramm mit abgeschnittener Achse irreführend, ein Liniendiagramm mit derselben Achse aber vertretbar?
A: Der Balken kodiert den Wert als Länge — Abschneiden verfälscht das Verhältnis. Die Linie kodiert die Veränderung über die Steigung, die von der Achsenbasis unabhängig ist.

F: Wann ist eine Sekundärachse in Ordnung?
A: Nur bei zwei Größen unterschiedlicher Einheit oder Größenordnung, deren gemeinsamer Verlauf die Aussage ist — nie zum Vergleich zweier gleichartiger Werte.
:::
