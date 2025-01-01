import type { ProfileData } from '../../types/profile.js';

export const mockProfiles = {
  normalUser: {
    username: 'normaluser',
    displayName: 'Normal User',
    profileImageUrl: 'https://example.com/normal.jpg',
    followersCount: 500,
    followingCount: 300,
    isVerified: false,
    notificationType: 'user_interaction',
    interactionType: 'like',
    interactionTimestamp: Date.now(),
    botProbability: 0.1
  } satisfies ProfileData,

  botUser: {
    username: 'bot123456789',
    displayName: 'Spam Bot 123',
    profileImageUrl: 'https://example.com/bot.jpg',
    followersCount: 5,
    followingCount: 1000,
    isVerified: false,
    notificationType: 'user_interaction',
    interactionType: 'follow',
    interactionTimestamp: Date.now(),
    botProbability: 0.8
  } satisfies ProfileData,

  verifiedUser: {
    username: 'verified',
    displayName: 'Verified Account',
    profileImageUrl: 'https://example.com/verified.jpg',
    followersCount: 10000,
    followingCount: 1000,
    isVerified: true,
    notificationType: 'user_interaction',
    interactionType: 'mention',
    interactionTimestamp: Date.now(),
    botProbability: 0.0
  } satisfies ProfileData
} as const; 