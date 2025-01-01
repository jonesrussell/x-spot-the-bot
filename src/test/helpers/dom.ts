/**
 * Helper functions for DOM-related tests
 */

/**
 * Creates a notification cell element with basic structure
 */
export function createNotificationCell(): HTMLElement {
  const cell = document.createElement('div');
  cell.setAttribute('data-testid', 'cellInnerDiv');
  
  const article = document.createElement('article');
  cell.appendChild(article);
  
  return cell;
}

/**
 * Adds user information to a notification cell
 */
export function addUserInfo(cell: HTMLElement, username: string, displayName?: string): void {
  const article = cell.querySelector('article');
  if (!article) throw new Error('Article element not found');

  const userLink = document.createElement('a');
  userLink.setAttribute('role', 'link');
  userLink.setAttribute('href', `/${username}`);
  
  const userName = document.createElement('div');
  userName.setAttribute('data-testid', 'User-Name');
  userName.textContent = displayName || username;
  userLink.appendChild(userName);
  
  article.appendChild(userLink);
}

/**
 * Adds notification text to a cell
 */
export function addNotificationText(cell: HTMLElement, text: string): void {
  const article = cell.querySelector('article');
  if (!article) throw new Error('Article element not found');

  const notificationText = document.createElement('div');
  notificationText.setAttribute('data-testid', 'notificationText');
  notificationText.textContent = text;
  article.appendChild(notificationText);
}

/**
 * Adds profile image to a cell
 */
export function addProfileImage(cell: HTMLElement, imageUrl: string): void {
  const article = cell.querySelector('article');
  if (!article) throw new Error('Article element not found');

  const img = document.createElement('img');
  img.setAttribute('src', imageUrl);
  article.appendChild(img);
} 