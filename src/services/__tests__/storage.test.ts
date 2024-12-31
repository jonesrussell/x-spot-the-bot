import { jest } from '@jest/globals';
import { StorageService } from '../storage';
import { InteractionTypes, NotificationTypes } from '../../types/profile';
import type { ProfileData } from '../../types/profile';

interface StorageData {
  [key: string]: ProfileData;
}

describe('StorageService', () => {
  let storageService: StorageService;
  let mockStorage: { [key: string]: ProfileData } = {};
  
  const mockProfile: ProfileData = {
    username: 'testuser',
    displayName: 'Test User',
    profileImageUrl: 'https://example.com/image.jpg',
    followersCount: 100,
    followingCount: 100,
    interactionTimestamp: Date.now(),
    interactionType: InteractionTypes.Like,
    notificationType: NotificationTypes.UserInteraction
  };

  beforeEach(() => {
    mockStorage = {};
    
    // Mock chrome.storage.local
    (chrome.storage as unknown) = {
      local: {
        get: jest.fn(() => Promise.resolve(mockStorage)),
        set: jest.fn((data: StorageData) => {
          Object.assign(mockStorage, data);
          return Promise.resolve();
        }),
        remove: jest.fn(() => {
          mockStorage = {};
          return Promise.resolve();
        })
      }
    };

    storageService = new StorageService();
  });

  describe('saveProfile', () => {
    it('should save profile data to storage', async () => {
      await storageService.saveProfile(mockProfile);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        [mockProfile.username]: mockProfile
      });
      
      expect(mockStorage[mockProfile.username]).toEqual(mockProfile);
    });
  });

  describe('getProfile', () => {
    it('should retrieve profile data from storage', async () => {
      mockStorage[mockProfile.username] = mockProfile;

      const result = await storageService.getProfile(mockProfile.username);
      expect(result).toEqual(mockProfile);
    });

    it('should return null for non-existent profile', async () => {
      const result = await storageService.getProfile('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('pruneOldProfiles', () => {
    it('should remove old profiles', async () => {
      const oldProfile = {
        ...mockProfile,
        interactionTimestamp: Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 days old
      };

      mockStorage[oldProfile.username] = oldProfile;

      await storageService.pruneOldProfiles();

      expect(chrome.storage.local.set).toHaveBeenCalledWith({});
      expect(mockStorage).toEqual({});
    });
  });

  describe('clearStorage', () => {
    it('should clear all stored profiles', async () => {
      mockStorage[mockProfile.username] = mockProfile;
      
      await storageService.clearStorage();
      
      expect(chrome.storage.local.remove).toHaveBeenCalled();
      expect(mockStorage).toEqual({});
    });
  });
}); 