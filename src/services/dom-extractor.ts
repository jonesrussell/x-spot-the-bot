import type { ProfileData } from '../types/profile.js';

export class DOMExtractor {
  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.debug('DOMExtractor: Invalid element passed');
        return null;
      }

      // Find the notification cell
      const cellInnerDiv = element.querySelector('[data-testid="cellInnerDiv"]');
      if (!cellInnerDiv || !(cellInnerDiv instanceof HTMLElement)) {
        console.debug('DOMExtractor: No cell inner div found');
        return null;
      }

      // Find all user links in the notification
      const userLinks = Array.from(cellInnerDiv.querySelectorAll('a[href^="/"]')).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.includes('/') && !href.includes('?');
      });

      if (userLinks.length === 0) {
        console.debug('DOMExtractor: No user links found');
        return null;
      }

      // Get the first user's data (the one performing the action)
      const firstUserLink = userLinks[0];
      const username = firstUserLink.getAttribute('href')?.replace('/', '');
      if (!username) {
        console.debug('DOMExtractor: Could not extract username from link');
        return null;
      }

      // Get display name by finding the first text node in the link
      let displayName = '';
      const walk = document.createTreeWalker(
        firstUserLink,
        NodeFilter.SHOW_TEXT,
        null
      );
      const firstTextNode = walk.nextNode();
      if (firstTextNode) {
        displayName = firstTextNode.textContent?.trim() || username;
      } else {
        displayName = username;
      }

      // Find the avatar container for this user
      const avatarContainer = cellInnerDiv.querySelector(`[data-testid="UserAvatar-Container-${username}"]`);
      if (!avatarContainer) {
        console.debug('DOMExtractor: No avatar container found');
        return null;
      }

      // Find profile image - it might be a background image or an img tag
      let profileImageUrl = '';
      const imgElement = avatarContainer.querySelector('img');
      if (imgElement) {
        profileImageUrl = imgElement.src;
      } else {
        // Try to find background image
        const bgElements = avatarContainer.querySelectorAll('[style*="background-image"]');
        for (const el of bgElements) {
          const style = window.getComputedStyle(el);
          const bgImage = style.backgroundImage;
          if (bgImage && bgImage !== 'none') {
            profileImageUrl = bgImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
            break;
          }
        }
      }

      if (!profileImageUrl) {
        console.debug('DOMExtractor: Could not find profile image URL');
        // Continue anyway since we have the username
      }

      // Get interaction type from notification article
      const notificationArticle = cellInnerDiv.querySelector('article[data-testid="notification"]');
      if (!notificationArticle) {
        console.debug('DOMExtractor: No notification article found');
        return null;
      }

      const notificationText = notificationArticle.textContent?.toLowerCase() || '';
      const interactionType = this.determineInteractionType(notificationText);

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

  private determineInteractionType(text: string): ProfileData['interactionType'] {
    if (text.includes('liked')) return 'like';
    if (text.includes('replied')) return 'reply';
    if (text.includes('reposted')) return 'repost';
    if (text.includes('followed')) return 'follow';
    if (text.includes('notifications')) return 'notification';
    return 'other';
  }
}
