import express, { Request, Response } from 'express';
import request from 'request';
import crypto from 'crypto';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import * as fs from "node:fs";
import * as https from "node:https";

const client_id = '560440ae985b45a8b13e61974617bd05';
const client_secret = '7f262b78be8148c194110fad34f96616';
const redirect_uri = 'https://192.168.1.109:8888/callback'; // <-- Spotify redirect_uri musi być backend!

const stateKey = 'spotify_auth_state';
const frontend_uri = 'https://192.168.1.109:5173/'; // <-- frontend adres do redirectu z tokenami

const generateRandomString = (length: number): string =>
    crypto.randomBytes(60).toString('hex').slice(0, length);

const app = express();

const __dirname = import.meta.dirname;

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', (_req: Request, res: Response) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri, // <-- Backendowy endpoint!
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
            url: 'https://accounts.spotify.com/api/token',
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
                res.cookie('access_token', access_token, { httpOnly: true, secure: true });
                res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: true });

                console.log(access_token);
                console.log(refresh_token);
                res.redirect(frontend_uri + '/#' +
                    querystring.stringify({
                        access_token,
                        refresh_token,
                    }));
            } else {
                res.redirect(frontend_uri + '/#' +
                    querystring.stringify({ error: 'invalid_token' }));
            }
        });
    }
});

app.get('/refresh_token', (req: Request, res: Response) => {
    const refresh_token = req.query.refresh_token as string | undefined;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(
                client_id + ':' + client_secret
            ).toString('base64'),
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        json: true,
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send({
                access_token: body.access_token,
                refresh_token: body.refresh_token,
            });
        }
    });
});
const httpsOptions = {
    key: fs.readFileSync('localhost.key'),   // uwzględnij właściwą ścieżkę
    cert: fs.readFileSync('localhost.crt'),
};

https.createServer(httpsOptions, app).listen(8888, () => {
    console.log('HTTPS Express listening on 8888');
});

