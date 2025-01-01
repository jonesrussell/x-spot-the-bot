import type { ProfileData } from '../../types/profile.js';
import { ProfileAnalyzer } from '../profile-analyzer.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
  });

  describe('analyzeProfile', () => {
    it('should detect bot-like usernames', () => {
      const profile: ProfileData = {
        username: 'bot123456789',
        displayName: 'Bot Account',
        profileImageUrl: 'https://example.com/avatar.jpg',
        followersCount: 0,
        followingCount: 0,
        interactionTimestamp: Date.now(),
        interactionType: 'like',
        notificationType: 'user_interaction',
        botProbability: 0,
        isVerified: false
      };

      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeGreaterThan(0.5);
      expect(result.reasons).toContain('Username appears randomly generated');
    });

    it('should detect normal usernames', () => {
      const profile: ProfileData = {
        username: 'john_doe',
        displayName: 'John Doe',
        profileImageUrl: 'https://example.com/avatar.jpg',
        followersCount: 100,
        followingCount: 100,
        interactionTimestamp: Date.now(),
        interactionType: 'like',
        notificationType: 'user_interaction',
        botProbability: 0,
        isVerified: false
      };

      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeLessThan(0.3);
      expect(result.reasons).toHaveLength(0);
    });

    it('should ignore verified accounts', () => {
      const profile: ProfileData = {
        username: 'bot123456789',
        displayName: 'Bot Account',
        profileImageUrl: 'https://example.com/avatar.jpg',
        followersCount: 0,
        followingCount: 0,
        interactionTimestamp: Date.now(),
        interactionType: 'like',
        notificationType: 'user_interaction',
        botProbability: 0,
        isVerified: true
      };

      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });
  });
}); 