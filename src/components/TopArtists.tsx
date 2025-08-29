import React, { useEffect, useState } from 'react';

const backendApi = 'https://192.168.1.100:8888';

interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    popularity: number;
}

const TopArtists = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(20);


    const timeRangeOptions = [
        { label: '1 month', value: 'short_term' },
        { label: '6 months', value: 'medium_term' },
        { label: '1 year', value: 'long_term' },
    ];

    const limitOptions = [10, 20, 50];

    useEffect(() => {
        console.log('Fetching top artists data from backend...');
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
        });

        fetch(`${backendApi}/topartists?${params.toString()}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                console.log('Received ', data);
                setArtists(Array.isArray(data.items) ? data.items : []);
            })
            .catch(console.error);
    }, [timeRange, limit]);

    return (
        <div>
            <h1>Top Artists</h1>

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

            {artists.length > 0 ? (
                <ul>
                    {artists.map(artist => (
                        <li key={artist.id} style={{ marginBottom: 20 }}>
                            <h2>{artist.name}</h2>
                            {artist.images && artist.images.length > 0 && (
                                <img src={artist.images[0].url} alt={artist.name} width="200" />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading top artists...</p>
            )}
        </div>
    );
};

export default TopArtists;
