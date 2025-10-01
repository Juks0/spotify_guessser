import { Router, Request, Response } from 'express';
import { createOrUpdateUser, getUserByUsername } from '../database/services.ts';

const router = Router();

router.get('/me', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const refresh_token = req.cookies['refresh_token'];
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

        const displayName = spotifyData.display_name || spotifyData.id;
        const imageUrl = spotifyData.images?.[0]?.url;

        const dbUser = await createOrUpdateUser(
            spotifyData.id,
            displayName,
            spotifyData.email,
            imageUrl,
            spotifyData.country,
            spotifyData.product,
            refresh_token
        );

        console.log('Database user created/updated:', dbUser);

        res.json({
            ...spotifyData,
            db_user_id: dbUser.id,
            db_username: dbUser.username
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        if (err instanceof Error) {
            res.status(500).json({
                error: 'Failed to fetch user profile',
                details: err.message
            });
        } else {
            res.status(500).json({ error: 'Failed to fetch user profile' });
        }
    }
});

export default router;
