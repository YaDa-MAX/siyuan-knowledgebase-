---
id: prozessauto-governance
title: Einführung, Betrieb und Governance
path: prozessautomation/umsetzung
level: 4
type: checkliste
source: ki
status: geprueft
updated: 2026-08-09
tags: [rollout, change, governance, betrieb, dokumentation]
prereqs: [prozessauto-eignung]
related: [fuehrung-team, powerbi-betrieb, arbeitsrecht-betriebsrat, meta-pflegeroutine, lernen-praxis, hotelabr-kassenrecht]
summary: Vom Pilot zum Regelbetrieb — inklusive der beiden Themen, die Projekte am häufigsten stoppen: Mitbestimmung und Zuständigkeit im Störungsfall.
---

## Ablauf einer Einführung

**1. Auftrag klären**
Wer ist Auftraggeber, wer entscheidet fachlich, was ist der messbare Erfolg? Ohne benannte fachliche Verantwortung wird jede Rückfrage zum Projektstopp.

**2. Prozess aufnehmen und vereinfachen**
Siehe Prozessanalyse. Ergebnis: Ist, Soll, Delta, Ausnahmenliste.

**3. Anforderungen schreiben**
Kurz, aber schriftlich. Je Anforderung: Auslöser, erwartetes Ergebnis, Abnahmekriterium. Ausnahmen ausdrücklich benennen — was passiert bei fehlenden Daten, doppelter Auslösung, Systemausfall?

**4. Bauen — klein anfangen**
Erst der Hauptpfad (Happy Path), dann Ausnahmen. Ein früher lauffähiger Stand mit echten Daten zeigt mehr als jede weitere Abstimmungsrunde.

**5. Testen**
- Positivfall mit echten Daten
- Ausnahmen: leere Felder, Sonderzeichen, Umlaute, doppelte Datensätze, sehr große Mengen
- Fehlerfall: Zielsystem nicht erreichbar — läuft der Wiederholversuch, kommt die Meldung an?
- **Parallelbetrieb**: eine bis zwei Wochen alt und neu nebeneinander, Ergebnisse vergleichen. Der wirksamste Test überhaupt.

**6. Dokumentieren** (vor dem Rollout, nicht danach)
- Zweck in zwei Sätzen
- Auslöser und Zeitplan
- beteiligte Systeme und Konten
- Ablaufdiagramm
- **manuelle Rückfallebene**: Wie macht man es von Hand, wenn nichts geht?
- Verantwortliche fachlich und technisch, mit Vertretung
- Änderungsprotokoll

**7. Schulen und einführen**
Nicht per Rundmail. Kurze Vorführung, Handreichung auf einer Seite, benannte Ansprechperson, definierte erste Wochen mit engem Kontakt.

**8. Überwachen**
Läuft es? Wie oft schlägt es fehl? Wie viele Ausnahmen? Ohne Überwachung merkt man einen Ausfall daran, dass sich jemand beschwert — meist Wochen später.

## Was Menschen wirklich bremst

Widerstand gegen Automatisierung ist selten Technikfeindlichkeit. Er hat drei nachvollziehbare Wurzeln:

1. **Angst um den Arbeitsplatz.** Darauf gehört eine ehrliche Antwort — auch wenn sie unbequem ist. Ausweichen zerstört Vertrauen dauerhaft.
2. **Verlust von Kompetenz und Status.** Wer zehn Jahre lang „die Person für die Monatsabrechnung" war, verliert einen Teil seiner Rolle. Die Frage „Was machst du künftig stattdessen, und ist das besser?" muss vorher beantwortet sein.
3. **Kontrollverlust.** „Ich sehe nicht mehr, was passiert." Gegenmittel: Protokolle sichtbar machen, Zwischenstände anzeigen, jederzeit eingreifen können.

Die wirksamste Maßnahme ist, die Betroffenen zu **Beteiligten** zu machen: Sie kennen den Prozess am besten, ihre Ausnahmefälle sind die wertvollste Anforderungsquelle, und wer mitgebaut hat, verteidigt das Ergebnis.

## Mitbestimmung

In Betrieben mit Betriebsrat ist das kein Nebenthema, sondern eine Voraussetzung. Relevant sind vor allem:

- **§ 87 Abs. 1 Nr. 6 BetrVG** — Einführung und Anwendung technischer Einrichtungen, die dazu **geeignet** sind, Verhalten oder Leistung zu überwachen. „Geeignet" genügt; eine Überwachungsabsicht ist nicht nötig. Das trifft auf sehr viele Automatisierungen zu, sobald personenbezogene Daten mitlaufen — Bearbeitungszeiten je Person, Fehlerquoten, Anmeldezeiten.
- **§ 87 Abs. 1 Nr. 2 und 3** — Lage der Arbeitszeit und vorübergehende Änderungen. Relevant, wenn Automatisierung Dienstpläne oder Schichtfolgen berührt.
- **§ 90 BetrVG** — Unterrichtungs- und Beratungsrecht bei Änderung von Arbeitsverfahren und Arbeitsabläufen.
- **§ 96 ff. BetrVG** — Berufsbildung, wenn sich Qualifikationsanforderungen ändern.

Praktisch bewährt: **frühzeitig informieren** und eine **Rahmenbetriebsvereinbarung** für ein Werkzeug abschließen, statt für jede einzelne Automatisierung neu zu verhandeln. Darin geregelt: Zweck, Datenarten, Speicherdauer, Auswertungsverbot für Leistungskontrolle, Beteiligungsverfahren bei neuen Anwendungsfällen.

Parallel dazu die Datenschutzseite: Verarbeitungsverzeichnis ergänzen, Rechtsgrundlage klären, Löschfristen festlegen, bei riskanten Verarbeitungen eine Datenschutz-Folgenabschätzung.

## Governance im Regelbetrieb

**Verzeichnis aller Automatisierungen** — eine Liste mit: Name, Zweck, Verantwortliche fachlich/technisch, Systeme, Auslöser, Datenarten, Kritikalität, letzte Prüfung. Ohne dieses Verzeichnis weiß nach zwei Jahren niemand mehr, was alles läuft. Das ist der Beginn von Schatten-IT.

**Kritikalitätsstufen** festlegen:
- *Hoch* — Ausfall stoppt den Betrieb (Dienstplanverteilung, Rechnungsversand): Überwachung, definierte Reaktionszeit, getestete Rückfallebene, benannte Vertretung.
- *Mittel* — Ausfall verursacht Mehrarbeit: Meldung an einen Sammelkanal, Behebung im Tagesgeschäft.
- *Niedrig* — Komfortfunktionen: bei Gelegenheit.

**Regelmäßige Prüfung** einmal jährlich: Läuft es noch? Wird es noch gebraucht? Sind die Verantwortlichen noch im Haus? Stimmen die Zugangsdaten? Gibt es inzwischen einen besseren Weg? Nicht mehr benötigte Automatisierungen **abschalten** — jede laufende Automatisierung ohne Zweck ist ein Risiko ohne Nutzen.

**Namenskonventionen und Ablageorte** einheitlich, damit Nachfolger sich zurechtfinden.

**Wissen verteilen**: Mindestens zwei Personen müssen jede kritische Automatisierung verstehen. Der häufigste Totalausfall entsteht nicht durch Technik, sondern durch Personalwechsel.

::: quiz
F: Warum ist der Parallelbetrieb der wirksamste Test?
A: Alt und neu laufen mit echten Daten nebeneinander, und die Abweichungen zeigen genau die Fälle, an die im Entwurf niemand gedacht hat.

F: Wann greift § 87 Abs. 1 Nr. 6 BetrVG?
A: Sobald eine technische Einrichtung *geeignet* ist, Verhalten oder Leistung zu überwachen — eine Überwachungsabsicht ist nicht erforderlich.

F: Was gehört in ein Verzeichnis aller Automatisierungen?
A: Zweck, Verantwortliche fachlich und technisch, beteiligte Systeme, Auslöser, Datenarten, Kritikalität und Datum der letzten Prüfung.
:::
