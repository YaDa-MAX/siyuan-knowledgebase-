---
id: meta-pflegeroutine
title: Pflegeroutine, Sicherung und Formatwechsel
path: meta/pflege
level: 2
type: checkliste
source: ki
status: geprueft
updated: 2026-08-10
tags: [routine, backup, archivierung, langzeit]
prereqs: [meta-start]
related: [meta-fuettern, meta-uebergabe, druck-medien, foto-filter, meta-kuratierung]
summary: Was wöchentlich, monatlich und jährlich zu tun ist — und die Sicherungsstrategie für einen Bestand, der Jahrzehnte überstehen soll.
---

## Rhythmus

**Wöchentlich (10 Minuten)**
- Inbox durchsehen: ausformulieren, verschieben oder löschen
- `node tools/build.mjs` laufen lassen und die Meldungen lesen
- Lernkarten üben, was fällig ist

**Monatlich (30 Minuten)**
- Backlog ansehen: zwei bis drei Lücken schließen
- Knoten mit `status: entwurf` durchgehen — prüfen oder bewusst so lassen
- Was hat sich neu eingestuft? Ist die neue Einordnung plausibel? Wenn nicht: `level` im Frontmatter korrigieren
- Sicherung prüfen (siehe unten)

**Jährlich (2 Stunden)**
- Alle Knoten mit rechtlichem oder wirtschaftlichem Bezug auf Aktualität prüfen — insbesondere Beträge, Fristen und Paragrafen
- `status: veraltet` setzen, wo es überholt ist, statt zu löschen
- Themen ohne Zuwachs im letzten Jahr: bewusst entscheiden, ob sie weitergeführt werden
- Wiederherstellung **testen**: eine Sicherung auf einem anderen Gerät auspacken und die App öffnen
- Tresor: Notfallkit auf Aktualität prüfen, Papierausdruck erneuern
- Übergabedokument aktualisieren

**Der Jahrestermin ist der wichtigste.** Ein Archiv stirbt nicht daran, dass es zu wenig gefüttert wird, sondern daran, dass niemand mehr weiß, was darin veraltet ist.

## Was jährlich zu prüfen ist

Der Build markiert es nicht von selbst — deshalb hier die Liste der Knoten mit Verfallsdatum:

| Knoten | Was altert |
|---|---|
| Vergütung und Mindestlohn | Beträge, Minijob-Grenze, Sachbezugswerte |
| Ausbildung | Mindestausbildungsvergütung |
| Urlaub und Krankheit | Kinderkrankentage, Rechtsprechung |
| Arbeitszeit | Gesetzesänderung zur Zeiterfassung |
| Excel und Power BI | neue Funktionen, geänderte Menüpfade |
| Prozessautomation | Lizenzmodelle, Connectorgrenzen |
| Fotografie und Druck | Produkt- und Systemlandschaft |

Praktischer Trick: In solche Knoten ein `> TODO:` mit dem Prüfanlass schreiben. Dann erscheinen sie automatisch im Backlog, und die Jahresrunde besteht aus dem Abarbeiten einer Liste statt aus dem Suchen.

## Sicherung

**3-2-1**: drei Kopien, zwei verschiedene Medienarten, eine außer Haus.

Für dieses Archiv konkret:

1. **Arbeitskopie** auf dem täglich genutzten Gerät.
2. **Versionsverwaltung** (Git) — sie ist mehr als eine Sicherung: Sie beantwortet, *wann* etwas geändert wurde und *was* vorher dort stand. Für ein Archiv, das vierzig Jahre wachsen soll, ist die Änderungshistorie ein eigener Wert.
3. **Externe Festplatte**, monatlich, offline aufbewahrt. Offline schützt gegen das Einzige, wogegen Cloud-Synchronisation nicht schützt: Verschlüsselungstrojaner, die die Sicherung mit verschlüsseln.
4. **Zweiter Ort** — anderes Gebäude, Bankschließfach oder verschlüsselter Cloud-Speicher.

**Was gesichert werden muss:** der gesamte Ordner `wissensschatz/`. Er ist selbstgenügsam. `web/kb-data.js` lässt sich jederzeit neu bauen, ist aber klein genug, um mitzuwandern — dann ist die App auch ohne Node.js sofort benutzbar.

**Prüfsummen**: `find . -type f -exec sha256sum {} \; > pruefsummen.txt` einmal jährlich. Damit ist stille Datenkorruption erkennbar, bevor sie sich in alle Sicherungen fortpflanzt.

**Der wichtigste Satz zur Sicherung**: Eine Sicherung, deren Wiederherstellung nie getestet wurde, ist keine Sicherung. Einmal im Jahr auf einem fremden Gerät auspacken und öffnen.

## Formatwechsel über Jahrzehnte

Der eigentliche Gegner eines Langzeitarchivs ist nicht der Datenträgerausfall, sondern die **Formatveralterung**. Was 1995 in einem WordPerfect-Dokument stand, ist heute mühsam zugänglich.

Die Absicherung dagegen steckt bereits im Aufbau:

- **Markdown und JSON** sind reine Textformate. Sie sind mit jedem Texteditor lesbar, auch wenn es dieses Projekt nicht mehr gibt.
- **Kein Datenbankformat, kein proprietärer Container.**
- **Die App ist ersetzbar.** Verschwindet sie, bleibt der Inhalt vollständig.
- **UTF-8** durchgängig, mit Zeilenumbrüchen im Unix-Stil.
- **Dateinamen ohne Umlaute und Sonderzeichen** — sie überstehen jeden Systemwechsel.

Zusätzlich empfehlenswert: alle paar Jahre einen **Papierausdruck** oder ein PDF der wichtigsten Knoten. Papier braucht kein Gerät, kein Format und keinen Strom. Für den Tresor gilt das ausdrücklich — dort ist der Papierausdruck nicht Zusatz, sondern der eigentliche Notfallweg.

## Wenn etwas schiefgeht

| Problem | Weg |
|---|---|
| Build bricht mit Fehler ab | Die Meldung nennt Datei und Ursache. Meist fehlt ein Pflichtfeld im Frontmatter oder eine ID ist doppelt. |
| App zeigt alte Inhalte | `web/kb-data.js` ist veraltet — Build laufen lassen, Browsercache leeren. |
| Knoten verschwunden | Dateiname prüfen: Dateien mit führendem `_` und Ordner mit führendem `.` werden übersprungen. |
| Einstufung springt unerwartet | Normalerweise korrekt: Ein Thema ist gewachsen, die Skala hat sich verschoben. In der Ansicht *Selbstorganisation* nachvollziehbar. |
| Gruppierung sieht falsch aus | Tags schärfen. Die Cluster entstehen aus Tag- und Titelähnlichkeit — je präziser die Tags, desto besser die Gruppen. |
| Ganze Datei zerstört | Git-Historie: `git log -- pfad/datei.md`, dann `git checkout <commit> -- pfad/datei.md`. |

::: quiz
F: Warum genügt eine Cloud-Synchronisation nicht als alleinige Sicherung?
A: Sie synchronisiert auch Schäden — ein Verschlüsselungstrojaner oder ein versehentliches Löschen wandert mit. Deshalb zusätzlich eine Offline-Kopie.

F: Was ist der eigentliche Gegner eines Langzeitarchivs?
A: Nicht der Datenträgerausfall, sondern die Formatveralterung. Deshalb reine Textformate und eine App, die ersetzbar ist.

F: Woran erkennst du, dass eine Sicherung funktioniert?
A: Nur daran, dass die Wiederherstellung auf einem anderen Gerät getestet wurde. Alles andere ist eine Annahme.
:::
