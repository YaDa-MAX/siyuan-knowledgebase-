---
id: hotelabr-transaktionscodes
title: Transaktionscodes — das Rückgrat der Auswertung
path: hotelabrechnung/grundlagen
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-09-09
tags: [transaktionscode, stammdaten, erloesgliederung, umsatzsteuer, kontenrahmen]
prereqs: [hotelabr-einstieg]
related: [hotelabr-abstimmung, hotelabr-monatsabschluss, bwl-hotelkennzahlen, powerbi-sternschema]
summary: Warum die Codepflege die folgenreichste Stammdatenarbeit im Haus ist, wie eine tragfähige Gliederung aussieht — und die Fehler, die sich erst Monate später zeigen.
---

## Was ein Transaktionscode ist

Jede Buchung im PMS trägt einen **Transaktionscode**. Er entscheidet über vier Dinge auf einmal:

1. **Ob es Erlös ist** — oder Zahlung, oder durchlaufender Posten
2. **Welchem Bereich** der Betrag zugerechnet wird — Logis, F&B, Tagung, Sonstiges
3. **Welcher Steuersatz** anfällt und wie er ausgewiesen wird
4. **Auf welches Konto** der Betrag in der Finanzbuchhaltung läuft

Damit ist der Code die einzige Stelle, an der Betrieb und Buchhaltung sich treffen. Ein Fehler dort wird in jeder Auswertung wiederholt — täglich, monatelang, ohne dass es auffällt.

> **Die Codepflege ist die folgenreichste Stammdatenarbeit im Haus** — und die einzige, die praktisch nie jemandem zugewiesen ist.

## Eine tragfähige Gliederung

Codes werden in Gruppen und Untergruppen geführt. Die Gliederung sollte drei Anforderungen zugleich erfüllen: die betriebliche Steuerung, die Buchhaltung und die Statistik.

| Gruppe | Beispiele | Merkmal |
|---|---|---|
| **Logis** | Übernachtung, Zusatzbett, Langzeitrate | Beherbergung, ermäßigter Satz |
| **Frühstück und Verpflegung** | Frühstück, Halbpension, Bankett, Restaurant, Bar | Verpflegung, Regelsatz |
| **Tagung und Veranstaltung** | Raummiete, Technik, Pauschalen | teils Regelsatz, teils gemischt |
| **Nebenerlöse** | Parken, Spa, Wäsche, Shop, Haustier | eigene Gliederung, sonst versanden sie |
| **Erlösminderungen** | Rabatt, Kulanz, Storno-Erlass | **immer eigene Codes**, nie als Negativbuchung auf dem Erlöscode |
| **Durchlaufende Posten** | Kurtaxe, Bettensteuer, weiterbelastete Fremdleistungen | kein Erlös |
| **Zahlungsarten** | Bar, EC, Kreditkarte je Marke, Gutschein, Übertrag | verändern den Umsatz nicht |
| **Interne Umbuchungen** | Übertrag Zimmer→Zimmer, Zimmer→PM, Zimmer→Debitor | müssen sich gegenseitig aufheben |

**Der wichtigste Punkt der ganzen Tabelle ist die fünfte Zeile.** Wer Rabatte als Negativbuchung auf dem Erlöscode bucht, sieht später nur noch den Nettoerlös. Die Frage „wie viel Rabatt haben wir gegeben?" ist dann nicht mehr beantwortbar — die Information ist nicht verloren gegangen, sie ist nie entstanden.

## Erlösminderung getrennt führen

Der Unterschied in einem Beispiel. Ein Zimmer zu 140 €, davon 20 € Nachlass:

| | Erlöscode | Rabattcode | Auswertbar? |
|---|---|---|---|
| **Falsch** | 120 € | — | nein |
| **Richtig** | 140 € | −20 € | ja |

Beide ergeben denselben Nettoerlös und dieselbe ADR. Nur die zweite Variante beantwortet, wie viel Nachlass gegeben wurde, von wem und wofür — und macht damit Rabattpolitik überhaupt steuerbar.

## Umsatzsteuer am Code

Der Steuersatz hängt am Code, nicht am Gast. Das ist bequem und gefährlich zugleich: Wer eine Leistung auf den falschen Code bucht, führt den falschen Steuersatz ab, und zwar systematisch.

Die Stelle, an der es im Hotel regelmäßig klemmt, ist das **Aufteilungsgebot bei Beherbergung**: Leistungen, die nicht unmittelbar der Vermietung dienen — Frühstück, Parkplatz, Wellness, Konferenztechnik — unterliegen dem Regelsatz, auch wenn sie im Pauschalpreis enthalten sind. Eine Pauschale braucht deshalb **mehrere** Codes, nicht einen.

> TODO: Aktuelle Umsatzsteuersätze für Beherbergung, Verpflegung und Getränke sowie den Stand zum Aufteilungsgebot mit Datum und Fundstelle ergänzen und jährlich prüfen.

Praktische Regel: **Jede Pauschale wird beim Einrichten aufgeteilt, nicht beim Abrechnen.** Wer erst auf der Rechnung trennt, trennt irgendwann nicht mehr.

## Die Verbindung zur Finanzbuchhaltung

Jeder Code zeigt auf ein Konto im Kontenrahmen. Drei Regeln, die sich bewährt haben:

- **Nicht 1:1 abbilden.** Der Betrieb braucht feinere Erlösgliederung als die Buchhaltung. Mehrere Codes dürfen auf dasselbe Konto zeigen — umgekehrt niemals.
- **Zuordnung dokumentieren.** Eine Liste „Code → Konto → Steuersatz → Bereich" gehört in die Verfahrensdokumentation. Sie ist bei jeder Prüfung das erste, wonach gefragt wird.
- **Änderungen datieren.** Wer im laufenden Jahr die Zuordnung ändert, erzeugt einen Bruch in jeder Zeitreihe. Änderungen zum Monatsersten, mit Notiz.

## Was erfahrungsgemäß schiefgeht

| Symptom | Ursache |
|---|---|
| ADR unerklärlich hoch | Frühstück oder Kurtaxe im Logiscode |
| ADR unerklärlich niedrig | Nullpreise ohne Grund, oder Rabatt direkt auf den Erlöscode |
| Manager Flash weicht von der Codeauswertung ab | ein Code ist keiner Bereichsgruppe zugeordnet |
| F&B-Wareneinsatzquote springt | Bankettumsatz wechselt zwischen Tagungs- und F&B-Codes |
| Steuerausweis stimmt nicht | Pauschale auf einem einzigen Code statt aufgeteilt |
| Neuer Code taucht in keiner Auswertung auf | Gruppe nicht gesetzt — der häufigste Fehler beim Anlegen |
| Nebenerlöse „verschwinden" | alles auf einem Sammelcode „Sonstiges" |

**Der letzte Punkt verdient eine eigene Warnung.** Ein Code namens *Sonstiges* wächst zuverlässig, weil er die bequemste Wahl ist. Nach zwei Jahren steht dort ein fünfstelliger Betrag, über den niemand etwas sagen kann. Wenn er einen relevanten Anteil erreicht, ist das kein Buchungsproblem, sondern ein Zeichen, dass Codes fehlen.

## Wenn ein neuer Code gebraucht wird

Vier Fragen, bevor er angelegt wird:

1. **Erlös, Zahlung oder durchlaufend?**
2. **Welcher Steuersatz, und warum?**
3. **Welche Bereichsgruppe** — sonst fehlt er in Manager Flash und Statistik.
4. **Welches Konto in der Buchhaltung**, und ist das mit der Buchhaltung abgestimmt?

Wer eine der vier nicht beantworten kann, braucht keinen neuen Code, sondern ein Gespräch.

::: quiz
F: Ein Zimmer kostet 140 €, der Gast bekommt 20 € Nachlass. Warum ist „120 € auf den Erlöscode" die schlechtere Buchung?
A: Beide Varianten ergeben denselben Nettoerlös, aber nur die Trennung in 140 € Erlös und −20 € Rabattcode beantwortet später, wie viel Nachlass gegeben wurde. Die Information geht nicht verloren — sie entsteht nie.

F: Was entscheidet ein Transaktionscode?
A: Ob es Erlös, Zahlung oder durchlaufender Posten ist; welchem Bereich der Betrag zugerechnet wird; welcher Steuersatz anfällt; und auf welches Konto in der Finanzbuchhaltung er läuft.

F: Warum braucht eine Übernachtungspauschale mit Frühstück mehrere Codes?
A: Wegen des Aufteilungsgebots: Leistungen, die nicht unmittelbar der Vermietung dienen, unterliegen dem Regelsatz, auch im Pauschalpreis. Aufgeteilt wird beim Einrichten der Pauschale, nicht beim Abrechnen.

F: Ein Sammelcode „Sonstiges" erreicht nach zwei Jahren einen fünfstelligen Betrag. Was ist das Problem?
A: Kein Buchungs-, sondern ein Gliederungsproblem: Es fehlen Codes. Über den Betrag kann niemand etwas sagen, und er ist damit nicht steuerbar.

F: Dürfen mehrere Transaktionscodes auf dasselbe Konto der Finanzbuchhaltung zeigen?
A: Ja — der Betrieb braucht eine feinere Erlösgliederung als die Buchhaltung. Umgekehrt niemals: Ein Code darf nicht auf mehrere Konten zeigen.
:::
