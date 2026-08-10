---
id: meta-uebergabe
title: Tresor, Sicherheitsmodell und Übergabe an die nächste Generation
path: meta/tresor
level: 2
type: meta
source: ki
status: geprueft
updated: 2026-08-10
tags: [tresor, verschluesselung, nachlass, uebergabe, sicherheit]
prereqs: [meta-start]
related: [meta-pflegeroutine, excel-datenvalidierung, druck-medien]
summary: Wie der Tresor verschlüsselt, was er leistet und was nicht — und wie das Archiv so übergeben wird, dass es jemand anders öffnen kann.
---

## Was der Tresor ist

Ein verschlüsselter Ablageort für Zugangsdaten, Wiederherstellungscodes, Lizenzschlüssel und alles, was niemals in einer Tabelle stehen sollte. Er ist Teil dieses Archivs, weil beides zusammengehört: Wissen ohne Zugänge ist unvollständig, Zugänge ohne Erklärung sind unbrauchbar.

## Das Sicherheitsmodell, offen ausgeschrieben

| Baustein | Umsetzung |
|---|---|
| **Verschlüsselung** | AES-256-GCM. Authentifiziert: Manipulation am Geheimtext führt zum Entschlüsselungsfehler, nicht zu falschem Klartext. |
| **Schlüsselableitung** | PBKDF2-HMAC-SHA-256, 600.000 Iterationen, 128-Bit-Zufallssalz. |
| **Erster Faktor** | Passphrase — Wissen. |
| **Zweiter Faktor** | Schlüsseldatei mit 256 Bit Zufall — Besitz. Sie wird **getrennt vom Archiv** aufbewahrt. |
| **Verknüpfung** | Beide Faktoren gehen gemeinsam in die Schlüsselableitung ein. Einer allein genügt nicht — das ist Zwei-Faktor-**Verschlüsselung**, keine nachgelagerte Abfrage, die sich umgehen ließe. |
| **Externe Verifizierung** | TOTP nach RFC 6238 aus einer Authenticator-App auf einem anderen Gerät. Nach dem Entschlüsseln wird ein gültiger Code verlangt, bevor Geheimnisse erscheinen. |
| **Kein Klartext** | Weder Passphrase noch entschlüsselte Werte werden gespeichert oder übertragen. Alles bleibt im Arbeitsspeicher des Browsers. |
| **Automatische Sperre** | nach 5 Minuten ohne Aktivität; angezeigte Werte verbergen sich nach 30 Sekunden. |
| **Zwischenablage** | wird 30 Sekunden nach dem Kopieren geleert. |
| **Keine Netzverbindung** | Die App lädt nichts nach und sendet nichts. Sie funktioniert vollständig offline. |

**Wichtig zur Einordnung des TOTP-Gates:** Es ist eine **Zugriffssperre**, keine zusätzliche Verschlüsselungsebene. Der Code wechselt alle 30 Sekunden und kann deshalb nicht in einen Schlüssel eingehen, der Jahre später noch funktionieren muss. Wer die verschlüsselte Datei besitzt, Passphrase und Schlüsseldatei hat und eigene Software schreibt, kommt am TOTP vorbei. Der Schutz durch das Gate wirkt gegen unbefugte Benutzung dieser Oberfläche — etwa an einem unbeaufsichtigten Rechner. Diese Unterscheidung offen zu benennen ist wichtiger, als sie zu verschweigen.

## Was der Tresor nicht leistet

- **Kein Schutz vor einem befallenen Endgerät.** Tastaturmitschnitte oder Schadsoftware im Browser lesen die Passphrase und die entschlüsselten Werte mit. Kein Verschlüsselungsverfahren ändert daran etwas.
- **Keine Wiederherstellung.** Es gibt keine Hintertür, keinen Zurücksetzen-Link und keine Stelle, die helfen kann. Passphrase vergessen oder Schlüsseldatei verloren bedeutet: Der Inhalt ist endgültig weg.
- **Kein Ersatz für einen Passwortmanager im Alltag.** Für tägliche Anmeldungen ist ein Manager mit Browsererweiterung praktischer. Der Tresor ist für das gedacht, was selten gebraucht, aber niemals verloren gehen darf: Wiederherstellungscodes, Notfallzugänge, Lizenzen, Bankvollmachten, Zugänge zu Verträgen.
- **Kein Blattschutz-Ersatz.** Excel-Blattschutz und ausgeblendete Blätter sind Bedienschutz, kein Sicherheitsmechanismus — Zugangsdaten gehören nicht in eine Tabelle.

## Die Schlüsseldatei

Sie ist der Punkt, an dem die meisten Sicherheitskonzepte scheitern — weil sie bequem an denselben Ort gelegt wird wie das, was sie schützt.

**Richtig:** USB-Stick im Bankschließfach. Ein anderer Haushalt. Ein verschlossener Umschlag beim Notar. Ein zweiter Stick bei einer Vertrauensperson.
**Falsch:** derselbe Ordner, dieselbe Festplatte, dieselbe Cloud, dieselbe Sicherung.

Faustregel: **Ein Einbruch, ein Brand oder ein Verschlüsselungstrojaner darf nie beide Faktoren gleichzeitig erwischen.** Deshalb mindestens zwei Kopien der Schlüsseldatei an verschiedenen Orten — sie ist nicht geheim genug, um Verlust zu riskieren, und nicht harmlos genug, um sie neben das Archiv zu legen.

## Das Notfallkit

Der Tresor erzeugt auf Knopfdruck ein druckbares Blatt. Es enthält **bewusst keine Geheimnisse** — sondern den Weg zu ihnen:

- welche vier Bestandteile zum Öffnen nötig sind,
- Felder zum handschriftlichen Eintragen der Aufbewahrungsorte,
- die Schritt-für-Schritt-Anleitung zum Öffnen,
- ein Inhaltsverzeichnis des Tresors (nur Bezeichnungen),
- einen Absatz für die Person, die es findet.

Dieses Blatt gehört **auf Papier** an einen verschlossenen Ort. Papier braucht kein Gerät, kein Dateiformat und keinen Strom — und ist damit das einzige Medium, das die Anforderung „in 40 Jahren lesbar" garantiert erfüllt. Bei jeder wesentlichen Änderung neu drucken und das alte Blatt vernichten.

## Übergabe an die nächste Generation

Ein Archiv, das nur sein Erbauer öffnen kann, ist ein Tagebuch. Damit es weitergegeben werden kann, braucht es drei Dinge — und alle drei müssen **vor** dem Ernstfall existieren.

**1 — Die Sachen selbst**
- Der Ordner `wissensschatz/` (die Sicherungskopie genügt).
- Die Schlüsseldatei.
- Das gedruckte Notfallkit.
- Die Passphrase — auf einem der drei üblichen Wege: hinterlegt beim Notar, in einem Bankschließfach, oder aufgeteilt bei zwei Personen, die sie nur gemeinsam ergeben.

**2 — Die Menschen**
- Mindestens **eine** benannte Person, die weiß, dass es dieses Archiv gibt und wo es liegt. Das ist der am häufigsten fehlende Baustein: Der beste Tresor nützt nichts, wenn niemand von ihm weiß.
- Diese Person braucht keinen Zugriff zu Lebzeiten — nur das Wissen um die Existenz und den Ort des Notfallkits.
- Der Ort des Notfallkits gehört in die Unterlagen zur Vorsorge, neben Vollmacht und Patientenverfügung.

**3 — Die Erklärung**
Ein Knoten im Archiv, der in einfachen Worten sagt: was das hier ist, warum es angelegt wurde, was davon wertvoll ist und was gelöscht werden kann. Ohne diese Einordnung sieht ein Erbe einen Ordner mit tausend Dateien und weiß nicht, ob er etwas Wichtiges wegwirft.

Der entscheidende Vorteil des gewählten Aufbaus: **Die Inhalte sind auch ohne diese Software zugänglich.** Wer den Ordner `content/` öffnet, findet gewöhnliche Textdateien, die jeder Texteditor anzeigt. Nur der Tresor ist verschlüsselt — alles andere ist unmittelbar lesbar. Das ist die eigentliche Antwort auf die Frage, wie ein digitales Archiv Jahrzehnte übersteht.

## Prüfliste einmal im Jahr

- [ ] Tresor mit Passphrase und Schlüsseldatei geöffnet — es funktioniert noch
- [ ] Notfallkit neu gedruckt, altes vernichtet
- [ ] Schlüsseldatei an beiden Aufbewahrungsorten vorhanden und lesbar
- [ ] Benannte Person weiß noch von der Existenz und ist noch die richtige
- [ ] Verschlüsselte Sicherung mit dem aktuellen Stand abgelegt
- [ ] Einträge durchgesehen: Veraltetes gelöscht, Neues ergänzt
- [ ] Wiederherstellung des gesamten Archivs auf einem fremden Gerät getestet

::: quiz
F: Warum kann das TOTP-Gate keine zusätzliche Verschlüsselungsebene sein?
A: Der Code wechselt alle 30 Sekunden und kann deshalb nicht in einen Schlüssel eingehen, der Jahre später noch funktionieren muss. Es ist eine Zugriffssperre gegen unbefugte Benutzung der Oberfläche.

F: Wo darf die Schlüsseldatei auf keinen Fall liegen?
A: Im selben Ordner, auf derselben Festplatte, in derselben Cloud oder in derselben Sicherung wie das Archiv. Ein Einbruch, Brand oder Trojaner darf nie beide Faktoren gleichzeitig erwischen.

F: Was ist der am häufigsten fehlende Baustein einer Übergabe?
A: Eine benannte Person, die überhaupt weiß, dass das Archiv existiert und wo das Notfallkit liegt.
:::
