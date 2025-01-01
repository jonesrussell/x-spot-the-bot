export class FeedDetector {
  #observer: MutationObserver | null = null;
  #retryCount = 0;
  readonly #maxRetries = 10;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.#retryCount = 0;
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = null;
    }
  }

  public async findFeed(): Promise<HTMLElement | null> {
    const selectors = [
      '[aria-label="Timeline: Notifications"]',
      '[data-testid="primaryColumn"]',
      '[data-testid="notificationsTimeline"]',
      'section[role="region"]'
    ];

    for (const selector of selectors) {
      const feed = document.querySelector(selector);
      if (feed && feed instanceof HTMLElement) return feed;
    }

    if (this.#retryCount >= this.#maxRetries) return null;
    this.#retryCount++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.findFeed();
  }

  // eslint-disable-next-line no-unused-vars
  public observe(feed: HTMLElement, fn: (node: HTMLElement) => void): void {
    this.#observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              if (!node.classList.contains('xbd-warning') && !node.hasAttribute('data-xbot-processed')) {
                fn(node);
              }
            }
          });
        }
      }
    });

    this.#observer.observe(feed, {
      childList: true,
      subtree: true
    });
    console.debug('[XBot:Feed] Notification observer started');
  }

  // eslint-disable-next-line no-unused-vars
  public scanExisting(feed: HTMLElement, fn: (notification: HTMLElement) => void): void {
    const notifications = feed.querySelectorAll('[data-testid="cellInnerDiv"]');
    console.debug(`[XBot:Feed] Scanning ${notifications.length} existing notifications`);
    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        fn(notification);
      }
    });
  }
} 