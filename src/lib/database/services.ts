import pool from './database';

export interface User {
  id: number;
  username: string;
  image?: string;
  last_login?: Date;
}

export interface GameResult {
  id: number;
  room_code: string;
  player1_id: number;
  player2_id: number;
  player1_score: number;
  player2_score: number;
  winner_id: number;
  created_at: Date;
}

export interface TopArtist {
  user_id: number;
  artist_name: string;
  rank: number;
  time_range: '1month' | '6months' | '1year';
}

// User operations
export const createOrUpdateUser = async (spotifyId: string, displayName: string, imageUrl?: string): Promise<User> => {
  const query = `
    INSERT INTO users (username, image, last_login) 
    VALUES ($1, $2, NOW()) 
    ON CONFLICT (username) 
    DO UPDATE SET 
      image = EXCLUDED.image,
      last_login = NOW()
    RETURNING *
  `;
  
  const result = await pool.query(query, [displayName, imageUrl]);
  return result.rows[0];
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await pool.query(query, [username]);
  return result.rows[0] || null;
};

// Top artists operations
export const saveTopArtists = async (userId: number, artists: string[], timeRange: '1month' | '6months' | '1year'): Promise<void> => {
  const tableName = `user_top_artists_${timeRange === '1month' ? '1month' : timeRange === '6months' ? '6months' : '1year'}`;
  
  // Clear existing data for this user and time range
  await pool.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [userId]);
  
  // Insert new data
  for (let i = 0; i < artists.length; i++) {
    await pool.query(
      `INSERT INTO ${tableName} (user_id, artist_name, rank) VALUES ($1, $2, $3)`,
      [userId, artists[i], i + 1]
    );
  }
};

export const getTopArtists = async (userId: number, timeRange: '1month' | '6months' | '1year'): Promise<string[]> => {
  const tableName = `user_top_artists_${timeRange === '1month' ? '1month' : timeRange === '6months' ? '6months' : '1year'}`;
  const query = `SELECT artist_name FROM ${tableName} WHERE user_id = $1 ORDER BY rank`;
  const result = await pool.query(query, [userId]);
  return result.rows.map(row => row.artist_name);
};

// Game results operations
export const saveGameResult = async (roomCode: string, player1Id: number, player2Id: number, player1Score: number, player2Score: number): Promise<GameResult> => {
  const winnerId = player1Score > player2Score ? player1Id : player2Id;
  
  const query = `
    INSERT INTO game_results (room_code, player1_id, player2_id, player1_score, player2_score, winner_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
  
  const result = await pool.query(query, [roomCode, player1Id, player2Id, player1Score, player2Score, winnerId]);
  return result.rows[0];
};

export const getGameHistory = async (userId: number, limit: number = 10): Promise<GameResult[]> => {
  const query = `
    SELECT * FROM game_results 
    WHERE player1_id = $1 OR player2_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2
  `;
  
  const result = await pool.query(query, [userId, limit]);
  return result.rows;
};

// Friends operations
export const addFriend = async (userId: number, friendId: number): Promise<void> => {
  const query = 'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
  await pool.query(query, [userId, friendId]);
};

export const getFriends = async (userId: number): Promise<User[]> => {
  const query = `
    SELECT u.* FROM users u
    JOIN friends f ON u.id = f.friend_id
    WHERE f.user_id = $1
  `;
  
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const removeFriend = async (userId: number, friendId: number): Promise<void> => {
  const query = 'DELETE FROM friends WHERE user_id = $1 AND friend_id = $2';
  await pool.query(query, [userId, friendId]);
};
