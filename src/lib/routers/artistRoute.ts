import { Router, Request, Response } from 'express';
import querystring from 'querystring';

const router = Router();

router.get('/topartists', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const time_range = (typeof req.query.time_range === 'string' ? req.query.time_range : undefined) || 'medium_term';
    const limit = Number(req.query.limit) || 50;

    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }

    const queryParams = querystring.stringify({
        time_range,
        limit,
        offset: 0
    });

    fetch(`https://api.spotify.com/v1/me/top/artists?${queryParams}`, {
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            res.json(data)
        })

        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch top artists' });
        });
});

export default router;
