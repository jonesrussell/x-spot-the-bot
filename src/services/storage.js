export class StorageService {
  async getDetectionData(username) {
    const data = await this.getAllData();
    return data[username] || null;
  }
  async recordInteraction(username, timestamp, interactionType, botProbability, reasons) {
    const data = await this.getAllData();
    const profile = data[username] || {
      username,
      interactionTimes: [],
      interactionTypes: [],
      lastInteraction: 0,
      botProbability: 0,
      detectionReasons: [],
    };
    // Add new interaction time and type
    profile.interactionTimes.push(timestamp);
    profile.interactionTypes.push(interactionType);
    // Keep arrays in sync when trimming
    if (profile.interactionTimes.length > StorageService.MAX_INTERACTIONS) {
      profile.interactionTimes.shift();
      profile.interactionTypes.shift();
    }
    // Update profile data
    profile.lastInteraction = timestamp;
    profile.botProbability = this.calculateOverallProbability(
      profile.botProbability,
      botProbability
    );
    profile.detectionReasons = [...new Set([...profile.detectionReasons, ...reasons])];
    data[username] = profile;
    await this.pruneAndSaveData(data);
  }
  async analyzeResponsePattern(username) {
    const data = await this.getDetectionData(username);
    if (!data || data.interactionTimes.length < 2) {
      return { isBot: false, confidence: 0, reasons: [] };
    }
    const intervals = this.calculateIntervals(data.interactionTimes);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const stdDev = this.calculateStdDev(intervals, avgInterval);
    const reasons = [];
    let botProbability = 0;
    // Check for suspiciously fast responses (< 2 seconds)
    if (avgInterval < 2000) {
      botProbability += 0.4;
      reasons.push('Suspiciously fast response times');
    }
    // Check for unnaturally consistent intervals
    if (stdDev < 100) {
      // Very consistent timing
      botProbability += 0.3;
      reasons.push('Unnaturally consistent response pattern');
    }
    // New: Check interaction type patterns
    const typePatterns = this.analyzeInteractionTypes(data.interactionTypes);
    if (typePatterns.isSuspicious) {
      botProbability += typePatterns.probability;
      reasons.push(...typePatterns.reasons);
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
      reasons,
    };
  }
  async getAllData() {
    return new Promise(resolve => {
      chrome.storage.local.get(StorageService.STORAGE_KEY, result => {
        resolve(result[StorageService.STORAGE_KEY] || {});
      });
    });
  }
  async pruneAndSaveData(data) {
    // Prune old entries if we exceed MAX_STORED_PROFILES
    const usernames = Object.keys(data);
    if (usernames.length > StorageService.MAX_STORED_PROFILES) {
      const sortedByLastInteraction = usernames
        .sort((a, b) => data[b].lastInteraction - data[a].lastInteraction)
        .slice(0, StorageService.MAX_STORED_PROFILES);
      const prunedData = {};
      sortedByLastInteraction.forEach(username => {
        prunedData[username] = data[username];
      });
      data = prunedData;
    }
    return new Promise(resolve => {
      chrome.storage.local.set({ [StorageService.STORAGE_KEY]: data }, resolve);
    });
  }
  calculateIntervals(times) {
    const sorted = [...times].sort((a, b) => a - b);
    return sorted.slice(1).map((time, i) => time - sorted[i]);
  }
  calculateStdDev(values, mean) {
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }
  analyzeHourDistribution(times) {
    const hours = new Set(times.map(t => new Date(t).getHours()));
    const activeHours = hours.size;
    return {
      active24h: activeHours > 20, // Active in more than 20 hours suggests 24/7 operation
    };
  }
  calculateOverallProbability(historical, current) {
    // Weighted average favoring recent detection
    return historical * 0.7 + current * 0.3;
  }
  analyzeInteractionTypes(types) {
    const reasons = [];
    let probability = 0;
    // Check if all interactions are of the same type
    const uniqueTypes = new Set(types);
    if (types.length >= 5 && uniqueTypes.size === 1) {
      probability += 0.2;
      reasons.push(`Suspicious pattern: Only ${types[0]} interactions`);
    }
    // Check for spam-like behavior (lots of likes/reposts with no replies)
    const hasReplies = types.includes('reply');
    const likeRepostRatio = types.filter(t => t === 'like' || t === 'repost').length / types.length;
    if (!hasReplies && likeRepostRatio > 0.9 && types.length >= 5) {
      probability += 0.3;
      reasons.push('Suspicious pattern: No replies, only likes/reposts');
    }
    return {
      isSuspicious: probability > 0,
      probability,
      reasons,
    };
  }
}
Object.defineProperty(StorageService, 'STORAGE_KEY', {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 'xbot_detection_data',
});
Object.defineProperty(StorageService, 'MAX_INTERACTIONS', {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 10,
}); // Keep last 10 interactions for analysis
Object.defineProperty(StorageService, 'MAX_STORED_PROFILES', {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 1000,
}); // Prevent unlimited storage growth
