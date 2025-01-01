import { beforeEach, describe, expect, it } from 'vitest';
import { DOMExtractor } from '../dom-extractor.js';

describe('DOMExtractor', () => {
  let domExtractor: DOMExtractor;

  beforeEach(() => {
    domExtractor = new DOMExtractor();
    document.body.innerHTML = '';
  });

  describe('extractProfileData', () => {
    it('should extract profile data from notification cell', () => {
      const cell = document.createElement('div');
      cell.setAttribute('data-testid', 'cellInnerDiv');
      
      const article = document.createElement('article');
      const notificationText = document.createElement('div');
      notificationText.setAttribute('data-testid', 'notificationText');
      notificationText.textContent = 'liked your post';
      article.appendChild(notificationText);

      const userLink = document.createElement('a');
      userLink.setAttribute('role', 'link');
      userLink.setAttribute('href', '/testuser');
      
      const userName = document.createElement('div');
      userName.setAttribute('data-testid', 'User-Name');
      userName.textContent = 'Test User';
      userLink.appendChild(userName);
      
      article.appendChild(userLink);
      cell.appendChild(article);
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.displayName).toBe('Test User');
      expect(result?.interactionType).toBe('like');
    });

    it('should handle missing user name element', () => {
      const cell = document.createElement('div');
      cell.setAttribute('data-testid', 'cellInnerDiv');
      
      const article = document.createElement('article');
      const userLink = document.createElement('a');
      userLink.setAttribute('role', 'link');
      userLink.setAttribute('href', '/testuser');
      
      article.appendChild(userLink);
      cell.appendChild(article);
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.displayName).toBe('testuser');
    });

    it('should handle missing profile image', () => {
      const cell = document.createElement('div');
      cell.setAttribute('data-testid', 'cellInnerDiv');
      
      const article = document.createElement('article');
      const userLink = document.createElement('a');
      userLink.setAttribute('role', 'link');
      userLink.setAttribute('href', '/testuser');
      
      article.appendChild(userLink);
      cell.appendChild(article);
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.profileImageUrl).toBe('https://abs.twimg.com/sticky/default_profile_images/default_profile.png');
    });

    it('should handle notifications with interaction type', () => {
      const cell = document.createElement('div');
      cell.setAttribute('data-testid', 'cellInnerDiv');
      
      const article = document.createElement('article');
      const notificationText = document.createElement('div');
      notificationText.setAttribute('data-testid', 'notificationText');
      notificationText.textContent = 'liked your post';
      article.appendChild(notificationText);

      const userLink = document.createElement('a');
      userLink.setAttribute('role', 'link');
      userLink.setAttribute('href', '/testuser');
      
      article.appendChild(userLink);
      cell.appendChild(article);
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.interactionType).toBe('like');
    });

    it('should handle multi-user notifications', () => {
      const cell = document.createElement('div');
      cell.setAttribute('data-testid', 'cellInnerDiv');
      
      const article = document.createElement('article');
      const notificationText = document.createElement('div');
      notificationText.setAttribute('data-testid', 'notificationText');
      notificationText.textContent = 'user1 and 2 others liked your post';
      article.appendChild(notificationText);

      const userLink = document.createElement('a');
      userLink.setAttribute('role', 'link');
      userLink.setAttribute('href', '/user1');
      
      const userName = document.createElement('div');
      userName.setAttribute('data-testid', 'User-Name');
      userName.textContent = 'User One';
      userLink.appendChild(userName);
      
      article.appendChild(userLink);
      cell.appendChild(article);
      document.body.appendChild(cell);

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('user1');
      expect(result?.notificationType).toBe('multi_user');
    });
  });
}); 