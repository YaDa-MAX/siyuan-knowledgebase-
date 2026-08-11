---
id: excel-datum-zeit
title: Rechnen mit Datum und Uhrzeit
path: excel/formeln
level: 2
type: technik
source: ki
status: geprueft
updated: 2026-08-09
tags: [datum, zeit, dienstplan, arbeitszeit]
prereqs: [excel-datentypen]
related: [excel-text-funktionen, arbeitsrecht-arbeitszeit]
summary: Seriennummern, Arbeitstage, Nachtschichten über Mitternacht und die Feiertagsberechnung — die Grundlagen für jede Zeiterfassung.
---

## Kern

Datum ist eine ganze Zahl ab dem 1.1.1900, Uhrzeit der Nachkommateil eines Tages. Daraus folgt alles Weitere: Differenzen sind Subtraktionen, „in x Tagen" ist eine Addition, und 1 Stunde ist 1/24.

```
=B1-A1            Tage zwischen zwei Daten
=(B1-A1)*24       Stunden als Dezimalzahl
=A1+ZEIT(0;30;0)  30 Minuten später
```

## Die wichtigsten Funktionen

| Funktion | Zweck |
|---|---|
| `HEUTE()` / `JETZT()` | aktuelles Datum / Zeitstempel — **volatil** |
| `DATUM(Jahr;Monat;Tag)` | baut ein Datum; Überläufe werden verrechnet |
| `JAHR` `MONAT` `TAG` `STUNDE` `MINUTE` `SEKUNDE` | zerlegen |
| `WOCHENTAG(Datum; 2)` | Typ 2 = Montag als 1 (europäisch) |
| `KALENDERWOCHE(Datum; 21)` | Typ 21 = ISO-8601, in Europa der richtige |
| `ISOKALENDERWOCHE(Datum)` | dasselbe, eindeutig benannt |
| `MONATSENDE(Datum; n)` | letzter Tag des n-ten Folgemonats |
| `EDATUM(Datum; n)` | gleiches Datum n Monate später |
| `NETTOARBEITSTAGE.INTL(A;E;Muster;Feiertage)` | Arbeitstage mit freiem Wochenendmuster |
| `ARBEITSTAG.INTL(Start;Tage;Muster;Feiertage)` | Zieldatum nach n Arbeitstagen |
| `BRTEILJAHRE(A;E;Basis)` | Jahresbruchteil, für Zinsen und Alter |
| `DATEDIF(A;E;"Y"/"M"/"D"/"YM"/"MD")` | undokumentiert, aber vorhanden — exakte Altersberechnung |

Das Muster in den `.INTL`-Varianten ist eine siebenstellige Zeichenkette ab Montag: `"0000011"` = Sa/So frei, `"0000000"` = Sieben-Tage-Betrieb, `"0001010"` = Do und Sa frei. Für die Hotellerie mit rollierenden Diensten ist das der entscheidende Parameter.

## Nachtschicht über Mitternacht

Der Klassiker aus der Zeiterfassung: Dienstbeginn 22:00, Ende 06:00. `=Ende-Beginn` liefert −0,667. Lösung:

```
=REST(Ende-Beginn; 1)
```

`REST` mit Divisor 1 rechnet negative Differenzen korrekt in den Folgetag. Für die Auszahlung in Stunden: `=REST(Ende-Beginn;1)*24`, formatiert als Zahl.

Pausenabzug in derselben Formel:
```
=REST(Ende-Beginn;1)*24 - Pause_Minuten/60
```

## Nachtzuschlagsstunden zwischen 23:00 und 06:00

Anteil einer Schicht, der in ein Zeitfenster fällt — funktioniert auch über Mitternacht, indem man in Minuten seit Schichtbeginn rechnet:

```
=LET(b; Beginn; e; WENN(Ende<=Beginn; Ende+1; Ende);
     f1; ZEITWERT("23:00"); f2; ZEITWERT("6:00")+1;
     MAX(0; MIN(e;f2)-MAX(b;f1))*24)
```

## Feiertage

Feste Feiertage sind Konstanten. Die beweglichen hängen alle am Ostersonntag. Die gebräuchliche Gauß-Formel in Excel-Schreibweise:

```
Ostersonntag =DATUM(J;3;1)+REST(255-11*REST(J;19);32)+21
              -WENN(REST(255-11*REST(J;19);32)>28; 1; 0)
              +7-WOCHENTAG(DATUM(J;3;1)+REST(255-11*REST(J;19);32)+21;2)
```

Davon abgeleitet werden alle beweglichen Feiertage als Versatz zum Ostersonntag.

::: viz dataset:feiertage-de
Alle gesetzlichen Feiertage mit Termin, Osterversatz und den Ländern, in denen sie gelten.
:::

**Für den produktiven Einsatz gilt trotzdem:** Eine gepflegte Feiertagstabelle als intelligente Tabelle im Modell ist der Formel vorzuziehen. Sie ist prüfbar, und sie übersteht die Sonderfälle, an denen jede Formel scheitert — den Buß- und Bettag (Mittwoch vor dem 23.11., nur Sachsen), Mariä Himmelfahrt (in Bayern **gemeindeabhängig**) und Fronleichnam in einzelnen Gemeinden von Sachsen und Thüringen.

Die fertige Tabelle mit Feiertagsberechnung je Bundesland liegt als Power-Query-Vorlage bereit: `vorlagen/powerquery/kalender.pq`. Sie erzeugt einen vollständigen Kalender mit Osterformel, Feiertagsspalte und Arbeitstagskennzeichen.

## Textdatum sanieren

Importe liefern oft `15.03.2026` als Text. `DATWERT` versteht das Gebietsschema der Anwendung — bei US-Formaten (`03/15/2026`) hilft:

```
=DATUM(RECHTS(A1;4); LINKS(A1;2); TEIL(A1;4;2))
```

Dauerhaft besser: Power Query mit explizit gesetztem Gebietsschema beim Typwechsel.

::: quiz
F: Warum liefert `=Ende-Beginn` bei einer Nachtschicht einen negativen Wert und wie behebt man es?
A: Beide Zeiten liegen am selben Seriendatum. `=REST(Ende-Beginn;1)` schiebt das Ende korrekt auf den Folgetag.

F: Welchen Typ-Parameter braucht KALENDERWOCHE für die in Deutschland gültige Zählung?
A: 21 (ISO-8601) — oder direkt `ISOKALENDERWOCHE`.
:::
