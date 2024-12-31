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
            <a href="/johndoe" role="link">John Doe</a>
            <div data-testid="UserAvatar-Container-johndoe">
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
              <a href="/user" role="link">Test User</a>
              <div data-testid="UserAvatar-Container-user">
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
            <a href="/user" role="link">Test User</a>
            <div data-testid="UserAvatar-Container-user">
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
        },
        {
          html: `
            <div data-testid="cellInnerDiv">
              <div data-testid="notification">
                <div>New post notifications for</div>
                <div data-testid="UserName">
                  <a role="link" href="/user1">
                    <span>User One</span>
                  </a>
                </div>
                <div>and</div>
                <div data-testid="UserName">
                  <a role="link" href="/user2">
                    <span>User Two</span>
                  </a>
                </div>
              </div>
            </div>
          `,
          type: 'multiple_users'
        }
      ];

      testCases.forEach(({ html, type }) => {
        document.body.innerHTML = html;
        const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
        const result = extractor.extractProfileData(element);

        expect(result).toBeNull();
      });
    });

    it('should handle multiple user notifications', () => {
      const html = `
        <div data-testid="cellInnerDiv">
          <div data-testid="notification">
            <div>New post notifications for</div>
            <div>
              <a href="/user1" role="link">User One</a>
              <div data-testid="UserAvatar-Container-user1">
                <img src="https://pbs.twimg.com/profile_images/123/image.jpg" />
              </div>
            </div>
            <div>and</div>
            <div>
              <a href="/user2" role="link">User Two</a>
              <div data-testid="UserAvatar-Container-user2">
                <img src="https://pbs.twimg.com/profile_images/456/image.jpg" />
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.innerHTML = html;
      const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
      const result = extractor.extractProfileData(element);

      expect(result).not.toBeNull();
      expect(result?.username).toBe('user1');
      expect(result?.displayName).toBe('User One');
      expect(result?.profileImageUrl).toContain('profile_images');
      expect(result?.interactionType).toBe('follow');
    });

    it('should handle verified user notifications', () => {
      const html = `
        <div data-testid="cellInnerDiv">
          <div data-testid="notification">
            <div>New post notifications for</div>
            <div>
              <a href="/verifieduser" role="link">
                Verified User
                <svg viewBox="0 0 22 22" aria-label="Verified account" data-testid="icon-verified">
                  <path d="M20.396 11c-.018-.646-.215-1.275..."></path>
                </svg>
              </a>
              <div data-testid="UserAvatar-Container-verifieduser">
                <img src="https://pbs.twimg.com/profile_images/789/image.jpg" />
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.innerHTML = html;
      const element = document.querySelector('[data-testid="cellInnerDiv"]') as HTMLElement;
      const result = extractor.extractProfileData(element);

      expect(result).not.toBeNull();
      expect(result?.username).toBe('verifieduser');
      expect(result?.displayName).toBe('Verified User');
      expect(result?.profileImageUrl).toContain('profile_images');
      expect(result?.interactionType).toBe('follow');
    });
  });
}); 