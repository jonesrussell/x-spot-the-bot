
export class StyleManager {
  #stylesInjected = false;

  public injectStyles(): void {
    if (this.#stylesInjected) return;

    const style = document.createElement('style');
    style.textContent = [
      '.xbd-summary-panel { position: sticky !important; top: 0 !important; background: #16181c !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; padding: 16px !important; margin-bottom: 8px !important; z-index: 9999999 !important; font-size: 14px !important; color: #fff !important; box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important; }',
      '.xbd-summary-title { font-weight: bold !important; margin-bottom: 12px !important; font-size: 16px !important; color: #1d9bf0 !important; }',
      '.xbd-summary-stats { display: flex !important; flex-direction: column !important; gap: 8px !important; }',
      '.xbd-stat { display: flex !important; align-items: center !important; gap: 8px !important; }',
      '.xbd-stat.high { color: #ff4444 !important; }',
      '.xbd-stat.medium { color: #ffaa44 !important; }',
      '.xbd-stat.low { color: #44cc44 !important; }',
      '.xbd-stat-icon { font-size: 16px !important; }',
      '.xbd-warning { display: inline-flex !important; align-items: center !important; gap: 4px !important; padding: 2px 6px !important; margin-left: 8px !important; border-radius: 4px !important; font-size: 12px !important; line-height: 1.2 !important; vertical-align: middle !important; z-index: 9999999 !important; background: var(--background-color, #fff) !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important; }',
      '.xbd-warning.high-probability { background-color: rgba(255, 0, 0, 0.1) !important; color: var(--high-probability-color, #ff0000) !important; border: 1px solid currentColor !important; }',
      '.xbd-warning.medium-probability { background-color: rgba(255, 165, 0, 0.1) !important; color: var(--medium-probability-color, #ff8c00) !important; border: 1px solid currentColor !important; }',
      '.xbd-warning.low-probability { background-color: rgba(0, 255, 0, 0.1) !important; color: var(--low-probability-color, #00aa00) !important; border: 1px solid currentColor !important; opacity: 0.7 !important; }',
      '.xbd-warning-icon { font-size: 14px !important; line-height: 1 !important; }',
      '.xbd-warning-text { font-weight: 500 !important; }',
      '.xbd-warning-reasons { display: none; position: absolute !important; top: 100% !important; left: 0 !important; margin-top: 4px !important; padding: 8px !important; background: var(--background-color, #fff) !important; border-radius: 4px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important; color: var(--text-color, #666) !important; font-size: 11px !important; line-height: 1.4 !important; white-space: nowrap !important; z-index: 9999999 !important; }',
      '.xbd-warning:hover { position: relative !important; }',
      '.xbd-warning:hover .xbd-warning-reasons { display: block !important; }',
      '.xbd-reason { white-space: nowrap !important; }',
      '@media (prefers-color-scheme: dark) { .xbd-warning { --background-color: #000; --text-color: #999; --high-probability-color: #ff4444; --medium-probability-color: #ffaa44; --low-probability-color: #44cc44; } }'
    ].join('\n');
    document.head.appendChild(style);
    this.#stylesInjected = true;
  }

  public updateThemeVariables(isDarkMode: boolean): void {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--background-color', '#15202b');
      root.style.setProperty('--text-color', '#999999');
      root.style.setProperty('--high-probability-color', '#ff4444');
      root.style.setProperty('--medium-probability-color', '#ffaa44');
    } else {
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#666666');
      root.style.setProperty('--high-probability-color', '#ff0000');
      root.style.setProperty('--medium-probability-color', '#ff8c00');
    }
  }
} 