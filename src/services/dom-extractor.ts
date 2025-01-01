import type { InteractionType, ProfileData } from '../types/profile.js';

interface UserProfileData extends Omit<ProfileData, 'notificationType'> {
  notificationType: 'user_interaction' | 'multi_user';
}

export class DOMExtractor {
  static readonly #SELECTORS = {
    CELL: '[data-testid="cellInnerDiv"]',
    NOTIFICATION: 'article',
    USER_LINK: 'a[role="link"]',
    USER_NAME: '[data-testid="User-Name"]',
    USER_AVATAR: 'img[src*="profile_images"]',
    NOTIFICATION_TEXT: '[data-testid="notificationText"]',
    TWEET_TEXT: '[data-testid="tweetText"]'
  } as const;

  static readonly #PATTERNS = {
    PINNED_POST: /new pinned post in/i,
    TRENDING: /trending in/i,
    COMMUNITY_POST: /new community post in/i,
    MULTI_USER: /new post notifications for|and \d+ others/i,
    LIKE: /liked/i,
    REPLY: /replied|replying to/i,
    REPOST: /reposted/i,
    FOLLOW: /followed/i,
    LIVE: /is live:/i
  } as const;

  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      // Skip if this is our warning element
      if (element.classList.contains('xbd-warning')) {
        console.log('[XBot:DOM] Skipping warning element');
        return null;
      }

      // Find the notification cell
      const cell = element.closest(DOMExtractor.#SELECTORS.CELL);
      if (!cell) {
        console.log('[XBot:DOM] No notification cell found');
        return null;
      }

      // Skip if already processed
      if (cell.hasAttribute('data-xbot-processed')) {
        console.log('[XBot:DOM] Cell already processed');
        return null;
      }
      cell.setAttribute('data-xbot-processed', 'true');

      // Find notification article
      const article = cell.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION);
      if (!article) {
        console.log('[XBot:DOM] No notification article found');
        return null;
      }

      // Get notification text
      const notificationText = article.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION_TEXT);
      const text = (notificationText?.textContent ?? article.textContent ?? '').toLowerCase();
      
      if (!text) {
        console.log('[XBot:DOM] No notification text found');
        return null;
      }

      console.log('[XBot:DOM] Processing notification:', { text });

      // Find all user links
      const userLinks = [...article.querySelectorAll(DOMExtractor.#SELECTORS.USER_LINK)]
        .filter(link => {
          const href = link.getAttribute('href');
          return href?.startsWith('/') && 
                 !href.includes('/i/') && 
                 !href.includes('/status/') &&
                 !href.includes('/lists/') &&
                 !href.includes('/topics/');
        });

      if (!userLinks.length) {
        console.log('[XBot:DOM] No user links found');
        return null;
      }

      // Extract user data
      const users = userLinks
        .map(link => {
          const username = link.getAttribute('href')?.slice(1);
          if (!username) return null;

          const displayName = link.textContent?.trim() || username;
          const interactionType = this.#determineInteractionType(text);
          const isMultiUser = DOMExtractor.#PATTERNS.MULTI_USER.test(text);
          const notificationType = isMultiUser ? 'multi_user' : 'user_interaction';

          // Find avatar image - try multiple methods
          let profileImageUrl: string | null = null;

          // Method 1: Direct img with profile_images in src
          const directImg = cell.querySelector(`img[src*="profile_images"]`);
          if (directImg) {
            profileImageUrl = directImg.getAttribute('src');
          }

          // Method 2: Avatar container by username
          if (!profileImageUrl) {
            const container = cell.querySelector(`[data-testid="UserAvatar-Container-${username}"]`);
            const containerImg = container?.querySelector('img');
            if (containerImg) {
              profileImageUrl = containerImg.getAttribute('src');
            }
          }

          // Method 3: Any img near the user link
          if (!profileImageUrl) {
            const nearbyImg = link.closest('div')?.querySelector('img');
            if (nearbyImg?.src.includes('profile_images')) {
              profileImageUrl = nearbyImg.src;
            }
          }

          // Method 4: CSS background image
          if (!profileImageUrl) {
            const avatarDiv = cell.querySelector(`[data-testid="UserAvatar-Container-${username}"] div[style*="background-image"]`);
            if (avatarDiv) {
              const style = window.getComputedStyle(avatarDiv);
              const bgImage = style.backgroundImage;
              if (bgImage && bgImage !== 'none') {
                profileImageUrl = bgImage.slice(5, -2); // Remove url(" and ")
              }
            }
          }

          if (!profileImageUrl) {
            console.log('[XBot:DOM] No profile image found for user:', username);
            return null;
          }

          return {
            username,
            displayName,
            profileImageUrl,
            followersCount: 0,
            followingCount: 0,
            interactionTimestamp: Date.now(),
            interactionType,
            notificationType
          } satisfies UserProfileData;
        })
        .filter((user): user is ProfileData => {
          if (!user) return false;
          user.notificationType = DOMExtractor.#PATTERNS.MULTI_USER.test(text)
            ? 'multi_user'
            : 'user_interaction';
          return true;
        });

      if (!users.length) {
        console.log('[XBot:DOM] No valid users found after processing');
        return null;
      }

      const userProfile = users[0];
      if (!userProfile) {
        console.log('[XBot:DOM] First user profile is undefined');
        return null;
      }

      console.log('[XBot:DOM] Found user profile:', {
        username: userProfile.username,
        displayName: userProfile.displayName,
        interactionType: userProfile.interactionType,
        profileImageUrl: userProfile.profileImageUrl
      });

      return userProfile;
    } catch (error) {
      console.error('[XBot:DOM] Error extracting profile data:', error);
      return null;
    }
  }

  #determineInteractionType(text: string): InteractionType {
    if (DOMExtractor.#PATTERNS.LIKE.test(text)) return 'like';
    if (DOMExtractor.#PATTERNS.REPLY.test(text)) return 'reply';
    if (DOMExtractor.#PATTERNS.REPOST.test(text)) return 'repost';
    if (DOMExtractor.#PATTERNS.FOLLOW.test(text)) return 'follow';
    if (DOMExtractor.#PATTERNS.LIVE.test(text)) return 'live';
    return 'other';
  }
}
