# Gratis statt teuer – kostenlose Alternativen im Praxistest

Studienprojekt an der FH [FOLGT] von [Name A] und [Name B].
Wir vergleichen vier Bezahlprogramme mit je einer kostenlosen Alternative:

| Bezahlprogramm | Kostenlose Alternative | Kategorie | Seite |
|---|---|---|---|
| Adobe Photoshop | GIMP | Bildbearbeitung | `photoshop-gimp.html` |
| Adobe Illustrator | Inkscape | Vektorgrafik | `illustrator-inkscape.html` |
| Microsoft 365 | LibreOffice | Büro & Office | `microsoft365-libreoffice.html` |
| Adobe Premiere Pro | DaVinci Resolve (kostenlose Version) | Videoschnitt | `premiere-davinci.html` |

Die Seite ist reines HTML, eine CSS-Datei und etwas normales JavaScript.
Keine Frameworks, keine Bibliotheken, kein npm, keine externen Schriften oder CDNs.


## 1. Seite lokal öffnen

Die Vergleichsseiten laden ihre Daten mit `fetch` aus JSON-Dateien. Öffnet man
eine HTML-Datei per Doppelklick (`file://…`), blockiert der Browser das Laden.
Dann erscheint auf den Vergleichsseiten der Hinweis „Die Inhalte konnten nicht
geladen werden“. Deshalb die Seite immer über einen kleinen Webserver öffnen:

- **VS Code:** Erweiterung „Live Server“ installieren, `index.html` öffnen,
  unten rechts auf „Go Live“ klicken.
- **Terminal:** im Projektordner
  ```
  python3 -m http.server
  ```
  ausführen und im Browser `http://localhost:8000` öffnen.

Auf dem FH-Server reicht es, alle Dateien hochzuladen (außer dem Ordner
`maskottchen-vorlage/`, siehe unten). Alle Pfade sind relativ, die Seite läuft
also auch in einem Unterordner.


## 2. Ordnerstruktur

```
index.html                       Startseite
photoshop-gimp.html              Vergleich (gleiche Vorlage für alle vier)
illustrator-inkscape.html
microsoft365-libreoffice.html
premiere-davinci.html
so-haben-wir-getestet.html       Methodik
ueber-das-projekt.html           Team, Bildnachweis, Impressum
css/style.css                    das einzige Stylesheet
js/vergleich.js                  füllt die Vergleichsseiten aus JSON
js/maskottchen-komponente.js     fertige Maskottchen-Komponente (nicht verändern)
js/maskottchen.js                Maskottchen + Sprechblase (unser Code)
data/*.json                      Inhalte der Vergleiche und Texte des Maskottchens
img/maskottchen/maskottchen.svg  Favicon und Ersatzbild
img/maskottchen/vorlage-base.png nur Vorlage, wird auf der Seite nicht benutzt
img/platzhalter.svg              Platzhalterbild „Bild folgt“
img/<paar>/LIESMICH.txt          welche Bilder in den Ordner gehören
maskottchen-vorlage/             nur Quelle, NICHT auf den Server hochladen
```


## 3. Platzhalter-Markierungen

Alles, was noch fehlt, ist markiert. Mit Strg+F im ganzen Projekt suchen:

| Markierung | Bedeutung |
|---|---|
| `[FOLGT]` | Hier fehlt noch ein echter Wert aus unseren Tests (oder eine Angabe wie die FH). |
| `[ENTWURF]` | Text ist ein Vorschlag und muss noch geprüft werden (Seite „So haben wir getestet“). |
| `[NAME]` | Name des Maskottchens (in `data/maskottchen.json`). |
| `[Name A]`, `[Name B]` | unsere Namen (Fußzeile aller 7 Seiten, „Über das Projekt“, README). |

Wir haben bewusst **keine** Zahlen, Preise, Versionen oder Ergebnisse erfunden.
Eingetragen ist nur, was feststeht: Programmname, Hersteller und „kostenlos“
bei der Gratis-Version.


## 4. JSON-Dateien ausfüllen

Pro Paar gibt es eine Datei in `data/`, z. B. `data/photoshop-gimp.json`.
Nur normalen Text eintragen, kein HTML. Anführungszeichen im Text als `\"`
schreiben. Nach dem Bearbeiten prüfen, ob die Datei noch gültig ist:

```
python3 -m json.tool data/photoshop-gimp.json
```

| Feld | Inhalt |
|---|---|
| `bezahlprogramm`, `alternative` | Namen der beiden Programme (nur zur Info, die Überschriften stehen im HTML) |
| `kurzfassung` | ein Absatz „Das Wichtigste in Kürze“ |
| `steckbrief` | Zeilen der Tabelle: `merkmal`, Wert für das Bezahlprogramm (`bezahl`) und für die Alternative (`gratis`) |
| `besser` | Liste: Wo ist die Alternative besser? |
| `schlechter` | Liste: Wo ist die Alternative schlechter? |
| `messwerte` | Zeilen der Tabelle „Messwerte“: `messung`, `bezahl`, `gratis`. Werte als Text mit Einheit, z. B. `"1,2 GB"` oder `"4 min 30 s"`. Das Skript rechnet nichts um. |
| `bewertung` | `kriterium` mit Punkten `bezahl` und `gratis` als **Zahl** 1–5. `0` heißt „noch nicht bewertet“ und wird als „[FOLGT]“ angezeigt. Die Zeile „Gesamt“ rechnet das Skript selbst aus, sobald alle Punkte da sind. |
| `arbeitsproben` | pro Bild: `bild` (Pfad), `alt` (was ist zu sehen?), `beschriftung` (Programm, Version, Testdatum) |
| `fazit` | ein Absatz zum Schluss |

Mehr Zeilen oder Listenpunkte sind kein Problem: einfach weitere Einträge in
die Listen schreiben, das Skript nimmt alle.

Die Texte des Maskottchens stehen in `data/maskottchen.json`. Der Schlüssel ist
jeweils der Wert von `data-seite` im `<body>` der Seite.


## 5. Platzhalterbilder ersetzen

1. Eigene Screenshots in den passenden Ordner legen, z. B.
   `img/photoshop-gimp/arbeitsprobe-1-gimp.jpg` (nur Kleinbuchstaben, keine
   Umlaute, keine Leerzeichen – der Linux-Server unterscheidet Groß/klein).
2. In der JSON-Datei bei `bild` den Pfad ändern:
   `"bild": "img/photoshop-gimp/arbeitsprobe-1-gimp.jpg"`.
3. `alt` und `beschriftung` ausfüllen.
4. Bilder am besten im Format 16:10 speichern (z. B. 1200 × 750 px). Im HTML
   stehen `width="800" height="500"`, damit nichts springt; andere Formate
   werden trotzdem richtig angezeigt.
5. Quelle von verwendeten Fotos im Bildnachweis (`ueber-das-projekt.html`) eintragen.

Genauere Hinweise stehen in der `LIESMICH.txt` in jedem Bilderordner.


## 6. Neues Programm-Paar hinzufügen

1. Eine Vergleichsseite kopieren, z. B. `photoshop-gimp.html` → `neu-alternative.html`.
2. In der Kopie ändern: `<title>`, `meta description`, `data-seite="neu-alternative"`,
   `<h1>`, Programmnamen in Tabellenköpfen und Überschriften („Wo … besser ist“),
   Brotkrumen und „Weitere Vergleiche“.
3. `data/photoshop-gimp.json` kopieren → `data/neu-alternative.json` (gleicher Name wie `data-seite`!) und ausfüllen.
4. Bilderordner `img/neu-alternative/` anlegen.
5. Auf der Startseite (`index.html`) eine neue Kachel in die Liste `#vergleiche` einfügen.
6. Text für das Maskottchen in `data/maskottchen.json` mit dem Schlüssel `"neu-alternative"` ergänzen.
7. Den Link in der Fußzeile **aller** Seiten und bei „Weitere Vergleiche“ ergänzen.


## 7. Das Maskottchen

- `js/maskottchen-komponente.js` ist eine **unveränderte Kopie** von
  `maskottchen-vorlage/slime-mascot.js`. Das ist eine separat erzeugte
  Komponente (Element `<slime-mascot>` mit Animationen und JavaScript-API),
  **nicht unser selbst geschriebener Code**. Sie benutzt intern eine Klasse und
  ein Custom Element; unsere Regeln für einfachen Code gelten für sie nicht.
  Bitte nicht bearbeiten.
- **Komponente aktualisieren:** einfach die Datei durch eine neue Version von
  `slime-mascot.js` ersetzen (Name `maskottchen-komponente.js` behalten).
- Unser Code steht in `js/maskottchen.js`. Er baut ein `<aside>` mit einem
  Knopf (darin das Maskottchen) und einer Sprechblase ans Ende von `<body>`,
  lädt den Text aus `data/maskottchen.json` und öffnet die Blase nach 0,8 s.
- Die **ganze Verbindung zur Komponente** steckt in der Funktion
  `spieleAnimation(name)` mit `"spricht"`, `"schweigt"`, `"huepfen"` und
  `"wackeln"`. Nur dort wird `talking` bzw. `fire(...)` aufgerufen. Der Rest
  des Codes kennt die Komponente nicht.
- Der Ordner `maskottchen-vorlage/` ist nur die Quelle und kommt **nicht** auf den Server.

### Entscheidungen beim Maskottchen

- **Bewegung reduziert:** Die Komponente selbst prüft `prefers-reduced-motion`
  nicht (laut ihrem README und Code). Deshalb entscheidet `maskottchen.js`:
  Ist „Bewegung reduzieren“ eingeschaltet oder fehlt die Komponente, wird statt
  der Animation das statische Bild `img/maskottchen/maskottchen.svg` gezeigt.
  Die Sprechblase funktioniert trotzdem.
- **Blick zurücksetzen:** Die Komponente setzt den Blick selbst auf 0 zurück,
  wenn die Maus die Seite verlässt oder das Fenster den Fokus verliert. Dafür
  brauchen wir keinen eigenen Code.
- **Hüpfen:** Die Komponente hüpft nur, wenn man genau auf den Schleim klickt.
  Damit es auch bei Tastatur (Enter/Leertaste) und am Rand des Knopfes klappt,
  ruft unser Klick-Code zusätzlich `spieleAnimation("huepfen")` auf. Ein
  doppelter Auslöser schadet nicht, die Komponente ignoriert ihn, solange sie hüpft.
- **Tastatur:** Die Komponente hat keine fokussierbaren Teile und ist mit
  `aria-hidden="true"` vor dem Screenreader versteckt. Mit Tab erreicht man nur
  den Knopf.
- **JSON fehlt:** Dann bleibt das Maskottchen ohne Sprechblase stehen; der Knopf
  heißt für Screenreader dann nur „Maskottchen“.
- **Größe des Schleims:** In der Komponente ist viel leerer Rand um den
  Schleim (die Szene ist quadratisch, der Körper nimmt nur ca. 66 % der Breite
  ein). Ohne die Komponente zu ändern, machen wir das `<slime-mascot>`-Element
  in `css/style.css` 150 % so groß wie der Knopf und verschieben es
  (`top: -13%; left: -25%`). So füllt der Schleim den Knopf aus: 96px auf dem
  Laptop, 64px auf Handy/Tablet. Das Element hat `pointer-events: none`, damit
  der überstehende Rand keine Klicks abfängt; alle Klicks gehen an den Knopf
  (der dann `spieleAnimation("huepfen")` aufruft).
- **Platz unten:** `body` hat unten genau so viel Abstand wie das Maskottchen
  hoch ist plus der Abstand zum Rand: `calc(4rem + 1rem)` auf Handy/Tablet,
  `calc(6rem + 1rem)` auf dem Laptop. So verdeckt das Maskottchen nie die
  Fußzeile. Die geöffnete Sprechblase darf Inhalt überdecken, denn man kann sie
  jederzeit schließen (×, Escape oder Klick aufs Maskottchen).
- **Sprechblase auf/zu:** Es gibt nur eine Klasse, `ist-offen`.
  `maskottchen.js` setzt sie beim Öffnen und entfernt sie beim Schließen (dazu
  `aria-expanded` am Knopf). Alles Weitere macht das CSS:
  - geschlossen: `opacity: 0`, `visibility: hidden`, etwas tiefer und kleiner;
  - offen: `opacity: 1`, `visibility: visible`, normale Größe;
  - `transition` auf `opacity`, `transform` und `visibility`.

  `visibility: hidden` ist wichtig: Damit ist die geschlossene Blase nicht nur
  unsichtbar, sondern auch für den Screenreader weg und mit Tab nicht
  erreichbar (nur `opacity: 0` würde das nicht tun). Beim Schließen wechselt
  `visibility` erst nach 150 ms (`visibility 0s linear 150ms`), damit man das
  Ausblenden noch sieht; beim Öffnen sofort. Schnelles Klicken ist kein
  Problem, weil der Browser einen laufenden Übergang einfach umdreht.
  Bei „Bewegung reduzieren“ sind alle Übergänge aus, die Blase ist dann sofort
  da bzw. weg.
- **Ersatzbild:** Beim `maskottchen.svg` wurde nur die `viewBox` auf den Umriss
  des Körpers zugeschnitten, die Grafik ist unverändert.


## 8. Weitere kleine Entscheidungen

- Kopf und Fußzeile sind in alle 7 Seiten kopiert (keine Vorlagen-Technik).
- Auf den Vergleichsseiten ist in der Hauptnavigation kein Punkt markiert,
  dort zeigen die Brotkrumen mit `aria-current="page"` die aktuelle Seite.
- Brotkrumen, Überschrift und „Weitere Vergleiche“ stehen fest im HTML und
  funktionieren auch ohne JavaScript.
- Tabellen haben eine Mindestbreite von 30rem. Auf schmalen Handys scrollt nur
  die Tabelle in ihrem Rahmen, nicht die Seite.
- Auf der Seite „So haben wir getestet“ stehen pro Paar drei Aufgaben als Platzhalter.
- Die Startseiten-Kacheln: 1 Spalte (Handy), ab Tablet 2 × 2 (die Lesespalte ist für 4 Spalten zu schmal).
- Das Logo in der Kopfzeile ist nur Text. Das Maskottchen erscheint nur einmal, unten rechts (und als Favicon).


## 9. Gestaltung

Nur ein dunkles Design (kein helles Design, kein Umschalter). In jeder Seite
steht `<meta name="color-scheme" content="dark">`, im CSS `color-scheme: dark`.

- Fast schwarzer, leicht lila Hintergrund; Karten und Tabellen etwas heller,
  mit feinem Rand statt Schatten. Kleine Rundungen (6–10px).
- Das Lila vom Maskottchen (`#AA15E8`) nur als kleiner Akzent: Hauptknopf,
  Linie unter Abschnittsüberschriften, aktive Navigation. Für Text-Akzente
  (Links, Fokusrahmen, aktive Navigation) ein helleres Lila (`#D49BFF`).
- Abschnittsüberschriften klein und fett mit kurzer Akzentlinie darunter.
- Kacheln: ruhige Karten mit Rand; beim Überfahren werden Rand und Fläche
  heller, nichts hüpft.
- Bewertung: kleine, flache Quadrate in hellem Lila.
- Sprechblase: dunkle Fläche, dünner Akzent-Rand, kleine Rundung.
- Systemschrift, Grundgröße 1rem, Zeilenhöhe 1.6, Text höchstens ca. 70 Zeichen breit.

### Bewegung

Alle Bewegungen sind kurz (150–300 ms) und ruhig. Bei „Bewegung reduzieren“
(`prefers-reduced-motion: reduce`) sind alle aus, dann ist alles sofort da.

| Was | Wie | Dauer |
|---|---|---|
| Seitenwechsel | Nur CSS: `@view-transition { navigation: auto; }`. `main` und Fußzeile blenden über. Kopf (`view-transition-name: kopf`) und Maskottchen (`view-transition-name: maskottchen`) haben eigene Namen: ihr altes Bild wird ausgeblendet (`display: none`), das neue ohne Animation und mit `mix-blend-mode: normal` gezeigt. Sonst würden alt und neu übereinander gemischt (`plus-lighter`), und in Safari sähe der Kopf kurz doppelt und heller aus. | 200 ms |
| Sprechblase öffnen | Klasse `ist-offen` an: einblenden, ein paar px nach oben, Größe 0,95 → 1, Drehpunkt beim Schwänzchen (unten rechts), `ease-out`; `visibility` sofort sichtbar | 220 ms |
| Sprechblase schließen | Klasse `ist-offen` weg: dasselbe rückwärts, `ease-in`; `visibility: hidden` erst am Ende | 150 ms |
| Vergleichsseiten | Wenn `vergleich.js` die Abschnitte zeigt, blenden sie weich ein (CSS-Animation `einblenden`, startet automatisch, sobald `hidden` entfernt wird). `vergleich.js` musste dafür nicht geändert werden. | 300 ms |
| Hover/Fokus | Links, Navigation, Kacheln, Knöpfe: nur Farbe, Rand und Hintergrund; nichts verschiebt das Layout | 150 ms |

**Browser-Unterstützung der Seitenübergänge:** Seitenübergänge zwischen
verschiedenen HTML-Dateien (cross-document View Transitions) können zurzeit vor
allem Chrome, Edge und Safari. Andere Browser ignorieren die Regel einfach und
wechseln die Seite ganz normal, ohne Überblenden. Es geht nichts kaputt. Die
Übergänge funktionieren nur zwischen Seiten auf demselben Server (gleiche Herkunft),
also z. B. über Live Server oder auf dem FH-Server, nicht per Doppelklick (`file://`).

### Farben und Kontraste

Alle Paare wurden mit einem kleinen Skript nach der WCAG-Formel geprüft
(Text mind. 4.5:1, Ränder von Bedienelementen und Fokus mind. 3:1).
Zusätzlich wurden im Browser die berechneten Farben aller sichtbaren Texte
auf allen 7 Seiten geprüft: der kleinste Wert ist 5.3:1 (weißer Text auf dem lila Knopf).

| Vordergrund | Hintergrund | Kontrast | Verwendung |
|---|---|---|---|
| `--text` #ECE6F2 | `--hintergrund` #120D18 | 15.7:1 | normaler Text |
| `--text` | `--flaeche` #1C1524 | 14.5:1 | Text in Karten/Tabellen |
| `--text` | `--flaeche-hover` #251C30 | 13.3:1 | Kachel beim Überfahren |
| `--text-leise` #B5AAC2 | `--hintergrund` | 8.7:1 | Nebentexte, Fußzeile |
| `--text-leise` | `--flaeche` | 8.0:1 | Nebentexte in Karten |
| `--text-leise` | `--flaeche-hover` | 7.4:1 | Nebentexte beim Überfahren |
| `--akzent-hell` #D49BFF | `--hintergrund` | 9.1:1 | Links, aktive Navigation, Fokusrahmen |
| `--akzent-hell` | `--flaeche` | 8.4:1 | Links/Fokus in Karten, Rand der Sprechblase |
| `--akzent-hell` | `--flaeche-hover` | 7.7:1 | Rand der Kachel beim Überfahren |
| `--weiss` #FFFFFF | `--akzent` #AA15E8 | 5.3:1 | Text auf dem Hauptknopf |
| `--weiss` | `--akzent-dunkel` #9512CC | 6.5:1 | Hauptknopf beim Überfahren |
| `--gruen` #6EDC98 | `--flaeche` | 10.5:1 | „besser“: ✓ und Linie |
| `--rot` #FF9A90 | `--flaeche` | 8.7:1 | „schlechter“: ✗, Linie, Fehlermeldung |
| `--rand-ui` #76668A | `--hintergrund` | 3.7:1 | Rand der Kacheln (Bedienelement) |
| `--rand-ui` | `--flaeche` | 3.4:1 | leere Bewertungs-Quadrate |
| `--akzent` | `--hintergrund` | 3.6:1 | Hauptknopf als Fläche, Akzentlinie |
| `--rand` #3A2E47 | `--hintergrund` | 1.5:1 | nur Deko-Linien (Karten, Tabellen), keine Information |


## 10. Bewertungskriterien – wie umgesetzt

| Kriterium | Wie umgesetzt |
|---|---|
| **Funktion & Erreichbarkeit (5)** | 7 Seiten, alle über Navigation, Kacheln, Brotkrumen und Fußzeile verlinkt; nur relative Pfade und kleingeschriebene Dateinamen, läuft auf jedem statischen Server (auch im Unterordner); verständliche Meldung, falls Daten nicht laden. |
| **Valides HTML/CSS, saubere Trennung, Ordnerstruktur, Code-Qualität (15)** | HTML5 ohne Inline-Styles und Inline-Events; eine CSS-Datei in 10 kommentierten Abschnitten; JavaScript in eigenen Dateien mit kurzen, kommentierten Funktionen; Inhalte getrennt in JSON; klare Ordner `css/`, `js/`, `data/`, `img/`; deutsche, kleingeschriebene Namen. |
| **Responsive auf Laptop/Tablet/Smartphone (15)** | Mobile first mit zwei Breakpoints (600px, 1000px); Grid/Flexbox; schmale Lesespalte (max. 46rem); Kacheln 1 Spalte → 2 × 2, Karten und Arbeitsproben 1 → 2 Spalten; Navigation bricht einfach um; Bilder `max-width: 100%`; Schriftgrößen in `rem`; kein horizontales Scrollen ab 320px (Tabellen scrollen in ihrem Rahmen). |
| **Barrierefreiheit: Screenreader, Kontrast, Tastatur, Alt-Texte (15)** | Semantische Elemente (`header`, `nav`, `main`, `section`, `aside`, `footer`); Skip-Link; ein `h1` pro Seite, Überschriften ohne Sprünge; `aria-current`; Tabellen mit `caption` und `th scope`; dunkles Farbschema mit geprüftem Kontrast (Text mind. 4.5:1, Ränder/Fokus mind. 3:1, siehe Abschnitt 9); deutlicher Fokusrahmen; „besser/schlechter“ nicht nur über Farbe (Überschrift + ✓/✗); Punkte als Text „4 von 5“; Maskottchen als echter Knopf mit `aria-expanded`, Escape schließt die Blase; `prefers-reduced-motion` wird beachtet; Alt-Texte für alle Bilder. |
| **Eigener erhobener Inhalt (5)** | Alle Messwerte, Bewertungen, Screenshots und Arbeitsproben kommen aus unseren eigenen Tests (Felder in `data/*.json`, aktuell noch `[FOLGT]`); Methodik offen beschrieben; eigenes Maskottchen. |


## 11. Prüfen

- HTML: <https://validator.w3.org/> (Datei hochladen oder URL vom FH-Server)
- CSS: <https://jigsaw.w3.org/css-validator/>
- Barrierefreiheit: WAVE (<https://wave.webaim.org/>) oder Lighthouse in den
  Chrome-Entwicklertools (Tab „Lighthouse“ → „Accessibility“)
- Responsive: Chrome-Entwicklertools → Gerätesymbol, Breiten 320, 375, 768 und 1280 px testen
- Tastatur: nur mit Tab, Shift+Tab, Enter und Escape durch die Seite gehen
