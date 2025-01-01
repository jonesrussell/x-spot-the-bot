import type { BotAnalysis, ProfileData } from '../types/profile.js';

export class ProfileAnalyzer {
  static readonly #BOT_PATTERNS = {
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{15,}$/,
    MANY_NUMBERS: /[0-9]{8,}/,
    BOT_KEYWORDS: /\b(bot|spam|scam|auto)\b|[0-9]{4,}[a-z]+[0-9]{4,}/i,
    RANDOM_SUFFIX: /[a-z]+[0-9]{8,}$/,
    NUMERIC_SUFFIX: /[0-9]{8,}$/,
    RANDOM_LETTERS: /[A-Z]{4,}[0-9]{4,}/
  } as const;

  public analyzeProfile(profile: ProfileData): BotAnalysis {
    const reasons: string[] = [];
    let probability = 0;

    // Skip verified accounts
    if (profile.isVerified === true) {
      return {
        username: profile.username,
        probability: 0,
        reasons: []
      };
    }

    // Check username patterns
    const patterns = ProfileAnalyzer.#BOT_PATTERNS;
    const username = profile.username.toLowerCase();

    // Only apply the highest matching pattern score
    let patternScore = 0;

    if (patterns.RANDOM_ALPHANUMERIC.test(username)) {
      patternScore = Math.max(patternScore, 0.4);
      reasons.push('Username appears randomly generated');
    }

    if (patterns.BOT_KEYWORDS.test(username)) {
      patternScore = Math.max(patternScore, 0.35);
      reasons.push('Username contains suspicious keywords');
    }

    if (patterns.MANY_NUMBERS.test(username)) {
      patternScore = Math.max(patternScore, 0.25);
      reasons.push('Username contains unusually many numbers');
    }

    if (patterns.RANDOM_SUFFIX.test(username)) {
      patternScore = Math.max(patternScore, 0.2);
      reasons.push('Username has suspicious number suffix');
    }

    if (patterns.NUMERIC_SUFFIX.test(username)) {
      patternScore = Math.max(patternScore, 0.15);
      reasons.push('Username ends with many numbers');
    }

    if (patterns.RANDOM_LETTERS.test(username)) {
      patternScore = Math.max(patternScore, 0.2);
      reasons.push('Username has suspicious letter/number pattern');
    }

    probability += patternScore;

    // Only check these if we have strong suspicion (higher threshold)
    if (probability > 0.35) {
      // Check profile completeness
      if (!profile.followersCount && !profile.followingCount) {
        probability += 0.2;
        reasons.push('No followers or following');
      }

      // Check display name similarity
      if (profile.displayName === profile.username) {
        probability += 0.15;
        reasons.push('Display name matches username');
      }
    }

    // Cap final probability
    probability = Math.min(probability, 0.8);

    return {
      username: profile.username,
      probability,
      reasons
    };
  }
}
