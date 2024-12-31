import { SummaryPanel } from '../summary-panel.js';

describe('SummaryPanel', () => {
  let panel: SummaryPanel;
  let feed: HTMLElement;

  beforeEach(() => {
    panel = new SummaryPanel();
    
    // Create mock feed
    feed = document.createElement('div');
    feed.setAttribute('data-testid', 'primaryColumn');
    feed.appendChild(document.createElement('div')); // Add firstChild
    document.body.appendChild(feed);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('create', () => {
    it('should create panel with correct styling', async () => {
      await panel.create();
      const element = panel.getElement();
      expect(element).not.toBeNull();
      expect(element?.classList.contains('r-1kqtdi0')).toBe(true); // X's sticky class
      expect(element?.classList.contains('r-1d2f490')).toBe(true); // X's z-index class
    });

    it('should handle dark mode', async () => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      await panel.create();
      const element = panel.getElement();
      expect(element?.classList.contains('r-kemksi')).toBe(true); // X's dark theme bg class
    });

    it('should handle light mode', async () => {
      document.documentElement.setAttribute('data-color-mode', 'light');
      await panel.create();
      const element = panel.getElement();
      expect(element?.classList.contains('r-14lw9ot')).toBe(true); // X's light theme bg class
    });
  });

  describe('updateStats', () => {
    it('should update statistics correctly', async () => {
      await panel.create();
      panel.updateStats({
        highProbability: 5,
        mediumProbability: 3,
        lowProbability: 10
      });

      const element = panel.getElement();
      const highEl = element?.querySelector('#xbot-high');
      const mediumEl = element?.querySelector('#xbot-medium');
      const lowEl = element?.querySelector('#xbot-low');

      expect(highEl?.textContent).toBe('5');
      expect(mediumEl?.textContent).toBe('3');
      expect(lowEl?.textContent).toBe('10');
    });

    it('should handle missing panel gracefully', () => {
      // Should not throw when panel doesn't exist
      expect(() => {
        panel.updateStats({
          highProbability: 5,
          mediumProbability: 3,
          lowProbability: 10
        });
      }).not.toThrow();
    });
  });

  describe('updateTheme', () => {
    it('should update theme classes', async () => {
      await panel.create();
      const element = panel.getElement();

      panel.updateTheme(true);
      expect(element?.classList.contains('r-kemksi')).toBe(true);
      expect(element?.classList.contains('r-14lw9ot')).toBe(false);

      panel.updateTheme(false);
      expect(element?.classList.contains('r-kemksi')).toBe(false);
      expect(element?.classList.contains('r-14lw9ot')).toBe(true);
    });

    it('should handle missing panel gracefully', () => {
      // Should not throw when panel doesn't exist
      expect(() => {
        panel.updateTheme(true);
      }).not.toThrow();
    });
  });
}); 