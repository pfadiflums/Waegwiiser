# Wägwiiser

Das Frontend-Projekt für die offizielle Website der **Pfadi St. Justus Flums**. Entwickelt mit Angular, kommuniziert mit einem separaten Backend-API für Inhalte und Daten.

---

## Tech Stack

| Technologie | Version |
|---|---|
| Angular | 21.1.2 |
| TypeScript | ~5.9.2 |
| Tailwind CSS | 4.1.16 |
| Lucide Angular (Icons) | 1.0.0 |
| RxJS | ~7.8.0 |

**Styling:** SCSS mit CSS-Variablen und Custom Design Tokens. Tailwind CSS ist installiert, Migration läuft noch.

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

- **Navigation:** Responsive Navbar mit Hamburger-Menü für Mobile, Dropdown-Unterstützung
- **Startseite:** Hero-Bereich, Stufen-Grid, Instagram-Bereich (Placeholder)
- **Stufen-Detail:** Nächste Übung mit Tabellenansicht, Google Calendar Embed, Team-Grid mit Mitgliedern und Leiterteam
- **Impressum & Datenschutz:** Vollständige rechtliche Seiten
- **Footer:** Links, Kontakt, soziale Netzwerke
- **Auth:** Login-Seite mit E-Mail/Passwort und MiData OAuth2

### In Arbeit

- Inhalt für About, Photos, Downloads, Shop, Pfadihaus, Join
- Tailwind CSS Migration (geplant auf Branch `feature/tailwindcss-migration`)

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
│   ├── layout/             # Layout-Komponenten (public-layout)
│   └── services/           # Angular Services (auth, etc.)
├── styles.scss             # Globale Styles & Typografie
├── tailwind.css            # Tailwind CSS Entry (v4)
└── _variables.scss         # Design Tokens (Farben, Abstände, Breakpoints)
```

---

## Design Tokens

| Token | Wert | Verwendung |
|---|---|---|
| `$color-primary` | `#ebc531` | Pfadi-Gelb, Akzente |
| `$color-accent` | `#4251d5` | Links, Buttons |
| `$color-dark` | `#373841` | Textfarbe |
| `$color-bg` | `#f7f5ee` | Seitenhintergrund |
| Biber | `#EAC04A` | Stufen-Farbe |
| Wölfe | `#1380A3` | Stufen-Farbe |
| Pfader | `#B78E60` | Stufen-Farbe |
| Pios | `#BF2E26` | Stufen-Farbe |

---

## Mitwirkende

- **Mitja Kurath** – Entwicklung ([mitjakurath.ch](https://mitjakurath.ch))
