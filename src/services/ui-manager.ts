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

    // Add warning text
    warning.textContent = analysis.probability >= this.HIGH_PROBABILITY_THRESHOLD
      ? '🤖 Bot Account'
      : '⚠️ Possible Bot';

    // Add tooltip with reasons
    if (analysis.reasons.length > 0) {
      const tooltip = document.createElement('div');
      tooltip.className = 'xbd-tooltip';
      tooltip.innerHTML = `
        <strong>Detection Reasons:</strong>
        <ul>
          ${analysis.reasons.map(reason => `<li>${reason}</li>`).join('')}
        </ul>
      `;
      warning.appendChild(tooltip);
    }

    // Insert warning at the top of the notification
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
        position: relative;
        padding: 8px;
        margin: 8px 0;
        border-radius: 4px;
        font-weight: bold;
        cursor: help;
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

      .xbd-tooltip {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        width: 250px;
        padding: 8px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-weight: normal;
        color: #333;
      }

      .xbd-warning:hover .xbd-tooltip {
        display: block;
      }

      .xbd-tooltip ul {
        margin: 4px 0;
        padding-left: 20px;
      }

      .xbd-tooltip li {
        margin: 2px 0;
      }
    `;

    document.head.appendChild(styles);
  }
}
