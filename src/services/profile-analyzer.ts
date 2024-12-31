import type { ProfileData } from '../types/profile.ts';

export class ProfileAnalyzer {
  private readonly SUSPICIOUS_PATTERNS = {
    RANDOM_ALPHANUMERIC: /^[a-z0-9]{8,}$/i,
    MANY_NUMBERS: /[0-9]{4,}/,
    BOT_KEYWORDS: /(bot|spam|[0-9]+[a-z]+[0-9]+)/i,
    RANDOM_SUFFIX: /[a-z]+[0-9]{4,}$/i,
    COMMUNITY: /^i\/communities\//
  } as const;

  public async analyzeBotProbability(profile: ProfileData): Promise<{
    probability: number;
    reasons: string[];
  }> {
    // Skip community posts
    if (this.SUSPICIOUS_PATTERNS.COMMUNITY.test(profile.username)) {
      return { probability: 0, reasons: [] };
    }

    let probability = 0;
    const reasons: string[] = [];

    // Check follower/following ratio
    if (profile.followersCount === 0 && profile.followingCount === 0) {
      probability += 0.4;
      reasons.push('No followers or following');
    }

    // Check username patterns
    const usernameScore = this.analyzeUsername(profile.username);
    if (usernameScore > 0) {
      probability += usernameScore;
      reasons.push('Suspicious username pattern');
    }

    // Check display name similarity to username
    if (this.isSimilar(profile.displayName, profile.username)) {
      probability += 0.2;
      reasons.push('Display name similar to username');
    }

    console.debug('[XBot:Analysis] Score details:', {
      username: profile.username,
      probability,
      reasons,
      patterns: {
        randomAlphanumeric: this.SUSPICIOUS_PATTERNS.RANDOM_ALPHANUMERIC.test(profile.username),
        manyNumbers: this.SUSPICIOUS_PATTERNS.MANY_NUMBERS.test(profile.username),
        botKeywords: this.SUSPICIOUS_PATTERNS.BOT_KEYWORDS.test(profile.username),
        randomSuffix: this.SUSPICIOUS_PATTERNS.RANDOM_SUFFIX.test(profile.username)
      }
    });

    return { probability, reasons };
  }

  private analyzeUsername(username: string): number {
    let score = 0;

    if (this.SUSPICIOUS_PATTERNS.RANDOM_ALPHANUMERIC.test(username)) {
      score += 0.3;
    }
    if (this.SUSPICIOUS_PATTERNS.MANY_NUMBERS.test(username)) {
      score += 0.2;
    }
    if (this.SUSPICIOUS_PATTERNS.BOT_KEYWORDS.test(username)) {
      score += 0.3;
    }
    if (this.SUSPICIOUS_PATTERNS.RANDOM_SUFFIX.test(username)) {
      score += 0.2;
    }

    return Math.min(score, 0.5); // Cap username-based score
  }

  private isSimilar(str1: string, str2: string): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    return s1.includes(s2) || s2.includes(s1);
  }
}
