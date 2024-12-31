export interface ProfileData {
  username: string;
  displayName: string;
  profileImageUrl: string;
  followersCount: number;
  followingCount: number;
  interactionTimestamp: number;
  interactionType: 'like' | 'reply' | 'repost' | 'follow';
}

export interface BotAnalysis {
  probability: number;
  reasons: string[];
}
