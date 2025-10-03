'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { applyThemeColors, resetThemeColors, loadSavedColors } from '@/lib/theme-utils';
import { 
  SwatchIcon, 
  ArrowPathIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

const presetColors: ColorScheme[] = [
  {
    name: 'Blue Ocean',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#ffffff',
    foreground: '#0f172a',
  },
  {
    name: 'Purple Dream',
    primary: '#8b5cf6',
    secondary: '#64748b',
    accent: '#ec4899',
    background: '#ffffff',
    foreground: '#0f172a',
  },
  {
    name: 'Green Nature',
    primary: '#10b981',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
  },
  {
    name: 'Orange Sunset',
    primary: '#f97316',
    secondary: '#64748b',
    accent: '#ef4444',
    background: '#ffffff',
    foreground: '#0f172a',
  },
  {
    name: 'Rose Gold',
    primary: '#e11d48',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
  },
];

export default function ColorCustomizer() {
  const [currentColors, setCurrentColors] = useState<ColorScheme>({
    name: 'Custom',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#ffffff',
    foreground: '#0f172a',
  });
  
  const [isApplying, setIsApplying] = useState(false);

  // โหลดสีที่บันทึกไว้
  useEffect(() => {
    const savedColors = loadSavedColors();
    if (savedColors) {
      setCurrentColors(prev => ({
        ...prev,
        ...savedColors,
        name: 'Custom'
      }));
    }
  }, []);



  // ฟังก์ชันใช้สีกับเว็บไซต์
  const handleApplyColors = (colorScheme: ColorScheme) => {
    setIsApplying(true);
    
    applyThemeColors({
      primary: colorScheme.primary,
      secondary: colorScheme.secondary,
      accent: colorScheme.accent,
    });
    
    setCurrentColors(colorScheme);
    
    setTimeout(() => {
      setIsApplying(false);
    }, 500);
  };

  // ฟังก์ชันรีเซ็ตเป็นสีเริ่มต้น
  const resetToDefault = () => {
    setIsApplying(true);
    resetThemeColors();
    
    const defaultColors = presetColors[0]; // Blue Ocean
    setCurrentColors(defaultColors);
    
    setTimeout(() => {
      setIsApplying(false);
    }, 500);
  };

  // ฟังก์ชันอัปเดตสีแต่ละตัว
  const updateColor = (colorKey: keyof Omit<ColorScheme, 'name'>, value: string) => {
    const newColors = {
      ...currentColors,
      name: 'Custom',
      [colorKey]: value,
    };
    setCurrentColors(newColors);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SwatchIcon className="h-5 w-5" />
          <span>ปรับแต่งสีของเว็บไซต์</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Colors */}
        <div>
          <Label className="text-sm font-medium mb-3 block">ชุดสีที่แนะนำ</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetColors.map((preset, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                onClick={() => handleApplyColors(preset)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{preset.name}</span>
                  {currentColors.name === preset.name && (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex space-x-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <Label className="text-sm font-medium mb-3 block">ปรับแต่งสีเอง</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary" className="text-sm">สีหลัก (Primary)</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="color"
                  id="primary"
                  value={currentColors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary" className="text-sm">สีรอง (Secondary)</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="color"
                  id="secondary"
                  value={currentColors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColors.secondary}
                  onChange={(e) => updateColor('secondary', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  placeholder="#64748b"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accent" className="text-sm">สีเน้น (Accent)</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="color"
                  id="accent"
                  value={currentColors.accent}
                  onChange={(e) => updateColor('accent', e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColors.accent}
                  onChange={(e) => updateColor('accent', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  placeholder="#06b6d4"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="background" className="text-sm">สีพื้นหลัง</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="color"
                  id="background"
                  value={currentColors.background}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColors.background}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-4 border-t">
          <Button
            onClick={() => handleApplyColors(currentColors)}
            disabled={isApplying}
            className="flex items-center space-x-2"
          >
            {isApplying ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <CheckIcon className="h-4 w-4" />
            )}
            <span>{isApplying ? 'กำลังใช้งาน...' : 'ใช้สีนี้'}</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={resetToDefault}
            className="flex items-center space-x-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>รีเซ็ตเป็นค่าเริ่มต้น</span>
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Label className="text-sm font-medium mb-2 block">ตัวอย่าง</Label>
          <div className="space-y-2">
            <div 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: currentColors.primary }}
            >
              ปุ่มหลัก (Primary Button)
            </div>
            <div 
              className="px-4 py-2 rounded border text-sm"
              style={{ 
                borderColor: currentColors.secondary,
                color: currentColors.secondary 
              }}
            >
              ปุ่มรอง (Secondary Button)
            </div>
            <div 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: currentColors.accent }}
            >
              ปุ่มเน้น (Accent Button)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}