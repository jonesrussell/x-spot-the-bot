// Type definitions
export type InteractionType = 'like' | 'reply' | 'repost' | 'follow';
export type NotificationType = 'user_interaction' | 'pinned_post' | 'trending' | 'community_post' | 'multi_user';

// Constants used in tests
export const InteractionTypes = {
  Like: 'like' as const,
  Reply: 'reply' as const,
  Repost: 'repost' as const,
  Follow: 'follow' as const
};

export const NotificationTypes = {
  UserInteraction: 'user_interaction' as const,
  PinnedPost: 'pinned_post' as const,
  Trending: 'trending' as const,
  CommunityPost: 'community_post' as const,
  MultiUser: 'multi_user' as const
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
  notificationType: 'user_interaction' | 'multi_user';
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
