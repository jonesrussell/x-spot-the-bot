import type { ProfileData } from '../types/profile.js';

export class DOMExtractor {
  private readonly SELECTORS = {
    CELL: '[data-testid="cellInnerDiv"]',
    NOTIFICATION: 'article[data-testid="notification"]',
    AVATAR_CONTAINER: (username: string) => `[data-testid="UserAvatar-Container-${username}"]`,
    USER_LINK: 'a[href^="/"]'
  } as const;

  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      const cell = this.findCell(element);
      if (!cell) return null;

      const userLink = this.findFirstUserLink(cell);
      if (!userLink) return null;

      const username = this.extractUsername(userLink);
      if (!username) return null;

      const displayName = this.extractDisplayName(userLink, username);
      const profileImageUrl = this.extractProfileImage(cell, username);
      const interactionType = this.extractInteractionType(cell);

      if (!interactionType) return null;

      const profileData: ProfileData = {
        username,
        displayName,
        profileImageUrl,
        followersCount: 0, // TODO: Implement extraction
        followingCount: 0, // TODO: Implement extraction
        interactionTimestamp: Date.now(),
        interactionType
      };

      console.debug('DOMExtractor: Successfully extracted profile data', profileData);
      return profileData;

    } catch (error) {
      console.error('DOMExtractor: Error extracting profile data:', error);
      return null;
    }
  }

  private findCell(element: HTMLElement): HTMLElement | null {
    if (!element?.matches(this.SELECTORS.CELL)) {
      const cell = element.querySelector<HTMLElement>(this.SELECTORS.CELL);
      if (!cell) {
        console.debug('DOMExtractor: No cell inner div found');
        return null;
      }
      return cell;
    }
    return element;
  }

  private findFirstUserLink(cell: HTMLElement): HTMLAnchorElement | null {
    const userLinks = Array.from(cell.querySelectorAll<HTMLAnchorElement>(this.SELECTORS.USER_LINK))
      .filter(link => {
        const href = link.getAttribute('href');
        return href && !href.includes('/') && !href.includes('?');
      });

    if (userLinks.length === 0) {
      console.debug('DOMExtractor: No user links found');
      return null;
    }

    return userLinks[0];
  }

  private extractUsername(link: HTMLAnchorElement): string | null {
    const username = link.getAttribute('href')?.replace('/', '');
    if (!username) {
      console.debug('DOMExtractor: Could not extract username from link');
      return null;
    }
    return username;
  }

  private extractDisplayName(link: HTMLAnchorElement, fallback: string): string {
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT, null);
    const firstTextNode = walker.nextNode();
    return firstTextNode?.textContent?.trim() || fallback;
  }

  private extractProfileImage(cell: HTMLElement, username: string): string {
    const avatarContainer = cell.querySelector(this.SELECTORS.AVATAR_CONTAINER(username));
    if (!avatarContainer) {
      console.debug('DOMExtractor: No avatar container found');
      return '';
    }

    // Try img tag first
    const imgElement = avatarContainer.querySelector('img');
    if (imgElement) {
      return imgElement.src;
    }

    // Fallback to background image
    const bgElements = avatarContainer.querySelectorAll('[style*="background-image"]');
    for (const el of bgElements) {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        return bgImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
      }
    }

    console.debug('DOMExtractor: Could not find profile image URL');
    return '';
  }

  private extractInteractionType(cell: HTMLElement): ProfileData['interactionType'] | null {
    const article = cell.querySelector(this.SELECTORS.NOTIFICATION);
    if (!article) {
      console.debug('DOMExtractor: No notification article found');
      return null;
    }

    const text = article.textContent?.toLowerCase() || '';
    return this.determineInteractionType(text);
  }

  private determineInteractionType(text: string): ProfileData['interactionType'] {
    if (text.includes('liked')) return 'like';
    if (text.includes('replied')) return 'reply';
    if (text.includes('reposted')) return 'repost';
    if (text.includes('followed')) return 'follow';
    return 'like'; // Default to like to satisfy type system
  }
}
