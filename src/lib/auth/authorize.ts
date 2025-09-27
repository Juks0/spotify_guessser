import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import request from 'request';
import crypto from 'crypto';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import * as fs from "node:fs";
import * as https from "node:https";
import userRoute from "@/lib/routers/userRoute.ts";
import artistRoute from "@/lib/routers/topArtistRoute.ts";
import trackRoute from "@/lib/routers/topTrackRoute.ts";
import trackDetailRoute from "@/lib/routers/trackDetailRoute.ts";
import artistDetailsRoute from "@/lib/routers/artistDetailsRoute.ts";
import quizQuestions from "@/lib/routers/quizQuestions.ts";
import playbackRoute from "@/lib/routers/playbackRoute.ts";
import friendsRoute from "@/lib/routers/friendsRoute.ts";
import tokenRoute from "@/lib/routers/tokenRoute.ts";
const client_id = '560440ae985b45a8b13e61974617bd05';
const client_secret = '7f262b78be8148c194110fad34f96616';
const backendApiUrl = process.env.VITE_BACKEND_URL;
const frontend_uri = process.env.VITE_FRONTEND_URL;
const redirect_uri = backendApiUrl+'/callback';
const stateKey = 'spotify_auth_state';
const generateRandomString = (length: number): string =>
    crypto.randomBytes(60).toString('hex').slice(0, length);
const app = express();
const __dirname = import.meta.dirname;
app.use(express.static(__dirname + '/public'))
    .use(cors({
        origin: frontend_uri,
        credentials: true
    }))
    .use(cookieParser())
    .use(express.json()); 
app.get('/login', (_req: Request, res: Response) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    console.log('🔍 DEBUG INFO:');
    console.log('Client ID:', client_id);
    console.log('Backend URL:', backendApiUrl);  
    console.log('Frontend URL:', frontend_uri);
    console.log('Redirect URI:', redirect_uri);
    console.log('Full redirect URL will be:', redirect_uri);
    const scope = [
        'user-read-private',
        'user-read-email', 
        'user-top-read',
        'user-read-recently-played',
        'user-read-playback-position',
        'user-read-playback-state',      
        'user-modify-playback-state',    
        'user-read-currently-playing'    
    ].join(' ');
    res.redirect('https:
        querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
            state,
        }));
});
app.get('/callback', (req: Request, res: Response) => {
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;
    const storedState = req.cookies ? req.cookies[stateKey] : undefined;
    if (!state || state !== storedState) {
        res.redirect(frontend_uri + '/#' +
            querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https:
            form: {
                code,
                redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(
                    client_id + ':' + client_secret
                ).toString('base64'),
            },
            json: true,
        };
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;
                res.cookie('access_token', access_token, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
                res.cookie('refresh_token', refresh_token, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
                console.log('✅ Tokens set successfully');
                res.redirect(frontend_uri+'/me')
            } else {
                console.error('❌ Token error:', error, body);
                res.redirect(frontend_uri + '/#' +
                    querystring.stringify({ error: 'invalid_token' }));
            }
        });
    }
});
app.get('/refresh_token', (req: Request, res: Response) => {
    const incomingRefreshToken = (req.query.refresh_token as string | undefined) || req.cookies['refresh_token'];
    if (!incomingRefreshToken) {
        return res.status(400).json({ error: 'Refresh token not provided' });
    }
    const authOptions = {
        url: 'https:
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(
                client_id + ':' + client_secret
            ).toString('base64'),
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: incomingRefreshToken,
        },
        json: true,
    };
    request.post(authOptions, (error, response, body) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to refresh token' });
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({ error: 'Invalid refresh request' });
        }
        const newAccessToken = body.access_token as string | undefined;
        const newRefreshToken = body.refresh_token as string | undefined;
        if (newAccessToken) {
            res.cookie('access_token', newAccessToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
        }
        if (newRefreshToken) {
            res.cookie('refresh_token', newRefreshToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
        }
        return res.status(200).json({ success: true });
    });
});
app.post('/logout', (_req: Request, res: Response) => {
    console.log("🚪 Hit /logout POST");
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "lax" });
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "lax" });
    res.status(200).json({ success: true });
});
app.use('/', userRoute);
app.use('/', artistRoute);
app.use('/', trackRoute);
app.use('/', trackDetailRoute);
app.use('/', artistDetailsRoute);
app.use('/', quizQuestions);
app.use('/spotify', playbackRoute);  
app.use('/', friendsRoute);
app.use('/token', tokenRoute);
const httpsOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt'),
};
const desiredPort = Number(process.env.AUTH_PORT) || 8888;
function startHttpsServer(port: number) {
    const server = https.createServer(httpsOptions, app);
    server.on('error', (err: any) => {
        if (err && err.code === 'EADDRINUSE') {
            console.warn(`⚠️ Port ${port} in use for auth server, trying ${port + 1}...`);
            startHttpsServer(port + 1);
        } else {
            throw err;
        }
    });
    server.listen(port, () => {
        console.log(`🔐 HTTPS Express listening on ${port}`);
        console.log(`🎵 Playback routes available at /spotify/*`);
    });
}
startHttpsServer(desiredPort);
