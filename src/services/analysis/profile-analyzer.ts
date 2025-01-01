import type { ProfileData } from '../../types/profile.js';

export class ProfileAnalyzer {
  readonly #PATTERNS = {
    randomAlphanumeric: /^[a-z0-9]{8,}$/,
    manyNumbers: /[0-9]{4,}/,
    botKeywords: /bot|spam|[0-9]+[a-z]+[0-9]+/,
    randomSuffix: /[a-z]+[0-9]{4,}$/
  } as const;

  readonly #WEIGHTS = {
    randomAlphanumeric: 0.3,
    manyNumbers: 0.2,
    botKeywords: 0.3,
    randomSuffix: 0.2,
    noFollowers: 0.3,
    highFollowingRatio: 0.2
  } as const;

  public analyzeBotProbability(profile: ProfileData): number {
    // Verified accounts are never bots
    if (profile.isVerified) {
      return 0;
    }

    let probability = 0;

    // Check username patterns
    if (this.#PATTERNS.randomAlphanumeric.test(profile.username)) {
      probability += this.#WEIGHTS.randomAlphanumeric;
    }
    if (this.#PATTERNS.manyNumbers.test(profile.username)) {
      probability += this.#WEIGHTS.manyNumbers;
    }
    if (this.#PATTERNS.botKeywords.test(profile.username)) {
      probability += this.#WEIGHTS.botKeywords;
    }
    if (this.#PATTERNS.randomSuffix.test(profile.username)) {
      probability += this.#WEIGHTS.randomSuffix;
    }

    // Check follower patterns
    if (profile.followersCount === 0) {
      probability += this.#WEIGHTS.noFollowers;
    }
    if (profile.followingCount > profile.followersCount * 2) {
      probability += this.#WEIGHTS.highFollowingRatio;
    }

    // Cap probability at 0.9
    return Math.min(0.9, probability);
  }
}
