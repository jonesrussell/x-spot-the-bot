import type { ProfileData } from '../../types/profile.js';

export interface ScoreResult {
  probability: number;
  reasons: string[];
}

export class ScoreCalculator {
  static readonly #MAX_PROBABILITY = 0.8;
  static readonly #PATTERN_THRESHOLD = 0.2;
  static readonly #NO_FOLLOWERS_SCORE = 0.3;
  static readonly #DISPLAY_NAME_MATCH_SCORE = 0.2;

  public calculateScore(profile: ProfileData, patternScore: number | null, patternReason: string | null): ScoreResult {
    const reasons: string[] = [];
    let probability = 0;

    // Handle pattern score
    if (patternScore !== null) {
      // Ensure pattern score is non-negative
      probability = Math.max(0, patternScore);
      if (patternReason) reasons.push(patternReason);
    }

    // Only check additional factors if pattern score is above threshold
    if (probability >= ScoreCalculator.#PATTERN_THRESHOLD) {
      // Check followers/following
      if (profile.followersCount === 0 && profile.followingCount === 0) {
        probability += ScoreCalculator.#NO_FOLLOWERS_SCORE;
        reasons.push('Account has no followers or following');
      }

      // Check display name similarity
      if (profile.displayName && profile.username &&
          profile.displayName.toLowerCase() === profile.username.toLowerCase()) {
        probability += ScoreCalculator.#DISPLAY_NAME_MATCH_SCORE;
        reasons.push('Display name exactly matches username');
      }
    }

    // Cap probability at maximum
    if (probability >= ScoreCalculator.#MAX_PROBABILITY) {
      probability = ScoreCalculator.#MAX_PROBABILITY;
      reasons.push('Maximum pattern score');
    }

    return {
      probability,
      reasons
    };
  }
} 