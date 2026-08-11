---
id: foto-filter
title: Filter und Dateiformate
path: fotografie/theorie
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [filter, raw, jpeg, dateiformate, archivierung]
prereqs: [foto-belichtungsdreieck]
related: [foto-licht-wb, foto-motiv-landschaft, meta-pflegeroutine]
summary: Welche Filter durch Software nicht ersetzbar sind, und welches Dateiformat ein Bild in 40 Jahren noch lesbar hält.
---

## Filter, die Software nicht ersetzen kann

**Polfilter (CPL)** — der einzige Filter, den es softwareseitig nicht gibt. Er unterdrückt polarisiertes Licht und damit:
- Spiegelungen auf Wasser, Glas, Lack, nassem Laub
- Dunst in der Ferne
- Himmelsblau im 90°-Winkel zur Sonne wird kräftiger

Kostet 1,5–2 Blendenstufen. Wirkung durch Drehen einstellbar und stärker, wenn die Sonne seitlich steht — bei Sonne im Rücken oder frontal fast wirkungslos. **Vorsicht bei Weitwinkel unter 24 mm**: Der Polarisationseffekt variiert über den Bildwinkel und erzeugt einen ungleichmäßig dunklen Himmelsstreifen. Bei Panoramen deshalb weglassen.

**Graufilter (ND)** — verlängert die Belichtungszeit.

| Bezeichnung | Stufen | Faktor | Typischer Einsatz |
|---|---|---|---|
| ND2 / 0,3 | 1 | 2× | leichte Anpassung |
| ND8 / 0,9 | 3 | 8× | fließendes Wasser bei Bewölkung |
| ND64 / 1,8 | 6 | 64× | Wasserfall bei Tag |
| ND1000 / 3,0 | 10 | 1000× | glattes Meer, Wolkenzug am Tag |
| ND100000 / 5,0 | 16–17 | — | Sonnenfinsternis, direkte Sonne |
| Variabler ND | 2–8 | variabel | Video; bei extremen Stellungen X-Muster |

Bei starken NDs entstehen leicht Farbstiche — bei billigen Filtern deutlich, bei guten kaum. Arbeitsablauf: Bildausschnitt und Fokus **ohne** Filter setzen, Autofokus auf manuell umstellen, Filter aufsetzen, Zeit rechnerisch verlängern, Sucherokular abdecken.

**Grauverlaufsfilter (GND)** — dunkelt den Himmel ab. Als Steckfiltersystem (100 mm) mit hartem, weichem oder umgekehrtem Verlauf. In Zeiten von 14 EV Dynamikumfang und Belichtungsreihen seltener nötig, aber bei bewegtem Wasser oder Laub weiterhin überlegen, weil es eine Einzelaufnahme bleibt.

**Schutzfilter (UV/Klar)** — schützen die Frontlinse. Im Gegenlicht erzeugen sie zusätzliche Reflexe; billige Exemplare kosten spürbar Kontrast. Bei Staub, Salzwasser und Baustelle sinnvoll, sonst ist die Streulichtblende der bessere Schutz.

**Weitere:** Infrarotfilter (720 nm+, Kamera muss IR-durchlässig sein oder umgebaut), Nebelfilter/Black Mist (weiche Lichter, Kinolook — nicht nachbaubar in der Nachbearbeitung), Sternfilter, Farbfilter für Schwarzweißfilm.

## Filtergrößen

Filter werden nach Frontgewinde bezeichnet (49, 52, 55, 58, 62, 67, 72, 77, 82, 95, 105 mm). Praktischer Ansatz: Filter in der **größten** benötigten Größe kaufen und mit **Step-up-Ringen** an kleinere Objektive anpassen. Umgekehrt (step-down) führt zu Vignettierung.

## Dateiformate

| Format | Was es ist | Wann |
|---|---|---|
| **RAW** (CR3, NEF, ARW, RAF, ORF, RW2, DNG …) | unverarbeitete Sensordaten, 12–16 Bit | immer, wenn nachbearbeitet wird |
| **JPEG** | 8 Bit, verlustbehaftet, verarbeitet | Weitergabe, Web, wenn kein Bearbeitungsbedarf |
| **HEIF/HEIC** | 10 Bit, effizienter als JPEG, HDR-fähig | moderne Kameras und Smartphones; Kompatibilität prüfen |
| **TIFF** | verlustfrei, 8/16 Bit, sehr groß | Zwischenformat, Druckvorstufe, Archiv |
| **PNG** | verlustfrei, mit Transparenz | Grafiken, Screenshots — nicht für Fotos |
| **DNG** | offenes RAW-Format (Adobe) | Archiv, wenn Herstellerformat Sorgen macht |
| **PSD** | Ebenen und Masken | Arbeitsdatei |
| **AVIF / JPEG XL** | moderne Nachfolger | Web; Unterstützung noch uneinheitlich |

**RAW gegen JPEG in einem Satz:** RAW behält Weißabgleich, Bildstil, Rauschunterdrückung und rund 2–3 Stufen mehr Reserve in Lichtern und Schatten als änderbare Parameter; JPEG brennt sie ein.

**RAW+JPEG** ist der pragmatische Weg: schnelle Weitergabe aus dem JPEG, volle Reserve im RAW.

## Archivierung über Jahrzehnte

Diese Frage stellt sich bei einem Bildbestand genauso wie bei diesem Wissensarchiv:

- **Herstellereigene RAW-Formate sind proprietär.** Es gibt keine Garantie, dass CR3 in 30 Jahren noch von aktueller Software gelesen wird. Ältere Formate (etwa frühe Kompaktkamera-RAWs) sind heute bereits schwierig.
- **DNG** ist dokumentiert und offen — die sicherere Wahl fürs Langzeitarchiv. Umwandlung mit dem kostenlosen Adobe DNG Converter, verlustfrei, mit eingebettetem Original auf Wunsch.
- **Zusätzlich ein TIFF oder hochwertiges JPEG** der fertigen Fassung sichern. Ein JPEG wird garantiert auch in 40 Jahren gelesen — es ist zu verbreitet, um zu verschwinden.
- **Metadaten** (IPTC/XMP) mitschreiben: Datum, Ort, Personen, Rechte, Beschreibung. Ohne sie ist ein Bildbestand nach 20 Jahren nicht mehr erschließbar. Sidecar-Dateien immer mitkopieren.
- **3-2-1-Regel**: drei Kopien, zwei Medientypen, eine außer Haus. Festplatten halten 3–7 Jahre, optische Medien sind unzuverlässig, Cloud ist ein Abo mit Kündigungsrisiko. Regelmäßig umkopieren — **das Medium ist nie das Archiv, die Routine ist es.**
- **Prüfsummen** (SHA-256) je Datei ablegen, um stille Datenkorruption zu erkennen.

::: quiz
F: Welchen Filtereffekt kann Software nicht nachbilden?
A: Den Polfilter — er entfernt polarisiertes Licht physikalisch (Spiegelungen auf Wasser, Glas, Blattoberflächen).

F: Warum ist ein Polfilter bei 16 mm problematisch?
A: Der Polarisationswinkel variiert über den großen Bildwinkel, wodurch der Himmel ungleichmäßig dunkel wird.

F: Warum DNG statt Hersteller-RAW für das Langzeitarchiv?
A: DNG ist offen dokumentiert. Proprietäre RAW-Formate hängen daran, dass ein Hersteller sie weiter unterstützt.
:::
