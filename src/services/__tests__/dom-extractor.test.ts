import { DOMExtractor } from '../dom-extractor.js';
import { InteractionType } from '../../types/profile.js';

describe('DOMExtractor', () => {
  let domExtractor: DOMExtractor;

  beforeEach(() => {
    domExtractor = new DOMExtractor();
    document.body.innerHTML = '';
  });

  describe('extractProfileData', () => {
    it('should extract profile data from notification cell', () => {
      const notificationCell = document.createElement('div');
      notificationCell.setAttribute('data-testid', 'notification');
      
      const userLink = document.createElement('a');
      userLink.setAttribute('data-testid', 'UserName');
      userLink.textContent = 'testuser';

      const avatar = document.createElement('img');
      avatar.setAttribute('data-testid', 'UserAvatar');
      avatar.src = 'avatar.jpg';

      notificationCell.appendChild(userLink);
      notificationCell.appendChild(avatar);

      const result = domExtractor.extractProfileData(notificationCell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.profileImageUrl).toBe('avatar.jpg');
    });

    it('should handle missing user name element', () => {
      const notificationCell = document.createElement('div');
      notificationCell.setAttribute('data-testid', 'notification');

      const result = domExtractor.extractProfileData(notificationCell);
      expect(result).toBeNull();
    });

    it('should handle missing profile image', () => {
      const notificationCell = document.createElement('div');
      notificationCell.setAttribute('data-testid', 'notification');
      
      const userLink = document.createElement('a');
      userLink.setAttribute('data-testid', 'UserName');
      userLink.textContent = 'testuser';

      notificationCell.appendChild(userLink);

      const result = domExtractor.extractProfileData(notificationCell);
      expect(result).toBeNull();
    });

    it('should handle notifications with interaction type', () => {
      const notificationCell = document.createElement('div');
      notificationCell.setAttribute('data-testid', 'notification');
      
      const userLink = document.createElement('a');
      userLink.setAttribute('data-testid', 'UserName');
      userLink.textContent = 'testuser';

      const avatar = document.createElement('img');
      avatar.setAttribute('data-testid', 'UserAvatar');
      avatar.src = 'avatar.jpg';

      const interactionText = document.createElement('span');
      interactionText.textContent = 'liked your post';

      notificationCell.appendChild(userLink);
      notificationCell.appendChild(avatar);
      notificationCell.appendChild(interactionText);

      const result = domExtractor.extractProfileData(notificationCell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.profileImageUrl).toBe('avatar.jpg');
      expect(result?.interactionType).toBe(InteractionType.Like);
    });

    it('should handle combination notifications with multiple users', () => {
      const notificationCell = document.createElement('div');
      notificationCell.setAttribute('data-testid', 'notification');
      
      const userLinks = [
        { username: 'user1', avatarUrl: 'avatar1.jpg' },
        { username: 'user2', avatarUrl: 'avatar2.jpg' }
      ].map(({ username, avatarUrl }) => {
        const userLink = document.createElement('a');
        userLink.setAttribute('data-testid', 'UserName');
        userLink.textContent = username;

        const avatar = document.createElement('img');
        avatar.setAttribute('data-testid', 'UserAvatar');
        avatar.src = avatarUrl;

        notificationCell.appendChild(userLink);
        notificationCell.appendChild(avatar);
        return { userLink, avatar };
      });

      // Verify that both users were added to the notification
      expect(userLinks).toHaveLength(2);
      expect(userLinks[0].userLink.textContent).toBe('user1');
      expect(userLinks[1].userLink.textContent).toBe('user2');

      const result = domExtractor.extractProfileData(notificationCell);
      expect(result).toBeDefined();
      expect(result?.username).toBe('user1');
      expect(result?.profileImageUrl).toBe('avatar1.jpg');
    });
  });
}); 