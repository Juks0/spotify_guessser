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

router.get('/artistdetails', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated) return;

    fetchSpotify(`https://api.spotify.com/v1/artists/${validated.artistId}`, validated.access_token, res);
});

router.get('/artisttopsongs', (req: Request, res: Response) => {
    console.log('Received request for artist ID:', req.query.id);
    const validated = validateArtistRequest(req, res);
    if (!validated) return;

    fetchSpotify(`https://api.spotify.com/v1/artists/${validated.artistId}/top-tracks`, validated.access_token, res);
});

export default router;
