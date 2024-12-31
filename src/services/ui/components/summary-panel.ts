interface PanelStats {
  highProbability: number;
  mediumProbability: number;
  lowProbability: number;
}

export class SummaryPanel {
  private panel: HTMLElement | null = null;
  private retryCount = 0;
  private readonly maxRetries = 10;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await this.create();

    if (!this.panel && this.retryCount < this.maxRetries) {
      console.debug('[XBot:UI] Feed not found, retrying panel creation in 1s');
      this.retryCount++;
      setTimeout(() => this.init(), 1000);
    }
  }

  public async create(): Promise<void> {
    const panel = document.createElement('div');
    panel.className = 'xbd-summary-panel r-1kqtdi0 r-1d2f490'; // Using X's classes

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
      this.panel = panel;
      console.debug('[XBot:UI] Summary panel created');
    }
  }

  public updateStats(stats: PanelStats): void {
    if (!this.panel) return;

    const highEl = this.panel.querySelector('#xbot-high');
    const mediumEl = this.panel.querySelector('#xbot-medium');
    const lowEl = this.panel.querySelector('#xbot-low');

    if (highEl) highEl.textContent = stats.highProbability.toString();
    if (mediumEl) mediumEl.textContent = stats.mediumProbability.toString();
    if (lowEl) lowEl.textContent = stats.lowProbability.toString();
  }

  public updateTheme(isDarkMode: boolean): void {
    if (!this.panel) return;
    
    this.panel.classList.remove('r-kemksi', 'r-14lw9ot');
    this.panel.classList.add(isDarkMode ? 'r-kemksi' : 'r-14lw9ot');
  }

  public getElement(): HTMLElement | null {
    return this.panel;
  }
} 