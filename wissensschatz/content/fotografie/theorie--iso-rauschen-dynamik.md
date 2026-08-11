---
id: foto-iso-rauschen
title: ISO, Rauschen und Dynamikumfang
path: fotografie/theorie
level: 3
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [iso, rauschen, dynamikumfang, sensor, raw]
prereqs: [foto-belichtungsdreieck]
related: [foto-fokus-messung, foto-sensorformate, foto-motiv-astro]
summary: ISO verstärkt, es sammelt kein Licht. Warum Unterbelichten schlimmer ist als hohes ISO, und was Dual-Gain-Sensoren daran ändern.
---

## Was ISO wirklich tut

ISO ist **keine Sensorempfindlichkeit**. Der Sensor hat genau eine physikalische Empfindlichkeit. ISO ist eine Verstärkung, die auf das ausgelesene Signal angewendet wird — teils analog vor dem A/D-Wandler, teils digital danach.

Daraus folgt der wichtigste Satz zu diesem Thema: **Rauschen entsteht nicht durch hohes ISO, sondern durch wenig Licht.** Hohes ISO ist das Symptom, nicht die Ursache. Bei gleicher Blende und Zeit ist ein ISO-6400-Bild und ein um vier Stufen hochgezogenes ISO-400-Bild etwa gleich verrauscht — mit dem Unterschied, dass die analoge Verstärkung bei ISO 6400 das Ausleserauschen der nachfolgenden Elektronik teilweise umgeht und deshalb meist etwas besser aussieht.

## Rauscharten

- **Photonenrauschen (Schrotrauschen)** — die unvermeidbare statistische Streuung der ankommenden Photonen. Es wächst mit der Wurzel der Photonenzahl; das Signal-Rausch-Verhältnis wächst also ebenfalls mit der Wurzel. Vier Mal mehr Licht bedeutet halb so viel relatives Rauschen. Das ist Physik, nicht Sensorqualität.
- **Ausleserauschen** — durch die Elektronik beim Auslesen. Hier unterscheiden sich Sensoren wirklich.
- **Dunkelstromrauschen** — thermisch, wächst mit Belichtungszeit und Temperatur. Relevant ab mehreren Sekunden; deshalb kühlen Astrofotografen ihre Kameras.
- **Fixed Pattern Noise** — feste Musterabweichungen, meist herausgerechnet.

## Dual-Gain-Sensoren

Viele moderne Sensoren haben zwei Verstärkungsstufen in der Auslesekette. Beim Umschaltpunkt — je nach Modell ISO 400, 640, 800 oder 1250 — **verbessert** sich das Ausleserauschen sprunghaft, statt schlechter zu werden.

Praktische Folge: Es kann besser sein, direkt auf den zweiten Gain-Punkt zu gehen, statt knapp darunter zu bleiben. Bei einer Kamera mit Umschaltung bei ISO 640 liefert ISO 640 oft ein saubereres Bild als ISO 500. Für die eigene Kamera lohnt der Blick in Messreihen (etwa Photons-to-Photos „Read Noise vs ISO").

**ISO-invariante Sensoren** verlieren oberhalb einer bestimmten Stufe kaum noch Bildqualität durch nachträgliches Aufhellen. Bei ihnen ist es legitim, bei ISO 800 zu bleiben und in der Entwicklung um zwei Stufen aufzuhellen — man behält Reserven in den Lichtern. Bei nicht-invarianten Sensoren kostet dasselbe Vorgehen sichtbar Qualität.

## Dynamikumfang

Der Dynamikumfang ist der Abstand zwischen Sättigung (ausgefressenes Weiß) und Rauschgrenze, gemessen in Blendenstufen.

| Kategorie | Typischer Dynamikumfang bei Basis-ISO |
|---|---|
| Kleinbild, moderner Sensor | 13–15 EV |
| APS-C | 12–14 EV |
| MFT | 12–13 EV |
| Mittelformat 100 MP | 15–16 EV |
| Smartphone (Einzelbild) | 10–12 EV |
| Menschliches Auge, eine Adaptation | ca. 14 EV |
| Typische Sonnenuntergangsszene | 16–20 EV |

Der Dynamikumfang **sinkt mit steigendem ISO** — grob eine Stufe je ISO-Verdopplung, weil die Sättigungsgrenze mitverschoben wird.

Wenn die Szene mehr Dynamik hat als der Sensor: Belichtungsreihe und HDR, Verlaufsfilter, Blitz oder Reflektor zum Aufhellen — oder die bewusste Entscheidung, welchen Teil man opfert.

## Belichtungsstrategie

**ETTR (Expose To The Right)**: So hell belichten, dass das Histogramm rechts anliegt, ohne die Lichter zu verlieren. Begründung: Die oberste Blendenstufe enthält bei linearer Sensorkennlinie die Hälfte aller Tonwerte. Wer eine Stufe verschenkt, verschenkt die Hälfte der Datenpunkte.

Grenzen von ETTR:
- Gilt nur für RAW. JPEG rechnet ohnehin eine Kurve darauf.
- Das Histogramm der Kamera zeigt das **JPEG-Vorschaubild**, nicht die RAW-Daten. Die echten RAW-Lichter halten meist noch 0,3 bis 1 Stufe mehr aus. Mit einem neutralen Bildstil und Belichtungswarnung lässt sich das annähern; UniWB ist die genaue, aber unbequeme Lösung.
- Bei Menschen, Bewegung und wechselndem Licht ist Sicherheitsabstand wichtiger als das letzte Drittel.

Für Astro und andere extrem dunkle Szenen gilt eine andere Regel: Das Histogramm soll vom linken Rand **abheben**, damit das Signal über dem Ausleserauschen liegt.

## Rauschunterdrückung

- **In der Kamera** (für JPEG) kostet Details. Für RAW-Arbeit auf niedrig stellen.
- **In der Entwicklung**: Luminanz- und Farbrauschen getrennt behandeln. Farbrauschen darf aggressiv weg, es enthält kaum Bildinformation. Luminanzrauschen sparsam — es sieht in Maßen wie Filmkorn aus, und zu viel Glättung erzeugt Wachsfiguren.
- **KI-Entrauschung** (Lightroom Denoise, DxO DeepPRIME, Topaz) hat den nutzbaren ISO-Bereich real um zwei bis drei Stufen erweitert. Sie arbeitet auf den RAW-Daten und rekonstruiert Details statt sie zu glätten. Für Wildlife und Innenraumsport ist das der größte Fortschritt der letzten Jahre.
- **Mitteln mehrerer Aufnahmen** reduziert Rauschen mit der Wurzel der Bildanzahl — vier Aufnahmen halbieren das Rauschen. Grundlage der Astro-Stacking-Verfahren, funktioniert aber auch bei statischen Innenaufnahmen.

::: quiz
F: Warum ist ein bei ISO 400 aufgenommenes und um drei Stufen aufgehelltes Bild oft schlechter als eines mit ISO 3200?
A: Die analoge Verstärkung vor dem A/D-Wandler umgeht einen Teil des Ausleserauschens. Bei ISO-invarianten Sensoren ist der Unterschied allerdings gering.

F: Was ist ETTR und wo liegt sein Haken?
A: Möglichst hell belichten ohne ausgefressene Lichter, weil die obersten Stufen die meisten Tonwerte enthalten. Haken: Das Kamerahistogramm zeigt das JPEG, nicht die RAW-Reserve.

F: Um wie viel sinkt das relative Rauschen, wenn du viermal so viel Licht sammelst?
A: Auf die Hälfte — das Signal-Rausch-Verhältnis wächst mit der Wurzel der Photonenzahl.
:::
