import { WarningIndicator } from '../warning-indicator.js';
import type { BotAnalysis } from '../../../../types/profile.js';

describe('WarningIndicator', () => {
  let indicator: WarningIndicator;
  let container: HTMLElement;
  let usernameElement: HTMLElement;

  beforeEach(() => {
    indicator = new WarningIndicator();
    container = document.createElement('div');
    
    // Create mock username element
    usernameElement = document.createElement('div');
    usernameElement.setAttribute('data-testid', 'User-Name');
    container.appendChild(usernameElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('add', () => {
    it('should add warning for high probability bots', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern', 'No followers']
      };

      indicator.add(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('high-probability')).toBe(true);
      expect(warning?.querySelector('.xbd-warning-icon')?.textContent).toBe('🤖');
      expect(warning?.querySelector('.xbd-warning-text')?.textContent).toContain('Bot Account');
    });

    it('should add warning for medium probability bots', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.4,
        reasons: ['Suspicious username pattern']
      };

      indicator.add(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('medium-probability')).toBe(true);
      expect(warning?.querySelector('.xbd-warning-icon')?.textContent).toBe('⚠️');
      expect(warning?.querySelector('.xbd-warning-text')?.textContent).toContain('Possible Bot');
    });

    it('should add checkmark for low probability', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.1,
        reasons: []
      };

      indicator.add(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning?.classList.contains('low-probability')).toBe(true);
      expect(warning?.querySelector('.xbd-warning-icon')?.textContent).toBe('✓');
      expect(warning?.querySelector('.xbd-warning-text')?.textContent).toContain('Likely Real');
    });

    it('should include detection reasons', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern', 'No followers']
      };

      indicator.add(container, analysis);

      const reasons = container.querySelector('.xbd-warning-reasons');
      expect(reasons).not.toBeNull();
      expect(reasons?.textContent).toContain('Suspicious username pattern');
      expect(reasons?.textContent).toContain('No followers');
    });

    it('should show default reason when no reasons provided', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.1,
        reasons: []
      };

      indicator.add(container, analysis);

      const reasons = container.querySelector('.xbd-warning-reasons');
      expect(reasons).not.toBeNull();
      expect(reasons?.textContent).toContain('No suspicious patterns detected');
    });

    it('should handle missing username element', () => {
      container.innerHTML = ''; // Remove username element
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern']
      };

      indicator.add(container, analysis);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).not.toBeNull();
      expect(warning).toBe(container.firstChild);
    });

    it('should not add duplicate warnings', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern']
      };

      // Add warning twice
      indicator.add(container, analysis);
      indicator.add(container, analysis);

      const warnings = container.querySelectorAll('.xbd-warning');
      expect(warnings.length).toBe(1);
    });
  });

  describe('remove', () => {
    it('should remove existing warning', () => {
      // First add a warning
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern']
      };
      indicator.add(container, analysis);

      // Then remove it
      indicator.remove(container);

      const warning = container.querySelector('.xbd-warning');
      expect(warning).toBeNull();
    });

    it('should handle elements without warning', () => {
      // Should not throw when no warning exists
      expect(() => {
        indicator.remove(container);
      }).not.toThrow();
    });
  });
}); 