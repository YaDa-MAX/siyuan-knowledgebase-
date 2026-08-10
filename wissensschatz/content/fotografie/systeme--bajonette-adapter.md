---
id: foto-mounts
title: Bajonette, Auflagemaße und Adapter-Kompatibilität
path: fotografie/systeme
level: 3
type: referenz
source: ki
status: geprueft
updated: 2026-08-09
tags: [bajonett, adapter, kompatibilitaet, hersteller, systemwahl]
prereqs: [foto-sensorformate]
related: [foto-objektiv-kuerzel, foto-sensorformate]
summary: Die eine Regel, aus der jede Adaptierbarkeit folgt — plus Auflagemaße und Durchmesser aller großen Systeme.
---

## Die Regel

**Ein Objektiv lässt sich nur an eine Kamera adaptieren, deren Auflagemaß kleiner ist als das des Objektivbajonetts.** Der Adapter füllt genau die Differenz auf. Ist sie null oder negativ, kommt das Objektiv nicht weit genug nach vorn und kann nicht mehr auf unendlich fokussieren.

Daraus folgt die gesamte Ordnung des Marktes:

- **Spiegellose Systeme** (Auflagemaß 16–27 mm) können praktisch **jedes** SLR- und DSLR-Objektiv aufnehmen. Das ist der Hauptgrund, warum sich die Umstellung für Bestandsbesitzer lohnt.
- **DSLRs** (44–46,5 mm) können untereinander kaum adaptieren. Nikon F (46,5 mm) an Canon EF (44 mm) geht, umgekehrt nicht.
- Adapter mit **Korrekturlinse** ermöglichen die verbotene Richtung, kosten aber Bildqualität und meist eine Blendenstufe.
- **Speedbooster / Focal Reducer** gehen den umgekehrten Weg: Sie stauchen den Kleinbild-Bildkreis auf APS-C oder MFT, verkürzen die Brennweite um etwa 0,71× und **gewinnen** dabei rund eine Blendenstufe. Ein 50 mm f/1,8 wird an MFT zu etwa 35 mm f/1,2 mit Kleinbild-Bildwinkel von 70 mm.

::: viz dataset:kamera-bajonette
Nach Auflagemaß sortiert: Was oben steht, passt (mit Adapter) an alles, was darunter steht.
:::

## Was beim Adaptieren erhalten bleibt

| Adapterart | Autofokus | Blende | Stabilisierung | EXIF |
|---|---|---|---|---|
| **Hersteller-Adapter im eigenen System** (Canon EF→RF, Nikon F→Z, Sony A→E, MFT→FT) | ja, meist voll | ja | ja | ja |
| **Elektronischer Fremdadapter** (z. B. Sigma MC-11, Metabones, Viltrox) | ja, aber langsamer und nicht immer mit Motiverkennung | ja | teils | ja |
| **Rein mechanischer Adapter** | nein | nur am Objektiv, sonst offen | nur IBIS mit manueller Brennweiteneingabe | nein |

**Wichtig bei rein mechanischen Adaptern:** Objektive ohne Blendenring (Canon EF, Nikon G) bleiben ohne Elektronik auf Offenblende stehen — es sei denn, der Adapter hat einen eigenen Blendenhebel, der aber unkalibriert ist. Objektive mit Blendenring (M42, Nikon AI, Contax, Olympus OM, Leica) sind für die manuelle Adaption die dankbaren Kandidaten.

**IBIS mit manuellen Objektiven** funktioniert, wenn im Menü die Brennweite eingetragen wird — die Kamera braucht sie zur Berechnung der Ausgleichsbewegung.

## Systemübergreifende Besonderheiten

- **Canon EF an RF** ist der reibungsloseste Übergang aller Systemwechsel: voller Autofokus, keine Geschwindigkeitseinbuße, dazu Adaptervarianten mit Steuerring oder eingebautem Filterhalter.
- **Nikon F an Z** funktioniert mit dem FTZ-Adapter für AF-S/AF-P-Objektive voll. Ältere AF-D-Objektive mit Stangenantrieb fokussieren **nicht** automatisch — der Adapter hat keinen Motor.
- **Sony A an E** braucht LA-EA5 für vollen Autofokus mit Stangenantrieb-Objektiven; ältere Adapter unterstützen weniger.
- **Leica M an alles**: mechanisch einfach, aber Sensoren mit Mikrolinsen für steilen Lichteinfall zeigen bei Weitwinkeln Randabschattung und Farbverschiebung. Kameras mit dünnem Sensordeckglas (Leica M, teils Sigma fp) sind hier im Vorteil.
- **Mittelformat auf Kleinbild** adaptieren ist mechanisch trivial und optisch attraktiv: Man nutzt nur die Bildmitte des großen Bildkreises.
- **Canon EF-M** ist eine Sackgasse — die Objektive passen an kein anderes System.
- **Objektive für kleinere Sensoren an größeren Gehäusen** (EF-S an Kleinbild, DX an FX, APS-C an KB-E-Mount) erzeugen einen zu kleinen Bildkreis. Kameras schalten meist automatisch in einen Crop-Modus, was Auflösung kostet.

## Systemwahl: worauf es wirklich ankommt

Die Bajonettfrage ist selten die entscheidende. In dieser Reihenfolge prüfen:

1. **Objektive**, die man tatsächlich braucht — Verfügbarkeit, Preis, Gewicht. Das Gehäuse wird in fünf Jahren ersetzt, die Objektive bleiben zwanzig.
2. **Autofokus** für die eigene Motivwelt (Motiverkennung, Nachführung).
3. **Bedienung und Sucher** — was sich in der Hand richtig anfühlt, wird benutzt.
4. **Gewicht des Gesamtsystems**, nicht des Gehäuses.
5. **Fremdherstellerangebot**: Bei Sony E und L-Mount am größten, bei Canon RF und Nikon Z durch Lizenzpolitik lange eingeschränkt gewesen und inzwischen wachsend.
6. Erst danach: Sensor, Auflösung, Videofunktionen.

::: quiz
F: Warum lässt sich ein Canon-FD-Objektiv nicht ohne Linse an eine Canon-EOS-DSLR adaptieren?
A: FD hat 42 mm Auflagemaß, EF hat 44 mm. Der Adapter bräuchte negative Dicke — Unendlichfokus wäre unmöglich.

F: Was macht ein Speedbooster?
A: Er staucht den Bildkreis eines größeren Formats auf einen kleineren Sensor: kürzere effektive Brennweite (ca. 0,71×) und etwa eine Blendenstufe mehr Licht.

F: Welche Objektive fokussieren am FTZ-Adapter nicht automatisch?
A: Nikon-AF-D-Objektive mit Stangenantrieb — der Adapter hat keinen eigenen Fokusmotor.
:::
