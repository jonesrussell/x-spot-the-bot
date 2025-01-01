import type { ProfileData } from '../../types/profile.js';
import { PatternMatcher } from './pattern-matcher.js';
import { ScoreCalculator } from './score-calculator.js';

export interface AnalysisResult {
  username: string;
  probability: number;
  reasons: string[];
}

export class ProfileAnalyzer {
  #patternMatcher: PatternMatcher;
  #scoreCalculator: ScoreCalculator;

  constructor() {
    this.#patternMatcher = new PatternMatcher();
    this.#scoreCalculator = new ScoreCalculator();
  }

  public analyzeProfile(profile: ProfileData): AnalysisResult {
    // Verified accounts are never bots
    if (profile.isVerified) {
      return {
        username: profile.username,
        probability: 0,
        reasons: []
      };
    }

    // Check username patterns
    const matches = this.#patternMatcher.findMatches(profile.username);
    const highestMatch = this.#patternMatcher.getHighestScore(matches);

    // Calculate final score
    const result = this.#scoreCalculator.calculateScore(
      profile,
      highestMatch?.score ?? null,
      highestMatch?.reason ?? null
    );

    // Add all pattern reasons
    const reasons = matches.map(m => m.reason);
    if (result.reasons.length) {
      reasons.push(...result.reasons);
    }

    return {
      username: profile.username,
      probability: result.probability,
      reasons: reasons
    };
  }
} 