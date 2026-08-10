---
id: excel-was-waere-wenn
title: Zielwertsuche, Datentabellen, Szenarien und Solver
path: excel/analyse
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [simulation, optimierung, szenarien, solver]
prereqs: [excel-formelsprache]
related: [excel-finanzmathematik, excel-modellbau]
summary: Vier Werkzeuge, um ein Modell rückwärts zu rechnen — von der einfachen Zielwertsuche bis zur restringierten Optimierung.
---

## Zielwertsuche

*Daten ▸ Was-wäre-wenn-Analyse ▸ Zielwertsuche.* Beantwortet genau eine Frage: **Welcher Eingabewert führt zu diesem Ergebnis?** Eine veränderliche Zelle, ein Zielwert. Excel iteriert numerisch.

Typisch: „Welchen Zimmerpreis brauche ich für 1,2 Mio Jahresumsatz bei gegebener Auslastung?" Voraussetzung: Die Zielzelle enthält eine Formel, die von der veränderlichen Zelle abhängt, und die veränderliche Zelle enthält eine **Konstante**, keine Formel.

## Datentabelle

Die am meisten unterschätzte Funktion in Excel. Sie rechnet ein Modell für **viele Eingabewerte gleichzeitig** durch und zeigt eine Sensitivitätsmatrix.

**Eine Variable:** Werte untereinander in eine Spalte, rechts oben daneben die Formel (oder ein Verweis darauf), Bereich markieren, *Datentabelle*, „Werte aus Spalte" auf die Eingabezelle.

**Zwei Variablen:** Werte in Spalte und Zeile, in der Ecke die Formel, beide Eingabezellen angeben. Ergebnis ist eine Matrix — etwa Deckungsbeitrag über Auslastung mal Durchschnittspreis.

Das Ergebnis ist eine `{=MEHRFACHOPERATION(...)}`-Matrixformel und rechnet bei jeder Änderung neu. Bei großen Tabellen bremst das spürbar; die Berechnungsoption *Automatisch außer bei Datentabellen* schaltet genau das ab.

## Szenario-Manager

Speichert benannte Sätze von Eingabewerten („Best Case", „Budget", „Worst Case") und schaltet zwischen ihnen um. Der Szenariobericht stellt sie nebeneinander.

Grenzen: maximal 32 veränderliche Zellen je Szenario, Verwaltung wird schnell unübersichtlich. In der Praxis ist eine **Eingabetabelle mit XVERWEIS auf die aktive Variante** meist wartbarer und transparenter — man sieht alle Annahmen gleichzeitig statt nur die gerade aktive.

## Solver

Das Add-In für echte Optimierung (Datei ▸ Optionen ▸ Add-Ins ▸ Excel-Add-Ins). Anders als die Zielwertsuche kann Solver **mehrere veränderliche Zellen** und **Nebenbedingungen** berücksichtigen.

Drei Lösungsverfahren:
- **Simplex-LP** — nur für lineare Modelle, findet garantiert das globale Optimum. Für Zuordnungs-, Misch- und Transportprobleme die richtige Wahl.
- **GRG-Nichtlinear** — für glatte nichtlineare Modelle. Findet ein *lokales* Optimum; „Multistart" verbessert die Chance auf das globale.
- **Evolutionär** — für unstetige Modelle mit `WENN`, `SVERWEIS`, `RUNDEN`. Langsam, ohne Optimalitätsgarantie, aber oft der einzige Weg.

Ganzzahligkeit über die Nebenbedingung `= GANZ` bzw. `= BIN` (binär). Binärvariablen sind der Schlüssel für Ja/Nein-Entscheidungen — Dienstplanung, Schichtbesetzung, Auswahlprobleme.

**Beispiel Schichtbesetzung:** veränderlich = Anzahl Mitarbeiter je Schichtmuster (ganzzahlig ≥ 0); Zielzelle = Personalkosten (minimieren); Nebenbedingungen = für jede Stunde muss die Summe der abdeckenden Muster den Bedarf erreichen, plus Ruhezeit- und Höchstarbeitszeitregeln. Das ist Personaleinsatzplanung als lineares Programm — und ein Modell, das mit den arbeitsrechtlichen Grenzen aus dem Arbeitszeitrecht direkt gefüttert werden kann.

## Prognose

- **Prognoseblatt** (Daten ▸ Prognoseblatt) erzeugt aus einer Zeitreihe eine Vorhersage mit Konfidenzband. Dahinter steckt exponentielle Glättung (ETS/AAA) mit automatischer Saisonerkennung.
- Die zugehörigen Funktionen `PROGNOSE.ETS`, `PROGNOSE.ETS.KONFINT`, `PROGNOSE.ETS.SAISONALITÄT` lassen sich direkt in Formeln nutzen.
- Voraussetzung: gleichmäßige Zeitabstände, mindestens zwei volle Saisonzyklen für brauchbare Saisonalität.

::: quiz
F: Wann Solver statt Zielwertsuche?
A: Sobald mehr als eine Stellgröße oder mindestens eine Nebenbedingung im Spiel ist.

F: Welches Solver-Verfahren nimmst du bei einem Modell mit `WENN` und `SVERWEIS`?
A: Das evolutionäre — GRG und Simplex setzen glatte bzw. lineare Zusammenhänge voraus.
:::
