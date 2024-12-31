import { ProfileData, InteractionType, NotificationType } from '../types/profile.js';

interface NotificationData {
  type: NotificationType;
  text: string;
  users?: ProfileData[];
}

export class DOMExtractor {
  private readonly SELECTORS = {
    CELL: '[data-testid="cellInnerDiv"]',
    NOTIFICATION: '[data-testid="notification"]',
    USER_NAME: '[data-testid="UserName"]',
    USER_AVATAR: '[data-testid="UserAvatar"]',
    TWEET_TEXT: '[data-testid="tweetText"]'
  } as const;

  private readonly NOTIFICATION_PATTERNS = {
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

      // Determine notification type and handle accordingly
      const notificationData = this.parseNotification(cell);
      if (!notificationData) {
        return null;
      }

      // Skip non-user notifications
      if (notificationData.type !== NotificationType.UserInteraction && 
          notificationData.type !== NotificationType.MultiUser) {
        console.debug('[XBot:DOM] Skipping non-user notification:', notificationData.type);
        return null;
      }

      // Get the first user's data (for now)
      if (!notificationData.users || notificationData.users.length === 0) {
        console.debug('[XBot:DOM] No user data found in notification');
        return null;
      }

      return notificationData.users[0];

    } catch (error) {
      console.error('[XBot:DOM] Error:', error);
      return null;
    }
  }

  private parseNotification(cell: HTMLElement): NotificationData | null {
    const text = cell.textContent?.toLowerCase() || '';

    // Check notification type
    if (this.NOTIFICATION_PATTERNS.PINNED_POST.test(text)) {
      return { type: NotificationType.PinnedPost, text };
    }
    if (this.NOTIFICATION_PATTERNS.TRENDING.test(text)) {
      return { type: NotificationType.Trending, text };
    }
    if (this.NOTIFICATION_PATTERNS.COMMUNITY_POST.test(text)) {
      return { type: NotificationType.CommunityPost, text };
    }

    // Find all user links
    const userLinks = Array.from(cell.querySelectorAll('a[role="link"]')).filter(link => {
      const href = link.getAttribute('href');
      return href && href.startsWith('/') && !href.includes('/i/');
    });

    if (userLinks.length === 0) {
      console.debug('[XBot:DOM] No user links found');
      return null;
    }

    // Extract user data
    const users: ProfileData[] = [];
    for (const link of userLinks) {
      const username = link.getAttribute('href')?.slice(1);
      if (!username) continue;

      const avatarContainer = cell.querySelector(`[data-testid="UserAvatar-Container-${username}"]`);
      if (!avatarContainer) continue;

      const profileImageUrl = this.extractProfileImage(avatarContainer);
      if (!profileImageUrl) continue;

      const displayName = link.textContent?.trim() || username;
      const interactionType = this.determineInteractionType(text);
      const isMultiUser = this.NOTIFICATION_PATTERNS.MULTI_USER.test(text);

      users.push({
        username,
        displayName,
        profileImageUrl,
        followersCount: 0,
        followingCount: 0,
        interactionTimestamp: Date.now(),
        interactionType,
        notificationType: isMultiUser ? NotificationType.MultiUser : NotificationType.UserInteraction
      });
    }

    return {
      type: this.NOTIFICATION_PATTERNS.MULTI_USER.test(text)
        ? NotificationType.MultiUser
        : NotificationType.UserInteraction,
      text,
      users
    };
  }

  private determineInteractionType(text: string): InteractionType {
    if (this.NOTIFICATION_PATTERNS.LIKE.test(text)) return InteractionType.Like;
    if (this.NOTIFICATION_PATTERNS.REPLY.test(text)) return InteractionType.Reply;
    if (this.NOTIFICATION_PATTERNS.REPOST.test(text)) return InteractionType.Repost;
    return InteractionType.Follow;
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
}
