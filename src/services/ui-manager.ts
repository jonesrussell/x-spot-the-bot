import { BotAnalysis } from '../types/profile.js';

export class UIManager {
  private readonly CSS_ID = 'xbot-styles';
  private readonly HIGH_PROBABILITY_THRESHOLD = 0.6;
  private readonly MEDIUM_PROBABILITY_THRESHOLD = 0.3;

  constructor() {
    this.updateStyles();
  }

  public addWarningIndicator(element: HTMLElement, analysis: BotAnalysis): void {
    // Don't add warning for low probability
    if (analysis.probability < this.MEDIUM_PROBABILITY_THRESHOLD) {
      return;
    }

    // Remove existing warning if any
    this.removeWarningIndicator(element);

    // Create warning element
    const warning = document.createElement('div');
    warning.className = 'xbd-warning';
    warning.classList.add(
      analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD
        ? 'high-probability'
        : 'medium-probability'
    );

    // Add warning content
    warning.innerHTML = `
      <div class="xbd-warning-icon">${analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD ? '🤖' : '⚠️'}</div>
      <div class="xbd-warning-text">
        ${analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD ? 'Bot Account' : 'Possible Bot'}
        <div class="xbd-warning-reasons">
          ${analysis.reasons.map(reason => `<div class="xbd-reason">• ${reason}</div>`).join('')}
        </div>
      </div>
    `;

    // Insert warning at the top of the notification
    element.style.position = 'relative';
    element.insertBefore(warning, element.firstChild);
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
      .xbd-warning {
        position: absolute;
        top: 0;
        right: 0;
        padding: 4px 8px;
        margin: 4px;
        border-radius: 4px;
        display: flex;
        align-items: start;
        gap: 4px;
        font-size: 12px;
        z-index: 1000;
      }

      .xbd-warning.high-probability {
        background-color: rgba(255, 0, 0, 0.1);
        color: #ff0000;
        border: 1px solid #ff0000;
      }

      .xbd-warning.medium-probability {
        background-color: rgba(255, 165, 0, 0.1);
        color: #ff8c00;
        border: 1px solid #ff8c00;
      }

      .xbd-warning-icon {
        font-size: 14px;
      }

      .xbd-warning-reasons {
        display: none;
        margin-top: 4px;
        color: #666;
      }

      .xbd-warning:hover .xbd-warning-reasons {
        display: block;
      }

      .xbd-reason {
        font-size: 11px;
        line-height: 1.4;
      }
    `;

    document.head.appendChild(styles);
  }
}
