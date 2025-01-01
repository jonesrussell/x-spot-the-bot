import { PatternMatcher } from '../pattern-matcher.js';

describe('PatternMatcher', () => {
  let matcher: PatternMatcher;

  beforeEach(() => {
    matcher = new PatternMatcher();
  });

  describe('findMatches', () => {
    it('should detect randomly generated alphanumeric usernames', () => {
      const matches = matcher.findMatches('a1b2c3d4e5f6g7h8i9');
      expect(matches).toHaveLength(1);
      expect(matches[0]).toEqual({
        score: 0.4,
        reason: 'Username appears randomly generated'
      });
    });

    it('should detect bot keywords', () => {
      const matches = matcher.findMatches('spambot123');
      expect(matches).toHaveLength(1);
      expect(matches[0]).toEqual({
        score: 0.35,
        reason: 'Username contains suspicious keywords'
      });
    });

    it('should detect excessive numbers', () => {
      const matches = matcher.findMatches('user12345678');
      expect(matches).toHaveLength(1);
      expect(matches[0]).toEqual({
        score: 0.25,
        reason: 'Username contains unusually many numbers'
      });
    });

    it('should detect random suffixes', () => {
      const matches = matcher.findMatches('username12345678');
      expect(matches).toHaveLength(2); // Both RANDOM_SUFFIX and MANY_NUMBERS
      expect(matches).toContainEqual({
        score: 0.2,
        reason: 'Username has suspicious number suffix'
      });
    });

    it('should detect numeric suffixes', () => {
      const matches = matcher.findMatches('user12345678');
      expect(matches).toContainEqual({
        score: 0.15,
        reason: 'Username ends with many numbers'
      });
    });

    it('should detect random letter patterns', () => {
      const matches = matcher.findMatches('ABCD1234');
      expect(matches).toContainEqual({
        score: 0.2,
        reason: 'Username has suspicious letter/number pattern'
      });
    });

    it('should return empty array for normal usernames', () => {
      const matches = matcher.findMatches('normal_user123');
      expect(matches).toHaveLength(0);
    });

    it('should handle case-insensitive matching', () => {
      const matches = matcher.findMatches('SPAMBOT123');
      expect(matches).toContainEqual({
        score: 0.35,
        reason: 'Username contains suspicious keywords'
      });
    });

    it('should handle empty username', () => {
      const matches = matcher.findMatches('');
      expect(matches).toHaveLength(0);
    });

    it('should handle whitespace username', () => {
      const matches = matcher.findMatches('   ');
      expect(matches).toHaveLength(0);
    });

    it('should handle unicode characters', () => {
      const matches = matcher.findMatches('user🤖1234');
      expect(matches).toHaveLength(0); // Emojis shouldn't trigger patterns
    });

    it('should handle very long usernames', () => {
      const longUsername = 'a'.repeat(100) + '12345678';
      const matches = matcher.findMatches(longUsername);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches).toContainEqual({
        score: 0.15,
        reason: 'Username ends with many numbers'
      });
    });

    it('should handle mixed case patterns correctly', () => {
      const matches = matcher.findMatches('sPaMbOt123');
      expect(matches).toContainEqual({
        score: 0.35,
        reason: 'Username contains suspicious keywords'
      });
    });
  });

  describe('getHighestScore', () => {
    it('should return null for empty matches', () => {
      const result = matcher.getHighestScore([]);
      expect(result).toBeNull();
    });

    it('should return highest scoring match', () => {
      const matches = [
        { score: 0.2, reason: 'Lower score' },
        { score: 0.4, reason: 'Higher score' },
        { score: 0.3, reason: 'Medium score' }
      ];
      const result = matcher.getHighestScore(matches);
      expect(result).toEqual({
        score: 0.4,
        reason: 'Higher score'
      });
    });

    it('should handle single match', () => {
      const matches = [{ score: 0.2, reason: 'Only match' }];
      const result = matcher.getHighestScore(matches);
      expect(result).toEqual({
        score: 0.2,
        reason: 'Only match'
      });
    });

    it('should handle duplicate scores', () => {
      const matches = [
        { score: 0.2, reason: 'First match' },
        { score: 0.2, reason: 'Second match' }
      ];
      const result = matcher.getHighestScore(matches);
      expect(result).not.toBeNull();
      expect(result!.score).toBe(0.2);
      // Should keep the first match when scores are equal
      expect(result!.reason).toBe('First match');
    });

    it('should handle floating point scores', () => {
      const matches = [
        { score: 0.1999999999, reason: 'Lower' },
        { score: 0.2000000001, reason: 'Higher' }
      ];
      const result = matcher.getHighestScore(matches);
      expect(result).not.toBeNull();
      expect(result!.reason).toBe('Higher');
    });
  });
}); 