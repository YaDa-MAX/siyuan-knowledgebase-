---
id: foto-sensorformate
title: Sensorformate, Auflösung und Bildqualität
path: fotografie/theorie
level: 3
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [sensor, format, aufloesung, crop, bayer]
prereqs: [foto-brennweite-perspektive]
related: [foto-iso-rauschen, foto-blende-schaerfentiefe, foto-mounts]
summary: Formatgrößen im Vergleich, warum Sensorfläche und nicht Megapixel über Rauschen entscheidet, und was Bayer-Matrix, BSI und Stacked bedeuten.
---

## Formate im Vergleich

| Format | Maße (mm) | Fläche (mm²) | Faktor | Typischer Einsatz |
|---|---|---|---|---|
| Mittelformat 54 × 40 | 53,7 × 40,2 | 2159 | 0,64 | Digitalrückteile, Studio |
| Mittelformat 44 × 33 | 43,8 × 32,9 | 1441 | 0,79 | Fujifilm GFX, Hasselblad X |
| Kleinbild (Vollformat) | 36 × 24 | 864 | 1,0 | Referenzformat |
| APS-H | 28,7 × 19 | 545 | 1,3 | historisch Canon 1D |
| APS-C (Nikon/Sony/Fuji/Pentax) | 23,5 × 15,6 | 367 | 1,5 | verbreitetstes Wechselobjektivformat |
| APS-C (Canon) | 22,3 × 14,9 | 332 | 1,6 | Canon EF-S / RF-S |
| Micro Four Thirds | 17,3 × 13 | 225 | 2,0 | OM System, Panasonic |
| 1 Zoll | 13,2 × 8,8 | 116 | 2,7 | Kompaktkameras, Drohnen |
| 1/1,3" | ca. 9,8 × 7,3 | 72 | 3,7 | Spitzen-Smartphones |
| 1/2,55" | ca. 5,6 × 4,2 | 24 | 6,4 | übliche Smartphone-Hauptkamera |

Kleinbild hat die **2,4-fache Fläche** von APS-C und die **3,8-fache** von MFT. Das ist der eigentliche Unterschied — nicht die Megapixel.

## Fläche schlägt Auflösung

Rauschen und Dynamikumfang hängen davon ab, wie viele Photonen der Sensor **insgesamt** einfängt, also von der Fläche. Zwei Sensoren gleicher Fläche mit 24 und 61 MP zeigen bei gleicher Ausgabegröße etwa dasselbe Rauschverhalten — die kleineren Pixel rauschen einzeln mehr, aber es werden entsprechend mehr gemittelt.

Was Auflösung wirklich bringt:
- Reserve zum Beschneiden (ein 61-MP-Bild auf APS-C-Ausschnitt beschnitten ergibt noch 26 MP).
- Große Drucke und Detailtreue bei Landschaft und Reproduktion.
- Weniger Moiré durch feinere Abtastung.

Was sie kostet: Dateigröße, Rechenzeit, höhere Ansprüche an Objektive und Verwacklungsfreiheit, früher einsetzende sichtbare Beugung.

**Für Druck** gilt: 300 dpi bei Betrachtung aus Nahdistanz. Ein A3-Druck (297 × 420 mm) braucht rechnerisch etwa 3500 × 4960 Pixel ≈ 17 MP. Ein A2-Druck ≈ 35 MP. Für Plakate, die aus zwei Metern betrachtet werden, reichen 100–150 dpi — 12 MP ergeben dort ein sauberes A1.

## Aufbau des Sensors

**Bayer-Matrix**: Über den Pixeln liegt ein Farbfiltermuster aus 50 % Grün, 25 % Rot, 25 % Blau (Grün doppelt, weil das Auge dort am empfindlichsten ist). Jeder Pixel misst nur eine Farbe; die übrigen beiden werden aus den Nachbarn interpoliert (Demosaicing). Deshalb hat ein „24-MP-Sensor" keine 24 Millionen vollständigen Farbmessungen.

Alternativen:
- **X-Trans** (Fujifilm): 6 × 6-Muster statt 2 × 2, reduziert Moiré ohne Tiefpassfilter, verlangt angepasstes Demosaicing.
- **Foveon** (Sigma): drei übereinanderliegende Schichten messen alle Farben je Position. Hervorragende Farbauflösung, schwächer bei hohem ISO.
- **Quad Bayer / Tetracell** (Smartphones): vier Pixel unter einem Filter, im Hellen einzeln ausgelesen, im Dunkeln zusammengefasst.

**Tiefpassfilter (AA-Filter)**: Weichzeichnet minimal, um Moiré an feinen Mustern zu vermeiden. Moderne hochauflösende Sensoren verzichten meist darauf, weil die Abtastung ohnehin fein genug ist.

**BSI (Backside Illuminated)**: Verdrahtung liegt hinter der lichtempfindlichen Schicht statt davor — mehr Licht kommt an, besonders bei kleinen Pixeln und schrägem Lichteinfall.

**Stacked BSI**: Auslese-Elektronik und Speicher liegen als eigene Schicht unter dem Sensor. Ergebnis: sehr schnelles Auslesen — kaum Rolling Shutter, hohe Serienbildraten, Autofokus-Berechnung während der Belichtung. Das technische Merkmal, das aktuelle Sport- und Wildlife-Kameras auszeichnet.

**Global Shutter**: alle Pixel gleichzeitig belichtet und ausgelesen. Löst Rolling Shutter vollständig, kostet aktuell noch Dynamikumfang.

## Pixel Shift

Mehrere Aufnahmen mit sensorseitig um ein Pixel (oder ein halbes) verschobenem Sensor werden verrechnet. Ergebnis: volle Farbinformation je Position, deutlich mehr Detail, weniger Rauschen, kein Moiré. Voraussetzung: Stativ und unbewegtes Motiv. Für Reproduktion, Architektur, Produkt und Landschaft bei Windstille ein erheblicher Qualitätsgewinn ohne neue Hardware.

## Was Formatwahl praktisch bedeutet

| Priorität | Empfehlung |
|---|---|
| Freistellung bei wenig Licht, Porträt | Kleinbild oder größer |
| Maximale Detailtreue, Studio, Landschaft groß gedruckt | Mittelformat |
| Reichweite je Gramm (Wildlife, Reise) | MFT oder APS-C — der Crop wirkt wie ein Telekonverter ohne Lichtverlust |
| Video mit ruhiger Kamera | MFT/APS-C, mehr Schärfentiefe erleichtert den Fokus |
| Kompromiss aus allem | APS-C oder Kleinbild |

::: quiz
F: Zwei Sensoren gleicher Größe, 24 und 61 MP. Welcher rauscht bei gleicher Ausgabegröße weniger?
A: Praktisch gleich viel. Entscheidend ist die gesammelte Lichtmenge über die Fläche, nicht die Pixelgröße.

F: Was macht ein Stacked-Sensor besser als ein normaler BSI-Sensor?
A: Er liest deutlich schneller aus — dadurch kaum Rolling Shutter, hohe Serienbildraten und Autofokusberechnung während der Belichtung.

F: Wie viele Megapixel braucht ein sauberer A3-Druck bei 300 dpi?
A: Rund 17 MP (3500 × 4960 Pixel).
:::
