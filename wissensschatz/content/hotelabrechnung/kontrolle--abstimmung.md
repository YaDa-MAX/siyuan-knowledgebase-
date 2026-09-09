---
id: hotelabr-abstimmung
title: Manager Flash gegen Transaktionscodes abstimmen
path: hotelabrechnung/kontrolle
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-09-09
tags: [abstimmung, managerflash, differenz, statistik, kontrolle]
prereqs: [hotelabr-transaktionscodes, hotelabr-nachtlauf]
related: [hotelabr-kontrolle, hotelabr-schnittstellen, bwl-hotelkennzahlen, excel-pivot]
summary: Warum zwei Berichte aus demselben System verschiedene Zahlen zeigen können, die sechs üblichen Ursachen — und welche Differenz harmlos ist.
---

## Zwei Berichte, eine Quelle

Der **Manager Flash** zeigt den Tag in Kennzahlen: Zimmer verkauft, ADR, RevPAR, Erlöse je Bereich. Die **Auswertung nach Transaktionscodes** zeigt dieselben Erlöse, aber nach Code aufgeschlüsselt.

Beide stammen aus derselben Datenbank. Sie müssen übereinstimmen — und tun es oft nicht.

**Das ist die aussagekräftigste Prüfung des ganzen Tagesabschlusses**, weil sie nicht einzelne Buchungen prüft, sondern die **Struktur**: ob jeder Betrag dort ankommt, wo er in der Auswertung erwartet wird. Eine Differenz zeigt fast immer ein Stammdatenproblem an, und Stammdatenprobleme wiederholen sich jeden Tag, bis jemand sie behebt.

## Die sechs üblichen Ursachen

**1 — Ein Code hat keine Bereichsgruppe.**
Der häufigste Fall, und er entsteht immer beim Anlegen. Der Betrag steht in der Codeauswertung, fehlt aber im Manager Flash, weil dieser nach Gruppen summiert. Symptom: Die Differenz entspricht genau einem Code.

**2 — Brutto gegen netto.**
Der eine Bericht zeigt Erlöse mit Steuer, der andere ohne. Symptom: Die Differenz beträgt exakt einen Steuersatz. Kein Fehler, aber es muss einmal geklärt und dokumentiert werden, welcher Bericht was zeigt.

**3 — Durchlaufende Posten.**
Kurtaxe, Bettensteuer und weiterbelastete Fremdleistungen gehören in keinen Erlös. Wenn der eine Bericht sie mitzählt und der andere nicht, entsteht eine gleichbleibende Differenz. Symptom: Der Betrag entspricht der Kurtaxe des Tages.

**4 — Erlösminderungen anders behandelt.**
Der Manager Flash zeigt oft den Nettoerlös nach Rabatten, die Codeauswertung Brutto und Minderung getrennt. Symptom: Die Differenz entspricht der Rabattsumme.

**5 — Stichtagsversatz.**
Buchungen nach dem Datumswechsel, aber vor dem Berichtszeitpunkt. Symptom: Die Differenz taucht am Folgetag mit umgekehrtem Vorzeichen auf und gleicht sich aus.

**6 — Ein Bericht wurde nach einer Korrektur nicht neu erzeugt.**
Der banalste Fall und deshalb der, den man zuletzt prüft, obwohl er zuerst zu prüfen wäre.

## Wie man die Differenz eingrenzt

Nicht suchen, sondern halbieren. Vier Schritte, die fast immer reichen:

1. **Gesamtdifferenz notieren.** Betrag und Vorzeichen.
2. **Nach Bereich vergleichen.** Meist steckt die ganze Differenz in einem einzigen Bereich — damit ist der Suchraum sofort um vier Fünftel kleiner.
3. **Innerhalb des Bereichs nach Code.** Jetzt zeigt sich, ob es ein Code ist (Zuordnung) oder viele kleine (systematisch, etwa Steuer).
4. **Die Zahl selbst befragen.** Entspricht sie genau einem Steuersatz? Der Kurtaxe? Der Rabattsumme? Ein Betrag ist selten zufällig, und die Ursachenliste oben ist an Beträgen erkennbar.

**Die vierte Frage spart die meiste Zeit.** Eine Differenz von 18,7 % eines Bereichs ist ein Steuerproblem, keine fehlende Buchung — das sieht man, bevor man den ersten Bericht öffnet.

## Was zu tun ist, wenn sie bleibt

Eine Differenz, die sich nicht erklären lässt, wird **dokumentiert, nicht ignoriert**. Datum, Betrag, Bereich, geprüfte Hypothesen. Zwei Gründe:

- Wiederholt sie sich, ist die Aufzeichnung die einzige Chance, das Muster zu erkennen. Zwei ungeklärte Differenzen in derselben Höhe sind eine Spur.
- Fällt sie im Monatsabschluss auf, ist die Frage „war das bekannt?" bereits beantwortet.

Was **nicht** hilft: sie als Rundung abtun. Rundungsdifferenzen liegen im Centbereich. Alles darüber hat eine Ursache.

## Die Prüfung, die daneben gehört

Manager Flash gegen Codes prüft die Erlösseite. Die Zahlungsseite braucht eine eigene Abstimmung:

| Prüfung | Gegen was | Häufigster Befund |
|---|---|---|
| Bar je Kassierer | tatsächlicher Kassenbestand | Wechselgeldfehler, meist klein und beidseitig |
| Karten je Marke | Abrechnung des Zahlungsdienstleisters | Zeitversatz — Eingänge kommen ein bis drei Tage später |
| Gutscheine | Gutscheinbestand | eingelöste Gutscheine ohne Ausbuchung |
| Überträge | Gegenkonto | Übertrag ohne Gegenbuchung |

**Wiederkehrende Differenzen in dieselbe Richtung** sind das eigentliche Signal. Beidseitig streuende Kleinbeträge sind Alltag; ein Kassenbestand, der jeden Tag ein wenig zu niedrig ist, ist es nicht.

## Warum sich der tägliche Aufwand rechnet

Die Abstimmung dauert eingespielt fünf Minuten und findet Stammdatenfehler, die sonst monatelang jeden Tag denselben Betrag falsch zuordnen. Ein Code ohne Gruppe kostet nichts an Geld — er kostet die Verlässlichkeit jeder Auswertung, die darauf aufbaut.

Und sie hat einen zweiten Effekt, der selten genannt wird: Wer die Struktur täglich prüft, **kennt sie**. Die Frage, ob eine Zahl im Monatsbericht plausibel ist, lässt sich dann in Sekunden beantworten statt in Stunden.

::: quiz
F: Warum ist die Abstimmung Manager Flash gegen Transaktionscodes aussagekräftiger als das Prüfen einzelner Buchungen?
A: Sie prüft die Struktur statt der Einzelfälle — ob jeder Betrag dort ankommt, wo die Auswertung ihn erwartet. Differenzen zeigen fast immer Stammdatenprobleme, und die wiederholen sich täglich, bis jemand sie behebt.

F: Die Differenz entspricht genau 19 % eines Bereichs. Was ist die Ursache?
A: Ein Bericht zeigt brutto, der andere netto. Kein Fehler, aber es muss einmal geklärt und dokumentiert werden, welcher Bericht was ausweist.

F: Welche Frage grenzt eine Differenz am schnellsten ein?
A: Die nach dem Betrag selbst: Entspricht er einem Steuersatz, der Kurtaxe, der Rabattsumme? Ein Betrag ist selten zufällig — das sieht man, bevor man den ersten Bericht öffnet.

F: Eine Differenz lässt sich nicht erklären. Was ist zu tun?
A: Dokumentieren — Datum, Betrag, Bereich, geprüfte Hypothesen. Wiederholt sie sich, ist die Aufzeichnung die einzige Chance, das Muster zu erkennen. Als Rundung abtun geht nicht: Rundungen liegen im Centbereich.

F: Welche Kassendifferenz ist harmlos und welche nicht?
A: Beidseitig streuende Kleinbeträge sind Alltag. Ein Bestand, der jeden Tag in dieselbe Richtung abweicht, ist es nicht.
:::
