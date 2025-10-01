import { Router, Request, Response } from 'express';
import querystring from 'querystring';

const router = Router();

router.get('/playback', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const market = req.query.market as string;
    const additional_types = req.query.additional_types as string;

    if (!access_token) {
        return res.status(401).json({ error: 'Access token not found in cookies' });
    }

    try {
        const queryParams = querystring.stringify({
            ...(market && { market }),
            ...(additional_types && { additional_types })
        });
        const url = `https://api.spotify.com/v1/me/player?${queryParams}`;
        const response = await fetch(url, {
            headers: { 'Authorization': 'Bearer ' + access_token }
        });
        if (response.status === 204) {
            return res.status(204).json({ message: 'No active playback' });
        }
        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching playback state:', error);
        res.status(500).json({ error: 'Failed to fetch playback state' });
    }
});

router.get('/devices', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });
    try {
        const url = 'https://api.spotify.com/v1/me/player/devices';
        const response = await fetch(url, { headers: { Authorization: 'Bearer ' + access_token } });
        if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
});

router.put('/playback/play', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    try {
        const queryParams = querystring.stringify({ ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/play?${queryParams}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        if (response.status === 204) return res.status(204).json({ message: 'Playback started' });
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Spotify API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    } catch (error) {
        console.error('Error starting playback:', error);
        res.status(500).json({ error: 'Failed to start playback' });
    }
});

router.put('/playback/pause', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    try {
        const queryParams = querystring.stringify({ ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/pause?${queryParams}`;
        const response = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + access_token } });
        if (response.status === 204) return res.status(204).json({ message: 'Playback paused' });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error pausing playback:', error);
        res.status(500).json({ error: 'Failed to pause playback' });
    }
});

router.post('/playback/next', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    try {
        const queryParams = querystring.stringify({ ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/next?${queryParams}`;
        const response = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + access_token } });
        if (response.status === 204) return res.status(204).json({ message: 'Skipped to next track' });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error skipping to next:', error);
        res.status(500).json({ error: 'Failed to skip to next track' });
    }
});

router.post('/playback/previous', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    try {
        const queryParams = querystring.stringify({ ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/previous?${queryParams}`;
        const response = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + access_token } });
        if (response.status === 204) return res.status(204).json({ message: 'Skipped to previous track' });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error skipping to previous:', error);
        res.status(500).json({ error: 'Failed to skip to previous track' });
    }
});

router.put('/playback/seek', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const position_ms = req.query.position_ms as string;
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    const position = Number(position_ms);
    if (!position_ms || isNaN(position) || position < 0) {
        return res.status(400).json({ error: 'Invalid position_ms parameter' });
    }

    try {
        const queryParams = querystring.stringify({ position_ms, ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/seek?${queryParams}`;
        const response = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + access_token } });

        if (response.status === 204) return res.status(204).json({ message: 'Seeked to position' });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error seeking:', error);
        res.status(500).json({ error: 'Failed to seek to position' });
    }
});

router.put('/playback/repeat', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const state = req.query.state as string;
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    if (!['track', 'context', 'off'].includes(state)) {
        return res.status(400).json({ error: 'Invalid state parameter. Must be: track, context, or off' });
    }

    try {
        const queryParams = querystring.stringify({ state, ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/repeat?${queryParams}`;
        const response = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + access_token } });

        if (response.status === 204) return res.status(204).json({ message: `Repeat mode set to ${state}` });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error setting repeat mode:', error);
        res.status(500).json({ error: 'Failed to set repeat mode' });
    }
});

router.put('/playback/shuffle', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const state = req.query.state as string;
    const device_id = req.query.device_id as string;

    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    if (!['true', 'false'].includes(state)) {
        return res.status(400).json({ error: 'Invalid state parameter. Must be: true or false' });
    }

    try {
        const queryParams = querystring.stringify({ state, ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/shuffle?${queryParams}`;
        const response = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + access_token } });

        if (response.status === 204) return res.status(204).json({ message: `Shuffle ${state === 'true' ? 'enabled' : 'disabled'}` });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error toggling shuffle:', error);
        res.status(500).json({ error: 'Failed to toggle shuffle' });
    }
});

router.put('/playback/volume', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const volume_percent = req.query.volume_percent as string;
    const device_id = req.query.device_id as string;
    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    const volume = Number(volume_percent);
    if (isNaN(volume) || volume < 0 || volume > 100) {
        return res.status(400).json({ error: 'Invalid volume_percent parameter. Must be between 0 and 100' });
    }

    try {
        const queryParams = querystring.stringify({ volume_percent, ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/volume?${queryParams}`;
        const response = await fetch(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + access_token } });

        if (response.status === 204) return res.status(204).json({ message: `Volume set to ${volume}%` });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error setting volume:', error);
        res.status(500).json({ error: 'Failed to set volume' });
    }
});

router.post('/playback/queue', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const uri = req.query.uri as string;
    const device_id = req.query.device_id as string;

    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });
    if (!uri) return res.status(400).json({ error: 'uri parameter is required' });

    try {
        const queryParams = querystring.stringify({ uri, ...(device_id && { device_id }) });
        const url = `https://api.spotify.com/v1/me/player/queue?${queryParams}`;
        const response = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + access_token } });

        if (response.status === 204) return res.status(204).json({ message: 'Added to queue' });
        throw new Error(`Spotify API error: ${response.status}`);
    } catch (error) {
        console.error('Error adding to queue:', error);
        res.status(500).json({ error: 'Failed to add to queue' });
    }
});

router.get('/playback/queue', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];

    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    try {
        const url = 'https://api.spotify.com/v1/me/player/queue';
        const response = await fetch(url, { headers: { Authorization: 'Bearer ' + access_token } });

        if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching queue:', error);
        res.status(500).json({ error: 'Failed to fetch queue' });
    }
});

router.get('/recently-played', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const after = req.query.after as string;
    const before = req.query.before as string;

    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });

    try {
        const queryParams = querystring.stringify({
            limit,
            ...(after && { after }),
            ...(before && { before })
        });
        const url = `https://api.spotify.com/v1/me/player/recently-played?${queryParams}`;
        const response = await fetch(url, { headers: { Authorization: 'Bearer ' + access_token } });
        if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching recently played:', error);
        res.status(500).json({ error: 'Failed to fetch recently played tracks' });
    }
});

router.get('/search', async (req: Request, res: Response) => {
    const access_token = req.cookies['access_token'];
    const q = req.query.q as string;
    const type = (req.query.type as string) || 'track';
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    if (!access_token) return res.status(401).json({ error: 'Access token not found in cookies' });
    if (!q) return res.status(400).json({ error: 'q parameter is required' });

    try {
        const queryParams = querystring.stringify({
            q,
            type,
            limit
        });
        const url = `https://api.spotify.com/v1/search?${queryParams}`;
        const response = await fetch(url, { headers: { Authorization: 'Bearer ' + access_token } });
        if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Failed to search tracks' });
    }
});

export default router;
