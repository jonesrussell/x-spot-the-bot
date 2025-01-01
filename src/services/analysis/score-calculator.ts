import type { RawProfileData } from '../../types/profile.js';

export interface BotScore {
  probability: number;
  reasons: string[];
}

export class ScoreCalculator {
  static readonly #THRESHOLD = 0.35;
  static readonly #MAX_PROBABILITY = 0.8;

  public calculateScore(profile: RawProfileData, patternScore: number, patternReason: string | null): BotScore {
    const reasons: string[] = [];
    let probability = Math.max(0, patternScore);

    // Add pattern reason if provided
    if (patternReason && probability > 0) {
      reasons.push(patternReason);
    }

    // Only check additional factors if pattern score is above threshold
    if (probability > ScoreCalculator.#THRESHOLD) {
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
    probability = Math.min(Math.max(0, probability), ScoreCalculator.#MAX_PROBABILITY);

    return {
      probability,
      reasons
    };
  }
} 