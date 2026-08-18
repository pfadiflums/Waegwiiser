# Wägwiiser

Das Frontend-Projekt für die offizielle Website der **Pfadi St. Justus Flums**. Entwickelt mit Angular, kommuniziert mit einem separaten Backend-API für Inhalte und Daten.

---

## Tech Stack

| Technologie | Version |
|---|---|
| Angular | 22.1.2 |
| TypeScript | 6.0.3 |
| Tailwind CSS | 4.2.4 |
| spartan/ui (brain) | 1.3.1 |
| ng-icons | 33.2.2 |
| RxJS | 7.8.2 |

**Styling:** Tailwind CSS v4 mit einem einzigen Einstiegspunkt (`src/styles.css`). Alle Design Tokens sind als CSS-Variablen im `@theme`-Block definiert. spartan/ui wird ausschliesslich im Admin-Bereich verwendet.

---

## Seiten & Routen

| Route | Seite | Status |
|---|---|---|
| `/home` | Startseite | ✅ |
| `/stufe/:slug` | Stufen-Detail (Biber, Wölfe, Pfader, Pios) | ✅ |
| `/about` | Über uns | 🚧 |
| `/photos` | Bilder | 🚧 |
| `/downloads` | Downloads | 🚧 |
| `/shop` | Shop | 🚧 |
| `/pfadihaus` | Pfadihaus | 🚧 |
| `/join` | Mitglied werden | 🚧 |
| `/impressum` | Impressum | ✅ |
| `/datenschutz` | Datenschutz | ✅ |
| `/login` | Admin Login | ✅ |

---

## Features

### Implementiert

- **Navigation:** Responsive Navbar mit Hamburger-Menü für Mobile
- **Startseite:** Hero-Bereich, Stufen-Grid, Instagram-Bereich (Placeholder)
- **Stufen-Detail:** Nächste Übung mit Tabellenansicht, Google Calendar Embed, Team-Grid mit Mitgliedern und Leiterteam
- **Impressum & Datenschutz:** Vollständige rechtliche Seiten
- **Footer:** Links, Kontakt, soziale Netzwerke
- **Auth:** Login-Seite mit E-Mail/Passwort und MiData OAuth2

### In Arbeit

- Inhalt für About, Photos, Downloads, Shop, Pfadihaus, Join

### Geplant

- Bildergalerien
- SEO-Optimierung
- Barrierefreiheit (WCAG)
- Mehrsprachigkeit (DE)

---

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (http://localhost:4200)
npm start

# Production Build
npm run build

# Linting
npm run lint
```

### npm audit

`npm audit` meldet aktuell 12 High-Severity-Findings. Diese sind bewusst nicht
behoben:

- Sie stammen **ausschliesslich** aus `@spartan-ng/cli` (devDependency) und
  dessen `nx`-Abhängigkeitsbaum (`brace-expansion`, `less` → `image-size`).
- `npm audit --omit=dev` meldet **0 Vulnerabilities** – nichts davon landet im
  ausgelieferten Bundle.
- Es handelt sich um DoS-Advisories in Build-Werkzeugen, die nur bei bewusst
  bösartigen Eingaben an den Generator greifen.
- `npm audit fix` kann sie nicht beheben, da `@spartan-ng/cli` seine
  `nx`-Version pinnt.

Vor einer Neubewertung zuerst `npm audit --omit=dev` prüfen – solange das 0
meldet, besteht kein Handlungsbedarf für die Website.

### Barrierefreiheit & Markenfarben

Die Website erfuellt WCAG 2.1 AA mit einer **bewussten Ausnahme**: den
Markenfarben als Schriftfarbe auf hellem Grund.

| Verwendung | Kontrast | AA |
|---|---|---|
| `text-primary` (#ebc531) auf `--color-app-bg` | 1.53:1 | nein |
| `text-biber` (#eac04a) auf `--color-app-bg` | 1.59:1 | nein |
| Stufenfarbe als Ueberschrift (Biber / Pfader) | 1.59:1 / 2.73:1 | nein |
| Kachelbeschriftung auf Woelfe / Pios | 2.57:1 / 2.01:1 | nein |

Das ist **Absicht**: Wiedererkennung und Markenidentitaet wiegen hier schwerer
als der Kontrastwert. Diese Werte bitte nicht "korrigieren", wenn ein
Audit-Tool (Lighthouse, AXE) sie meldet.

Alles Uebrige ist umgesetzt: Tastaturbedienbarkeit, Fokus-Indikatoren,
`lang="de-CH"`, Titel pro Route, Skip-Link, ARIA-Zustaende in der
Navigation, iframe-Titel sowie ausreichende Kontraste bei allen **nicht** markenfarbenen
Texten.

---

## Projektstruktur

```
src/
├── app/
│   ├── api/                # Generierter API-Client (ng-openapi-gen, nicht editieren)
│   ├── core/               # Guards, Interceptors, Services, Signal-Stores
│   ├── feature/            # Feature-Seiten (public/, admin/)
│   ├── layout/             # Layout-Komponenten (public-layout, admin-layout)
│   └── shared/
│       ├── components/     # Shared Components (navbar, footer, hero-decoration)
│       └── ui/             # spartan/ui Komponenten (generiert, nicht editieren)
└── styles.css              # Globale Styles, Tailwind-Theme & Typografie
```

---

## Design Tokens

Alle Tokens sind als Tailwind CSS-Variablen in `src/styles.css` im `@theme`-Block definiert:

| Token | Wert | Verwendung |
|---|---|---|
| `--color-primary` | `#ebc531` | Pfadi-Gelb, Akzente |
| `--color-accent` | `#4251d5` | Links, Buttons |
| `--color-dark` | `#373841` | Textfarbe |
| `--color-app-bg` | `#f7f5ee` | Seitenhintergrund |
| `--color-biber` | `#eac04a` | Stufen-Farbe |
| `--color-woelfe` | `#1380a3` | Stufen-Farbe |
| `--color-pfader` | `#b78e60` | Stufen-Farbe |
| `--color-pios` | `#bf2e26` | Stufen-Farbe |

---

## Mitwirkende

- **Mitja Kurath** – Entwicklung ([mitjakurath.ch](https://mitjakurath.ch))
