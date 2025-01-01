import type { ProfileData } from '../types/profile.js';

export class StorageService {
  static readonly #PROFILE_PREFIX = 'profile:';

  public async saveProfile(profile: ProfileData): Promise<void> {
    const key = StorageService.#PROFILE_PREFIX + profile.username;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: profile }, () => resolve());
    });
  }

  public async getProfile(username: string): Promise<ProfileData | null> {
    const key = StorageService.#PROFILE_PREFIX + username;
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result: Record<string, ProfileData>) => {
        resolve(result[key] || null);
      });
    });
  }

  public async clearProfiles(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (result: Record<string, unknown>) => {
        const profileKeys = Object.keys(result).filter(key => 
          key.startsWith(StorageService.#PROFILE_PREFIX)
        );
        
        if (profileKeys.length > 0) {
          chrome.storage.local.remove(profileKeys, () => resolve());
        } else {
          resolve();
        }
      });
    });
  }
}
