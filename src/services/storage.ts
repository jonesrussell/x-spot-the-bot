interface BotDetectionData {
  username: string;
  interactionTimes: number[];
  lastInteraction: number;
  botProbability: number;
  detectionReasons: string[];
}

export class StorageService {
  private static STORAGE_KEY = 'xbot_detection_data';
  private static MAX_INTERACTIONS = 10; // Keep last 10 interactions for analysis
  private static MAX_STORED_PROFILES = 1000; // Prevent unlimited storage growth

  async getDetectionData(username: string): Promise<BotDetectionData | null> {
    const data = await this.getAllData();
    return data[username] || null;
  }

  async recordInteraction(
    username: string, 
    timestamp: number,
    interactionType: 'like' | 'reply' | 'repost' | 'follow',
    botProbability: number,
    reasons: string[]
  ): Promise<void> {
    const data = await this.getAllData();
    const profile = data[username] || {
      username,
      interactionTimes: [],
      lastInteraction: 0,
      botProbability: 0,
      detectionReasons: []
    };

    // Add new interaction time
    profile.interactionTimes.push(timestamp);
    if (profile.interactionTimes.length > StorageService.MAX_INTERACTIONS) {
      profile.interactionTimes.shift(); // Remove oldest
    }

    // Update profile data
    profile.lastInteraction = timestamp;
    profile.botProbability = this.calculateOverallProbability(profile.botProbability, botProbability);
    profile.detectionReasons = [...new Set([...profile.detectionReasons, ...reasons])];

    data[username] = profile;
    await this.pruneAndSaveData(data);
  }

  async analyzeResponsePattern(username: string): Promise<{
    isBot: boolean;
    confidence: number;
    reasons: string[];
  }> {
    const data = await this.getDetectionData(username);
    if (!data || data.interactionTimes.length < 2) {
      return { isBot: false, confidence: 0, reasons: [] };
    }

    const intervals = this.calculateIntervals(data.interactionTimes);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const stdDev = this.calculateStdDev(intervals, avgInterval);

    const reasons: string[] = [];
    let botProbability = 0;

    // Check for suspiciously fast responses (< 2 seconds)
    if (avgInterval < 2000) {
      botProbability += 0.4;
      reasons.push('Suspiciously fast response times');
    }

    // Check for unnaturally consistent intervals
    if (stdDev < 100) { // Very consistent timing
      botProbability += 0.3;
      reasons.push('Unnaturally consistent response pattern');
    }

    // Check for round-the-clock activity
    const hourDistribution = this.analyzeHourDistribution(data.interactionTimes);
    if (hourDistribution.active24h) {
      botProbability += 0.3;
      reasons.push('24-hour activity pattern');
    }

    return {
      isBot: botProbability > 0.7,
      confidence: botProbability,
      reasons
    };
  }

  private async getAllData(): Promise<Record<string, BotDetectionData>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(StorageService.STORAGE_KEY, (result) => {
        resolve(result[StorageService.STORAGE_KEY] || {});
      });
    });
  }

  private async pruneAndSaveData(data: Record<string, BotDetectionData>): Promise<void> {
    // Prune old entries if we exceed MAX_STORED_PROFILES
    const usernames = Object.keys(data);
    if (usernames.length > StorageService.MAX_STORED_PROFILES) {
      const sortedByLastInteraction = usernames
        .sort((a, b) => data[b].lastInteraction - data[a].lastInteraction)
        .slice(0, StorageService.MAX_STORED_PROFILES);
      
      const prunedData: Record<string, BotDetectionData> = {};
      sortedByLastInteraction.forEach(username => {
        prunedData[username] = data[username];
      });
      data = prunedData;
    }

    return new Promise((resolve) => {
      chrome.storage.local.set({ [StorageService.STORAGE_KEY]: data }, resolve);
    });
  }

  private calculateIntervals(times: number[]): number[] {
    const sorted = [...times].sort((a, b) => a - b);
    return sorted.slice(1).map((time, i) => time - sorted[i]);
  }

  private calculateStdDev(values: number[], mean: number): number {
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  private analyzeHourDistribution(times: number[]): { active24h: boolean } {
    const hours = new Set(times.map(t => new Date(t).getHours()));
    const activeHours = hours.size;
    return {
      active24h: activeHours > 20 // Active in more than 20 hours suggests 24/7 operation
    };
  }

  private calculateOverallProbability(historical: number, current: number): number {
    // Weighted average favoring recent detection
    return historical * 0.7 + current * 0.3;
  }
} 