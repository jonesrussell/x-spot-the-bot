import { DOMExtractor } from '../services/dom-extractor.js';
import { FeedDetector } from '../services/feed/feed-detector.js';
import { NotificationProcessor } from '../services/notification/notification-processor.js';
import { ProfileAnalyzer } from '../services/profile-analyzer.js';
import { StatsTracker } from '../services/stats/stats-tracker.js';
import { StorageService } from '../services/storage.js';
import { UIManager } from '../services/ui-manager.js';

console.log('[XBot] Content script loaded - X Spot The Bot v1.0.0');

export class BotDetector {
  #feedDetector: FeedDetector;
  #notificationProcessor: NotificationProcessor;
  #statsTracker: StatsTracker;

  constructor() {
    console.debug('[XBot] Extension initializing');
    
    // Initialize services
    const domExtractor = new DOMExtractor();
    const profileAnalyzer = new ProfileAnalyzer();
    const storageService = new StorageService();
    const uiManager = new UIManager();
    
    // Initialize specialized services
    this.#feedDetector = new FeedDetector();
    this.#statsTracker = new StatsTracker();
    this.#notificationProcessor = new NotificationProcessor(
      domExtractor,
      profileAnalyzer,
      storageService,
      uiManager,
      this.#statsTracker
    );

    this.init();
  }

  private reset(): void {
    this.#feedDetector.reset();
    this.#statsTracker.reset();
  }

  private async init(): Promise<void> {
    this.reset();
    
    const feed = await this.#feedDetector.findFeed();
    if (!feed) {
      console.warn('[XBot] Failed to find notifications feed');
      return;
    }

    console.debug('[XBot] Found notifications feed, starting detection');
    this.#feedDetector.observe(feed, notification => {
      void this.#notificationProcessor.processNotification(notification);
    });
    
    this.#feedDetector.scanExisting(feed, notification => {
      void this.#notificationProcessor.processNotification(notification);
    });
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
