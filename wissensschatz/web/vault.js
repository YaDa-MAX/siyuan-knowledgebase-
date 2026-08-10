/* =====================================================================
   vault.js — verschlüsselter Tresor für Zugangsdaten und
              Wiederherstellungscodes

   Sicherheitsmodell (bewusst ausgeschrieben, damit nachprüfbar ist,
   was der Tresor leistet und was nicht):

   • Verschlüsselung  AES-256-GCM (authentifiziert: Manipulation am
                      Geheimtext führt zum Entschlüsselungsfehler,
                      nicht zu falschem Klartext).
   • Schlüssel        PBKDF2-HMAC-SHA-256, 600.000 Iterationen, über
                      die Verkettung aus Passphrase UND dem Geheimnis
                      einer externen Schlüsseldatei.
   • Zwei Faktoren    Beide Teile gehen in die Schlüsselableitung ein.
                      Wissen allein oder Datei allein genügt nicht —
                      das ist echte Zwei-Faktor-Verschlüsselung, keine
                      nachgelagerte Abfrage.
   • Externe Prüfung  Zusätzlich ein TOTP-Gate (RFC 6238): Nach dem
                      Entschlüsseln müssen die Geheimnisse mit einem
                      Code aus einer Authenticator-App auf einem
                      anderen Gerät freigeschaltet werden. Das ist
                      ausdrücklich eine Zugriffssperre, keine weitere
                      Verschlüsselungsebene.
   • Nie im Klartext  Weder Passphrase noch entschlüsselte Werte
                      verlassen den Browser oder werden gespeichert.
                      Automatische Sperre nach Inaktivität, Zwischen-
                      ablage wird nach 30 Sekunden geleert.

   Grenzen, offen benannt: Ein kompromittiertes Endgerät (Tastatur-
   mitschnitt, Schadsoftware im Browser) hebelt jedes dieser Mittel
   aus. Der Tresor schützt gespeicherte Daten, nicht ein befallenes
   System.
   ===================================================================== */
(function () {
  "use strict";

  const ITERATIONEN = 600000;
  const SPERRE_MS = 5 * 60 * 1000;
  const ZWISCHENABLAGE_MS = 30000;
  const SPEICHER = "wissensschatz.tresor";

  /* ------------------------------------------------------- Hilfsmittel */

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const b64 = {
    ein: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))),
    aus: (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
  };

  const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

  function zufall(n) {
    return crypto.getRandomValues(new Uint8Array(n));
  }

  /** Vergleich in konstanter Zeit — verhindert Zeitmessangriffe auf Codes. */
  function gleichKonstant(a, b) {
    if (a.length !== b.length) return false;
    let d = 0;
    for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return d === 0;
  }

  /* -------------------------------------------------------- Base32 */

  const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  function base32Ein(bytes) {
    let bits = 0, wert = 0, aus = "";
    for (const b of bytes) {
      wert = (wert << 8) | b;
      bits += 8;
      while (bits >= 5) { aus += B32[(wert >>> (bits - 5)) & 31]; bits -= 5; }
    }
    if (bits > 0) aus += B32[(wert << (5 - bits)) & 31];
    return aus;
  }

  function base32Aus(s) {
    let bits = 0, wert = 0;
    const aus = [];
    for (const z of s.toUpperCase().replace(/[^A-Z2-7]/g, "")) {
      wert = (wert << 5) | B32.indexOf(z);
      bits += 5;
      if (bits >= 8) { aus.push((wert >>> (bits - 8)) & 255); bits -= 8; }
    }
    return new Uint8Array(aus);
  }

  /* ---------------------------------------------------------- Krypto */

  async function schluesselAbleiten(passphrase, dateiGeheimnis, salt) {
    // Beide Faktoren fließen in dasselbe Ausgangsmaterial ein.
    const material = new Uint8Array(enc.encode(passphrase).length + dateiGeheimnis.length);
    material.set(enc.encode(passphrase), 0);
    material.set(dateiGeheimnis, enc.encode(passphrase).length);

    const basis = await crypto.subtle.importKey("raw", material, "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: ITERATIONEN, hash: "SHA-256" },
      basis,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function verschluesseln(objekt, schluessel) {
    const iv = zufall(12);
    const chiffre = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, schluessel, enc.encode(JSON.stringify(objekt))
    );
    return { iv: b64.ein(iv), data: b64.ein(chiffre) };
  }

  async function entschluesseln(iv, data, schluessel) {
    const klar = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64.aus(iv) }, schluessel, b64.aus(data)
    );
    return JSON.parse(dec.decode(klar));
  }

  /* ------------------------------------------------------------ TOTP */

  async function totp(secretB32, zeitpunkt = Date.now(), schritt = 30, stellen = 6) {
    const zaehler = Math.floor(zeitpunkt / 1000 / schritt);
    const puffer = new ArrayBuffer(8);
    const sicht = new DataView(puffer);
    sicht.setUint32(0, Math.floor(zaehler / 2 ** 32));
    sicht.setUint32(4, zaehler >>> 0);

    const key = await crypto.subtle.importKey(
      "raw", base32Aus(secretB32), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
    );
    const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, puffer));
    const versatz = sig[sig.length - 1] & 0x0f;
    const bin =
      ((sig[versatz] & 0x7f) << 24) | (sig[versatz + 1] << 16) |
      (sig[versatz + 2] << 8) | sig[versatz + 3];
    return String(bin % 10 ** stellen).padStart(stellen, "0");
  }

  /** Prüft mit einem Fenster von ±1 Schritt gegen Uhrabweichungen. */
  async function totpPruefen(secretB32, code) {
    const c = String(code).replace(/\D/g, "");
    if (c.length !== 6) return false;
    for (const versatz of [0, -30000, 30000]) {
      if (gleichKonstant(await totp(secretB32, Date.now() + versatz), c)) return true;
    }
    return false;
  }

  /* ------------------------------------------------------- Zustand */

  const Z = {
    schluessel: null,
    daten: null,
    huelle: null,
    dateiGeheimnis: null,
    freigeschaltet: false,   // TOTP-Gate passiert
    sperrUhr: null,
    behaelter: null,
  };

  function huelleLaden() {
    try {
      const roh = localStorage.getItem(SPEICHER);
      return roh ? JSON.parse(roh) : null;
    } catch { return null; }
  }

  function huelleSpeichern(h) {
    localStorage.setItem(SPEICHER, JSON.stringify(h));
  }

  function sperrUhrStellen() {
    clearTimeout(Z.sperrUhr);
    Z.sperrUhr = setTimeout(sperren, SPERRE_MS);
  }

  function sperren() {
    Z.schluessel = null;
    Z.daten = null;
    Z.dateiGeheimnis = null;
    Z.freigeschaltet = false;
    clearTimeout(Z.sperrUhr);
    if (Z.behaelter) zeichnen(Z.behaelter);
  }

  function melden(text) {
    const el = document.createElement("div");
    el.className = "meldung";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  async function kopieren(wert) {
    try {
      await navigator.clipboard.writeText(wert);
      melden("Kopiert — wird in 30 Sekunden aus der Zwischenablage entfernt");
      setTimeout(() => navigator.clipboard.writeText("").catch(() => {}), ZWISCHENABLAGE_MS);
    } catch {
      melden("Zwischenablage nicht verfügbar — Wert von Hand übertragen");
    }
  }

  function herunterladen(name, inhalt, typ = "application/json") {
    const blob = new Blob([inhalt], { type: typ });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  /* --------------------------------------------------- Schlüsseldatei */

  function schluesseldateiErzeugen() {
    const geheim = zufall(32);
    const datei = {
      format: "wissensschatz-schluesseldatei",
      version: 1,
      id: hex(geheim.slice(0, 4)),
      secret: b64.ein(geheim),
      erstellt: new Date().toISOString(),
      hinweis: "Zweiter Faktor des Tresors. Ohne diese Datei ist der Tresor auch mit richtiger Passphrase nicht zu öffnen. Getrennt vom Archiv aufbewahren.",
    };
    return { datei, geheim };
  }

  async function schluesseldateiLesen(datei) {
    const text = await datei.text();
    const j = JSON.parse(text);
    if (j.format !== "wissensschatz-schluesseldatei") throw new Error("Keine gültige Schlüsseldatei.");
    return { id: j.id, geheim: b64.aus(j.secret) };
  }

  /* ------------------------------------------------------- Oberfläche */

  function zeichnen(behaelter) {
    Z.behaelter = behaelter;
    behaelter.innerHTML = "";
    const huelle = huelleLaden();

    if (!huelle) return zeichnenEinrichtung(behaelter);
    if (!Z.schluessel) return zeichnenSchloss(behaelter, huelle);
    if (Z.daten.totpSecret && !Z.freigeschaltet) return zeichnenTotpGate(behaelter);
    return zeichnenInhalt(behaelter);
  }

  /* --- Einrichtung ---------------------------------------------------- */

  function zeichnenEinrichtung(b) {
    const w = document.createElement("div");
    w.className = "tresor-schloss";
    w.innerHTML = `
      <div class="karte">
        <h2 style="margin-top:0">Tresor einrichten</h2>
        <p class="klein gedaempft">Für Passwörter, Wiederherstellungscodes und alles, was
        niemals in einer Tabelle stehen sollte. Zwei Faktoren sind zwingend: eine Passphrase,
        die Sie sich merken, und eine Schlüsseldatei, die Sie <strong>getrennt vom Archiv</strong>
        aufbewahren.</p>

        <div class="hinweisbox">
          <strong>Schritt 1 — Schlüsseldatei erzeugen.</strong> Sie enthält 256 zufällige Bit
          und geht gleichberechtigt in die Verschlüsselung ein. Auf einen USB-Stick, in ein
          Bankschließfach oder in einen anderen Haushalt. Nicht in denselben Ordner wie das Archiv.
        </div>
        <button class="knopf haupt" id="t-datei-neu">Schlüsseldatei erzeugen und herunterladen</button>
        <div id="t-datei-status" class="klein gedaempft" style="margin:10px 0 22px"></div>

        <div id="t-rest" style="display:none">
          <label class="feld"><span>Schritt 2 — Passphrase (mindestens 12 Zeichen, besser ein Satz)</span>
            <input type="password" id="t-pass1" autocomplete="new-password"></label>
          <label class="feld"><span>Passphrase wiederholen</span>
            <input type="password" id="t-pass2" autocomplete="new-password"></label>
          <div id="t-staerke" class="klein gedaempft" style="margin:-6px 0 16px"></div>

          <label class="feld"><span>Schritt 3 — Schlüsseldatei wieder einlesen (zur Bestätigung)</span>
            <input type="file" id="t-datei-lesen" accept=".json"></label>

          <label class="feld"><span>Schritt 4 — Zusätzliche externe Prüfung (empfohlen)</span></label>
          <div class="klein gedaempft" style="margin:-8px 0 10px">
            Ein Einmalcode aus einer Authenticator-App auf einem <em>anderen</em> Gerät
            schaltet die Geheimnisse nach dem Entschlüsseln frei.
          </div>
          <button class="knopf klein" id="t-totp-neu" type="button">TOTP einrichten</button>
          <div id="t-totp-block" style="display:none;margin-top:12px"></div>

          <hr style="margin:22px 0;border:0;border-top:1px solid var(--line)">
          <div class="warnbox">
            <strong>Ohne Wiederherstellung.</strong> Es gibt keine Hintertür, keinen
            Zurücksetzen-Link und keine Stelle, die helfen kann. Passphrase vergessen oder
            Schlüsseldatei verloren heißt: Der Inhalt ist unwiederbringlich verloren.
            Erzeugen Sie deshalb im Anschluss das Notfallkit und legen Sie es auf Papier ab.
          </div>
          <button class="knopf haupt" id="t-anlegen">Tresor anlegen</button>
        </div>

        <hr style="margin:24px 0;border:0;border-top:1px solid var(--line)">
        <label class="feld"><span>Oder: vorhandenen Tresor aus einer Sicherung einlesen</span>
          <input type="file" id="t-import" accept=".json"></label>
      </div>`;
    b.appendChild(w);

    let neueDatei = null, totpSecret = null;

    w.querySelector("#t-datei-neu").addEventListener("click", () => {
      const { datei, geheim } = schluesseldateiErzeugen();
      neueDatei = { id: datei.id, geheim };
      herunterladen(`wissensschatz-schluessel-${datei.id}.json`, JSON.stringify(datei, null, 2));
      w.querySelector("#t-datei-status").innerHTML =
        `Schlüsseldatei <span class="mono">${esc(datei.id)}</span> erzeugt und heruntergeladen. Jetzt an einen sicheren, vom Archiv getrennten Ort legen.`;
      w.querySelector("#t-rest").style.display = "";
    });

    w.querySelector("#t-pass1").addEventListener("input", (e) => {
      const p = e.target.value;
      const stufe = p.length >= 20 ? "gut" : p.length >= 12 ? "brauchbar" : "zu kurz";
      w.querySelector("#t-staerke").textContent = `${p.length} Zeichen — ${stufe}. Eine Folge aus vier bis fünf zufälligen Wörtern ist leichter zu merken und stärker als ein kurzes kompliziertes Passwort.`;
    });

    w.querySelector("#t-totp-neu").addEventListener("click", async () => {
      totpSecret = base32Ein(zufall(20));
      const url = `otpauth://totp/Wissensschatz:Tresor?secret=${totpSecret}&issuer=Wissensschatz&algorithm=SHA1&digits=6&period=30`;
      const block = w.querySelector("#t-totp-block");
      block.style.display = "";
      block.innerHTML = `
        <div class="hinweisbox">
          In der Authenticator-App „Konto manuell hinzufügen“ wählen und diesen Schlüssel eintragen:
          <div class="geheim"><span class="wert">${esc(totpSecret.replace(/(.{4})/g, "$1 ").trim())}</span></div>
          <div class="klein" style="margin-top:8px">Zeitbasiert · SHA-1 · 6 Stellen · 30 Sekunden</div>
          <div class="klein mono" style="margin-top:8px;word-break:break-all;opacity:.7">${esc(url)}</div>
        </div>
        <label class="feld"><span>Zur Kontrolle den aktuell angezeigten Code eingeben</span>
          <input type="text" id="t-totp-test" inputmode="numeric" maxlength="6" placeholder="000000"></label>
        <div id="t-totp-status" class="klein"></div>`;
      block.querySelector("#t-totp-test").addEventListener("input", async (e) => {
        const st = block.querySelector("#t-totp-status");
        if (e.target.value.length === 6) {
          const ok = await totpPruefen(totpSecret, e.target.value);
          st.textContent = ok ? "✓ Code stimmt — die App ist richtig eingerichtet." : "✗ Code stimmt nicht. Uhrzeit des Geräts prüfen.";
          st.style.color = ok ? "var(--ok)" : "var(--alarm)";
        } else st.textContent = "";
      });
    });

    w.querySelector("#t-datei-lesen").addEventListener("change", async (e) => {
      if (!e.target.files[0]) return;
      try {
        const gelesen = await schluesseldateiLesen(e.target.files[0]);
        if (!neueDatei || gelesen.id !== neueDatei.id) {
          melden("Diese Schlüsseldatei gehört nicht zur eben erzeugten.");
          e.target.value = "";
          return;
        }
        melden("Schlüsseldatei bestätigt.");
      } catch (err) {
        melden(err.message);
        e.target.value = "";
      }
    });

    w.querySelector("#t-anlegen").addEventListener("click", async () => {
      const p1 = w.querySelector("#t-pass1").value;
      const p2 = w.querySelector("#t-pass2").value;
      if (p1.length < 12) return melden("Passphrase zu kurz — mindestens 12 Zeichen.");
      if (p1 !== p2) return melden("Die Passphrasen stimmen nicht überein.");
      if (!neueDatei) return melden("Zuerst eine Schlüsseldatei erzeugen.");
      if (!w.querySelector("#t-datei-lesen").files[0]) return melden("Schlüsseldatei zur Bestätigung einlesen.");

      const knopf = w.querySelector("#t-anlegen");
      knopf.disabled = true;
      knopf.textContent = "Schlüssel wird abgeleitet …";
      await new Promise((r) => setTimeout(r, 30));

      const salt = zufall(16);
      const schluessel = await schluesselAbleiten(p1, neueDatei.geheim, salt);
      const daten = { totpSecret, entries: [], erstellt: new Date().toISOString() };
      const { iv, data } = await verschluesseln(daten, schluessel);

      huelleSpeichern({
        format: "wissensschatz-tresor", version: 1,
        kdf: { name: "PBKDF2", hash: "SHA-256", iterations: ITERATIONEN, salt: b64.ein(salt) },
        cipher: "AES-GCM", iv, data,
        keyfileId: neueDatei.id,
        erstellt: new Date().toISOString(), geaendert: new Date().toISOString(),
      });

      Z.schluessel = schluessel;
      Z.daten = daten;
      Z.dateiGeheimnis = neueDatei.geheim;
      Z.freigeschaltet = true;
      sperrUhrStellen();
      melden("Tresor angelegt.");
      zeichnen(b);
    });

    w.querySelector("#t-import").addEventListener("change", async (e) => {
      if (!e.target.files[0]) return;
      try {
        const j = JSON.parse(await e.target.files[0].text());
        if (j.format !== "wissensschatz-tresor") throw new Error("Keine Tresordatei.");
        huelleSpeichern(j);
        melden("Tresor eingelesen. Jetzt entsperren.");
        zeichnen(b);
      } catch (err) { melden(err.message); }
    });
  }

  /* --- Schloss -------------------------------------------------------- */

  function zeichnenSchloss(b, huelle) {
    const w = document.createElement("div");
    w.className = "tresor-schloss";
    w.innerHTML = `
      <div class="karte">
        <h2 style="margin-top:0">Tresor entsperren</h2>
        <p class="klein gedaempft">Erwartete Schlüsseldatei:
          <span class="mono">${esc(huelle.keyfileId)}</span> · zuletzt geändert
          ${esc((huelle.geaendert || "").slice(0, 10))}</p>
        <label class="feld"><span>Schlüsseldatei (zweiter Faktor)</span>
          <input type="file" id="t-datei" accept=".json"></label>
        <label class="feld"><span>Passphrase</span>
          <input type="password" id="t-pass" autocomplete="current-password"></label>
        <button class="knopf haupt" id="t-auf" style="width:100%">Entsperren</button>
        <div id="t-fehler" class="klein" style="color:var(--alarm);margin-top:10px"></div>
        <hr style="margin:22px 0;border:0;border-top:1px solid var(--line)">
        <details>
          <summary class="klein gedaempft" style="cursor:pointer">Wiederherstellung und Sicherung</summary>
          <div class="klein gedaempft" style="margin-top:10px">
            Die verschlüsselte Datei lässt sich gefahrlos sichern — ohne Passphrase
            <em>und</em> Schlüsseldatei ist sie nicht zu öffnen.
          </div>
          <button class="knopf klein" id="t-export" style="margin-top:10px">Verschlüsselte Sicherung herunterladen</button>
        </details>
      </div>`;
    b.appendChild(w);

    const auf = async () => {
      const fehler = w.querySelector("#t-fehler");
      const dateiEl = w.querySelector("#t-datei");
      if (!dateiEl.files[0]) return (fehler.textContent = "Schlüsseldatei fehlt.");
      const pass = w.querySelector("#t-pass").value;
      if (!pass) return (fehler.textContent = "Passphrase fehlt.");

      const knopf = w.querySelector("#t-auf");
      knopf.disabled = true;
      knopf.textContent = "Schlüssel wird abgeleitet …";
      fehler.textContent = "";
      await new Promise((r) => setTimeout(r, 30));

      try {
        const { id, geheim } = await schluesseldateiLesen(dateiEl.files[0]);
        if (id !== huelle.keyfileId) throw new Error("Diese Schlüsseldatei gehört nicht zu diesem Tresor.");
        const schluessel = await schluesselAbleiten(pass, geheim, b64.aus(huelle.kdf.salt));
        Z.daten = await entschluesseln(huelle.iv, huelle.data, schluessel);
        Z.schluessel = schluessel;
        Z.dateiGeheimnis = geheim;
        Z.huelle = huelle;
        Z.freigeschaltet = !Z.daten.totpSecret;
        sperrUhrStellen();
        zeichnen(b);
      } catch (err) {
        knopf.disabled = false;
        knopf.textContent = "Entsperren";
        fehler.textContent = /gehört nicht/.test(err.message)
          ? err.message
          : "Entschlüsselung fehlgeschlagen. Passphrase oder Schlüsseldatei stimmt nicht.";
      }
    };

    w.querySelector("#t-auf").addEventListener("click", auf);
    w.querySelector("#t-pass").addEventListener("keydown", (e) => { if (e.key === "Enter") auf(); });
    w.querySelector("#t-export").addEventListener("click", () =>
      herunterladen(`wissensschatz-tresor-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(huelle, null, 2)));
  }

  /* --- TOTP-Gate ------------------------------------------------------ */

  function zeichnenTotpGate(b) {
    const w = document.createElement("div");
    w.className = "tresor-schloss";
    w.innerHTML = `
      <div class="karte">
        <h2 style="margin-top:0">Externe Bestätigung</h2>
        <p class="klein gedaempft">Der Tresor ist entschlüsselt. Zum Anzeigen der Geheimnisse
          wird der aktuelle Einmalcode aus Ihrer Authenticator-App benötigt.</p>
        <label class="feld"><span>Sechsstelliger Code</span>
          <input type="text" id="t-code" inputmode="numeric" maxlength="6" placeholder="000000"
                 autocomplete="one-time-code" style="font-size:1.4rem;letter-spacing:.35em;text-align:center"></label>
        <div id="t-code-fehler" class="klein" style="color:var(--alarm)"></div>
        <button class="knopf" id="t-sperren" style="margin-top:12px">Abbrechen und sperren</button>
      </div>`;
    b.appendChild(w);

    const feld = w.querySelector("#t-code");
    feld.focus();
    feld.addEventListener("input", async (e) => {
      if (e.target.value.length !== 6) return;
      if (await totpPruefen(Z.daten.totpSecret, e.target.value)) {
        Z.freigeschaltet = true;
        sperrUhrStellen();
        zeichnen(b);
      } else {
        w.querySelector("#t-code-fehler").textContent = "Code stimmt nicht. Uhrzeit des Geräts prüfen.";
        e.target.value = "";
      }
    });
    w.querySelector("#t-sperren").addEventListener("click", sperren);
  }

  /* --- Inhalt --------------------------------------------------------- */

  function zeichnenInhalt(b) {
    const eintraege = Z.daten.entries || [];
    const w = document.createElement("div");

    w.innerHTML = `
      <div class="werkzeugleiste">
        <button class="knopf haupt" id="t-neu">Eintrag hinzufügen</button>
        <button class="knopf" id="t-sichern">Verschlüsselte Sicherung</button>
        <button class="knopf" id="t-notfall">Notfallkit drucken</button>
        <button class="knopf" id="t-zu" style="margin-left:auto">Sperren</button>
      </div>
      <div class="hinweisbox">
        ${eintraege.length} Einträge · verschlüsselt mit AES-256-GCM ·
        Schlüssel aus Passphrase <strong>und</strong> Schlüsseldatei ·
        automatische Sperre nach 5 Minuten ohne Aktivität.
      </div>
      <div id="t-liste"></div>`;
    b.appendChild(w);

    const liste = w.querySelector("#t-liste");
    if (!eintraege.length) {
      liste.innerHTML = `<div class="leer"><div class="gross">🔒</div>Noch keine Einträge.<br>
        Hier gehören Zugangsdaten und Wiederherstellungscodes hin — nicht in eine Tabelle.</div>`;
    }

    eintraege.forEach((e, i) => {
      const k = document.createElement("div");
      k.className = "tresor-eintrag";
      k.innerHTML = `
        <div class="kopf">
          <span class="titel">${esc(e.title)}</span>
          ${e.username ? `<span class="klein gedaempft">${esc(e.username)}</span>` : ""}
          <span class="kat">${esc(e.category || "—")}</span>
        </div>
        ${e.url ? `<div class="klein gedaempft mono" style="margin-top:4px">${esc(e.url)}</div>` : ""}
        <div class="geheim verborgen" data-i="${i}">
          <span class="wert">••••••••••••••••</span>
          <button class="knopf klein t-zeigen">Anzeigen</button>
          <button class="knopf klein t-kopieren">Kopieren</button>
        </div>
        ${(e.recovery && e.recovery.length)
          ? `<details style="margin-top:8px"><summary class="klein gedaempft" style="cursor:pointer">
               ${e.recovery.length} Wiederherstellungscodes</summary>
             <div class="geheim" style="margin-top:6px"><span class="wert mono">${esc(e.recovery.join("  "))}</span></div>
             </details>` : ""}
        ${e.notes ? `<div class="klein gedaempft" style="margin-top:8px">${esc(e.notes)}</div>` : ""}
        <div class="klein gedaempft" style="margin-top:8px;display:flex;gap:10px;align-items:center">
          <span>zuletzt geändert ${esc((e.updated || "").slice(0, 10))}</span>
          <button class="knopf klein t-loeschen" style="margin-left:auto">Löschen</button>
        </div>`;
      liste.appendChild(k);

      const geheimEl = k.querySelector(".geheim[data-i]");
      k.querySelector(".t-zeigen").addEventListener("click", (ev) => {
        const offen = !geheimEl.classList.contains("verborgen");
        geheimEl.classList.toggle("verborgen");
        geheimEl.querySelector(".wert").textContent = offen ? "••••••••••••••••" : e.secret;
        ev.target.textContent = offen ? "Anzeigen" : "Verbergen";
        sperrUhrStellen();
        if (!offen) setTimeout(() => {
          geheimEl.classList.add("verborgen");
          geheimEl.querySelector(".wert").textContent = "••••••••••••••••";
          ev.target.textContent = "Anzeigen";
        }, 30000);
      });
      k.querySelector(".t-kopieren").addEventListener("click", () => { kopieren(e.secret); sperrUhrStellen(); });
      k.querySelector(".t-loeschen").addEventListener("click", async () => {
        if (!confirm(`Eintrag „${e.title}" endgültig löschen?`)) return;
        Z.daten.entries.splice(i, 1);
        await sichern();
        zeichnen(b);
      });
    });

    w.querySelector("#t-zu").addEventListener("click", sperren);
    w.querySelector("#t-neu").addEventListener("click", () => zeichnenFormular(b));
    w.querySelector("#t-sichern").addEventListener("click", () =>
      herunterladen(`wissensschatz-tresor-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(huelleLaden(), null, 2)));
    w.querySelector("#t-notfall").addEventListener("click", notfallkit);

    ["click", "keydown"].forEach((ev) => w.addEventListener(ev, sperrUhrStellen));
  }

  /* --- Formular ------------------------------------------------------- */

  function zeichnenFormular(b) {
    b.innerHTML = "";
    const w = document.createElement("div");
    w.className = "tresor-schloss";
    w.innerHTML = `
      <div class="karte">
        <h2 style="margin-top:0">Neuer Eintrag</h2>
        <label class="feld"><span>Bezeichnung</span><input type="text" id="f-titel"></label>
        <label class="feld"><span>Kategorie</span>
          <select id="f-kat">
            <option>Konto</option><option>Bank</option><option>Behörde</option>
            <option>Betrieb</option><option>Gerät</option><option>Lizenz</option>
            <option>Versicherung</option><option>Sonstiges</option>
          </select></label>
        <label class="feld"><span>Benutzername (optional)</span><input type="text" id="f-user" autocomplete="off"></label>
        <label class="feld"><span>Adresse / URL (optional)</span><input type="text" id="f-url" autocomplete="off"></label>
        <label class="feld"><span>Passwort oder Geheimnis</span>
          <input type="text" id="f-secret" autocomplete="off" class="mono"></label>
        <button class="knopf klein" id="f-wuerfeln" type="button">Sicheres Passwort erzeugen</button>
        <label class="feld" style="margin-top:16px"><span>Wiederherstellungscodes (einer je Zeile)</span>
          <textarea id="f-recovery" rows="4" class="mono"></textarea></label>
        <label class="feld"><span>Notizen (kein Geheimnis hier hinein)</span>
          <textarea id="f-notes" rows="2"></textarea></label>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="knopf haupt" id="f-speichern">Speichern</button>
          <button class="knopf" id="f-abbruch">Abbrechen</button>
        </div>
      </div>`;
    b.appendChild(w);

    w.querySelector("#f-wuerfeln").addEventListener("click", () => {
      // Verwerfungsmethode: Bytes oberhalb des größten Vielfachen der
      // Alphabetlänge werden verworfen, damit jedes Zeichen exakt gleich
      // wahrscheinlich ist. Ohne das wären die ersten Zeichen des
      // Alphabets minimal häufiger.
      const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*-_=+?";
      const grenze = 256 - (256 % alphabet.length);
      const laenge = 24;
      let p = "";
      while (p.length < laenge) {
        for (const byte of zufall(laenge)) {
          if (byte < grenze && p.length < laenge) p += alphabet[byte % alphabet.length];
        }
      }
      w.querySelector("#f-secret").value = p;
    });

    w.querySelector("#f-abbruch").addEventListener("click", () => zeichnen(b));
    w.querySelector("#f-speichern").addEventListener("click", async () => {
      const titel = w.querySelector("#f-titel").value.trim();
      const secret = w.querySelector("#f-secret").value;
      if (!titel || !secret) return melden("Bezeichnung und Geheimnis sind nötig.");
      Z.daten.entries.push({
        id: hex(zufall(6)),
        title: titel,
        category: w.querySelector("#f-kat").value,
        username: w.querySelector("#f-user").value.trim(),
        url: w.querySelector("#f-url").value.trim(),
        secret,
        recovery: w.querySelector("#f-recovery").value.split("\n").map((s) => s.trim()).filter(Boolean),
        notes: w.querySelector("#f-notes").value.trim(),
        updated: new Date().toISOString(),
      });
      await sichern();
      melden("Gespeichert.");
      zeichnen(b);
    });
  }

  async function sichern() {
    const alt = huelleLaden();
    const { iv, data } = await verschluesseln(Z.daten, Z.schluessel);
    huelleSpeichern({ ...alt, iv, data, geaendert: new Date().toISOString() });
    sperrUhrStellen();
  }

  /* --- Notfallkit ----------------------------------------------------- */

  function notfallkit() {
    const h = huelleLaden();
    const fenster = window.open("", "_blank");
    if (!fenster) return melden("Bitte Pop-up-Blocker für diese Seite erlauben.");

    const eintraege = (Z.daten.entries || []).map((e) =>
      `<tr><td>${esc(e.title)}</td><td>${esc(e.category || "")}</td><td>${esc(e.username || "")}</td></tr>`).join("");

    fenster.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8">
      <title>Notfallkit — Wissensschatz</title>
      <style>
        body{font:12pt/1.6 Georgia,serif;max-width:19cm;margin:1.5cm auto;padding:0 1cm;color:#111}
        h1{font-size:20pt;margin:0 0 4px} h2{font-size:13pt;margin:26px 0 8px;border-bottom:1px solid #999;padding-bottom:3px}
        .warn{border:2px solid #a33;padding:12px 16px;margin:18px 0;background:#fff4f4}
        table{border-collapse:collapse;width:100%;font-size:10.5pt} td,th{border:1px solid #bbb;padding:5px 8px;text-align:left}
        .kasten{border:1px dashed #666;padding:14px;margin:10px 0;min-height:2.4cm}
        .klein{font-size:9.5pt;color:#555} .mono{font-family:Consolas,monospace;font-size:10pt;word-break:break-all}
        ol{padding-left:20px} li{margin-bottom:7px}
        @media print{body{margin:1cm}}
      </style></head><body>
      <h1>Notfallkit — Wissensschatz</h1>
      <div class="klein">Erstellt am ${new Date().toLocaleDateString("de-DE")} ·
        Schlüsseldatei-Kennung <span class="mono">${esc(h.keyfileId)}</span> ·
        ${(Z.daten.entries || []).length} Einträge im Tresor</div>

      <div class="warn"><strong>Dieses Blatt ist vertraulich.</strong> Es enthält bewusst
      <em>keine</em> Passphrase und <em>keine</em> Geheimnisse — aber es beschreibt den Weg zu ihnen.
      Verschlossen aufbewahren: Tresor, Bankschließfach oder beim Notar.</div>

      <h2>Was zum Öffnen nötig ist</h2>
      <ol>
        <li><strong>Die verschlüsselte Tresordatei</strong> — sie liegt im Archivordner unter
            <span class="mono">wissensschatz/tresor/</span> bzw. in der Sicherung.</li>
        <li><strong>Die Schlüsseldatei</strong> <span class="mono">wissensschatz-schluessel-${esc(h.keyfileId)}.json</span>
            — sie wird getrennt vom Archiv aufbewahrt. Aufbewahrungsort hier eintragen:
            <div class="kasten"></div></li>
        <li><strong>Die Passphrase</strong> — sie steht nirgends geschrieben. Hinterlegungsort oder
            berechtigte Person hier eintragen:
            <div class="kasten"></div></li>
        <li><strong>Der Authenticator-Code</strong>, falls eingerichtet. Gerät oder
            Wiederherstellungsweg hier eintragen:
            <div class="kasten"></div></li>
      </ol>

      <h2>Vorgehen</h2>
      <ol>
        <li>Archivordner auf einen Rechner kopieren.</li>
        <li><span class="mono">wissensschatz/web/index.html</span> in einem Browser öffnen.</li>
        <li>Reiter <em>Tresor</em> wählen. Falls kein Tresor angezeigt wird: über
            „vorhandenen Tresor einlesen“ die gesicherte Tresordatei wählen.</li>
        <li>Schlüsseldatei wählen, Passphrase eingeben, entsperren.</li>
        <li>Falls eingerichtet: Einmalcode aus der Authenticator-App eingeben.</li>
      </ol>
      <p class="klein">Es gibt keine Hintertür. Fehlt einer der vier Bestandteile, ist der Inhalt
      nicht wiederherstellbar — auch nicht durch den Ersteller dieser Software.</p>

      <h2>Inhaltsverzeichnis des Tresors</h2>
      <p class="klein">Nur Bezeichnungen — damit ein Berechtigter weiß, was zu erwarten ist.
      Keine Geheimnisse.</p>
      <table><tr><th>Bezeichnung</th><th>Kategorie</th><th>Benutzername</th></tr>${eintraege}</table>

      <h2>Für die Person, die dies findet</h2>
      <p>Dieses Archiv wurde über Jahre aufgebaut. Neben den Zugangsdaten enthält es aufbereitetes
      Fachwissen zu mehreren Gebieten. Beides ist ohne Spezialsoftware zugänglich: Die Inhalte liegen
      als gewöhnliche Textdateien im Ordner <span class="mono">content/</span> und lassen sich mit jedem
      Texteditor lesen. Nur der Tresor ist verschlüsselt.</p>
      <p class="klein">Erstellt am ${new Date().toLocaleString("de-DE")}. Dieses Blatt bei jeder
      wesentlichen Änderung neu drucken und das alte vernichten.</p>
      </body></html>`);
    fenster.document.close();
    setTimeout(() => fenster.print(), 400);
  }

  /* ------------------------------------------------------------ Export */

  window.VAULT = { zeichnen, sperren, istOffen: () => !!Z.schluessel };
})();
