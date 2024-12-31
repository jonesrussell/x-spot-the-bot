import { DOMExtractor } from '../dom-extractor.js';

describe('DOMExtractor', () => {
  let extractor: DOMExtractor;

  beforeEach(() => {
    extractor = new DOMExtractor();
    document.body.innerHTML = '';
  });

  describe('extractProfileData', () => {
    it('should extract profile data from notification element', () => {
      const html = `
        <div data-testid="cellInnerDiv">
          <div data-testid="tweet">
            <div data-testid="User-Name">
              <a role="link" href="/johndoe">
                <span>John Doe</span>
                <span>@johndoe</span>
              </a>
            </div>
            <div data-testid="Tweet-User-Avatar">
              <img src="https://pbs.twimg.com/profile_images/123/image.jpg" />
            </div>
            <div>liked your tweet</div>
          </div>
        </div>
      `;

      document.body.innerHTML = html;
      const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
      const result = extractor.extractProfileData(element);

      expect(result).not.toBeNull();
      expect(result?.username).toBe('johndoe');
      expect(result?.displayName).toBe('John Doe');
      expect(result?.profileImageUrl).toContain('profile_images');
      expect(result?.interactionType).toBe('like');
    });

    it('should return null for warning elements', () => {
      const html = `
        <div data-testid="cellInnerDiv" class="xbd-warning">
          <div data-testid="tweet">Warning content</div>
        </div>
      `;

      document.body.innerHTML = html;
      const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
      const result = extractor.extractProfileData(element);

      expect(result).toBeNull();
    });

    it('should handle missing user name element', () => {
      const html = `
        <div data-testid="cellInnerDiv">
          <div data-testid="tweet">
            <div data-testid="Tweet-User-Avatar">
              <img src="https://pbs.twimg.com/profile_images/123/image.jpg" />
            </div>
          </div>
        </div>
      `;

      document.body.innerHTML = html;
      const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
      const result = extractor.extractProfileData(element);

      expect(result).toBeNull();
    });

    it('should detect different interaction types', () => {
      const testCases = [
        { text: 'liked your tweet', expected: 'like' },
        { text: 'replied to your tweet', expected: 'reply' },
        { text: 'reposted your tweet', expected: 'repost' },
        { text: 'followed you', expected: 'follow' }
      ];

      testCases.forEach(({ text, expected }) => {
        const html = `
          <div data-testid="cellInnerDiv">
            <div data-testid="tweet">
              <div data-testid="User-Name">
                <a role="link" href="/user">
                  <span>Test User</span>
                </a>
              </div>
              <div data-testid="Tweet-User-Avatar">
                <img src="https://pbs.twimg.com/profile_images/123/image.jpg" />
              </div>
              <div>${text}</div>
            </div>
          </div>
        `;

        document.body.innerHTML = html;
        const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
        const result = extractor.extractProfileData(element);

        expect(result?.interactionType).toBe(expected);
      });
    });

    it('should handle profile image in background style', () => {
      const html = `
        <div data-testid="cellInnerDiv">
          <div data-testid="tweet">
            <div data-testid="User-Name">
              <a role="link" href="/user">
                <span>Test User</span>
              </a>
            </div>
            <div data-testid="Tweet-User-Avatar">
              <div style="background-image: url('https://pbs.twimg.com/profile_images/123/image.jpg')"></div>
            </div>
            <div>liked your tweet</div>
          </div>
        </div>
      `;

      document.body.innerHTML = html;
      const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
      const result = extractor.extractProfileData(element);

      expect(result?.profileImageUrl).toContain('profile_images');
    });
  });
}); 