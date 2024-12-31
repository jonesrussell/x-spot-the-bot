import type { ProfileData } from '../types/profile.ts';

export class ProfileAnalyzer {
  public async analyzeBotProbability(profile: ProfileData): Promise<{
    probability: number;
    reasons: string[];
  }> {
    let probability = 0;
    const reasons: string[] = [];

    if (profile.followersCount === 0 && profile.followingCount === 0) {
      probability += 0.4;
      reasons.push('No followers or following');
    }

    if (this.isGeneratedUsername(profile.username)) {
      probability += 0.3;
      reasons.push('Suspicious username pattern');
    }

    return { probability, reasons };
  }

  private isGeneratedUsername(username: string): boolean {
    const botPatterns = [
      /^[a-z0-9]{8,}$/i, // Random alphanumeric
      /[0-9]{4,}/, // Too many numbers
      /(bot|spam|[0-9]+[a-z]+[0-9]+)/i, // Contains bot-like words or patterns
    ];

    return botPatterns.some(pattern => pattern.test(username));
  }
}
