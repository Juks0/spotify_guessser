import React, { useEffect, useState } from 'react';
import {backendApiUrl} from "@/lib/urls/backendApiUrl.js";
import { useNavigate } from 'react-router-dom';

const backendApi = backendApiUrl

interface Track {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
    popularity: number;
}

const TopTracks = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(20);
    const navigate = useNavigate();
    const timeRangeOptions = [
        { label: '1 month', value: 'short_term' },
        { label: '6 months', value: 'medium_term' },
        { label: '1 year', value: 'long_term' },
    ];

    const limitOptions = [10, 20, 50];

    useEffect(() => {
        console.log('Fetching top tracks data from backend...');
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
        });

        fetch(`${backendApi}/toptracks?${params.toString()}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                console.log('Received ', data);
                setTracks(Array.isArray(data.items) ? data.items : []);
            })
            .catch(console.error);
    }, [timeRange, limit]);

    return (
        <div>
            <h1>Top Tracks</h1>

            <div style={{ marginBottom: 20 }}>
                <label>
                    Time range:{' '}
                    <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                        {timeRangeOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>

                <label style={{ marginLeft: 20 }}>
                    Limit:{' '}
                    <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
                        {limitOptions.map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>
            </div>

            {tracks.length > 0 ? (
                <ul>
                    {tracks.map(track => (
                        <li key={track.id} style={{ marginBottom: 20 }}>
                            <h2
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/track-details/${track.id}`)}
                            >
                                {track.name}</h2>
                            <p
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/track-details/${track.id}`)}
                            >
                                By: {track.artists.map(a => a.name).join(', ')}</p>
                            {track.album.images && track.album.images.length > 0 && (
                                <img src={track.album.images[0].url} alt={track.name} width="200" />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading top tracks...</p>
            )}
        </div>
    );
};

export default TopTracks;
