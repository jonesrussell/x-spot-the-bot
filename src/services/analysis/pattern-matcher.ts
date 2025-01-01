export interface PatternMatch {
  score: number;
  reason: string;
}

export class PatternMatcher {
  static readonly #PATTERNS = {
    BOT_KEYWORDS: {
      pattern: /bot|spam|auto/i,
      score: 0.35,
      reason: 'Username contains suspicious keywords'
    },
    MANY_NUMBERS: {
      pattern: /[0-9]{4,}/,
      score: 0.25,
      reason: 'Username contains unusually many numbers'
    },
    RANDOM_SUFFIX: {
      pattern: /[a-z]+[0-9]{4,}$/i,
      score: 0.2,
      reason: 'Username has suspicious number suffix'
    },
    NUMERIC_SUFFIX: {
      pattern: /[0-9]{4,}$/,
      score: 0.15,
      reason: 'Username ends with many numbers'
    },
    RANDOM_LETTERS: {
      pattern: /[A-Z]{2,}[0-9]+/,
      score: 0.2,
      reason: 'Username has suspicious letter/number pattern'
    }
  } as const;

  public findMatches(username: string): PatternMatch[] {
    if (!username || typeof username !== 'string') return [];

    // Remove emojis and other non-ASCII characters
    const cleanUsername = username.replace(/[^\x20-\x7E]/g, '');
    if (!cleanUsername) return [];
    
    const matches: PatternMatch[] = [];

    for (const pattern of Object.values(PatternMatcher.#PATTERNS)) {
      if (pattern.pattern.test(cleanUsername)) {
        matches.push({
          score: pattern.score,
          reason: pattern.reason
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