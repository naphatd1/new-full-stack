// Utility functions for theme management

export const resetThemeColors = () => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  // Remove custom color properties
  root.style.removeProperty('--primary');
  root.style.removeProperty('--secondary');
  root.style.removeProperty('--accent');
  root.style.removeProperty('--primary-foreground');
  
  // Clear localStorage
  localStorage.removeItem('customColors');
};

export const applyThemeColors = (colors: {
  primary: string;
  secondary: string;
  accent: string;
}) => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };
  
  // Apply colors
  root.style.setProperty('--primary', hexToHsl(colors.primary));
  root.style.setProperty('--secondary', hexToHsl(colors.secondary));
  root.style.setProperty('--accent', hexToHsl(colors.accent));
  
  // Save to localStorage
  localStorage.setItem('customColors', JSON.stringify(colors));
};

export const loadSavedColors = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem('customColors');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading saved colors:', error);
    return null;
  }
};

export const initializeTheme = () => {
  if (typeof window === 'undefined') return;
  
  const savedColors = loadSavedColors();
  if (savedColors) {
    applyThemeColors(savedColors);
  }
};