---
id: foto-licht-wb
title: Licht, Farbtemperatur und Weißabgleich
path: fotografie/theorie
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [licht, weissabgleich, farbtemperatur, farbraum]
prereqs: [foto-belichtungsdreieck]
related: [foto-blitz, foto-dateiformate, druck-farbmanagement]
summary: Kelvin, Tint und Mischlicht — und die Eigenschaften von Licht, die über die Bildwirkung entscheiden: Richtung, Größe, Härte, Farbe.
---

## Die vier Eigenschaften von Licht

Über die Bildwirkung entscheiden nicht Lampen, sondern vier Größen:

1. **Richtung** — Frontlicht macht flach, Seitenlicht modelliert, Gegenlicht trennt und dramatisiert, Oberlicht erzeugt harte Augenhöhlen.
2. **Größe relativ zum Motiv** — der entscheidende Faktor für Härte. Eine Softbox von 1 m Kantenlänge ist bei 1 m Abstand riesig und weich, bei 5 m klein und hart. Die Sonne ist trotz ihrer Größe hart, weil sie so weit weg ist — bei Bewölkung wird der ganze Himmel zur Lichtquelle und damit riesig und weich.
3. **Härte** — Folge aus Punkt 2, sichtbar an der Schattenkante: harte Kante = harte Quelle.
4. **Farbe** — Farbtemperatur und Farbwiedergabe.

Diese vier Größen lassen sich unabhängig vom Budget steuern: Ein weißes Bettlaken vor dem Fenster ist eine große weiche Quelle, ein Stück Karton ein Aufheller, ein Fenster mit Vorhang ein Verlaufsfilter.

## Farbtemperatur

Angegeben in Kelvin, als Temperatur eines schwarzen Strahlers gleicher Farbanmutung. **Niedrige Werte sind rötlich, hohe bläulich** — akustisch verwirrend, weil wir Rot „warm" nennen.

| Lichtquelle | Kelvin |
|---|---|
| Kerze | 1800–1900 |
| Glühlampe 40 W | 2400 |
| Glühlampe 100 W / Halogen | 2800–3200 |
| Warmweiße LED | 2700–3000 |
| Sonnenaufgang / Goldene Stunde | 3000–4000 |
| Neutralweiße LED / Leuchtstoff | 4000 |
| Mittagssonne | 5200–5800 |
| Elektronenblitz | 5500–6000 |
| Bedeckter Himmel | 6000–7500 |
| Schatten bei blauem Himmel | 7500–9000 |
| Blaue Stunde | 9000–12000 |

Der zweite Regler ist **Tint** (Grün–Magenta). Er ist nötig, weil viele Lichtquellen nicht auf der Schwarzkörperkurve liegen: Leuchtstoff- und billige LED-Lampen ziehen ins Grüne und brauchen Magenta-Korrektur.

## Farbwiedergabe

Zwei Lampen mit identischen 3000 K können völlig unterschiedlich wirken, wenn ihr Spektrum lückenhaft ist. Kennzahlen:

- **CRI / Ra** — Farbwiedergabeindex, 0–100. Ab Ra 90 brauchbar für Fotografie, ab Ra 95 gut. Der Wert mittelt nur acht Testfarben und beschönigt gern.
- **R9** — Wiedergabe von gesättigtem Rot, wird im Ra nicht mitgerechnet. Für Hauttöne entscheidend; viele billige LEDs haben ein miserables R9.
- **TLCI** — dieselbe Idee für Videokameras.
- **TM-30 (Rf/Rg)** — modernere, aussagekräftigere Messung.

Für Aufnahmen mit Menschen: hoher R9-Wert, sonst werden Lippen und Hauttöne stumpf und lassen sich nachträglich kaum retten.

## Weißabgleich in der Praxis

- **RAW**: Der Weißabgleich ist nur ein Metadatum und in der Entwicklung **verlustfrei änderbar**. Trotzdem sinnvoll, ihn grob richtig zu setzen — die Vorschau, das Histogramm und die Belichtungsbeurteilung hängen daran.
- **JPEG**: Der Weißabgleich ist eingebrannt. Hier muss er stimmen.
- **Automatik** ist heute sehr gut, driftet aber zwischen Aufnahmen derselben Serie. Für konsistente Serien: feste Kelvinzahl.
- **Graukarte oder Farbchecker** ins erste Bild einer Serie legen und daraus den Weißabgleich für alle setzen. In Studio, Produktfotografie und Reproduktion Standard.
- **Kreativer Weißabgleich**: Bewusst zu warm bei Sonnenuntergang, bewusst kühl in der blauen Stunde. „Technisch korrekt" ist nicht immer richtig.

## Mischlicht

Der schwierigste Fall: Tageslicht durchs Fenster (5500 K) trifft auf Deckenbeleuchtung (3000 K). Ein einzelner Weißabgleich kann nur eine der beiden Quellen richtig stellen.

Lösungen, nach Aufwand:
1. Eine Quelle ausschalten oder ausschließen.
2. **Konversionsfolie** auf den Blitz: CTO (Color Temperature Orange) macht Blitzlicht zu Kunstlicht, CTB umgekehrt. Danach hat die Szene eine einheitliche Temperatur.
3. Zwei Aufnahmen mit unterschiedlichem Weißabgleich und selektives Überblenden in der Entwicklung.
4. Selektive lokale Korrektur mit Masken.
5. Schwarzweiß — löst jedes Mischlichtproblem.

## Farbräume

- **sRGB** — kleinster Umfang, Standard für Web, Bildschirme und Labordrucke. Im Zweifel sRGB.
- **Adobe RGB** — größerer Umfang besonders in Cyan/Grün, sinnvoll für den Druck mit CMYK-Prozessen.
- **ProPhoto RGB** — sehr groß, Arbeitsfarbraum in der RAW-Entwicklung, braucht 16 Bit (in 8 Bit entstehen Abrisse).
- **Display P3** — Standard aktueller Displays, zwischen sRGB und Adobe RGB.

Merksatz: **In großem Farbraum arbeiten, im passenden ausgeben.** Ein Adobe-RGB-Bild ohne eingebettetes Profil im Web sieht flau aus, weil Browser sRGB annehmen.

::: quiz
F: Was macht eine Lichtquelle weich?
A: Ihre Größe relativ zum Motiv, also der scheinbare Winkel. Große nahe Quellen sind weich, kleine ferne hart.

F: Warum ist Ra 95 allein noch keine Garantie für gute Hauttöne?
A: Ra mittelt acht Testfarben ohne gesättigtes Rot. Dafür steht R9 — und der ist bei vielen LEDs schlecht.

F: Ist der Weißabgleich bei RAW-Aufnahmen egal?
A: Verlustfrei änderbar, aber nicht egal: Vorschau, Histogramm und damit die Belichtungsbeurteilung hängen daran.
:::
