import type { InteractionType, ProfileData } from '../../types/profile.js';

export class DOMExtractor {
  static readonly #DEFAULT_PROFILE_IMAGE = 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png';

  public extractProfileData(cell: HTMLElement): ProfileData | null {
    try {
      // Extract username and display name
      const userLink = cell.querySelector('[role="link"][href^="/"]');
      if (!userLink) return null;

      const username = userLink.getAttribute('href')?.slice(1) || 'unknown';
      const displayNameElement = userLink.querySelector('[data-testid="User-Name"]');
      const displayName = displayNameElement?.textContent?.trim() || username;

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
    const notificationText = cell.querySelector('[data-testid="notificationText"]')?.textContent || '';
    return notificationText.includes(' and ') ? 'multi_user' : 'user_interaction';
  }

  #extractInteractionType(cell: HTMLElement): InteractionType {
    const notificationText = cell.querySelector('[data-testid="notificationText"]')?.textContent?.toLowerCase() || '';
    
    if (notificationText.includes('liked')) return 'like';
    if (notificationText.includes('replied')) return 'reply';
    if (notificationText.includes('reposted')) return 'repost';
    if (notificationText.includes('followed')) return 'follow';
    if (notificationText.includes('mentioned')) return 'mention';
    if (notificationText.includes('quoted')) return 'quote';
    if (notificationText.includes('list')) return 'list';
    if (notificationText.includes('space')) return 'space';
    if (notificationText.includes('live')) return 'live';
    
    return 'other';
  }
}
