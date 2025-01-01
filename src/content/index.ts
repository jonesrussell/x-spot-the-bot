import { DOMExtractor } from '../services/dom-extractor.js';
import { ProfileAnalyzer } from '../services/profile-analyzer.js';
import { StorageService } from '../services/storage.js';
import { UIManager } from '../services/ui-manager.js';
import type { ProfileData } from '../types/profile.js';

console.log('[XBot] Content script loaded - X Spot The Bot v1.0.0');

export class BotDetector {
  #domExtractor: DOMExtractor;
  #profileAnalyzer: ProfileAnalyzer;
  #storageService: StorageService;
  #uiManager: UIManager;
  #observer: MutationObserver | null = null;
  #retryCount = 0;
  #maxRetries = 10;
  #processedUsernames = new Set<string>();
  #stats = {
    highProbability: 0,
    mediumProbability: 0,
    lowProbability: 0
  };
  #lastSummaryTime = 0;
  readonly #SUMMARY_INTERVAL = 2000; // Log summary every 2 seconds

  constructor() {
    this.resetState();
    console.debug('[XBot] Extension initialized');
    this.#domExtractor = new DOMExtractor();
    this.#profileAnalyzer = new ProfileAnalyzer();
    this.#storageService = new StorageService();
    this.#uiManager = new UIManager();
    this.init();
  }

  private resetState(): void {
    this.#processedUsernames.clear();
    this.#stats = {
      highProbability: 0,
      mediumProbability: 0,
      lowProbability: 0
    };
    this.#lastSummaryTime = 0;
    this.#retryCount = 0;
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = null;
    }
  }

  private async init(): Promise<void> {
    const feed = await this.waitForNotificationsFeed();
    if (!feed) {
      console.warn('[XBot] Failed to find notifications feed after max retries');
      return;
    }
    console.debug('[XBot] Found notifications feed, starting detection');
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

    if (this.#retryCount >= this.#maxRetries) return null;
    this.#retryCount++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.waitForNotificationsFeed();
  }

  private setupObserver(feed: HTMLElement): void {
    this.#observer = new MutationObserver((mutations) => {
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

    this.#observer.observe(feed, {
      childList: true,
      subtree: true
    });
    console.debug('[XBot] Notification observer started');
  }

  private scanExistingNotifications(feed: HTMLElement): void {
    const notifications = feed.querySelectorAll('[data-testid="cellInnerDiv"]');
    console.debug(`[XBot] Scanning ${notifications.length} existing notifications`);
    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        this.processNotification(notification);
      }
    });
  }

  private logSummary(): void {
    const now = Date.now();
    if (now - this.#lastSummaryTime < this.#SUMMARY_INTERVAL) return;
    
    const total = this.#processedUsernames.size;
    if (total === 0) return;

    console.log('[XBot] Bot Detection Summary:',
      `\n🔍 Total Analyzed: ${total}`,
      `\n🤖 High Risk: ${this.#stats.highProbability}`,
      `\n⚠️ Medium Risk: ${this.#stats.mediumProbability}`,
      `\n✓ Likely Real: ${this.#stats.lowProbability}`
    );
    this.#lastSummaryTime = now;
  }

  private async processNotification(notification: HTMLElement): Promise<void> {
    if (notification.hasAttribute('data-xbot-processed')) return;

    const rawProfileData = this.#domExtractor.extractProfileData(notification);
    if (!rawProfileData) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    if (this.#processedUsernames.has(rawProfileData.username)) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    const analysis = await this.#profileAnalyzer.analyzeProfile(rawProfileData);
    
    // Combine raw profile data with bot probability to create full ProfileData
    const profileData: ProfileData = {
      ...rawProfileData,
      botProbability: analysis.probability
    };

    this.#uiManager.addWarningIndicator(notification, {
      username: profileData.username,
      probability: analysis.probability,
      reasons: analysis.reasons
    });

    if (analysis.probability >= 0.6) {
      await this.#storageService.saveProfile(profileData);
      console.debug(`[XBot] High risk bot detected: @${profileData.username} (${(analysis.probability * 100).toFixed(1)}%)`);
      this.#stats.highProbability++;
    } else if (analysis.probability >= 0.3) {
      console.debug(`[XBot] Medium risk account: @${profileData.username} (${(analysis.probability * 100).toFixed(1)}%)`);
      this.#stats.mediumProbability++;
    } else {
      this.#stats.lowProbability++;
    }

    this.#uiManager.updatePanelStats(this.#stats);
    this.#processedUsernames.add(profileData.username);
    notification.setAttribute('data-xbot-processed', 'true');
    this.logSummary();
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
