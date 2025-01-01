import type { InteractionType } from '../../types/profile.js';

export class NotificationTypeDetector {
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
    SPACE: /started a space|scheduled a space|space is starting/i
  } as const;

  public determineInteractionType(text: string): InteractionType {
    if (NotificationTypeDetector.#PATTERNS.LIKE.test(text)) return 'like';
    if (NotificationTypeDetector.#PATTERNS.REPLY.test(text)) return 'reply';
    if (NotificationTypeDetector.#PATTERNS.REPOST.test(text)) return 'repost';
    if (NotificationTypeDetector.#PATTERNS.FOLLOW.test(text)) return 'follow';
    if (NotificationTypeDetector.#PATTERNS.MENTION.test(text)) return 'mention';
    if (NotificationTypeDetector.#PATTERNS.QUOTE.test(text)) return 'quote';
    if (NotificationTypeDetector.#PATTERNS.LIST.test(text)) return 'list';
    if (NotificationTypeDetector.#PATTERNS.SPACE.test(text)) return 'space';
    if (NotificationTypeDetector.#PATTERNS.LIVE.test(text)) return 'live';
    return 'other';
  }

  public isMultiUserNotification(text: string): boolean {
    return NotificationTypeDetector.#PATTERNS.MULTI_USER.test(text);
  }
} 