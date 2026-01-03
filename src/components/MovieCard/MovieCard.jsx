import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../services/api';
import { createFullSlug } from '../../utils/slug';
import './MovieCard.css';

const MovieCard = ({ item, type = 'movie' }) => {
  const title = item.title || item.name;
  const posterPath = item.poster_path;
  const rating = (item.vote_average || 0).toFixed(1);
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  const slug = createFullSlug(title, item.id);
  const detailsLink = type === 'movie' 
    ? `/movie/${slug}` 
    : `/tv/${slug}`;

  return (
    <motion.div
      className="movie-card"
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={detailsLink} className="card-link">
        <div className="card-image-wrapper">
          {posterPath ? (
            <img
              src={getImageUrl(posterPath, 'w500')}
              alt={title}
              className="card-image"
              loading="lazy"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <div className="card-overlay">
            <button className="play-btn">▶ View Details</button>
          </div>
        </div>

        <div className="card-content">
          <h3 className="card-title" title={title}>
            {title}
          </h3>
          <div className="card-meta">
            <span className="card-rating">
              ⭐ {rating}
            </span>
            <span className="card-year">{year}</span>
          </div>
          {type === 'tv' && (item.number_of_seasons || item.number_of_episodes) && (
            <div className="card-tv-info">
              {item.number_of_seasons && (
                <span className="tv-seasons">
                  {item.number_of_seasons} Season{item.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
              {item.number_of_episodes && (
                <span className="tv-episodes">
                  {item.number_of_episodes} Episode{item.number_of_episodes !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
