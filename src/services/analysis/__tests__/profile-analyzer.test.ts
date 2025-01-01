import type { RawProfileData } from '../../../types/profile.js';
import { ProfileAnalyzer } from '../profile-analyzer.js';

describe('ProfileAnalyzer', () => {
  let analyzer: ProfileAnalyzer;

  beforeEach(() => {
    analyzer = new ProfileAnalyzer();
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

  describe('analyzeProfile', () => {
    it('should return zero probability for verified accounts', () => {
      const profile = createMockProfile({ isVerified: true });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it('should detect bot patterns in username', () => {
      const profile = createMockProfile({
        username: 'spambot12345678'
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.reasons).toContainEqual(expect.stringContaining('suspicious keywords'));
    });

    it('should combine pattern and profile analysis', () => {
      const profile = createMockProfile({
        username: 'spambot12345678',
        followersCount: 0,
        followingCount: 0,
        displayName: 'spambot12345678'
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeGreaterThan(0.5);
      expect(result.reasons).toHaveLength(expect.any(Number));
    });

    it('should handle normal usernames', () => {
      const profile = createMockProfile({
        username: 'normal_user',
        displayName: 'Normal User'
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it('should cap probability at maximum', () => {
      const profile = createMockProfile({
        username: 'a1b2c3d4e5f6g7h8i9',
        followersCount: 0,
        followingCount: 0,
        displayName: 'a1b2c3d4e5f6g7h8i9'
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeLessThanOrEqual(0.8);
    });

    it('should always include username in result', () => {
      const profile = createMockProfile();
      const result = analyzer.analyzeProfile(profile);
      expect(result.username).toBe(profile.username);
    });

    it('should handle multiple bot indicators', () => {
      const profile = createMockProfile({
        username: 'spambot12345678',
        displayName: 'spambot12345678',
        followersCount: 0,
        followingCount: 0
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeGreaterThan(0.6);
      expect(result.reasons.length).toBeGreaterThan(2);
    });

    it('should handle borderline cases', () => {
      const profile = createMockProfile({
        username: 'user1234567', // Just under the threshold for many numbers
        followersCount: 1, // Has minimal following
        followingCount: 1
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it('should handle special characters in username', () => {
      const profile = createMockProfile({
        username: '_bot_123456789_',
        displayName: 'Bot Account'
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBeGreaterThan(0);
      expect(result.reasons).toContainEqual(expect.stringContaining('suspicious'));
    });

    it('should handle undefined optional fields', () => {
      const profile = createMockProfile({
        followersCount: undefined as unknown as number,
        followingCount: undefined as unknown as number,
        displayName: undefined as unknown as string
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result).toBeDefined();
      expect(result.username).toBe(profile.username);
    });

    it('should handle all indicators at maximum', () => {
      const profile = createMockProfile({
        username: 'a1b2c3d4e5f6g7h8i9', // Random alphanumeric (highest pattern score)
        displayName: 'a1b2c3d4e5f6g7h8i9', // Matches username
        followersCount: 0,
        followingCount: 0
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBe(0.8); // Should hit max cap
      expect(result.reasons.length).toBeGreaterThan(2);
    });

    it('should handle verified status with other indicators', () => {
      const profile = createMockProfile({
        username: 'spambot12345678',
        followersCount: 0,
        followingCount: 0,
        isVerified: true // Should override all other indicators
      });
      const result = analyzer.analyzeProfile(profile);
      expect(result.probability).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });
  });
}); 