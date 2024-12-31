import type { BotAnalysis } from '../types/profile.js';

interface PanelStats {
  highProbability: number;
  mediumProbability: number;
  lowProbability: number;
}

export class UIManager {
  private readonly CSS_ID = 'xbot-styles';
  private readonly HIGH_PROBABILITY_THRESHOLD = 0.6;
  private readonly MEDIUM_PROBABILITY_THRESHOLD = 0.3;
  private summaryPanel: HTMLElement | null = null;
  private retryCount = 0;
  private readonly maxRetries = 10;
  private stats = {
    high: 0,
    medium: 0,
    low: 0
  };

  constructor() {
    this.updateStyles();
    this.initSummaryPanel();
  }

  private async initSummaryPanel(): Promise<void> {
    // Try to create panel
    await this.createSummaryPanel();

    // If panel wasn't created and we haven't exceeded retries, try again
    if (!this.summaryPanel && this.retryCount < this.maxRetries) {
      console.debug('[XBot:UI] Feed not found, retrying panel creation in 1s');
      this.retryCount++;
      setTimeout(() => this.initSummaryPanel(), 1000);
    }
  }

  async createSummaryPanel(): Promise<void> {
    // Create summary panel
    const panel = document.createElement('div');
    panel.className = 'xbd-summary-panel r-1kqtdi0 r-1d2f490'; // Using X's classes

    // Add title and stats
    panel.innerHTML = `
      <div class="xbd-summary-title">🔍 Bot Detection Summary</div>
      <div class="xbd-summary-stats">
        <div class="xbd-stat high">
          <span class="xbd-stat-icon">🤖</span>
          <span>High Risk: <span id="xbot-high">0</span></span>
        </div>
        <div class="xbd-stat medium">
          <span class="xbd-stat-icon">⚠️</span>
          <span>Medium Risk: <span id="xbot-medium">0</span></span>
        </div>
        <div class="xbd-stat low">
          <span class="xbd-stat-icon">✓</span>
          <span>Likely Real: <span id="xbot-low">0</span></span>
        </div>
      </div>
    `;

    // Add theme-specific class
    const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark';
    panel.classList.add(isDarkMode ? 'r-kemksi' : 'r-14lw9ot');

    // Find feed and insert panel
    const feed = document.querySelector('[data-testid="primaryColumn"]');
    if (feed?.firstChild) {
      feed.insertBefore(panel, feed.firstChild);
      this.summaryPanel = panel;
      console.debug('[XBot:UI] Summary panel created');
    }
  }

  updatePanelStats(stats: PanelStats): void {
    if (!this.summaryPanel) return;

    const highEl = this.summaryPanel.querySelector('#xbot-high');
    const mediumEl = this.summaryPanel.querySelector('#xbot-medium');
    const lowEl = this.summaryPanel.querySelector('#xbot-low');

    if (highEl) highEl.textContent = stats.highProbability.toString();
    if (mediumEl) mediumEl.textContent = stats.mediumProbability.toString();
    if (lowEl) lowEl.textContent = stats.lowProbability.toString();
  }

  private updateStats(analysis: BotAnalysis): void {
    if (!this.summaryPanel) {
      return;
    }

    if (analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD) {
      this.stats.high++;
    } else if (analysis.probability >= this.MEDIUM_PROBABILITY_THRESHOLD) {
      this.stats.medium++;
    } else {
      this.stats.low++;
    }

    // Update panel counts
    const highEl = this.summaryPanel.querySelector('#xbot-high');
    const mediumEl = this.summaryPanel.querySelector('#xbot-medium');
    const lowEl = this.summaryPanel.querySelector('#xbot-low');

    if (highEl) highEl.textContent = this.stats.high.toString();
    if (mediumEl) mediumEl.textContent = this.stats.medium.toString();
    if (lowEl) lowEl.textContent = this.stats.low.toString();
  }

  public addWarningIndicator(element: HTMLElement, analysis: BotAnalysis): void {
    // Remove existing warning if any
    this.removeWarningIndicator(element);

    // Update stats
    this.updateStats(analysis);

    // Create warning element
    const warning = document.createElement('div');
    warning.className = 'xbd-warning';
    warning.classList.add(
      analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD
        ? 'high-probability'
        : analysis.probability >= this.MEDIUM_PROBABILITY_THRESHOLD
        ? 'medium-probability'
        : 'low-probability'
    );

    // Add warning content
    const icon = analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD
      ? '🤖'
      : analysis.probability >= this.MEDIUM_PROBABILITY_THRESHOLD
      ? '⚠️'
      : '✓';

    const text = analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD
      ? 'Bot Account'
      : analysis.probability >= this.MEDIUM_PROBABILITY_THRESHOLD
      ? 'Possible Bot'
      : 'Likely Real';

    warning.innerHTML = `
      <div class="xbd-warning-icon">${icon}</div>
      <div class="xbd-warning-text">
        ${text}
        <div class="xbd-warning-reasons">
          ${analysis.reasons.length > 0 
            ? analysis.reasons.map(reason => `<div class="xbd-reason">• ${reason}</div>`).join('')
            : '<div class="xbd-reason">• No suspicious patterns detected</div>'
          }
        </div>
      </div>
    `;

    // Find the username element to insert after
    const usernameElement = element.querySelector('[data-testid="User-Name"]') || 
                           element.querySelector('[data-testid="UserName"]');
    
    if (usernameElement?.parentElement) {
      // Insert warning after the username
      usernameElement.parentElement.insertBefore(warning, usernameElement.nextSibling);
      // Make sure the parent has relative positioning
      usernameElement.parentElement.style.position = 'relative';
    } else {
      // Fallback to inserting at the top of the notification
      element.style.position = 'relative';
      element.insertBefore(warning, element.firstChild);
    }
  }

  public removeWarningIndicator(element: HTMLElement): void {
    const warning = element.querySelector('.xbd-warning');
    if (warning) {
      warning.remove();
    }
  }

  public updateStyles(): void {
    // Don't add styles if they already exist
    if (document.getElementById(this.CSS_ID)) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = this.CSS_ID;
    styles.setAttribute('data-xbot', 'true');
    styles.textContent = `
      .xbd-summary-panel {
        position: sticky !important;
        top: 0 !important;
        background: #16181c !important;
        border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        padding: 16px !important;
        margin-bottom: 8px !important;
        z-index: 9999999 !important;
        font-size: 14px !important;
        color: #fff !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      }

      .xbd-summary-title {
        font-weight: bold !important;
        margin-bottom: 12px !important;
        font-size: 16px !important;
        color: #1d9bf0 !important;
      }

      .xbd-summary-stats {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
      }

      .xbd-stat {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      .xbd-stat.high {
        color: #ff4444 !important;
      }

      .xbd-stat.medium {
        color: #ffaa44 !important;
      }

      .xbd-stat.low {
        color: #44cc44 !important;
      }

      .xbd-stat-icon {
        font-size: 16px !important;
      }

      .xbd-warning {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        padding: 2px 6px !important;
        margin-left: 8px !important;
        border-radius: 4px !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
        vertical-align: middle !important;
        z-index: 9999999 !important;
        background: var(--background-color, #fff) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
      }

      .xbd-warning.high-probability {
        background-color: rgba(255, 0, 0, 0.1) !important;
        color: var(--high-probability-color, #ff0000) !important;
        border: 1px solid currentColor !important;
      }

      .xbd-warning.medium-probability {
        background-color: rgba(255, 165, 0, 0.1) !important;
        color: var(--medium-probability-color, #ff8c00) !important;
        border: 1px solid currentColor !important;
      }

      .xbd-warning.low-probability {
        background-color: rgba(0, 255, 0, 0.1) !important;
        color: var(--low-probability-color, #00aa00) !important;
        border: 1px solid currentColor !important;
        opacity: 0.7 !important;
      }

      .xbd-warning-icon {
        font-size: 14px !important;
        line-height: 1 !important;
      }

      .xbd-warning-text {
        font-weight: 500 !important;
      }

      .xbd-warning-reasons {
        display: none;
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        margin-top: 4px !important;
        padding: 8px !important;
        background: var(--background-color, #fff) !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        color: var(--text-color, #666) !important;
        font-size: 11px !important;
        line-height: 1.4 !important;
        white-space: nowrap !important;
        z-index: 9999999 !important;
      }

      .xbd-warning:hover {
        position: relative !important;
      }

      .xbd-warning:hover .xbd-warning-reasons {
        display: block !important;
      }

      .xbd-reason {
        white-space: nowrap !important;
      }

      @media (prefers-color-scheme: dark) {
        .xbd-warning {
          --background-color: #000;
          --text-color: #999;
          --high-probability-color: #ff4444;
          --medium-probability-color: #ffaa44;
          --low-probability-color: #44cc44;
        }
      }
    `;

    document.head.appendChild(styles);
  }
}
