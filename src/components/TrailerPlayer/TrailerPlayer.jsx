import React from 'react';
import { getYouTubeUrl } from '../../services/api';
import './TrailerPlayer.css';

const TrailerPlayer = ({ videos = [] }) => {
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  if (!trailer) {
    return (
      <div className="trailer-container">
        <p className="no-trailer">No trailer available</p>
      </div>
    );
  }

  return (
    <div className="trailer-container">
      <h3 className="trailer-title">Trailer</h3>
      <div className="trailer-wrapper">
        <iframe
          src={getYouTubeUrl(trailer.key)}
          title="Trailer"
          className="trailer-iframe"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default TrailerPlayer;
