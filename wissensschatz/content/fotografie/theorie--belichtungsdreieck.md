---
id: foto-belichtungsdreieck
title: Das Belichtungsdreieck — Blende, Zeit, ISO
path: fotografie/theorie
level: 1
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [belichtung, blende, verschlusszeit, iso, grundlagen]
prereqs: []
related: [foto-blende-schaerfentiefe, foto-verschlusszeit, foto-iso-rauschen, foto-fokus-messung]
summary: Drei Stellgrößen, ein Lichtwert. Jede Änderung um eine Stufe verdoppelt oder halbiert die Lichtmenge — und hat je eine eigene Nebenwirkung auf das Bild.
---

## Kern

Die Belichtung eines Bildes hängt von drei Größen ab:

| Größe | Steuert die Lichtmenge über | Bildnebenwirkung |
|---|---|---|
| **Blende** (f/) | Größe der Öffnung | Schärfentiefe |
| **Verschlusszeit** (s) | Dauer der Öffnung | Bewegungsdarstellung |
| **ISO** | Verstärkung des Sensorsignals | Rauschen und Dynamikumfang |

Der Trick ist, dass alle drei in derselben Einheit gedacht werden können: in **Blendenstufen** (auch Lichtwerte, EV oder „Stops"). Eine Stufe bedeutet immer Faktor 2 in der Lichtmenge — egal, an welchem der drei Regler man dreht.

## Die Stufenreihen

**Blende** (jede Stufe = Faktor √2 im Durchmesser, Faktor 2 in der Fläche):
```
1.0 · 1.4 · 2.0 · 2.8 · 4.0 · 5.6 · 8 · 11 · 16 · 22 · 32
```
Kleinere Zahl = größere Öffnung = mehr Licht. Die Blendenzahl ist ein Verhältnis: Brennweite geteilt durch Öffnungsdurchmesser. Deshalb bedeutet f/2,8 an einem 24-mm- und an einem 200-mm-Objektiv dieselbe Helligkeit, obwohl die Öffnung physisch völlig unterschiedlich groß ist.

**Verschlusszeit** (jede Stufe = Faktor 2 in der Dauer):
```
1s · 1/2 · 1/4 · 1/8 · 1/15 · 1/30 · 1/60 · 1/125 · 1/250 · 1/500 · 1/1000 · 1/2000 · 1/4000
```

**ISO** (jede Stufe = Faktor 2 in der Verstärkung):
```
100 · 200 · 400 · 800 · 1600 · 3200 · 6400 · 12800 · 25600
```

Moderne Kameras arbeiten meist in Drittelstufen, weshalb dazwischen Werte wie f/3,2 oder 1/160 s liegen.

## Äquivalente Einstellungen

Alle folgenden Kombinationen ergeben dieselbe Helligkeit:

```
f/2.8 · 1/1000 s · ISO 100
f/4.0 · 1/500  s · ISO 100
f/5.6 · 1/250  s · ISO 100
f/5.6 · 1/500  s · ISO 200
f/8.0 · 1/250  s · ISO 400
```

Die Wahl zwischen ihnen ist keine Belichtungsfrage, sondern eine **Gestaltungsfrage**. Genau das ist der Kern des Handwerks: Man entscheidet zuerst, welche Nebenwirkung das Bild braucht, und rechnet die übrigen Werte darauf hin.

## Der Lichtwert (EV)

Der EV fasst Blende und Zeit zu einer Zahl zusammen (bezogen auf ISO 100):

$$ EV = \log_2\left(\frac{N^2}{t}\right) $$

mit *N* = Blendenzahl und *t* = Belichtungszeit in Sekunden. Grobe Orientierungswerte:

| Situation | EV bei ISO 100 |
|---|---|
| Sonniger Tag, Schnee/Strand | 16 |
| Sonnig, klare Schatten | 15 |
| Leicht bewölkt | 14 |
| Bedeckt | 12–13 |
| Innenraum hell / Schaufenster | 8–9 |
| Wohnraum abends | 5–6 |
| Straßenbeleuchtung | 2–4 |
| Vollmondnacht, Landschaft | −2 bis −3 |
| Milchstraße | −6 bis −8 |

Daraus folgt die **Sunny-16-Regel**: Bei klarem Sonnenschein liefert Blende f/16 mit Verschlusszeit 1/ISO eine korrekte Belichtung — also ISO 100 mit 1/100 s bei f/16. Sie funktioniert seit hundert Jahren ohne Belichtungsmesser und ist die schnellste Plausibilitätsprüfung, wenn eine Automatik seltsame Werte anzeigt.

## Halbautomatiken

| Modus | Vorgabe | Wann |
|---|---|---|
| **A / Av** — Zeitautomatik | Blende | Wenn Schärfentiefe das Wichtigste ist: Porträt, Landschaft, Produkt |
| **S / Tv** — Blendenautomatik | Zeit | Wenn Bewegung das Wichtigste ist: Sport, Wildlife, Mitzieher |
| **M** — Manuell | beides | Gleichbleibendes Licht, Studio, Blitz, Panorama, Astro |
| **P** | Automatik mit Programmverschiebung | Schnappschuss, unklare Lage |
| **Auto-ISO mit Untergrenze** | Blende + Zeit, ISO variabel | Der Alltagsmodus: Reportage, Veranstaltung |

**Auto-ISO in M** ist die unterschätzte Kombination: Man legt Blende und Zeit fest — also beide Gestaltungsparameter — und überlässt der Kamera nur die Verstärkung. Mit einer ISO-Obergrenze und einer Belichtungskorrektur ist das für wechselndes Licht die schnellste sichere Einstellung.

::: quiz
F: Warum bedeutet f/2,8 an einem 24-mm- und an einem 200-mm-Objektiv dieselbe Helligkeit?
A: Die Blendenzahl ist ein Verhältnis von Brennweite zu Öffnungsdurchmesser. Bei gleichem Verhältnis fällt pro Fläche dieselbe Lichtmenge auf den Sensor, obwohl die Öffnung physisch verschieden groß ist.

F: Wie lautet die Sunny-16-Regel?
A: Bei klarem Sonnenschein: Blende f/16, Verschlusszeit 1/ISO. Also ISO 100 mit 1/100 s.

F: Du gehst von f/4 · 1/250 s · ISO 200 auf f/8. Wie gleichst du zwei Stufen aus?
A: Entweder Zeit auf 1/60 s (zwei Stufen länger) oder ISO auf 800 (zwei Stufen höher) — oder je eine Stufe auf beiden.
:::
