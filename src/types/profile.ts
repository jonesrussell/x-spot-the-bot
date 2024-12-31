export interface Profile {
  username: string;
  displayName: string;
  followersCount: number;
  followingCount: number;
}

export interface ProfileData extends Profile {
  profileImageUrl: string;
  interactionTimestamp: number;
  interactionType: 'like' | 'reply' | 'repost' | 'follow';
}

export interface BotAnalysis {
  probability: number;
  reasons: string[];
}
