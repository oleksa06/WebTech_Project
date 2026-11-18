// ==========================================================
// maskottchen.js (unser eigener Code)
// Setzt das Maskottchen unten rechts auf jede Seite und zeigt
// eine Sprechblase mit einem kurzen Text zur Seite.
// Die Animation selbst kommt aus maskottchen/maskottchen-komponente.js.
// ==========================================================


// Einstellungen (Zeiten in Millisekunden)
const START_VERZOEGERUNG = 800;
const SPRECHEN_DAUER = 4000;
const WACKELN_ABSTAND = 12000;


// Elemente, die wir später brauchen
let komponente = null;  // das <slime-mascot>-Element, beim Ersatzbild null
let knopf = null;
let blase = null;
let blasenText = null;
let sprechTimer = null;
let hatText = false;


// Start
starteMaskottchen();


// Baut das Maskottchen ein und verbindet alle Ereignisse
function starteMaskottchen() {
    const bereich = erstelleBereich();
    document.body.appendChild(bereich);

    knopf = bereich.querySelector(".maskottchen-knopf");
    blase = bereich.querySelector(".maskottchen-blase");
    blasenText = bereich.querySelector(".maskottchen-text");
    komponente = bereich.querySelector("slime-mascot");

    const schliessen = bereich.querySelector(".maskottchen-schliessen");

    knopf.addEventListener("click", klickAufMaskottchen);
    schliessen.addEventListener("click", klickAufSchliessen);
    document.addEventListener("keydown", pruefeEscape);

    setInterval(wackleVielleicht, WACKELN_ABSTAND);
    ladeText();
}


// Prüft, ob die Animation benutzt werden kann
function animationMoeglich() {
    const komponenteDa = customElements.get("slime-mascot") !== undefined;
    const wenigerBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return komponenteDa && !wenigerBewegung;
}


// Erstellt <aside> mit Knopf und Sprechblase
// Die Blase ist am Anfang geschlossen (ohne Klasse "ist-offen")
function erstelleBereich() {
    let figur = '<img class="maskottchen-bild" src="maskottchen/bilder/maskottchen.svg" alt="" width="64" height="64">';

    if (animationMoeglich()) {
        figur = '<slime-mascot follow-cursor aria-hidden="true"></slime-mascot>';
    }

    const bereich = document.createElement("aside");
    bereich.className = "maskottchen";
    bereich.setAttribute("aria-label", "Maskottchen");

    bereich.innerHTML = `
    <button type="button" class="maskottchen-knopf" aria-expanded="false" aria-controls="maskottchen-blase">
      ${figur}
      <span class="sr-only">Kurzinfo zu dieser Seite anzeigen</span>
    </button>
    <div class="maskottchen-blase" id="maskottchen-blase">
      <p class="maskottchen-text"></p>
      <button type="button" class="maskottchen-schliessen" aria-label="Kurzinfo schließen">
        <span aria-hidden="true">×</span>
      </button>
    </div>`;

    return bereich;
}


// Lädt den Text für diese Seite aus maskottchen/maskottchen.json
async function ladeText() {
    const seite = document.body.dataset.seite;

    try {
        const antwort = await fetch("maskottchen/maskottchen.json");
        const texte = await antwort.json();

        if (texte[seite]) {
            blasenText.textContent = texte[seite];
            hatText = true;
            setTimeout(oeffneBlase, START_VERZOEGERUNG);
        } else {
            ohneBlase();
        }
    } catch (fehler) {
        // Kein Text: Das Maskottchen bleibt einfach ohne Sprechblase
        ohneBlase();
    }
}


// Ohne Text gibt es keine Sprechblase: Knopf entsprechend anpassen
function ohneBlase() {
    knopf.removeAttribute("aria-expanded");
    knopf.removeAttribute("aria-controls");
    knopf.querySelector(".sr-only").textContent = "Maskottchen";
}


// Ist die Blase gerade offen?
function blaseIstOffen() {
    return blase.classList.contains("ist-offen");
}


// Klick auf das Maskottchen: hüpfen und Blase öffnen oder schließen
function klickAufMaskottchen() {
    spieleAnimation("huepfen");

    if (!hatText) {
        return;
    }

    if (blaseIstOffen()) {
        schliesseBlase();
    } else {
        oeffneBlase();
    }
}


// Klick auf "×": Blase schließen und Fokus zurück zum Maskottchen
function klickAufSchliessen() {
    schliesseBlase();
    knopf.focus();
}


// Escape schließt die Blase
function pruefeEscape(ereignis) {
    if (ereignis.key !== "Escape" || !blaseIstOffen()) {
        return;
    }

    const fokusInBlase = blase.contains(document.activeElement);
    schliesseBlase();

    if (fokusInBlase) {
        knopf.focus();
    }
}


// Zeigt die Blase (ohne den Fokus zu verschieben) und lässt das Maskottchen sprechen.
// Das Ein- und Ausblenden macht das CSS (Übergang bei der Klasse "ist-offen").
function oeffneBlase() {
    blase.classList.add("ist-offen");
    knopf.setAttribute("aria-expanded", "true");
    sprich();
}


// Versteckt die Blase und beendet das Sprechen
function schliesseBlase() {
    blase.classList.remove("ist-offen");
    knopf.setAttribute("aria-expanded", "false");
    hoereAufZuSprechen();
}


// Sprechen: Mund 4 Sekunden lang bewegen.
// Ein alter Timer wird vorher gestoppt, damit er den Mund
// nicht zu früh schließt (z. B. bei schnellem Auf- und Zuklicken).
function sprich() {
    clearTimeout(sprechTimer);
    spieleAnimation("spricht");
    sprechTimer = setTimeout(hoereAufZuSprechen, SPRECHEN_DAUER);
}


// Mund zu
function hoereAufZuSprechen() {
    clearTimeout(sprechTimer);
    spieleAnimation("schweigt");
}


// Alle 12 Sekunden ein kleines Wackeln (nur bei geschlossener Blase)
function wackleVielleicht() {
    if (!blaseIstOffen()) {
        spieleAnimation("wackeln");
    }
}


// ----------------------------------------------------------
// Verbindung zum animierten Maskottchen
// Nur hier wird die Komponente (maskottchen/maskottchen-komponente.js)
// angesprochen. Beim Ersatzbild passiert einfach nichts.
// ----------------------------------------------------------
function spieleAnimation(name) {
    if (komponente === null || komponente.mascot === undefined) {
        return;
    }

    if (name === "spricht") {
        komponente.mascot.talking = true;
    } else if (name === "schweigt") {
        komponente.mascot.talking = false;
    } else if (name === "huepfen") {
        komponente.fire("click");
    } else if (name === "wackeln") {
        komponente.fire("fidget");
    }
}
