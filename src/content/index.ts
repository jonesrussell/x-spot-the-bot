import { StorageService } from '../services/storage.js';
import { ProfileAnalyzer } from '../services/profile-analyzer.js';
import { DOMExtractor } from '../services/dom-extractor.js';
import { UIManager } from '../services/ui-manager.js';

class BotDetector {
  private observer: MutationObserver;
  private processedProfiles: Set<string> = new Set();
  private storage: StorageService;
  private analyzer: ProfileAnalyzer;
  private extractor: DOMExtractor;
  private uiManager: UIManager;

  constructor() {
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.storage = new StorageService();
    this.analyzer = new ProfileAnalyzer();
    this.extractor = new DOMExtractor();
    this.uiManager = new UIManager();
    this.init();
  }

  private init(): void {
    console.debug('BotDetector: Initializing...');
    const initObserver = () => {
      console.debug('BotDetector: Looking for notifications feed...');
      const feed = document.querySelector('[data-testid="primaryColumn"]');
      if (feed && feed instanceof HTMLElement) {
        console.debug('BotDetector: Found notifications feed, starting observer');
        this.observer.observe(feed, {
          childList: true,
          subtree: true,
        });
        this.scanExistingNotifications();
      } else {
        console.debug('BotDetector: Feed not found, retrying in 1s');
        setTimeout(initObserver, 1000);
      }
    };

    initObserver();
  }

  private async handleMutations(mutations: MutationRecord[]): Promise<void> {
    try {
      for (const mutation of mutations) {
        if (!mutation || !mutation.addedNodes) continue;

        // Process only if we have added nodes
        const nodes = Array.from(mutation.addedNodes);
        for (const node of nodes) {
          if (node instanceof HTMLElement) {
            // Check if this is a notification cell or contains one
            const notificationCell = node.matches('div[data-testid="cellInnerDiv"]')
              ? node
              : node.querySelector('div[data-testid="cellInnerDiv"]');

            if (notificationCell instanceof HTMLElement) {
              console.debug('BotDetector: Found new notification cell');
              await this.processNotification(notificationCell);
            }
          }
        }
      }
    } catch (error) {
      console.error('BotDetector: Error handling mutations:', error);
    }
  }

  private async processNotification(element: HTMLElement): Promise<void> {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.debug('BotDetector: Invalid element passed to processNotification');
        return;
      }

      // We already have the notification cell, no need to search for it again
      const profileData = this.extractor.extractProfileData(element);
      if (!profileData) {
        console.debug('BotDetector: Could not extract profile data');
        return;
      }

      if (this.processedProfiles.has(profileData.username)) {
        console.debug('BotDetector: Profile already processed:', profileData.username);
        return;
      }

      console.debug('BotDetector: Processing new profile:', profileData.username);
      this.processedProfiles.add(profileData.username);

      // Analyze current interaction
      const currentAnalysis = await this.analyzer.analyzeBotProbability(profileData);

      // Record interaction and get historical analysis
      await this.storage.recordInteraction(
        profileData.username,
        profileData.interactionTimestamp,
        profileData.interactionType,
        currentAnalysis.probability,
        currentAnalysis.reasons
      );

      const responsePattern = await this.storage.analyzeResponsePattern(profileData.username);

      // Combine current and historical analysis
      const finalProbability = (currentAnalysis.probability + responsePattern.confidence) / 2;
      const allReasons = [...currentAnalysis.reasons, ...responsePattern.reasons];

      if (finalProbability > 0.7) {
        console.debug('BotDetector: Adding warning UI for:', profileData.username);
        this.uiManager.addBotWarningUI(element, finalProbability, allReasons);
      }
    } catch (error) {
      console.error('BotDetector: Error processing notification:', error);
    }
  }

  private scanExistingNotifications(): void {
    console.debug('BotDetector: Scanning existing notifications...');
    const notifications = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
    if (notifications.length === 0) {
      console.debug('BotDetector: No existing notifications found');
      return;
    }
    console.debug(`BotDetector: Found ${notifications.length} existing notifications`);
    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        this.processNotification(notification);
      }
    });
  }

  public static initialize(): void {
    try {
      console.debug('BotDetector: Starting initialization');
      if (document.readyState === 'loading') {
        console.debug('BotDetector: Document still loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
          console.debug('BotDetector: DOMContentLoaded fired, creating instance');
          new BotDetector();
        });
      } else {
        console.debug('BotDetector: Document already loaded, creating instance');
        new BotDetector();
      }
    } catch (error) {
      console.error('BotDetector: Error during initialization:', error);
    }
  }
}

// Start the bot detector
BotDetector.initialize();
