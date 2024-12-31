import type { BotAnalysis } from '../types/profile.js';

export class UIManager {
  private readonly CSS_ID = 'xbot-styles';
  private readonly HIGH_PROBABILITY_THRESHOLD = 0.6;
  private readonly MEDIUM_PROBABILITY_THRESHOLD = 0.3;

  constructor() {
    this.updateStyles();
  }

  public addWarningIndicator(element: HTMLElement, analysis: BotAnalysis): void {
    // Remove existing warning if any
    this.removeWarningIndicator(element);

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
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        padding: 4px 8px !important;
        margin: 4px !important;
        border-radius: 4px !important;
        display: flex !important;
        align-items: start !important;
        gap: 4px !important;
        font-size: 12px !important;
        z-index: 9999999 !important;
        background: var(--background-color, #fff) !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
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
        margin-top: 4px !important;
        color: var(--text-color, #666) !important;
        font-size: 11px !important;
        line-height: 1.4 !important;
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
