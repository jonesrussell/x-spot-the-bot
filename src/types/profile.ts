// Type definitions
export type InteractionType = 
  | 'like' 
  | 'reply' 
  | 'repost' 
  | 'follow'
  | 'mention'
  | 'quote'
  | 'list'
  | 'space'
  | 'live'
  | 'other';

export type NotificationType = 
  | 'user_interaction'
  | 'multi_user'
  | 'pinned_post'
  | 'trending'
  | 'community_post';

// Runtime values
export const InteractionTypes = {
  Like: 'like',
  Reply: 'reply',
  Repost: 'repost',
  Follow: 'follow',
  Live: 'live',
  Other: 'other'
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
  notificationType: 'user_interaction' | 'multi_user';
  botProbability: number;
  isVerified: boolean;
}

// Raw profile data without bot analysis
export type RawProfileData = Omit<ProfileData, 'botProbability'>;

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
