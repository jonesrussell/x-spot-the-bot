import { beforeEach, describe, expect, it } from 'vitest';
import { PatternMatcher } from '../pattern-matcher.js';

describe('PatternMatcher', () => {
  let matcher: PatternMatcher;

  beforeEach(() => {
    matcher = new PatternMatcher();
  });

  describe('findMatches', () => {
    it('should detect bot keywords', () => {
      const matches = matcher.findMatches('spambot123');
      const botMatch = matches.find(m => m.reason.includes('Bot-like keywords'));
      expect(botMatch).toEqual({
        score: 0.35,
        reason: 'Bot-like keywords detected in username'
      });
    });

    it('should detect many numbers', () => {
      const matches = matcher.findMatches('user12345678');
      const numberMatch = matches.find(m => m.reason.includes('many numbers'));
      expect(numberMatch).toEqual({
        score: 0.25,
        reason: 'Username contains many numbers'
      });
    });

    it('should detect random alphanumeric usernames', () => {
      const matches = matcher.findMatches('a1b2c3d4e5f6g7h8');
      const randomMatch = matches.find(m => m.reason.includes('Random alphanumeric'));
      expect(randomMatch).toEqual({
        score: 0.3,
        reason: 'Random alphanumeric username pattern detected'
      });
    });

    it('should detect numeric suffix', () => {
      const matches = matcher.findMatches('testuser1234');
      const suffixMatch = matches.find(m => m.reason.includes('numeric suffix'));
      expect(suffixMatch).toEqual({
        score: 0.2,
        reason: 'Username ends with numeric suffix'
      });
    });

    it('should return empty array for normal usernames', () => {
      const matches = matcher.findMatches('john_doe');
      expect(matches).toHaveLength(0);
    });
  });

  describe('getHighestScore', () => {
    it('should return null for empty matches', () => {
      const result = matcher.getHighestScore([]);
      expect(result).toBeNull();
    });

    it('should return highest scoring match', () => {
      const matches = [
        { score: 0.2, reason: 'Numeric suffix' },
        { score: 0.35, reason: 'Bot keywords' },
        { score: 0.3, reason: 'Random alphanumeric' }
      ];
      const result = matcher.getHighestScore(matches);
      expect(result).toEqual({
        score: 0.35,
        reason: 'Bot keywords'
      });
    });
  });
}); 