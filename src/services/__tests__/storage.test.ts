import { jest } from '@jest/globals';
import { StorageService } from '../storage';
import { InteractionTypes, NotificationTypes } from '../../types/profile';
import type { ProfileData } from '../../types/profile';

interface StorageData {
  profiles: { [key: string]: ProfileData };
}

type StorageCallback = (data: StorageData) => void;
type StorageSetCallback = () => void;

describe('StorageService', () => {
  let storageService: StorageService;
  let mockStorage: StorageData = { profiles: {} };
  
  const mockProfile: ProfileData = {
    username: 'testuser',
    displayName: 'Test User',
    profileImageUrl: 'avatar.jpg',
    followersCount: 100,
    followingCount: 100,
    interactionTimestamp: Date.now(),
    interactionType: InteractionTypes.Like,
    notificationType: NotificationTypes.UserInteraction
  };

  beforeEach(() => {
    mockStorage = { profiles: {} };
    jest.spyOn(chrome.storage.local, 'get').mockImplementation((_, callback: StorageCallback) => {
      callback(mockStorage);
    });
    jest.spyOn(chrome.storage.local, 'set').mockImplementation((data: Partial<StorageData>, callback?: StorageSetCallback) => {
      mockStorage = { profiles: { ...mockStorage.profiles, ...(data.profiles || {}) } };
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
    mockStorage.profiles[mockProfile.username] = mockProfile;
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
    mockStorage.profiles[mockProfile.username] = oldProfile;
    
    await storageService.pruneOldProfiles();
    expect(mockStorage.profiles[mockProfile.username]).toBeUndefined();
  });

  it('should keep recent profiles during pruning', async () => {
    mockStorage.profiles[mockProfile.username] = mockProfile;
    await storageService.pruneOldProfiles();
    expect(mockStorage.profiles[mockProfile.username]).toEqual(mockProfile);
  });
}); 