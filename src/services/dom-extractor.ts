import type { ProfileData } from '../types/profile.js';

export class DOMExtractor {
  private readonly SELECTORS = {
    CELL: '[data-testid="cellInnerDiv"]',
    NOTIFICATION: '[data-testid="notification"]',
    USER_NAME: '[data-testid="UserName"]',
    USER_AVATAR: '[data-testid="UserAvatar"]',
    TWEET_TEXT: '[data-testid="tweetText"]'
  } as const;

  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      // Skip if this is our warning element
      if (element.classList.contains('xbd-warning')) {
        return null;
      }

      // Find the notification cell
      const cell = element.closest(this.SELECTORS.CELL);
      if (!cell || !(cell instanceof HTMLElement)) {
        return null;
      }

      // Log the cell's HTML for debugging
      console.debug('[XBot:DOM] Processing cell:', {
        html: cell.outerHTML,
        testIds: Array.from(cell.querySelectorAll('[data-testid]'))
          .map(el => el.getAttribute('data-testid'))
      });

      // Check if this is a community or pinned post notification
      const notificationText = cell.textContent?.toLowerCase() || '';
      if (notificationText.includes('new pinned post in') || 
          notificationText.includes('trending in') ||
          notificationText.includes('community post')) {
        console.debug('[XBot:DOM] Skipping community/pinned post notification');
        return null;
      }

      // Find user name element
      const userNameElement = cell.querySelector(this.SELECTORS.USER_NAME);
      if (!userNameElement) {
        console.debug('[XBot:DOM] Failed at: No User-Name element found');
        return null;
      }

      // Find user link within user name element
      const userLink = userNameElement.querySelector('a[role="link"]');
      if (!userLink || !(userLink instanceof HTMLAnchorElement)) {
        console.debug('[XBot:DOM] Failed at: No user link in User-Name element');
        return null;
      }

      const username = userLink.getAttribute('href')?.slice(1);
      if (!username) {
        console.debug('[XBot:DOM] Failed at: No href attribute in user link');
        return null;
      }

      // Get display name from user name element
      const displayName = this.extractDisplayName(userNameElement) || username;

      // Find profile image
      const avatarContainer = cell.querySelector(this.SELECTORS.USER_AVATAR);
      if (!avatarContainer) {
        console.debug('[XBot:DOM] Failed at: No Tweet-User-Avatar element found');
        return null;
      }

      const profileImageUrl = this.extractProfileImage(avatarContainer);
      if (!profileImageUrl) {
        console.debug('[XBot:DOM] Failed at: Could not extract profile image URL');
        return null;
      }

      // Get interaction type from notification text
      const notification = cell.querySelector(this.SELECTORS.NOTIFICATION);
      if (!notification) {
        console.debug('[XBot:DOM] Failed at: No notification element found');
        return null;
      }

      const interactionType = this.determineInteractionType(notificationText);

      console.debug('[XBot:DOM] Successfully extracted profile data', {
        username,
        displayName,
        interactionType
      });

      return {
        username,
        displayName,
        profileImageUrl,
        followersCount: 0,
        followingCount: 0,
        interactionTimestamp: Date.now(),
        interactionType
      };

    } catch (error) {
      console.error('[XBot:DOM] Error:', error);
      return null;
    }
  }

  private extractDisplayName(nameElement: Element): string | null {
    // Get all text nodes, excluding emoji images
    const walker = document.createTreeWalker(nameElement, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && !text.startsWith('@')) {
        textNodes.push(text);
      }
    }
    return textNodes[0] || null;
  }

  private extractProfileImage(container: Element): string | null {
    // Try to find img tag first
    const img = container.querySelector('img[src*="profile_images"]');
    if (img && img instanceof HTMLImageElement && img.src) {
      return img.src;
    }

    // Fallback to background image
    const bgElements = container.querySelectorAll('[style*="background-image"]');
    for (const el of bgElements) {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none' && bgImage.includes('profile_images')) {
        return bgImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
      }
    }

    return null;
  }

  private determineInteractionType(text: string): ProfileData['interactionType'] {
    if (text.includes('liked')) return 'like';
    if (text.includes('replied')) return 'reply';
    if (text.includes('reposted')) return 'repost';
    return 'follow';
  }
}
