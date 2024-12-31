import { jest } from '@jest/globals';
import type { BotAnalysis } from '../../types/profile.js';
import { UIManager } from '../ui-manager.js';

// Mock all the components and their methods
jest.mock('../ui/components/summary-panel.js', () => ({
  SummaryPanel: jest.fn(() => ({
    updateStats: jest.fn(),
    create: jest.fn(),
    updateTheme: jest.fn(),
    getElement: jest.fn()
  }))
}));

jest.mock('../ui/components/warning-indicator.js', () => ({
  WarningIndicator: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn()
  }))
}));

jest.mock('../ui/theme-manager.js', () => ({
  ThemeManager: jest.fn(() => ({
    onThemeChange: jest.fn(),
    isDarkMode: jest.fn()
  }))
}));

jest.mock('../ui/style-manager.js', () => ({
  StyleManager: jest.fn(() => ({
    injectStyles: jest.fn(),
    updateThemeVariables: jest.fn()
  }))
}));

describe('UIManager', () => {
  let uiManager: UIManager;
  let container: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    uiManager = new UIManager();
    container = document.createElement('div');
    container.setAttribute('data-testid', 'cellInnerDiv');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('addWarningIndicator', () => {
    it('should delegate to WarningIndicator', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern', 'No followers']
      };

      uiManager.addWarningIndicator(container, analysis);

      // Get the mock instance and verify the call
      const warningIndicator = uiManager['warningIndicator'];
      expect(warningIndicator.add).toHaveBeenCalledWith(container, analysis);
    });
  });

  describe('removeWarningIndicator', () => {
    it('should delegate to WarningIndicator', () => {
      uiManager.removeWarningIndicator(container);

      // Get the mock instance and verify the call
      const warningIndicator = uiManager['warningIndicator'];
      expect(warningIndicator.remove).toHaveBeenCalledWith(container);
    });
  });

  describe('updatePanelStats', () => {
    it('should delegate to SummaryPanel', () => {
      const stats = {
        highProbability: 5,
        mediumProbability: 3,
        lowProbability: 10
      };

      uiManager.updatePanelStats(stats);

      // Get the mock instance and verify the call
      const summaryPanel = uiManager['summaryPanel'];
      expect(summaryPanel.updateStats).toHaveBeenCalledWith(stats);
    });
  });

  describe('initialization', () => {
    it('should set up theme handling', () => {
      // Get the mock instances and verify the calls
      const themeManager = uiManager['themeManager'];
      const styleManager = uiManager['styleManager'];
      expect(themeManager.onThemeChange).toHaveBeenCalled();
      expect(styleManager.injectStyles).toHaveBeenCalled();
    });
  });
}); 