import type { RawProfileData } from '../../../types/profile.js';
import { ScoreCalculator } from '../score-calculator.js';

describe('ScoreCalculator', () => {
  let calculator: ScoreCalculator;

  beforeEach(() => {
    calculator = new ScoreCalculator();
  });

  const createMockProfile = (overrides: Partial<RawProfileData> = {}): RawProfileData => ({
    username: 'testuser',
    displayName: 'Test User',
    profileImageUrl: 'https://example.com/avatar.jpg',
    followersCount: 100,
    followingCount: 100,
    interactionTimestamp: Date.now(),
    interactionType: 'like',
    notificationType: 'user_interaction',
    isVerified: false,
    ...overrides
  });

  describe('calculateScore', () => {
    it('should include pattern reason when provided', () => {
      const profile = createMockProfile();
      const result = calculator.calculateScore(profile, 0.3, 'Test reason');
      expect(result.reasons).toContain('Test reason');
    });

    it('should not include pattern reason when null', () => {
      const profile = createMockProfile();
      const result = calculator.calculateScore(profile, 0.3, null);
      expect(result.reasons).not.toContain(null);
      expect(result.reasons).toHaveLength(0);
    });

    it('should not check additional factors below threshold', () => {
      const profile = createMockProfile({
        followersCount: 0,
        followingCount: 0,
        displayName: 'testuser'
      });
      const result = calculator.calculateScore(profile, 0.3, null);
      expect(result.probability).toBe(0.3);
      expect(result.reasons).toHaveLength(0);
    });

    it('should check additional factors above threshold', () => {
      const profile = createMockProfile({
        followersCount: 0,
        followingCount: 0,
        displayName: 'testuser'
      });
      const result = calculator.calculateScore(profile, 0.4, null);
      expect(result.probability).toBeGreaterThan(0.4);
      expect(result.reasons).toContain('No followers or following');
      expect(result.reasons).toContain('Display name matches username');
    });

    it('should cap probability at maximum', () => {
      const profile = createMockProfile({
        followersCount: 0,
        followingCount: 0,
        displayName: 'testuser'
      });
      const result = calculator.calculateScore(profile, 0.7, 'High score');
      expect(result.probability).toBe(0.8); // MAX_PROBABILITY
      expect(result.reasons).toHaveLength(3);
    });

    it('should detect missing followers/following', () => {
      const profile = createMockProfile({
        followersCount: 0,
        followingCount: 0
      });
      const result = calculator.calculateScore(profile, 0.4, null);
      expect(result.reasons).toContain('No followers or following');
    });

    it('should detect matching display name', () => {
      const profile = createMockProfile({
        username: 'testuser',
        displayName: 'testuser'
      });
      const result = calculator.calculateScore(profile, 0.4, null);
      expect(result.reasons).toContain('Display name matches username');
    });

    it('should handle zero pattern score', () => {
      const profile = createMockProfile();
      const result = calculator.calculateScore(profile, 0, null);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it('should handle negative pattern scores', () => {
      const profile = createMockProfile();
      const result = calculator.calculateScore(profile, -0.1, null);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it('should handle extremely high pattern scores', () => {
      const profile = createMockProfile();
      const result = calculator.calculateScore(profile, 1.5, 'Very high score');
      expect(result.probability).toBe(0.8); // Should cap at MAX_PROBABILITY
      expect(result.reasons).toContain('Very high score');
    });

    it('should handle exactly threshold pattern score', () => {
      const profile = createMockProfile({
        followersCount: 0,
        followingCount: 0
      });
      const result = calculator.calculateScore(profile, 0.35, null);
      expect(result.probability).toBe(0.35);
      expect(result.reasons).toHaveLength(0);
    });

    it('should handle undefined follower counts', () => {
      const profile = createMockProfile({
        followersCount: undefined as unknown as number,
        followingCount: undefined as unknown as number
      });
      const result = calculator.calculateScore(profile, 0.4, null);
      expect(result.reasons).toContain('No followers or following');
    });

    it('should handle null display name', () => {
      const profile = createMockProfile({
        displayName: null as unknown as string,
        username: 'testuser'
      });
      const result = calculator.calculateScore(profile, 0.4, null);
      expect(result.reasons).not.toContain('Display name matches username');
    });

    it('should handle maximum possible score', () => {
      const profile = createMockProfile({
        username: 'spambot12345678',
        displayName: 'spambot12345678',
        followersCount: 0,
        followingCount: 0
      });
      const result = calculator.calculateScore(profile, 0.8, 'Maximum pattern score');
      expect(result.probability).toBe(0.8);
      expect(result.reasons).toContain('Maximum pattern score');
      expect(result.reasons).toContain('No followers or following');
      expect(result.reasons).toContain('Display name matches username');
    });
  });
}); 