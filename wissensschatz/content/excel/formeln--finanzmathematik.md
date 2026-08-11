---
id: excel-finanzmathematik
title: Finanzmathematik in Excel
path: excel/formeln
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-11
tags: [finanzmathematik, annuitaet, rendite, abschreibung, investition]
prereqs: [excel-formelsprache, excel-datum-zeit]
related: [excel-was-waere-wenn, excel-modellbau, excel-funktionsreferenz]
summary: Barwert, Annuität und Rendite mit den richtigen Vorzeichen — plus die Frage, wann XINTZINSFUSS statt IKV gebraucht wird und warum die CAGR nicht der Mittelwert ist.
---

## Die Vorzeichenkonvention

Der häufigste Fehler kostet keine Formelkenntnis, sondern ein Minuszeichen. Excel folgt der **Zahlungsstromlogik**:

- **Zuflüsse** an die betrachtete Person sind **positiv**
- **Abflüsse** sind **negativ**

Ein Kredit über 200.000 € bedeutet aus Sicht des Kreditnehmers: Barwert `+200000` (das Geld kommt), Rate negativ (sie geht). Wer beides positiv einträgt, bekommt entweder einen Fehler oder ein Ergebnis mit falschem Vorzeichen.

Die zweite Stolperfalle ist die **Periodenkonsistenz**: Zinssatz und Laufzeit müssen dieselbe Periode meinen. Bei monatlicher Zahlung also `Jahreszins/12` und `Jahre*12`. Ein Jahreszins mit Monatsanzahl kombiniert ergibt astronomische Zahlen, die niemandem auffallen, weil sie plausibel formatiert sind.

Der letzte Parameter **`F`** (Fälligkeit) steuert, wann gezahlt wird: `0` oder weggelassen = **nachschüssig** (Ende der Periode, der Normalfall bei Krediten), `1` = **vorschüssig** (Anfang der Periode, üblich bei Miete und Leasing).

## Die Kernfunktionen

Fünf Größen hängen zusammen; kennt man vier, berechnet Excel die fünfte.

| Gesucht | Funktion |
|---|---|
| Rate | `RMZ(Zins; Zzr; Bw; [Zw]; [F])` |
| Barwert (heutiger Wert) | `BW(Zins; Zzr; Rmz; [Zw]; [F])` |
| Endwert | `ZW(Zins; Zzr; Rmz; [Bw]; [F])` |
| Anzahl Perioden | `ZZR(Zins; Rmz; Bw; [Zw]; [F])` |
| Zinssatz | `ZINS(Zzr; Rmz; Bw; [Zw]; [F]; [Schätzwert])` |

**Beispiel Annuitätendarlehen** — 200.000 €, 3,8 % nominal, 15 Jahre, monatlich:

```
=RMZ(3,8%/12; 15*12; 200000)          →  −1.457,58 €  (Abfluss)
```

**Zins- und Tilgungsanteil einer bestimmten Rate:**

```
=ZINSZ(3,8%/12; 1; 15*12; 200000)     →  Zinsanteil der 1. Rate
=KAPZ(3,8%/12; 1; 15*12; 200000)      →  Tilgungsanteil der 1. Rate
```

Die Summe beider ergibt immer die Annuität. Am Anfang überwiegt der Zinsanteil, am Ende die Tilgung — genau das macht ein Tilgungsplan sichtbar.

**Über einen Zeitraum kumuliert:**

```
=KUMZINSZ(3,8%/12; 15*12; 200000; 1; 12; 0)     Zinsen im ersten Jahr
=KUMKAPITAL(3,8%/12; 15*12; 200000; 1; 12; 0)   Tilgung im ersten Jahr
```

Bei diesen beiden ist der Parameter `F` **nicht optional** — er muss angegeben werden.

## Tilgungsplan aufbauen

Ein Tilgungsplan besteht aus fünf Spalten und einer einzigen Formelzeile, die heruntergezogen wird:

| Periode | Restschuld Anfang | Zinsen | Tilgung | Restschuld Ende |
|---|---|---|---|---|
| `1` | `=Darlehen` | `=B2*Zins_Monat` | `=Rate-C2` | `=B2-D2` |
| `2` | `=E2` | `=B3*Zins_Monat` | `=Rate-C3` | `=B3-D3` |

Kontrollformel für das Modell: Die Summe aller Tilgungen muss exakt der Darlehenssumme entsprechen. Weicht sie ab, stimmt eine Periodenannahme nicht.

## Investitionsrechnung

**Kapitalwert (NBW / NPV)** — die Summe aller abgezinsten Zahlungen:

```
=NBW(Kalkulationszins; C2:C10) + B2
```

Der Haken, den fast jeder einmal übersieht: **`NBW` zinst schon die erste Zahlung ab**, unterstellt sie also am Ende der ersten Periode. Die Anfangsinvestition zum Zeitpunkt 0 gehört deshalb **außerhalb** der Funktion addiert — und als negativer Wert.

**Interner Zinsfuß (IKV / IRR)** — der Zinssatz, bei dem der Kapitalwert null wird:

```
=IKV(B2:B10)
```

Voraussetzung sind **gleichmäßige Perioden**. Bei mehrfachem Vorzeichenwechsel im Zahlungsstrom gibt es mathematisch mehrere Lösungen; Excel liefert eine davon, ohne darauf hinzuweisen. In solchen Fällen ist `QIKV` (modifizierter interner Zinsfuß) mit getrennten Soll- und Habenzinssätzen die belastbarere Größe.

**Bei unregelmäßigen Terminen** — der praktische Normalfall — sind `XKAPITALWERT` und `XINTZINSFUSS` die richtigen Funktionen:

```
=XINTZINSFUSS(Betraege; Datumsangaben)
=XKAPITALWERT(Zins; Betraege; Datumsangaben)
```

Sie rechnen taggenau auf Basis eines 365-Tage-Jahres. Für reale Zahlungsreihen mit Zahlungen an beliebigen Terminen ist das immer die genauere Wahl.

## Rendite und Wachstum

**Die CAGR (durchschnittliche jährliche Wachstumsrate)** ist der am häufigsten falsch berechnete Wert überhaupt. Sie ist **nicht** der Mittelwert der Jahresrenditen:

```
=ZINSSATZP(Jahre; Anfangswert; Endwert)
=(Endwert/Anfangswert)^(1/Jahre)-1        gleichwertig
```

Warum der Mittelwert falsch ist: +50 % gefolgt von −50 % ergibt arithmetisch 0 %, tatsächlich hat man aber 25 % verloren (100 → 150 → 75). Für Wachstumsraten gilt das **geometrische** Mittel — genau das rechnet die CAGR.

**Effektiv- und Nominalzins:**

```
=EFFEKTIV(Nominalzins; Perioden_pro_Jahr)
=NOMINAL(Effektivzins; Perioden_pro_Jahr)
```

3,8 % nominal bei monatlicher Verrechnung sind 3,87 % effektiv. Der Unterschied wirkt klein und macht über 15 Jahre auf 200.000 € einen vierstelligen Betrag aus.

**Verdopplungszeit:**
```
=PDURATION(Zins; 1; 2)     exakte Anzahl Perioden bis zur Verdopplung
```
Die bekannte 72er-Regel (72 / Zinssatz in Prozent) ist die Kopfrechnung dazu und liegt im Bereich üblicher Zinssätze nur um wenige Prozent daneben.

## Abschreibung

| Funktion | Methode |
|---|---|
| `LIA` | linear — gleicher Betrag je Jahr |
| `GDA2` | degressiv mit festem Prozentsatz |
| `GDA` | geometrisch-degressiv, Faktor wählbar (Standard 2 = doppelt-degressiv) |
| `DIA` | arithmetisch-degressiv (Sum-of-Years-Digits) |
| `VDB` | variabel degressiv, mit automatischem Wechsel zur linearen Methode |

`VDB` ist die praxisnächste Funktion, weil sie den **Methodenwechsel** abbildet: Sobald die lineare Abschreibung höher wäre als die degressive, wird gewechselt — genau so rechnet die Steuerpraxis, wenn degressive Abschreibung zulässig ist.

**Wichtig:** Diese Funktionen liefern eine betriebswirtschaftliche Rechnung. Welche Abschreibungsmethode **steuerlich zulässig** ist, ändert sich mit der Gesetzeslage und ist keine Excel-Frage.

## Wertpapierfunktionen

Für Anleihen gibt es einen ganzen Block: `KURS`, `RENDITE`, `AUFGELZINS`, `DURATION`, `MDURATION`, `DISAGIO`, `ZINSSATZ`. Sie teilen alle den Parameter **`Basis`**, der die Zinsusance festlegt:

| Basis | Zählweise |
|---|---|
| 0 (Standard) | US 30/360 |
| 1 | taggenau/taggenau |
| 2 | taggenau/360 |
| 3 | taggenau/365 |
| 4 | europäisch 30/360 |

Der Standardwert 0 ist die **US-amerikanische** Konvention. Für deutsche Papiere ist meist Basis 1 oder 4 richtig. Wer das übersieht, rechnet konsistent, aber mit der falschen Zinsusance — die Abweichung ist klein genug, um nicht aufzufallen, und groß genug, um bei größeren Beträgen zu stören.

## Praxishinweise

- **Zinssätze als Prozentwert eintragen** (`3,8%`), nicht als `3,8`. Der zweithäufigste Fehler nach den Vorzeichen.
- **Parameter benennen** statt Zahlen in Formeln — siehe Modellarchitektur. Ein Kreditmodell mit hart eingetragenem Zinssatz ist beim nächsten Angebot wertlos.
- **Zielwertsuche** beantwortet die Umkehrfragen, für die es keine Funktion gibt: „Welchen Kaufpreis kann ich mir bei 900 € Rate leisten?"
- **Datentabelle** zeigt die Sensitivität: Rate über Zinssatz mal Laufzeit als Matrix, in einem Schritt.
- **Rundung**: Erst am Ende runden, nicht in Zwischenschritten. Bei Zahlungsplänen die letzte Rate als Ausgleichsrate rechnen, damit die Restschuld exakt auf null geht.

::: quiz
F: Warum muss die Anfangsinvestition außerhalb der NBW-Funktion addiert werden?
A: `NBW` zinst bereits die erste übergebene Zahlung ab, unterstellt sie also am Ende der ersten Periode. Die Investition zum Zeitpunkt 0 darf nicht abgezinst werden.

F: Zwei Jahre mit +50 % und −50 %. Wie hoch ist die durchschnittliche jährliche Rendite?
A: Nicht 0 %, sondern rund −13,4 %. Aus 100 werden 150 und dann 75; die CAGR ist das geometrische Mittel: (75/100)^(1/2)−1.

F: Wann `XINTZINSFUSS` statt `IKV`?
A: Sobald die Zahlungen zu unregelmäßigen Terminen erfolgen. `IKV` setzt gleichmäßige Perioden voraus, `XINTZINSFUSS` rechnet taggenau mit Datumsangaben.
:::
