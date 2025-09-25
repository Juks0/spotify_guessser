import React, { Component } from "react";
import { NavigateFunction } from "react-router-dom";


const backendApiUrl = import.meta.env.VITE_BACKEND_URL;

interface ArtistImage {
    url: string;
}

interface Album {
    images: ArtistImage[];
}

interface Track {
    id: string;
    name: string;
    album: Album;
}

interface ArtistDetailsProps {
    artistId: string;
    navigate?: NavigateFunction;  // navigation function prop
}

interface ArtistDetailsState {
    artist: {
        name: string;
        images: ArtistImage[];
        followers: { total: number };
        popularity: number;
        external_urls: { spotify: string };
    } | null;
    topSongs: Track[];
    loading: boolean;
    songsLoading: boolean;
}

class ArtistDetails extends Component<ArtistDetailsProps, ArtistDetailsState> {
    state: ArtistDetailsState = {
        artist: null,
        topSongs: [],
        loading: true,
        songsLoading: true,
    };

    componentDidMount(): void {
        this.fetchArtist();
    }

    componentDidUpdate(prevProps: ArtistDetailsProps): void {
        if (this.props.artistId !== prevProps.artistId) {
            this.fetchArtist();
        }
    }

    fetchArtist() {
        const { artistId } = this.props;

        this.setState({ loading: true, artist: null, songsLoading: true, topSongs: [] });

        fetch(`${backendApiUrl}/artistdetails?id=${artistId}`, { credentials: "include" })
            .then(res => res.json())
            .then(artistData => {
                this.setState({ artist: artistData, loading: false });
            })
            .catch(err => {
                console.error("Error fetching artist details:", err);
                this.setState({ loading: false });
            });
        fetch(`${backendApiUrl}/artisttopsongs?id=${artistId}`, { credentials: "include" })
            .then(res => res.json())
            .then(songsData => {
                this.setState({ topSongs: songsData.tracks || [], songsLoading: false });
            })
            .catch(err => {
                console.error("Error fetching artist top songs:", err);
                this.setState({ songsLoading: false });
            });
    }

    render() {
        const { artist, loading, topSongs, songsLoading } = this.state;
        const { navigate } = this.props;

        if (loading) return <div>Loading artist details...</div>;
        if (!artist) return <div>No artist data found.</div>;

        return (
            <div>
                <h1>Artist Details</h1>
                <h2>{artist.name}</h2>
                {artist.images && artist.images[0] && (
                    <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        width={200}
                        style={{ borderRadius: "8px" }}
                    />
                )}
                <p>Followers: {artist.followers.total.toLocaleString('pl-PL')}</p>
                <p>Popularity: {artist.popularity}</p>
                <p>
                    <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        Open in Spotify
                    </a>
                </p>

                <h3>Top Songs</h3>
                {songsLoading ? (
                    <p>Loading top songs...</p>
                ) : topSongs.length > 0 ? (
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {topSongs.map(song => (
                            <li
                                key={song.id}
                                style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }}
                                onClick={() => navigate && navigate(`/track-details/${song.id}`)}
                            >
                                {song.album?.images?.[0] && (
                                    <img
                                        src={song.album.images[0].url}
                                        alt={song.name}
                                        width={50}
                                        height={50}
                                        style={{ borderRadius: '4px', marginRight: '10px' }}
                                    />
                                )}
                                <span>{song.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No top songs found.</p>
                )}
            </div>
        );
    }
}

export default ArtistDetails;
