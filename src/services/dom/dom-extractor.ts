import type { InteractionType, ProfileData } from '../types/profile.js';

export class DOMExtractor {
  static readonly #DEFAULT_PROFILE_IMAGE = 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png';

  public extractProfileData(cell: HTMLElement): ProfileData | null {
    try {
      // Extract username and display name
      const usernameElement = cell.querySelector('[data-testid="User-Name"]');
      if (!usernameElement) return null;

      const username = usernameElement.textContent?.trim() || 'unknown';
      const displayName = usernameElement.textContent?.trim() || username;

      // Extract profile image
      const imageElement = cell.querySelector('img[src*="profile_images"]');
      const profileImageUrl = imageElement?.getAttribute('src') || DOMExtractor.#DEFAULT_PROFILE_IMAGE;

      // Extract follower counts
      const followersCount = this.#extractFollowerCount(cell, 'followers') || 0;
      const followingCount = this.#extractFollowerCount(cell, 'following') || 0;

      // Extract verification status
      const isVerified = Boolean(cell.querySelector('[data-testid="icon-verified"]'));

      // Extract notification type
      const notificationType = this.#extractNotificationType(cell);
      const interactionType = this.#extractInteractionType(cell);

      return {
        username,
        displayName,
        profileImageUrl,
        followersCount,
        followingCount,
        isVerified,
        notificationType,
        interactionType,
        interactionTimestamp: Date.now(),
        botProbability: 0
      };
    } catch (error) {
      console.error('[XBot:DOM] Error extracting profile data:', error);
      return null;
    }
  }

  #extractFollowerCount(cell: HTMLElement, type: 'followers' | 'following'): number | null {
    const countElement = cell.querySelector(`[data-testid="${type}-count"]`);
    if (!countElement) return null;

    const countText = countElement.textContent?.trim() || '0';
    return parseInt(countText.replace(/,/g, ''), 10);
  }

  #extractNotificationType(cell: HTMLElement): 'user_interaction' | 'multi_user' {
    const notificationElement = cell.querySelector('[data-testid="notification-type"]');
    const type = notificationElement?.textContent?.trim();
    return type === 'multi_user' ? 'multi_user' : 'user_interaction';
  }

  #extractInteractionType(cell: HTMLElement): InteractionType {
    const interactionElement = cell.querySelector('[data-testid="interaction-type"]');
    const type = interactionElement?.textContent?.trim();
    switch (type) {
      case 'like': case 'reply': case 'repost': case 'follow':
      case 'mention': case 'quote': case 'list': case 'space':
      case 'live': case 'other':
        return type;
      default:
        return 'like';
    }
  }
}
