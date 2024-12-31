import { jest } from '@jest/globals';
import type { BotAnalysis } from '../../types/profile.js';
import { UIManager } from '../ui-manager.js';

// Mock components with virtual modules
jest.mock('../ui/components/summary-panel', () => ({
  SummaryPanel: jest.fn().mockImplementation(() => ({
    updateStats: jest.fn(),
    create: jest.fn(),
    updateTheme: jest.fn(),
    getElement: jest.fn()
  }))
}), { virtual: true });

jest.mock('../ui/components/warning-indicator', () => ({
  WarningIndicator: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn()
  }))
}), { virtual: true });

// Mock managers with virtual modules
jest.mock('../ui/theme-manager', () => ({
  ThemeManager: jest.fn().mockImplementation(() => ({
    onThemeChange: jest.fn(),
    isDarkMode: jest.fn()
  }))
}), { virtual: true });

jest.mock('../ui/style-manager', () => ({
  StyleManager: jest.fn().mockImplementation(() => ({
    injectStyles: jest.fn(),
    updateThemeVariables: jest.fn()
  }))
}), { virtual: true });

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
    jest.clearAllMocks();
  });

  describe('addWarningIndicator', () => {
    it('should delegate to WarningIndicator', () => {
      const analysis: BotAnalysis = {
        username: 'testuser',
        probability: 0.8,
        reasons: ['Suspicious username pattern', 'No followers']
      };

      uiManager.addWarningIndicator(container, analysis);

      // Verify WarningIndicator.add was called with correct params
      expect(uiManager['warningIndicator'].add).toHaveBeenCalledWith(container, analysis);
    });
  });

  describe('removeWarningIndicator', () => {
    it('should delegate to WarningIndicator', () => {
      uiManager.removeWarningIndicator(container);

      // Verify WarningIndicator.remove was called with correct params
      expect(uiManager['warningIndicator'].remove).toHaveBeenCalledWith(container);
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

      // Verify SummaryPanel.updateStats was called with correct params
      expect(uiManager['summaryPanel'].updateStats).toHaveBeenCalledWith(stats);
    });
  });

  describe('initialization', () => {
    it('should set up theme handling', () => {
      // Verify ThemeManager.onThemeChange was called
      expect(uiManager['themeManager'].onThemeChange).toHaveBeenCalled();

      // Verify StyleManager.injectStyles was called
      expect(uiManager['styleManager'].injectStyles).toHaveBeenCalled();
    });
  });
}); 