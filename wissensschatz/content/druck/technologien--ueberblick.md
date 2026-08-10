---
id: druck-verfahren
title: Druckverfahren — Prinzipien und Eignung
path: druck/technologien
level: 2
type: referenz
source: ki
status: geprueft
updated: 2026-08-09
tags: [drucktechnik, tintenstrahl, laser, thermosublimation, entscheidung]
prereqs: []
related: [druck-entscheidung, druck-farbmanagement, druck-medien]
summary: Wie die einzelnen Verfahren physikalisch funktionieren und wofür sie dadurch taugen — von Thermodirekt bis Tiefdruck.
---

## Die Grundfrage

Jedes Druckverfahren beantwortet die Frage „Wie kommt Farbe aufs Medium?" anders. Aus dem physikalischen Prinzip folgen fast alle Eigenschaften: Auflösung, Medienvielfalt, Haltbarkeit, Kosten und Geschwindigkeit.

Vier Grundprinzipien:

1. **Farbe wird geschossen** — Tintenstrahl (thermisch/piezo), berührungslos, jede Farbe an jeder Stelle frei dosierbar.
2. **Farbe wird angezogen und verschmolzen** — Elektrofotografie (Laser/LED), elektrostatisch, danach Hitzefixierung.
3. **Farbe wird durch Wärme übertragen** — Thermosublimation, Thermotransfer, Thermodirekt.
4. **Farbe wird übertragen von einer Form** — Offset, Flexo, Tiefdruck, Siebdruck. Erst eine Druckform herstellen, dann beliebig oft abdrucken.

Der entscheidende wirtschaftliche Unterschied liegt zwischen 1–3 und 4: **Formverfahren haben hohe Fixkosten und minimale Stückkosten.** Deshalb ist die Auflage das erste Auswahlkriterium, nicht die Qualität.

::: viz dataset:druckverfahren
Alle Verfahren mit Prinzip, Stärken, Schwächen, Auflagenbereich und Haltbarkeit.
:::

## Thermosublimation im Detail

Weil sie oft mit Thermotransfer verwechselt wird und im Fotobereich die entscheidende Rolle spielt:

Der Druckkopf erhitzt punktgenau ein Farbband. Der Farbstoff geht dabei **direkt vom festen in den gasförmigen Zustand über** (Sublimation) und dringt in die Polymerbeschichtung des Fotopapiers ein, wo er wieder erstarrt. Weil die Temperatur stufenlos regelbar ist, lässt sich die **Menge** an Farbstoff je Punkt variieren — es entstehen echte kontinuierliche Tonwerte ohne Raster. Genau das unterscheidet Dye-Sub von Tintenstrahl: Ein Tintenstrahldrucker simuliert Zwischentöne durch mehr oder weniger Tropfen; ein Dye-Sub-Drucker druckt sie wirklich.

Der Ablauf: Gelb, Magenta, Cyan nacheinander, jeweils das ganze Blatt, danach eine transparente Schutzschicht (Overcoat), die UV-Schutz, Wischfestigkeit und optional Mattierung liefert. Das Papier läuft also vier Mal durch.

Konsequenzen:
- **Feste Kosten je Bild** — das Farbband verbraucht seinen Abschnitt unabhängig vom Motiv. Ein weißes Blatt kostet genauso viel wie ein schwarzes.
- **Datenschutz-Hinweis**: Auf dem verbrauchten Band bleibt das Negativbild sichtbar. Bänder aus Ausweis- oder Fotodruckern sind vertraulich zu vernichten.
- Kein Text auf Normalpapier, keine flexiblen Formate.
- Sofort trocken und sofort anfassbar — deshalb der Standard im Eventgeschäft.

Typische Einsatzfelder: Fotokiosk, Passbildautomat, Eventfotografie, Mitarbeiter- und Zutrittsausweise (PVC-Karten), medizinische Bilddokumentation.

## Tintenstrahl: die beiden Bauarten

**Thermisch (Bubble Jet, Canon/HP)**: Ein Widerstand erhitzt die Tinte in Millisekunden auf über 300 °C, eine Dampfblase schleudert den Tropfen heraus. Einfach, günstig, aber die Tinte muss verdampfbar sein — das begrenzt die Tintenauswahl auf wässrige Systeme. Der Druckkopf verschleißt, weshalb er häufig in der Patrone sitzt.

**Piezoelektrisch (Epson, Brother, Industrie)**: Ein Piezokristall verformt sich unter Spannung und drückt den Tropfen mechanisch heraus. Keine Hitze, dadurch nahezu beliebige Tinten — wässrig, Solvent, UV-härtend, Latex. Der Kopf hält lange, ist bei Defekt aber teuer. Variable Tropfengrößen (typisch 1,5–30 Pikoliter) ermöglichen feine Verläufe.

**Dye gegen Pigment** — die wichtigste Tintenfrage:

| | Farbstofftinte (Dye) | Pigmenttinte |
|---|---|---|
| Aufbau | gelöste Farbstoffmoleküle | feste Farbpartikel in Suspension |
| Farbraum | größer, brillanter, besonders auf Glanzpapier | etwas kleiner, aber neutralere Graustufen |
| Lichtechtheit | 5–25 Jahre | 50–200 Jahre |
| Wasserfestigkeit | gering | hoch |
| Matte Papiere | schwach | sehr gut |
| Bronzing / Glanzunterschied | nein | möglich auf Glanzpapier |
| Einsatz | Alltag, Foto zum Verschenken | Ausstellung, Archiv, Verkauf |

Für alles, was aufgehängt, verkauft oder aufbewahrt werden soll, ist Pigment die richtige Wahl. Der Unterschied ist keine Marketingfrage — verblasste Dye-Prints nach zehn Jahren am Fensterplatz sind ein bekanntes Phänomen.

## Laserdruck im Detail

Sechs Schritte, die jeder Laserdrucker durchläuft: Aufladen der Fotoleitertrommel → Belichten durch Laser oder LED-Zeile → Entwickeln (Toner haftet an den belichteten Stellen) → Übertragen auf Papier → Fixieren mit Hitze (ca. 180–200 °C) und Druck → Reinigen.

Daraus folgt direkt:
- **Wischfest und wasserfest ab Werk** — der Toner ist eingeschmolzener Kunststoff.
- **Kein Randlosdruck** — der Greifer braucht einen Rand.
- **Papier muss die Fixiereinheit aushalten.** Nicht laserfeste Etiketten oder Folien schmelzen und ruinieren das Gerät. Strukturierte Naturpapiere nehmen Toner nur ungleichmäßig an.
- **Kein Kopfeintrocknen** — die richtige Wahl für Geräte, die wochenlang stehen.
- Toner lässt sich später wieder erweichen: Ein Laserausdruck im heißen Auto oder unter Laminierhitze kann abfärben.

## Historische und Sonderverfahren

- **Nadeldrucker (Matrixdrucker)**: Nadeln schlagen durch ein Farbband. Einziges Verfahren für **Durchschläge** — deshalb bis heute in Werkstätten, Speditionen und Apotheken im Einsatz. Sehr langlebig und unempfindlich.
- **Typenraddrucker**: Schreibmaschinenprinzip, nur Text. Verschwunden.
- **Thermowachsdruck**: Vorläufer des Thermotransfers für Farbe.
- **Blaupause / Diazotypie**: Ammoniakverfahren für Baupläne. Erklärt, warum technische Zeichnungen jahrzehntelang blau waren.

::: quiz
F: Was unterscheidet Thermosublimation grundlegend vom Tintenstrahldruck?
A: Dye-Sub überträgt variable Farbstoffmengen je Punkt und erzeugt echte kontinuierliche Tonwerte. Tintenstrahl simuliert Zwischentöne durch Rasterung mit mehr oder weniger Tropfen.

F: Wann Pigment- statt Farbstofftinte?
A: Immer, wenn der Druck aufgehängt, verkauft oder archiviert wird — Lichtechtheit und Wasserfestigkeit sind um ein Vielfaches höher.

F: Warum kann Thermodirektpapier nicht archivieren?
A: Es enthält keine Farbe, sondern eine wärmeempfindliche Beschichtung. Wärme, Licht, Fett und Weichmacher lassen den Ausdruck verblassen oder komplett schwärzen.
:::
