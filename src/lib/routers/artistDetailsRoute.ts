import { Router, Request, Response } from "express";

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

function fetchSpotify(endpoint: string, access_token: string, res: Response) {
    fetch(endpoint, {
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Spotify API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Failed to fetch data from Spotify' });
        });
}

router.get('/artistdetails', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated) return;
    const { artistId, access_token } = validated;
    const endpoint = `https://api.spotify.com/v1/artists/${artistId}`;
    fetchSpotify(endpoint, access_token, res);
});

router.get('/artisttopsongs', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated) return;
    const { artistId, access_token } = validated;
    const market = typeof req.query.market === 'string' ? req.query.market : 'US';  // default market
    const endpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`;
    fetchSpotify(endpoint, access_token, res);
});

export default router;
