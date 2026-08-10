---
id: druck-farbmanagement
title: Farbmanagement, Auflösung und Druckvorstufe
path: druck/praxis
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [farbmanagement, icc, cmyk, dpi, druckvorstufe]
prereqs: [druck-verfahren]
related: [foto-licht-wb, druck-medien, excel-diagramme]
summary: Warum der Ausdruck anders aussieht als der Bildschirm, was dpi wirklich bedeutet und wie eine Druckdatei aufgebaut sein muss.
---

## Warum Bildschirm und Druck nie identisch sind

Ein Monitor **strahlt** Licht ab und mischt additiv (RGB): alle Farben zusammen ergeben Weiß. Papier **schluckt** Licht und mischt subtraktiv (CMYK): alle Farben zusammen ergeben ein schmutziges Dunkelbraun.

Daraus folgt: Es gibt Farben, die ein Bildschirm zeigen kann und kein Druck erreicht — gesättigtes Cyan, leuchtendes Orange, Neontöne. Und umgekehrt einige wenige, die der Druck kann und der Monitor nicht. Diese Bereiche heißen **Gamut**; Farben außerhalb sind „out of gamut".

Der zweite Grund für Abweichungen ist banal, aber entscheidend: **Der Druck hat kein eigenes Licht.** Ein Print unter Glühlampe sieht anders aus als am Fenster. Verbindliche Beurteilung erfolgt unter Normlicht D50 (5000 K).

## ICC-Profile

Ein ICC-Profil beschreibt, welche Farben ein Gerät tatsächlich darstellen kann. Die Kette:

```
Bild (Arbeitsfarbraum) → Monitorprofil (Anzeige) → Druckerprofil (Ausgabe)
```

- **Monitorprofil** entsteht durch **Hardware-Kalibrierung** mit einem Colorimeter. Ohne kalibrierten Monitor ist jede Farbbeurteilung Glückssache. Zielwerte für Druckarbeit: 5500–6500 K, Gamma 2,2, Leuchtdichte 100–120 cd/m² (viel dunkler als Werkseinstellung — helle Monitore führen zu zu dunklen Drucken).
- **Druckerprofil** gilt immer für die **Kombination** aus Drucker, Tinte und Papier. Ein neues Papier braucht ein neues Profil. Hersteller liefern Profile mit, Papierhersteller ebenfalls; eigene Profile lassen sich mit einem Spektrofotometer messen.
- **Rendering Intent** legt fest, was mit nicht darstellbaren Farben passiert:
  - *Perzeptiv* — alle Farben werden gemeinsam gestaucht; Verhältnisse bleiben, alles wird leicht flauer. Für Fotos.
  - *Relativ farbmetrisch* — darstellbare Farben bleiben exakt, außenliegende werden auf den Rand geklappt. Für Bilder mit wenigen Ausreißern; meist die bessere Wahl bei Fotodruck. Mit „Tiefenkompensierung" aktivieren.
  - *Absolut farbmetrisch* — simuliert zusätzlich das Papierweiß der Zielbedingung. Für Proofs.
  - *Sättigung* — für Geschäftsgrafiken, nicht für Fotos.

**Softproof** (Ansicht ▸ Proof einrichten) zeigt am Bildschirm, wie der Druck aussehen wird, inklusive Gamut-Warnung. Es ersetzt keinen Testdruck, verhindert aber die groben Enttäuschungen.

## dpi, ppi und lpi

Drei Begriffe, die ständig vermischt werden:

- **ppi** (Pixel per Inch) — Auflösung der **Bilddatei** in Relation zur Ausgabegröße. Das ist die Zahl, die zählt.
- **dpi** (Dots per Inch) — Tropfen bzw. Punkte, die der **Drucker** setzt. Ein Tintenstrahldrucker braucht viele Tropfen für einen Bildpunkt, deshalb sind 4800 dpi und 300 ppi kein Widerspruch.
- **lpi** (Lines per Inch) — Rasterweite im Offsetdruck. Faustregel: benötigte Bildauflösung ≈ 2 × lpi. Zeitung 100 lpi → 200 ppi; Bogenoffset 150 lpi → 300 ppi.

**Richtwerte für Bildauflösung:**

| Ausgabe | ppi bei Endgröße |
|---|---|
| Offsetdruck, Prospekt | 300 |
| Fotodruck, Betrachtung aus 30 cm | 240–360 |
| Poster, Betrachtung aus 1,5 m | 150 |
| Großflächenplakat, aus 5 m | 50–100 |
| Banner, Fassade | 20–40 |
| Zeitung | 200 |
| Bildschirm | 72–150 (irrelevant, es zählen die Pixel) |

Der wichtigste Satz dazu: **Auflösung ohne Angabe der Ausgabegröße ist bedeutungslos.** „300 dpi" allein sagt nichts — 300 dpi bei 5 × 5 cm sind 590 × 590 Pixel und für A3 unbrauchbar.

## Druckdatei richtig aufbauen

**Format**: PDF/X-4 (oder PDF/X-1a, wenn die Druckerei es so verlangt). Es bettet Schriften, Profile und Transparenzen definiert ein.

**Beschnittzugabe**: 3 mm rundum über das Endformat hinaus, bei Büchern und Kartonagen teils mehr. Alles Randabfallende muss bis in die Zugabe reichen.

**Sicherheitsabstand**: mindestens 3–5 mm von der Schnittkante nach innen für Text und wichtige Elemente. Schneidemaschinen arbeiten mit Toleranz.

**Farben**:
- CMYK für Offset, mit dem Profil der Druckerei (in Europa meist PSO Coated v3 oder ISO Coated v2).
- **Gesamtfarbauftrag** beachten: 300 % bei gestrichenem Papier, 260–280 % bei ungestrichenem. Zu viel Farbe trocknet nicht und schmiert.
- **Schwarz**: Fließtext ausschließlich in 100 % K, niemals in vierfarbigem Schwarz — sonst wird jede Passerabweichung als bunter Rand sichtbar. Große schwarze Flächen dagegen als **Tiefschwarz** anlegen (z. B. C60 M40 Y40 K100), sonst wirken sie grau.
- **Sonderfarben** (Pantone, HKS) nur, wenn sie bewusst gewünscht und beauftragt sind — sonst entstehen ungewollte fünfte Druckplatten.
- **RGB-Daten** sind bei modernen PDF/X-4-Workflows zulässig und werden von der Druckerei konvertiert. Das ergibt oft bessere Ergebnisse als eine laienhafte eigene Konvertierung.

**Schriften**: einbetten oder in Pfade umwandeln. Haarlinien mindestens 0,25 pt, negative Schrift (weiß auf dunkel) nicht zu fein und nicht in Serifenschrift.

**Bilder**: keine JPEG-Kompression unter „hoch", keine hochskalierten Bilder, Überdrucken-Einstellungen prüfen.

## Der Testdruck

Vor jeder größeren Auflage:
1. **Softproof** mit dem Zielprofil ansehen.
2. **Testdruck** auf dem endgültigen Papier — bei kleinen Formaten ganz, bei großen ein charakteristischer Ausschnitt in Originalgröße.
3. Unter **Normlicht** beurteilen, nicht unter der Schreibtischlampe.
4. Bei Druckereien: **Andruck oder Proof** bestellen, wenn Farbverbindlichkeit wichtig ist. Ein Proof mit Kontrollstreifen ist rechtlich das Referenzobjekt bei Reklamationen.

::: quiz
F: Warum ist „300 dpi" ohne weitere Angabe keine sinnvolle Auflösungsangabe?
A: Ohne Ausgabegröße ist die Zahl bedeutungslos. Entscheidend ist die Pixelzahl im Verhältnis zur Endgröße.

F: Warum darf Fließtext nicht in vierfarbigem Schwarz angelegt werden?
A: Jede Passerabweichung der vier Druckwerke erzeugt bunte Ränder an den Buchstaben. Text gehört in 100 % K.

F: Welcher Rendering Intent für ein Foto mit wenigen übersättigten Stellen?
A: Relativ farbmetrisch mit Tiefenkompensierung — er erhält alle darstellbaren Farben exakt und klappt nur die Ausreißer auf den Gamut-Rand.
:::
