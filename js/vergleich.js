// ==========================================================
// vergleich.js
// Füllt eine Vergleichsseite mit den Daten aus der JSON-Datei.
// Die Struktur (Überschriften, Tabellen, Listen) steht schon im
// HTML. Dieses Skript setzt nur noch die Texte ein.
// ==========================================================


// Text, der angezeigt wird, solange etwas noch fehlt
const PLATZHALTER = "[FOLGT]";

// Höchste Punktzahl pro Kriterium
const MAX_PUNKTE = 5;


// Start: Daten laden und Seite füllen
starteVergleich();


// Ablauf: Seite ermitteln, Daten laden, füllen oder Fehler zeigen
async function starteVergleich() {
    const seite = document.body.dataset.seite;

    try {
        const daten = await ladeVergleich(seite);
        fuelleSeite(daten);
        zeigeInhalt();
    } catch (fehler) {
        zeigeFehler();
    }
}


// Lädt data/<seite>.json und gibt die Daten zurück
async function ladeVergleich(seite) {
    const antwort = await fetch(`data/${seite}.json`);

    if (!antwort.ok) {
        throw new Error("Datei nicht gefunden: " + seite);
    }

    const daten = await antwort.json();
    return daten;
}


// Ruft für jeden Abschnitt die passende Funktion auf
function fuelleSeite(daten) {
    fuelleText("kurzfassung", daten.kurzfassung);
    fuelleTabelle("steckbrief-zeilen", daten.steckbrief, "merkmal");
    fuelleListe("liste-besser", daten.besser);
    fuelleListe("liste-schlechter", daten.schlechter);
    fuelleTabelle("messwerte-zeilen", daten.messwerte, "messung");
    fuelleBewertung(daten.bewertung);
    fuelleArbeitsproben(daten.arbeitsproben);
    fuelleText("fazit", daten.fazit);
}


// Schreibt einen einfachen Text in ein Element
function fuelleText(id, text) {
    const element = document.querySelector("#" + id);
    element.textContent = text;
}


// Macht aus einer Liste von Texten <li>-Einträge
function fuelleListe(id, eintraege) {
    const liste = document.querySelector("#" + id);
    let html = "";

    for (const eintrag of eintraege) {
        html += `<li>${eintrag}</li>`;
    }

    liste.innerHTML = html;
}


// Füllt eine Tabelle mit drei Spalten (Name | Bezahl | Gratis)
// "schluessel" ist der Name des Feldes für die erste Spalte
function fuelleTabelle(id, zeilen, schluessel) {
    const tbody = document.querySelector("#" + id);
    let html = "";

    for (const zeile of zeilen) {
        html += `
      <tr>
        <th scope="row">${zeile[schluessel]}</th>
        <td>${zeile.bezahl}</td>
        <td>${zeile.gratis}</td>
      </tr>`;
    }

    tbody.innerHTML = html;
}


// Füllt die Bewertungstabelle und die Zeile "Gesamt"
function fuelleBewertung(bewertung) {
    const tbody = document.querySelector("#bewertung-zeilen");
    let html = "";

    for (const zeile of bewertung) {
        html += `
      <tr>
        <th scope="row">${zeile.kriterium}</th>
        <td>${zeigePunkte(zeile.bezahl)}</td>
        <td>${zeigePunkte(zeile.gratis)}</td>
      </tr>`;
    }

    tbody.innerHTML = html;

    fuelleText("gesamt-bezahl", berechneSumme(bewertung, "bezahl"));
    fuelleText("gesamt-gratis", berechneSumme(bewertung, "gratis"));
}


// Gibt "4 von 5" und fünf kleine Quadrate zurück
// Bei 0 (noch nicht bewertet) nur den Platzhalter
function zeigePunkte(punkte) {
    if (punkte === 0) {
        return PLATZHALTER;
    }

    let quadrate = "";

    for (let i = 1; i <= MAX_PUNKTE; i++) {
        if (i <= punkte) {
            quadrate += '<span class="punkt punkt-voll"></span>';
        } else {
            quadrate += '<span class="punkt"></span>';
        }
    }

    return `${punkte} von ${MAX_PUNKTE} <span class="punkte" aria-hidden="true">${quadrate}</span>`;
}


// Zählt die Punkte einer Spalte zusammen
// Fehlt noch eine Bewertung (0), kommt der Platzhalter zurück
function berechneSumme(bewertung, spalte) {
    let summe = 0;

    for (const zeile of bewertung) {
        if (zeile[spalte] === 0) {
            return PLATZHALTER;
        }
        summe += zeile[spalte];
    }

    return `${summe} von ${bewertung.length * MAX_PUNKTE}`;
}


// Baut für jede Arbeitsprobe ein <figure> mit Bild und Beschriftung
function fuelleArbeitsproben(arbeitsproben) {
    const raster = document.querySelector("#arbeitsproben-raster");
    let html = "";

    for (const probe of arbeitsproben) {
        html += `
      <figure class="arbeitsprobe">
        <img src="${probe.bild}" alt="${probe.alt}" width="800" height="500" loading="lazy">
        <figcaption>${probe.beschriftung}</figcaption>
      </figure>`;
    }

    raster.innerHTML = html;
}


// Versteckt den Lade-Hinweis und zeigt die gefüllten Abschnitte
function zeigeInhalt() {
    document.querySelector("#lade-hinweis").hidden = true;
    document.querySelector("#vergleich-inhalt").hidden = false;
}


// Zeigt eine verständliche Fehlermeldung statt des Lade-Hinweises
function zeigeFehler() {
    const hinweis = document.querySelector("#lade-hinweis");
    hinweis.textContent = "Die Inhalte konnten nicht geladen werden. Tipp: Seite über einen Webserver öffnen (z. B. „Live Server“ in VS Code).";
    hinweis.classList.add("hinweis-fehler");
}
