import { Router, Request, Response } from 'express';
const router = Router();

function validateArtistRequest(req: Request, res: Response): { access_token: string; artistId: string } | null {
    const access_token = req.cookies['access_token'];
    const artistId = req.query.id as string;
    if (!access_token) {
        res.status(401).json({ error: 'Access token not found in cookies' });
        return null;
    }
    if (!artistId) {
        res.status(400).json({ error: 'Missing artistId in query' });
        return null;
    }
    return { access_token, artistId };
}

async function fetchSpotify(endpoint: string, access_token: string, res: Response) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from Spotify' });
    }
}

// Get artist's albums
router.get('/artistsalbums', (req: Request, res: Response) => {
    const validated = validateArtistRequest(req, res);
    if (!validated) return;
    const { access_token, artistId } = validated;
    const params = new URLSearchParams();
    if (typeof req.query.include_groups === 'string') params.set('include_groups', req.query.include_groups);
    if (typeof req.query.market === 'string') params.set('market', req.query.market);
    if (typeof req.query.limit === 'string') params.set('limit', req.query.limit);
    if (typeof req.query.offset === 'string') params.set('offset', req.query.offset);
    const endpoint = `https://api.spotify.com/v1/artists/${artistId}/albums?${params.toString()}`;
    fetchSpotify(endpoint, access_token, res);
});

// Get artist's top tracks
router.get('/artisttoptracks', (req: Request, res: Response) => {
    const validated = validateArtistRequest(req, res);
    if (!validated) return;
    const { access_token, artistId } = validated;
    const params = new URLSearchParams();
    if (typeof req.query.market === 'string') params.set('market', req.query.market);
    const endpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?${params.toString()}`;
    fetchSpotify(endpoint, access_token, res);
});

// Get user's playlists
router.get('/userallplaylists', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    const params = new URLSearchParams({ limit: '50', offset: '0' });
    const endpoint = `https://api.spotify.com/v1/me/playlists?${params.toString()}`;
    fetchSpotify(endpoint, access_token, res);
});

// Get album's tracks
router.get('/albumtracks', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const albumId = req.query.id as string;
    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    if (!albumId) {
        return res.status(400).json({ error: 'Missing album id in query' });
    }
    const params = new URLSearchParams();
    if (typeof req.query.market === 'string') params.set('market', req.query.market);
    if (typeof req.query.limit === 'string') params.set('limit', req.query.limit);
    if (typeof req.query.offset === 'string') params.set('offset', req.query.offset);
    const endpoint = `https://api.spotify.com/v1/albums/${albumId}/tracks?${params.toString()}`;
    fetchSpotify(endpoint, access_token, res);
});

export default router;
