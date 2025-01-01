export interface PatternMatch {
  score: number;
  reason: string;
}

export class PatternMatcher {
  public findMatches(username: string): PatternMatch[] {
    if (!username || typeof username !== 'string') return [];

    const matches: PatternMatch[] = [];

    // Check for bot keywords
    if (/bot|spam|auto/i.test(username)) {
      matches.push({
        score: 0.35,
        reason: 'Username contains suspicious keywords'
      });
    }

    // Check for many numbers
    if (/[0-9]{4,}/.test(username)) {
      matches.push({
        score: 0.25,
        reason: 'Username contains unusually many numbers'
      });
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