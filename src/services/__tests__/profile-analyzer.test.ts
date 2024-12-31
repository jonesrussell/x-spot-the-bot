import { ProfileAnalyzer } from '../profile-analyzer.js';
import { Values } from '../../types/profile.js';
import type { ProfileData } from '../../types/profile.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
  });

  describe('analyzeBotProbability', () => {
    it('should return low probability for normal profile', async () => {
      const profile: ProfileData = {
        username: 'normal_user',
        displayName: 'Normal User',
        profileImageUrl: 'avatar.jpg',
        followersCount: 100,
        followingCount: 100,
        interactionTimestamp: Date.now(),
        interactionType: Values.InteractionTypes.Like,
        notificationType: Values.NotificationTypes.UserInteraction
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeLessThan(0.6);
    });
  });
}); 