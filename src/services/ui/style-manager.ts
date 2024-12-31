import indicatorStyles from './styles/indicators.css?raw';
import panelStyles from './styles/panel.css?raw';

export class StyleManager {
  private readonly CSS_ID = 'xbot-styles';
  private stylesInjected = false;

  public injectStyles(): void {
    if (this.stylesInjected) return;

    const styles = document.createElement('style');
    styles.id = this.CSS_ID;
    styles.setAttribute('data-xbot', 'true');
    
    // In test environment, use mock styles
    const isTestEnv = import.meta.env.MODE === 'test';
    const panelCss = isTestEnv ? '.xbd-summary-panel { color: red; }' : panelStyles;
    const indicatorCss = isTestEnv ? '.xbd-warning { color: blue; }' : indicatorStyles;
    
    styles.textContent = `${panelCss}\n${indicatorCss}`;

    document.head.appendChild(styles);
    this.stylesInjected = true;
  }

  public updateThemeVariables(isDarkMode: boolean): void {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--background-color', '#15202b');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--high-probability-color', '#ff3333');
      root.style.setProperty('--medium-probability-color', '#ffa500');
      root.style.setProperty('--low-probability-color', '#33cc33');
    } else {
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--high-probability-color', '#cc0000');
      root.style.setProperty('--medium-probability-color', '#ff8c00');
      root.style.setProperty('--low-probability-color', '#008800');
    }
  }
} 