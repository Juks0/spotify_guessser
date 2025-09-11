import { Router, Request, Response } from "express";

const router = Router();


router.get('/trackdetails', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const trackId = req.query.id as string;
    console.log('Received request for track ID:', trackId);

    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    if (!trackId) {
        return res.status(400).json({ error: 'Missing trackId in query' });
    }

    fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched track details:', data);
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Failed to fetch track details' });
        });
});

export default router;
