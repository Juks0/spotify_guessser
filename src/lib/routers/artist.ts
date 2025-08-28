import { Router, Request, Response } from 'express';
import querystring from "querystring";

const router = Router();

router.get('/topartists', (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }
    fetch('https://api.spotify.com/v1/me/top/artists?'+
        querystring.stringify({
        time_range,
        limit: 50,
        offset: 0
        }
})
        , {
        headers: {
            'Authorization': 'Bearer ' + access_token,

        }
}).then()

    ;

export default router;
