import { DOMExtractor } from '../dom-extractor.js';
import { InteractionTypes } from '../../types/profile.js';

describe('DOMExtractor', () => {
  let domExtractor: DOMExtractor;

  beforeEach(() => {
    domExtractor = new DOMExtractor();
    document.body.innerHTML = '';
  });

  function createNotificationCell(options: {
    username?: string;
    text?: string;
    hasAvatar?: boolean;
  }) {
    const cell = document.createElement('div');
    cell.setAttribute('data-testid', 'cellInnerDiv');

    if (options.text) {
      cell.textContent = options.text;
    }

    if (options.username) {
      const link = document.createElement('a');
      link.setAttribute('role', 'link');
      link.setAttribute('href', `/${options.username}`);
      link.textContent = 'Test User';
      cell.appendChild(link);

      if (options.hasAvatar) {
        const img = document.createElement('img');
        img.setAttribute('src', `profile_images/${options.username}.jpg`);
        const container = document.createElement('div');
        container.setAttribute('data-testid', `UserAvatar-Container-${options.username}`);
        container.appendChild(img);
        cell.appendChild(container);
      }
    }

    return cell;
  }

  describe('extractProfileData', () => {
    it('should extract profile data from notification cell', () => {
      const cell = createNotificationCell({
        username: 'testuser',
        text: 'liked your post',
        hasAvatar: true
      });

      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.profileImageUrl).toBe('http://localhost/profile_images/testuser.jpg');
    });

    it('should handle missing user name element', () => {
      const cell = createNotificationCell({});
      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeNull();
    });

    it('should handle missing profile image', () => {
      const cell = createNotificationCell({
        username: 'testuser',
        hasAvatar: false
      });
      const result = domExtractor.extractProfileData(cell);
      expect(result).toBeNull();
    });

    it('should handle notifications with interaction type', () => {
      const cell = createNotificationCell({
        username: 'testuser',
        text: 'liked your post',
        hasAvatar: true
      });

      const result = domExtractor.extractProfileData(cell);
      expect(result?.interactionType).toBe(InteractionTypes.Like);
    });

    it('should handle multi-user notifications', () => {
      const cell = createNotificationCell({});
      cell.textContent = 'new post notifications for';

      ['user1', 'user2'].forEach(username => {
        const link = document.createElement('a');
        link.setAttribute('role', 'link');
        link.setAttribute('href', `/${username}`);
        link.textContent = username;
        cell.appendChild(link);

        const img = document.createElement('img');
        img.setAttribute('src', `profile_images/${username}.jpg`);
        const container = document.createElement('div');
        container.setAttribute('data-testid', `UserAvatar-Container-${username}`);
        container.appendChild(img);
        cell.appendChild(container);
      });

      const result = domExtractor.extractProfileData(cell);
      expect(result?.username).toBe('user1');
      expect(result?.profileImageUrl).toBe('http://localhost/profile_images/user1.jpg');
    });
  });
}); 