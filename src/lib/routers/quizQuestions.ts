import { Router, Request, Response } from 'express';
import querystring from "querystring";
const router = Router();
function validateArtistRequest(req: Request, res: Response): { access_token: string; artistId: string } | null {
    const access_token = req.cookies['access_token'];
    const artistId = req.query.id as string;
    if (!access_token) {
        res.status(401).json({ error: 'Access token not found in cookies' });
        return null;
    }
    if (!artistId) {
        res.status(400).json({ error: 'Missing trackId in query' });
        return null;
    }
    return { access_token, artistId };
}
function fetchSpotify(endpoint: string, access_token: string, res: Response) {
    fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    })
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Failed to fetch track details' });
        });
}
router.get('/airstsalbums', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated)
        return;
    const include_groups = typeof req.query.include_groups === 'string' ? req.query.include_groups : undefined;
    const market = typeof req.query.market === 'string' ? req.query.market : undefined;
    const limit = typeof req.query.limit === 'string' ? req.query.limit : undefined;
    const offset = typeof req.query.offset === 'string' ? req.query.offset : undefined;
    const params = new URLSearchParams();
    if (include_groups) params.set('include_groups', include_groups);
    if (market) params.set('market', market);
    if (limit) params.set('limit', limit);
    if (offset) params.set('offset', offset);
    fetchSpotify(`https:
        validated.access_token, res);
});
router.get('/artistsalbums', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated)
        return;
    const include_groups = typeof req.query.include_groups === 'string' ? req.query.include_groups : undefined;
    const market = typeof req.query.market === 'string' ? req.query.market : undefined;
    const limit = typeof req.query.limit === 'string' ? req.query.limit : undefined;
    const offset = typeof req.query.offset === 'string' ? req.query.offset : undefined;
    const params = new URLSearchParams();
    if (include_groups) params.set('include_groups', include_groups);
    if (market) params.set('market', market);
    if (limit) params.set('limit', limit);
    if (offset) params.set('offset', offset);
    fetchSpotify(`https:
        validated.access_token, res);
});
router.get('/artisttoptracks', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated)
        return;
    const market = typeof req.query.market === 'string' ? req.query.market : undefined;
    const params = new URLSearchParams();
    if (market) params.set('market', market);
    fetchSpotify(`https:
        validated.access_token, res);
});
router.get('/userallplaylists', (req: Request, res: Response) => {
    console.log('Received request for user playlists');
    const queryParams = querystring.stringify({
        limit: 50,
        offset: 0
    });
    const validated = validateArtistRequest(req, res);
    if (!validated)
        return;
    fetchSpotify(`https:
});
router.get('/albumtracks', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const albumId = req.query.id as string;
    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    if (!albumId) {
        return res.status(400).json({ error: 'Missing album id in query' });
    }
    const market = typeof req.query.market === 'string' ? req.query.market : undefined;
    const limit = typeof req.query.limit === 'string' ? req.query.limit : '50';
    const offset = typeof req.query.offset === 'string' ? req.query.offset : '0';
    const params = new URLSearchParams();
    if (market) params.set('market', market);
    if (limit) params.set('limit', limit);
    if (offset) params.set('offset', offset);
    fetchSpotify(`https:
        access_token, res);
});
export default router;