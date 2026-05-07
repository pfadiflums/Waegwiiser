# Wägwiiser

Das Frontend-Projekt für die offizielle Website der **Pfadi St. Justus Flums**. Entwickelt mit Angular, kommuniziert mit einem separaten Backend-API für Inhalte und Daten.

---

## Tech Stack

| Technologie | Version |
|---|---|
| Angular | 21.1.2 |
| TypeScript | ~5.9.2 |
| Tailwind CSS | 4.1.16 |
| spartan/ui | – |
| Lucide Angular (Icons) | 1.0.0 |
| RxJS | ~7.8.0 |

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

---

## Projektstruktur

```
src/
├── app/
│   ├── components/         # Shared Components (navbar, footer)
│   ├── feature/            # Feature-Module (home, stufe-detail, etc.)
│   ├── layout/             # Layout-Komponenten (public-layout, admin-layout)
│   └── services/           # Angular Services (auth, etc.)
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
