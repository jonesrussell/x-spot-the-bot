import { jest } from '@jest/globals';

// Mock CSS imports
const mockPanelStyles = '.xbd-summary-panel { color: red; }';
const mockIndicatorStyles = '.xbd-warning { color: blue; }';

// Mock the CSS imports before importing the StyleManager
jest.mock('../styles/panel.css?inline', () => ({
  __esModule: true,
  default: mockPanelStyles
}), { virtual: true });

jest.mock('../styles/indicators.css?inline', () => ({
  __esModule: true,
  default: mockIndicatorStyles
}), { virtual: true });

import { StyleManager } from '../style-manager.js';

describe('StyleManager', () => {
  let styleManager: StyleManager;

  beforeEach(() => {
    styleManager = new StyleManager();
    document.head.innerHTML = ''; // Clear any existing styles
  });

  describe('injectStyles', () => {
    it('should inject styles only once', () => {
      styleManager.injectStyles();
      styleManager.injectStyles();
      styleManager.injectStyles();

      const styleElements = document.querySelectorAll('style[data-xbot]');
      expect(styleElements.length).toBe(1);
    });

    it('should include panel and indicator styles', () => {
      styleManager.injectStyles();

      const style = document.querySelector('style[data-xbot]');
      const cssText = style?.textContent || '';

      // Panel styles
      expect(cssText).toContain('.xbd-summary-panel');
      expect(cssText).toContain('color: red');

      // Indicator styles
      expect(cssText).toContain('.xbd-warning');
      expect(cssText).toContain('color: blue');
    });

    it('should add styles to document head', () => {
      styleManager.injectStyles();
      const style = document.head.querySelector('style[data-xbot]');
      expect(style).not.toBeNull();
    });
  });

  describe('updateThemeVariables', () => {
    beforeEach(() => {
      // Reset CSS variables
      document.documentElement.style.removeProperty('--background-color');
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--high-probability-color');
      document.documentElement.style.removeProperty('--medium-probability-color');
      document.documentElement.style.removeProperty('--low-probability-color');
    });

    it('should set dark theme variables', () => {
      styleManager.updateThemeVariables(true);

      expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#000');
      expect(document.documentElement.style.getPropertyValue('--text-color')).toBe('#999');
      expect(document.documentElement.style.getPropertyValue('--high-probability-color')).toBe('#ff4444');
      expect(document.documentElement.style.getPropertyValue('--medium-probability-color')).toBe('#ffaa44');
      expect(document.documentElement.style.getPropertyValue('--low-probability-color')).toBe('#44cc44');
    });

    it('should set light theme variables', () => {
      styleManager.updateThemeVariables(false);

      expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#fff');
      expect(document.documentElement.style.getPropertyValue('--text-color')).toBe('#666');
      expect(document.documentElement.style.getPropertyValue('--high-probability-color')).toBe('#ff0000');
      expect(document.documentElement.style.getPropertyValue('--medium-probability-color')).toBe('#ff8c00');
      expect(document.documentElement.style.getPropertyValue('--low-probability-color')).toBe('#00aa00');
    });
  });
}); 