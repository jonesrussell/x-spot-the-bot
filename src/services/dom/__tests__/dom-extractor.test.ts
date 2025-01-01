import { beforeEach, describe, expect, it } from 'vitest';
import { addNotificationText, addUserInfo, createNotificationCell } from '../../../test/helpers/dom.js';
import { DOMExtractor } from '../dom-extractor.js';

describe('DOMExtractor', () => {
  let domExtractor: DOMExtractor;

  beforeEach(() => {
    domExtractor = new DOMExtractor();
    document.body.innerHTML = '';
  });

  describe('extractProfileData', () => {
    it('should extract profile data from notification cell', () => {
      const cell = createNotificationCell();
      addUserInfo(cell, 'testuser', 'Test User');
      addNotificationText(cell, 'liked your post');
      const img = document.createElement('img');
      img.setAttribute('src', 'https://example.com/profile_images/profile.jpg');
      cell.querySelector('article')?.appendChild(img);
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.displayName).toBe('Test User');
      expect(result?.interactionType).toBe('like');
      expect(result?.profileImageUrl).toBe('https://example.com/profile_images/profile.jpg');
    });

    it('should handle missing user name element', () => {
      const cell = createNotificationCell();
      addUserInfo(cell, 'testuser');
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.displayName).toBe('testuser');
    });

    it('should handle missing profile image', () => {
      const cell = createNotificationCell();
      addUserInfo(cell, 'testuser');
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.profileImageUrl).toBe('https://abs.twimg.com/sticky/default_profile_images/default_profile.png');
    });

    it('should handle notifications with interaction type', () => {
      const cell = createNotificationCell();
      addUserInfo(cell, 'testuser');
      addNotificationText(cell, 'liked your post');
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.interactionType).toBe('like');
    });

    it('should handle multi-user notifications', () => {
      const cell = createNotificationCell();
      addUserInfo(cell, 'user1', 'User One');
      addNotificationText(cell, 'user1 and 2 others liked your post');
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('user1');
      expect(result?.notificationType).toBe('multi_user');
    });
  });
}); 