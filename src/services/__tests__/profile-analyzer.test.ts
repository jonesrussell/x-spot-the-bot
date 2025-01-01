import type { ProfileData } from '../../types/profile.js';
import { ProfileAnalyzer } from '../profile-analyzer.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
  });

  describe('analyzeProfile', () => {
    it('should analyze a profile and return bot probability', () => {
      const profile: ProfileData = {
        username: 'test_user123',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/avatar.jpg',
        followersCount: 100,
        followingCount: 200,
        interactionTimestamp: Date.now(),
        interactionType: 'like',
        notificationType: 'user_interaction',
        botProbability: 0
      };

      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeDefined();
      expect(result.reasons).toBeInstanceOf(Array);
    });
  });
}); 