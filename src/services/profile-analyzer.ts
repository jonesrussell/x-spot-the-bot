import type { BotAnalysis, ProfileData } from '../types/profile.js';

export class ProfileAnalyzer {
  static readonly #BOT_PATTERNS = {
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{8,}$/,
    MANY_NUMBERS: /[0-9]{4,}/,
    BOT_KEYWORDS: /bot|spam|[0-9]+[a-z]+[0-9]+/,
    RANDOM_SUFFIX: /[a-z]+[0-9]{4,}$/,
    NUMERIC_SUFFIX: /[0-9]{4,}$/,
    RANDOM_LETTERS: /[A-Z]{2,}[0-9]+/
  } as const;

  public analyzeProfile(profile: ProfileData): BotAnalysis {
    const reasons: string[] = [];
    let probability = 0;

    // Check username patterns
    const patterns = ProfileAnalyzer.#BOT_PATTERNS;
    const username = profile.username.toLowerCase();

    if (patterns.RANDOM_ALPHANUMERIC.test(username)) {
      probability += 0.3;
      reasons.push('Username appears randomly generated');
    }

    if (patterns.MANY_NUMBERS.test(username)) {
      probability += 0.2;
      reasons.push('Username contains many numbers');
    }

    if (patterns.BOT_KEYWORDS.test(username)) {
      probability += 0.3;
      reasons.push('Username contains bot-like keywords');
    }

    if (patterns.RANDOM_SUFFIX.test(username)) {
      probability += 0.2;
      reasons.push('Username has random number suffix');
    }

    if (patterns.NUMERIC_SUFFIX.test(username)) {
      probability += 0.2;
      reasons.push('Username ends with many numbers');
    }

    if (patterns.RANDOM_LETTERS.test(username)) {
      probability += 0.2;
      reasons.push('Username has random letter patterns');
    }

    // Check profile completeness
    if (!profile.followersCount && !profile.followingCount) {
      probability += 0.3;
      reasons.push('No followers or following');
    }

    // Check display name similarity
    if (profile.displayName === profile.username) {
      probability += 0.2;
      reasons.push('Display name matches username');
    }

    return {
      username: profile.username,
      probability: Math.min(probability, 0.9),
      reasons
    };
  }
}
