import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeManager } from '../theme-manager.js';

describe('ThemeManager', () => {
  let themeManager: ThemeManager;

  beforeEach(() => {
    document.documentElement.style.cssText = '';
    themeManager = new ThemeManager();
  });

  describe('updateTheme', () => {
    it('should set dark theme variables', () => {
      themeManager.updateTheme(true);
      expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#15202b');
      expect(document.documentElement.style.getPropertyValue('--text-color')).toBe('#999999');
      expect(document.documentElement.style.getPropertyValue('--high-probability-color')).toBe('#ff4444');
      expect(document.documentElement.style.getPropertyValue('--medium-probability-color')).toBe('#ffaa44');
    });

    it('should set light theme variables', () => {
      themeManager.updateTheme(false);
      expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#ffffff');
      expect(document.documentElement.style.getPropertyValue('--text-color')).toBe('#666666');
      expect(document.documentElement.style.getPropertyValue('--high-probability-color')).toBe('#ff0000');
      expect(document.documentElement.style.getPropertyValue('--medium-probability-color')).toBe('#ff8c00');
    });
  });
}); 