import type { ProfileData } from '../../types/profile.js';
import { StorageService } from '../storage.js';

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    storage = new StorageService();
    chrome.storage.local.clear();
  });

  afterEach(() => {
    chrome.storage.local.clear();
  });

  describe('saveProfile', () => {
    it('should save a profile to storage', async () => {
      const mockProfile = {
        username: 'test_user',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/avatar.jpg',
        followersCount: 100,
        followingCount: 200,
        interactionTimestamp: Date.now(),
        interactionType: 'like' as const,
        notificationType: 'user_interaction' as const,
        botProbability: 0.8,
        isVerified: false
      } satisfies ProfileData;

      await storage.saveProfile(mockProfile);

      const result = await chrome.storage.local.get(['profiles']);
      expect(result['profiles']).toBeDefined();
      expect(result['profiles']?.[mockProfile.username]).toEqual(mockProfile);
    });
  });

  describe('getProfile', () => {
    it('should retrieve a profile from storage', async () => {
      const mockProfile = {
        username: 'test_user',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/avatar.jpg',
        followersCount: 100,
        followingCount: 200,
        interactionTimestamp: Date.now(),
        interactionType: 'like' as const,
        notificationType: 'user_interaction' as const,
        botProbability: 0.8,
        isVerified: false
      } satisfies ProfileData;

      await chrome.storage.local.set({
        profiles: {
          [mockProfile.username]: mockProfile
        }
      });

      const result = await storage.getProfile(mockProfile.username);
      expect(result).toEqual(mockProfile);
    });

    it('should return null for non-existent profile', async () => {
      const result = await storage.getProfile('non_existent_user');
      expect(result).toBeNull();
    });
  });
}); 