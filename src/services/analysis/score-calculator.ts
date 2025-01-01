import type { ProfileData } from '../../types/profile.js';

export interface ScoreResult {
  probability: number;
  reasons: string[];
}

export class ScoreCalculator {
  static readonly #MAX_PROBABILITY = 0.8;

  public calculateScore(profile: ProfileData, patternScore: number | null, patternReason: string | null): ScoreResult {
    const reasons: string[] = [];
    let probability = 0;

    // Handle pattern score
    if (patternScore !== null) {
      probability = Math.max(0, Math.min(patternScore, ScoreCalculator.#MAX_PROBABILITY));
      if (patternReason) reasons.push(patternReason);
    }

    // Add score for no followers/following
    if (profile.followersCount === 0 && profile.followingCount === 0) {
      probability = Math.min(probability + 0.3, ScoreCalculator.#MAX_PROBABILITY);
      reasons.push('No followers or following');
    }

    return {
      probability,
      reasons
    };
  }
} 