// eslint-disable-next-line no-unused-vars
type ThemeChangeCallback = (isDarkMode: boolean) => void;

export class ThemeManager {
  private callbacks: ThemeChangeCallback[] = [];

  constructor() {
    this.watchThemeChanges();
  }

  public isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-color-mode') === 'dark';
  }

  public onThemeChange(callback: ThemeChangeCallback): void {
    this.callbacks.push(callback);
    // Call immediately with current theme
    callback(this.isDarkMode());
  }

  private watchThemeChanges(): void {
    // Watch for theme attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-color-mode'
        ) {
          const isDarkMode = this.isDarkMode();
          this.notifyThemeChange(isDarkMode);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-mode']
    });

    // Initial theme check
    this.notifyThemeChange(this.isDarkMode());
  }

  private notifyThemeChange(isDarkMode: boolean): void {
    this.callbacks.forEach(callback => callback(isDarkMode));
  }
} 