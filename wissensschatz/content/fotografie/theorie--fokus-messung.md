---
id: foto-fokus-messung
title: Autofokus und Belichtungsmessung
path: fotografie/theorie
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [autofokus, messmethode, histogramm, kameraeinstellung]
prereqs: [foto-belichtungsdreieck]
related: [foto-motiv-sport, foto-iso-rauschen, foto-verschlusszeit]
summary: PDAF gegen CDAF, die Fokusmodi und Messmethoden im Klartext — und wie man das Histogramm richtig liest.
---

## Autofokus-Verfahren

**Kontrastmessung (CDAF)** — die Kamera sucht das Maximum an Kantenkontrast, indem sie den Fokus durchfährt. Sehr genau, aber langsam, und sie weiß nicht, in welche Richtung sie muss (deshalb das typische Pumpen). Bei modernen Kameras nur noch als Feinabstimmung im Einsatz.

**Phasenerkennung (PDAF)** — misst den Versatz zweier Teilstrahlen und weiß daraus **Richtung und Betrag** der Fehlfokussierung in einem Schritt. Deshalb schnell und für Nachführung geeignet. Bei DSLRs in einem separaten Modul (mit dem Nachteil, dass es dejustiert sein kann — daher AF-Feinabstimmung), bei spiegellosen Kameras direkt auf dem Sensor.

**On-Sensor-Varianten:**
- **Dual Pixel AF** (Canon): Jeder Pixel besteht aus zwei Fotodioden — flächendeckende Phasenerkennung ohne Ausfall an Bildinformation.
- **Maskierte Phasenpixel** (Sony, Nikon, Fuji u. a.): einzelne Pixel dienen der Messung, ihre Bildinformation wird interpoliert.
- **Quad Pixel AF**: Unterteilung in vier Dioden, damit auch waagerechte Strukturen erfasst werden.

**Empfindlichkeit** wird in EV angegeben (z. B. „−6 EV"). Je niedriger, desto besser bei Dunkelheit. Angaben gelten meist für f/1,2- oder f/2-Objektive; bei f/6,3 an einem Telezoom liegt der reale Wert deutlich höher.

**Motiverkennung** ist der eigentliche Sprung der letzten Jahre: Gesicht, Auge (Mensch/Tier/Vogel), Fahrzeug, Flugzeug, Zug, Insekt. Sie erkennt das Motiv und hält es unabhängig vom Messfeld. Praktische Folge: Statt Messfelder zu verschieben, wählt man den Motivtyp und lässt die Kamera folgen.

## Fokusmodi

| Modus | Canon | Nikon/Sony/Fuji | Wofür |
|---|---|---|---|
| Einzel-AF | One Shot | AF-S | Unbewegtes: Landschaft, Porträt, Produkt |
| Nachführ-AF | AI Servo | AF-C | Alles Bewegte |
| Automatisch | AI Focus | AF-A | Unklare Lage; im Zweifel lieber selbst entscheiden |
| Manuell | MF | MF | Makro, Astro, Video, schwierige Situationen |

**Feldwahl:** Einzelfeld (präzise, für ruhige Motive), Feldgruppe/Zone (Kompromiss), großflächig/automatisch (mit Motiverkennung heute erste Wahl bei bewegten Motiven), Tracking (Motiv wird verfolgt).

**Nachführparameter** bei Sport/Wildlife lohnen die Einstellung:
- *AF-Verzögerung / Blockierung*: Wie lange hält die Kamera am Motiv fest, wenn etwas davorläuft? Hoch bei Hindernissen (Zaun, Gegenspieler), niedrig bei plötzlichen Motivwechseln.
- *Empfindlichkeit auf Beschleunigung*: hoch bei Ballsport, niedrig bei gleichmäßigen Bewegungen.

**Back-Button-Focus**: Autofokus vom Auslöser trennen und auf eine Daumentaste legen (AF-ON). Dann lässt sich fokussieren und auslösen unabhängig steuern — Fokus halten ohne Modus zu wechseln, mehrere Bilder desselben Fokus, oder durchgängig nachführen. Für alle, die viel bewegte Motive fotografieren, die lohnendste Umgewöhnung.

**Manuelle Fokushilfen:** Fokus-Peaking (farbige Kantenmarkierung), Lupenvergrößerung, Fokusskala. Für Astro und Makro sind Lupe plus Live-View der genaueste Weg — Peaking allein ist bei offener Blende zu ungenau.

## Belichtungsmessung

| Methode | Wirkung | Wofür |
|---|---|---|
| **Mehrfeld / Matrix / Evaluativ** | Szenenanalyse über viele Zonen, bezieht das Fokusfeld ein | Standard, unkritische Situationen |
| **Mittenbetont** | gewichtet die Bildmitte | vorhersagbar, gut für gleichbleibende Serien |
| **Spot** | 1–5 % des Bildes | Gegenlicht, Bühne, Mond, gezielte Messung auf Haut |
| **Selektiv / Teilmessung** | 6–10 % | zwischen Spot und mittenbetont |
| **Highlight-betont** | schützt die hellsten Bereiche | Bühne, Konzert, Schnee |

**Alle Messmethoden zielen auf mittleres Grau (18 %).** Deshalb wird eine Schneelandschaft grau (Kamera dunkelt ab) und eine schwarze Wand ebenfalls grau (Kamera hellt auf). Die Korrektur ist der eigentliche Handgriff:

- Schnee, weiße Wand, heller Sand: **+1 bis +2 EV**
- Dunkler Wald, schwarzes Fell, dunkler Anzug: **−1 bis −2 EV**

Das ist der Grund, warum die Belichtungskorrektur ein Rad und keine Menüoption sein sollte.

**Belichtungsreihe (Bracketing)** für HDR-Szenen: 3 bis 7 Aufnahmen im Abstand von 1–2 EV. Automatisch mit Serienbild, damit Bewegung zwischen den Aufnahmen minimal bleibt.

## Histogramm lesen

Das Histogramm zeigt die Verteilung der Helligkeitswerte von Schwarz (links) bis Weiß (rechts).

- **Anschlag rechts** = ausgefressene Lichter, unwiederbringlich (bei JPEG; RAW hat etwas Reserve).
- **Anschlag links** = abgesoffene Schatten, dort steckt nur Rauschen.
- **Es gibt kein „richtiges" Histogramm.** Ein Bild bei Nacht gehört links, ein Bild im Schnee rechts. Wer auf eine Glockenkurve hin belichtet, macht alles grau.
- **RGB-Histogramm statt Luminanz**: Ein einzelner Kanal kann ausbrennen, während die Luminanz noch harmlos aussieht — typisch bei kräftigem Rot (Blumen, Sonnenuntergang, Feuerwehrfahrzeuge, Logos).
- **Zebra / Blinkies** markieren überbelichtete Stellen direkt im Bild — schneller ablesbar als das Histogramm.

::: quiz
F: Warum wird eine Schneelandschaft mit Automatik zu dunkel?
A: Jede Belichtungsmessung zielt auf mittleres Grau. Weiße Flächen werden dadurch abgedunkelt — Korrektur +1 bis +2 EV.

F: Was ist der Vorteil von Back-Button-Focus?
A: Fokussieren und Auslösen sind entkoppelt. Man kann den Fokus halten, mehrere Bilder machen oder nachführen, ohne den AF-Modus zu wechseln.

F: Warum reicht das Luminanz-Histogramm nicht immer?
A: Ein einzelner Farbkanal kann ausbrennen, ohne dass die Luminanz es zeigt — häufig bei gesättigtem Rot. Dafür das RGB-Histogramm ansehen.
:::
