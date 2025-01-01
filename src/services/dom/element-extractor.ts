export class ElementExtractor {
  static readonly #SELECTORS = {
    CELL: '[data-testid="cellInnerDiv"]',
    NOTIFICATION: 'article',
    USER_LINK: 'a[role="link"]',
    USER_NAME: '[data-testid="User-Name"]',
    USER_AVATAR: 'img[src*="profile_images"]',
    NOTIFICATION_TEXT: '[data-testid="notificationText"]',
    TWEET_TEXT: '[data-testid="tweetText"]',
    VERIFIED_ICON: '[data-testid="icon-verified"]'
  } as const;

  public extractNotificationCell(element: HTMLElement): HTMLElement | null {
    if (element.classList.contains('xbd-warning')) return null;
    const cell = element.closest(ElementExtractor.#SELECTORS.CELL);
    if (!cell || !(cell instanceof HTMLElement)) return null;
    return cell;
  }

  public extractNotificationArticle(cell: HTMLElement): HTMLElement | null {
    const article = cell.querySelector(ElementExtractor.#SELECTORS.NOTIFICATION);
    if (!article || !(article instanceof HTMLElement)) return null;
    return article;
  }

  public extractNotificationText(article: HTMLElement): string | null {
    const notificationText = article.querySelector(ElementExtractor.#SELECTORS.NOTIFICATION_TEXT);
    const text = (notificationText?.textContent ?? article.textContent ?? '').toLowerCase();
    return text || null;
  }

  public extractUserLinks(article: HTMLElement): HTMLAnchorElement[] {
    return [...article.querySelectorAll<HTMLAnchorElement>(ElementExtractor.#SELECTORS.USER_LINK)]
      .filter(link => {
        const href = link.getAttribute('href');
        return href?.startsWith('/') && 
               !href.includes('/i/') && 
               !href.includes('/status/') &&
               !href.includes('/lists/') &&
               !href.includes('/topics/');
      });
  }

  public extractProfileImages(cell: HTMLElement): HTMLImageElement[] {
    return [...cell.querySelectorAll<HTMLImageElement>(ElementExtractor.#SELECTORS.USER_AVATAR)]
      .filter(img => img.src);
  }

  public isVerified(element: HTMLElement): boolean {
    return !!element.querySelector(ElementExtractor.#SELECTORS.VERIFIED_ICON);
  }
} 