import { ProfileAnalyzer } from '../profile-analyzer.js';
import { InteractionTypes, NotificationTypes } from '../../types/profile.js';
import type { ProfileData } from '../../types/profile.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
  });

  describe('analyzeBotProbability', () => {
    it('should detect random alphanumeric usernames', async () => {
      const profile: ProfileData = {
        username: 'a1b2c3d4e5',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        followersCount: 100,
        followingCount: 100,
        interactionTimestamp: Date.now(),
        interactionType: InteractionTypes.Like,
        notificationType: NotificationTypes.UserInteraction
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.reasons).toContain('Random alphanumeric username');
    });

    it('should detect usernames with many numbers', async () => {
      const profile: ProfileData = {
        username: 'user12345',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        followersCount: 100,
        followingCount: 100,
        interactionTimestamp: Date.now(),
        interactionType: InteractionTypes.Like,
        notificationType: NotificationTypes.UserInteraction
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.reasons).toContain('Username contains many numbers');
    });

    it('should detect bot-like keywords', async () => {
      const profile: ProfileData = {
        username: 'spambot123',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        followersCount: 100,
        followingCount: 100,
        interactionTimestamp: Date.now(),
        interactionType: InteractionTypes.Like,
        notificationType: NotificationTypes.UserInteraction
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.reasons).toContain('Username contains bot-like keywords');
    });

    it('should detect accounts with no followers', async () => {
      const profile: ProfileData = {
        username: 'testuser',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        followersCount: 0,
        followingCount: 0,
        interactionTimestamp: Date.now(),
        interactionType: InteractionTypes.Like,
        notificationType: NotificationTypes.UserInteraction
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.reasons).toContain('No followers or following');
    });
  });
}); 