import type { ProfileData } from '../types/profile.js';

export class StorageService {
  readonly #PROFILE_PREFIX = 'profile:';

  public async saveProfile(profile: ProfileData): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = this.#PROFILE_PREFIX + profile.username;
      chrome.storage.local.set({ [key]: profile }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  public async getProfile(username: string): Promise<ProfileData | null> {
    return new Promise((resolve, reject) => {
      const key = this.#PROFILE_PREFIX + username;
      chrome.storage.local.get([key], (result: Record<string, ProfileData>) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key] || null);
        }
      });
    });
  }

  public async clearProfiles(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
}
