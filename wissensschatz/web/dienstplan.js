/* =====================================================================
   dienstplan.js — Prüfregeln für Arbeitszeit nach ArbZG und JArbSchG

   Warum es das gibt: Der Knoten „Wie Lernen funktioniert" benennt die
   eigentliche Hürde selbst — zu wissen, dass die Ruhezeit im Gastgewerbe
   auf zehn Stunden verkürzt werden darf, ist etwas anderes, als das im
   konkreten Dienstplan zu erkennen. Diese Datei schlägt genau diese
   Brücke: Sie nimmt echte Schichten und meldet, welche Regel greift.

   Es ist eine Prüfhilfe, kein Rechtsrat, und sie kennt bewusst nur einen
   Teil der Wirklichkeit. Was sie NICHT prüft, steht in GRENZEN — diese
   Liste gehört mit ausgegeben, sonst erzeugt das Werkzeug eine Sicherheit,
   die es nicht deckt.

   Reines Rechnen ohne DOM, damit dieselbe Datei im Browser läuft und im
   Selbsttest von Node geprüft werden kann. Zeitrechnung durchgehend in
   UTC-Minuten, also reine Wanduhrzeit ohne Sommerzeitsprünge.
   ===================================================================== */
(function () {
  "use strict";

  const MIN = 60000;
  const H = 60;

  /* ------------------------------------------------------ Personengruppen */

  const GRUPPEN = {
    erwachsen: { label: "ab 18 Jahren", gesetz: "ArbZG" },
    jugend16: { label: "16 oder 17 Jahre", gesetz: "JArbSchG" },
    jugend15: { label: "15 Jahre", gesetz: "JArbSchG" },
  };

  const SCHWERE = ["unzulaessig", "pruefen", "hinweis"];

  /* ------------------------------------------------------------ Feiertage */

  /** Ostersonntag nach dem anonymen gregorianischen Algorithmus. */
  function ostern(jahr) {
    const a = jahr % 19, b = Math.floor(jahr / 100), c = jahr % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const monat = Math.floor((h + l - 7 * m + 114) / 31);
    const tag = ((h + l - 7 * m + 114) % 31) + 1;
    return Date.UTC(jahr, monat - 1, tag);
  }

  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"];

  /**
   * Gesetzliche Feiertage eines Jahres für ein Bundesland, abgeleitet aus
   * dem Datensatz `feiertage-de` — der Datensatz ist damit nicht nur eine
   * Tabelle zum Nachschlagen, sondern die Quelle der Prüfung.
   */
  function feiertageFuer(jahr, land, items) {
    const o = ostern(jahr);
    const raus = new Map();
    for (const e of items || []) {
      if (/kein gesetzlicher Feiertag/i.test(e.laender)) continue;
      const bundesweit = /bundesweit/i.test(e.laender);
      const laender = (e.laender.match(/\b[A-Z]{2}\b/g) || []);
      if (!bundesweit && land && !laender.includes(land)) continue;
      if (!bundesweit && !land) continue;      // ohne Landesangabe nur bundesweite

      let ts = null;
      if (e.os !== null && e.os !== undefined) {
        ts = o + e.os * 86400000;
      } else if (/^(\d{1,2})\.\s+(\S+)$/.test(e.regel)) {
        const [, t, mon] = e.regel.match(/^(\d{1,2})\.\s+(\S+)$/);
        const mi = MONATE.indexOf(mon);
        if (mi >= 0) ts = Date.UTC(jahr, mi, +t);
      } else if (/Mittwoch vor dem 23\. November/i.test(e.regel)) {
        // Buß- und Bettag: der Mittwoch vor dem 23. November
        let d = Date.UTC(jahr, 10, 22);
        while (new Date(d).getUTCDay() !== 3) d -= 86400000;
        ts = d;
      }
      if (ts !== null) raus.set(iso(ts), e.tag);
    }
    return raus;
  }

  /* ---------------------------------------------------------- Zeitrechnung */

  const iso = (ts) => new Date(ts).toISOString().slice(0, 10);
  const uhr = (ts) => new Date(ts).toISOString().slice(11, 16);
  const tagesMinute = (ts) => new Date(ts).getUTCHours() * 60 + new Date(ts).getUTCMinutes();

  function stunden(min) {
    const v = min / 60;
    return (Math.round(v * 100) / 100).toFixed(2).replace(/[.,]?0+$/, "").replace(".", ",");
  }
  const std = (min) => stunden(min) + " h";

  function parseTs(datum, zeit) {
    const [j, m, t] = datum.split("-").map(Number);
    const [hh, mm] = zeit.split(":").map(Number);
    return Date.UTC(j, m - 1, t, hh, mm);
  }

  /** Kalenderwoche nach ISO 8601 — als Schlüssel „2026-KW33". */
  function isoWoche(ts) {
    const d = new Date(ts);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const start = Date.UTC(d.getUTCFullYear(), 0, 1);
    const kw = Math.ceil(((d.getTime() - start) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-KW${String(kw).padStart(2, "0")}`;
  }

  const WOCHENTAG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const datumLang = (ts) => `${WOCHENTAG[new Date(ts).getUTCDay()]}, ${new Date(ts).getUTCDate()}. ${MONATE[new Date(ts).getUTCMonth()]}`;

  /** Überschneidung zweier Zeiträume in Minuten. */
  const ueberlappung = (a1, a2, b1, b2) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1)) / MIN;

  /**
   * Schichten zu Arbeitstagen bündeln — der entscheidende Zwischenschritt.
   *
   * Der geteilte Dienst ist in der Hotellerie der Normalfall: 11–14 Uhr und
   * 17–22 Uhr sind ein Arbeitstag mit einer Unterbrechung, nicht zwei
   * Arbeitstage mit fünf Stunden Ruhezeit dazwischen. Wer das nicht trennt,
   * meldet jeden zweiten Dienstplan der Branche fälschlich als rechtswidrig
   * — und wird nach dem dritten Fehlalarm zu Recht ignoriert.
   *
   * Zugeordnet wird nach dem Kalendertag des Schichtbeginns; eine Schicht
   * über Mitternacht gehört also zu dem Tag, an dem sie anfängt.
   */
  function arbeitstage(schichten) {
    const nach = new Map();
    for (const x of schichten) {
      const t = iso(x.start);
      if (!nach.has(t)) nach.set(t, []);
      nach.get(t).push(x);
    }
    return [...nach.entries()]
      .map(([tag, teile]) => {
        teile.sort((a, b) => a.start - b.start);
        const start = teile[0].start;
        const ende = teile[teile.length - 1].ende;
        const arbeit = teile.reduce((a, x) => a + x.arbeit, 0);
        // Unterbrechungen zwischen den Teilen zählen als Pause: Wer von 14 bis
        // 17 Uhr nach Hause geht, hat pausiert — mehr als § 4 verlangt.
        let luecken = 0;
        for (let i = 0; i < teile.length - 1; i++) luecken += (teile[i + 1].start - teile[i].ende) / MIN;
        return {
          tag, teile, start, ende, arbeit,
          pause: teile.reduce((a, x) => a + x.pause, 0) + luecken,
          luecken,
          geteilt: teile.length > 1,
          schichtzeit: (ende - start) / MIN,
        };
      })
      .sort((a, b) => a.start - b.start);
  }

  /** Minuten der Nachtzeit 23–6 Uhr, die eine Schicht abdeckt. */
  function nachtMinuten(start, ende) {
    let summe = 0;
    const tag0 = Date.UTC(new Date(start).getUTCFullYear(), new Date(start).getUTCMonth(), new Date(start).getUTCDate());
    for (let d = -1; d <= 2; d++) {
      const basis = tag0 + d * 86400000;
      summe += ueberlappung(start, ende, basis + 23 * H * MIN, basis + 30 * H * MIN);
    }
    return summe;
  }

  /* ------------------------------------------------------------- Regelwerk */

  /**
   * Was dieses Werkzeug bewusst nicht abdeckt. Die Liste ist Teil des
   * Ergebnisses: Ein Prüfer, der seine Grenzen verschweigt, ist gefährlicher
   * als gar keiner, weil ein grünes Ergebnis dann als Freigabe gelesen wird.
   */
  const GRENZEN = [
    "Tarifverträge und Betriebsvereinbarungen — § 7 ArbZG lässt weitreichende Abweichungen zu, gerade beim Ausgleichszeitraum. Der geltende Tarifvertrag geht diesen Prüfungen vor.",
    "Behördliche Bewilligungen (§ 15 ArbZG) und Notfälle (§ 14 ArbZG).",
    "Bereitschaftsdienst, Rufbereitschaft und Arbeitsbereitschaft — hier wird jede Schicht als volle Arbeitszeit gerechnet.",
    "Ausgleichszeiträume über den eingegebenen Zeitraum hinaus. Geprüft wird nur, was in der Tabelle steht.",
    "Lage und Stückelung der Pausen bei Erwachsenen — es wird nur die Gesamtdauer geprüft, nicht ob sie in Stücken ab 15 Minuten und nicht später als nach sechs Stunden genommen wurde.",
    "Mutterschutz, Schwerbehinderung, Vollzeitschulpflicht Jugendlicher, Berufsschulzeiten (§ 9 JArbSchG) und ärztliche Untersuchungen (§§ 32 ff. JArbSchG).",
    "Entgelt, Zuschläge, Mindestlohn und Aufzeichnungspflichten.",
    "Kinder unter 15 Jahren — deren Beschäftigung ist grundsätzlich verboten (§ 5 JArbSchG) und wird hier nicht modelliert.",
  ];

  /* ------------------------------------------------------------- Prüfung */

  function pruefen(eingabe) {
    const gast = !!eingabe.gastgewerbe;
    const land = eingabe.land || "";
    const personen = eingabe.personen || [];
    const feiertage = new Map();
    const befunde = [];

    // Schichten normalisieren
    const alle = (eingabe.schichten || [])
      .filter((s) => s.datum && s.von && s.bis)
      .map((s) => {
        const start = parseTs(s.datum, s.von);
        let ende = parseTs(s.datum, s.bis);
        if (ende <= start) ende += 86400000;                 // über Mitternacht
        const pause = Math.max(0, Number(s.pause) || 0);
        return {
          person: s.person, datum: s.datum, start, ende, pause,
          schicht: (ende - start) / MIN,                     // Schichtzeit inkl. Pause
          arbeit: (ende - start) / MIN - pause,              // Arbeitszeit ohne Pause
        };
      })
      .filter((s) => s.arbeit > 0)
      .sort((a, b) => a.start - b.start);

    for (const s of alle) {
      const j = new Date(s.start).getUTCFullYear();
      if (!feiertage.has(j)) feiertage.set(j, feiertageFuer(j, land, eingabe.feiertagsDaten));
    }
    const istFeiertag = (ts) => feiertage.get(new Date(ts).getUTCFullYear())?.get(iso(ts)) || null;

    for (const p of personen) {
      const s = alle.filter((x) => x.person === p.id);
      if (!s.length) continue;
      const melde = (schwere, regel, titel, text, knoten, datum) =>
        befunde.push({ person: p.id, personName: p.name, schwere, regel, titel, text, knoten, datum });

      const jugend = p.gruppe === "jugend16" || p.gruppe === "jugend15";
      if (jugend) pruefeJugend(p, s, melde, gast, istFeiertag);
      else pruefeErwachsen(p, s, melde, gast, istFeiertag);
    }

    befunde.sort((a, b) =>
      SCHWERE.indexOf(a.schwere) - SCHWERE.indexOf(b.schwere) ||
      String(a.datum || "").localeCompare(String(b.datum || "")));

    return { befunde, schichten: alle, grenzen: GRENZEN, kennzahlen: kennzahlen(alle, befunde) };
  }

  function kennzahlen(alle, befunde) {
    const zaehle = (w) => befunde.filter((b) => b.schwere === w).length;
    return {
      schichten: alle.length,
      stunden: alle.reduce((a, s) => a + s.arbeit, 0) / 60,
      unzulaessig: zaehle("unzulaessig"),
      pruefen: zaehle("pruefen"),
      hinweis: zaehle("hinweis"),
    };
  }

  /* -------------------------------------------------- Erwachsene (ArbZG) */

  function pruefeErwachsen(p, s, melde, gast, istFeiertag) {
    const K = "arbeitsrecht-arbeitszeit";
    const tage = arbeitstage(s);

    // § 3 — werktägliche Arbeitszeit
    for (const d of tage) {
      if (d.arbeit > 10 * H) {
        melde("unzulaessig", "§ 3 ArbZG", "Werktägliche Höchstarbeitszeit überschritten",
          `${datumLang(d.start)}: ${std(d.arbeit)} Arbeitszeit ohne Pausen. Zulässig sind höchstens 10 Stunden — auch mit Ausgleich.`, K, d.tag);
      } else if (d.arbeit > 8 * H) {
        melde("pruefen", "§ 3 ArbZG", "Über 8 Stunden — Ausgleich nötig",
          `${datumLang(d.start)}: ${std(d.arbeit)}. Zulässig, solange im Schnitt über 24 Wochen oder 6 Kalendermonate 8 Stunden werktäglich nicht überschritten werden. Dieser Ausgleich muss nachweisbar sein.`, K, d.tag);
      }
    }

    // § 4 — Ruhepausen, bezogen auf die Arbeitszeit des ganzen Tages
    for (const d of tage) {
      const soll = d.arbeit > 9 * H ? 45 : d.arbeit > 6 * H ? 30 : 0;
      if (soll && d.pause < soll) {
        melde("unzulaessig", "§ 4 ArbZG", "Ruhepause zu kurz",
          `${datumLang(d.start)}, ${uhr(d.start)}–${uhr(d.ende)}: ${std(d.arbeit)} Arbeitszeit, aber nur ${Math.round(d.pause)} Minuten Pause. Vorgeschrieben sind ${soll} Minuten.`, K, d.tag);
      }
      if (soll && d.pause >= soll && !d.geteilt && d.teile[0].pause > 0 && d.teile[0].pause < 15) {
        melde("pruefen", "§ 4 ArbZG", "Pause unter 15 Minuten zählt nicht",
          `${datumLang(d.start)}: Als Ruhepause gilt nur eine Unterbrechung von mindestens 15 Minuten.`, K, d.tag);
      }
    }

    // Geteilter Dienst — kein Verstoß, aber die Kennzahl, die im Dienstplan fehlt
    for (const d of tage.filter((x) => x.geteilt)) {
      melde("hinweis", "Geteilter Dienst", "Anwesenheitsspanne beachten",
        `${datumLang(d.start)}: ${d.teile.map((t) => `${uhr(t.start)}–${uhr(t.ende)}`).join(" und ")} — ${std(d.arbeit)} Arbeitszeit, aber ${std(d.schichtzeit)} vom Beginn bis zum Ende. Die Unterbrechung von ${std(d.luecken)} ist unbezahlte Zeit und zählt als Pause, nicht als Ruhezeit. Das ArbZG begrenzt die Spanne nicht — Tarifverträge und Betriebsvereinbarungen der Branche tun es oft.`, K, d.tag);
    }

    // § 5 — Ruhezeit zwischen zwei Arbeitstagen
    const verkuerzt = [];
    const lang = [];
    for (let i = 0; i < tage.length - 1; i++) {
      const ruhe = (tage[i + 1].start - tage[i].ende) / MIN;
      if (ruhe <= 0) {
        melde("unzulaessig", "§ 5 ArbZG", "Schichten überschneiden sich",
          `${datumLang(tage[i].start)} endet ${uhr(tage[i].ende)}, der nächste Dienst beginnt schon ${uhr(tage[i + 1].start)}.`, K, tage[i + 1].tag);
        continue;
      }
      if (ruhe >= 12 * H) lang.push(tage[i + 1]);
      const wann = `${datumLang(tage[i].start)} ${uhr(tage[i].ende)} bis ${datumLang(tage[i + 1].start)} ${uhr(tage[i + 1].start)}`;

      if (ruhe < 10 * H) {
        melde("unzulaessig", "§ 5 ArbZG", "Ruhezeit unter 10 Stunden",
          `${wann}: nur ${std(ruhe)}. Selbst die Gaststätten-Ausnahme des § 5 Abs. 2 lässt die Ruhezeit nur auf 10 Stunden sinken.`, K, tage[i + 1].tag);
      } else if (ruhe < 11 * H) {
        if (gast) {
          verkuerzt.push({ tag: tage[i + 1], ruhe });
          melde("pruefen", "§ 5 Abs. 2 ArbZG", "Verkürzte Ruhezeit — Ausgleich erforderlich",
            `${wann}: ${std(ruhe)}. Im Gastgewerbe zulässig, aber nur wenn diese Verkürzung innerhalb desselben Kalendermonats oder von vier Wochen durch eine andere Ruhezeit von mindestens 12 Stunden ausgeglichen wird.`, K, tage[i + 1].tag);
        } else {
          melde("unzulaessig", "§ 5 ArbZG", "Ruhezeit unter 11 Stunden",
            `${wann}: nur ${std(ruhe)}. Die Verkürzung auf 10 Stunden gilt nur für die in § 5 Abs. 2 genannten Bereiche — dieser Betrieb ist nicht als Gastgewerbe eingetragen.`, K, tage[i + 1].tag);
        }
      }
    }

    // Ausgleichsbilanz je Kalendermonat: jede Verkürzung braucht eine eigene 12-Stunden-Ruhezeit
    if (verkuerzt.length) {
      const monat = (ts) => iso(ts).slice(0, 7);
      const bedarf = new Map(), vorrat = new Map();
      verkuerzt.forEach((v) => bedarf.set(monat(v.tag.start), (bedarf.get(monat(v.tag.start)) || 0) + 1));
      lang.forEach((x) => vorrat.set(monat(x.start), (vorrat.get(monat(x.start)) || 0) + 1));
      for (const [m, n] of bedarf) {
        const da = vorrat.get(m) || 0;
        if (da < n) {
          melde("unzulaessig", "§ 5 Abs. 2 ArbZG", "Ausgleich fehlt im eingegebenen Zeitraum",
            `${m}: ${n} verkürzte Ruhezeit${n > 1 ? "en" : ""}, aber nur ${da} Ruhezeit${da === 1 ? "" : "en"} von mindestens 12 Stunden. Ohne diesen Ausgleich ist die Verkürzung nicht gedeckt — er kann auch außerhalb des eingegebenen Zeitraums liegen, muss dann aber belegt werden.`, K, null);
        }
      }
    }

    // § 6 — Nachtarbeit
    const naechte = s.filter((x) => nachtMinuten(x.start, x.ende) > 2 * H);
    if (naechte.length) {
      const zuLang = naechte.filter((x) => x.arbeit > 8 * H);
      melde("hinweis", "§ 6 ArbZG", `${naechte.length} Nachtschicht${naechte.length > 1 ? "en" : ""} erkannt`,
        `Schichten mit mehr als zwei Stunden zwischen 23 und 6 Uhr. Wer regelmäßig in Wechselschicht oder an mindestens 48 Tagen im Jahr so arbeitet, ist Nachtarbeitnehmer — mit Anspruch auf arbeitsmedizinische Untersuchung und auf Ausgleich durch freie Tage oder Zuschlag (§ 6 Abs. 3 und 5).`, K, null);
      for (const x of zuLang) {
        melde("pruefen", "§ 6 Abs. 2 ArbZG", "Nachtschicht über 8 Stunden",
          `${datumLang(x.start)}: ${std(x.arbeit)}. Für Nachtarbeitnehmer gilt der kürzere Ausgleichszeitraum von einem Kalendermonat oder vier Wochen — nicht die 24 Wochen aus § 3.`, K, x.datum);
      }
    }

    // §§ 9–11 — Sonn- und Feiertagsarbeit
    const sonntage = s.filter((x) => new Date(x.start).getUTCDay() === 0);
    const feiertagsSchichten = s.filter((x) => istFeiertag(x.start));
    if (!gast) {
      for (const x of [...sonntage, ...feiertagsSchichten]) {
        melde("unzulaessig", "§ 9 ArbZG", "Sonn- oder Feiertagsarbeit ohne erkennbare Ausnahme",
          `${datumLang(x.start)}${istFeiertag(x.start) ? ` (${istFeiertag(x.start)})` : ""}: An Sonn- und Feiertagen von 0 bis 24 Uhr darf nicht gearbeitet werden. Der Ausnahmekatalog des § 10 ist umfangreich; dieser Betrieb ist aber nicht als Gastgewerbe eingetragen.`, K, x.datum);
      }
    } else if (sonntage.length || feiertagsSchichten.length) {
      const frei = new Set(s.map((x) => iso(x.start)));
      const ersatzFehlt = [];
      for (const x of sonntage) {
        const bis = x.start + 14 * 86400000;
        let gefunden = false;
        for (let t = x.start + 86400000; t <= bis; t += 86400000) {
          if (!frei.has(iso(t))) { gefunden = true; break; }
        }
        const reichtDerZeitraum = (s[s.length - 1].ende) >= bis;
        if (!gefunden && reichtDerZeitraum) ersatzFehlt.push(x);
      }
      const teile = [];
      if (sonntage.length) teile.push(`${sonntage.length} Sonntagsschicht${sonntage.length === 1 ? "" : "en"}`);
      if (feiertagsSchichten.length) teile.push(`${feiertagsSchichten.length} Feiertagsschicht${feiertagsSchichten.length === 1 ? "" : "en"}`);
      melde("hinweis", "§ 10 Abs. 1 Nr. 4 ArbZG", "Sonn- und Feiertagsarbeit im Gastgewerbe zulässig",
        `${teile.join(" und ")}. Erlaubt, aber § 11 verlangt zusätzlich mindestens 15 beschäftigungsfreie Sonntage im Jahr und einen Ersatzruhetag — innerhalb von zwei Wochen für Sonntags-, innerhalb von acht Wochen für Feiertagsarbeit.`, K, null);
      for (const x of ersatzFehlt) {
        melde("pruefen", "§ 11 Abs. 3 ArbZG", "Ersatzruhetag nicht erkennbar",
          `Für die Sonntagsschicht am ${datumLang(x.start)} ist in den zwei Wochen danach kein freier Tag eingetragen.`, K, x.datum);
      }
    }

    // Wochenarbeitszeit
    const proWoche = new Map();
    for (const x of s) proWoche.set(isoWoche(x.start), (proWoche.get(isoWoche(x.start)) || 0) + x.arbeit);
    for (const [kw, min] of proWoche) {
      if (min > 60 * H) {
        melde("unzulaessig", "§ 3 ArbZG", "Wochenarbeitszeit über 60 Stunden",
          `${kw}: ${std(min)}. Mehr als 6 × 10 Stunden lassen sich auch mit Ausgleich nicht darstellen.`, null, null);
      } else if (min > 48 * H) {
        melde("pruefen", "§ 3 ArbZG", "Wochenarbeitszeit über 48 Stunden",
          `${kw}: ${std(min)}. Zulässig als Spitze, muss aber im Ausgleichszeitraum auf durchschnittlich 48 Stunden zurückgeführt werden.`, null, null);
      }
    }
  }

  /* ------------------------------------------------- Jugendliche (JArbSchG) */

  function pruefeJugend(p, s, melde, gast, istFeiertag) {
    const K = "arbeitsrecht-jugendarbeitsschutz";
    const ab16 = p.gruppe === "jugend16";
    const tage = arbeitstage(s);

    // § 8 — tägliche und wöchentliche Dauer
    for (const d of tage) {
      if (d.arbeit > 8.5 * H) {
        melde("unzulaessig", "§ 8 JArbSchG", "Tägliche Arbeitszeit überschritten",
          `${datumLang(d.start)}: ${std(d.arbeit)}. Für Jugendliche sind 8 Stunden die Grenze, 8,5 Stunden nur, wenn dafür an einem anderen Werktag derselben Woche verkürzt wird.`, K, d.tag);
      } else if (d.arbeit > 8 * H) {
        melde("pruefen", "§ 8 Abs. 2a JArbSchG", "Über 8 Stunden — Ausgleich in derselben Woche nötig",
          `${datumLang(d.start)}: ${std(d.arbeit)}. Zulässig bis 8,5 Stunden, aber nur wenn die Arbeitszeit an einem anderen Werktag derselben Woche entsprechend verkürzt wird.`, K, d.tag);
      }
    }
    const proWoche = new Map();
    for (const x of s) proWoche.set(isoWoche(x.start), (proWoche.get(isoWoche(x.start)) || 0) + x.arbeit);
    for (const [kw, min] of proWoche) {
      if (min > 40 * H) {
        melde("unzulaessig", "§ 8 JArbSchG", "Wochenarbeitszeit über 40 Stunden",
          `${kw}: ${std(min)}. Für Jugendliche ist bei 40 Stunden Schluss — ohne Ausgleichszeitraum.`, K, null);
      }
    }

    // § 11 — Ruhepausen, § 12 — Schichtzeit: beides je Arbeitstag
    for (const d of tage) {
      const soll = d.arbeit > 6 * H ? 60 : d.arbeit > 4.5 * H ? 30 : 0;
      if (soll && d.pause < soll) {
        melde("unzulaessig", "§ 11 JArbSchG", "Ruhepause zu kurz",
          `${datumLang(d.start)}, ${uhr(d.start)}–${uhr(d.ende)}: ${std(d.arbeit)} Arbeitszeit, aber nur ${Math.round(d.pause)} Minuten Pause. Für Jugendliche sind ${soll} Minuten vorgeschrieben — bei Erwachsenen wären es ${d.arbeit > 9 * H ? 45 : 30}.`, K, d.tag);
      }
      const laengsterBlock = Math.max(...d.teile.map((t) => (t.ende - t.start) / MIN - t.pause));
      if (laengsterBlock > 4.5 * H && d.teile.every((t) => t.pause === 0)) {
        melde("unzulaessig", "§ 11 Abs. 3 JArbSchG", "Über 4,5 Stunden ohne Pause",
          `${datumLang(d.start)}: ein Block von ${std(laengsterBlock)} ohne Unterbrechung. Jugendliche dürfen nicht länger als viereinhalb Stunden hintereinander ohne Ruhepause beschäftigt werden.`, K, d.tag);
      }

      const maxSchicht = gast ? 11 * H : 10 * H;
      if (d.schichtzeit > maxSchicht) {
        melde("unzulaessig", "§ 12 JArbSchG", "Schichtzeit überschritten",
          `${datumLang(d.start)}, ${uhr(d.start)}–${uhr(d.ende)}: ${std(d.schichtzeit)} vom Beginn bis zum Ende, Pausen und Unterbrechungen eingerechnet. Zulässig sind ${gast ? "11 Stunden im Gaststättengewerbe" : "10 Stunden"}.${d.geteilt ? " Bei geteiltem Dienst zählt die Unterbrechung mit — deshalb ist er mit Jugendlichen kaum darstellbar." : ""}`, K, d.tag);
      }
    }

    for (const x of s) {
      const beginn = tagesMinute(x.start);
      const wann = `${datumLang(x.start)}, ${uhr(x.start)}–${uhr(x.ende)}`;

      // § 14 — Nachtruhe
      const fruehestens = 6 * H;
      const spaetestens = ab16 && gast ? 22 * H : 20 * H;
      if (beginn < fruehestens) {
        melde("unzulaessig", "§ 14 JArbSchG", "Beginn vor 6 Uhr",
          `${wann}: Jugendliche dürfen nur zwischen 6 und ${spaetestens / H} Uhr beschäftigt werden.`, K, x.datum);
      }
      const endeAbsolut = (x.ende - Date.UTC(new Date(x.start).getUTCFullYear(), new Date(x.start).getUTCMonth(), new Date(x.start).getUTCDate())) / MIN;
      if (endeAbsolut > spaetestens) {
        melde("unzulaessig", "§ 14 JArbSchG", `Ende nach ${spaetestens / H} Uhr`,
          `${wann}: Ende um ${uhr(x.ende)}. ${ab16 && gast
            ? "Auch die Gaststätten-Ausnahme für über 16-Jährige reicht nur bis 22 Uhr."
            : ab16
              ? "Bis 22 Uhr wäre nur im Gaststätten- und Schaustellergewerbe zulässig — der Betrieb ist nicht als Gastgewerbe eingetragen."
              : "Die Ausnahme bis 22 Uhr im Gaststättengewerbe gilt erst ab 16 Jahren."}`, K, x.datum);
      }
      // § 18 — absolutes Beschäftigungsverbot an vier Tagen
      const fest = istFeiertag(x.start);
      const md = `${String(new Date(x.start).getUTCMonth() + 1).padStart(2, "0")}-${String(new Date(x.start).getUTCDate()).padStart(2, "0")}`;
      // Der erste Osterfeiertag wird direkt gerechnet: Er ist nur in Brandenburg
      // gesetzlicher Feiertag, das Beschäftigungsverbot des § 18 gilt aber
      // bundesweit. Der Umweg über die Länderliste würde ihn verlieren.
      const osterSonntag = iso(x.start) === iso(ostern(new Date(x.start).getUTCFullYear()));
      const absolut = ["12-25", "01-01", "05-01"].includes(md) || osterSonntag;
      if (absolut) {
        melde("unzulaessig", "§ 18 JArbSchG", "Absolutes Beschäftigungsverbot",
          `${datumLang(x.start)} (${fest || (osterSonntag ? "erster Osterfeiertag" : "")}): Am 25. Dezember, 1. Januar, ersten Osterfeiertag und 1. Mai dürfen Jugendliche nicht beschäftigt werden — auch nicht im Gastgewerbe. Für diesen Tag gibt es keine Ausnahme.`, K, x.datum);
      } else if (fest) {
        melde(gast ? "hinweis" : "unzulaessig", "§ 18 JArbSchG", "Feiertagsarbeit",
          `${datumLang(x.start)} (${fest}): ${gast
            ? "Im Gaststättengewerbe zulässig; der Jugendliche ist dafür an einem anderen berufsschulfreien Arbeitstag freizustellen."
            : "An gesetzlichen Feiertagen dürfen Jugendliche nicht beschäftigt werden."}`, K, x.datum);
      }
      if (md === "12-24" || md === "12-31") {
        if (endeAbsolut > 14 * H) {
          melde("unzulaessig", "§ 18 JArbSchG", "Beschäftigung nach 14 Uhr an Heiligabend oder Silvester",
            `${datumLang(x.start)}: Ende um ${uhr(x.ende)}. Am 24. und 31. Dezember dürfen Jugendliche nach 14 Uhr nicht beschäftigt werden.`, K, x.datum);
        }
      }
    }

    // § 13 — Freizeit von 12 Stunden zwischen zwei Arbeitstagen
    for (let i = 0; i < tage.length - 1; i++) {
      const frei = (tage[i + 1].start - tage[i].ende) / MIN;
      if (frei > 0 && frei < 12 * H) {
        melde("unzulaessig", "§ 13 JArbSchG", "Freizeit unter 12 Stunden",
          `${datumLang(tage[i].start)} ${uhr(tage[i].ende)} bis ${datumLang(tage[i + 1].start)} ${uhr(tage[i + 1].start)}: nur ${std(frei)}. Für Jugendliche sind 12 Stunden ununterbrochene Freizeit vorgeschrieben — eine Stunde mehr als für Erwachsene, und ohne Verkürzungsmöglichkeit.`, K, tage[i + 1].tag);
      }
    }

    // § 15 — Fünf-Tage-Woche
    const tageProWoche = new Map();
    for (const d of tage) {
      const kw = isoWoche(d.start);
      if (!tageProWoche.has(kw)) tageProWoche.set(kw, new Set());
      tageProWoche.get(kw).add(d.tag);
    }
    for (const [kw, menge] of tageProWoche) {
      if (menge.size > 5) {
        melde("unzulaessig", "§ 15 JArbSchG", "Mehr als fünf Arbeitstage in der Woche",
          `${kw}: ${menge.size} Arbeitstage. Jugendliche dürfen nur an fünf Tagen in der Woche beschäftigt werden; die beiden Ruhetage sollen aufeinanderfolgen.`, K, null);
      }
    }

    // §§ 16, 17 — Samstags- und Sonntagsruhe
    const proMonat = { sa: new Map(), so: new Map() };
    for (const x of s) {
      const tag = new Date(x.start).getUTCDay();
      const m = iso(x.start).slice(0, 7);
      if (tag === 6) proMonat.sa.set(m, (proMonat.sa.get(m) || 0) + 1);
      if (tag === 0) proMonat.so.set(m, (proMonat.so.get(m) || 0) + 1);
    }
    const samstage = [...proMonat.sa.values()].reduce((a, b) => a + b, 0);
    const sonntage = [...proMonat.so.values()].reduce((a, b) => a + b, 0);

    if (samstage && !gast) {
      melde("unzulaessig", "§ 16 JArbSchG", "Samstagsarbeit ohne erkennbare Ausnahme",
        `${samstage} Samstagsschicht${samstage > 1 ? "en" : ""}. An Samstagen dürfen Jugendliche grundsätzlich nicht beschäftigt werden; das Gaststättengewerbe ist eine der Ausnahmen, dieser Betrieb ist aber nicht so eingetragen.`, K, null);
    } else if (samstage) {
      melde("hinweis", "§ 16 Abs. 3 JArbSchG", "Zwei Samstage im Monat müssen frei bleiben",
        `${samstage} Samstagsschicht${samstage > 1 ? "en" : ""} im Gaststättengewerbe — zulässig, aber mindestens zwei Samstage je Monat müssen beschäftigungsfrei bleiben. Wird der Monat nicht vollständig eingegeben, lässt sich das hier nicht nachrechnen.`, K, null);
    }
    if (sonntage && !gast) {
      melde("unzulaessig", "§ 17 JArbSchG", "Sonntagsarbeit ohne erkennbare Ausnahme",
        `${sonntage} Sonntagsschicht${sonntage > 1 ? "en" : ""}. An Sonntagen dürfen Jugendliche grundsätzlich nicht beschäftigt werden.`, K, null);
    } else if (sonntage) {
      melde("hinweis", "§ 17 Abs. 2 JArbSchG", "Jeder zweite Sonntag soll frei bleiben",
        `${sonntage} Sonntagsschicht${sonntage > 1 ? "en" : ""} im Gaststättengewerbe — zulässig, aber mindestens zwei Sonntage je Monat müssen frei bleiben, und der folgende Werktag ist freizustellen (§ 17 Abs. 3).`, K, null);
    }
  }

  /* -------------------------------------------------------------- Export */

  window.DIENSTPLAN = {
    pruefen, feiertageFuer, ostern,
    GRUPPEN, GRENZEN, SCHWERE,
    hilfen: { iso, uhr, std, isoWoche, datumLang, parseTs, nachtMinuten },
  };
})();
