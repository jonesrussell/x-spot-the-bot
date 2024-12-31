import { jest } from '@jest/globals';
import { ThemeManager } from '../theme-manager.js';

describe('ThemeManager', () => {
  let themeManager: ThemeManager;
  // eslint-disable-next-line no-unused-vars
  let triggerMutation: (mutations: MutationRecord[]) => void;

  beforeEach(() => {
    // Mock MutationObserver
    // eslint-disable-next-line no-unused-vars
    const mockObserver = jest.fn((callback: (mutations: MutationRecord[]) => void) => {
      triggerMutation = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn()
      };
    });
    global.MutationObserver = mockObserver as unknown as typeof MutationObserver;

    document.documentElement.removeAttribute('data-color-mode');
    themeManager = new ThemeManager();
  });

  describe('isDarkMode', () => {
    it('should detect dark mode', () => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      expect(themeManager.isDarkMode()).toBe(true);
    });

    it('should detect light mode', () => {
      document.documentElement.setAttribute('data-color-mode', 'light');
      expect(themeManager.isDarkMode()).toBe(false);
    });

    it('should handle missing theme attribute', () => {
      expect(themeManager.isDarkMode()).toBe(false);
    });
  });

  describe('onThemeChange', () => {
    it('should call callback when theme changes', () => {
      const callback = jest.fn();
      themeManager.onThemeChange(callback);

      // Change to dark mode
      document.documentElement.setAttribute('data-color-mode', 'dark');
      triggerMutation?.([{
        type: 'attributes',
        attributeName: 'data-color-mode',
        target: document.documentElement
      } as unknown as MutationRecord]);
      expect(callback).toHaveBeenLastCalledWith(true);

      // Change to light mode
      document.documentElement.setAttribute('data-color-mode', 'light');
      triggerMutation?.([{
        type: 'attributes',
        attributeName: 'data-color-mode',
        target: document.documentElement
      } as unknown as MutationRecord]);
      expect(callback).toHaveBeenLastCalledWith(false);
    });

    it('should call callback immediately with current theme', () => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      const callback = jest.fn();
      themeManager.onThemeChange(callback);
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('should support multiple callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      themeManager.onThemeChange(callback1);
      themeManager.onThemeChange(callback2);

      document.documentElement.setAttribute('data-color-mode', 'dark');
      triggerMutation?.([{
        type: 'attributes',
        attributeName: 'data-color-mode',
        target: document.documentElement
      } as unknown as MutationRecord]);
      expect(callback1).toHaveBeenCalledWith(true);
      expect(callback2).toHaveBeenCalledWith(true);
    });

    it('should ignore non-theme attribute changes', () => {
      const callback = jest.fn();
      themeManager.onThemeChange(callback);
      callback.mockClear(); // Clear initial call

      document.documentElement.setAttribute('some-other-attr', 'value');
      triggerMutation?.([{
        type: 'attributes',
        attributeName: 'some-other-attr',
        target: document.documentElement
      } as unknown as MutationRecord]);
      expect(callback).not.toHaveBeenCalled();
    });
  });
}); 