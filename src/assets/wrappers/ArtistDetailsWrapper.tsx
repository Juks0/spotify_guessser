import { useParams, useNavigate } from 'react-router-dom';
import ArtistDetails from '../../components/ArtistDetails.tsx';
import React from 'react';

const ArtistDetailsWrapper = () => {
    const { artistId } = useParams<{ artistId: string }>();
    const navigate = useNavigate();

    if (!artistId) return <div>Artist ID missing</div>;

    return (
        <ArtistDetails
            artistId={artistId}
            navigate={navigate}
        />
    );
};

export default ArtistDetailsWrapper;
