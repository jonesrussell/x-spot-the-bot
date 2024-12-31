export enum InteractionType {
  Like = 'like',
  Reply = 'reply',
  Repost = 'repost',
  Follow = 'follow'
}

export enum NotificationType {
  UserInteraction = 'user_interaction',
  PinnedPost = 'pinned_post',
  Trending = 'trending',
  CommunityPost = 'community_post',
  MultiUser = 'multi_user'
}

export interface ProfileData {
  username: string;
  displayName: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  interactionTimestamp: number;
  interactionType: InteractionType;
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
