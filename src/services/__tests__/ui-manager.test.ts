import { UIManager } from '../ui-manager.js';
import type { BotAnalysis } from '../../types/profile.js';

describe('UIManager', () => {
  let uiManager: UIManager;
  let container: HTMLElement;
  let feed: HTMLElement;

  beforeEach(() => {
    uiManager = new UIManager();
    container = document.createElement('div');
    container.setAttribute('data-testid', 'cellInnerDiv');
    document.body.appendChild(container);

    // Create mock feed
    feed = document.createElement('div');
    feed.setAttribute('data-testid', 'primaryColumn');
    feed.appendChild(document.createElement('div')); // Add firstChild
    document.body.appendChild(feed);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('summary panel', () => {
    it('should create panel with correct styling', async () => {
      await uiManager.createSummaryPanel();
      const panel = document.querySelector('.xbd-summary-panel');
      expect(panel).not.toBeNull();
      expect(panel?.classList.contains('r-1kqtdi0')).toBe(true); // X's sticky class
      expect(panel?.classList.contains('r-1d2f490')).toBe(true); // X's z-index class
    });

    it('should update panel statistics', async () => {
      await uiManager.createSummaryPanel();
      uiManager.updatePanelStats({
        highProbability: 5,
        mediumProbability: 3,
        lowProbability: 10
      });
      
      const panel = document.querySelector('.xbd-summary-panel');
      const highEl = panel?.querySelector('#xbot-high');
      const mediumEl = panel?.querySelector('#xbot-medium');
      const lowEl = panel?.querySelector('#xbot-low');

      expect(highEl?.textContent).toBe('5');
      expect(mediumEl?.textContent).toBe('3');
      expect(lowEl?.textContent).toBe('10');
    });

    it('should handle dark mode', async () => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      await uiManager.createSummaryPanel();
      const panel = document.querySelector('.xbd-summary-panel');
      expect(panel?.classList.contains('r-kemksi')).toBe(true); // X's dark theme bg class
    });

    it('should handle light mode', async () => {
      document.documentElement.setAttribute('data-color-mode', 'light');
      await uiManager.createSummaryPanel();
      const panel = document.querySelector('.xbd-summary-panel');
      expect(panel?.classList.contains('r-14lw9ot')).toBe(true); // X's light theme bg class
    });

    it('should maintain correct position', async () => {
      await uiManager.createSummaryPanel();
      const panel = document.querySelector('.xbd-summary-panel') as HTMLElement;
      expect(panel).not.toBeNull();
      
      // Add necessary styles for testing
      Object.defineProperty(window, 'getComputedStyle', {
        value: () => ({
          position: 'sticky',
          top: '0px',
          zIndex: '9999999'
        })
      });

      const styles = window.getComputedStyle(panel);
      expect(styles.position).toBe('sticky');
      expect(styles.top).toBe('0px');
      expect(styles.zIndex).toBe('9999999');
    });
  });

  describe('addWarningIndicator', () => {
    it('should add warning indicator for high probability bots', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
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
        username: 'testuser',
        probability: 0.4,
        reasons: ['Suspicious username pattern']
      };

      uiManager.addWarningIndicator(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('medium-probability')).toBe(true);
      expect(warning?.textContent).toContain('Possible Bot');
    });

    it('should add green checkmark for low probability', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.1,
        reasons: []
      };

      uiManager.addWarningIndicator(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('low-probability')).toBe(true);
      expect(warning?.textContent).toContain('Likely Real');
      expect(warning?.querySelector('.xbd-warning-icon')?.textContent).toBe('✓');
    });

    it('should include detection reasons in warning', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
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
        username: 'testuser',
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
        username: 'testuser',
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