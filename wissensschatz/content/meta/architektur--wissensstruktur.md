---
id: meta-wissensarchitektur
title: Wissensarchitektur — Strukturen, die mitwachsen
path: meta/architektur
level: 5
type: theorie
source: ki
status: geprueft
updated: 2026-08-11
tags: [struktur, taxonomie, ontologie, langzeit, entscheidungen]
prereqs: [meta-start, meta-pflegeroutine]
related: [meta-lerntheorie, meta-uebergabe, excel-modellbau]
summary: Warum jede Ordnerstruktur nach drei Jahren nicht mehr passt, welche Konstruktionsentscheidungen das auffangen — und was dieses Archiv bewusst anders macht.
---

## Das Grundproblem jeder Sammlung

Jede Ordnerstruktur wird an dem Tag entworfen, an dem man am wenigsten über den späteren Inhalt weiß. Nach drei Jahren passt sie nicht mehr — nicht weil sie schlecht war, sondern weil sich das Wissen anders entwickelt hat als erwartet.

Die typischen Verfallserscheinungen:

- Ein Ordner enthält 60 Dateien, ein anderer zwei.
- Es gibt einen Ordner „Sonstiges", und er ist der größte.
- Dieselbe Sache liegt an zwei Stellen, in leicht verschiedenen Fassungen.
- Niemand traut sich umzuräumen, weil Verweise brechen würden.
- Man findet nur noch, was man selbst abgelegt hat.

Die übliche Reaktion ist eine große Aufräumaktion, die ein Jahr hält. Die bessere Antwort ist, die Struktur so zu bauen, dass sie sich **fortlaufend selbst anpassen kann**.

## Die vier Konstruktionsentscheidungen

**1 — Identität von Ort trennen**

Der häufigste Grund, warum niemand umräumt: Der Ablageort ist gleichzeitig die Adresse. Wer verschiebt, bricht Verweise.

Hier trägt jeder Knoten eine **`id`, die sich nie ändert**. Der `path` bestimmt nur, wo er im Baum erscheint. Ein Knoten kann jederzeit umziehen, ohne dass ein einziger Verweis bricht. Das ist der Unterschied zwischen einer Struktur, die man ändern *kann*, und einer, die man ändern *wird*.

**2 — Struktur berechnen, nicht pflegen**

Der Navigationsbaum dieses Archivs wird bei jedem Build **neu erzeugt**. Überfüllte Ebenen clustern sich automatisch, Gruppen benennen sich aus ihrem eigenen Schwerpunkt, zu kleine lösen sich wieder auf.

Der entscheidende Punkt: Diese Gruppen sind **virtuell**. Sie existieren im Index, nie im Dateisystem. Eine automatische Umgruppierung kann also nichts kaputt machen — im schlimmsten Fall gefällt sie nicht, dann ändert man einen Schwellenwert und baut neu.

Damit kehrt sich das Verhältnis um: Statt eine Struktur gegen den wachsenden Inhalt zu verteidigen, folgt die Struktur dem Inhalt.

**3 — Relative statt absolute Bewertung**

Eine feste Einstufung veraltet. Was bei zehn Knoten „Experte" war, ist bei fünfhundert Grundlagenwissen.

Deshalb ist das Level im Frontmatter nur ein **Vorschlag**. Der Build errechnet die effektive Stufe aus der Länge der Voraussetzungskette und der Strukturtiefe und **normalisiert je Themengebiet**. Die Skala wächst mit. Ein Knoten kann Jahre später anders eingestuft sein, ohne dass jemand ihn angefasst hat — und die Ansicht *Selbstorganisation* macht genau das sichtbar.

**4 — Das Fehlende mitführen**

Die meisten Wissenssammlungen wissen nur, was in ihnen steht. Dieses Archiv führt zusätzlich Buch über das, was fehlt: unaufgelöste Verweise, unbesetzte Stufen je Thema, markierte offene Punkte.

Das klingt nach Buchhaltung und ist der Unterschied zwischen gezieltem und zufälligem Wachstum. Ein Verweis auf einen Knoten, den es noch nicht gibt, ist die präziseste Form einer Notiz „hier fehlt etwas" — sie entsteht genau dort, wo die Lücke gespürt wurde.

## Warum keine reine Verschlagwortung

Ein naheliegender Gegenentwurf wäre, auf Hierarchie ganz zu verzichten und nur mit Tags zu arbeiten. Das hat einen realen Vorteil — eine Sache kann zu mehreren Themen gehören — und zwei praktische Nachteile:

- **Tags driften.** Nach zwei Jahren existieren `dienstplan`, `dienstplanung` und `schichtplan` nebeneinander. Ohne kontrolliertes Vokabular zerfällt die Sammlung leise.
- **Ohne Hierarchie fehlt der Einstieg.** Wer ein Thema neu betritt, braucht eine Reihenfolge. Eine Tag-Wolke beantwortet nicht die Frage „womit fange ich an?".

Der gewählte Kompromiss: **Hierarchie für die Navigation, Tags für die Ähnlichkeit.** Der Baum gibt den Einstieg, die Tags speisen das Clustering und die Suche. Beide werden gebraucht, aber für Verschiedenes.

## Voraussetzungen statt Kapitelnummern

Lehrbücher ordnen linear: Kapitel 1, dann Kapitel 2. Das funktioniert für ein Buch mit einem Autor und einem Lesepfad — und bricht bei einer Sammlung, die aus vielen Richtungen wächst.

Stattdessen trägt hier jeder Knoten seine **Voraussetzungen** als Verweise. Daraus entsteht ein gerichteter Graph, und aus dem Graphen lassen sich beliebig viele Lesepfade ableiten. Nebeneffekte:

- Die Einstufung kann aus der Kettenlänge berechnet werden.
- Fehlende Grundlagen fallen als offene Verweise auf.
- Zyklen sind erkennbar und werden im Selbsttest geprüft.

Ein Knoten mit vielen eingehenden Voraussetzungsverweisen ist automatisch ein Grundlagenknoten — das muss niemand entscheiden.

## Was hier bewusst nicht gemacht wurde

**Keine Versionierung einzelner Knoten im Format.** Dafür ist Git zuständig. Zwei Historien nebeneinander wären eine, die niemand pflegt.

**Keine Volltext-Datenbank.** Der Suchindex wird bei jedem Build neu erzeugt und liegt als Teil derselben Datei vor. Bei einigen tausend Knoten trägt das problemlos; erst deutlich darüber wäre eine echte Suchmaschine nötig — und dann wäre der Inhalt immer noch unverändert lesbar.

**Keine Zugriffsrechte im Archiv.** Ein Dateiordner mit Rechteverwaltung nachzubilden wäre aufwendig und schwach. Alles außer dem Tresor ist offen; was geschützt gehört, gehört in den Tresor.

**Keine Verweise auf externe Webinhalte als tragende Quelle.** Links verrotten. Was wichtig ist, wird im Knoten selbst ausformuliert, nicht verlinkt.

## Die Prüfung, die eine Struktur bestehen muss

Vier Fragen, die man jeder Wissensstruktur stellen kann — auch einer, die nicht so aufgebaut ist wie diese:

1. **Kann ich etwas verschieben, ohne dass etwas bricht?** Wenn nein, wird nie umgeräumt.
2. **Merkt das System, wenn etwas fehlt?** Wenn nein, wächst es nur dort, wo gerade jemand Lust hat.
3. **Ist der Inhalt ohne das System lesbar?** Wenn nein, hängt alles an der Software.
4. **Kann jemand anders es übernehmen?** Wenn nein, ist es ein Tagebuch.

Alle vier sind Konstruktionsfragen. Nachträglich lassen sie sich nur mit erheblichem Aufwand beantworten — deshalb stehen sie am Anfang.

::: quiz
F: Warum ändert sich die `id` eines Knotens nie, der `path` aber schon?
A: Die Trennung von Identität und Ort macht Umstrukturierung verlustfrei. Verweise hängen an der `id`, deshalb bricht Verschieben nichts.

F: Warum sind die automatisch gebildeten Gruppen virtuell und nicht als Ordner angelegt?
A: Weil eine automatische Umgruppierung dann nichts kaputt machen kann. Sie existiert nur im Index; ein geänderter Schwellenwert und ein neuer Build stellen jeden Zustand wieder her.

F: Welche vier Fragen muss eine Wissensstruktur bestehen?
A: Kann ich verschieben, ohne dass etwas bricht? Merkt das System, wenn etwas fehlt? Ist der Inhalt ohne das System lesbar? Kann jemand anders es übernehmen?
:::
