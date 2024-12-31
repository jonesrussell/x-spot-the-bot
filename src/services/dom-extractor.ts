import type { ProfileData } from '../types/profile.js';

export class DOMExtractor {
  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.debug('DOMExtractor: Invalid element passed');
        console.debug('Element:', element);
        return null;
      }

      // Debug the notification cell structure
      console.debug('DOMExtractor: Notification cell HTML:', element.outerHTML);

      // Find the user cell - it's a div with data-testid="cellInnerDiv"
      const cellInnerDiv = element.querySelector('div[data-testid="cellInnerDiv"]');
      if (!cellInnerDiv || !(cellInnerDiv instanceof HTMLElement)) {
        console.debug('DOMExtractor: No cell inner div found');
        console.debug('Available data-testids:', 
          Array.from(element.querySelectorAll('[data-testid]'))
            .map(el => el.getAttribute('data-testid'))
        );
        return null;
      }

      console.debug('DOMExtractor: Cell inner div HTML:', cellInnerDiv.outerHTML);

      // Find the user link - it's an anchor with dir="ltr" containing the username
      const userLink = cellInnerDiv.querySelector('a[dir="ltr"]');
      if (!userLink || !(userLink instanceof HTMLElement)) {
        console.debug('DOMExtractor: No user link found');
        console.debug('Available links:', 
          Array.from(cellInnerDiv.querySelectorAll('a'))
            .map(a => ({
              href: a.getAttribute('href'),
              dir: a.getAttribute('dir'),
              text: a.textContent
            }))
        );
        return null;
      }

      console.debug('DOMExtractor: User link HTML:', userLink.outerHTML);

      // Extract username from the link href
      const username = userLink.getAttribute('href')?.replace('/', '') || '';
      if (!username) {
        console.debug('DOMExtractor: Could not extract username from link');
        console.debug('Link href:', userLink.getAttribute('href'));
        return null;
      }

      // Get display name from the link text
      const displayName = userLink.textContent?.trim() || username;

      // Find profile image - it's an img inside a div[data-testid="UserAvatar"]
      const avatarDiv = cellInnerDiv.querySelector('div[data-testid="UserAvatar"]');
      if (!avatarDiv) {
        console.debug('DOMExtractor: No avatar div found');
        console.debug('Available data-testids in cell:', 
          Array.from(cellInnerDiv.querySelectorAll('[data-testid]'))
            .map(el => el.getAttribute('data-testid'))
        );
      }

      const profileImg = avatarDiv?.querySelector('img');
      if (!profileImg || !(profileImg instanceof HTMLImageElement)) {
        console.debug('DOMExtractor: No profile image found');
        if (avatarDiv) {
          console.debug('Avatar div HTML:', avatarDiv.outerHTML);
        }
        return null;
      }

      console.debug('DOMExtractor: Profile image HTML:', profileImg.outerHTML);
      const profileImageUrl = profileImg.src;

      // Get interaction type from notification text
      const notificationText = cellInnerDiv.textContent?.toLowerCase() || '';
      console.debug('DOMExtractor: Notification text:', notificationText);
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
      console.error('Element that caused error:', element.outerHTML);
      return null;
    }
  }

  private determineInteractionType(text: string): ProfileData['interactionType'] {
    if (text.includes('liked')) return 'like';
    if (text.includes('replied')) return 'reply';
    if (text.includes('reposted')) return 'repost';
    return 'follow';
  }
}
