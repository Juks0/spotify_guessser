import React from 'react';
import { useParams } from 'react-router-dom';
import TrackDetails from '../../components/TrackDetails.tsx';

const TrackDetailsWrapper = () => {
  const { trackId } = useParams<{ trackId: string }>();
  // const navigate = useNavigate();

  if (!trackId) return <div>Track ID is missing</div>;

  return (
    <TrackDetails
      trackId={trackId}
      // onClose={() => navigate(-1)}
    />
  );
};

export default TrackDetailsWrapper;
