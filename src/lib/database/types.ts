export interface User {
  id: string;
  username: string;
  display_name?: string;
  email?: string;
  image?: string;
  country?: string;
  product?: 'free' | 'premium';
  pd?: string;
  refresh_token?: string;
  last_login?: Date;
  created_at?: Date;
}
export interface TopArtist {
  user_id: string;
  artist_id: string;
  artist_name: string;
  artist_image?: string;
  genres?: string[];
  rank: number;
  time_range: '1month' | '6months' | '1year'; 
  created_at?: Date;
}
export interface TopTrack {
  user_id: string;
  track_id: string;
  track_name: string;
  artist_name: string;
  album_name?: string;
  duration_ms?: number;
  preview_url?: string;
  track_image?: string;
  rank: number;
  time_range: '1month' | '6months' | '1year'; 
  created_at?: Date;
}
export interface Friendship {
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at?: Date;
}
export type TimeRange = '1month' | '6months' | '1year';
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';
