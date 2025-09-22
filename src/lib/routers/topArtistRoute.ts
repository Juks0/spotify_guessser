import { Router, Request, Response } from 'express';
import querystring from 'querystring';
import { createOrUpdateUser, saveTopArtists } from '../database/services.js';

const router = Router();

router.get('/topartists', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const time_range = (typeof req.query.time_range === 'string' ? req.query.time_range : undefined) || 'medium_term';
    const limit = Number(req.query.limit) || 50;

    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }

    try {
        const queryParams = querystring.stringify({
            time_range,
            limit,
            offset: 0
        });

        const response = await fetch(`https://api.spotify.com/v1/me/top/artists?${queryParams}`, {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Spotify top artists data:', data);

        // Get user info to store top artists
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        
        if (userResponse.ok) {
            const userData = await userResponse.json();
            const displayName = userData.display_name || userData.id;
            const imageUrl = userData.images && userData.images[0] ? userData.images[0].url : undefined;
            
            // Create/update user in database
            const dbUser = await createOrUpdateUser(userData.id, displayName, imageUrl);
            
            // Store top artists in database
            if (data.items && Array.isArray(data.items)) {
                const artistNames = data.items.map((artist: any) => artist.name);
                const dbTimeRange = time_range === 'short_term' ? '1month' : 
                                  time_range === 'medium_term' ? '6months' : '1year';
                
                await saveTopArtists(dbUser.id, artistNames, dbTimeRange);
                console.log(`Saved ${artistNames.length} top artists for user ${dbUser.id} (${dbTimeRange})`);
            }
        }

        res.json(data);

    } catch (error) {
        console.error('Error fetching top artists:', error);
        res.status(500).json({ error: 'Failed to fetch top artists' });
    }
});

export default router;
