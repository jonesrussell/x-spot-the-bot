import type { InteractionType, NotificationType, ProfileData } from '../types/profile.js';

interface NotificationData {
  type: NotificationType;
  text: string;
  users?: ProfileData[];
}

type UserNotificationType = 'user_interaction' | 'multi_user';

interface UserProfileData extends Omit<ProfileData, 'notificationType'> {
  notificationType: UserNotificationType;
}

function isUserNotificationType(type: NotificationType): type is UserNotificationType {
  return type === 'user_interaction' || type === 'multi_user';
}

export class DOMExtractor {
  static readonly #SELECTORS = {
    CELL: '[data-testid="cellInnerDiv"]',
    NOTIFICATION: 'article[data-testid="notification"]',
    USER_LINK: 'a[role="link"]',
    NOTIFICATION_TEXT: '[data-testid="notificationText"]',
    NOTIFICATION_ARTICLE: 'article'
  } as const;

  static readonly #PATTERNS = {
    PINNED_POST: /new pinned post in/i,
    TRENDING: /trending in/i,
    COMMUNITY_POST: /new community post in/i,
    MULTI_USER: /new post notifications for|and \d+ others/i,
    LIKE: /liked/i,
    REPLY: /replied/i,
    REPOST: /reposted/i,
    FOLLOW: /followed/i
  } as const;

  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      console.log('[XBot:DOM] Extracting profile data from:', {
        element: element.outerHTML.slice(0, 200) + '...',
        dataTestId: element.getAttribute('data-testid'),
        classes: element.className
      });

      // Skip if this is our warning element
      if (element.classList.contains('xbd-warning')) {
        console.log('[XBot:DOM] Skipping warning element');
        return null;
      }

      // Find the notification cell
      const cell = element.closest(DOMExtractor.#SELECTORS.CELL) || 
                  element.querySelector(DOMExtractor.#SELECTORS.CELL);
                  
      if (!(cell instanceof HTMLElement)) {
        console.log('[XBot:DOM] No notification cell found');
        return null;
      }

      // Find notification article
      const article = cell.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION_ARTICLE);
      if (!article) {
        console.log('[XBot:DOM] No notification article found');
        return null;
      }

      const notification = this.#parseNotification(article as HTMLElement);
      if (!notification) {
        console.log('[XBot:DOM] Failed to parse notification');
        return null;
      }

      console.log('[XBot:DOM] Parsed notification:', {
        type: notification.type,
        text: notification.text,
        userCount: notification.users?.length ?? 0
      });

      // Skip non-user notifications
      if (notification.type !== 'user_interaction' && notification.type !== 'multi_user') {
        console.log('[XBot:DOM] Skipping non-user notification:', notification.type);
        return null;
      }

      const users = notification.users;
      if (!users?.length) {
        console.log('[XBot:DOM] No users found in notification');
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
        followers: userProfile.followersCount,
        following: userProfile.followingCount
      });

      return userProfile;
    } catch (error) {
      console.error('[XBot:DOM] Error extracting profile data:', error);
      return null;
    }
  }

  #parseNotification(article: HTMLElement): NotificationData | null {
    try {
      console.debug('[XBot:DOM] Cell content:', {
        html: article.outerHTML,
        text: article.textContent
      });

      // Get all text content first
      const notificationText = article.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION_TEXT);
      const text = (notificationText?.textContent ?? article.textContent ?? '').toLowerCase();
      
      if (!text) {
        console.log('[XBot:DOM] No notification text found');
        return null;
      }

      console.debug('[XBot:DOM] Processing notification text:', text);

      // Find all user links
      const allLinks = [...article.querySelectorAll('a')];
      console.debug('[XBot:DOM] All links found:', allLinks.map(l => ({
        href: l.getAttribute('href'),
        text: l.textContent,
        html: l.outerHTML
      })));

      const userLinks = [...article.querySelectorAll(DOMExtractor.#SELECTORS.USER_LINK)]
        .filter(link => {
          const href = link.getAttribute('href');
          return href?.startsWith('/') && 
                 !href.includes('/i/') && 
                 !href.includes('/status/');
        });

      console.debug('[XBot:DOM] Filtered user links:', userLinks.map(l => ({
        href: l.getAttribute('href'),
        text: l.textContent,
        html: l.outerHTML
      })));

      if (!userLinks.length) {
        console.log('[XBot:DOM] No user links found');
        return null;
      }

      // Extract user data
      const users = userLinks
        .map(link => {
          const username = link.getAttribute('href')?.slice(1);
          console.debug('[XBot:DOM] Processing username:', username);
          if (!username) return null;

          const avatarContainer = article.querySelector(`[data-testid="UserAvatar-Container-${username}"]`);
          console.debug('[XBot:DOM] Avatar container:', {
            username,
            found: !!avatarContainer,
            html: avatarContainer?.outerHTML
          });
          if (!avatarContainer) return null;

          const profileImageUrl = this.#extractProfileImage(avatarContainer);
          console.debug('[XBot:DOM] Profile image:', {
            username,
            found: !!profileImageUrl,
            url: profileImageUrl
          });
          if (!profileImageUrl) return null;

          const displayName = link.textContent?.trim() || username;
          const interactionType = this.#determineInteractionType(text);
          const isMultiUser = DOMExtractor.#PATTERNS.MULTI_USER.test(text);
          const notificationType = isMultiUser ? 'multi_user' : 'user_interaction';

          console.debug('[XBot:DOM] User data:', {
            username,
            displayName,
            interactionType,
            notificationType
          });

          if (!isUserNotificationType(notificationType)) {
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

      console.debug('[XBot:DOM] Final users:', users);

      if (!users.length) {
        console.log('[XBot:DOM] No valid users found after processing');
        return null;
      }

      return {
        type: DOMExtractor.#PATTERNS.MULTI_USER.test(text)
          ? 'multi_user'
          : 'user_interaction',
        text,
        users
      };
    } catch (error) {
      console.error('[XBot:DOM] Error parsing notification:', error);
      return null;
    }
  }

  #determineInteractionType(text: string): InteractionType {
    const { LIKE, REPLY, REPOST, FOLLOW } = DOMExtractor.#PATTERNS;
    if (LIKE.test(text)) return 'like';
    if (REPLY.test(text)) return 'reply';
    if (REPOST.test(text)) return 'repost';
    if (FOLLOW.test(text)) return 'follow';
    return 'follow'; // Default to follow for unknown interactions
  }

  #extractProfileImage(container: Element): string | null {
    // Try to find img tag first
    const img = container.querySelector<HTMLImageElement>('img[src*="profile_images"]');
    if (img?.src) {
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
}
