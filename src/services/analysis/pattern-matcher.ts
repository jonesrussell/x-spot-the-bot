interface PatternMatch {
  score: number;
  reason: string;
}

export class PatternMatcher {
  static readonly #BOT_PATTERNS = {
    RANDOM_ALPHANUMERIC: {
      pattern: /^[a-z0-9]{15,}$/,
      score: 0.4,
      reason: 'Username appears randomly generated'
    },
    BOT_KEYWORDS: {
      pattern: /\b(bot|spam|scam|auto)\b|[0-9]{4,}[a-z]+[0-9]{4,}/i,
      score: 0.35,
      reason: 'Username contains suspicious keywords'
    },
    MANY_NUMBERS: {
      pattern: /[0-9]{8,}/,
      score: 0.25,
      reason: 'Username contains unusually many numbers'
    },
    RANDOM_SUFFIX: {
      pattern: /[a-z]+[0-9]{8,}$/,
      score: 0.2,
      reason: 'Username has suspicious number suffix'
    },
    NUMERIC_SUFFIX: {
      pattern: /[0-9]{8,}$/,
      score: 0.15,
      reason: 'Username ends with many numbers'
    },
    RANDOM_LETTERS: {
      pattern: /[A-Z]{4,}[0-9]{4,}/,
      score: 0.2,
      reason: 'Username has suspicious letter/number pattern'
    }
  } as const;

  public findMatches(username: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    const normalizedUsername = username.toLowerCase();

    for (const [, config] of Object.entries(PatternMatcher.#BOT_PATTERNS)) {
      if (config.pattern.test(normalizedUsername)) {
        matches.push({
          score: config.score,
          reason: config.reason
        });
      }
    }

    return matches;
  }

  public getHighestScore(matches: PatternMatch[]): PatternMatch | null {
    if (!matches.length) return null;

    return matches.reduce((highest, current) => 
      current.score > highest.score ? current : highest
    );
  }
} 