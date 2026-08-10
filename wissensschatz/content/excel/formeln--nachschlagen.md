---
id: excel-nachschlagen
title: Nachschlagen — SVERWEIS, INDEX/VERGLEICH, XVERWEIS
path: excel/formeln
level: 3
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [lookup, sverweis, xverweis, index-vergleich]
prereqs: [excel-formelsprache, excel-tabellen]
related: [excel-dynamische-arrays, excel-performance]
summary: Drei Generationen derselben Aufgabe. Welche wann, warum der vierte Parameter über alles entscheidet, und wie Binärsuche große Modelle rettet.
---

## Kern

Nachschlagen heißt: In einer Spalte suchen, aus einer anderen zurückgeben. Excel bietet dafür drei Wege mit unterschiedlicher Reife.

```
=SVERWEIS(Suchwert; Matrix; Spaltenindex; [Bereich_Verweis])
=INDEX(Rückgabespalte; VERGLEICH(Suchwert; Suchspalte; 0))
=XVERWEIS(Suchwert; Suchmatrix; Rückgabematrix; [wenn_nicht_gefunden]; [Vergleichsmodus]; [Suchmodus])
```

## Der vierte Parameter von SVERWEIS

Der häufigste Produktivfehler überhaupt. `Bereich_Verweis` steuert **exakt** (`FALSCH`/0) gegen **ungefähr** (`WAHR`/1). Er ist optional und sein Standard ist `WAHR` — die selten gewollte Variante.

- **Exakt (0)**: sucht linear von oben, bricht beim ersten Treffer ab, liefert sonst `#NV`. Für Schlüssel, IDs, Namen — praktisch immer.
- **Ungefähr (1)**: erwartet eine **aufsteigend sortierte** Suchspalte und liefert den größten Wert, der kleiner oder gleich dem Suchwert ist. Bei unsortierten Daten liefert es stillschweigend Unsinn — kein Fehler, nur falsche Zahlen.

Die ungefähre Suche ist trotzdem unverzichtbar, und zwar für **Staffeln**: Provisionsstufen, Steuerklassen, Rabattgrenzen, Schulnoten.

```
Grenze  Satz
     0    0%
 10000    3%
 50000    5%
100000    8%
=SVERWEIS(Umsatz; Staffel; 2; WAHR)
```

## Warum INDEX/VERGLEICH lange die bessere Wahl war

- Sucht in **beliebiger Richtung** — auch nach links.
- Der Spaltenindex ist keine gezählte Zahl, sondern ein echter Bezug: Spalte einfügen bricht nichts.
- Liest nur zwei schmale Spalten statt der gesamten Matrix — spürbar schneller bei großen Modellen.
- `VERGLEICH` lässt sich einmal in eine Hilfszelle rechnen und mehrfach verwenden.

```
=INDEX(Daten[Preis]; VERGLEICH(A2; Daten[Artikel]; 0))
```

Für zweidimensionales Nachschlagen:

```
=INDEX(Matrix; VERGLEICH(Zeilenwert;Zeilenköpfe;0); VERGLEICH(Spaltenwert;Spaltenköpfe;0))
```

## XVERWEIS — der heutige Standard

Verfügbar ab Microsoft 365 und Excel 2021. Er räumt alle Altlasten ab:

- Rückgabe **vor** der Suchspalte ist selbstverständlich.
- Standard ist **exakte** Suche — die sichere Voreinstellung.
- `wenn_nicht_gefunden` als vierter Parameter macht `WENNFEHLER` überflüssig.
- Rückgabematrix darf **mehrere Spalten** breit sein und läuft als Array über.
- Suchmodus `-1` sucht **von unten** — der eleganteste Weg zum jüngsten Eintrag je Schlüssel.
- Suchmodus `2`/`-2` aktiviert **binäre Suche** auf sortierten Daten.
- Vergleichsmodus `2` erlaubt Platzhalter (`*`, `?`).

```
=XVERWEIS(A2; Artikel[Nr]; Artikel[[Bez]:[Preis]]; "unbekannt"; 0; 1)
=XVERWEIS(A2; Preise[Artikel]; Preise[Preis]; ; 0; -1)      letzter Eintrag gewinnt
```

`XVERGLEICH` ist das Gegenstück zu `VERGLEICH` mit denselben Modi.

## Performance: Binärsuche

Lineare exakte Suche kostet bei *n* Zeilen im Mittel *n*/2 Vergleiche. Über 100.000 Zeilen mal 5.000 Formeln wird das zäh. Binärsuche braucht nur log₂(*n*) Schritte — bei einer Million Zeilen also rund 20 statt 500.000. Voraussetzung ist eine sortierte Suchspalte.

Der klassische Trick dafür ist der **doppelte SVERWEIS**: erst mit ungefährer Suche prüfen, ob der gefundene Wert wirklich passt, dann zurückgeben.

```
=WENN(SVERWEIS(A2;Daten;1;WAHR)=A2; SVERWEIS(A2;Daten;3;WAHR); NV())
```

Zwei schnelle Binärsuchen schlagen eine langsame lineare Suche um Größenordnungen. Mit `XVERWEIS(...;2)` erledigt der Suchmodus dasselbe direkt.

## Entscheidungshilfe

| Situation | Wahl |
|---|---|
| Microsoft 365 / 2021 vorhanden | XVERWEIS |
| Datei muss in Excel 2016 laufen | INDEX/VERGLEICH |
| Staffel- oder Grenzwerttabelle | SVERWEIS mit `WAHR` oder XVERWEIS mit Modus `-1` |
| Mehrere Kriterien | XVERWEIS mit `(Krit1=A)*(Krit2=B)` als Suchmatrix, oder FILTER |
| Sehr große sortierte Datenmenge | Binärsuche (Suchmodus 2) |
| Rückgabe mehrerer Spalten | XVERWEIS mit breiter Rückgabematrix |

::: quiz
F: SVERWEIS liefert für einen Artikel, den es gibt, den Preis eines völlig anderen Artikels. Was ist passiert?
A: Der vierte Parameter fehlt und steht damit auf `WAHR` (ungefähre Suche) über unsortierte Daten. Excel meldet keinen Fehler, liefert aber den nächstkleineren Wert.

F: Wie holst du zu einem Kunden den *letzten* Umsatz aus einer chronologisch sortierten Liste?
A: `=XVERWEIS(Kunde; Liste[Kunde]; Liste[Umsatz]; ; 0; -1)` — Suchmodus −1 durchsucht von unten nach oben.
:::
