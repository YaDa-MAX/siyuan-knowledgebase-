---
id: prozessauto-ki-agenten
title: KI im Prozess — Grenzen, Muster, Absicherung
path: prozessautomation/technologien
level: 5
type: theorie
source: ki
status: geprueft
updated: 2026-08-11
tags: [ki, llm, agenten, dokumenten-ki, datenschutz, ai-act]
prereqs: [prozessauto-werkzeugwahl, prozessauto-governance]
related: [prozessauto-eignung, powerbi-betrieb, meta-fuettern]
summary: Wo Sprachmodelle im Betrieb tragen und wo nicht, welche Muster sich bewährt haben, und welche rechtlichen Grenzen bei Personalbezug gelten.
---

## Die entscheidende Unterscheidung

Klassische Automatisierung ist **deterministisch**: gleiche Eingabe, gleiche Ausgabe, jedes Mal. Sprachmodelle sind es nicht. Dieselbe Anfrage kann unterschiedliche Antworten liefern, und das ist keine Fehlfunktion, sondern die Funktionsweise.

Daraus folgt die Grundregel für den betrieblichen Einsatz:

> **KI eignet sich dort, wo Regeln nicht ausreichen — und nur dort, wo eine falsche Ausgabe erkennbar und korrigierbar ist.**

Eine Rechnungssumme wird nicht von einem Sprachmodell berechnet. Eine Beschwerdemail wird von einem Sprachmodell sinnvoll klassifiziert.

## Wofür es tatsächlich taugt

| Aufgabe | Eignung | Warum |
|---|---|---|
| Freitext klassifizieren und weiterleiten | gut | Toleranz gegen Formulierungsvielfalt |
| Lange Texte zusammenfassen | gut | Prüfbar durch Lesen des Originals |
| Antwortentwürfe erzeugen | gut | Mensch gibt frei |
| Aus Protokollen Aufgaben extrahieren | gut | Ergebnis wird ohnehin durchgesehen |
| Freitext-Rückmeldungen zu Themen gruppieren | gut | Aggregat, kein Einzelfallurteil |
| Übersetzen von Aushängen und Unterweisungen | gut | mit fachlicher Gegenprüfung |
| Rechnungen und Lieferscheine auslesen | gut — mit **spezialisierter Dokumenten-KI** | liefert Zuversichtswerte je Feld |
| Rechnen, summieren, buchen | **ungeeignet** | nicht reproduzierbar, keine Nachvollziehbarkeit |
| Rechtsauskunft erteilen | **ungeeignet** | plausibel klingende Fehler, keine Haftung |
| Personalentscheidungen treffen | **unzulässig** | Art. 22 DSGVO, siehe unten |

Für strukturierte Dokumente ist **spezialisierte Dokumenten-KI** (Azure Document Intelligence, AI Builder) einem allgemeinen Sprachmodell überlegen: Sie liefert je Feld einen **Zuversichtswert**, an dem sich eine Prüfschwelle festmachen lässt. Genau das braucht ein belastbarer Ablauf.

## Das Muster, das trägt

Nahezu jeder funktionierende KI-Schritt im Betrieb folgt derselben Struktur:

```
Eingang → KI-Schritt → Zuversicht prüfen
                         ├─ hoch   → automatisch weiter
                         └─ niedrig → Aufgabe für einen Menschen,
                                      mit vorbefüllten Feldern
```

Der zweite Zweig ist der wichtigere. Er verwandelt ein unzuverlässiges Werkzeug in einen verlässlichen Prozess: Bei Unsicherheit wird nicht geraten, sondern übergeben — und der Mensch bekommt Vorarbeit statt eines leeren Formulars.

**Die Schwelle empirisch bestimmen**, nicht schätzen: 200 reale Fälle durchlaufen lassen, Ergebnisse gegen die Wahrheit halten, Schwelle so setzen, dass die verbleibende Fehlerquote fachlich tragbar ist. Ohne diese Messung ist jede Aussage über Zuverlässigkeit geraten.

## Was in der Praxis schiefgeht

**Kein Protokoll.** Ohne Aufzeichnung von Eingabe, Ausgabe und Zeitpunkt ist keine Fehlersuche möglich und keine Aussage darüber, wie gut es läuft.

**Keine Messung der Trefferquote.** „Läuft gut" ist keine Zahl. Ohne Stichprobenprüfung merkt niemand, wenn sich die Qualität verschlechtert — etwa nach einem Modellwechsel beim Anbieter.

**Modellwechsel ohne Nachtest.** Anbieter tauschen Modelle aus. Was gestern funktionierte, kann heute anders antworten. Deshalb: Version festschreiben, wo möglich, und nach jedem Wechsel den Testsatz erneut durchlaufen lassen.

**Prompt-Injection.** Eingehender Text kann Anweisungen enthalten, die das Modell befolgt („Ignoriere alle vorherigen Anweisungen und …"). Bei allem, was aus unkontrollierten Quellen kommt — E-Mails, Bewertungen, Formulareingaben — muss die Ausgabe als **unzuverlässig** behandelt werden. Sie darf keine Aktion mit Folgen auslösen, ohne dass ein Mensch bestätigt.

**Kosten je Aufruf.** Anders als eine Regel, die nach dem Bau nichts mehr kostet, skalieren KI-Kosten mit dem Volumen. Vor dem Rollout hochrechnen — bei täglich tausend Vorgängen sieht die Wirtschaftlichkeit anders aus als beim Test mit zwanzig.

**Automatisierungsverzerrung.** Menschen übernehmen maschinelle Vorschläge zunehmend ungeprüft, je zuverlässiger das System wirkt. Eine Prüfschleife, die nur formal existiert, ist keine Absicherung. Gegenmittel: stichprobenartige Gegenprüfung und bewusstes Sichtbarmachen der Unsicherheit.

## Datenschutz

Sobald personenbezogene Daten im Spiel sind — bei Personal-, Gäste- und Bewerberdaten praktisch immer:

- **Rechtsgrundlage** klären und ins Verarbeitungsverzeichnis aufnehmen.
- **Auftragsverarbeitungsvertrag** mit dem Anbieter, Verarbeitungsort prüfen.
- **Datenminimierung**: Personenbezug entfernen, wo er für die Aufgabe nicht gebraucht wird. Eine Beschwerdeklassifikation braucht den Namen des Gastes nicht.
- **Keine Trainingsverwendung** der eigenen Daten — vertraglich ausschließen; viele Geschäftsangebote sehen das vor, kostenlose Zugänge nicht.
- **Datenschutz-Folgenabschätzung** bei umfangreicher Verarbeitung sensibler Daten oder systematischer Bewertung von Personen.
- **Betriebsrat beteiligen**: KI-Systeme sind regelmäßig geeignet, Verhalten und Leistung zu überwachen — § 87 Abs. 1 Nr. 6 BetrVG greift. § 90 BetrVG gibt zusätzlich ein Beratungsrecht bei Änderung von Arbeitsverfahren, und § 80 Abs. 3 BetrVG erlaubt dem Betriebsrat ausdrücklich, bei KI-Einführung einen Sachverständigen hinzuzuziehen.

## Automatisierte Einzelentscheidungen

**Art. 22 DSGVO** schränkt ausschließlich automatisierte Entscheidungen mit rechtlicher oder erheblich beeinträchtigender Wirkung gegenüber Personen ein. Im Personalbereich betrifft das unter anderem Bewerberauswahl, Leistungsbewertung, Kündigungsvorschläge und die Zuteilung von Schichten mit erheblicher Auswirkung.

Praktische Regel: **Bei allem, was Menschen betrifft, entscheidet ein Mensch** — und zwar so, dass die Entscheidung tatsächlich überprüft wurde und nicht nur formal abgezeichnet.

## AI Act — die Richtung

Die europäische KI-Verordnung stuft Anwendungen nach Risiko ein und wird schrittweise wirksam. Für den betrieblichen Alltag sind zwei Punkte absehbar relevant:

- **KI im Beschäftigungskontext** — Auswahl, Beförderung, Aufgabenzuweisung, Leistungsüberwachung — fällt in eine höhere Risikoklasse mit entsprechenden Anforderungen an Dokumentation, Transparenz und menschliche Aufsicht.
- **KI-Kompetenz**: Beschäftigte, die KI-Systeme einsetzen, sollen über ausreichendes Verständnis verfügen. Eine kurze Unterweisung zu Möglichkeiten, Grenzen und Datenschutz ist damit keine Kür.

> TODO: Anwendungsstufen und Fristen des AI Act mit Stand prüfen und konkretisieren — die Übergangsregelungen greifen gestaffelt.

## Wann KI die falsche Antwort ist

Vor jedem KI-Vorhaben drei Gegenfragen:

1. **Gibt es eine Regel?** Wenn die Entscheidung in fünf Wenn-Dann-Sätzen beschreibbar ist, ist eine Regel billiger, schneller, prüfbar und dauerhaft reproduzierbar.
2. **Ist das Ergebnis überprüfbar?** Wenn niemand merkt, dass die Ausgabe falsch ist, darf sie keine Folgen auslösen.
3. **Fehlt in Wahrheit Struktur an der Quelle?** Wer KI einsetzt, um unstrukturierte Bestellungen aus Freitextmails zu lesen, sollte zuerst prüfen, ob ein Formular das Problem nicht vollständig beseitigt. **Struktur an der Quelle schlägt Intelligenz am Ende.**

::: quiz
F: Welches Muster macht einen KI-Schritt betrieblich verlässlich?
A: Zuversichtswert prüfen — hohe Zuversicht automatisch, niedrige als vorbefüllte Aufgabe an einen Menschen. Bei Unsicherheit wird übergeben, nicht geraten.

F: Was ist Prompt-Injection und wann ist sie relevant?
A: Eingehender Text enthält Anweisungen, die das Modell befolgt. Relevant bei allem aus unkontrollierten Quellen — E-Mails, Bewertungen, Formulareingaben. Solche Ausgaben dürfen keine Aktion ohne menschliche Bestätigung auslösen.

F: Welche Gegenfrage steht vor jedem KI-Vorhaben an erster Stelle?
A: Gibt es eine Regel? Ist die Entscheidung in wenigen Wenn-Dann-Sätzen beschreibbar, ist eine Regel billiger, schneller und reproduzierbar.
:::
