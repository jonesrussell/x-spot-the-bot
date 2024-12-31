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

  constructor() {
    console.debug('[XBot:Core] Initializing...');
    this.domExtractor = new DOMExtractor();
    this.profileAnalyzer = new ProfileAnalyzer();
    this.storageService = new StorageService();
    this.uiManager = new UIManager();
    this.init();
  }

  private async init() {
    const feed = await this.waitForNotificationsFeed();
    if (!feed) {
      console.debug('[XBot:Core] Could not find notifications feed after retries');
      return;
    }

    console.debug('[XBot:Core] Found notifications feed, starting observer');
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
      if (feed && feed instanceof HTMLElement) {
        console.debug('[XBot:Core] Found feed with selector:', selector);
        return feed;
      }
    }

    if (this.retryCount >= this.maxRetries) {
      return null;
    }

    console.debug('[XBot:Core] Feed not found, retrying in 1s');
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
              // Skip our warning elements and already processed nodes
              if (node.classList.contains('xbd-warning') || node.hasAttribute('data-xbot-processed')) {
                return;
              }

              console.debug('[XBot:Core] Processing new notification');
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
    console.debug('[XBot:Core] Scanning existing notifications...');
    const notifications = feed.querySelectorAll('[data-testid="cellInnerDiv"]');
    console.debug(`[XBot:Core] Found ${notifications.length} existing notifications`);
    
    if (notifications.length === 0) {
      console.debug('[XBot:Core] No existing notifications found');
      return;
    }

    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        this.processNotification(notification);
      }
    });
  }

  private async processNotification(notification: HTMLElement) {
    // Skip if already processed
    if (notification.hasAttribute('data-xbot-processed')) {
      return;
    }

    const profileData = this.domExtractor.extractProfileData(notification);
    if (!profileData) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    // Skip if we've already processed this username
    if (this.processedUsernames.has(profileData.username)) {
      console.debug('[XBot:Core] Skipping duplicate username:', profileData.username);
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    const analysis = await this.profileAnalyzer.analyzeBotProbability(profileData);
    
    // Only show warnings for high probability bots
    if (analysis.probability >= 0.6) {
      console.debug('[XBot:Core] High probability bot detected', {
        username: profileData.username,
        displayName: profileData.displayName,
        probability: analysis.probability,
        reasons: analysis.reasons
      });

      this.uiManager.addWarningIndicator(notification, analysis);
      await this.storageService.saveProfile(profileData);
    } else if (analysis.probability > 0) {
      console.debug('[XBot:Core] Low probability bot ignored', {
        username: profileData.username,
        probability: analysis.probability,
        reasons: analysis.reasons
      });
    }

    // Track processed username and mark element
    this.processedUsernames.add(profileData.username);
    notification.setAttribute('data-xbot-processed', 'true');
  }
}

// Initialize when the document is ready
if (document.readyState === 'loading') {
  console.debug('[XBot:Core] Waiting for document to load');
  document.addEventListener('DOMContentLoaded', () => {
    console.debug('[XBot:Core] Starting initialization');
    new BotDetector();
  });
} else {
  console.debug('[XBot:Core] Document already loaded, creating instance');
  new BotDetector();
}
