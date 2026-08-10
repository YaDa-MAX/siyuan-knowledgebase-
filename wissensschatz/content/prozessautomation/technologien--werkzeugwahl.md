---
id: prozessauto-werkzeugwahl
title: Werkzeuge — von der Formel bis zum KI-Agenten
path: prozessautomation/technologien
level: 3
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [rpa, low-code, api, werkzeuge, ki]
prereqs: [prozessauto-eignung]
related: [prozessauto-power-platform, excel-powerquery, excel-office-scripts, excel-vba]
summary: Die Werkzeugleiter von Vorlage bis Agent — mit der Regel, immer die niedrigste Stufe zu nehmen, die die Aufgabe löst.
---

## Die Werkzeugleiter

Von einfach nach mächtig. **Die Regel lautet: die niedrigste Stufe nehmen, die reicht.** Jede Stufe höher bedeutet mehr Können, mehr Abhängigkeit und mehr Pflege.

| Stufe | Werkzeug | Typischer Einsatz | Grenze |
|---|---|---|---|
| 0 | Vorlage, Textbaustein, Serienbrief, Checkliste | wiederkehrende Dokumente | keine Logik |
| 1 | Formeln, bedingte Formatierung, Datenvalidierung | Berechnung, Prüfung, Anzeige | nur innerhalb der Datei |
| 2 | Power Query | wiederkehrender Import und Aufbereitung | keine Aktionen außerhalb |
| 3 | Makros (VBA), Office Scripts, Shell-/Python-Skripte | lokale Verarbeitung, Dateistapel | einzelne Umgebung |
| 4 | Workflow-Dienste (Power Automate, Make, n8n, Zapier) | Systeme verbinden, Auslöser, Benachrichtigungen | Logikgrenzen, Lizenzkosten |
| 5 | Low-Code-Anwendungen (Power Apps, AppSheet) | Erfassungsmasken, mobile Prozesse | Skalierung, Wartbarkeit |
| 6 | RPA (Power Automate Desktop, UiPath, Automation Anywhere) | Altsysteme ohne Schnittstelle steuern | bricht bei Oberflächenänderungen |
| 7 | Integration über APIs / iPaaS | belastbare Systemkopplung | erfordert Entwicklung |
| 8 | Dokumenten-KI / OCR (AI Builder, Azure Document Intelligence) | Rechnungen, Lieferscheine, Formulare auslesen | Genauigkeit, Prüfschleife nötig |
| 9 | LLM-gestützte Schritte und Agenten | Freitext klassifizieren, zusammenfassen, entwerfen | nicht deterministisch, Prüfung nötig |
| 10 | Fachsystem / individuelle Entwicklung | Kernprozesse | Kosten, Zeit |

## RPA — was es kann und was nicht

Robotic Process Automation bedient Oberflächen wie ein Mensch: klicken, tippen, kopieren, lesen. Der Wert liegt darin, dass es **keine Schnittstelle braucht** — genau deshalb ist es in Häusern mit alten Fachsystemen (Hotelsoftware, Warenwirtschaft, Zeiterfassung ohne API) oft der einzige gangbare Weg.

Der Preis: RPA ist **sprödes Automatisieren**. Ein Update, das einen Button verschiebt, legt den Roboter still. Ein Dialogfenster, das unerwartet erscheint, ebenfalls.

Regeln für belastbares RPA:
- Elemente nach **stabilen Kennungen** ansprechen (Name, Automation-ID), nicht nach Bildschirmkoordinaten.
- **Nach jedem Schritt prüfen**, ob der erwartete Zustand eingetreten ist, statt feste Wartezeiten zu setzen.
- Jeden Lauf **protokollieren**, inklusive Bildschirmfoto im Fehlerfall.
- **Ausnahmen** an einen Menschen weitergeben statt zu raten.
- Beim ersten Anzeichen, dass eine API existiert: umsteigen. RPA ist eine Brücke, kein Ziel.

## API-Integration

Sauberste Kopplung: Ein System ruft ein anderes über eine dokumentierte Schnittstelle auf.

Begriffe, die man kennen sollte:
- **REST/HTTP** mit den Methoden GET (lesen), POST (anlegen), PUT/PATCH (ändern), DELETE.
- **Webhook** — die Umkehrung: Das Quellsystem meldet sich, sobald etwas passiert. Effizienter als Abfragen im Minutentakt.
- **Authentifizierung** — API-Schlüssel, OAuth 2.0, Dienstkonto. Zugangsdaten gehören in einen Secret Store (Azure Key Vault, Power-Platform-Verbindung), niemals in ein Skript oder eine Tabelle.
- **Idempotenz** — ein Aufruf, der zweimal ausgeführt wird, darf nicht zwei Buchungen erzeugen. Über einen eindeutigen Vorgangsschlüssel absichern.
- **Rate Limits** — jede API hat Aufrufgrenzen. Wiederholversuche mit ansteigender Wartezeit einbauen.
- **Paginierung** — große Ergebnismengen kommen seitenweise.

## KI als Prozessbaustein

Sprachmodelle passen dort, wo Regeln nicht ausreichen: unstrukturierten Text verstehen, klassifizieren, zusammenfassen, formulieren.

Sinnvolle Einsätze im Arbeitsalltag:
- Eingehende E-Mails in Kategorien einsortieren und weiterleiten.
- Freitext-Rückmeldungen (Gästebewertungen, Mitarbeiterumfragen) in Themen gruppieren.
- Entwürfe für Standardantworten erzeugen, die ein Mensch freigibt.
- Aus Protokollen Aufgaben mit Verantwortlichen extrahieren.
- Rechnungen und Lieferscheine auslesen (dafür ist spezialisierte Dokumenten-KI meist genauer als ein allgemeines Sprachmodell).

Die Regeln dafür:
- **Nicht deterministisch.** Dieselbe Eingabe kann unterschiedliche Ausgaben liefern. Für buchhalterische oder rechtliche Ergebnisse ist das ungeeignet.
- **Prüfschleife einbauen**, wo die Ausgabe Folgen hat. Bei niedriger Zuversicht an einen Menschen geben.
- **Datenschutz**: Welche Daten verlassen das Haus? Verarbeitung im EU-Raum, Auftragsverarbeitungsvertrag, keine Personaldaten in beliebige Dienste. Personenbezug entfernen, wo er nicht gebraucht wird.
- **Kosten** entstehen je Aufruf und skalieren mit dem Volumen — anders als bei einer Regel, die nach dem Bau nichts mehr kostet.
- **Protokollieren**, was hineinging und was herauskam. Ohne das ist keine Fehlersuche möglich.

## Auswahl in drei Fragen

1. **Bleibt alles innerhalb einer Anwendung?** → Bordmittel (Formeln, Power Query, Makros).
2. **Müssen Systeme verbunden werden?** → Workflow-Dienst; API bevorzugt, RPA nur wenn keine Schnittstelle existiert.
3. **Muss unstrukturierter Text oder ein Bild verstanden werden?** → Dokumenten-KI oder Sprachmodell, immer mit Prüfschritt.

Und die Gegenfrage, die immer dazugehört: **Was passiert, wenn es ausfällt?** Ein Prozess, dessen Automatisierung niemand im Notfall von Hand ausführen kann, ist ein Risiko. Deshalb gehört zu jeder Automatisierung eine dokumentierte manuelle Rückfallebene.

::: quiz
F: Wann ist RPA das richtige Werkzeug — und wann nur eine Notlösung?
A: Richtig, wenn ein System keine Schnittstelle hat. Notlösung in dem Sinne, dass es bei jeder Oberflächenänderung bricht — sobald eine API verfügbar ist, sollte man umsteigen.

F: Was bedeutet Idempotenz und warum ist sie wichtig?
A: Ein mehrfach ausgeführter Aufruf darf nur einmal wirken. Ohne sie erzeugt ein Wiederholversuch nach einem Netzfehler Doppelbuchungen.

F: Warum eignen sich Sprachmodelle nicht für buchhalterische Berechnungen?
A: Sie sind nicht deterministisch. Für Ergebnisse mit rechtlicher oder finanzieller Wirkung braucht es reproduzierbare Regeln oder eine menschliche Prüfung.
:::
