import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StyleManager } from '../style-manager.js';

vi.mock('../styles/indicators.css', () => ({
  default: '.xbd-warning { color: blue; }'
}));

vi.mock('../styles/panel.css', () => ({
  default: '.xbd-summary-panel { color: red; }'
}));

describe('StyleManager', () => {
  let styleManager: StyleManager;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.documentElement.style.cssText = '';
    styleManager = new StyleManager();
  });

  describe('injectStyles', () => {
    it('should inject styles only once', () => {
      styleManager.injectStyles();
      const initialStyleCount = document.head.getElementsByTagName('style').length;
      styleManager.injectStyles();
      expect(document.head.getElementsByTagName('style').length).toBe(initialStyleCount);
    });

    it('should include panel and indicator styles', () => {
      styleManager.injectStyles();
      const styles = document.head.getElementsByTagName('style');
      expect(styles.length).toBeGreaterThan(0);
      const style = styles[0];
      expect(style?.textContent).toContain('.xbd-summary-panel');
      expect(style?.textContent).toContain('.xbd-warning');
    });

    it('should add styles to document head', () => {
      styleManager.injectStyles();
      expect(document.head.getElementsByTagName('style')).toHaveLength(1);
    });
  });

  describe('updateThemeVariables', () => {
    it('should set dark theme variables', () => {
      styleManager.updateThemeVariables(true);
      expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#15202b');
      expect(document.documentElement.style.getPropertyValue('--text-color')).toBe('#999999');
      expect(document.documentElement.style.getPropertyValue('--high-probability-color')).toBe('#ff4444');
      expect(document.documentElement.style.getPropertyValue('--medium-probability-color')).toBe('#ffaa44');
    });

    it('should set light theme variables', () => {
      styleManager.updateThemeVariables(false);
      expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#ffffff');
      expect(document.documentElement.style.getPropertyValue('--text-color')).toBe('#666666');
      expect(document.documentElement.style.getPropertyValue('--high-probability-color')).toBe('#ff0000');
      expect(document.documentElement.style.getPropertyValue('--medium-probability-color')).toBe('#ff8c00');
    });
  });
}); 