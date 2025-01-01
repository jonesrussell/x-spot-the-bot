import { beforeEach, describe, expect, it } from 'vitest';
import { mockProfiles } from '../../../test/fixtures/profiles.js';
import { ProfileAnalyzer } from '../profile-analyzer.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
  });

  describe('analyzeBotProbability', () => {
    it('should return low probability for normal users', () => {
      const result = analyzer.analyzeBotProbability(mockProfiles.normalUser);
      expect(result).toBeLessThanOrEqual(0.3);
    });

    it('should return high probability for bot users', () => {
      const result = analyzer.analyzeBotProbability(mockProfiles.botUser);
      expect(result).toBeGreaterThan(0.6);
    });

    it('should return very low probability for verified users', () => {
      const result = analyzer.analyzeBotProbability(mockProfiles.verifiedUser);
      expect(result).toBeLessThan(0.1);
    });

    it('should detect random alphanumeric usernames', () => {
      const result = analyzer.analyzeBotProbability({
        ...mockProfiles.normalUser,
        username: 'a1b2c3d4e5f6g7h8'
      });
      expect(result).toBeGreaterThan(0.3);
    });

    it('should detect usernames with many numbers', () => {
      const result = analyzer.analyzeBotProbability({
        ...mockProfiles.normalUser,
        username: 'user12345678'
      });
      expect(result).toBeGreaterThan(0.25);
    });

    it('should detect bot keywords in username', () => {
      const result = analyzer.analyzeBotProbability({
        ...mockProfiles.normalUser,
        username: 'spambot123'
      });
      expect(result).toBeGreaterThan(0.35);
    });
  });
}); 