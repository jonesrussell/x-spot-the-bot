// Type definitions
export type InteractionType = 'like' | 'reply' | 'repost' | 'follow';
export type NotificationType = 'user_interaction' | 'pinned_post' | 'trending' | 'community_post' | 'multi_user';

// Runtime values
export const InteractionTypes = {
  Like: 'like',
  Reply: 'reply',
  Repost: 'repost',
  Follow: 'follow'
} as const;

export const NotificationTypes = {
  UserInteraction: 'user_interaction',
  PinnedPost: 'pinned_post',
  Trending: 'trending',
  CommunityPost: 'community_post',
  MultiUser: 'multi_user'
} as const;

// Interfaces
export interface ProfileData {
  username: string;
  displayName: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  interactionTimestamp: number;
  interactionType: InteractionType;
  notificationType: Extract<NotificationType, 'user_interaction' | 'multi_user'>;
}

export interface BotAnalysis {
  username: string;
  probability: number;
  reasons: string[];
}

export interface NotificationData {
  type: NotificationType;
  text: string;
  users?: ProfileData[];
  communityName?: string;
}
