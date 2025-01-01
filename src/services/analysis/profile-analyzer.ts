import type { BotAnalysis, RawProfileData } from '../../types/profile.js';
import { PatternMatcher } from './pattern-matcher.js';
import { ScoreCalculator } from './score-calculator.js';

export class ProfileAnalyzer {
  #patternMatcher: PatternMatcher;
  #scoreCalculator: ScoreCalculator;

  constructor() {
    this.#patternMatcher = new PatternMatcher();
    this.#scoreCalculator = new ScoreCalculator();
  }

  public analyzeProfile(profile: RawProfileData): BotAnalysis {
    // Skip verified accounts
    if (profile.isVerified === true) {
      return {
        username: profile.username,
        probability: 0,
        reasons: []
      };
    }

    // Find pattern matches
    const matches = this.#patternMatcher.findMatches(profile.username);
    const highestMatch = this.#patternMatcher.getHighestScore(matches);

    // Calculate final score
    const result = this.#scoreCalculator.calculateScore(
      profile,
      highestMatch?.score ?? 0,
      highestMatch?.reason ?? null
    );

    return {
      username: profile.username,
      probability: result.probability,
      reasons: result.reasons
    };
  }
} 