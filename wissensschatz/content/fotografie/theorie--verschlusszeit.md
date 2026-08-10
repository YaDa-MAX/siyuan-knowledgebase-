---
id: foto-verschlusszeit
title: Verschlusszeit, Bewegung und Verwacklung
path: fotografie/theorie
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [verschlusszeit, bewegung, stabilisierung, verschluss]
prereqs: [foto-belichtungsdreieck]
related: [foto-motiv-sport, foto-motiv-nacht, foto-blitz]
summary: Richtwerte für scharfe und für bewusst verwischte Bewegung, die Freihandregel im Zeitalter der Stabilisatoren, und was Rolling Shutter anrichtet.
---

## Zwei getrennte Fragen

Die nötige Verschlusszeit ergibt sich aus zwei unabhängigen Anforderungen — die längere gewinnt:

1. **Bewegung des Motivs** einfrieren (oder gezielt verwischen)
2. **Eigene Bewegung** (Verwacklung) unterdrücken

## Motivbewegung

| Motiv | Einfrieren | Bewusst verwischt |
|---|---|---|
| Gehende Person | 1/125 | 1/15–1/30 |
| Laufende Person, Kind | 1/250–1/500 | — |
| Fußball, Handball | 1/500–1/1000 | — |
| Radrennen, Motorsport frontal | 1/1000 | Mitzieher 1/60–1/125 |
| Motorsport seitlich | 1/2000 | Mitzieher 1/30–1/80 |
| Vogel im Flug, groß (Reiher) | 1/1000–1/1600 | — |
| Vogel im Flug, klein (Schwalbe) | 1/2000–1/4000 | — |
| Kolibri-Flügel | 1/4000+ oder Blitz | — |
| Tropfen, Spritzer | 1/2000+ oder Blitz | — |
| Wasserfall seidig | — | 1/4–2 s |
| Meereswellen glatt | — | 5–30 s |
| Wolkenzug | — | 30–300 s |
| Feuerwerk | — | 2–6 s bei f/11 |
| Lichtspuren Verkehr | — | 10–30 s |
| Sterne punktförmig | siehe NPF-/500er-Regel | Startrails: viele × 30 s |

Bewegung **quer** zum Bild braucht kürzere Zeiten als Bewegung **auf die Kamera zu** — bei gleicher Geschwindigkeit legt sie mehr Pixel zurück. Ebenso gilt: Je größer das Motiv im Bild, desto kürzer muss die Zeit sein.

## Freihandregel

Die klassische Regel: **1/Brennweite** (auf Kleinbild bezogen). 200 mm → 1/200 s. An APS-C mit Faktor 1,5 also 1/300 s, an MFT 1/400 s.

Diese Regel stammt aus der Kleinbildfilm-Ära und ist für heutige Sensoren zu großzügig. Bei 45 MP und 100-%-Prüfung ist eher **1/(2 × Brennweite)** realistisch. Umgekehrt gewinnt man mit Bildstabilisierung:

- **Optischer Stabilisator im Objektiv** (IS/VR/OSS/OS/VC): typisch 3–5 Stufen.
- **Sensorstabilisierung (IBIS)**: typisch 5–7 Stufen, wirkt mit jedem Objektiv, auch mit adaptierten und manuellen.
- **Kombiniert (Dual IS / Sync IS)**: bis etwa 8 Stufen bei modernen Systemen.

Wichtig: Der Stabilisator hilft **nur gegen eigene Bewegung**, nicht gegen Motivbewegung. Ein Porträt bei 1/8 s mit IBIS wird verwackelungsfrei, aber die Person hat sich bewegt. Und bei sehr kurzen Zeiten oder auf dem Stativ kann ein aktiver Stabilisator selbst Unschärfe erzeugen — bei Stativarbeit ausschalten, sofern die Kamera das nicht automatisch erkennt.

## Verschlussarten

| Typ | Funktion | Vorteil | Problem |
|---|---|---|---|
| **Mechanischer Schlitzverschluss** | zwei Vorhänge | kein Rolling Shutter bis zur Synchronzeit, blitzsicher | Erschütterung, Geräusch, Verschleiß (typ. 150.000–500.000 Auslösungen) |
| **Elektronischer erster Verschlussvorhang (EFCS)** | Start elektronisch, Ende mechanisch | keine Verschlusserschütterung | bei sehr kurzen Zeiten und offener Blende ungleichmäßige Bokehformen |
| **Vollelektronisch** | Auslesen ohne Mechanik | lautlos, erschütterungsfrei, extrem kurze Zeiten, hohe Serienbildraten | Rolling Shutter, Banding unter Kunstlicht, oft nur 12 statt 14 Bit |
| **Global Shutter** | alle Pixel gleichzeitig | kein Rolling Shutter, volle Blitzsynchronisation | bislang wenige Modelle, meist geringerer Dynamikumfang |
| **Zentralverschluss** (im Objektiv) | Lamellen im Objektiv | blitzsynchron bis 1/1000 s und kürzer | teuer, je Objektiv nötig |

**Rolling Shutter** entsteht, weil ein elektronischer Verschluss den Sensor zeilenweise ausliest. Schnelle Querbewegungen kippen (Propeller, Golfschläger, Autos beim Mitzieher), und Blitzlicht belichtet nur einen Streifen. Moderne gestapelte Sensoren (Stacked BSI) lesen so schnell aus, dass der Effekt praktisch verschwindet — bei einfacheren Sensoren ist er deutlich.

**Banding unter Kunstlicht**: LED- und Leuchtstofflampen flackern mit Netzfrequenz. Der elektronische Verschluss erwischt dabei unterschiedliche Helligkeitsphasen je Zeile — sichtbar als Streifen. Abhilfe: mechanischer Verschluss, Anti-Flicker-Funktion, oder Zeiten als Vielfache von 1/100 s (bei 50 Hz).

## Blitzsynchronzeit

Die kürzeste Zeit, bei der der Sensor vollständig offen liegt — typisch 1/200 bis 1/250 s. Darunter läuft nur noch ein Schlitz über den Sensor, und ein normaler Blitz belichtet nur einen Streifen. Kürzere Zeiten erfordern **HSS/FP** (der Blitz pulst während der gesamten Schlitzfahrt, kostet erheblich Leistung) oder einen Zentralverschluss.

## Langzeitbelichtung

- **Bulb (B)** hält den Verschluss offen, solange ausgelöst wird — mit Fernauslöser oder Timer, sonst verwackelt allein der Fingerdruck.
- **Spiegelvorauslösung** bzw. Verzögerung von 2 s gegen Spiegelschlag bei DSLRs.
- **Sucherokular abdecken** bei DSLRs — Streulicht von hinten verfälscht die Messung.
- **Langzeitrauschunterdrückung** (Dark Frame Subtraction) verdoppelt die Aufnahmezeit. Für Einzelbilder oft sinnvoll, für Startrail-Serien hinderlich.
- **ND-Filter** ermöglichen lange Zeiten am Tag: ND8 = 3 Stufen, ND64 = 6 Stufen, ND1000 = 10 Stufen. Bei Filtern ab 6 Stufen zuerst scharfstellen, dann Filter aufsetzen, dann manuell belichten.

::: quiz
F: Warum hilft ein Bildstabilisator nicht gegen ein unscharfes Kind im Wohnzimmer?
A: Er kompensiert nur die Bewegung der Kamera. Motivbewegung erfordert unabhängig davon eine kurze Verschlusszeit.

F: Was ist die Blitzsynchronzeit und was passiert darunter?
A: Die kürzeste Zeit, bei der der Sensor ganz offen liegt (typisch 1/200–1/250 s). Kürzere Zeiten belichten nur einen Schlitz — ein normaler Blitz erzeugt dann einen dunklen Streifen. Abhilfe: HSS oder Zentralverschluss.

F: Woran erkennst du Rolling Shutter?
A: An gekippten senkrechten Linien bei schnellen Querbewegungen oder verbogenen Rotorblättern — der Sensor wurde zeilenweise zu unterschiedlichen Zeitpunkten ausgelesen.
:::
