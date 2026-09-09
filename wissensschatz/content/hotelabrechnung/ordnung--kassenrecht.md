---
id: hotelabr-kassenrecht
title: Kassenführung, GoBD und die technische Sicherheitseinrichtung
path: hotelabrechnung/ordnung
level: 4
type: recht
source: ki
status: geprueft
updated: 2026-09-09
tags: [kasse, gobd, tse, verfahrensdokumentation, aufbewahrung]
prereqs: [hotelabr-kontrolle]
related: [hotelabr-schnittstellen, hotelabr-monatsabschluss, arbeitsrecht-rechtsquellen, prozessauto-governance]
summary: Einzelaufzeichnung, Unveränderbarkeit, Belegausgabe und Verfahrensdokumentation — die Anforderungen, die im Hotel regelmäßig unterschätzt werden, und der Punkt, an dem fast jede Prüfung ansetzt.
---

> **Kein Steuer- oder Rechtsrat.** Kassenrecht ändert sich häufig und wird von den Finanzverwaltungen unterschiedlich gehandhabt. Beträge, Fristen und Meldepflichten sind vor jeder Anwendung gegen den aktuellen Stand und mit der Steuerberatung zu prüfen.

## Warum ein Hotel besonders betroffen ist

Drei Eigenschaften zusammen machen den Betrieb zu einem Schwerpunkt der Kassenprüfung:

- **Bargeld** an mehreren Stellen — Rezeption, Bar, Restaurant, teils Spa und Shop
- **Viele Einzelvorgänge** mit kleinen Beträgen und hoher Fluktuation beim Personal
- **Mehrere Systeme**, die miteinander sprechen — PMS, Kasse, Zahlungsdienstleister, Buchhaltung

Der letzte Punkt ist der, der am meisten unterschätzt wird: **Nicht die Kasse allein ist der Prüfgegenstand, sondern die Kette.** Eine formal einwandfreie Kasse nützt wenig, wenn die Übergabe ins PMS und von dort in die Buchhaltung nicht beschrieben und nicht nachvollziehbar ist.

## Die Grundanforderungen

**Einzelaufzeichnung.** Jeder Geschäftsvorfall wird einzeln, vollständig, richtig, zeitgerecht und geordnet aufgezeichnet (§ 146 AO). Sammelbuchungen am Tagesende genügen nicht, wenn ein System die Einzelaufzeichnung technisch leisten kann — und ein Kassensystem leistet sie.

**Unveränderbarkeit.** Eine einmal erfasste Buchung darf nicht spurlos geändert oder gelöscht werden. Korrekturen sind erlaubt und normal; sie müssen als Korrektur erkennbar bleiben. Das ist der technische Grund dafür, dass eine Stornierung im System eine **eigene Buchung** erzeugt statt die ursprüngliche verschwinden zu lassen — und damit auch der Grund, warum die Kontrolle der Negativbuchungen überhaupt möglich ist.

**Technische Sicherheitseinrichtung (TSE).** Elektronische Aufzeichnungssysteme müssen nach § 146a AO durch eine zertifizierte Sicherheitseinrichtung geschützt sein, die jeden Vorgang protokolliert und signiert.

**Belegausgabepflicht.** Bei jedem Vorgang ist ein Beleg zur Verfügung zu stellen. Er muss nicht mitgenommen werden, aber angeboten.

**Aufbewahrung.** Aufzeichnungen und Belege sind über die gesetzlichen Fristen aufzubewahren — und zwar **maschinell auswertbar**, nicht als Papierausdruck. Ein archiviertes PDF ersetzt die Daten nicht.

> TODO: Aktuellen Stand zu Aufbewahrungsfristen nach § 147 AO, zur Meldepflicht elektronischer Aufzeichnungssysteme nach § 146a Abs. 4 AO und zu den Anforderungen an die TSE mit Datum und Fundstelle ergänzen; jährlich mit der Steuerberatung prüfen.

## Verfahrensdokumentation — der Punkt, an dem es meistens klemmt

Die GoBD verlangen eine Beschreibung, aus der ein sachverständiger Dritter in angemessener Zeit nachvollziehen kann, wie Daten entstehen, verarbeitet, übertragen und aufbewahrt werden.

**Das ist die häufigste Beanstandung überhaupt** — nicht weil Häuser schlecht arbeiten, sondern weil niemand sich zuständig fühlt. Was hineingehört:

| Teil | Inhalt |
|---|---|
| **Systeme** | welche Kassen, welches PMS, welche Version, wer betreut sie |
| **Datenfluss** | wo entsteht eine Buchung, wohin läuft sie, über welche Schnittstelle |
| **Stammdaten** | Transaktionscodes mit Steuersatz, Bereich und Konto |
| **Berechtigungen** | wer darf buchen, stornieren, Preise ändern, Codes anlegen |
| **Abläufe** | Kassenabschluss, Nachtlauf, Tageskontrolle, Monatsübergabe |
| **Ausnahmen** | was passiert bei Ausfall von Kasse, TSE oder Schnittstelle |
| **Änderungshistorie** | was wurde wann geändert, von wem, warum |

**Die letzte Zeile ist die, die den Unterschied macht.** Eine Dokumentation ohne Historie beschreibt den heutigen Zustand; geprüft werden aber vergangene Jahre. Wer nicht zeigen kann, wie es damals war, hat für den Prüfungszeitraum keine Dokumentation.

**Der pragmatische Weg:** Nicht auf das perfekte Dokument warten. Ein zehnseitiger Text, der die sieben Punkte oben ehrlich beschreibt und einmal im Jahr fortgeschrieben wird, ist unendlich viel mehr wert als ein nie fertiggestelltes Handbuch.

## Der Ausfall ist aufzeichnungspflichtig

Ein Punkt, der regelmäßig übersehen wird: Fällt die Sicherheitseinrichtung aus, ist **der Ausfall selbst zu dokumentieren** — Zeitpunkt, Dauer, Grund, was in der Zwischenzeit geschah.

Dasselbe gilt für den Kassenausfall und die handschriftliche Notlösung. Ein dokumentierter Ausnahmefall ist unproblematisch; ein undokumentierter erzeugt genau die Lücke, an der eine Prüfung ansetzt.

**Praktisch heißt das:** ein Störungsprotokoll, in das solche Vorfälle mit Datum eingetragen werden. Es kostet nichts und ist im Zweifel die entscheidende Unterlage.

## Kassennachschau

Die Finanzverwaltung kann unangekündigt erscheinen und die Kassenführung prüfen — ohne vorherige Prüfungsanordnung, während der Geschäftszeiten. Sie kann Daten anfordern, den Kassensturz verlangen und bei Beanstandungen zu einer regulären Außenprüfung übergehen.

Was in dieser Situation hilft, lässt sich nicht kurzfristig herstellen:

- Die **Verfahrensdokumentation** liegt vor und ist aktuell.
- Die **Zuordnung Code → Konto → Steuersatz** ist ausdruckbar.
- Der **Datenexport** funktioniert und wurde schon einmal getestet.
- Das **Störungsprotokoll** ist geführt.
- Es gibt **eine Person**, die auskunftsfähig ist.

Der letzte Punkt ist der praktisch wichtigste und der am wenigsten vorbereitete.

## Die Berechtigungen

Kassenrecht ist zu einem guten Teil eine Frage der Rechtevergabe, und die ist wirksamer als jede nachträgliche Kontrolle:

- **Wer darf stornieren?** Nicht jeder. Und über einem Betrag: mit Freigabe.
- **Wer darf Preise ändern?** Rate-Overrides sind der direkteste Weg, Erlös zu verändern.
- **Wer darf Transaktionscodes anlegen?** Eine sehr kleine Gruppe, mit Abstimmung zur Buchhaltung.
- **Wer darf im PM-Konten-Bereich buchen?** Sammelkonten ohne Eigentümer sind der unübersichtlichste Teil des Systems.

**Und die Regel, die alles trägt:** persönliche Kennungen, keine geteilten. Eine Buchung, die keiner Person zuzuordnen ist, ist im Zweifel nicht prüfbar — und schützt niemanden, auch nicht die, die korrekt gearbeitet haben.

::: quiz
F: Warum ist im Hotel nicht die Kasse allein der Prüfgegenstand?
A: Weil mehrere Systeme zusammenspielen — Kasse, PMS, Zahlungsdienstleister, Buchhaltung. Eine formal einwandfreie Kasse nützt wenig, wenn die Übergabe dazwischen nicht beschrieben und nachvollziehbar ist.

F: Was bedeutet Unveränderbarkeit, und wie hängt sie mit der Kontrolle der Negativbuchungen zusammen?
A: Eine erfasste Buchung darf nicht spurlos geändert werden; Korrekturen müssen als solche erkennbar bleiben. Deshalb erzeugt eine Stornierung eine eigene Buchung — und genau deshalb ist die Kontrolle überhaupt möglich.

F: Welcher Teil der Verfahrensdokumentation wird am häufigsten vergessen, und warum ist er entscheidend?
A: Die Änderungshistorie. Geprüft werden vergangene Jahre; wer nur den heutigen Zustand beschreibt, hat für den Prüfungszeitraum keine Dokumentation.

F: Die TSE fällt für zwei Stunden aus. Was ist zu tun?
A: Den Ausfall selbst dokumentieren — Zeitpunkt, Dauer, Grund, was in der Zwischenzeit geschah. Ein dokumentierter Ausnahmefall ist unproblematisch, ein undokumentierter ist die Lücke, an der eine Prüfung ansetzt.

F: Warum sind persönliche Kennungen mehr als eine Formalie?
A: Eine Buchung, die keiner Person zuzuordnen ist, ist nicht prüfbar — und schützt niemanden, auch nicht die, die korrekt gearbeitet haben.
:::
