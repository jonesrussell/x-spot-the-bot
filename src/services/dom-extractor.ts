import type { InteractionType, ProfileData } from '../types/profile.js';

interface UserProfileData extends ProfileData {
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
    PINNED_POST: /new pinned post in|pinned a post from/i,
    TRENDING: /trending in|trending with/i,
    COMMUNITY_POST: /new community post in|posted in/i,
    MULTI_USER: /new post notifications for|and \d+ others|others liked|others followed/i,
    LIKE: /liked your|liked \d+ of your/i,
    REPLY: /replied to|replying to|replied to your|commented on your/i,
    REPOST: /reposted your|reposted \d+ of your/i,
    FOLLOW: /followed you|followed each other/i,
    LIVE: /is live:|started a space|scheduled a space/i,
    MENTION: /mentioned you|tagged you/i,
    QUOTE: /quoted your|quote tweeted/i,
    LIST: /added you to|created a list/i,
    SPACE: /started a space|scheduled a space|space is starting/i,
    BOT_PATTERNS: {
      RANDOM_ALPHANUMERIC: /^[a-z0-9]{8,}$/,
      MANY_NUMBERS: /[0-9]{4,}/,
      BOT_KEYWORDS: /bot|spam|[0-9]+[a-z]+[0-9]+/,
      RANDOM_SUFFIX: /[a-z]+[0-9]{4,}$/,
      NUMERIC_SUFFIX: /[0-9]{4,}$/,
      RANDOM_LETTERS: /[A-Z]{2,}[0-9]+/
    }
  } as const;

  #calculateBotProbability(username: string): number {
    let score = 0;
    const patterns = DOMExtractor.#PATTERNS.BOT_PATTERNS;

    if (patterns.RANDOM_ALPHANUMERIC.test(username)) score += 0.3;
    if (patterns.MANY_NUMBERS.test(username)) score += 0.2;
    if (patterns.BOT_KEYWORDS.test(username)) score += 0.3;
    if (patterns.RANDOM_SUFFIX.test(username)) score += 0.2;
    if (patterns.NUMERIC_SUFFIX.test(username)) score += 0.2;
    if (patterns.RANDOM_LETTERS.test(username)) score += 0.2;

    return Math.min(score, 0.9);
  }

  public extractProfileData(element: HTMLElement): ProfileData | null {
    try {
      if (element.classList.contains('xbd-warning')) return null;

      const cell = element.closest(DOMExtractor.#SELECTORS.CELL);
      if (!cell || cell.hasAttribute('data-xbot-processed')) return null;
      cell.setAttribute('data-xbot-processed', 'true');

      const article = cell.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION);
      if (!article) return null;

      const notificationText = article.querySelector(DOMExtractor.#SELECTORS.NOTIFICATION_TEXT);
      const text = (notificationText?.textContent ?? article.textContent ?? '').toLowerCase();
      if (!text) return null;

      const userLinks = [...article.querySelectorAll(DOMExtractor.#SELECTORS.USER_LINK)]
        .filter(link => {
          const href = link.getAttribute('href');
          return href?.startsWith('/') && 
                 !href.includes('/i/') && 
                 !href.includes('/status/') &&
                 !href.includes('/lists/') &&
                 !href.includes('/topics/');
        });

      if (!userLinks.length) return null;

      const users = userLinks
        .map(link => {
          const username = link.getAttribute('href')?.slice(1);
          if (!username) return null;

          const displayName = link.textContent?.trim() || username;
          const interactionType = this.#determineInteractionType(text);
          const isMultiUser = DOMExtractor.#PATTERNS.MULTI_USER.test(text);
          const notificationType = isMultiUser ? 'multi_user' : 'user_interaction';
          const botProbability = this.#calculateBotProbability(username);

          let profileImageUrl = 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png';
          const profileImgs = [...cell.querySelectorAll('img[src*="profile_images"]')]
            .filter((img): img is HTMLImageElement => img instanceof HTMLImageElement && !!img.src);
            
          const userRect = link.getBoundingClientRect();
          let closestImg = profileImgs[0];
          let minDistance = Infinity;

          for (const img of profileImgs) {
            const imgRect = img.getBoundingClientRect();
            const distance = Math.abs(userRect.top - imgRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestImg = img;
            }
          }

          if (closestImg) {
            profileImageUrl = closestImg.src;
          }

          return {
            username,
            displayName,
            profileImageUrl,
            followersCount: 0,
            followingCount: 0,
            interactionTimestamp: Date.now(),
            interactionType,
            notificationType,
            botProbability
          } satisfies UserProfileData;
        })
        .filter((user): user is UserProfileData => {
          if (!user) return false;
          user.notificationType = DOMExtractor.#PATTERNS.MULTI_USER.test(text)
            ? 'multi_user'
            : 'user_interaction';
          return true;
        });

      if (!users.length) return null;

      const userProfile = users[0];
      if (!userProfile) return null;

      return userProfile;
    } catch (error) {
      return null;
    }
  }

  #determineInteractionType(text: string): InteractionType {
    if (DOMExtractor.#PATTERNS.LIKE.test(text)) return 'like';
    if (DOMExtractor.#PATTERNS.REPLY.test(text)) return 'reply';
    if (DOMExtractor.#PATTERNS.REPOST.test(text)) return 'repost';
    if (DOMExtractor.#PATTERNS.FOLLOW.test(text)) return 'follow';
    if (DOMExtractor.#PATTERNS.MENTION.test(text)) return 'mention';
    if (DOMExtractor.#PATTERNS.QUOTE.test(text)) return 'quote';
    if (DOMExtractor.#PATTERNS.LIST.test(text)) return 'list';
    if (DOMExtractor.#PATTERNS.SPACE.test(text)) return 'space';
    if (DOMExtractor.#PATTERNS.LIVE.test(text)) return 'live';
    return 'other';
  }
}
