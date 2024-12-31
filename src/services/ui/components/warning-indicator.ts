import type { BotAnalysis } from '../../../types/profile.js';

export class WarningIndicator {
  private readonly HIGH_PROBABILITY_THRESHOLD = 0.6;
  private readonly MEDIUM_PROBABILITY_THRESHOLD = 0.3;

  public add(element: HTMLElement, analysis: BotAnalysis): void {
    // Remove existing warning if any
    this.remove(element);

    // Create warning element
    const warning = document.createElement('div');
    warning.className = 'xbd-warning';
    warning.classList.add(this.getProbabilityClass(analysis.probability));

    // Add warning content
    warning.innerHTML = this.createWarningContent(analysis);

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

  public remove(element: HTMLElement): void {
    const warning = element.querySelector('.xbd-warning');
    if (warning) {
      warning.remove();
    }
  }

  private getProbabilityClass(probability: number): string {
    return probability >= this.HIGH_PROBABILITY_THRESHOLD
      ? 'high-probability'
      : probability >= this.MEDIUM_PROBABILITY_THRESHOLD
      ? 'medium-probability'
      : 'low-probability';
  }

  private getWarningIcon(probability: number): string {
    return probability >= this.HIGH_PROBABILITY_THRESHOLD
      ? '🤖'
      : probability >= this.MEDIUM_PROBABILITY_THRESHOLD
      ? '⚠️'
      : '✓';
  }

  private getWarningText(probability: number): string {
    return probability >= this.HIGH_PROBABILITY_THRESHOLD
      ? 'Bot Account'
      : probability >= this.MEDIUM_PROBABILITY_THRESHOLD
      ? 'Possible Bot'
      : 'Likely Real';
  }

  private createWarningContent(analysis: BotAnalysis): string {
    const icon = this.getWarningIcon(analysis.probability);
    const text = this.getWarningText(analysis.probability);
    const reasons = analysis.reasons.length > 0 
      ? analysis.reasons.map(reason => `<div class="xbd-reason">• ${reason}</div>`).join('')
      : '<div class="xbd-reason">• No suspicious patterns detected</div>';

    return `
      <div class="xbd-warning-icon">${icon}</div>
      <div class="xbd-warning-text">
        ${text}
        <div class="xbd-warning-reasons">
          ${reasons}
        </div>
      </div>
    `;
  }
} 