import { Router, Request, Response } from 'express';

const router = Router();

router.get('/me', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch user profile' });
        });
});

export default router;
