import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrailerPlayer from '../../components/TrailerPlayer/TrailerPlayer';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { getMovieDetails, getImageUrl } from '../../services/api';
import { extractIdFromSlug } from '../../utils/slug';
import './MovieDetails.css';

const MovieDetails = () => {
  const { slug } = useParams();
  const movieId = extractIdFromSlug(slug);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    // Check if movie is in watchlist and favorites
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (watchlist.includes(movieId)) setIsInWatchlist(true);
    if (favorites.includes(movieId)) setIsInFavorites(true);
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMovieDetails(movieId);
      setMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (watchlist.includes(movieId)) {
      const updated = watchlist.filter((mid) => mid !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      watchlist.push(movieId);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(movieId)) {
      const updated = favorites.filter((mid) => mid !== movieId);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsInFavorites(false);
    } else {
      favorites.push(movieId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsInFavorites(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMovieDetails} />;
  if (!movie) return <ErrorMessage message="Movie not found." />;

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'w500')
    : null;
  const backdropUrl = movie.backdrop_path
    ? getImageUrl(movie.backdrop_path, 'original')
    : null;

  const director =
    movie.credits?.crew?.find((member) => member.job === 'Director')?.name ||
    'N/A';

  return (
    <motion.main
      className="details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {backdropUrl && (
        <div className="details-backdrop">
          <img src={backdropUrl} alt={movie.title} className="backdrop" />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="details-container">
        <div className="details-content">
          <div className="details-poster">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} />
            ) : (
              <div className="no-poster">No Poster</div>
            )}
          </div>

          <div className="details-info">
            <h1 className="title">{movie.title}</h1>

            <div className="meta-info">
              <span className="year">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="divider">•</span>
              <span className="rating">
                ⭐ {movie.vote_average.toFixed(1)}/10
              </span>
              <span className="divider">•</span>
              <span className="runtime">{movie.runtime} min</span>
            </div>

            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

            <div className="section">
              <h3>Genres</h3>
              <div className="genres">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Overview</h3>
              <p className="overview">{movie.overview}</p>
            </div>

            <div className="section">
              <h3>Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Director:</span>
                  <span className="value">{director}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Budget:</span>
                  <span className="value">
                    {movie.budget > 0
                      ? `$${(movie.budget / 1000000).toFixed(1)}M`
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Revenue:</span>
                  <span className="value">
                    {movie.revenue > 0
                      ? `$${(movie.revenue / 1000000).toFixed(1)}M`
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value">{movie.status}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Language:</span>
                  <span className="value">
                    {movie.original_language.toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Vote Count:</span>
                  <span className="value">
                    {movie.vote_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="section">
                <h3>Production Companies</h3>
                <div className="companies">
                  {movie.production_companies.map((company) => (
                    <span key={company.id} className="company">
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="actions">
              <button
                className={`btn ${isInWatchlist ? 'btn-active' : 'btn-primary'}`}
                onClick={toggleWatchlist}
              >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              <button
                className={`btn ${isInFavorites ? 'btn-active' : 'btn-secondary'}`}
                onClick={toggleFavorite}
              >
                {isInFavorites ? '★ Favorited' : '☆ Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {movie.videos && movie.videos.results && (
        <div className="details-container">
          <TrailerPlayer videos={movie.videos.results} />
        </div>
      )}

      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div className="details-container">
          <div className="section">
            <h3>Cast</h3>
            <div className="cast-list">
              {movie.credits.cast.slice(0, 6).map((member) => (
                <div key={member.id} className="cast-member">
                  {member.profile_path && (
                    <img
                      src={getImageUrl(member.profile_path, 'w185')}
                      alt={member.name}
                    />
                  )}
                  <p className="name">{member.name}</p>
                  <p className="character">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="details-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    </motion.main>
  );
};

export default MovieDetails;
