export class DOMExtractor {
  extractProfileData(element) {
    try {
      // First, ensure we have a notification cell
      const notification = element.closest('div[data-testid="cellInnerDiv"]');
      if (!notification || !(notification instanceof HTMLElement)) {
        console.debug('DOMExtractor: No notification cell found');
        return null;
      }
      // Find the user link element which contains the username
      const userLink = notification.querySelector('a[role="link"][href^="/"]');
      if (!userLink) {
        console.debug('DOMExtractor: No user link found');
        return null;
      }
      const username = userLink.getAttribute('href')?.replace('/', '') || '';
      if (!username) {
        console.debug('DOMExtractor: Could not extract username');
        return null;
      }
      // Get display name from the link text
      const displayName = userLink.textContent?.split('@')[0].trim() || username;
      // Find profile image - it's usually the first image in the notification
      const profileImg = notification.querySelector('img[src*="profile_images"]');
      if (!profileImg || !(profileImg instanceof HTMLImageElement)) {
        console.debug('DOMExtractor: No profile image found');
        return null;
      }
      const profileImageUrl = profileImg.src || '';
      // Get interaction type
      const interactionType = this.determineInteractionType(notification);
      console.debug('DOMExtractor: Successfully extracted profile data for', username);
      return {
        username,
        displayName,
        profileImageUrl,
        followersCount: 0, // TODO: Implement extraction
        followingCount: 0, // TODO: Implement extraction
        interactionTimestamp: Date.now(),
        interactionType,
      };
    } catch (error) {
      console.error('DOMExtractor: Error extracting profile data:', error);
      return null;
    }
  }
  determineInteractionType(notification) {
    const text = notification.textContent?.toLowerCase() || '';
    if (text.includes('liked')) return 'like';
    if (text.includes('replied')) return 'reply';
    if (text.includes('reposted')) return 'repost';
    return 'follow';
  }
}
