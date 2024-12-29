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

  constructor() {
    this.observer = new MutationObserver(this.handleMutations.bind(this));
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
    const botProbability = await this.analyzeBotProbability(profileData);
    
    if (botProbability > 0.7) { // Threshold for suspicious accounts
      this.addBotWarningUI(notification, profileData, botProbability);
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

  private async analyzeBotProbability(profile: ProfileData): Promise<number> {
    let probability = 0;

    // Basic heuristics
    if (profile.followersCount === 0 && profile.followingCount === 0) {
      probability += 0.4;
    }

    // TODO: Add more sophisticated analysis
    // - Response time analysis
    // - Profile image analysis
    // - Username pattern analysis

    return probability;
  }

  private addBotWarningUI(
    notification: HTMLElement, 
    profile: ProfileData, 
    probability: number
  ): void {
    const warning = document.createElement('div');
    warning.className = 'xbd-warning';
    warning.innerHTML = `
      <div class="xbd-warning-icon">🤖</div>
      <div class="xbd-warning-text">Possible Bot (${Math.round(probability * 100)}%)</div>
    `;

    // Add styles
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
        align-items: center;
        gap: 4px;
        font-size: 12px;
        z-index: 1000;
      }
      .xbd-warning-icon {
        font-size: 14px;
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