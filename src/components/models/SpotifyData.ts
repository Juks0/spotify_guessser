export interface SpotifyImage {
    url: string;
    height?: number;
    width?: number;
}
export interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    images: SpotifyImage[];
}
export interface SpotifyTopArtistsResponse {
    items: SpotifyArtist[];
    limit: number;
    offset: number;
    total: number;
}
