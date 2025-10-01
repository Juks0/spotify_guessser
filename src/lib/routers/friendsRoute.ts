import { Router, Request, Response } from 'express';
import { getFriends, removeFriend, addFriend, getUserByUsername } from '../database/services.ts';

const router = Router();

router.get('/friends', async (req: Request, res: Response) => {
  const access_token = req.cookies['access_token'];
  if (!access_token) {
    return res.status(401).json({ error: 'Access token not found in cookies' });
  }
  try {
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + access_token },
    });
    if (!userResponse.ok) {
      throw new Error(`Spotify API error: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    const friends = await getFriends(userData.id);
    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

router.post('/friends', async (req: Request, res: Response) => {
  const access_token = req.cookies['access_token'];
  const { username } = req.body;
  if (!access_token) {
    return res.status(401).json({ error: 'Access token not found in cookies' });
  }
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  try {
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + access_token },
    });
    if (!userResponse.ok) {
      throw new Error(`Spotify API error: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    const friend = await getUserByUsername(username);
    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (friend.id === userData.id) {
      return res.status(400).json({ error: 'Cannot add yourself as a friend' });
    }
    await addFriend(userData.id, friend.id);
    res.json({ message: 'Friend added successfully', friend });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

router.delete('/friends/:friendId', async (req: Request, res: Response) => {
  const access_token = req.cookies['access_token'];
  const friendId = req.params.friendId;
  if (!access_token) {
    return res.status(401).json({ error: 'Access token not found in cookies' });
  }
  if (!friendId) {
    return res.status(400).json({ error: 'Friend ID is required' });
  }
  try {
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: 'Bearer ' + access_token },
    });
    if (!userResponse.ok) {
      throw new Error(`Spotify API error: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    await removeFriend(userData.id, friendId);
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

export default router;
