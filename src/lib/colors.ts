export function mapColorName(colorName?: string): string {
  if (!colorName) return '#f3f4f6'; // Neutral light gray fallback

  const name = colorName.toLowerCase().trim();
  
  const map: Record<string, string> = {
    red: '#f87171',
    blue: '#60a5fa',
    green: '#4ade80',
    yellow: '#fde047',
    orange: '#fb923c',
    purple: '#c084fc',
    pink: '#f472b6',
    black: '#1f2937',
    white: '#ffffff',
    gray: '#9ca3af',
    brown: '#78350f',
  };

  // Check if it's already a hex
  if (name.startsWith('#')) return name;

  // Try to find a match, or fallback to neutral
  for (const [key, hex] of Object.entries(map)) {
    if (name.includes(key)) return hex;
  }

  return '#f3f4f6'; // Neutral fallback
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Parse hex to rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getContrastTextColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#1f2937'; // Default dark text
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  // WCAG recommendation: if luminance > 0.179, use dark text, else light text
  return luminance > 0.179 ? '#1f2937' : '#ffffff';
}
