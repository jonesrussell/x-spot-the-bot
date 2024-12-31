import { DOMExtractor } from '../services/dom-extractor.js';
import { ProfileAnalyzer } from '../services/profile-analyzer.js';
import { StorageService } from '../services/storage.js';
import { UIManager } from '../services/ui-manager.js';

class BotDetector {
  private domExtractor: DOMExtractor;
  private profileAnalyzer: ProfileAnalyzer;
  private storageService: StorageService;
  private uiManager: UIManager;
  private observer: MutationObserver | null = null;
  private retryCount = 0;
  private maxRetries = 10;

  constructor() {
    console.debug('BotDetector: Initializing...');
    this.domExtractor = new DOMExtractor();
    this.profileAnalyzer = new ProfileAnalyzer();
    this.storageService = new StorageService();
    this.uiManager = new UIManager();
    this.init();
  }

  private async init() {
    const feed = await this.waitForNotificationsFeed();
    if (!feed) {
      console.debug('BotDetector: Could not find notifications feed after retries');
      return;
    }

    console.debug('BotDetector: Found notifications feed, starting observer');
    this.setupObserver(feed);
    this.scanExistingNotifications(feed);
  }

  private async waitForNotificationsFeed(): Promise<HTMLElement | null> {
    // Try multiple selectors in order of specificity
    const selectors = [
      '[aria-label="Timeline: Notifications"]',
      '[data-testid="primaryColumn"]',
      '[data-testid="notificationsTimeline"]',
      'section[role="region"]'
    ];

    for (const selector of selectors) {
      const feed = document.querySelector(selector);
      if (feed && feed instanceof HTMLElement) {
        console.debug('BotDetector: Found feed with selector:', selector);
        return feed;
      }
    }

    if (this.retryCount >= this.maxRetries) {
      return null;
    }

    console.debug('BotDetector: Feed not found, retrying in 1s');
    this.retryCount++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.waitForNotificationsFeed();
  }

  private setupObserver(feed: HTMLElement) {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              console.debug('BotDetector: Found new notification cell');
              console.debug('Cell HTML:', node.outerHTML);
              console.debug('Cell data-testids:', 
                Array.from(node.querySelectorAll('[data-testid]'))
                  .map(el => el.getAttribute('data-testid'))
              );
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

  private scanExistingNotifications(feed: HTMLElement) {
    console.debug('BotDetector: Scanning existing notifications...');
    const notifications = feed.querySelectorAll('[data-testid="cellInnerDiv"]');
    console.debug(`BotDetector: Found ${notifications.length} existing notifications`);
    
    if (notifications.length === 0) {
      console.debug('BotDetector: No existing notifications found');
      return;
    }

    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        this.processNotification(notification);
      }
    });
  }

  private async processNotification(notification: HTMLElement) {
    const profileData = this.domExtractor.extractProfileData(notification);
    if (!profileData) {
      console.debug('BotDetector: Could not extract profile data');
      return;
    }

    const analysis = await this.profileAnalyzer.analyzeBotProbability(profileData);
    if (analysis.probability > 0.5) {
      this.uiManager.showWarning(notification, analysis);
      await this.storageService.recordSuspiciousProfile(profileData);
    }
  }
}

// Initialize when the document is ready
if (document.readyState === 'loading') {
  console.debug('BotDetector: Waiting for document to load');
  document.addEventListener('DOMContentLoaded', () => {
    console.debug('BotDetector: Starting initialization');
    new BotDetector();
  });
} else {
  console.debug('BotDetector: Document already loaded, creating instance');
  new BotDetector();
}
