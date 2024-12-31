import { jest } from '@jest/globals';
import { StorageService } from '../storage';
import { Values } from '../../types/profile';
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
    profileImageUrl: 'avatar.jpg',
    followersCount: 100,
    followingCount: 100,
    interactionTimestamp: Date.now(),
    interactionType: Values.InteractionTypes.Like,
    notificationType: Values.NotificationTypes.UserInteraction
  };

  beforeEach(() => {
    mockStorage = {};
    chrome.storage.local.get.mockImplementation((key, callback) => {
      callback(mockStorage);
    });
    chrome.storage.local.set.mockImplementation((data, callback) => {
      Object.assign(mockStorage, data);
      if (callback) callback();
    });
    storageService = new StorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save profile data', async () => {
    await storageService.saveProfile(mockProfile);
    expect(mockStorage.profiles[mockProfile.username]).toEqual(mockProfile);
  });

  it('should retrieve profile data', async () => {
    mockStorage.profiles = { [mockProfile.username]: mockProfile };
    const result = await storageService.getProfile(mockProfile.username);
    expect(result).toEqual(mockProfile);
  });

  it('should return null for non-existent profile', async () => {
    const result = await storageService.getProfile('nonexistent');
    expect(result).toBeNull();
  });

  it('should prune old profiles', async () => {
    const oldProfile = {
      ...mockProfile,
      interactionTimestamp: Date.now() - 31 * 24 * 60 * 60 * 1000 // 31 days old
    };
    mockStorage.profiles = { [mockProfile.username]: oldProfile };
    
    await storageService.pruneOldProfiles();
    expect(mockStorage.profiles[mockProfile.username]).toBeUndefined();
  });

  it('should keep recent profiles during pruning', async () => {
    mockStorage.profiles = { [mockProfile.username]: mockProfile };
    await storageService.pruneOldProfiles();
    expect(mockStorage.profiles[mockProfile.username]).toEqual(mockProfile);
  });
}); 