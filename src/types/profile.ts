// Type definitions
export const InteractionType = {
  Like: 'like',
  Reply: 'reply',
  Repost: 'repost',
  Follow: 'follow'
} as const;

export const NotificationType = {
  UserInteraction: 'user_interaction',
  PinnedPost: 'pinned_post',
  Trending: 'trending',
  CommunityPost: 'community_post',
  MultiUser: 'multi_user'
} as const;

// Infer types from const objects
export type InteractionType = typeof InteractionType[keyof typeof InteractionType];
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

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
