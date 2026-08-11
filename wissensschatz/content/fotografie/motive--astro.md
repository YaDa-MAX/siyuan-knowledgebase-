---
id: foto-motiv-astro
title: Astrofotografie
path: fotografie/motive
level: 5
type: rezept
source: ki
status: geprueft
updated: 2026-08-10
tags: [astro, milchstrasse, nachthimmel, stacking, langzeit]
prereqs: [foto-iso-rauschen, foto-objektivfehler]
related: [foto-motiv-nacht, foto-motiv-landschaft, foto-verschlusszeit]
summary: NPF-Regel statt 500er-Regel, warum Koma das Objektiv auswählt, und wie Stacking aus Rauschen ein Bild macht.
---

## Der Kern

Astrofotografie ist ein Rechenproblem: **Man braucht so viel Licht wie möglich, hat aber nur begrenzt Zeit, bevor die Erdrotation die Sterne zu Strichen zieht.** Alle Entscheidungen folgen daraus.

## Standardeinstellungen für die Milchstraße

```
Brennweite   14–24 mm, lichtstark (f/1,4–f/2,8)
Blende       Offenblende, notfalls eine Stufe abgeblendet gegen Koma
Zeit          nach NPF-Regel — meist 8–20 s
ISO           1600–6400 (am zweiten Gain-Punkt der Kamera, siehe unten)
Fokus         manuell mit Lupenansicht auf einen hellen Stern
Weißabgleich  fest, 3800–4200 K
Format        RAW, Langzeitrauschunterdrückung AUS
```

## Wie lange darf belichtet werden?

**500er-Regel** (grob): maximale Sekunden = 500 / Brennweite (Kleinbild). Bei 20 mm also 25 s. Sie stammt aus der Filmzeit und ist für heutige Sensoren zu großzügig — bei 100-%-Ansicht sind die Sterne bereits eiförmig.

**NPF-Regel** (genauer) berücksichtigt Blende, Pixelgröße und Deklination:

$$ t = \frac{(35 \cdot N + 30 \cdot p)}{f} $$

mit *N* = Blendenzahl, *p* = Pixelabstand in µm, *f* = Brennweite in mm.

Beispiel: 20 mm, f/2,8, Kleinbild 45 MP (p ≈ 4,4 µm) → t = (35·2,8 + 30·4,4)/20 = (98 + 132)/20 ≈ **11,5 s** statt der 25 s nach der 500er-Regel.

Zwei Ergänzungen: Sterne **am Himmelsäquator** wandern am schnellsten, in Polnähe kaum — nach Norden hin ist mehr Zeit drin. Und wer ohnehin stapelt, kann kürzer belichten und die Zahl der Aufnahmen erhöhen.

## Warum das Objektiv über das Ergebnis entscheidet

Bei Offenblende und Punktlichtquellen zeigt jedes Objektiv seine Schwächen gnadenlos:

- **Koma** macht Sterne am Bildrand zu Möwenflügeln. Es verschwindet beim Abblenden — was hier Licht kostet, das man nicht hat. Deshalb ist ein komafreies Weitwinkel bei Offenblende in dieser Disziplin mehr wert als eine Blendenstufe mehr.
- **Längs-CA** erzeugt violette oder grüne Höfe um helle Sterne.
- **Bildfeldwölbung** macht die Ränder unscharf, obwohl die Mitte sitzt.
- **Vignettierung** wird beim Aufhellen der dunklen Bereiche sichtbar verstärkt.

Praktisch: eine Stufe abblenden (f/1,4 → f/2) bringt bei den meisten Objektiven mehr Randqualität, als sie an Licht kostet.

## Fokussieren

Autofokus funktioniert nicht. Der zuverlässige Weg:

1. Live-View einschalten, Helligkeit hochdrehen.
2. Auf einen **hellen Stern** oder ein weit entferntes Licht schwenken.
3. Lupenansicht auf 10× oder 15×.
4. Manuell fokussieren, bis der Stern **kleinstmöglich** wird — nicht am hellsten, sondern am kleinsten.
5. Fokusring mit Klebeband fixieren. Er verstellt sich sonst beim Tragen.
6. **Zwischendurch kontrollieren** — bei fallender Temperatur wandert der Fokuspunkt.

Die Unendlichkeitsmarkierung auf dem Objektiv ist keine verlässliche Referenz.

## Der zweite Gain-Punkt

Viele Sensoren schalten bei einer bestimmten ISO-Stufe auf eine zweite Verstärkungsstufe um — dort **verbessert** sich das Ausleserauschen sprunghaft. Je nach Modell liegt der Punkt bei ISO 400, 640, 800 oder 1250.

Für Astro ist das die wichtigste Einzeleinstellung: ISO 640 kann sauberer sein als ISO 500. Für die eigene Kamera lohnt der Blick in Messreihen (Photons-to-Photos, „Read Noise vs ISO"). Anders als sonst gilt hier: **Das Histogramm soll vom linken Rand abheben** — das Signal muss über dem Ausleserauschen liegen, ETTR ist hier fehl am Platz.

## Stacking

Rauschen ist zufällig, das Signal nicht. Mittelt man *n* Aufnahmen, sinkt das Rauschen mit √*n*: **vier Aufnahmen halbieren es, sechzehn vierteln es.**

Der Ablauf:
1. **Lights** — 20 bis 60 Aufnahmen des Motivs, identische Einstellungen.
2. **Darks** — gleiche Zeit, ISO und Temperatur, aber mit Objektivdeckel. Entfernen Dunkelstrom und Hotpixel.
3. **Flats** — gegen eine gleichmäßig helle Fläche. Korrigieren Vignettierung und Staub.
4. **Bias/Offset** — kürzeste Zeit mit Deckel. Erfassen das Ausleserauschen.

Verrechnet mit Sequator, Starry Landscape Stacker (macOS), Siril oder DeepSkyStacker. Die Software richtet die Sterne aneinander aus — deshalb muss der **Vordergrund getrennt** aufgenommen und maskiert werden, sonst verwischt er.

**Langzeitrauschunterdrückung in der Kamera ausschalten.** Sie verdoppelt die Aufnahmezeit und erzeugt Lücken in Serien — Darks nimmt man selbst auf.

## Startrails

Andere Aufgabe, andere Einstellungen: viele Aufnahmen zu je 20–30 s über ein bis drei Stunden, per Intervallauslöser, danach im Hellwert-Modus gestapelt. Bei einer einzigen Langzeitbelichtung über eine Stunde ersäuft das Bild in Lichtverschmutzung und Sensorwärme.

Ausrichtung: Nach Norden zeigen die Spuren als Kreise um den Polarstern, nach Osten oder Westen als Bögen.

## Planung

- **Neumond** oder Zeitfenster, in dem der Mond unter dem Horizont steht.
- **Lichtverschmutzung**: Bortle-Skala prüfen (lightpollutionmap.info). Ab Bortle 4 wird die Milchstraße sichtbar, ab Bortle 2 spektakulär.
- **Milchstraßensaison** auf der Nordhalbkugel: das galaktische Zentrum steht etwa von Februar bis Oktober über dem Horizont, am günstigsten von Mai bis August.
- **Apps**: PhotoPills, Stellarium, Sky Guide — zeigen, wann das Zentrum wo steht.
- **Wetter**: klar, trocken, wenig Hochnebel. Nach einer Kaltfront ist die Luft am klarsten.

## Praktisches für die Nacht

Stirnlampe mit **Rotlicht** (erhält die Dunkeladaption, die 20–30 Minuten braucht), Ersatzakkus warm am Körper (Kälte halbiert die Kapazität), Taukappe oder Heizband gegen beschlagende Frontlinse, Klappstuhl, warme Kleidung — man steht sehr lange sehr still. Und: Den Standort **bei Tageslicht** ansehen. Nachts findet man weder den Weg noch den Vordergrund.

::: quiz
F: Warum liefert die NPF-Regel kürzere Zeiten als die 500er-Regel?
A: Sie berücksichtigt Blende und Pixelabstand. Die 500er-Regel stammt aus der Filmzeit und ist für heutige Sensorauflösungen zu großzügig — die Sterne sind bei 100 % bereits eiförmig.

F: Um welchen Faktor sinkt das Rauschen bei 16 gestapelten Aufnahmen?
A: Auf ein Viertel — es sinkt mit der Wurzel der Bildanzahl.

F: Warum gilt bei Astro nicht ETTR, sondern „vom linken Rand abheben"?
A: Das Signal muss über das Ausleserauschen kommen. Nach rechts belichten ist bei einem nachtschwarzen Motiv weder möglich noch sinnvoll.
:::
