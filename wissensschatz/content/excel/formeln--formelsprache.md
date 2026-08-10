---
id: excel-formelsprache
title: Formelsprache — Operatoren, Auswertung, Fehlerwerte
path: excel/formeln
level: 2
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [formelaufbau, fehler, operatoren]
prereqs: [excel-zellbezuege, excel-datentypen]
related: [excel-fehlersuche, excel-dynamische-arrays]
summary: Rangfolge der Operatoren, die neun Fehlerwerte und ihre jeweilige Ursache — das Vokabular, ohne das jede Fehlersuche Raten bleibt.
---

## Operatorrangfolge

Von stark nach schwach bindend:

1. `:` Bereich, ` ` Schnittmenge, `;` Vereinigung
2. `-` negatives Vorzeichen (`-2^2` = 4, nicht −4)
3. `%` Prozent
4. `^` Potenz
5. `*` `/`
6. `+` `-`
7. `&` Textverkettung
8. `=` `<` `>` `<=` `>=` `<>`

Vergleichsoperatoren binden am schwächsten — deshalb braucht `=(A1>0)*(B1>0)` keine Klammern um die Multiplikation, aber `=A1&B1=C1` wertet erst die Verkettung, dann den Vergleich aus.

## Die Fehlerwerte

| Fehler | Ursache | Typischer Auslöser |
|---|---|---|
| `#DIV/0!` | Division durch null oder Leerzelle | Quote ohne Nenner |
| `#NV` | Wert nicht verfügbar | Nachschlagen ohne Treffer |
| `#WERT!` | falscher Argumenttyp | Text in einer Rechenoperation |
| `#BEZUG!` | Bezug existiert nicht mehr | referenzierte Zeile gelöscht |
| `#NAME?` | Name unbekannt | Tippfehler, fehlendes Add-in, fremdsprachiger Funktionsname |
| `#ZAHL!` | Zahl nicht darstellbar | Wurzel aus negativer Zahl, Iteration ohne Konvergenz |
| `#NULL!` | leere Schnittmenge | Leerzeichen statt Semikolon zwischen Bereichen |
| `#ÜBERLAUF!` | Überlaufbereich blockiert | dynamisches Array trifft auf belegte Zelle |
| `#KALK!` | Berechnung nicht möglich | leeres Array, verschachteltes Array |

**Fehler wandern.** Sie pflanzen sich durch jede Formel fort, die sie berührt. Genau das ist erwünscht: Ein `#NV` mitten im Modell ist ein Alarm, kein Schönheitsfehler. Deshalb Fehler **erst am Ende** abfangen, nicht in jeder Zwischenformel — und dort bewusst:

```
=WENNFEHLER(SVERWEIS(...); "unbekannt")     nur, wenn der Ausfall fachlich in Ordnung ist
=WENNNV(XVERWEIS(...); 0)                   fängt nur #NV, lässt echte Defekte durch
```

`WENNFEHLER` verschluckt auch `#BEZUG!` und `#WERT!` — also genau die Fehler, die auf einen kaputten Aufbau hinweisen. `WENNNV` ist deshalb in Nachschlage-Formeln die ehrlichere Wahl.

## Auswertungsreihenfolge im Modell

Excel baut aus allen Formeln einen **Abhängigkeitsgraphen** und rechnet in topologischer Reihenfolge, nicht von oben nach unten. Zellen ohne Abhängigkeit können in beliebiger Folge berechnet werden. Zirkelbezüge brechen den Graphen — Excel meldet sie, es sei denn, iterative Berechnung ist aktiviert (Datei ▸ Optionen ▸ Formeln), was nur für bewusst gebaute Iterationen sinnvoll ist.

## Implizite Schnittmenge und das @

Vor den dynamischen Arrays hat Excel Bereiche in Einzelwerte „zusammengedrückt", wenn nur ein Wert erwartet wurde. Beim Öffnen alter Mappen taucht dieses Verhalten heute als `@` auf: `=@A1:A10`. Wo das `@` steht, hätte die Formel früher genau einen Wert geliefert — heute würde sie überlaufen. Das `@` zu löschen ist meist die gewollte Modernisierung, ändert aber das Ergebnis.

## Formeltext und Umgebung

- `=FORMELTEXT(A1)` zeigt die Formel einer Zelle als Text — Gold für Dokumentation und Audit.
- `=ZELLE("format";A1)` und `=INFO()` liefern Umgebungsinformationen, beide volatil.
- `Strg` + `#` (bzw. `Strg` + `` ` ``) schaltet die gesamte Blattansicht auf Formelanzeige um.

::: quiz
F: Warum liefert `=-2^2` in Excel 4?
A: Das negative Vorzeichen bindet stärker als die Potenz. Excel rechnet `(-2)^2`. Gewollt ist meist `=-(2^2)`.

F: Wann ist `WENNNV` besser als `WENNFEHLER`?
A: Bei Nachschlagefunktionen. `WENNNV` fängt nur den fachlich erwarteten „kein Treffer", während `WENNFEHLER` auch echte Defekte wie `#BEZUG!` unsichtbar macht.
:::
