---
id: foto-blende-schaerfentiefe
title: Blende, Schärfentiefe, Hyperfokaldistanz und Beugung
path: fotografie/theorie
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [blende, schaerfentiefe, optik, beugung, bokeh]
prereqs: [foto-belichtungsdreieck]
related: [foto-brennweite-perspektive, foto-sensorformate, foto-motiv-landschaft, foto-motiv-portraet]
summary: Was die Schärfentiefe wirklich bestimmt, warum Abblenden ab einem Punkt wieder unschärfer wird, und wie man in der Landschaft alles scharf bekommt.
---

## Was die Schärfentiefe bestimmt

Vier Größen, in der Reihenfolge ihres Einflusses:

1. **Aufnahmeabstand** — der stärkste Hebel. Schärfentiefe wächst ungefähr mit dem Quadrat der Entfernung. Doppelter Abstand bedeutet grob vierfache Schärfentiefe.
2. **Blende** — Abblenden um eine Stufe vergrößert die Schärfentiefe um Faktor √2.
3. **Brennweite** — längere Brennweite verringert die Schärfentiefe (bei gleichem Abstand).
4. **Sensorformat** bzw. der zulässige Zerstreuungskreis.

::: viz schaerfentiefe
:::

Der berühmte Merksatz „bei gleichem Bildausschnitt hängt die Schärfentiefe nur von Blende und Abstand ab" stimmt näherungsweise: Tritt man mit einem 85 mm so weit zurück, dass der Ausschnitt dem eines 50 mm entspricht, gleichen sich die Schärfentiefen weitgehend an. Was sich dabei ändert, ist die **Perspektive** und der Charakter des Hintergrunds.

## Der Zerstreuungskreis

Schärfentiefe ist keine physikalische Eigenschaft, sondern eine **Wahrnehmungskonvention**. Genau scharf ist immer nur eine Ebene. Als „noch scharf" gilt, was auf dem fertigen Bild nicht mehr als ein bestimmter Kreis erscheint — der zulässige Zerstreuungskreis.

Übliche Werte: 0,03 mm bei Kleinbild (36 × 24 mm), 0,02 mm bei APS-C, 0,015 mm bei MFT. Die Annahme dahinter: Betrachtung eines 20 × 30 cm großen Abzugs aus etwa 30 cm.

Daraus folgt eine unbequeme Wahrheit: Bei 100-%-Ansicht auf einem 4K-Monitor ist die klassische Schärfentiefe **zu großzügig gerechnet**. Wer pixelgenau prüft, sollte etwa eine Stufe weiter abblenden als die Tabelle sagt — oder Fokus-Stacking einsetzen.

## Hyperfokaldistanz

Fokussiert man auf die Hyperfokaldistanz *H*, reicht die Schärfe von *H*/2 bis unendlich — die maximal mögliche Ausdehnung.

$$ H \approx \frac{f^2}{N \cdot c} + f $$

mit *f* = Brennweite (mm), *N* = Blendenzahl, *c* = Zerstreuungskreis (mm).

Beispiel Kleinbild, 24 mm, f/11, c = 0,03: *H* ≈ 24²/(11 · 0,03) ≈ 1746 mm ≈ 1,75 m. Fokus auf 1,75 m ergibt Schärfe von etwa 0,9 m bis unendlich.

**Praxishinweis**: Die klassische Hyperfokalmethode liefert an den Rändern nur gerade eben akzeptable Schärfe. Wer eine wirklich knackige Ferne will, fokussiert lieber etwas weiter (etwa doppelte Hyperfokaldistanz) und nimmt im Nahbereich Abstriche in Kauf — oder stapelt.

## Beugung

Ab einer bestimmten Blende wird das Bild durch **Abblenden wieder unschärfer**. Licht, das an der Blendenkante vorbeiläuft, wird gebeugt; aus jedem Punkt wird ein Airy-Scheibchen, dessen Durchmesser mit der Blendenzahl wächst.

$$ d_{\text{Airy}} \approx 1{,}22 \cdot \lambda \cdot N \cdot 2 $$

Praktisch heißt das: Sobald das Airy-Scheibchen größer wird als ein Pixel-Doppel, geht Auflösung verloren. Die **beugungsbegrenzte Blende** hängt am Pixelabstand, nicht am Sensorformat allein:

| Format / Auflösung | Beugung wird ab etwa sichtbar |
|---|---|
| MFT 20 MP | f/8 |
| APS-C 24 MP | f/8–f/11 |
| Kleinbild 24 MP | f/11–f/16 |
| Kleinbild 45–60 MP | f/8–f/11 |
| Mittelformat 100 MP | f/11 |

Wichtig: Beugung ist ein **weicher** Effekt. f/22 in der Landschaft ist nicht „kaputt", sondern gleichmäßig etwas weicher — und oft immer noch besser als eine unscharfe Bildhälfte. Die Regel lautet: so weit abblenden wie für die Schärfentiefe nötig, aber nicht weiter.

## Bokeh — die Qualität der Unschärfe

Die **Menge** an Unschärfe folgt aus der Optik; ihre **Anmutung** aus der Konstruktion:

- **Blendenlamellen**: Je mehr und je stärker gerundet, desto kreisförmiger bleiben Lichtpunkte beim Abblenden. Sieben gerade Lamellen erzeugen Siebenecke, elf gerundete bleiben rund.
- **Sphärische Aberration und Korrekturzustand**: Überkorrigierte Objektive zeichnen harte Ränder um Unschärfekreise („Zwiebelringe", „Nervosität"), unterkorrigierte weiche.
- **Vignettierung** beschneidet Unschärfekreise am Bildrand zu Katzenaugenformen — bei lichtstarken Objektiven offenblendig normal.
- **Spiegellinsen (Catadioptric)** erzeugen ringförmige „Donut"-Bokehs, weil der Fangspiegel die Mitte abschattet.
- **Apodisationsfilter** (Sony STF, Fujifilm APD) glätten die Ränder der Unschärfekreise, kosten dafür Licht.

## Praktische Blendenwahl

| Ziel | Blende |
|---|---|
| Maximale Freistellung | Offenblende bis eine Stufe abgeblendet |
| Bestmögliche Schärfe eines Objektivs | meist 2–3 Stufen über Offenblende („sweet spot") |
| Porträt, ganze Person scharf | f/4–f/5,6 |
| Gruppenfoto zwei Reihen | f/5,6–f/8 |
| Landschaft mit Vordergrund | f/8–f/11, ggf. Fokus-Stacking |
| Architektur innen | f/5,6–f/8 |
| Makro | f/8–f/16, praktisch immer Stacking |
| Sonnenstern erzeugen | f/16–f/22 (Zackenzahl = Lamellenzahl, bei gerader Zahl; doppelt bei ungerader) |

::: quiz
F: Warum wird ein Bild ab einer bestimmten Blende durch weiteres Abblenden unschärfer?
A: Beugung. Das Airy-Scheibchen wächst mit der Blendenzahl; sobald es größer als der Pixelabstand wird, geht Auflösung verloren.

F: Wovon hängt die Schärfentiefe am stärksten ab?
A: Vom Aufnahmeabstand — sie wächst näherungsweise mit dessen Quadrat. Blende und Brennweite folgen danach.

F: Warum sind die klassischen Schärfentiefetabellen bei 100-%-Ansicht am Monitor zu optimistisch?
A: Sie unterstellen einen 20 × 30 cm-Abzug aus 30 cm Abstand. Bei pixelgenauer Betrachtung ist der zulässige Zerstreuungskreis deutlich kleiner.
:::
