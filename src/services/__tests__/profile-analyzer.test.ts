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

  describe('analyzeBotProbability', () => {
    it('should return zero probability for community posts', async () => {
      const profile: Profile = {
        username: 'i/communities/tech',
        displayName: 'Tech Community',
        followersCount: 1000,
        followingCount: 1000
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it('should include reasons for high probability accounts', async () => {
      const profile: Profile = {
        username: 'bot12345678',
        displayName: 'Test Bot',
        followersCount: 0,
        followingCount: 0
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeGreaterThanOrEqual(0.6);
      expect(result.reasons).toContain('No followers or following');
      expect(result.reasons).toContain('Random alphanumeric username');
    });

    it('should detect multiple suspicious patterns', async () => {
      const profile: Profile = {
        username: 'spambot1234',
        displayName: 'Spam Bot',
        followersCount: 0,
        followingCount: 0
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.reasons).toContain('Username contains bot-like keywords');
      expect(result.reasons).toContain('Username ends with many numbers');
      expect(result.reasons).toContain('No followers or following');
    });

    it('should return low probability with no reasons for normal accounts', async () => {
      const profile: Profile = {
        username: 'johndoe',
        displayName: 'John Doe',
        followersCount: 100,
        followingCount: 100
      };

      const result = await analyzer.analyzeBotProbability(profile);
      expect(result.probability).toBeLessThan(0.6);
      expect(result.reasons).toHaveLength(0);
    });
  });
}); 