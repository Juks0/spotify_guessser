// import * as process from "node:process";
//
// export interface SpotifyUser{
//     id: string;
//     displayName: string;
//     image? : string;
// }
// const authorizationEndpoint = "https://accounts.spotify.com/authorize";
// const tokenEndpoint = "https://accounts.spotify.com/api/token";
// const scope = 'user-read-private user-read-email';
//
// // const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
// const clientId = "560440ae985b45a8b13e61974617bd05";
// const redirectUri = `http://localhost:5173/`;
//
// type TokenResponse = {
//     access_token: string;
//     refresh_token: string;
//     expires_in: number;
// };
//
// const currentToken = {
//     get access_token(): string | null {
//         return localStorage.getItem('access_token');
//     },
//     get refresh_token(): string | null {
//         return localStorage.getItem('refresh_token');
//     },
//     get expires_in(): string | null {
//         return localStorage.getItem('expires_in');
//     },
//     get expires(): string | null {
//         return localStorage.getItem('expires');
//     },
//
//     save: function(response: TokenResponse): void {
//         const { access_token, refresh_token, expires_in } = response;
//         localStorage.setItem('access_token', access_token);
//         localStorage.setItem('refresh_token', refresh_token);
//         localStorage.setItem('expires_in', expires_in.toString());
//
//         const now = new Date();
//         const expiry = new Date(now.getTime() + expires_in * 1000);
//         localStorage.setItem('expires', expiry.toISOString());
//     }
// };
//
// // const requestUserAuth = async () => {
// //     if (!currentToken.access_token || !currentToken.expires || new Date(currentToken.expires) < new Date()) {
// //         await redirectToSpotifyAuthorize();
// //     } else {
// //         const userData = await getUserData();
// //         renderTemplate("oauth", "oauth-template", userData);
// //     }
// // }
// // export const getSpotifyAuth = (origin: string)=>{
// //
// // }
//
// const args = new URLSearchParams(window.location.search);
// const code = args.get('code');
//
// if (code) {
//     const token = await getToken(code);
//     currentToken.save(token);
//
//     const url = new URL(window.location.href);
//     url.searchParams.delete("code");
//
//     const updatedUrl = url.search ? url.href : url.href.replace('?', '');
//     window.history.replaceState({}, document.title, updatedUrl);
// }
//
// async function redirectToSpotifyAuthorize() {
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const randomValues = crypto.getRandomValues(new Uint8Array(64));
//     const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
//
//     const code_verifier = randomString;
//     const data = new TextEncoder().encode(code_verifier);
//     const hashed = await crypto.subtle.digest('SHA-256', data);
//
//     const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
//         .replace(/=/g, '')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_');
//
//     window.localStorage.setItem('code_verifier', code_verifier);
//
//     const authUrl = new URL(authorizationEndpoint)
//     const params = {
//         response_type: 'code',
//         client_id: clientId,
//         scope: scope,
//         code_challenge_method: 'S256',
//         code_challenge: code_challenge_base64,
//         redirect_uri: redirectUrl,
//     };
//
//     authUrl.search = new URLSearchParams(params).toString();
//     window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
// }
//
// async function getToken(code: string): Promise<TokenResponse> {
//     const code_verifier = localStorage.getItem('code_verifier') || '';
//
//     const response = await fetch(tokenEndpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             client_id: clientId,
//             grant_type: 'authorization_code',
//             code: code,
//             redirect_uri: redirectUrl,
//             code_verifier: code_verifier,
//         }),
//     });
//
//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//
//     const data: TokenResponse = await response.json();
//     return data;
// }
//
// async function refreshToken(): Promise<TokenResponse> {
//     const refresh_token = currentToken.refresh_token || '';
//
//     const response = await fetch(tokenEndpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             client_id: clientId,
//             grant_type: 'refresh_token',
//             refresh_token: refresh_token,
//         }),
//     });
//
//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//
//     const data: TokenResponse = await response.json();
//     return data;
// }
//
// async function getUserData() {
//     const response = await fetch("https://api.spotify.com/v1/me", {
//         method: 'GET',
//         headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
//     });
//
//     return await response.json();
// }
//
// async function loginWithSpotifyClick() {
//     await redirectToSpotifyAuthorize();
// }
// async function logoutClick() {
//     localStorage.clear();
//     window.location.href = redirectUrl;
// }
// async function refreshTokenClick() {
//     const token = await refreshToken();
//     currentToken.save(token);
//     renderTemplate("oauth", "oauth-template", currentToken);
// }