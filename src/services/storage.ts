import type { ProfileData } from '../types/profile.js';

interface StorageData {
  profiles: Record<string, ProfileData>;
}

export class StorageService {
  public async saveProfile(profile: ProfileData): Promise<void> {
    const data = await this.getStorageData();
    data.profiles[profile.username] = profile;
    await this.setStorageData(data);
  }

  public async getProfile(username: string): Promise<ProfileData | null> {
    const data = await this.getStorageData();
    return data.profiles[username] || null;
  }

  private async getStorageData(): Promise<StorageData> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['profiles'], (result: { profiles?: Record<string, ProfileData> }) => {
        resolve({ profiles: result['profiles'] || {} });
      });
    });
  }

  private async setStorageData(data: StorageData): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
    });
  }
}
