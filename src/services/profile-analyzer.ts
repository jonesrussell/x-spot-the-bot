import type { ProfileData } from '../types/profile.ts';

export class ProfileAnalyzer {
  private readonly SUSPICIOUS_PATTERNS = {
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{8,}$/i,
    MANY_NUMBERS: /[0-9]{4,}/,
    BOT_KEYWORDS: /(bot|spam|[0-9]+[a-z]+[0-9]+)/i,
    RANDOM_SUFFIX: /[a-z]+[0-9]{4,}$/i,
    COMMUNITY: /^i\/communities\//,
    NUMERIC_SUFFIX: /[0-9]{4,}$/,
    RANDOM_LETTERS: /[A-Z]{2,}[0-9]+/i
  } as const;

  public async analyzeBotProbability(profile: ProfileData): Promise<{
    probability: number;
    reasons: string[];
  }> {
    // Skip community posts
    if (this.SUSPICIOUS_PATTERNS.COMMUNITY.test(profile.username)) {
      console.debug('[XBot:Analysis] Skipping community post:', profile.username);
      return { probability: 0, reasons: [] };
    }

    let probability = 0;
    const reasons: string[] = [];
    const scores: Record<string, number> = {};

    // Check follower/following ratio
    if (profile.followersCount === 0 && profile.followingCount === 0) {
      const score = 0.3;
      probability += score;
      scores.noFollowers = score;
      reasons.push('No followers or following');
    }

    // Check username patterns
    const { score: usernameScore, matchedPatterns } = this.analyzeUsername(profile.username);
    if (usernameScore > 0) {
      probability += usernameScore;
      scores.username = usernameScore;
      reasons.push(`Suspicious username pattern (${matchedPatterns.join(', ')})`);
    }

    // Check display name similarity to username
    if (this.isSimilar(profile.displayName, profile.username)) {
      const score = 0.2;
      probability += score;
      scores.similarName = score;
      reasons.push('Display name similar to username');
    }

    // Cap total probability at 0.9
    probability = Math.min(probability, 0.9);

    console.debug('[XBot:Analysis] Score details:', {
      username: profile.username,
      displayName: profile.displayName,
      totalProbability: probability,
      individualScores: scores,
      reasons,
      matchedPatterns
    });

    return { probability, reasons };
  }

  private analyzeUsername(username: string): { score: number; matchedPatterns: string[] } {
    let score = 0;
    const matchedPatterns: string[] = [];

    const patterns: [keyof typeof this.SUSPICIOUS_PATTERNS, number, string][] = [
      ['RANDOM_ALPHANUMERIC', 0.3, 'random alphanumeric'],
      ['MANY_NUMBERS', 0.2, 'many numbers'],
      ['BOT_KEYWORDS', 0.3, 'bot keywords'],
      ['RANDOM_SUFFIX', 0.2, 'random suffix'],
      ['NUMERIC_SUFFIX', 0.2, 'numeric suffix'],
      ['RANDOM_LETTERS', 0.2, 'random letters']
    ];

    for (const [pattern, patternScore, description] of patterns) {
      if (this.SUSPICIOUS_PATTERNS[pattern].test(username)) {
        score += patternScore;
        matchedPatterns.push(description);
      }
    }

    // Cap username-based score at 0.5
    return { 
      score: Math.min(score, 0.5),
      matchedPatterns
    };
  }

  private isSimilar(str1: string, str2: string): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    
    // Skip short strings
    if (s1.length < 4 || s2.length < 4) return false;
    
    return s1.includes(s2) || s2.includes(s1);
  }
}
