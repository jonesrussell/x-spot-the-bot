import type { ProfileData } from '../types/profile.js';

export class StorageService {
  public async saveProfile(profile: ProfileData): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [profile.username]: profile }, () => resolve());
    });
  }

  public async getProfile(username: string): Promise<ProfileData | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([username], (result: Record<string, ProfileData>) => {
        resolve(result[username] || null);
      });
    });
  }

  public async clearProfiles(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => resolve());
    });
  }
}
