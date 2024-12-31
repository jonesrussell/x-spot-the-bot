import type { ProfileData } from '../types/profile.ts';

export class DOMExtractor {
  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.debug('DOMExtractor: Invalid element passed');
        return null;
      }

      // Find the notification article inside the cell
      const notificationEl = element.querySelector('article[data-testid="notification"]');
      if (!notificationEl || !(notificationEl instanceof HTMLElement)) {
        console.debug('DOMExtractor: No notification article found');
        return null;
      }

      // Find user avatars - they're in containers with data-testid="UserAvatar-Container-*"
      const avatarContainers = element.querySelectorAll('div[data-testid^="UserAvatar-Container-"]');
      if (!avatarContainers.length) {
        console.debug('DOMExtractor: No avatar containers found');
        return null;
      }

      // Get the first avatar container's data-testid to extract username
      const firstAvatarContainer = avatarContainers[0];
      const username = firstAvatarContainer.getAttribute('data-testid')?.replace('UserAvatar-Container-', '');
      if (!username) {
        console.debug('DOMExtractor: Could not extract username from avatar container');
        return null;
      }

      // Find profile image inside the avatar container
      const profileImg = firstAvatarContainer.querySelector('img[draggable="true"]');
      if (!profileImg || !(profileImg instanceof HTMLImageElement)) {
        console.debug('DOMExtractor: No profile image found in avatar container');
        return null;
      }
      const profileImageUrl = profileImg.src;

      // Find display name in the notification text
      const userLinks = notificationEl.querySelectorAll('a[href^="/' + username + '"]');
      const userLink = Array.from(userLinks).find(link => link.textContent?.includes(username));
      const displayName = userLink?.textContent?.split('@')[0].trim() || username;

      // Get interaction type
      const interactionType = this.determineInteractionType(notificationEl);

      console.debug('DOMExtractor: Successfully extracted profile data', {
        username,
        displayName,
        profileImageUrl,
        interactionType
      });

      return {
        username,
        displayName,
        profileImageUrl,
        followersCount: 0, // TODO: Implement extraction
        followingCount: 0, // TODO: Implement extraction
        interactionTimestamp: Date.now(),
        interactionType
      };
    } catch (error) {
      console.error('DOMExtractor: Error extracting profile data:', error);
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
}
