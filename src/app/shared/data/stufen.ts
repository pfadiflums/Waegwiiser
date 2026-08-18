export interface StaticStufe {
  slug: string;
  name: string;
  primaryColor: string;
}

export const STUFEN: readonly StaticStufe[] = [
  { slug: 'biber', name: 'Biberstufe', primaryColor: '#eac04a' },
  { slug: 'woelfe', name: 'Wolfsstufe', primaryColor: '#1380a3' },
  { slug: 'pfader', name: 'Pfaderstufe', primaryColor: '#b78e60' },
  { slug: 'pios', name: 'Piostufe', primaryColor: '#bf2e26' },
] as const;

export const STUFE_PLACEHOLDER_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ' +
  'eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam ' +
  'voluptua. At vero eos et accusam et justo duo dolores et ea rebum.';

export function findStufe(slug: string): StaticStufe | undefined {
  return STUFEN.find((stufe) => stufe.slug === slug);
}
