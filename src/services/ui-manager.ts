export class UIManager {
  private static styleAdded = false;

  public addBotWarningUI(element: HTMLElement, probability: number, reasons: string[]): void {
    this.ensureStyles();

    const warningDiv = document.createElement('div');
    warningDiv.className = 'xbd-warning';
    warningDiv.innerHTML = `
      <div class="xbd-warning-icon">🤖</div>
      <div class="xbd-warning-text">
        Possible Bot (${Math.round(probability * 100)}%)
        <div class="xbd-warning-reasons">
          ${reasons.map(reason => `<div class="xbd-reason">• ${reason}</div>`).join('')}
        </div>
      </div>
    `;

    element.style.position = 'relative';
    element.appendChild(warningDiv);
  }

  private ensureStyles(): void {
    if (UIManager.styleAdded) return;

    const style = document.createElement('style');
    style.textContent = `
      .xbd-warning {
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(255, 0, 0, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: start;
        gap: 4px;
        font-size: 12px;
        z-index: 1000;
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

    document.head.appendChild(style);
    UIManager.styleAdded = true;
  }
}
