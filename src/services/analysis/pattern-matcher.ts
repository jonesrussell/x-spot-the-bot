import { type PatternMatch } from '../../types/analysis.js';

export class PatternMatcher {
  readonly #botKeywords = /bot|spam|[0-9]+[a-z]+[0-9]+/i;
  readonly #manyNumbers = /[0-9]{4,}/;
  readonly #randomAlphanumeric = /^[a-z0-9]{8,}$/i;
  readonly #numericSuffix = /[a-z]+[0-9]{4,}$/i;

  findMatches(username: string): PatternMatch[] {
    const matches: PatternMatch[] = [];

    if (this.#botKeywords.test(username)) {
      matches.push({
        score: 0.35,
        reason: 'Bot-like keywords detected in username'
      });
    }

    if (this.#manyNumbers.test(username)) {
      matches.push({
        score: 0.25,
        reason: 'Username contains many numbers'
      });
    }

    if (this.#randomAlphanumeric.test(username)) {
      matches.push({
        score: 0.3,
        reason: 'Random alphanumeric username pattern detected'
      });
    }

    if (this.#numericSuffix.test(username)) {
      matches.push({
        score: 0.2,
        reason: 'Username ends with numeric suffix'
      });
    }

    return matches;
  }

  getHighestScore(matches: PatternMatch[]): PatternMatch | null {
    if (matches.length === 0) {
      return null;
    }

    return matches.reduce((highest, current) => {
      return current.score > highest.score ? current : highest;
    });
  }
} 