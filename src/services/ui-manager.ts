import type { BotAnalysis } from '../types/profile.js';
import { SummaryPanel } from './ui/components/summary-panel.js';
import { WarningIndicator } from './ui/components/warning-indicator.js';
import { ThemeManager } from './ui/theme-manager.js';
import { StyleManager } from './ui/style-manager.js';

export class UIManager {
  private readonly summaryPanel: SummaryPanel;
  private readonly warningIndicator: WarningIndicator;
  private readonly themeManager: ThemeManager;
  private readonly styleManager: StyleManager;

  constructor() {
    this.summaryPanel = new SummaryPanel();
    this.warningIndicator = new WarningIndicator();
    this.themeManager = new ThemeManager();
    this.styleManager = new StyleManager();

    // Initialize styles
    this.styleManager.injectStyles();

    // Set up theme handling
    this.themeManager.onThemeChange((isDarkMode) => {
      this.styleManager.updateThemeVariables(isDarkMode);
    });
  }

  public addWarningIndicator(element: HTMLElement, analysis: BotAnalysis): void {
    this.warningIndicator.add(element, analysis);
  }

  public removeWarningIndicator(element: HTMLElement): void {
    this.warningIndicator.remove(element);
  }

  public updatePanelStats(stats: { highProbability: number; mediumProbability: number; lowProbability: number }): void {
    this.summaryPanel.updateStats(stats);
  }
}
