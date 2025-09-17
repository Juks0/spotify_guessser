import { Router, Request, Response } from 'express';
import { createOrUpdateUser, getUserByUsername } from '../database/services';

const router = Router();

router.get('/me', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        
        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }
        
        const spotifyData = await response.json();
        console.log('Spotify user data:', spotifyData);
        
        // Store/update user in database
        const displayName = spotifyData.display_name || spotifyData.id;
        const imageUrl = spotifyData.images && spotifyData.images[0] ? spotifyData.images[0].url : undefined;
        
        const dbUser = await createOrUpdateUser(spotifyData.id, displayName, imageUrl);
        console.log('Database user:', dbUser);
        
        // Return combined data
        res.json({
            ...spotifyData,
            db_user_id: dbUser.id,
            db_username: dbUser.username
        });
        
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

export default router;
