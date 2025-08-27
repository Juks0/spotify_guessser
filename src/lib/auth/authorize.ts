import express, {type Request, type Response } from 'express';
import request from 'request';
import crypto from 'crypto';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';

const client_id: string = '560440ae985b45a8b13e61974617bd05'; // your clientId
const client_secret: string = '7f262b78be8148c194110fad34f96616'; // Your secret
const redirect_uri: string = 'http://localhost:5173/callback'; // Your redirect uri

const generateRandomString = (length: number): string => {
    return crypto
        .randomBytes(60)
        .toString('hex')
        .slice(0, length);
};

const stateKey: string = 'spotify_auth_state';

const app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());


app.get('/login', (_req: Request, res: Response) => {
    const state: string = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope: string = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        }));
});

app.get('/callback', (req: Request, res: Response) => {
    const code: string | undefined = req.query.code as string;
    const state: string | undefined = req.query.state as string;
    const storedState: string | undefined = req.cookies ? req.cookies[stateKey] : undefined;

    if (!state || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch',
            }));
    } else {
        res.clearCookie(stateKey);

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            },
            json: true,
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token: string = body.access_token;
                const refresh_token: string = body.refresh_token;

                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { Authorization: 'Bearer ' + access_token },
                    json: true,
                };

                request.get(options, (_error, _response, body) => {
                    console.log(body);
                });

                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token,
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token',
                    }));
            }
        });
    }
});

app.get('/refresh_token', (req: Request, res: Response) => {
    const refresh_token: string | undefined = req.query.refresh_token as string;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        },
        json: true,
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const access_token: string = body.access_token;
            const refresh_token: string = body.refresh_token;
            res.send({
                access_token: access_token,
                refresh_token: refresh_token,
            });
        }
    });
});

console.log('Listening on 8888');
app.listen(8888);
