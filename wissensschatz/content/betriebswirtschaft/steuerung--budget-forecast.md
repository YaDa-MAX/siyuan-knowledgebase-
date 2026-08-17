---
id: bwl-budget
title: Budget, Forecast und Abweichungsanalyse
path: betriebswirtschaft/steuerung
level: 4
type: technik
source: ki
status: geprueft
updated: 2026-08-11
tags: [budget, forecast, abweichung, planung, controlling]
prereqs: [bwl-deckungsbeitrag, bwl-hotelkennzahlen]
related: [bwl-revenue, excel-was-waere-wenn, excel-modellbau, powerbi-dax-time-intelligence]
summary: Warum ein Jahresbudget nach zwei Monaten veraltet ist, wie ein rollierender Forecast das auffängt — und wie man eine Abweichung so zerlegt, dass sie eine Handlung nahelegt statt einer Rechtfertigung.
---

## Wozu ein Budget gut ist — und wozu nicht

Ein Jahresbudget ist **kein Prognoseinstrument**. Es ist eine Absichtserklärung, die drei Dinge leistet: Sie legt Ressourcen fest, sie macht Erwartungen explizit, und sie schafft eine Bezugsgröße, an der Abweichungen sichtbar werden.

Was es **nicht** leistet: die Zukunft treffen. Ein im Oktober für das Folgejahr erstelltes Budget kennt weder die Wetterlage, noch die Konkurrenzeröffnung, noch die Energiepreise. Wer es trotzdem als Vorhersage behandelt, produziert zwölf Monate lang Erklärungen für Abweichungen, die niemand hätte vermeiden können.

**Die Trennung, die alles einfacher macht:**

| | Budget | Forecast |
|---|---|---|
| Zweck | Absicht, Ressourcenzusage | beste Schätzung |
| Rhythmus | einmal jährlich, dann fest | monatlich neu |
| Wird geändert | nein | ja, immer |
| Frage | „Was wollen wir?" | „Wo kommen wir raus?" |

Beide nebeneinander. Wer nur das Budget hat, steuert nach einem veralteten Plan. Wer nur den Forecast hat, hat keine Messlatte.

## Bottom-up oder Top-down

**Top-down** setzt eine Zielgröße und verteilt sie. Schnell, konsistent, oft unrealistisch — und es entsteht keine Verbindlichkeit bei denen, die es umsetzen sollen.

**Bottom-up** summiert die Planungen der Bereiche. Realistischer und getragen, dafür langsam und mit eingebautem Sicherheitspolster: Wer an seiner Zielerreichung gemessen wird, plant vorsichtig.

Die brauchbare Praxis ist der **Gegenstromgedanke**: Ein Rahmen von oben, eine Detailplanung von unten, eine Abstimmungsrunde. Zwei Iterationen genügen; ab der dritten verhandelt man nur noch.

## Ein Budget aufbauen, das trägt

**Vom Mengengerüst her, nicht vom Vorjahresumsatz.** Die Fortschreibung „Vorjahr plus 3 %" ist verführerisch und verschleiert jede Struktur. Der Aufbau, der trägt:

1. **Mengen je Monat.** Verfügbare Zimmernächte, erwartete Belegung, Gedecke je Servicezeit. Hier steckt die Saison, und hier gehört sie hin.
2. **Preise je Monat.** ADR nach Segment, Durchschnittsbon. Nicht ein Jahreswert — Preise sind saisonal.
3. **Erlöse** = Menge × Preis, je Bereich.
4. **Variable Kosten** als Quote auf die jeweilige Erlösart, nicht pauschal.
5. **Personal aus dem Kapazitätsbedarf**, nicht aus dem Vorjahr. Bei welcher Belegung braucht es wie viele Kräfte? Das ist der Punkt, an dem die sprungfixen Kosten sichtbar werden.
6. **Fixkosten einzeln**, mit bekannten Änderungen (Mietanpassung, Versicherung, Wartungsverträge).
7. **Investitionen und Abschreibungen** getrennt: Die Auszahlung liegt woanders als der Aufwand.

**Der Kalendereffekt wird regelmäßig unterschätzt.** Ein Monat kann fünf statt vier Wochenenden haben; Ostern wandert zwischen März und April; Feiertage fallen mal auf einen Sonntag und sind dann wertlos. Wer Monate ohne diese Bereinigung vergleicht, misst den Kalender. Der eingebaute Feiertagsdatensatz liefert die Grundlage dafür.

## Rollierender Forecast

Statt zum Jahresende in ein Loch zu laufen: monatlich die nächsten zwölf Monate neu schätzen. Was passiert ist, wird zu Ist; die Zukunft wird aktualisiert.

Der praktische Nutzen liegt weniger in der Zahl als im **Zwang zur monatlichen Auseinandersetzung**. Wer jeden Monat sagen muss, wo er im Dezember rauskommt, bemerkt eine Fehlentwicklung im Frühjahr statt im November.

Zwei Regeln, damit es nicht ausartet:

- **Nur die relevanten Treiber aktualisieren.** Belegung, ADR, Durchschnittsbon, Personalstunden, Wareneinsatzquoten. Alles andere bleibt, wie es ist.
- **Eine Stunde im Monat, nicht einen Tag.** Ein Forecast, der zu aufwendig ist, wird nach dem dritten Mal nicht mehr gemacht.

## Abweichungen zerlegen

Eine Abweichung als Gesamtzahl erzeugt Rechtfertigung. Eine zerlegte Abweichung erzeugt eine Handlung.

**Erlösabweichung in Menge und Preis:**

```
Mengenabweichung = (Istmenge − Planmenge) × Planpreis
Preisabweichung  = (Istpreis  − Planpreis)  × Istmenge
```

Ein Beispiel: geplant 1.800 Zimmernächte zu 120 €, erreicht 1.700 zu 128 €.

- Mengenabweichung: (1.700 − 1.800) × 120 = **−12.000 €**
- Preisabweichung: (128 − 120) × 1.700 = **+13.600 €**
- Gesamt: **+1.600 €**

Die Gesamtzahl sagt „leicht über Plan" und lädt zum Weitermachen ein. Die Zerlegung sagt: **Es wurden hundert Nächte weniger verkauft, und nur ein höherer Preis hat das aufgefangen.** Das sind zwei völlig verschiedene Lagen, und nur die zweite legt eine Frage nahe — warum kamen weniger?

**Kostenabweichung analog:** Verbrauchsabweichung (mehr Ware je Einheit) gegen Preisabweichung (teurerer Einkauf) gegen Beschäftigungsabweichung (mehr Umsatz, also erwartet mehr Ware). Die dritte ist keine Abweichung im eigentlichen Sinn und muss vor der Bewertung herausgerechnet werden — sonst wird jeder gute Monat als Kostenproblem gemeldet.

## Die Regeln, an denen Controlling scheitert oder trägt

1. **Flexible Planung statt starrer.** Kosten am *tatsächlichen* Beschäftigungsgrad messen. Ein Wareneinsatz, der bei 20 % mehr Umsatz um 20 % steigt, ist keine Abweichung.
2. **Wesentlichkeitsgrenze festlegen.** Abweichungen unter einer Schwelle — etwa 5 % oder ein absoluter Betrag — werden nicht kommentiert. Sonst ertrinkt die eine wichtige Abweichung in vierzig belanglosen.
3. **Wer erklärt, muss handeln können.** Eine Abweichung, die jemand kommentieren muss, ohne sie beeinflussen zu können, erzeugt nur Prosa.
4. **Ursache vor Zahl.** „Wareneinsatz 2,1 Punkte über Plan" ist keine Erklärung. „Fischpreise seit April um 18 % gestiegen, Karte nicht angepasst" ist eine.
5. **Der Bericht endet mit einer Entscheidung.** Kein Maßnahmenpunkt heißt: Der Bericht war ein Ritual.

::: quiz
F: Geplant 1.800 Nächte zu 120 €, erreicht 1.700 zu 128 €. Warum ist „1.600 € über Plan" die gefährlichste Zusammenfassung?
A: Sie verdeckt zwei gegenläufige Effekte: −12.000 € Mengenabweichung und +13.600 € Preisabweichung. Es wurden hundert Nächte weniger verkauft — das ist die Frage, die gestellt werden muss.

F: Was ist der Unterschied zwischen Budget und Forecast?
A: Das Budget ist eine Absichtserklärung und bleibt als Messlatte fest. Der Forecast ist die beste aktuelle Schätzung und wird monatlich neu erstellt. Beide werden nebeneinander gebraucht.

F: Warum darf ein Budget nicht als „Vorjahr plus x Prozent" entstehen?
A: Weil es die Struktur verschleiert. Ein tragfähiges Budget wird aus dem Mengengerüst aufgebaut — Belegung und Gedecke je Monat, Preise je Monat, Kosten daran gekoppelt — und macht so die sprungfixen Kosten sichtbar.

F: Was ist eine Beschäftigungsabweichung, und warum muss sie herausgerechnet werden?
A: Der Kostenanstieg, der allein aus höherem Umsatz folgt. Ohne flexible Planung wird jeder gute Monat als Kostenproblem gemeldet.
:::
