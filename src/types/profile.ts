// Type definitions
export type InteractionType = 'like' | 'reply' | 'repost' | 'follow';
export type NotificationType = 'user_interaction' | 'pinned_post' | 'trending' | 'community_post' | 'multi_user';

// Values namespace for runtime constants and validation
export const Values = {
  InteractionTypes: {
    Like: 'like',
    Reply: 'reply',
    Repost: 'repost',
    Follow: 'follow'
  },
  NotificationTypes: {
    UserInteraction: 'user_interaction',
    PinnedPost: 'pinned_post',
    Trending: 'trending',
    CommunityPost: 'community_post',
    MultiUser: 'multi_user'
  },
  _internal: {
    validateInteractionType(type: string): type is InteractionType {
      return type in Values.InteractionTypes;
    },
    validateNotificationType(type: string): type is NotificationType {
      return type in Values.NotificationTypes;
    }
  }
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
