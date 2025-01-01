import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProfileData } from '../../types/profile.js';
import { StorageService } from '../storage.js';

describe('StorageService', () => {
  let storage: StorageService;
  let mockStorage: { [key: string]: any };

  beforeEach(() => {
    mockStorage = {};
    global.chrome = {
      storage: {
        local: {
          get: vi.fn((keys, callback) => {
            const result: { [key: string]: any } = {};
            if (typeof keys === 'string') {
              result[keys] = mockStorage[keys];
            } else if (Array.isArray(keys)) {
              keys.forEach(key => {
                result[key] = mockStorage[key];
              });
            } else {
              Object.assign(result, mockStorage);
            }
            if (typeof callback === 'function') callback(result);
          }),
          set: vi.fn((items, callback) => {
            Object.assign(mockStorage, items);
            if (typeof callback === 'function') callback();
          }),
          clear: vi.fn((callback) => {
            mockStorage = {};
            if (typeof callback === 'function') callback();
          })
        }
      }
    } as any;
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
      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          [`profile:${profile.username}`]: profile
        }),
        expect.any(Function)
      );
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

      mockStorage[`profile:${profile.username}`] = profile;
      const result = await storage.getProfile(profile.username);
      expect(result).toEqual(profile);
    });

    it('should return null for non-existent profile', async () => {
      const result = await storage.getProfile('nonexistent');
      expect(result).toBeNull();
    });
  });
}); 