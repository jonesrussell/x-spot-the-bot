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
          <div data-testid="notification">
            <div data-testid="UserName">
              <a role="link" href="/johndoe">
                <span>John Doe</span>
                <span>@johndoe</span>
              </a>
            </div>
            <div data-testid="UserAvatar">
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
          <div data-testid="notification">
            <div data-testid="UserAvatar">
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
            <div data-testid="notification">
              <div data-testid="UserName">
                <a role="link" href="/user">
                  <span>Test User</span>
                </a>
              </div>
              <div data-testid="UserAvatar">
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
          <div data-testid="notification">
            <div data-testid="UserName">
              <a role="link" href="/user">
                <span>Test User</span>
              </a>
            </div>
            <div data-testid="UserAvatar">
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

    it('should handle community and pinned post notifications', () => {
      const testCases = [
        {
          html: `
            <div data-testid="cellInnerDiv">
              <div data-testid="notification">
                <div>New pinned post in Machine Learning</div>
                <div data-testid="tweetText">Learning - (self/ constant) V1 showing...</div>
              </div>
            </div>
          `,
          type: 'pinned'
        },
        {
          html: `
            <div data-testid="cellInnerDiv">
              <div data-testid="notification">
                <div>Trending in Technology</div>
                <div data-testid="tweetText">AI and Machine Learning</div>
              </div>
            </div>
          `,
          type: 'trending'
        },
        {
          html: `
            <div data-testid="cellInnerDiv">
              <div data-testid="notification">
                <div>New community post in Programming</div>
                <div data-testid="tweetText">Check out this new feature...</div>
              </div>
            </div>
          `,
          type: 'community'
        }
      ];

      testCases.forEach(({ html, type }) => {
        document.body.innerHTML = html;
        const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
        const result = extractor.extractProfileData(element);

        expect(result).toBeNull();
      });
    });
  });
}); 