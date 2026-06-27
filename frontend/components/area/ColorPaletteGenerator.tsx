const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const sanitized = hex.replace('#', '');
  return {
    r: parseInt(sanitized.substring(0, 2), 16),
    g: parseInt(sanitized.substring(2, 4), 16),
    b: parseInt(sanitized.substring(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`.toUpperCase();
};

/** Vmíchá bílou (amount 0–1) do barvy */
const tint = (r: number, g: number, b: number, amount: number) => ({
  r: r + (255 - r) * amount,
  g: g + (255 - g) * amount,
  b: b + (255 - b) * amount,
});

/** Vmíchá černou (amount 0–1) do barvy */
const shade = (r: number, g: number, b: number, amount: number) => ({
  r: r * (1 - amount),
  g: g * (1 - amount),
  b: b * (1 - amount),
});

export const mixWithWhite = (hex: string, amount: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
};

export const mixWithBlack = (hex: string, amount: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c * (1 - amount)).toString(16).padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
};

export interface GeneratedPalette {
  primary: string;   // původní barva
  secondary: string; // světlá varianta (tint)
  accent: string;    // tmavá varianta (shade)
}

export const generatePalette = (hexColor: string): GeneratedPalette => {
  const rgb = hexToRgb(hexColor);

  const { r, g, b } = rgb;

  const primary = hexColor.startsWith('#')
    ? hexColor.toUpperCase()
    : `#${hexColor}`.toUpperCase();

  // světlá: vmíchat ~55 % bílé  →  #BD9554 dá přibližně #F0E1C7
  const light = tint(r, g, b, 0.55);
  const secondary = rgbToHex(light.r, light.g, light.b);

  // tmavá: vmíchat ~20 % černé  →  #BD9554 dá přibližně #975F43... upravit dle potřeby
  const dark = shade(r, g, b, 0.20);
  const accent = rgbToHex(dark.r, dark.g, dark.b);

  return { primary, secondary, accent };
};