import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root (one level up from backend/)
const __filename_env = fileURLToPath(import.meta.url);
const __dirname_env = path.dirname(__filename_env);
dotenv.config({ path: path.resolve(__dirname_env, '../../../.env') });

import express, { Request, Response } from 'express';
import request from 'request';
import crypto from 'crypto';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import * as fs from "node:fs";
import * as https from "node:https";

// Import your routes
import userRoute from "@/routers/userRoute";
import artistRoute from "@/routers/topArtistRoute";
import trackRoute from "@/routers/topTrackRoute";
import trackDetailRoute from "@/routers/trackDetailRoute";
import artistDetailsRoute from "@/routers/artistDetailsRoute";
import quizQuestions from "@/routers/quizQuestions";
import playbackRoute from "@/routers/playbackRoute";
import friendsRoute from "@/routers/friendsRoute";
import tokenRoute from "@/routers/tokenRoute";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const backendApiUrl = process.env.BACKEND_URL;
const frontend_uri = process.env.FRONTEND_URL;
const redirect_uri = backendApiUrl + '/callback';
const stateKey = 'spotify_auth_state';

console.log('🚀 Starting Spotify Authentication Server');
console.log('📋 Configuration:');
console.log('  - Client ID:', client_id);
console.log('  - Client Secret:', client_secret ? '***SET***' : 'MISSING');
console.log('  - Backend URL:', backendApiUrl);
console.log('  - Frontend URL:', frontend_uri);
console.log('  - Redirect URI:', redirect_uri);
console.log('  - State Key:', stateKey);
console.log('  - NODE_ENV:', process.env.NODE_ENV);

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
    .use(express.json())
    .use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
        console.log('  - Headers:', req.headers);
        console.log('  - Query:', req.query);
        console.log('  - Body:', req.body);
        console.log('  - Cookies:', req.cookies);
        next();
    });

    app.get('/login', (req: Request, res: Response) => {
        console.log('🔐 Login request received');
        console.log('  - Request headers:', req.headers);
        console.log('  - Request IP:', req.ip);
        console.log('  - User agent:', req.get('User-Agent'));
        
        const state = generateRandomString(16);
        console.log('🔑 Generated state:', state);
        
        res.cookie(stateKey, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        console.log('🍪 State cookie set');
    
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
        
        console.log('📋 Requested scopes:', scope);
    
        const params = querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
            state,
        });
        
        console.log('🔗 Authorization URL parameters:');
        console.log('  - Client ID:', client_id);
        console.log('  - Redirect URI:', redirect_uri);
        console.log('  - State:', state);
        console.log('  - Scopes:', scope);
        
        const authUrl = `https://accounts.spotify.com/authorize?${params}`;
        console.log('🌐 Redirecting to Spotify authorization:', authUrl);
        
        res.redirect(authUrl);
    });
    

app.get('/callback', (req: Request, res: Response) => {
    console.log('🔐 Callback received - Full request details:');
    console.log('  - Query params:', req.query);
    console.log('  - Cookies:', req.cookies);
    console.log('  - Headers:', req.headers);
    
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;
    const storedState = req.cookies ? req.cookies[stateKey] : undefined;
    
    console.log('🔍 State validation:');
    console.log('  - Received state:', state);
    console.log('  - Stored state:', storedState);
    console.log('  - States match:', state === storedState);
    
    if (!state || state !== storedState) {
        console.error('❌ State mismatch error');
        console.error('  - Missing state:', !state);
        console.error('  - State mismatch:', state !== storedState);
        res.redirect(frontend_uri + '/callback#' + querystring.stringify({ 
            error: 'state_mismatch',
            details: 'State parameter does not match stored state'
        }));
        return;
    }

    res.clearCookie(stateKey);
    
    console.log('🔑 Token exchange request details:');
    console.log('  - Client ID:', client_id);
    console.log('  - Client Secret:', client_secret ? '***SET***' : 'MISSING');
    console.log('  - Redirect URI:', redirect_uri);
    console.log('  - Authorization code:', code ? '***PRESENT***' : 'MISSING');
    
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
        json: true,
    };

    console.log('📡 Making token request to Spotify...');
    request.post(authOptions, (error, response, body) => {
        console.log('📡 Token request response:');
        console.log('  - Error:', error);
        console.log('  - Status Code:', response?.statusCode);
        console.log('  - Response Headers:', response?.headers);
        console.log('  - Response Body:', body);
        
        if (error) {
            console.error('❌ Request error:', error);
            res.redirect(frontend_uri + '/callback#' + querystring.stringify({ 
                error: 'request_error',
                details: error.message || 'Unknown request error'
            }));
            return;
        }
        
        if (response.statusCode === 403) {
            console.error('❌ 403 Forbidden error from Spotify:');
            console.error('  - Response body:', body);
            console.error('  - Possible causes:');
            console.error('    1. Invalid client credentials');
            console.error('    2. Redirect URI mismatch');
            console.error('    3. Invalid authorization code');
            console.error('    4. Client not authorized for requested scopes');
            
            res.redirect(frontend_uri + '/callback#' + querystring.stringify({ 
                error: 'spotify_403',
                details: body?.error_description || body?.error || 'Spotify API returned 403 Forbidden',
                spotify_error: body?.error,
                spotify_error_description: body?.error_description
            }));
            return;
        }
        
        if (response.statusCode !== 200) {
            console.error(`❌ Non-200 status code: ${response.statusCode}`);
            console.error('  - Response body:', body);
            res.redirect(frontend_uri + '/callback#' + querystring.stringify({ 
                error: 'token_exchange_failed',
                details: `Spotify API returned status ${response.statusCode}`,
                spotify_error: body?.error,
                spotify_error_description: body?.error_description
            }));
            return;
        }
        
        if (!error && response.statusCode === 200) {
            const { access_token, refresh_token } = body;
            console.log('✅ Token exchange successful');
            console.log('  - Access token received:', access_token ? '***PRESENT***' : 'MISSING');
            console.log('  - Refresh token received:', refresh_token ? '***PRESENT***' : 'MISSING');
            
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
            console.log('🍪 Cookies set, redirecting to frontend');
            res.redirect(frontend_uri + '/me');
        }
    });
});

app.get('/refresh_token', (req: Request, res: Response) => {
    console.log('🔄 Refresh token request received');
    console.log('  - Query params:', req.query);
    console.log('  - Cookies:', req.cookies);
    
    const incomingRefreshToken = (req.query.refresh_token as string | undefined) || req.cookies['refresh_token'];
    if (!incomingRefreshToken) {
        console.error('❌ No refresh token provided');
        return res.status(400).json({ error: 'Refresh token not provided' });
    }
    
    console.log('🔑 Using refresh token:', incomingRefreshToken ? '***PRESENT***' : 'MISSING');
    
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: incomingRefreshToken,
        },
        json: true,
    };
    
    console.log('📡 Making refresh token request to Spotify...');
    request.post(authOptions, (error, response, body) => {
        console.log('📡 Refresh token response:');
        console.log('  - Error:', error);
        console.log('  - Status Code:', response?.statusCode);
        console.log('  - Response Body:', body);
        
        if (error) {
            console.error('❌ Refresh token request error:', error);
            return res.status(500).json({ error: 'Failed to refresh token', details: error.message });
        }
        
        if (response.statusCode === 403) {
            console.error('❌ 403 Forbidden error during token refresh:');
            console.error('  - Response body:', body);
            console.error('  - Possible causes:');
            console.error('    1. Invalid client credentials');
            console.error('    2. Invalid or expired refresh token');
            console.error('    3. Client not authorized for token refresh');
            
            return res.status(403).json({ 
                error: 'spotify_403_refresh',
                details: body?.error_description || body?.error || 'Spotify API returned 403 Forbidden during token refresh',
                spotify_error: body?.error,
                spotify_error_description: body?.error_description
            });
        }
        
        if (response.statusCode !== 200) {
            console.error(`❌ Non-200 status code during refresh: ${response.statusCode}`);
            console.error('  - Response body:', body);
            return res.status(response.statusCode).json({ 
                error: 'refresh_failed',
                details: `Spotify API returned status ${response.statusCode}`,
                spotify_error: body?.error,
                spotify_error_description: body?.error_description
            });
        }
        
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = body;
        console.log('✅ Token refresh successful');
        console.log('  - New access token:', newAccessToken ? '***PRESENT***' : 'MISSING');
        console.log('  - New refresh token:', newRefreshToken ? '***PRESENT***' : 'MISSING');
        
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
        console.log('🍪 New tokens set in cookies');
        return res.status(200).json({ success: true });
    });
});

app.post('/logout', (_req: Request, res: Response) => {
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "lax" });
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "lax" });
    res.status(200).json({ success: true });
});

// Mount your routers
app.use('/', userRoute);
app.use('/', artistRoute);
app.use('/', trackRoute);
app.use('/', trackDetailRoute);
app.use('/', artistDetailsRoute);
app.use('/', quizQuestions);
app.use('/spotify', playbackRoute);
app.use('/', friendsRoute);
app.use('/token', tokenRoute);

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
    console.error('❌ Unhandled error:', error);
    console.error('  - Stack:', error.stack);
    console.error('  - Request path:', req.path);
    console.error('  - Request method:', req.method);
    
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});

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
