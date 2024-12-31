import { ProfileAnalyzer } from '../profile-analyzer.js';
import { Profile } from '../../types/profile.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
  });

  describe('calculateBotProbability', () => {
    it('should return high probability for suspicious usernames', () => {
      const profile: Profile = {
        username: 'bot12345678',
        displayName: 'Test Bot',
        followersCount: 0,
        followingCount: 0
      };

      const probability = analyzer.calculateBotProbability(profile);
      expect(probability).toBeGreaterThanOrEqual(0.6);
    });

    it('should return low probability for normal usernames', () => {
      const profile: Profile = {
        username: 'johndoe',
        displayName: 'John Doe',
        followersCount: 100,
        followingCount: 100
      };

      const probability = analyzer.calculateBotProbability(profile);
      expect(probability).toBeLessThan(0.6);
    });

    it('should increase probability for no followers/following', () => {
      const profile: Profile = {
        username: 'normaluser',
        displayName: 'Normal User',
        followersCount: 0,
        followingCount: 0
      };

      const probability = analyzer.calculateBotProbability(profile);
      expect(probability).toBeGreaterThanOrEqual(0.3);
    });

    it('should detect numeric suffix pattern', () => {
      const profile: Profile = {
        username: 'user1234',
        displayName: 'Test User',
        followersCount: 10,
        followingCount: 10
      };

      const probability = analyzer.calculateBotProbability(profile);
      expect(probability).toBeGreaterThanOrEqual(0.2);
    });
  });
}); 