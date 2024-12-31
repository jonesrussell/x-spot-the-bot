// Type definitions
export type InteractionType = 'like' | 'reply' | 'repost' | 'follow';
export type NotificationType = 'user_interaction' | 'pinned_post' | 'trending' | 'community_post' | 'multi_user';

// Values
export const InteractionTypes = {
  Like: 'like' as InteractionType,
  Reply: 'reply' as InteractionType,
  Repost: 'repost' as InteractionType,
  Follow: 'follow' as InteractionType
};

export const NotificationTypes = {
  UserInteraction: 'user_interaction' as NotificationType,
  PinnedPost: 'pinned_post' as NotificationType,
  Trending: 'trending' as NotificationType,
  CommunityPost: 'community_post' as NotificationType,
  MultiUser: 'multi_user' as NotificationType
};

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
