// Type definitions
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

// Types
export type InteractionType = InteractionTypes;
export type NotificationType = NotificationTypes;

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
