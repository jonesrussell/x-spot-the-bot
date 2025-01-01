import type { RawProfileData } from '../../types/profile.js';

interface ScoreResult {
  probability: number;
  reasons: string[];
}

export class ScoreCalculator {
  readonly #MAX_PROBABILITY = 0.8;
  readonly #PROFILE_CHECK_THRESHOLD = 0.35;

  public calculateScore(
    profile: RawProfileData,
    patternScore: number,
    patternReason: string | null
  ): ScoreResult {
    const reasons: string[] = [];
    let probability = patternScore;

    if (patternReason) {
      reasons.push(patternReason);
    }

    // Only check additional factors if we have strong suspicion
    if (probability > this.#PROFILE_CHECK_THRESHOLD) {
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
    probability = Math.min(probability, this.#MAX_PROBABILITY);

    return {
      probability,
      reasons
    };
  }
} 