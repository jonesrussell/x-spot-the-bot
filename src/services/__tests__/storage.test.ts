import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProfileData } from '../../types/profile.js';
import { StorageService } from '../storage.js';

type StorageKey = string | string[] | Record<string, unknown>;

describe('StorageService', () => {
  let storage: StorageService;
  let mockStorage: Record<string, ProfileData>;

  beforeEach(() => {
    mockStorage = {};
    vi.stubGlobal('chrome', {
      runtime: {
        lastError: null
      },
      storage: {
        local: {
          get: vi.fn((_keys: StorageKey, callback) => {
            const matches: Record<string, ProfileData> = {};
            if (typeof _keys === 'string' && mockStorage[_keys]) {
              matches[_keys] = mockStorage[_keys];
            } else if (Array.isArray(_keys)) {
              _keys.forEach(key => {
                if (mockStorage[key]) {
                  matches[key] = mockStorage[key];
                }
              });
            } else {
              Object.entries(mockStorage).forEach(([key, value]) => {
                matches[key] = value;
              });
            }
            callback(matches);
          }),
          set: vi.fn((items: Record<string, ProfileData>, callback: () => void) => {
            Object.assign(mockStorage, items);
            callback();
          }),
          clear: vi.fn((callback: () => void) => {
            mockStorage = {};
            callback();
          })
        }
      }
    });
    storage = new StorageService();
  });

  describe('saveProfile', () => {
    it('should save a profile to storage', async () => {
      const profile: ProfileData = {
        username: 'testuser',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        followersCount: 100,
        followingCount: 50,
        interactionTimestamp: Date.now(),
        interactionType: 'like',
        notificationType: 'user_interaction',
        isVerified: false,
        botProbability: 0.1
      };

      await storage.saveProfile(profile);
      const key = `profile:${profile.username}`;
      expect(mockStorage[key]).toEqual(profile);
    });
  });

  describe('getProfile', () => {
    it('should retrieve a profile from storage', async () => {
      const profile: ProfileData = {
        username: 'testuser',
        displayName: 'Test User',
        profileImageUrl: 'https://example.com/image.jpg',
        followersCount: 100,
        followingCount: 50,
        interactionTimestamp: Date.now(),
        interactionType: 'like',
        notificationType: 'user_interaction',
        isVerified: false,
        botProbability: 0.1
      };

      const key = `profile:${profile.username}`;
      mockStorage[key] = profile;
      const result = await storage.getProfile(profile.username);
      expect(result).toEqual(profile);
    });

    it('should return null for non-existent profile', async () => {
      const result = await storage.getProfile('nonexistent');
      expect(result).toBeNull();
    });
  });
}); 