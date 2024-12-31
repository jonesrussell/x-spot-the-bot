import indicatorStyles from './styles/indicators.css?inline';
import panelStyles from './styles/panel.css?inline';

export class StyleManager {
  private readonly CSS_ID = 'xbot-styles';
  private stylesInjected = false;

  public injectStyles(): void {
    if (this.stylesInjected) return;

    const styles = document.createElement('style');
    styles.id = this.CSS_ID;
    styles.setAttribute('data-xbot', 'true');
    styles.textContent = [
      panelStyles,
      indicatorStyles
    ].join('\n');

    document.head.appendChild(styles);
    this.stylesInjected = true;
  }

  public updateThemeVariables(isDarkMode: boolean): void {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--background-color', '#000');
      root.style.setProperty('--text-color', '#999');
      root.style.setProperty('--high-probability-color', '#ff4444');
      root.style.setProperty('--medium-probability-color', '#ffaa44');
      root.style.setProperty('--low-probability-color', '#44cc44');
    } else {
      root.style.setProperty('--background-color', '#fff');
      root.style.setProperty('--text-color', '#666');
      root.style.setProperty('--high-probability-color', '#ff0000');
      root.style.setProperty('--medium-probability-color', '#ff8c00');
      root.style.setProperty('--low-probability-color', '#00aa00');
    }
  }
} 