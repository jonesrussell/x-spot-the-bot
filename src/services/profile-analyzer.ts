import type { BotAnalysis, ProfileData } from '../types/profile.js';

export class ProfileAnalyzer {
  static readonly #BOT_PATTERNS = {
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{12,}$/,
    MANY_NUMBERS: /[0-9]{6,}/,
    BOT_KEYWORDS: /\b(bot|spam|auto)\b|[0-9]{3,}[a-z]+[0-9]{3,}/i,
    RANDOM_SUFFIX: /[a-z]+[0-9]{6,}$/,
    NUMERIC_SUFFIX: /[0-9]{6,}$/,
    RANDOM_LETTERS: /[A-Z]{3,}[0-9]{3,}/
  } as const;

  public analyzeProfile(profile: ProfileData): BotAnalysis {
    const reasons: string[] = [];
    let probability = 0;

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
      reasons.push('Username contains bot-like keywords');
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

    // Check profile completeness - only if we already have some suspicion
    if (probability > 0.2 && !profile.followersCount && !profile.followingCount) {
      probability += 0.2;
      reasons.push('No followers or following');
    }

    // Check display name similarity - only if we already have some suspicion
    if (probability > 0.2 && profile.displayName === profile.username) {
      probability += 0.15;
      reasons.push('Display name matches username');
    }

    // Cap final probability
    probability = Math.min(probability, 0.85);

    return {
      username: profile.username,
      probability,
      reasons
    };
  }
}
