
import { ThemeJson, ThemeJsonSchema } from '@/types/theme';

export class ThemeService {
  private static readonly STORAGE_KEY = 'portal_themes';

  static validateTheme(themeData: any): { isValid: boolean; errors?: string[]; theme?: ThemeJson } {
    try {
      const theme = ThemeJsonSchema.parse(themeData);
      return { isValid: true, theme };
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => `${err.path.join('.')}: ${err.message}`) || ['Invalid theme format'];
      return { isValid: false, errors };
    }
  }

  static generateCSSFromTheme(theme: ThemeJson): string {
    const { colors, typography, spacing, components } = theme;
    
    return `
      :root {
        /* Colors */
        --theme-primary: ${colors.primary};
        --theme-secondary: ${colors.secondary};
        --theme-accent: ${colors.accent || colors.primary};
        --theme-background: ${colors.background};
        --theme-surface: ${colors.surface};
        --theme-text: ${colors.text};
        --theme-text-secondary: ${colors.textSecondary || colors.text};
        --theme-border: ${colors.border || '#e5e7eb'};
        --theme-success: ${colors.success || '#10b981'};
        --theme-warning: ${colors.warning || '#f59e0b'};
        --theme-error: ${colors.error || '#ef4444'};
        
        /* Typography */
        --theme-font-family: ${typography.fontFamily};
        --theme-font-size-xs: ${typography.fontSize.xs};
        --theme-font-size-sm: ${typography.fontSize.sm};
        --theme-font-size-base: ${typography.fontSize.base};
        --theme-font-size-lg: ${typography.fontSize.lg};
        --theme-font-size-xl: ${typography.fontSize.xl};
        --theme-font-size-2xl: ${typography.fontSize['2xl']};
        --theme-font-size-3xl: ${typography.fontSize['3xl']};
        
        /* Spacing */
        --theme-spacing-xs: ${spacing.xs};
        --theme-spacing-sm: ${spacing.sm};
        --theme-spacing-md: ${spacing.md};
        --theme-spacing-lg: ${spacing.lg};
        --theme-spacing-xl: ${spacing.xl};
        --theme-spacing-2xl: ${spacing['2xl']};
        
        /* Components */
        --theme-button-radius: ${components.button.borderRadius};
        --theme-button-padding: ${components.button.padding};
        --theme-card-radius: ${components.card.borderRadius};
        --theme-card-shadow: ${components.card.shadow};
        --theme-input-radius: ${components.input.borderRadius};
      }
      
      /* Custom CSS */
      ${theme.customCSS || ''}
    `;
  }

  static applyTheme(theme: ThemeJson): void {
    const css = this.generateCSSFromTheme(theme);
    
    // Remove existing theme style
    const existingStyle = document.getElementById('dynamic-theme');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Apply new theme
    const style = document.createElement('style');
    style.id = 'dynamic-theme';
    style.textContent = css;
    document.head.appendChild(style);
    
    console.log(`🎨 Applied theme: ${theme.name}`);
  }

  static exportTheme(theme: ThemeJson): void {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async importTheme(file: File): Promise<{ success: boolean; theme?: ThemeJson; error?: string }> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const validation = this.validateTheme(data);
      
      if (!validation.isValid) {
        return { success: false, error: validation.errors?.join('\n') };
      }
      
      return { success: true, theme: validation.theme };
    } catch (error) {
      return { success: false, error: 'Invalid JSON file' };
    }
  }

  static getStoredThemes(): ThemeJson[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveTheme(theme: ThemeJson): void {
    const themes = this.getStoredThemes();
    const existingIndex = themes.findIndex(t => t.name === theme.name);
    
    if (existingIndex >= 0) {
      themes[existingIndex] = theme;
    } else {
      themes.push(theme);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themes));
  }

  static deleteTheme(themeName: string): void {
    const themes = this.getStoredThemes().filter(t => t.name !== themeName);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themes));
  }
}
