---
id: foto-objektivfehler
title: Abbildungsfehler und wie man sie erkennt
path: fotografie/theorie
level: 4
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [optik, abbildungsfehler, objektive, mtf]
prereqs: [foto-brennweite-perspektive, foto-blende-schaerfentiefe]
related: [foto-objektiv-kuerzel, foto-filter]
summary: Die klassischen Aberrationen, welche sich abblenden lassen, welche softwareseitig korrigierbar sind — und wie man MTF-Diagramme liest.
---

## Die Fehler im Einzelnen

| Fehler | Erscheinung | Abblenden hilft | Software korrigiert |
|---|---|---|---|
| **Sphärische Aberration** | flauer Kontrast offenblendig, Glow um Lichter | ja, deutlich | teilweise |
| **Koma** | Punkte am Rand werden zu Flügeln/Möwen | ja | nein |
| **Astigmatismus** | radiale und tangentiale Strukturen nicht gleichzeitig scharf | ja | nein |
| **Bildfeldwölbung** | Ränder liegen auf anderer Fokusebene als Mitte | teilweise | nein |
| **Längs-CA (LoCA)** | Farbsäume vor/hinter der Schärfeebene (grün/magenta) | ja | schwer |
| **Quer-CA (LaCA)** | Farbsäume an kontrastreichen Kanten zum Rand hin | kaum | ja, gut |
| **Verzeichnung** | gerade Linien werden tonnen- oder kissenförmig | nein | ja, gut |
| **Vignettierung** | Randabdunklung | ja | ja, kostet Rauschen |
| **Flare / Geisterbilder** | Schleier oder Lichtreflexe bei Gegenlicht | nein | nein |
| **Purple Fringing** | violette Säume an Überstrahlungen | ja | teilweise |

**Die wichtige Unterscheidung** ist die zwischen **Längs-CA** und **Quer-CA**. Quer-CA (laterale Farbquerfehler) lässt sich in der Entwicklung praktisch rückstandsfrei entfernen — sie ist deshalb kein Kaufkriterium mehr. Längs-CA sitzt in der Tiefe und hinterlässt grüne Säume hinter und magentafarbene vor der Schärfeebene; sie ist der Grund, warum lichtstarke Objektive mit „APO"-Korrektur teuer sind.

**Koma** ist das Ausschlusskriterium für Astrofotografie: Sterne am Bildrand werden zu Möwenflügeln. Es verschwindet beim Abblenden — was in der Astrofotografie aber Licht kostet, das man nicht hat. Deshalb sind komafreie Weitwinkel dort besonders gefragt.

**Flare** hängt von Vergütung und Konstruktion ab. Gegenmaßnahmen: Streulichtblende (auch bei bedecktem Himmel), saubere Frontlinse (Fingerabdrücke sind der häufigste Grund für Schleier), kein billiger Filter im Gegenlicht, notfalls die Hand als Abschattung.

## Objektivkorrekturprofile

Moderne spiegellose Objektive sind teilweise **bewusst auf Software hin gerechnet**: Verzeichnung und Vignettierung werden in Kauf genommen, um andere Fehler besser zu korrigieren oder kleiner zu bauen. Die Kamera und die RAW-Entwicklung wenden das mitgelieferte Profil automatisch an.

Das erklärt zwei Beobachtungen:
- Ein RAW sieht in einem Konverter ohne Profil (etwa in einem alten Programm) deutlich schlechter aus als im Herstellerprogramm.
- Der reale Bildwinkel ist nach der Entzerrung etwas kleiner als nominell angegeben.

Bei manchen Objektiven ist die Korrektur nicht abschaltbar — man arbeitet dann prinzipbedingt mit einem entzerrten und leicht beschnittenen Bild.

## MTF-Diagramme lesen

Die Modulationsübertragungsfunktion beschreibt, wie viel Kontrast das Objektiv bei einer bestimmten Feinheit überträgt.

- **X-Achse**: Abstand von der Bildmitte in mm (bei Kleinbild bis 21,6 mm = Ecke).
- **Y-Achse**: Kontrastübertragung, 1,0 = perfekt.
- **10 Linien/mm** (dicke Linie): grober Kontrast, entspricht der wahrgenommenen „Brillanz".
- **30 Linien/mm** (dünne Linie): Feinauflösung, entspricht der „Schärfe".
- **Sagittal (S) und meridional/tangential (M)**: Verlaufen sie weit auseinander, liegt Astigmatismus vor; das äußert sich als „nervöses" Bokeh.
- Hersteller-MTFs sind oft **gerechnet**, nicht gemessen — sie zeigen den Konstruktionsanspruch, nicht das Exemplar in der Hand.

## Praktischer Objektivtest

Was sich zu Hause in 20 Minuten prüfen lässt:

1. **Dezentrierung** — ein flaches Motiv (Ziegelwand, Zeitungsseite) planparallel bei Offenblende aufnehmen. Sind gegenüberliegende Ecken unterschiedlich scharf, ist das Exemplar dezentriert. Das ist der häufigste echte Mangel und ein Reklamationsgrund.
2. **Front-/Backfokus** — bei DSLRs mit einem schräg liegenden Maßstab prüfen. Bei spiegellosen Kameras irrelevant, weil auf dem Sensor gemessen wird.
3. **Offenblendleistung** — Mitte und Rand bei Offenblende und zwei Stufen abgeblendet vergleichen.
4. **Gegenlicht** — Lichtquelle knapp außerhalb des Bildes und knapp innerhalb.
5. **Fokusatmung** — nah und fern fokussieren, Ausschnittänderung beobachten (relevant für Video).

::: quiz
F: Welche chromatische Aberration lässt sich in der Entwicklung praktisch rückstandsfrei entfernen?
A: Die laterale (Quer-CA) an kontrastreichen Kanten. Die longitudinale (LoCA) vor und hinter der Schärfeebene bleibt schwierig.

F: Warum ist Koma für Astrofotografie das entscheidende Kriterium?
A: Sterne am Bildrand werden zu Flügelformen. Abblenden hilft, kostet aber Licht, das bei Astroaufnahmen ohnehin knapp ist.

F: Was zeigt der Abstand zwischen sagittaler und meridionaler MTF-Kurve an?
A: Astigmatismus — je weiter sie auseinanderlaufen, desto unruhiger wird typischerweise das Bokeh.
:::
