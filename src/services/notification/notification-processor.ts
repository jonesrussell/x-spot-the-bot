import type { BotAnalysis, ProfileData } from '../../types/profile.js';
import { DOMExtractor } from '../dom-extractor.js';
import { ProfileAnalyzer } from '../profile-analyzer.js';
import { StatsTracker } from '../stats/stats-tracker.js';
import { StorageService } from '../storage.js';
import { UIManager } from '../ui-manager.js';

export class NotificationProcessor {
  readonly #domExtractor: DOMExtractor;
  readonly #profileAnalyzer: ProfileAnalyzer;
  readonly #storageService: StorageService;
  readonly #uiManager: UIManager;
  readonly #statsTracker: StatsTracker;

  constructor(
    domExtractor: DOMExtractor,
    profileAnalyzer: ProfileAnalyzer,
    storageService: StorageService,
    uiManager: UIManager,
    statsTracker: StatsTracker
  ) {
    this.#domExtractor = domExtractor;
    this.#profileAnalyzer = profileAnalyzer;
    this.#storageService = storageService;
    this.#uiManager = uiManager;
    this.#statsTracker = statsTracker;
  }

  public async processNotification(notification: HTMLElement): Promise<void> {
    if (notification.hasAttribute('data-xbot-processed')) return;

    const rawProfileData = this.#domExtractor.extractProfileData(notification);
    if (!rawProfileData) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    if (this.#statsTracker.isProcessed(rawProfileData.username)) {
      notification.setAttribute('data-xbot-processed', 'true');
      return;
    }

    const analysis = await this.#profileAnalyzer.analyzeProfile(rawProfileData);
    
    // Combine raw profile data with bot probability to create full ProfileData
    const profileData: ProfileData = {
      ...rawProfileData,
      botProbability: analysis.probability
    };

    await this.handleAnalysisResults(notification, profileData, analysis);
  }

  private async handleAnalysisResults(
    notification: HTMLElement, 
    profileData: ProfileData, 
    analysis: BotAnalysis
  ): Promise<void> {
    this.#uiManager.addWarningIndicator(notification, {
      username: profileData.username,
      probability: analysis.probability,
      reasons: analysis.reasons
    });

    if (analysis.probability >= 0.6) {
      await this.#storageService.saveProfile(profileData);
      console.debug(`[XBot] High risk bot detected: @${profileData.username} (${(analysis.probability * 100).toFixed(1)}%)`);
    } else if (analysis.probability >= 0.3) {
      console.debug(`[XBot] Medium risk account: @${profileData.username} (${(analysis.probability * 100).toFixed(1)}%)`);
    }

    this.#statsTracker.trackAnalysis(analysis.probability);
    this.#statsTracker.markProcessed(profileData.username);
    this.#uiManager.updatePanelStats(this.#statsTracker.getStats());
    notification.setAttribute('data-xbot-processed', 'true');
    this.#statsTracker.logSummary();
  }
} 