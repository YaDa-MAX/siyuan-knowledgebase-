---
id: druck-entscheidung
title: Welches Verfahren wofür — Entscheidungshilfe
path: druck/technologien
level: 2
type: checkliste
source: ki
status: geprueft
updated: 2026-08-09
tags: [entscheidung, auswahl, kosten, praxis]
prereqs: [druck-verfahren]
related: [druck-medien, druck-farbmanagement]
summary: Von der Aufgabe zum Verfahren — inklusive der Kostenfallen, die beim Gerätekauf regelmäßig übersehen werden.
---

## Nach Aufgabe

| Aufgabe | Verfahren | Warum |
|---|---|---|
| Büro: Text, Rechnungen, Serienbriefe | S/W-Laser | günstigste Seite, wischfest, trocknet nie ein |
| Büro: gemischt Text und Grafik | Farblaser oder Business-Tintenstrahl mit Pigment | Laser bei viel Text, Tinte bei Bildanteil und Naturpapier |
| Gelegentlich zu Hause | Tintenstrahl mit Nachfülltank | Patronenkosten übersteigen sonst den Gerätepreis |
| Fotos für die Wand | Tintenstrahl Pigment, 8–12 Farben | Lichtechtheit, Farbraum, matte Papiere |
| Fotos zum Verschenken, sofort | Thermosublimation | trocken, wischfest, konstant, keine Trocknungszeit |
| Passbilder, Ausweise, Karten | Thermosublimation auf PVC | randlos, sofort, fälschungserschwerende Overlays |
| Kassenbon, Wiegeetikett, Versandlabel | Thermodirekt | kein Verbrauchsmaterial außer Papier |
| Typenschild, Laboretikett, Kabelmarkierer | Thermotransfer Harz | beständig gegen Chemie, Abrieb, UV |
| Visitenkarten, Flyer bis 500 Stück | Digitaldruck Toner | keine Einrichtkosten |
| Flyer, Broschüren ab 1000 | Offset | Stückkosten brechen ein |
| Buch on demand | Digitaldruck | Auflage 1 wirtschaftlich |
| Zeitschrift ab 200.000 | Tiefdruck | konstante Qualität bei Größtauflage |
| Verpackungsfolie, Wellpappe | Flexo | Endlosmaterial bei hoher Geschwindigkeit |
| Banner, Fahrzeugbeschriftung | Eco-Solvent oder Latex | wetterfest und dehnbar |
| Innenraumgrafik in Klinik, Hotel, Schule | Latex oder UV | geruchsarm, emissionsarm |
| Druck auf Holz, Glas, Metall, Fliese | UV-Direktdruck | härtet auf jeder Oberfläche aus |
| T-Shirt, Einzelstück, weiß/hell | DTG oder Sublimation (Polyester) | keine Einrichtung |
| T-Shirt, Einzelstück, beliebige Farbe | DTF | funktioniert auf jedem Textil |
| T-Shirt ab 30 Stück, wenige Farben | Siebdruck | günstigste Stückkosten, beste Haltbarkeit |
| Prototyp, Ersatzteil, Vorrichtung | 3D-FDM | schnell und günstig |
| Feines Modell, Dentaltechnik | 3D-SLA | Detailtreue |

## Die Kostenrechnung, die man vor dem Kauf macht

Der Gerätepreis ist selten die relevante Zahl. Die Rechnung geht so:

```
Gesamtkosten je Seite =
    Gerätepreis / erwartete Gesamtseitenzahl
  + Verbrauchsmaterial je Seite
  + Wartungseinheiten (Trommel, Fixiereinheit, Resttankbehälter)
  + Verlust durch Reinigungszyklen und eingetrocknete Köpfe
```

Die typischen Fallen:

- **Startpatronen** sind oft nur zu einem Drittel gefüllt. Der Ersatz kostet beim ersten Mal fast so viel wie das Gerät.
- **Reinigungszyklen** bei Tintenstrahldruckern verbrauchen Tinte auch ohne Druck. Wer alle zwei Wochen eine Seite druckt, verbraucht mehr Tinte für die Wartung als für den Druck. In diesem Nutzungsprofil ist Laser fast immer richtig.
- **Trommel-, Transferband- und Fixiereinheit** beim Laser sind Verschleißteile mit eigener Lebensdauer — bei manchen Modellen fast zum Preis eines neuen Geräts.
- **Chip-gesteuerte Kartuschen** sperren teilweise Fremd- und Nachfüllprodukte oder werden per Firmware-Update gesperrt.
- **Abo-Modelle** („Seiten im Monat") sind bei konstantem Volumen günstig und bei schwankendem teuer; nicht genutzte Seiten verfallen meist.
- **Dye-Sub**: Verbrauchsmaterial wird als Set (Band + Papier) für eine feste Bildzahl gekauft. Nicht genutzte Restbilder sind verloren, wenn das Band austrocknet oder das Modell wechselt.
- **Stromverbrauch**: Laser zieht beim Aufheizen kurzzeitig sehr viel; im Dauerbetrieb relativiert sich das.

## Auswahlfragen in der richtigen Reihenfolge

1. **Was wird gedruckt** — Text, Foto, Etikett, Objekt?
2. **Wie viel pro Monat**, und wie gleichmäßig verteilt?
3. **Welches Medium** — Normalpapier, Fotopapier, Folie, Textil, Karton, dreidimensionales Objekt?
4. **Wie lange muss es halten**, und wo hängt es (Sonne? Feuchtigkeit? Berührung)?
5. **Wie schnell muss es fertig sein** — sofort oder mit Trocknungszeit?
6. **Wer bedient es?** Ein Gerät mit Farbmanagementbedarf braucht jemanden, der es kann.
7. **Welche Formate**, und wird randlos gebraucht?
8. **Wo steht es?** Laser braucht Belüftung und ist laut; Solvent braucht Absaugung.

## Randlosdruck

Nicht alle Verfahren können randlos:

- **Tintenstrahl**: ja, durch Übersprühen in eine Auffangrinne. Kostet etwas Tinte und beschneidet minimal.
- **Thermosublimation**: ja, das ist einer ihrer Vorteile.
- **Laser**: praktisch nein — es bleibt ein Rand von 4–5 mm. Randlos entsteht nur durch Übergröße und Schneiden.
- **Offset/Digitaldruck in der Druckerei**: über **Beschnittzugabe** — 3 mm über das Endformat hinaus drucken und nach dem Falzen schneiden.

::: quiz
F: Du druckst zu Hause zweimal im Monat eine Seite. Warum ist ein Tintenstrahldrucker die teurere Wahl?
A: Die automatischen Reinigungszyklen verbrauchen dabei mehr Tinte als der eigentliche Druck, und Köpfe können eintrocknen. Laser trocknet nicht ein.

F: Ab welcher Auflage wird Offset gegenüber Digitaldruck günstiger?
A: Grob ab 1000 Exemplaren — die Einrichtkosten verteilen sich dann auf genügend Stück.

F: Warum braucht ein Flyer 3 mm Beschnittzugabe?
A: Weil randlose Motive über das Endformat hinaus gedruckt und nach dem Falzen beschnitten werden; ohne Zugabe entstehen weiße Blitzer.
:::
