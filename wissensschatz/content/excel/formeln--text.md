---
id: excel-text-funktionen
title: Textverarbeitung in Formeln
path: excel/formeln
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [text, datenbereinigung, import]
prereqs: [excel-datentypen]
related: [excel-powerquery, excel-dynamische-arrays]
summary: Zerlegen, zusammensetzen, säubern. Die Werkzeuge für den Alltag zwischen Fremdsystem-Export und brauchbarer Liste.
---

## Zerlegen

| Funktion | Zweck |
|---|---|
| `LINKS` / `RECHTS` / `TEIL` | nach Position |
| `LÄNGE` | Zeichenzahl |
| `FINDEN` | Position, **Groß-/Kleinschreibung beachtend**, keine Platzhalter |
| `SUCHEN` | Position, ignoriert Groß-/Kleinschreibung, erlaubt `*` und `?` |
| `TEXTVOR(text; trenner; [n])` | alles vor dem n-ten Trenner (ab M365) |
| `TEXTNACH(text; trenner; [n])` | alles danach |
| `TEXTTEILEN(text; spalten_trenner; [zeilen_trenner])` | zerlegt in ein Array |

Vor `TEXTVOR`/`TEXTNACH` war das Zerlegen an einem Trennzeichen die klassische Fingerübung:

```
Vorname   =LINKS(A2; FINDEN(" ";A2)-1)
Nachname  =TEIL(A2; FINDEN(" ";A2)+1; 999)
```

Für den **letzten** Trenner in einer Zeichenkette gibt es den Standardtrick, das letzte Vorkommen durch ein sonst nie vorkommendes Zeichen zu ersetzen:

```
=TEIL(A2; FINDEN(ZEICHEN(1); WECHSELN(A2;"\";ZEICHEN(1);LÄNGE(A2)-LÄNGE(WECHSELN(A2;"\";""))))+1; 999)
```

## Zusammensetzen

```
=TEXTKETTE(A2;" ";B2)                       verkettet beliebig viele Argumente
=TEXTVERKETTEN("; "; WAHR; A2:A20)          mit Trenner, leere Zellen überspringen
=A2 & " " & B2                              der Operator, kürzeste Form
```

`TEXTVERKETTEN` mit `WAHR` als zweitem Argument ist das Werkzeug, um aus einer gefilterten Spalte eine Aufzählung zu bauen — kombiniert mit `FILTER` ergibt das eine Ein-Zeilen-Zusammenfassung je Kategorie.

## Säubern

| Problem | Lösung |
|---|---|
| überflüssige Leerzeichen | `GLÄTTEN` (entfernt doppelte und Randleerzeichen) |
| geschütztes Leerzeichen `U+00A0` | `WECHSELN(A2; ZEICHEN(160); " ")` — **`GLÄTTEN` erwischt es nicht** |
| Steuerzeichen aus Exporten | `SÄUBERN` |
| Zeilenumbruch in der Zelle | `WECHSELN(A2; ZEICHEN(10); " ")` |
| Zahl als Text | `WERT`, `ZAHLENWERT(text; dez; tausend)` |
| Groß-/Kleinschreibung | `GROSS`, `KLEIN`, `GROSS2` |

`ZAHLENWERT` ist der unterschätzte Held bei Importen: Man gibt Dezimal- und Tausendertrennzeichen explizit an und ist unabhängig von den Systemeinstellungen.

## Formatieren

```
=TEXT(A2; "#.##0,00 €")
=TEXT(A2; "TTTT, TT. MMMM JJJJ")     Montag, 09. März 2026
=WIEDERHOLEN("█"; RUNDEN(A2/Max*20;0))   Balken direkt in der Zelle
```

Achtung: `TEXT` erzeugt Text. Damit ist das Ergebnis nicht mehr rechenbar und die Formatcodes sind sprachabhängig — eine Datei mit `"JJJJ-MM"` bricht in einer englischen Excel-Installation.

## Suchen und Ersetzen in Formeln

- `WECHSELN(text; alt; neu; [n])` ersetzt **Text**, optional nur das n-te Vorkommen.
- `ERSETZEN(text; start; anzahl; neu)` ersetzt **nach Position**.
- `IDENTISCH(a;b)` vergleicht unter Beachtung der Groß-/Kleinschreibung — normale `=`-Vergleiche tun das nicht.

## Praxis

Für einmalige Bereinigungen ist **Blitzvorschau** (`Strg`+`E`) oft schneller als jede Formel: ein Beispiel eintippen, Excel erkennt das Muster. Für wiederkehrende Importe gehört die Bereinigung dagegen in Power Query — dort ist sie dokumentiert, wiederholbar und überlebt den Kollegen, der sie gebaut hat.

::: quiz
F: `GLÄTTEN` entfernt die Leerzeichen aus einem Web-Export nicht. Woran liegt das?
A: Es sind geschützte Leerzeichen (`ZEICHEN(160)`). Erst `WECHSELN(A2;ZEICHEN(160);" ")`, dann `GLÄTTEN`.

F: Wann `FINDEN`, wann `SUCHEN`?
A: `FINDEN` bei exakter Groß-/Kleinschreibung ohne Platzhalter; `SUCHEN` wenn Schreibweise egal ist oder `*`/`?` gebraucht werden.
:::
