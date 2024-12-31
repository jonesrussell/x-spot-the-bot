import { StorageService } from '../storage.js';
import { ProfileData } from '../../types/profile.js';

// Extend the chrome.storage.local mock type
type ChromeStorageLocal = typeof chrome.storage.local & {
  mockClear: () => void;
  mockImplementation: (fn: (key: any, callback: any) => void) => void;
};

describe('StorageService', () => {
  let storage: StorageService;
  const mockProfile: ProfileData = {
    username: 'testuser',
    displayName: 'Test User',
    profileImageUrl: 'https://example.com/image.jpg',
    followersCount: 100,
    followingCount: 100,
    interactionTimestamp: Date.now(),
    interactionType: 'like'
  };

  beforeEach(() => {
    storage = new StorageService();
    (chrome.storage.local as ChromeStorageLocal).mockClear();
    (chrome.storage.local.set as jest.Mock).mockClear();
  });

  describe('saveProfile', () => {
    it('should save profile data to storage', async () => {
      (chrome.storage.local as ChromeStorageLocal).mockImplementation((key, callback) => {
        callback({ profiles: {} });
      });

      await storage.saveProfile(mockProfile);

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          profiles: expect.objectContaining({
            [mockProfile.username]: expect.objectContaining({
              username: mockProfile.username,
              displayName: mockProfile.displayName
            })
          })
        }),
        expect.any(Function)
      );
    });

    it('should update existing profile data', async () => {
      const existingProfiles = {
        [mockProfile.username]: {
          ...mockProfile,
          interactionTimestamp: Date.now() - 1000
        }
      };

      (chrome.storage.local as ChromeStorageLocal).mockImplementation((key, callback) => {
        callback({ profiles: existingProfiles });
      });

      await storage.saveProfile(mockProfile);

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          profiles: expect.objectContaining({
            [mockProfile.username]: expect.objectContaining({
              interactionTimestamp: mockProfile.interactionTimestamp
            })
          })
        }),
        expect.any(Function)
      );
    });
  });

  describe('getProfile', () => {
    it('should retrieve profile data from storage', async () => {
      (chrome.storage.local as ChromeStorageLocal).mockImplementation((key, callback) => {
        callback({
          profiles: {
            [mockProfile.username]: mockProfile
          }
        });
      });

      const result = await storage.getProfile(mockProfile.username);
      expect(result).toEqual(mockProfile);
    });

    it('should return null for non-existent profile', async () => {
      (chrome.storage.local as ChromeStorageLocal).mockImplementation((key, callback) => {
        callback({ profiles: {} });
      });

      const result = await storage.getProfile('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('pruneOldProfiles', () => {
    it('should remove profiles older than retention period', async () => {
      const now = Date.now();
      const oldProfiles = {
        old: {
          ...mockProfile,
          username: 'old',
          interactionTimestamp: now - (31 * 24 * 60 * 60 * 1000) // 31 days old
        },
        recent: {
          ...mockProfile,
          username: 'recent',
          interactionTimestamp: now - (1 * 24 * 60 * 60 * 1000) // 1 day old
        }
      };

      (chrome.storage.local as ChromeStorageLocal).mockImplementation((key, callback) => {
        callback({ profiles: oldProfiles });
      });

      await storage.pruneOldProfiles();

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          profiles: expect.not.objectContaining({
            old: expect.anything()
          })
        }),
        expect.any(Function)
      );

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          profiles: expect.objectContaining({
            recent: expect.anything()
          })
        }),
        expect.any(Function)
      );
    });
  });

  describe('clearStorage', () => {
    it('should clear all stored profiles', async () => {
      await storage.clearStorage();
      expect(chrome.storage.local.clear).toHaveBeenCalled();
    });
  });
}); 