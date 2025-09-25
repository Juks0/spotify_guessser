import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const backendApiUrl = import.meta.env.VITE_BACKEND_URL;

interface Artist {
    id: string;                  // e.g. "4lmMkf4tLyEKBslusiNZdu"
    name: string;
    uri: string;                 // e.g. "spotify:artist:4lmMkf4tLyEKBslusiNZdu"
}

interface AlbumImage {
    url: string;
}

interface Album {
    total_tracks: number;
    images: AlbumImage[];
    name: string;
    release_date: string;
}

interface Track {
    album: Album;
    artists: Artist[];
    duration_ms: number;
    name: string;
    popularity: number;
    preview_url: string | null;
    external_urls: { spotify: string };
}

interface TrackDetailsProps {
    trackId: string;
}

const TrackDetails: React.FC<TrackDetailsProps> = ({ trackId }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [artistImages, setArtistImages] = useState<{ [id: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch track data
    useEffect(() => {
        if (!trackId) return;
        setLoading(true);
        setTrack(null);

        const params = new URLSearchParams({ id: trackId });
        fetch(`${backendApiUrl}/trackdetails?${params.toString()}`, { credentials: "include" })
            .then((res) => res.json())
            .then((trackData: Track) => {
                setTrack(trackData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching track details:", err);
                setLoading(false);
            });
    }, [trackId]);

    // Fetch images for all artists (as soon as track is loaded)
    useEffect(() => {
        if (!track || !track.artists) return;

        track.artists.forEach((artist) => {
            if (artistImages[artist.id]) return; // Already fetched

            fetch(`${backendApiUrl}/artistdetails?id=${artist.id}`, { credentials: "include" })
                .then(res => res.json())
                .then((artistData) => {
                    if (artistData && artistData.images && artistData.images.length > 0) {
                        setArtistImages(prev => ({
                            ...prev,
                            [artist.id]: artistData.images[0].url,
                        }));
                    } else {
                        setArtistImages(prev => ({
                            ...prev,
                            [artist.id]: "",
                        }));
                    }
                })
                .catch(err => {
                    console.error("Error fetching artist details:", err);
                });
        });
    }, [track]); // Deliberately not listing artistImages as a dependency

    if (loading) return <div>Loading track details...</div>;
    if (!track) return <div>No track data found.</div>;

    return (
        <div>
            <h1>Track Details</h1>
            <h2>{track.name}</h2>
            <div>
                <strong>Artists:</strong>{" "}
                {track.artists.map((artist) => (
                    <span key={artist.id} style={{ display: "inline-flex", alignItems: "center", marginRight: 16 }}>
            {/* Artist image if available */}
                        {artistImages[artist.id] && artistImages[artist.id] !== "" && (
                            <img
                                src={artistImages[artist.id]}
                                alt={artist.name}
                                width={32}
                                height={32}
                                style={{ borderRadius: "50%", cursor: "pointer", marginRight: 4, objectFit: "cover" }}
                                onClick={() => navigate(`/artist-details/${artist.id}`)}
                            />
                        )}
                        {/* Artist name */}
                        <span
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                            onClick={() => navigate(`/artist-details/${artist.id}`)}
                        >
              {artist.name}
            </span>
          </span>
                ))}
            </div>

            <p>
                Album: {track.album.name} ({track.album.release_date})
            </p>

            {track.album.images[0] && (
                <img src={track.album.images[0].url} alt={track.name} width={200} />
            )}

            <p>
                Duration: {Math.floor(track.duration_ms / 60000)}:
                {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, "0")}
            </p>

            <p>Popularity: {track.popularity}</p>

            <p>
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    Open in Spotify
                </a>
            </p>

            {track.preview_url && (
                <audio controls src={track.preview_url}>
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
};

export default TrackDetails;
