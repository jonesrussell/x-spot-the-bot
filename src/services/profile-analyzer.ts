import { ProfileData, BotAnalysis } from '../types/profile.js';

export class ProfileAnalyzer {
  private readonly BOT_PATTERNS = {
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{8,}$/,
    MANY_NUMBERS: /[0-9]{4,}/,
    BOT_KEYWORDS: /bot|spam|[0-9]+[a-z]+[0-9]+/,
    RANDOM_SUFFIX: /[a-z]+[0-9]{4,}$/,
    NUMERIC_SUFFIX: /[0-9]{4,}$/,
    RANDOM_LETTERS: /[A-Z]{2,}[0-9]+/
  } as const;

  private readonly PATTERN_SCORES = {
    RANDOM_ALPHANUMERIC: 0.3,
    MANY_NUMBERS: 0.2,
    BOT_KEYWORDS: 0.3,
    RANDOM_SUFFIX: 0.2,
    NUMERIC_SUFFIX: 0.2,
    RANDOM_LETTERS: 0.2,
    NO_FOLLOWERS: 0.3
  } as const;

  public async analyzeBotProbability(profile: ProfileData): Promise<BotAnalysis> {
    try {
      // Skip if no username
      if (!profile.username) {
        return { username: '', probability: 0, reasons: [] };
      }

      const reasons: string[] = [];
      let probability = 0;

      // Check username patterns
      const username = profile.username.toLowerCase();
      if (this.BOT_PATTERNS.RANDOM_ALPHANUMERIC.test(username)) {
        reasons.push('Random alphanumeric username');
        probability += this.PATTERN_SCORES.RANDOM_ALPHANUMERIC;
      }
      if (this.BOT_PATTERNS.MANY_NUMBERS.test(username)) {
        reasons.push('Username contains many numbers');
        probability += this.PATTERN_SCORES.MANY_NUMBERS;
      }
      if (this.BOT_PATTERNS.BOT_KEYWORDS.test(username)) {
        reasons.push('Username contains bot-like keywords');
        probability += this.PATTERN_SCORES.BOT_KEYWORDS;
      }
      if (this.BOT_PATTERNS.RANDOM_SUFFIX.test(username)) {
        reasons.push('Username has random number suffix');
        probability += this.PATTERN_SCORES.RANDOM_SUFFIX;
      }
      if (this.BOT_PATTERNS.NUMERIC_SUFFIX.test(username)) {
        reasons.push('Username ends with numbers');
        probability += this.PATTERN_SCORES.NUMERIC_SUFFIX;
      }
      if (this.BOT_PATTERNS.RANDOM_LETTERS.test(username)) {
        reasons.push('Username has random letter patterns');
        probability += this.PATTERN_SCORES.RANDOM_LETTERS;
      }

      // Check follower/following counts
      if (profile.followersCount === 0 && profile.followingCount === 0) {
        reasons.push('No followers or following');
        probability += this.PATTERN_SCORES.NO_FOLLOWERS;
      }

      console.debug('[XBot:Analyzer] Analysis result:', {
        username: profile.username,
        probability,
        reasons
      });

      return { username: profile.username, probability, reasons };
    } catch (error) {
      console.error('[XBot:Analyzer] Error:', error);
      return { username: profile.username, probability: 0, reasons: [] };
    }
  }
}
