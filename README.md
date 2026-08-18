# Wägwiiser

Website der Pfadi St. Justus Flums. Angular-Frontend für den öffentlichen
Auftritt und einen geschützten Admin-Bereich, in dem Übungen und Stufen
gepflegt werden. Die Inhalte kommen aus einem separaten Backend-API.

## Inhalt

- [Über das Projekt](#über-das-projekt)
- [Tech-Stack](#tech-stack)
- [Erste Schritte](#erste-schritte)
- [Skripte](#skripte)
- [Projektstruktur](#projektstruktur)
- [Routen](#routen)
- [Design-System](#design-system)
- [API-Client](#api-client)
- [spartan/ui](#spartanui)
- [Code-Konventionen](#code-konventionen)
- [Bewusste Entscheidungen](#bewusste-entscheidungen)
- [CI](#ci)
- [Mitwirkende](#mitwirkende)

## Über das Projekt

Wägwiiser besteht aus zwei Bereichen, die sich Build und Routing teilen, sonst
aber getrennt sind:

- **Öffentlicher Bereich** (`/`) — Startseite, Stufen, Abteilung, Pfadihaus und
  die rechtlichen Seiten. Eigene Typografie und Farbwelt, kein spartan/ui.
- **Admin-Bereich** (`/admin`) — Login über MiData (OAuth2), Verwaltung von
  Stufen und Übungen. Nutzt spartan/ui und ein eigenes Farbschema inklusive
  Dark Mode.

Die Trennung ist in `src/styles.css` verankert: die öffentlichen Regeln hängen
alle an `.public-app`, die spartan-Basisregeln an `app-admin-layout`.

## Tech-Stack

| Technologie        | Version |
| ------------------ | ------- |
| Angular            | 22.1.2  |
| TypeScript         | 6.0.3   |
| Tailwind CSS       | 4.2.4   |
| spartan/ui (brain) | 1.3.1   |
| ng-icons           | 33.2.2  |
| RxJS               | 7.8.2   |

## Erste Schritte

### Voraussetzungen

- Node.js 22 oder neuer (die CI baut mit 24)
- npm (das Projekt nutzt `package-lock.json`; `angular.json` pinnt npm als
  Paketmanager)
- Laufendes Backend-API, sonst zeigen die Stufen-Detailseiten Platzhalter

### Installation

```bash
git clone https://github.com/pfadiflums/Waegwiiser.git
cd Waegwiiser
npm install
npm start
```

Der Entwicklungsserver läuft danach auf http://localhost:4200.

### Umgebungen

`src/environments/environment.ts` gilt für Production, beim Entwicklungs-Build
wird sie über `fileReplacements` durch `environment.development.ts` ersetzt.
Die Struktur beider Dateien gibt `environment.interface.ts` vor.

| Feld                | Bedeutung                                                  |
| ------------------- | ---------------------------------------------------------- |
| `production`        | Schaltet unter anderem das Konsolen-Banner in `main.ts` ab |
| `apiUrl`            | Basis-URL des Backends                                     |
| `oauth2RedirectUrl` | Rücksprungziel nach dem MiData-Login                       |
| `midataAuthUrl`     | Einstiegspunkt des OAuth2-Flows                            |

## Skripte

| Befehl                 | Zweck                                        |
| ---------------------- | -------------------------------------------- |
| `npm start`            | Entwicklungsserver auf Port 4200             |
| `npm run build`        | Production-Build nach `dist/`                |
| `npm run watch`        | Development-Build im Watch-Modus             |
| `npm run build:github` | Build mit Base-Href `./waegwiiser/`          |
| `npm run lint`         | ESLint über TypeScript und Templates         |
| `npm run format`       | Prettier über das ganze Projekt              |
| `npm run format:check` | Prettier nur prüfen, nichts schreiben        |
| `npm test`             | Unit-Tests (aktuell noch keine vorhanden)    |
| `npm run generate:api` | API-Client aus `openapi.json` neu generieren |

## Projektstruktur

```
src/
├── app/
│   ├── api/                Generierter API-Client (ng-openapi-gen, nicht editieren)
│   ├── core/               Guards, Interceptors, Services, Signal-Stores
│   ├── feature/
│   │   ├── admin/          Geschützte Seiten
│   │   └── public/         Öffentliche Seiten
│   ├── layout/             public-layout, admin-layout, admin-shell
│   └── shared/
│       ├── components/     navbar, footer, hero-decoration, metric-cards
│       ├── data/           Feste Inhalte, z.B. die Stufen-Liste
│       └── ui/             spartan/ui (generiert, nicht editieren)
├── environments/
├── index.html
├── main.ts
└── styles.css              Tailwind-Theme, Typografie, Layout-Container
```

Zwei Verzeichnisse werden von Werkzeugen erzeugt und sollten nie von Hand
angepasst werden: `src/app/api` und `src/app/shared/ui`. Beide sind vom Linting
und von Prettier ausgenommen.

## Routen

### Öffentlich

| Route                          | Seite                                             | Stand                 |
| ------------------------------ | ------------------------------------------------- | --------------------- |
| `/home`                        | Startseite                                        | fertig                |
| `/stufe/:slug`                 | Stufen-Detail mit nächster Übung und Leitungsteam | fertig                |
| `/abteilung/abteilungsleitung` | Abteilungsleitung                                 | fertig                |
| `/abteilung/abteilungskomitee` | Abteilungskomitee                                 | fertig                |
| `/abteilung/altpfader`         | Altpfader                                         | Text noch Platzhalter |
| `/pfadihaus`                   | Pfadihaus mit Galerie, Karte und Belegungsplan    | fertig                |
| `/impressum`                   | Impressum                                         | fertig                |
| `/datenschutz`                 | Datenschutz                                       | fertig                |
| `/about`                       | Über uns                                          | nur Titel             |
| `/photos`                      | Bilder                                            | nur Titel             |
| `/downloads`                   | Downloads                                         | nur Titel             |
| `/shop`                        | Shop                                              | nur Titel             |
| `/join`                        | Mitglied werden                                   | nur Titel             |

### Admin

| Route             | Seite                                        | Stand  |
| ----------------- | -------------------------------------------- | ------ |
| `/admin/login`    | Login über MiData                            | fertig |
| `/auth/callback`  | OAuth2-Rücksprung                            | fertig |
| `/admin`          | Dashboard                                    | leer   |
| `/admin/stufen`   | Stufen verwalten, Leitungsteam zuweisen      | fertig |
| `/admin/uebungen` | Übungen anlegen, bearbeiten, veröffentlichen | fertig |
| `/admin/fotos`    | Fotos                                        | leer   |

Die Sidebar verlinkt zusätzlich auf `/admin/dokumente`, `/admin/settings`,
`/admin/help` und `/admin/search`. Für diese Pfade gibt es noch keine Routen,
die Links laufen ins Leere.

## Design-System

Alle Tokens stehen im `@theme`-Block in `src/styles.css` und sind damit als
Tailwind-Utilities verfügbar.

| Token             | Wert      | Verwendung                         |
| ----------------- | --------- | ---------------------------------- |
| `--color-primary` | `#ebc531` | Pfadi-Gelb, Überschriften, Akzente |
| `--color-accent`  | `#4251d5` | Links, Buttons                     |
| `--color-dark`    | `#373841` | Schriftfarbe                       |
| `--color-app-bg`  | `#f7f5ee` | Seitenhintergrund                  |
| `--color-biber`   | `#eac04a` | Stufenfarbe                        |
| `--color-woelfe`  | `#1380a3` | Stufenfarbe                        |
| `--color-pfader`  | `#b78e60` | Stufenfarbe                        |
| `--color-pios`    | `#bf2e26` | Stufenfarbe                        |

Die Klasse `.container` in `src/styles.css` setzt Breite und seitliches Padding
für alle öffentlichen Seiten und bringt eigene Breakpoints mit.

### Stufen

`src/app/shared/data/stufen.ts` ist die einzige Quelle für Name, Slug und Farbe
der vier Stufen. Die Startseite rendert diese Liste direkt, damit die Kacheln
unabhängig vom Backend stehen. Die Detailseite lädt die echten Inhalte und
fällt nur auf diese Werte zurück, wenn nichts geladen werden kann.

Der `slug` muss mit dem Backend übereinstimmen, denn er ist zugleich
URL-Segment und Schlüssel für den API-Aufruf. Stimmt er nicht, zeigt die
Detailseite dauerhaft den Platzhalter, ohne einen Fehler zu melden.

### hero-decoration

`<app-hero-decoration />` platziert Foto und Blob im Hero-Bereich. Die
Komponente positioniert sich absolut, deshalb muss die Seite drei Dinge
mitbringen:

- Der umschliessende `.container` braucht `relative` und
  `max-[1900px]:overflow-x-hidden`, sonst scrollt der Blob horizontal aus dem
  Viewport.
- Die Hero-Section darüber braucht `relative z-2` und genug `mb-*`, damit der
  folgende Inhalt unter der Dekoration durchläuft.
- Der Inhalt danach braucht `relative z-3`.

```html
<div class="container bg-app-bg relative flex flex-col max-[1900px]:overflow-x-hidden">
  <section class="pt-20 mb-112.5 relative z-2">...</section>
  <app-hero-decoration />
  <section class="relative z-3">...</section>
</div>
```

Über `topClass` lässt sich der vertikale Versatz anpassen, falls ein Hero höher
oder tiefer sitzt. Dabei immer beide Breakpoints angeben, etwa
`topClass="top-30 max-md:top-40"`.

## API-Client

`src/app/api` wird von ng-openapi-gen aus `openapi.json` erzeugt. Nach einer
Änderung am Backend die aktuelle Spezifikation ablegen und neu generieren:

```bash
npm run generate:api
```

Aufrufe laufen über `Api.invoke$Response(fn, params)` und geben Promises
zurück. Der Zustand liegt in den Signal-Stores unter `src/app/core/store`, nicht
in den Komponenten.

## spartan/ui

Die Komponenten unter `src/app/shared/ui` sind Kopien aus spartan/ui, keine
Abhängigkeit. Neue Komponenten hinzufügen:

```bash
npx ng g @spartan-ng/cli:ui
```

Nach einem Update von `@spartan-ng/brain` müssen die Kopien nachgezogen werden,
sonst passen sie nicht mehr zur Bibliothek:

```bash
npx ng g @spartan-ng/cli:migrate-helm-libraries
```

Die Pfade dieser Komponenten sind in `tsconfig.json` gemappt und werden von der
CLI mitgepflegt.

## Code-Konventionen

Das Projekt folgt den Angular-Standards ab Version 20 beziehungsweise 22:

- Standalone Components, kein `standalone: true` (seit v20 Standard)
- Kein explizites `changeDetection: ChangeDetectionStrategy.OnPush` (seit v22
  Standard); wer bewusst davon abweicht, setzt `Eager`
- Signals für Zustand, `computed()` für Abgeleitetes, `input()` und `output()`
  statt Dekoratoren, `viewChild()` statt `@ViewChild`
- `inject()` statt Constructor Injection
- Host-Bindings im `host`-Objekt, nicht über `@HostBinding` oder `@HostListener`
- Natives Control Flow (`@if`, `@for`, `@switch`)
- Class- und Style-Bindings statt `ngClass` und `ngStyle`
- Reactive Forms, keine Template-driven Forms
- Alle Feature-Routen per `loadComponent` lazy geladen
- `effect()` nur für die Synchronisation mit der Aussenwelt, nicht zum Nachladen
  von Daten

## Bewusste Entscheidungen

### Markenfarben vor Kontrastwerten

Die Website erfüllt WCAG 2.1 AA mit einer bewussten Ausnahme: den Markenfarben
als Schriftfarbe auf hellem Grund.

| Verwendung                                      | Kontrast        | AA   |
| ----------------------------------------------- | --------------- | ---- |
| `text-primary` (`#ebc531`) auf `--color-app-bg` | 1.53:1          | nein |
| `text-biber` (`#eac04a`) auf `--color-app-bg`   | 1.59:1          | nein |
| Stufenfarbe als Überschrift (Biber / Pfader)    | 1.59:1 / 2.73:1 | nein |
| Kachelbeschriftung auf Wölfe / Pios             | 2.57:1 / 2.01:1 | nein |

Wiedererkennung und Markenidentität wiegen hier schwerer als der Kontrastwert.
Diese Werte bitte nicht korrigieren, wenn ein Audit-Werkzeug wie Lighthouse
oder AXE sie meldet.

Alles Übrige ist umgesetzt: Tastaturbedienbarkeit, Fokus-Indikatoren,
`lang="de-CH"`, ein eigener Titel pro Route, Skip-Link, ARIA-Zustände in der
Navigation, Titel für alle iframes sowie ausreichende Kontraste bei allen
Texten, die keine Markenfarbe tragen.

### npm audit

`npm audit` meldet 12 High-Severity-Findings, die bewusst offen bleiben:

- Sie stammen ausschliesslich aus `@spartan-ng/cli` (devDependency) und dessen
  `nx`-Abhängigkeitsbaum (`brace-expansion`, `less` mit `image-size`).
- `npm audit --omit=dev` meldet 0 Vulnerabilities. Nichts davon landet im
  ausgelieferten Bundle.
- Es sind DoS-Advisories in Build-Werkzeugen, die nur bei bewusst bösartigen
  Eingaben an den Generator greifen.
- `npm audit fix` kann sie nicht beheben, weil `@spartan-ng/cli` seine
  `nx`-Version pinnt.

Vor einer Neubewertung zuerst `npm audit --omit=dev` prüfen. Solange das 0
meldet, besteht für die Website kein Handlungsbedarf.

### Offene Punkte

- Keine Unit-Tests im Projekt. Vor dem Aufbau sollte entschieden werden, ob auf
  den neuen Vitest-Builder gewechselt wird
  (`ng update @angular/cli --name migrate-karma-to-vitest`).
- Noch nicht auf Zoneless umgestellt: `app.config.ts` nutzt weiterhin
  `provideZoneChangeDetection`, `zone.js` steht noch in den Polyfills.
- Die v22-Migration hat `withXhr()` in `provideHttpClient` ergänzt und zwei
  Extended Diagnostics in `tsconfig.app.json` stummgeschaltet. Beides sind
  Kompatibilitäts-Schalter, die später entfernt werden können.
- Die Bilder unter `public/assets/images/pfadihaus/` sind unkomprimiert; allein
  `hero.png` wiegt rund 5,3 MB.

## CI

`.github/workflows/pr-validation.yml` läuft bei jedem Pull Request auf `main`
und `develop` und führt der Reihe nach Lint, Tests und einen Production-Build
aus. Entwickelt wird auf `develop`, `main` erhält die Änderungen per Pull
Request.

## Mitwirkende

- Mitja Kurath v/o Fox — Entwicklung ([mitjakurath.ch](https://mitjakurath.ch))
