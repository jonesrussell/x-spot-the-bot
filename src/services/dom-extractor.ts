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
    USER_LINK: 'a[href^="/"]',
    NOTIFICATION_TEXT: '[data-testid="notificationText"]'
  } as const;

  static readonly #PATTERNS = {
    PINNED_POST: /new pinned post in/i,
    TRENDING: /trending in/i,
    COMMUNITY_POST: /new community post in/i,
    MULTI_USER: /new post notifications for/i,
    LIKE: /liked/i,
    REPLY: /replied/i,
    REPOST: /reposted/i,
    FOLLOW: /followed/i
  } as const;

  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      // Skip if this is our warning element
      if (element.classList.contains('xbd-warning')) {
        return null;
      }

      // Find the notification cell
      const cell = element.closest(DOMExtractor.#SELECTORS.CELL);
      if (!(cell instanceof HTMLElement)) {
        return null;
      }

      // Log the cell's HTML for debugging
      console.debug('[XBot:DOM] Processing cell:', {
        html: cell.outerHTML,
        testIds: [...cell.querySelectorAll('[data-testid]')]
          .map(el => el.getAttribute('data-testid'))
      });

      // Determine notification type and handle accordingly
      const notificationData = this.#parseNotification(cell);
      if (!notificationData?.users?.length) {
        return null;
      }

      // Skip non-user notifications
      if (notificationData.type !== 'user_interaction' && 
          notificationData.type !== 'multi_user') {
        console.debug('[XBot:DOM] Skipping non-user notification:', notificationData.type);
        return null;
      }

      // Convert UserProfileData to ProfileData
      const userProfile = notificationData.users?.[0];
      if (!userProfile) {
        console.debug('[XBot:DOM] No user profile found in notification');
        return null;
      }

      return {
        username: userProfile.username,
        displayName: userProfile.displayName,
        profileImageUrl: userProfile.profileImageUrl,
        followersCount: userProfile.followersCount,
        followingCount: userProfile.followingCount,
        interactionTimestamp: userProfile.interactionTimestamp,
        interactionType: userProfile.interactionType,
        notificationType: userProfile.notificationType === 'multi_user'
          ? 'multi_user'
          : 'user_interaction'
      };

    } catch (error) {
      console.error('[XBot:DOM] Error:', error);
      return null;
    }
  }

  #parseNotification(cell: HTMLElement): NotificationData | null {
    console.debug('[XBot:DOM] Cell content:', {
      html: cell.outerHTML,
      text: cell.textContent
    });

    const notificationText = cell.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION_TEXT);
    console.debug('[XBot:DOM] Notification text element:', {
      found: !!notificationText,
      text: notificationText?.textContent
    });

    const text = notificationText?.textContent?.toLowerCase() ?? cell.textContent?.toLowerCase() ?? '';
    console.debug('[XBot:DOM] Parsed text:', text);

    // Find all user links
    const allLinks = [...cell.querySelectorAll('a')];
    console.debug('[XBot:DOM] All links found:', allLinks.map(l => ({
      href: l.getAttribute('href'),
      text: l.textContent,
      html: l.outerHTML
    })));

    const userLinks = [...cell.querySelectorAll(DOMExtractor.#SELECTORS.USER_LINK)]
      .filter(link => {
        const href = link.getAttribute('href');
        return href?.startsWith('/') && !href.includes('/i/');
      });

    console.debug('[XBot:DOM] Filtered user links:', userLinks.map(l => ({
      href: l.getAttribute('href'),
      text: l.textContent,
      html: l.outerHTML
    })));

    if (!userLinks.length) {
      console.debug('[XBot:DOM] No user links found');
      return null;
    }

    // Extract user data
    const users = userLinks
      .map(link => {
        const username = link.getAttribute('href')?.slice(1);
        console.debug('[XBot:DOM] Processing username:', username);
        if (!username) return null;

        const avatarContainer = cell.querySelector(`[data-testid="UserAvatar-Container-${username}"]`);
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
      return null;
    }

    return {
      type: DOMExtractor.#PATTERNS.MULTI_USER.test(text)
        ? 'multi_user'
        : 'user_interaction',
      text,
      users
    };
  }

  #determineInteractionType(text: string): InteractionType {
    const { LIKE, REPLY, REPOST } = DOMExtractor.#PATTERNS;
    if (LIKE.test(text)) return 'like';
    if (REPLY.test(text)) return 'reply';
    if (REPOST.test(text)) return 'repost';
    return 'follow';
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
