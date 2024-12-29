import { StorageService } from '../services/storage';

interface ProfileData {
  username: string;
  displayName: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  interactionTimestamp: number;
  interactionType: 'like' | 'reply' | 'repost' | 'follow';
}

class BotDetector {
  private observer: MutationObserver;
  private processedProfiles: Set<string> = new Set();
  private storage: StorageService;

  constructor() {
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.storage = new StorageService();
    this.init();
  }

  private init(): void {
    // Start observing the notifications feed
    const feed = document.querySelector('[data-testid="primaryColumn"]');
    if (feed) {
      this.observer.observe(feed, {
        childList: true,
        subtree: true,
      });
    }

    // Initial scan of existing notifications
    this.scanExistingNotifications();
  }

  private async handleMutations(mutations: MutationRecord[]): Promise<void> {
    for (const mutation of mutations) {
      const nodes = Array.from(mutation.addedNodes);
      for (const node of nodes) {
        if (node instanceof HTMLElement) {
          await this.processNotification(node);
        }
      }
    }
  }

  private async processNotification(element: HTMLElement): Promise<void> {
    const notification = element.closest('[data-testid="notification"]');
    if (!notification || !(notification instanceof HTMLElement)) return;

    const profileData = this.extractProfileData(notification);
    if (!profileData || this.processedProfiles.has(profileData.username)) return;

    this.processedProfiles.add(profileData.username);
    
    // Analyze current interaction
    const currentAnalysis = await this.analyzeBotProbability(profileData);
    
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
      this.addBotWarningUI(notification, finalProbability, allReasons);
    }
  }

  private extractProfileData(notification: HTMLElement): ProfileData | null {
    try {
      const username = notification.querySelector('[data-testid="User-Name"]')?.textContent?.trim() || '';
      const profileImg = notification.querySelector('img[draggable="true"]') as HTMLImageElement;
      const profileImageUrl = profileImg?.src || '';
      
      // Extract follower/following counts when available
      // Note: These might need to be extracted from the hover card when it appears
      const followersCount = 0; // TODO: Implement extraction
      const followingCount = 0; // TODO: Implement extraction

      return {
        username,
        displayName: username.split('@')[0],
        profileImageUrl,
        followersCount,
        followingCount,
        interactionTimestamp: Date.now(),
        interactionType: this.determineInteractionType(notification)
      };
    } catch (error) {
      console.error('Error extracting profile data:', error);
      return null;
    }
  }

  private determineInteractionType(notification: HTMLElement): ProfileData['interactionType'] {
    const text = notification.textContent?.toLowerCase() || '';
    if (text.includes('liked')) return 'like';
    if (text.includes('replied')) return 'reply';
    if (text.includes('reposted')) return 'repost';
    return 'follow';
  }

  private async analyzeBotProbability(profile: ProfileData): Promise<{
    probability: number;
    reasons: string[];
  }> {
    let probability = 0;
    const reasons: string[] = [];

    // Basic heuristics
    if (profile.followersCount === 0 && profile.followingCount === 0) {
      probability += 0.4;
      reasons.push('No followers or following');
    }

    // Username analysis
    if (this.isGeneratedUsername(profile.username)) {
      probability += 0.3;
      reasons.push('Suspicious username pattern');
    }

    return { probability, reasons };
  }

  private isGeneratedUsername(username: string): boolean {
    // Check for patterns like random characters, numbers, or common bot patterns
    const botPatterns = [
      /^[a-z0-9]{8,}$/i, // Random alphanumeric
      /[0-9]{4,}/, // Too many numbers
      /(bot|spam|[0-9]+[a-z]+[0-9]+)/i, // Contains bot-like words or patterns
    ];

    return botPatterns.some(pattern => pattern.test(username));
  }

  private addBotWarningUI(
    notification: HTMLElement,
    probability: number,
    reasons: string[]
  ): void {
    const warning = document.createElement('div');
    warning.className = 'xbd-warning';
    warning.innerHTML = `
      <div class="xbd-warning-icon">🤖</div>
      <div class="xbd-warning-text">
        Possible Bot (${Math.round(probability * 100)}%)
        <div class="xbd-warning-reasons">
          ${reasons.map(reason => `<div class="xbd-reason">• ${reason}</div>`).join('')}
        </div>
      </div>
    `;

    // Enhanced styles
    const style = document.createElement('style');
    style.textContent = `
      .xbd-warning {
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(255, 0, 0, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: start;
        gap: 4px;
        font-size: 12px;
        z-index: 1000;
      }
      .xbd-warning-icon {
        font-size: 14px;
      }
      .xbd-warning-reasons {
        display: none;
        margin-top: 4px;
        color: #666;
      }
      .xbd-warning:hover .xbd-warning-reasons {
        display: block;
      }
      .xbd-reason {
        font-size: 11px;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    notification.style.position = 'relative';
    notification.appendChild(warning);
  }

  private scanExistingNotifications(): void {
    const notifications = document.querySelectorAll('[data-testid="notification"]');
    notifications.forEach(notification => {
      if (notification instanceof HTMLElement) {
        this.processNotification(notification);
      }
    });
  }
}

// Initialize the bot detector when the page loads
window.addEventListener('load', () => {
  new BotDetector();
}); 