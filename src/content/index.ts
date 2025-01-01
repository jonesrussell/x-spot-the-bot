import { DOMExtractor } from '../services/dom-extractor.js';
import { ProfileAnalyzer } from '../services/profile-analyzer.js';
import { StorageService } from '../services/storage.js';
import { UIManager } from '../services/ui-manager.js';

export class BotDetector {
  private domExtractor: DOMExtractor;
  private profileAnalyzer: ProfileAnalyzer;
  private storageService: StorageService;
  private uiManager: UIManager;
  private observer: MutationObserver | null = null;
  private retryCount = 0;
  private maxRetries = 10;
  private processedUsernames = new Set<string>();
  private stats = {
    highProbability: 0,
    mediumProbability: 0,
    lowProbability: 0
  };

  constructor() {
    console.debug('[XBot] Extension loaded - Version 1.0.0');
    this.domExtractor = new DOMExtractor();
    this.profileAnalyzer = new ProfileAnalyzer();
    this.storageService = new StorageService();
    this.uiManager = new UIManager();
    this.init();
  }

  private async init(): Promise<void> {
    const feed = await this.waitForNotificationsFeed();
    if (!feed) return;
    this.setupObserver(feed);
    this.scanExistingNotifications(feed);
  }

  private async waitForNotificationsFeed(): Promise<HTMLElement | null> {
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

    if (this.retryCount >= this.maxRetries) return null;
    this.retryCount++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.waitForNotificationsFeed();
  }

  private setupObserver(feed: HTMLElement): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              if (node.classList.contains('xbd-warning') || node.hasAttribute('data-xbot-processed')) {
                return;
              }
              this.processNotification(node);
            }
          });
        }
      }
    });

    this.observer.observe(feed, {
      childList: true,
      subtree: true
    });
  }

  private scanExistingNotifications(feed: HTMLElement): void {
    const notifications = feed.querySelectorAll('[data-testid="cellInnerDiv"]');
    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        this.processNotification(notification);
      }
    });
  }

  private async processNotification(notification: HTMLElement): Promise<void> {
    if (notification.hasAttribute('data-xbot-processed')) return;

    const profileData = this.domExtractor.extractProfileData(notification);
    if (!profileData) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    if (this.processedUsernames.has(profileData.username)) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    const analysis = await this.profileAnalyzer.analyzeProfile(profileData);
    
    this.uiManager.addWarningIndicator(notification, {
      username: profileData.username,
      probability: analysis.probability,
      reasons: analysis.reasons
    });

    if (analysis.probability >= 0.6) {
      await this.storageService.saveProfile(profileData);
    }

    if (analysis.probability >= 0.6) this.stats.highProbability++;
    else if (analysis.probability >= 0.3) this.stats.mediumProbability++;
    else this.stats.lowProbability++;

    this.uiManager.updatePanelStats(this.stats);
    this.processedUsernames.add(profileData.username);
    notification.setAttribute('data-xbot-processed', 'true');
  }
}

// Initialize when the document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BotDetector();
  });
} else {
  new BotDetector();
}
