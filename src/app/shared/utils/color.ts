/**
 * WCAG-Kontrast-Helfer.
 *
 * Die Stufen-Farben (`primaryColor`) kommen aus der Datenbank und koennen im
 * Admin frei gesetzt werden. Fest verdrahtete Textfarben wuerden dort still
 * Kontrastfehler erzeugen, darum werden sie hier berechnet.
 *
 * Rechenweg nach WCAG 2.1 (relative Luminanz, Schwellen 4.5:1 fuer normalen
 * Text und 3:1 fuer grossen Text ab 18.66px fett bzw. 24px).
 */

/** Heller Seitenhintergrund des oeffentlichen Bereichs (--color-app-bg). */
export const APP_BG = '#f7f5ee';

export const INK_DARK = '#373841';
export const INK_LIGHT = '#ffffff';

/** WCAG-Schwellwerte. */
export const AA_NORMAL = 4.5;
export const AA_LARGE = 3;

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
}

/** Relative Luminanz nach WCAG 2.1. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhaeltnis zweier Farben, immer >= 1. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Waehlt die besser lesbare Textfarbe fuer einen farbigen Hintergrund
 * (z.B. die Stufen-Kacheln auf der Startseite).
 */
export function readableInk(background: string): string {
  return contrastRatio(INK_DARK, background) >= contrastRatio(INK_LIGHT, background)
    ? INK_DARK
    : INK_LIGHT;
}

/**
 * Dunkelt eine Farbe so weit ab, bis sie auf `background` das geforderte
 * Kontrastverhaeltnis erreicht. Der Farbton bleibt dabei erhalten, weil alle
 * Kanaele gleichmaessig skaliert werden. Gibt die Originalfarbe zurueck, wenn
 * sie den Schwellwert bereits erfuellt.
 */
export function ensureReadable(color: string, background: string, target = AA_NORMAL): string {
  if (contrastRatio(color, background) >= target) {
    return color;
  }

  let rgb = toRgb(color);
  // 60 Schritte a 4% reichen von jeder Startfarbe bis nahezu Schwarz.
  for (let i = 0; i < 60; i++) {
    rgb = [rgb[0] * 0.96, rgb[1] * 0.96, rgb[2] * 0.96];
    const candidate = toHex(rgb);
    if (contrastRatio(candidate, background) >= target) {
      return candidate;
    }
  }
  return INK_DARK;
}
