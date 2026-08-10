---
id: prozessauto-power-platform
title: Power Platform in der Praxis
path: prozessautomation/technologien
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [power-automate, power-apps, dataverse, low-code, microsoft]
prereqs: [prozessauto-werkzeugwahl]
related: [excel-office-scripts, powerbi-betrieb, prozessauto-governance]
summary: Flows, Apps und Dataverse — Aufbau, typische Muster und die Fehler, die jeden zweiten selbstgebauten Flow irgendwann lahmlegen.
---

## Die Bausteine

| Baustein | Rolle |
|---|---|
| **Power Automate Cloud Flows** | Abläufe zwischen Cloud-Diensten, ausgelöst durch Ereignis, Zeitplan oder Knopfdruck |
| **Power Automate Desktop (RPA)** | Steuert lokale Programme und Webseiten wie ein Mensch |
| **Power Apps** | Erfassungs- und Bearbeitungsmasken, auch mobil |
| **Dataverse** | Datenbank mit Rechten, Beziehungen, Prüfregeln und Verlauf |
| **Power BI** | Auswertung |
| **Copilot Studio** | Dialog-Agenten für wiederkehrende Anfragen |
| **AI Builder** | Vorgefertigte KI: Dokumente auslesen, klassifizieren, Objekte erkennen |
| **Connectors** | Über 1000 Verbindungen: SharePoint, Outlook, Teams, SQL, SAP, Salesforce, HTTP |

## Flow-Typen

- **Automatisiert** — Auslöser: neue Mail, neue Datei, neuer Listeneintrag, Formularantwort, Datensatzänderung.
- **Geplant** — Wiederholung nach Zeitplan (täglich, wöchentlich, Cron-ähnlich).
- **Sofort** — manuell aus Teams, der App oder dem Mobiltelefon gestartet.
- **Business Process Flow** — führt Menschen durch Phasen (nur mit Dataverse).

## Muster, die immer wieder passen

**Genehmigung**
```
Formular ausgefüllt → Daten prüfen → Genehmigung starten (Vorgesetzte Person)
  → bei Zustimmung: in Liste eintragen, Bestätigung senden, Kalendereintrag
  → bei Ablehnung: Begründung an Antragsteller
  → Erinnerung nach 3 Tagen ohne Antwort, Eskalation nach 7
```
Die Genehmigungsaktion kann parallel („alle müssen zustimmen") oder als erste Antwort gewertet werden. Vertretungsregeln vorher klären — ein Flow, der auf eine Person im Urlaub wartet, blockiert den Prozess.

**Wiederkehrender Bericht**
```
Zeitplan → Datei aus SharePoint holen → Office Script ausführen (aktualisieren, rechnen)
  → Werte zurückgeben → bei Abweichung über Schwelle: Mail und Teams-Nachricht
```

**Dokumenteneingang**
```
Neue Datei in Eingangsordner → AI Builder liest Rechnungsdaten aus
  → Zuversicht über 90 %: automatisch in Liste eintragen
  → darunter: Aufgabe für Prüfung mit vorbefüllten Feldern
  → Datei umbenennen nach Schema und ablegen
```

**Onboarding neuer Mitarbeitender** (Beispiel Hotellerie)
```
Eintrag in Personalliste → Konten anlegen, Gruppen zuweisen
  → Aufgaben an Abteilungen: Schlüssel, Spind, Dienstkleidung, Belehrung nach IfSG
  → bei Minderjährigen zusätzlich: Erstuntersuchung prüfen, Arbeitszeitprofil setzen
  → Checkliste an Führungskraft, Erinnerung vor Ablauf der Probezeit
```

## Die häufigsten Fehler

**1. Der Flow gehört einer Person.** Verlässt sie das Haus, stirbt der Prozess. Gegenmittel: Flows in einer **Lösung** (Solution) anlegen, Miteigentümer eintragen, für Kritisches ein Dienstkonto verwenden.

**2. Verbindungen laufen über ein persönliches Konto.** Bei Passwortwechsel oder MFA-Umstellung bricht alles. Dienstkonten mit dokumentierten Zugangsdaten im Secret Store.

**3. Keine Fehlerbehandlung.** Standardmäßig bricht ein Flow ab und schickt eine Mail an den Besitzer, die in einem vollen Postfach untergeht. Gegenmittel: **Bereich (Scope)** um die Hauptlogik legen, danach einen zweiten Bereich mit „Ausführen nach: fehlgeschlagen/Zeitüberschreitung", der in einen zentralen Kanal meldet.

**4. Schleifen über zu viele Elemente.** „Auf jedes anwenden" mit tausenden Durchläufen ist langsam und verbraucht Aufruf-Kontingent. Besser: Filterabfragen (OData `$filter`) an der Quelle, `Array filtern`, Batch-Aktionen, Parallelität begrenzt einschalten.

**5. Endlosschleife.** Ein Flow, der bei jeder Änderung startet und selbst eine Änderung schreibt, löst sich immer wieder aus. Gegenmittel: Bedingung auf ein Statusfeld oder ein Kennzeichen „zuletzt geändert von Dienstkonto".

**6. Alles in einen Flow.** Ein 80-Schritte-Ungetüm ist nicht mehr wartbar. In Teilflows zerlegen und über „Untergeordneten Flow ausführen" aufrufen.

**7. Test in der Produktivumgebung.** Getrennte Umgebungen für Entwicklung/Test/Produktion, Übertragung über Lösungen mit Umgebungsvariablen.

## Betriebsfragen

- **Umgebungen**: Standardumgebung ist für alle offen und wird schnell zur Müllhalde. Für alles Ernsthafte eigene Umgebungen mit definiertem Zugang.
- **DLP-Richtlinien** (Data Loss Prevention) trennen Connectors in Gruppen: Ein Flow darf keine Verbindung aus „geschäftlich" mit einer aus „nicht geschäftlich" kombinieren. Das verhindert wirksam, dass Personaldaten in private Dienste fließen.
- **Namenskonvention**: `[Bereich] Prozess – Auslöser – Version`, z. B. `[HR] Urlaubsantrag – Formular – v2`.
- **Beschreibung** jedes Flows ausfüllen: Zweck, Auslöser, Verantwortliche, Rückfallebene.
- **Aufrufkontingente** (Power Platform Requests) sind je Lizenz begrenzt. Flows, die im Minutentakt abfragen, verbrauchen sie schnell — Webhooks bevorzugen.
- **Lizenzen**: Standard-Connectors sind in M365 enthalten, Premium-Connectors (SQL, HTTP, Dataverse, Custom) brauchen eine Power-Automate-Premium-Lizenz. Diese Grenze ist der häufigste Stolperstein.

## Dataverse gegen SharePoint-Liste

| | SharePoint-Liste | Dataverse |
|---|---|---|
| Kosten | in M365 enthalten | Premium-Lizenz |
| Datenmenge | bis ca. 5000 Elemente pro Sicht problemlos, darüber Drosselung | Millionen |
| Beziehungen | rudimentär | echte relationale Modelle |
| Rechte | Listen-/Elementebene | Zeilen-, Spalten- und Feldebene |
| Prüfregeln | einfach | Geschäftsregeln, serverseitige Logik |
| Verlauf | Versionen | vollständiger Änderungsverlauf |

Faustregel: **SharePoint für kleine, überschaubare Sachen. Dataverse, sobald Rechte, Beziehungen oder Nachvollziehbarkeit ernsthaft gebraucht werden** — etwa bei Personaldaten.

::: quiz
F: Was ist der häufigste Grund, warum ein produktiver Flow nach Monaten plötzlich stillsteht?
A: Er hängt an einem persönlichen Konto oder einer persönlichen Verbindung — Passwortwechsel, MFA-Umstellung oder Austritt legen ihn lahm.

F: Wie baut man Fehlerbehandlung in einen Flow ein?
A: Hauptlogik in einen Scope legen, danach einen zweiten Scope mit „Ausführen nach: fehlgeschlagen" konfigurieren, der in einen zentralen Kanal meldet.

F: Wann Dataverse statt SharePoint-Liste?
A: Sobald echte Beziehungen, feingranulare Rechte, serverseitige Regeln oder lückenlose Nachvollziehbarkeit gebraucht werden — bei Personaldaten praktisch immer.
:::
