import type { BotAnalysis, ProfileData } from '../types/profile.js';

export class ProfileAnalyzer {
  private readonly BOT_PATTERNS = {
    // High probability patterns
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{10,}$/i,
    MANY_NUMBERS: /\d{4,}/,
    BOT_KEYWORDS: /bot|spam|auto|[0-9]+[a-z]+[0-9]+/i,
    MIXED_CASE_NUMBERS: /[A-Z][a-z]+\d{2,}/,
    LONG_NUMBER_SUFFIX: /[a-z]+\d{6,}$/i,
    
    // Medium probability patterns
    UNDERSCORE_NUMBERS: /^[a-zA-Z]+_\d+$/,
    TRAILING_NUMBERS: /[a-z]+\d{1,3}$/i,
    MIXED_CASE_PATTERN: /[A-Z][a-z]+[A-Z][a-z]+/,
    UNDERSCORE_MIXED: /[A-Z][a-z]+_[A-Z][a-z]+/
  } as const;

  private readonly PATTERN_SCORES = {
    // High probability scores (0.3-0.4)
    RANDOM_ALPHANUMERIC: 0.4,
    MANY_NUMBERS: 0.3,
    BOT_KEYWORDS: 0.4,
    MIXED_CASE_NUMBERS: 0.3,
    LONG_NUMBER_SUFFIX: 0.3,
    
    // Medium probability scores (0.15-0.25)
    UNDERSCORE_NUMBERS: 0.2,
    TRAILING_NUMBERS: 0.15,
    MIXED_CASE_PATTERN: 0.2,
    UNDERSCORE_MIXED: 0.2,
    
    // Base scores
    NO_FOLLOWERS: 0.3
  } as const;

  #isWhitelisted(username: string): boolean {
    // If this is a notification about someone the user follows, they're not a bot
    const notificationText = document.querySelector(`[data-testid="notificationText"]`)?.textContent?.toLowerCase() ?? '';
    if (notificationText.includes('new post notifications for') && notificationText.includes(username.toLowerCase())) {
      console.debug('[XBot:Analyzer] Whitelisting followed user:', username);
      return true;
    }
    return false;
  }

  public async analyzeBotProbability(profile: ProfileData): Promise<BotAnalysis> {
    // Skip analysis for whitelisted users
    if (this.#isWhitelisted(profile.username)) {
      return {
        username: profile.username,
        probability: 0,
        reasons: ['User is followed by you']
      };
    }

    try {
      // Skip if no username
      if (!profile.username) {
        return { username: '', probability: 0, reasons: [] };
      }

      const reasons: string[] = [];
      let probability = 0;

      // Check username patterns
      const username = profile.username;
      
      // High probability checks
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
      if (this.BOT_PATTERNS.MIXED_CASE_NUMBERS.test(username)) {
        reasons.push('Username has mixed case with numbers');
        probability += this.PATTERN_SCORES.MIXED_CASE_NUMBERS;
      }
      if (this.BOT_PATTERNS.LONG_NUMBER_SUFFIX.test(username)) {
        reasons.push('Username ends with many numbers');
        probability += this.PATTERN_SCORES.LONG_NUMBER_SUFFIX;
      }
      
      // Medium probability checks
      if (this.BOT_PATTERNS.UNDERSCORE_NUMBERS.test(username)) {
        reasons.push('Username has underscore with numbers');
        probability += this.PATTERN_SCORES.UNDERSCORE_NUMBERS;
      }
      if (this.BOT_PATTERNS.TRAILING_NUMBERS.test(username)) {
        reasons.push('Username ends with few numbers');
        probability += this.PATTERN_SCORES.TRAILING_NUMBERS;
      }
      if (this.BOT_PATTERNS.MIXED_CASE_PATTERN.test(username)) {
        reasons.push('Username has mixed case pattern');
        probability += this.PATTERN_SCORES.MIXED_CASE_PATTERN;
      }
      if (this.BOT_PATTERNS.UNDERSCORE_MIXED.test(username)) {
        reasons.push('Username has underscore with mixed case');
        probability += this.PATTERN_SCORES.UNDERSCORE_MIXED;
      }

      // Check follower/following counts
      if (profile.followersCount === 0 && profile.followingCount === 0) {
        reasons.push('No followers or following');
        probability += this.PATTERN_SCORES.NO_FOLLOWERS;
      }

      // Cap probability at 0.9
      probability = Math.min(probability, 0.9);

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
