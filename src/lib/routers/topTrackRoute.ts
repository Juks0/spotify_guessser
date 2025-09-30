import { Router, Request, Response } from 'express';
import querystring from 'querystring';
import { createOrUpdateUser, saveTopTracks } from '../database/services.ts';

const router = Router();

router.get('/toptracks', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const refresh_token = req.cookies['refresh_token'];
    const time_range = (typeof req.query.time_range === 'string' ? req.query.time_range : undefined) || 'medium_term';
    const limit = Number(req.query.limit) || 50;

    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }

    try {
        // Construct Spotify Top Tracks API URL with query parameters
        const queryParams = querystring.stringify({
            time_range,
            limit,
            offset: 0,
        });

        const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?${queryParams}`;

        const response = await fetch(topTracksUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 403) {
                return res.status(403).json({
                    error: 'Insufficient permissions. Check your Spotify app scopes include user-top-read.',
                });
            }
            if (response.status === 401) {
                return res.status(401).json({
                    error: 'Access token expired or invalid. Please re-authenticate.',
                });
            }
            throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Spotify top tracks data:', data);

        try {
            // Fetch user profile
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                const displayName = userData.display_name || userData.id;
                const imageUrl = userData.images && userData.images.length > 0 ? userData.images[0].url : undefined;

                try {
                    // Save or update user in DB
                    const dbUser = await createOrUpdateUser(
                        userData.id,
                        displayName,
                        userData.email,
                        imageUrl,
                        userData.country,
                        userData.product,
                        refresh_token
                    );

                    if (data.items && Array.isArray(data.items)) {
                        const dbTimeRange =
                            time_range === 'short_term' ? '1month' : time_range === 'medium_term' ? '6months' : '1year';
                        await saveTopTracks(dbUser.id, data.items, dbTimeRange);
                        console.log(`✅ Saved ${data.items.length} top tracks for user ${dbUser.id} (${dbTimeRange})`);
                    }
                } catch (dbError) {
                    console.error('❌ Database error while saving user/tracks:', dbError);
                }
            } else {
                console.warn('⚠️ Failed to fetch user data from Spotify:', userResponse.status);
            }
        } catch (userError) {
            console.error('❌ Error fetching user data:', userError);
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching top tracks:', error);
        res.status(500).json({
            error: 'Failed to fetch top tracks',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;
