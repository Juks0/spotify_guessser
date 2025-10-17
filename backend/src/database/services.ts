// src/lib/database/services.ts

import { supabaseAdmin } from './supabase';
import type { 
  User, 
  TopArtist, 
  TopTrack, 
  Friendship, 
  TimeRange, 
  FriendshipStatus 
} from './types';

// ===== EXTENDED INTERFACES =====

export interface UserWithMusicData {
  id: string;
  username: string;
  display_name?: string;
  email?: string;
  image?: string;
  country?: string;
  product?: 'free' | 'premium';
  last_login?: Date;
  created_at?: Date;
  topArtists: {
    '1month': TopArtist[];
    '6months': TopArtist[];
    '1year': TopArtist[];
  };
  topTracks: {
    '1month': TopTrack[];
    '6months': TopTrack[];
    '1year': TopTrack[];
  };
  musicStats?: {
    totalArtists: number;
    totalTracks: number;
    favoriteGenre?: string;
    mostPlayedArtist?: string;
  };
}

export interface MusicCompatibility {
  userId1: string;
  userId2: string;
  sharedArtists: TopArtist[];
  sharedTracks: TopTrack[];
  compatibilityScore: number; // 0-100%
  topCommonGenres?: string[];
}

export interface UserStats {
  user: User;
  totalArtists: number;
  totalTracks: number;
  totalGames: number;
  totalFriends: number;
}

// ===== BASIC USER OPERATIONS =====
export const createOrUpdateUser = async (
  spotifyId: string, 
  displayName: string, 
  email?: string,
  imageUrl?: string,
  country?: string,
  product?: 'free' | 'premium',
  refreshToken?: string,
  pd?: string
): Promise<User> => {
  const userData: Partial<User> = {
    id: spotifyId,
    username: displayName,
    display_name: displayName,
    email,
    image: imageUrl,
    country,
    product,
    pd,
    refresh_token: refreshToken,
    last_login: new Date(),
    created_at: new Date()
  };

  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert(userData, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw new Error(`Failed to save user: ${error.message}`);
  return data;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user: ${error.message}`);
  }
  
  return data || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user: ${error.message}`);
  }
  
  return data || null;
};

// ===== TOKEN REFRESH OPERATIONS =====
export const refreshAccessToken = async (userId: string): Promise<{access_token: string, refresh_token: string} | null> => {
  try {
    // Get user's refresh token from database
    const user = await getUserById(userId);
    if (!user?.refresh_token) {
      throw new Error('No refresh token found for user');
    }

    // Get client credentials from environment
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Spotify client credentials not configured');
    }

    // Request new access token from Spotify
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: user.refresh_token
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
    }

    const tokenData = await response.json() as {access_token: string, refresh_token: string};
    
    // Update user's refresh token in database
    await supabaseAdmin
      .from('users')
      .update({ refresh_token: tokenData.refresh_token })
      .eq('id', userId);

    return {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};

export const updateUserRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('users')
    .update({ refresh_token: refreshToken })
    .eq('id', userId);

  if (error) throw new Error(`Failed to update refresh token: ${error.message}`);
};

// ===== TOP TRACKS OPERATIONS =====
export const saveTopTracks = async (
  userId: string, 
  tracks: {
    id: string;
    name: string;
    artists: {name: string}[];
    album?: {name: string, images?: {url: string}[]};
    duration_ms?: number;
    preview_url?: string;
  }[], 
  timeRange: TimeRange
): Promise<void> => {
  // Clear existing data for this user and time range
  await supabaseAdmin
    .from('user_top_tracks')
    .delete()
    .eq('user_id', userId)
    .eq('time_range', timeRange);

  // Prepare new data with all fields
  const trackData: Partial<TopTrack>[] = tracks.map((track, index) => ({
    user_id: userId,
    track_id: track.id,
    track_name: track.name,
    artist_name: track.artists?.[0]?.name || 'Unknown Artist',
    album_name: track.album?.name,
    duration_ms: track.duration_ms,
    preview_url: track.preview_url,
    track_image: track.album?.images?.[0]?.url,
    rank: index + 1,
    time_range: timeRange,
    created_at: new Date()
  }));

  if (trackData.length > 0) {
    const { error } = await supabaseAdmin
      .from('user_top_tracks')
      .insert(trackData);

    if (error) throw new Error(`Failed to save tracks: ${error.message}`);
  }
};

export const getTopTracks = async (userId: string, timeRange: TimeRange): Promise<TopTrack[]> => {
  const { data, error } = await supabaseAdmin
    .from('user_top_tracks')
    .select('*')
    .eq('user_id', userId)
    .eq('time_range', timeRange)
    .order('rank');

  if (error) throw new Error(`Failed to get top tracks: ${error.message}`);
  return data || [];
};

export const getAllTopTracks = async (userId: string): Promise<{[key: string]: TopTrack[]}> => {
  const { data, error } = await supabaseAdmin
    .from('user_top_tracks')
    .select('*')
    .eq('user_id', userId)
    .order('time_range')
    .order('rank');

  if (error) throw new Error(`Failed to get all top tracks: ${error.message}`);

  const grouped: {[key: string]: TopTrack[]} = {
    '1month': [],
    '6months': [],
    '1year': []
  };

  (data || []).forEach(row => {
    grouped[row.time_range].push(row);
  });

  return grouped;
};

// ===== TOP ARTISTS OPERATIONS =====
export const saveTopArtists = async (
  userId: string, 
  artists: {
    id: string;
    name: string;
    genres?: string[];
    images?: {url: string}[];
  }[], 
  timeRange: TimeRange
): Promise<void> => {
  // Clear existing data for this user and time range
  await supabaseAdmin
    .from('user_top_artists')
    .delete()
    .eq('user_id', userId)
    .eq('time_range', timeRange);

  // Prepare new data with all fields
  const artistData: Partial<TopArtist>[] = artists.map((artist, index) => ({
    user_id: userId,
    artist_id: artist.id,
    artist_name: artist.name,
    artist_image: artist.images?.[0]?.url,
    genres: artist.genres || [],
    rank: index + 1,
    time_range: timeRange,
    created_at: new Date()
  }));

  if (artistData.length > 0) {
    const { error } = await supabaseAdmin
      .from('user_top_artists')
      .insert(artistData);

    if (error) throw new Error(`Failed to save artists: ${error.message}`);
  }
};

export const getTopArtists = async (userId: string, timeRange: TimeRange): Promise<TopArtist[]> => {
  const { data, error } = await supabaseAdmin
    .from('user_top_artists')
    .select('*')
    .eq('user_id', userId)
    .eq('time_range', timeRange)
    .order('rank');

  if (error) throw new Error(`Failed to get top artists: ${error.message}`);
  return data || [];
};

export const getAllTopArtists = async (userId: string): Promise<{[key: string]: TopArtist[]}> => {
  const { data, error } = await supabaseAdmin
    .from('user_top_artists')
    .select('*')
    .eq('user_id', userId)
    .order('time_range')
    .order('rank');

  if (error) throw new Error(`Failed to get all top artists: ${error.message}`);

  const grouped: {[key: string]: TopArtist[]} = {
    '1month': [],
    '6months': [],
    '1year': []
  };

  (data || []).forEach(row => {
    grouped[row.time_range].push(row);
  });

  return grouped;
};

// ===== ADVANCED USER PROFILE OPERATIONS =====
export const getUserWithMusicData = async (userId: string): Promise<UserWithMusicData | null> => {
  try {
    // Get basic user info
    const user = await getUserById(userId);
    if (!user) return null;

    // Get all top artists and tracks
    const [allTopArtists, allTopTracks] = await Promise.all([
      getAllTopArtists(userId),
      getAllTopTracks(userId)
    ]);

    // Calculate music stats
    const allUniqueArtists = new Set([
      ...allTopArtists['1month'].map(a => a.artist_id),
      ...allTopArtists['6months'].map(a => a.artist_id), 
      ...allTopArtists['1year'].map(a => a.artist_id)
    ]);

    const allUniqueTrackIds = new Set([
      ...allTopTracks['1month'].map(t => t.track_id),
      ...allTopTracks['6months'].map(t => t.track_id),
      ...allTopTracks['1year'].map(t => t.track_id)
    ]);

    // Get favorite genre from most frequent genres
    const allGenres = [
      ...allTopArtists['1month'].flatMap(a => a.genres || []),
      ...allTopArtists['6months'].flatMap(a => a.genres || []),
      ...allTopArtists['1year'].flatMap(a => a.genres || [])
    ];

    const genreCount = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteGenre = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    const musicStats = {
      totalArtists: allUniqueArtists.size,
      totalTracks: allUniqueTrackIds.size,
      favoriteGenre,
      mostPlayedArtist: allTopArtists['1month']?.[0]?.artist_name || undefined
    };

    return {
      ...user,
      topArtists: {
        '1month': allTopArtists['1month'] || [],
        '6months': allTopArtists['6months'] || [],
        '1year': allTopArtists['1year'] || []
      },
      topTracks: {
        '1month': allTopTracks['1month'] || [],
        '6months': allTopTracks['6months'] || [],
        '1year': allTopTracks['1year'] || []
      },
      musicStats
    };
  } catch (error) {
    console.error('Error getting user with music data:', error);
    return null;
  }
};
// ===== FRIENDSHIP OPERATIONS =====
export const addFriend = async (userId: string, friendId: string, status: FriendshipStatus = 'pending'): Promise<void> => {
  const friendshipData: Partial<Friendship> = {
    user_id: userId,
    friend_id: friendId,
    status,
    created_at: new Date()
  };

  const { error } = await supabaseAdmin
    .from('friends')
    .upsert(friendshipData, { onConflict: 'user_id,friend_id' });

  if (error) throw new Error(`Failed to add friend: ${error.message}`);
};

// ✅ REPLACE this function completely
export const getFriends = async (userId: string, status: FriendshipStatus = 'accepted'): Promise<User[]> => {
  // Step 1: Get friend IDs
  const { data: friendships, error: friendshipError } = await supabaseAdmin
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', status);

  if (friendshipError) {
    throw new Error(`Failed to get friendships: ${friendshipError.message}`);
  }

  if (!friendships || friendships.length === 0) {
    return [];
  }

  // Step 2: Get user details
  const friendIds = friendships.map(f => f.friend_id);
  
  const { data: users, error: userError } = await supabaseAdmin
    .from('users')
    .select('*')
    .in('id', friendIds)
    .order('last_login', { ascending: false, nullsFirst: false });

  if (userError) {
    throw new Error(`Failed to get friend users: ${userError.message}`);
  }
  
  return users || [];
};

// ✅ Remove the problematic version and keep only this one
export const getFriendsAlternative = async (userId: string, status: FriendshipStatus = 'accepted'): Promise<User[]> => {
  // First get friend IDs
  const { data: friendships, error: friendshipError } = await supabaseAdmin
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', status);

  if (friendshipError) throw new Error(`Failed to get friendships: ${friendshipError.message}`);

  if (!friendships || friendships.length === 0) {
    return [];
  }

  // Then get user details
  const friendIds = friendships.map(f => f.friend_id);
  
  const { data: users, error: userError } = await supabaseAdmin
    .from('users')
    .select('*')
    .in('id', friendIds)
    .order('last_login', { ascending: false, nullsFirst: false });

  if (userError) throw new Error(`Failed to get friend users: ${userError.message}`);
  
  return users || [];
};

export const updateFriendshipStatus = async (userId: string, friendId: string, status: FriendshipStatus): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('friends')
    .update({ status })
    .eq('user_id', userId)
    .eq('friend_id', friendId);

  if (error) throw new Error(`Failed to update friendship status: ${error.message}`);
};

export const removeFriend = async (userId: string, friendId: string): Promise<void> => {
  // Remove both directions of friendship
  const { error } = await supabaseAdmin
    .from('friends')
    .delete()
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

  if (error) throw new Error(`Failed to remove friend: ${error.message}`);
};

export const areFriends = async (userId1: string, userId2: string): Promise<boolean> => {
  const { data, error } = await supabaseAdmin
    .from('friends')
    .select('user_id')
    .eq('user_id', userId1)
    .eq('friend_id', userId2)
    .eq('status', 'accepted')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check friendship: ${error.message}`);
  }

  return !!data;
};

// ✅ Fixed mutual friends function
export const getMutualFriends = async (userId1: string, userId2: string): Promise<User[]> => {
  // Get friend IDs for both users
  const [friends1Result, friends2Result] = await Promise.all([
    supabaseAdmin
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId1)
      .eq('status', 'accepted'),
    supabaseAdmin
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId2)
      .eq('status', 'accepted')
  ]);

  if (friends1Result.error) throw new Error(`Failed to get user1 friends: ${friends1Result.error.message}`);
  if (friends2Result.error) throw new Error(`Failed to get user2 friends: ${friends2Result.error.message}`);

  // Find mutual friend IDs
  const friendIds1 = friends1Result.data?.map(f => f.friend_id) || [];
  const friendIds2 = friends2Result.data?.map(f => f.friend_id) || [];
  const mutualFriendIds = friendIds1.filter(id => friendIds2.includes(id));

  if (mutualFriendIds.length === 0) {
    return [];
  }

  // Get user details for mutual friends
  const { data: mutualFriends, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .in('id', mutualFriendIds)
    .order('username');

  if (error) throw new Error(`Failed to get mutual friends: ${error.message}`);
  
  return mutualFriends || [];
};

// ✅ Fixed friend suggestions
export const getFriendSuggestions = async (userId: string, limit: number = 10): Promise<User[]> => {
  // Get current friends
  const { data: currentFriends, error: friendsError } = await supabaseAdmin
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('status', 'accepted');

  if (friendsError) throw new Error(`Failed to get current friends: ${friendsError.message}`);

  const currentFriendIds = currentFriends?.map(f => f.friend_id) || [];

  if (currentFriendIds.length === 0) {
    // If no friends, suggest recently active users
    return await getRecentlyActiveUsers(limit, userId);
  }

  // Get friends of friends - Fixed the .in() syntax
  const { data: friendsOfFriends, error: fofError } = await supabaseAdmin
    .from('friends')
    .select('friend_id')
    .in('user_id', currentFriendIds)
    .eq('status', 'accepted')
    .not('friend_id', 'eq', userId); // Exclude self

  if (fofError) throw new Error(`Failed to get friends of friends: ${fofError.message}`);

  // Get unique suggestion IDs, excluding current friends
  const allSuggestionIds = friendsOfFriends?.map(f => f.friend_id) || [];
  const suggestionIds = [...new Set(allSuggestionIds)]
    .filter(id => !currentFriendIds.includes(id) && id !== userId);

  if (suggestionIds.length === 0) {
    return await getRecentlyActiveUsers(limit, userId);
  }

  // Get user details for suggestions
  const { data: suggestions, error: suggestionsError } = await supabaseAdmin
    .from('users')
    .select('*')
    .in('id', suggestionIds)
    .order('last_login', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (suggestionsError) throw new Error(`Failed to get friend suggestions: ${suggestionsError.message}`);

  return suggestions || [];
};

export const getRecentlyActiveUsers = async (limit: number = 10, excludeUserId?: string): Promise<User[]> => {
  let query = supabaseAdmin
    .from('users')
    .select('*')
    .not('last_login', 'is', null);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query
    .order('last_login', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to get recently active users: ${error.message}`);
  return data || [];
};


// ===== SEARCH AND STATS =====
export const searchUsers = async (searchTerm: string, limit: number = 10, excludeUserId?: string): Promise<User[]> => {
  let query = supabaseAdmin
    .from('users')
    .select('*')
    .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data, error } = await query
    .order('last_login', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(`Failed to search users: ${error.message}`);
  return data || [];
};

// ===== COMPARISON FUNCTIONS =====
export const compareMusicTaste = async (
  userId1: string, 
  userId2: string, 
  timeRange: TimeRange = '1month'
): Promise<MusicCompatibility | null> => {
  try {
    const [user1Artists, user2Artists, user1Tracks, user2Tracks] = await Promise.all([
      getTopArtists(userId1, timeRange),
      getTopArtists(userId2, timeRange),
      getTopTracks(userId1, timeRange),
      getTopTracks(userId2, timeRange)
    ]);

    // Find shared artists
    const sharedArtists = user1Artists.filter(artist1 => 
      user2Artists.some(artist2 => artist2.artist_id === artist1.artist_id)
    );

    // Find shared tracks
    const sharedTracks = user1Tracks.filter(track1 => 
      user2Tracks.some(track2 => track2.track_id === track1.track_id)
    );

    // Calculate compatibility score
    const totalUniqueArtists = new Set([
      ...user1Artists.map(a => a.artist_id),
      ...user2Artists.map(a => a.artist_id)
    ]).size;
    
    const compatibilityScore = totalUniqueArtists > 0 ? 
      Math.round((sharedArtists.length / totalUniqueArtists) * 100) : 0;

    // Find common genres
    const user1Genres = user1Artists.flatMap(a => a.genres || []);
    const user2Genres = user2Artists.flatMap(a => a.genres || []);
    const topCommonGenres = user1Genres.filter(genre => user2Genres.includes(genre));

    return {
      userId1,
      userId2,
      sharedArtists,
      sharedTracks,
      compatibilityScore,
      topCommonGenres: [...new Set(topCommonGenres)].slice(0, 5)
    };
  } catch (error) {
    console.error('Error comparing music taste:', error);
    return null;
  }
};
