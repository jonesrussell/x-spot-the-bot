import type { ProfileData } from '../types/profile.js';

export class StorageService {
  private readonly STORAGE_KEY = 'profiles';
  private readonly RETENTION_DAYS = 30;

  public async saveProfile(profile: ProfileData): Promise<void> {
    const { profiles } = await this.getStorageData();
    profiles[profile.username] = profile;
    await this.setStorageData({ profiles });
  }

  public async getProfile(username: string): Promise<ProfileData | null> {
    const { profiles } = await this.getStorageData();
    return profiles[username] || null;
  }

  public async pruneOldProfiles(): Promise<void> {
    const { profiles } = await this.getStorageData();
    const now = Date.now();
    const retentionPeriod = this.RETENTION_DAYS * 24 * 60 * 60 * 1000;

    // Remove profiles older than retention period
    Object.keys(profiles).forEach(username => {
      const profile = profiles[username];
      if (profile && now - profile.interactionTimestamp > retentionPeriod) {
        delete profiles[username];
      }
    });

    await this.setStorageData({ profiles });
  }

  public async clearStorage(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  }

  private async getStorageData(): Promise<{ profiles: Record<string, ProfileData> }> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.STORAGE_KEY], (result) => {
        resolve({
          profiles: (typeof result === 'object' && result !== null && this.STORAGE_KEY in result) 
            ? result[this.STORAGE_KEY] 
            : {}
        });
      });
    });
  }

  private async setStorageData(data: { profiles: Record<string, ProfileData> }): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.STORAGE_KEY]: data.profiles }, resolve);
    });
  }
}
