import { useEffect, useState, useCallback } from 'react';

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export const useThemeColors = () => {
  const [colors, setColors] = useState<ColorScheme | null>(null);

  // ฟังก์ชันแปลงสี hex เป็น HSL
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

  // ฟังก์ชันใช้สีกับเว็บไซต์
  const applyColors = useCallback((colorScheme: ColorScheme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // แปลงสีเป็น HSL และใช้กับ CSS variables
    root.style.setProperty('--primary', hexToHsl(colorScheme.primary));
    root.style.setProperty('--secondary', hexToHsl(colorScheme.secondary));
    root.style.setProperty('--accent', hexToHsl(colorScheme.accent));
    
    // เก็บสีเดิมไว้สำหรับ primary-foreground
    root.style.setProperty('--primary-foreground', '210 40% 98%');
    
    // บันทึกสีลง localStorage
    localStorage.setItem('customColors', JSON.stringify(colorScheme));
    setColors(colorScheme);
  }, []);

  // โหลดสีที่บันทึกไว้เมื่อ component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      try {
        const colorScheme = JSON.parse(savedColors);
        setColors(colorScheme);
        applyColors(colorScheme);
      } catch (error) {
        console.error('Error loading saved colors:', error);
      }
    }

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const savedColors = localStorage.getItem('customColors');
          if (savedColors) {
            try {
              const colorScheme = JSON.parse(savedColors);
              applyColors(colorScheme);
            } catch (error) {
              console.error('Error reapplying colors:', error);
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [applyColors]);

  return {
    colors,
    applyColors,
    hexToHsl,
  };
};