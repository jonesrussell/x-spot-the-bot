export class ImageResolver {
  readonly #DEFAULT_PROFILE_IMAGE = 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png';

  public resolveProfileImage(userLink: HTMLElement, profileImages: HTMLImageElement[]): string {
    if (!profileImages.length) return this.#DEFAULT_PROFILE_IMAGE;

    // We know the array has at least one element at this point
    const firstImg = profileImages[0]!;
    if (profileImages.length === 1) return firstImg.src;

    const userRect = userLink.getBoundingClientRect();
    let closestImg = firstImg;
    let minDistance = Math.abs(userRect.top - firstImg.getBoundingClientRect().top);

    // Compare with remaining images
    for (let i = 1; i < profileImages.length; i++) {
      const img = profileImages[i]!;
      const imgRect = img.getBoundingClientRect();
      const distance = Math.abs(userRect.top - imgRect.top);
      if (distance < minDistance) {
        minDistance = distance;
        closestImg = img;
      }
    }

    return closestImg.src;
  }
} 