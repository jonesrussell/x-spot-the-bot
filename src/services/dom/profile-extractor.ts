import type { RawProfileData } from '../../types/profile.js';
import { ElementExtractor } from './element-extractor.js';
import { ImageResolver } from './image-resolver.js';
import { NotificationTypeDetector } from './notification-type-detector.js';

export class ProfileExtractor {
  #elementExtractor: ElementExtractor;
  #imageResolver: ImageResolver;
  #typeDetector: NotificationTypeDetector;

  constructor() {
    this.#elementExtractor = new ElementExtractor();
    this.#imageResolver = new ImageResolver();
    this.#typeDetector = new NotificationTypeDetector();
  }

  public extractProfileData(element: HTMLElement): RawProfileData | null {
    try {
      const cell = this.#elementExtractor.extractNotificationCell(element);
      if (!cell || cell.hasAttribute('data-xbot-processed')) return null;
      cell.setAttribute('data-xbot-processed', 'true');

      const article = this.#elementExtractor.extractNotificationArticle(cell);
      if (!article) {
        console.debug('[XBot:DOM] No notification article found in cell');
        return null;
      }

      const text = this.#elementExtractor.extractNotificationText(article);
      if (!text) return null;

      const userLinks = this.#elementExtractor.extractUserLinks(article);
      if (!userLinks.length) {
        console.debug('[XBot:DOM] No valid user links found in notification');
        return null;
      }

      const firstLink = userLinks[0];
      if (!firstLink) {
        console.debug('[XBot:DOM] First user link is undefined');
        return null;
      }

      const profileImages = this.#elementExtractor.extractProfileImages(cell);
      const firstUser = this.#extractUserProfile(firstLink, text, profileImages);
      return firstUser ?? null;

    } catch (error) {
      console.error('[XBot:DOM] Error extracting profile data:', error);
      return null;
    }
  }

  #extractUserProfile(
    userLink: HTMLAnchorElement,
    notificationText: string,
    profileImages: HTMLImageElement[]
  ): RawProfileData | null {
    const username = userLink.getAttribute('href')?.slice(1);
    if (!username) return null;

    const displayName = userLink.textContent?.trim() || username;
    const interactionType = this.#typeDetector.determineInteractionType(notificationText);
    const isMultiUser = this.#typeDetector.isMultiUserNotification(notificationText);
    const notificationType = isMultiUser ? 'multi_user' : 'user_interaction';
    const isVerified = this.#elementExtractor.isVerified(userLink);
    const profileImageUrl = this.#imageResolver.resolveProfileImage(userLink, profileImages);

    return {
      username,
      displayName,
      profileImageUrl,
      followersCount: 0,
      followingCount: 0,
      interactionTimestamp: Date.now(),
      interactionType,
      notificationType,
      isVerified
    };
  }
} 