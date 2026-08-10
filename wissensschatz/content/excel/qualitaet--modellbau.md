---
id: excel-modellbau
title: Modellarchitektur — Mappen, die zehn Jahre halten
path: excel/qualitaet
level: 4
type: theorie
source: ki
status: geprueft
updated: 2026-08-09
tags: [best-practice, wartbarkeit, modellierung, dokumentation]
prereqs: [excel-tabellen, excel-namen]
related: [excel-dashboard, excel-fehlersuche, excel-performance, meta-pflegeroutine]
summary: Trennung von Eingabe, Rechnung und Ausgabe; eine Formel je Spalte; jede Annahme sichtbar. Die Regeln, die aus einer Tabelle ein Modell machen.
---

## Die drei Zonen

Jedes belastbare Modell trennt sauber:

| Zone | Inhalt | Farbkonvention |
|---|---|---|
| **Eingabe** | Konstanten, Annahmen, Parameter, importierte Rohdaten | blaue Schrift auf hellem Grund |
| **Rechnung** | Formeln — keine hart eingetippten Zahlen | schwarze Schrift |
| **Ausgabe** | Berichte, Diagramme, Kennzahlen | eigenes Blatt, keine Rohdaten |

Die Farbkonvention (blau = Eingabe, schwarz = Formel, grün = Verweis auf ein anderes Blatt) stammt aus der Finanzmodellierung und ist dort so verbreitet, dass ein fremder Prüfer eine Mappe in Minuten liest. Sie kostet nichts und trägt sofort.

## Die harten Regeln

1. **Keine Zahl in einer Formel.** `=B4*1,19` ist ein Fehler in Wartung: Steigt die Steuer, sucht jemand in 400 Formeln. Richtig ist `=B4*(1+MwSt)` mit `MwSt` auf dem Parameterblatt.
2. **Eine Formel je Spalte.** In einer Datenspalte steht in jeder Zeile dieselbe Formel. Ausnahmen sind Fehler, nicht Feinheiten. Intelligente Tabellen erzwingen das fast von selbst.
3. **Links nach rechts, oben nach unten.** Die Rechenrichtung soll der Leserichtung folgen. Rückwärtsverweise sind die Hauptursache für unentdeckte Zirkelbezüge.
4. **Keine verbundenen Zellen** in Rechenbereichen. Sie brechen Sortieren, Filtern, Pivots, VBA und dynamische Arrays. Optische Zentrierung geht über *Format ▸ Ausrichtung ▸ Über Auswahl zentrieren*.
5. **Rohdaten sind unantastbar.** Kein Sortieren, kein Überschreiben, keine Kommentare in Zellen. Änderungen passieren in einer nachgelagerten Schicht.
6. **Ein Wert, eine Quelle.** Wenn eine Kennzahl an zwei Stellen berechnet wird, driften sie. Immer referenzieren.
7. **Keine versteckten Zeilen mit Logik.** Was ausgeblendet ist, wird beim Umbau übersehen. Gruppierung (Gliederung) ist sichtbar und deshalb besser als Ausblenden.

## Blattstruktur mit Präfixen

```
00_Info          Zweck, Quellen, Kontakt, Änderungsprotokoll, Kennzahldefinitionen
01_Parameter     alle Annahmen, benannt
d_Rohdaten       Power-Query-Ausgaben, unangetastet
b_Berechnung     Zwischenschritte
Dashboard        Ausgabe
zz_Archiv        Altes, das (noch) nicht gelöscht werden darf
```

Präfixe sortieren die Registerkarten automatisch in Verarbeitungsreihenfolge — die Struktur ist damit auf einen Blick erkennbar.

## Prüfziffern und Selbstkontrolle

Ein Modell soll merken, wenn es falsch ist. Ein schmaler Kontrollblock, in dem jede Zeile `WAHR` ergeben muss:

```
Bilanz geht auf          =RUNDEN(Aktiva-Passiva;2)=0
Summe Detail = Summe Kopf =RUNDEN(SUMME(Detail[Betrag])-Kopfsumme;2)=0
Keine Dubletten          =ANZAHL2(Schlüssel)=SUMMENPRODUKT(1/ZÄHLENWENN(Schlüssel;Schlüssel))
Alle Zuordnungen gefunden =ZÄHLENWENN(Ergebnis;"#NV")=0
Stichtag im Bereich      =UND(Stichtag>=Von;Stichtag<=Bis)
```

Ganz oben auf dem Dashboard eine einzige Ampel: `=WENN(UND(Kontrollblock);"OK";"PRÜFEN")`. Wer das einmal hat, will es nie wieder missen — es fängt genau die Fehler, die sonst erst der Empfänger findet.

## Dokumentation, die überlebt

Auf `00_Info` gehören:
- **Zweck** in zwei Sätzen: Welche Frage beantwortet die Mappe für wen?
- **Datenquellen** mit Pfad, System, Ansprechpartner, Aktualisierungsrhythmus.
- **Kennzahldefinitionen**: Was genau zählt als „Umsatz"? Netto oder brutto? Storniertes enthalten?
- **Bedienung**: Was muss der Nutzer tun? Idealerweise genau ein Schritt: *Alle aktualisieren*.
- **Änderungsprotokoll**: Datum, Person, Änderung. Drei Spalten, mehr nicht.
- **Bekannte Grenzen**: Was das Modell *nicht* kann. Erspart die meisten Missverständnisse.

## Versionierung

Excel hat keine brauchbare Versionsverwaltung. Praktikabler Kompromiss:
- Dateiname mit ISO-Datum: `Personalkosten_2026-08-09.xlsx` — sortiert sich von selbst.
- Produktivstand ohne Datum, Archivstände mit; alte Stände in einen Unterordner.
- Auf SharePoint/OneDrive den Versionsverlauf nutzen statt Kopien anzulegen.
- Bei Modellen mit Rechtsfolgen (Abrechnungen, Meldungen): Stand als PDF mitsichern — ein PDF ist in zehn Jahren garantiert noch lesbar, eine `.xlsm` mit Add-in-Abhängigkeit nicht.

::: quiz
F: Warum ist `=B4*1,19` ein Wartungsfehler?
A: Der Satz ist hart codiert und muss bei Änderung in jeder einzelnen Formel gesucht werden. Parameter gehören benannt auf ein Parameterblatt.

F: Was ist ein Kontrollblock und warum gehört er in jedes ernsthafte Modell?
A: Ein Satz Prüfformeln, die alle `WAHR` ergeben müssen (Summenabgleiche, Dublettenprüfung, keine `#NV`). Er macht Fehler sichtbar, bevor der Empfänger sie findet.
:::
