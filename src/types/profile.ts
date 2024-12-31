// Type definitions
export type InteractionType = 'like' | 'reply' | 'repost' | 'follow';
export type NotificationType = 'user_interaction' | 'pinned_post' | 'trending' | 'community_post' | 'multi_user';

// Use const enums for better inlining
export const enum InteractionTypes {
  Like = 'like',
  Reply = 'reply',
  Repost = 'repost',
  Follow = 'follow'
}

export const enum NotificationTypes {
  UserInteraction = 'user_interaction',
  PinnedPost = 'pinned_post',
  Trending = 'trending',
  CommunityPost = 'community_post',
  MultiUser = 'multi_user'
}

// Interfaces
export interface ProfileData {
  username: string;
  displayName: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  interactionTimestamp: number;
  interactionType: InteractionType;
  notificationType: NotificationType;
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
