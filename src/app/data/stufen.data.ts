export interface StufeConfig {
  slug: string;
  name: string;
  slogan: string;
  color: string;
}

export const STUFEN: StufeConfig[] = [
  { slug: 'biber',  name: 'Biberstufe',  slogan: 'Mit Freude Dabei', color: '#eac04a' },
  { slug: 'woelfe', name: 'Wolfsstufe',  slogan: 'Mis Bescht',       color: '#1380a3' },
  { slug: 'pfader', name: 'Pfaderstufe', slogan: 'Allzeit Bereit',   color: '#b78e60' },
  { slug: 'pios',   name: 'Piostufe',    slogan: 'Zäme Wyter!',      color: '#bf2e26' },
];

export const STUFEN_BY_SLUG: Record<string, StufeConfig> = Object.fromEntries(
  STUFEN.map(s => [s.slug, s])
);
