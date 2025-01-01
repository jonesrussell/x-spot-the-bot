import * as indicatorStyles from './styles/indicators.css';
import * as panelStyles from './styles/panel.css';

export class StyleManager {
  #stylesInjected = false;

  public injectStyles(): void {
    if (this.#stylesInjected) return;

    const style = document.createElement('style');
    style.textContent = `${panelStyles}\n${indicatorStyles}`;
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