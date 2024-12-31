// Type definitions
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

// Infer types from const objects
export type InteractionType = typeof InteractionTypes[keyof typeof InteractionTypes];
export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

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
