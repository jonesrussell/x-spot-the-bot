import { UIManager } from '../ui-manager.js';
import { BotAnalysis } from '../../types/profile.js';

describe('UIManager', () => {
  let uiManager: UIManager;
  let container: HTMLElement;

  beforeEach(() => {
    uiManager = new UIManager();
    container = document.createElement('div');
    container.setAttribute('data-testid', 'cellInnerDiv');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('addWarningIndicator', () => {
    it('should add warning indicator for high probability bots', () => {
      const analysis: BotAnalysis = {
        probability: 0.8,
        reasons: ['Suspicious username pattern', 'No followers']
      };

      uiManager.addWarningIndicator(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('high-probability')).toBe(true);
      expect(warning?.textContent).toContain('Bot Account');
    });

    it('should add warning indicator for medium probability bots', () => {
      const analysis: BotAnalysis = {
        probability: 0.4,
        reasons: ['Suspicious username pattern']
      };

      uiManager.addWarningIndicator(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('medium-probability')).toBe(true);
      expect(warning?.textContent).toContain('Possible Bot');
    });

    it('should not add warning for low probability', () => {
      const analysis: BotAnalysis = {
        probability: 0.1,
        reasons: []
      };

      uiManager.addWarningIndicator(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).toBeNull();
    });

    it('should include detection reasons in warning', () => {
      const analysis: BotAnalysis = {
        probability: 0.8,
        reasons: ['Suspicious username pattern', 'No followers']
      };

      uiManager.addWarningIndicator(container, analysis);

      const reasons = container.querySelector('.xbd-warning-reasons');
      expect(reasons).not.toBeNull();
      expect(reasons?.textContent).toContain('Suspicious username pattern');
      expect(reasons?.textContent).toContain('No followers');
    });

    it('should not add duplicate warnings', () => {
      const analysis: BotAnalysis = {
        probability: 0.8,
        reasons: ['Suspicious username pattern']
      };

      // Add warning twice
      uiManager.addWarningIndicator(container, analysis);
      uiManager.addWarningIndicator(container, analysis);

      const warnings = container.querySelectorAll('.xbd-warning');
      expect(warnings.length).toBe(1);
    });
  });

  describe('removeWarningIndicator', () => {
    it('should remove existing warning indicator', () => {
      // First add a warning
      const analysis: BotAnalysis = {
        probability: 0.8,
        reasons: ['Suspicious username pattern']
      };
      uiManager.addWarningIndicator(container, analysis);

      // Then remove it
      uiManager.removeWarningIndicator(container);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).toBeNull();
    });

    it('should handle elements without warning indicators', () => {
      // Should not throw when no warning exists
      expect(() => {
        uiManager.removeWarningIndicator(container);
      }).not.toThrow();
    });
  });

  describe('updateStyles', () => {
    it('should add styles only once', () => {
      // Call updateStyles multiple times
      uiManager.updateStyles();
      uiManager.updateStyles();
      uiManager.updateStyles();

      const styleElements = document.querySelectorAll('style[data-xbot]');
      expect(styleElements.length).toBe(1);
    });

    it('should include all required CSS classes', () => {
      uiManager.updateStyles();

      const style = document.querySelector('style[data-xbot]');
      const cssText = style?.textContent || '';

      expect(cssText).toContain('.xbd-warning');
      expect(cssText).toContain('.high-probability');
      expect(cssText).toContain('.medium-probability');
      expect(cssText).toContain('.xbd-warning-reasons');
      expect(cssText).toContain('.xbd-reason');
    });
  });
}); 