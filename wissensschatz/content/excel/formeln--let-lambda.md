---
id: excel-let-lambda
title: LET und LAMBDA — Excel als Programmiersprache
path: excel/formeln
level: 5
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [lambda, let, funktional, m365, wiederverwendung]
prereqs: [excel-dynamische-arrays, excel-namen]
related: [excel-performance, excel-modellbau]
summary: Mit LET benennt man Zwischenergebnisse, mit LAMBDA baut man eigene Funktionen. Seit 2021 ist die Formelsprache turing-vollständig.
---

## LET — Zwischenergebnisse benennen

`LET(name1; wert1; [name2; wert2; …]; ergebnis)` berechnet jeden Wert **genau einmal** und macht ihn unter einem Namen verfügbar.

Vorher:
```
=WENN(SVERWEIS(A2;D:E;2;0)>100; SVERWEIS(A2;D:E;2;0)*0,9; SVERWEIS(A2;D:E;2;0))
```
Drei identische Suchläufe. Nachher:
```
=LET(preis; SVERWEIS(A2;D:E;2;0); WENN(preis>100; preis*0,9; preis))
```
Ein Suchlauf, lesbar, und in großen Modellen ein messbarer Geschwindigkeitsgewinn.

Regeln: mindestens ein Namenspaar, immer eine ungerade Zahl von Argumenten (Paare plus Ergebnis), Namen dürfen auf vorher definierte Namen zugreifen, keine Zellbezugsnamen wie `A1` verwenden.

## LAMBDA — eigene Funktionen

`LAMBDA(param1; [param2; …]; berechnung)` erzeugt eine Funktion. Über den **Namensmanager** bekommt sie einen Namen und ist dann in der ganzen Mappe verfügbar wie eine eingebaute Funktion — ohne VBA, ohne Makrosicherheitsdialog, ohne `.xlsm`.

Name `NettoAusBrutto`, Bezug:
```
=LAMBDA(brutto; satz; brutto/(1+satz))
```
Aufruf im Blatt: `=NettoAusBrutto(119; 0,19)` → 100.

**Testen vor dem Benennen** geht direkt in der Zelle, indem man die Argumente anhängt:
```
=LAMBDA(x; y; x*y)(3; 4)
```

### Rekursion

Ein benanntes LAMBDA darf sich selbst aufrufen. Damit lassen sich Aufgaben lösen, die klassisch nur mit VBA gingen — etwa mehrfaches Ersetzen:

```
=LAMBDA(text; liste; i;
   WENN(i > ZEILEN(liste); text;
        MehrfachErsetzen(WECHSELN(text; INDEX(liste;i;1); INDEX(liste;i;2)); liste; i+1)))
```

Rekursionstiefe ist begrenzt (Stapelüberlauf bei einigen tausend Ebenen) und jede Ebene kostet Zeit. Für große Datenmengen sind die Array-Helfer meist die bessere Wahl.

## Die LAMBDA-Helfer

Sie nehmen eine LAMBDA als Argument und ersparen die Rekursion:

| Funktion | Wirkung |
|---|---|
| `NACHZEILE(array; lambda)` | wendet die Funktion je Zeile an |
| `NACHSPALTE(array; lambda)` | je Spalte |
| `MATRIXERSTELLEN(zeilen; spalten; lambda(z;s))` | erzeugt eine Matrix aus Position |
| `SCAN(start; array; lambda(akk;wert))` | laufende Zwischenstände (kumuliert) |
| `REDUCE(start; array; lambda(akk;wert))` | faltet auf einen Wert zusammen |
| `MAP(array1; [array2…]; lambda)` | elementweise Abbildung |
| `ISOMITTED(arg)` | prüft optionale Parameter |

Beispiel — kumulierte Summe ohne Hilfsspalte:
```
=SCAN(0; Umsätze[Betrag]; LAMBDA(a;b; a+b))
```

Beispiel — Summe der Quadrate:
```
=REDUCE(0; SEQUENZ(10); LAMBDA(a;b; a + b^2))
```

## Warum das die Arbeitsweise ändert

Vor LAMBDA war jede komplexe Excel-Logik entweder eine unlesbare Monsterformel oder VBA. LAMBDA bringt einen dritten Weg: **benannte, getestete, wiederverwendbare Bausteine in der Formelsprache selbst**. Eine Mappe kann eine kleine Bibliothek eigener Fachfunktionen mitbringen (`Arbeitstage_Hotel`, `Deckungsbeitrag`, `IBAN_Pruefziffer`), die jeder Nutzer aufruft, ohne die Implementierung zu kennen. Das ist Kapselung — dasselbe Prinzip, das ordentliche Software wartbar macht.

Für die Weitergabe: LAMBDA-Definitionen liegen im Namensmanager der Mappe. Sie überleben Speichern als `.xlsx`, lassen sich per **Advanced Formula Environment** / Excel Labs verwalten und zwischen Mappen kopieren.

## Grenzen

- Nur Microsoft 365 und Excel 2021+ (Helfer teils erst ab 2022er Kanälen).
- Keine Seiteneffekte: LAMBDA kann nichts schreiben, keine Datei öffnen, nichts formatieren. Dafür bleibt VBA oder Office Scripts zuständig.
- Debugging ist mühsam — Zwischenschritte über `LET` sichtbar machen und einzeln prüfen.

::: quiz
F: Wie viele Argumente hat ein gültiges LET immer?
A: Eine ungerade Anzahl: n Namenspaare plus genau ein Ergebnisausdruck am Ende.

F: Wofür nimmst du SCAN statt REDUCE?
A: SCAN gibt jeden Zwischenstand als Array zurück (z. B. kumulierte Summe), REDUCE nur das Endergebnis.
:::
