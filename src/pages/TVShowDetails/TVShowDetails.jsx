import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrailerPlayer from '../../components/TrailerPlayer/TrailerPlayer';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags, addStructuredData } from '../../utils/MetaTags';
import { getTVShowDetails, getImageUrl } from '../../services/api';
import { extractIdFromSlug } from '../../utils/slug';
import './TVShowDetails.css';

const TVShowDetails = () => {
  const { slug } = useParams();
  const showId = extractIdFromSlug(slug);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    fetchShowDetails();
    // Check if show is in watchlist and favorites
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (watchlist.includes(showId)) setIsInWatchlist(true);
    if (favorites.includes(showId)) setIsInFavorites(true);
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTVShowDetails(showId);
      setShow(response.data);
      
      // Update SEO meta tags with show details
      const showTitle = response.data.name;
      const showDescription = response.data.overview || `Watch ${showTitle} on URTV. Rating: ${response.data.vote_average}/10. ${response.data.number_of_seasons} seasons, ${response.data.number_of_episodes} episodes.`;
      const showImage = `https://image.tmdb.org/t/p/w500${response.data.poster_path}`;
      const canonicalUrl = `https://abdogoda.github.io/URTV/#/tv/${slug}`;
      
      updateMetaTags(
        `${showTitle} - Watch TV Show | URTV`,
        showDescription,
        showImage,
        canonicalUrl,
        'video.tv_show'
      );
      
      // Add structured data for TV show
      addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        'name': showTitle,
        'description': showDescription,
        'image': showImage,
        'datePublished': response.data.first_air_date,
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': response.data.vote_average,
          'bestRating': '10',
          'ratingCount': response.data.vote_count
        },
        'numberOfSeasons': response.data.number_of_seasons,
        'numberOfEpisodes': response.data.number_of_episodes,
        'status': response.data.status
      });
    } catch (err) {
      console.error('Error fetching show details:', err);
      setError('Failed to load show details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (watchlist.includes(showId)) {
      const updated = watchlist.filter((sid) => sid !== showId);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      watchlist.push(showId);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
    }
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(showId)) {
      const updated = favorites.filter((sid) => sid !== showId);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsInFavorites(false);
    } else {
      favorites.push(showId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsInFavorites(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchShowDetails} />;
  if (!show) return <ErrorMessage message="TV Show not found." />;

  const posterUrl = show.poster_path
    ? getImageUrl(show.poster_path, 'w500')
    : null;
  const backdropUrl = show.backdrop_path
    ? getImageUrl(show.backdrop_path, 'original')
    : null;

  const creator =
    show.created_by?.length > 0
      ? show.created_by.map((creator) => creator.name).join(', ')
      : 'N/A';

  return (
    <motion.main
      className="details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {backdropUrl && (
        <div className="details-backdrop">
          <img src={backdropUrl} alt={show.name} className="backdrop" />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="details-container">
        <div className="details-content">
          <div className="details-poster">
            {posterUrl ? (
              <img src={posterUrl} alt={show.name} />
            ) : (
              <div className="no-poster">No Poster</div>
            )}
          </div>

          <div className="details-info">
            <h1 className="title">{show.name}</h1>

            <div className="meta-info">
              <span className="year">
                {new Date(show.first_air_date).getFullYear()}
              </span>
              <span className="divider">•</span>
              <span className="rating">
                ⭐ {show.vote_average.toFixed(1)}/10
              </span>
              <span className="divider">•</span>
              <span className="runtime">{show.episode_run_time?.[0] || 'N/A'} min/episode</span>
            </div>

            {show.tagline && <p className="tagline">"{show.tagline}"</p>}

            <div className="section">
              <h3>Genres</h3>
              <div className="genres">
                {show.genres?.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Overview</h3>
              <p className="overview">{show.overview}</p>
            </div>

            <div className="section">
              <h3>Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Creator:</span>
                  <span className="value">{creator}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Seasons:</span>
                  <span className="value">{show.number_of_seasons}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Episodes:</span>
                  <span className="value">{show.number_of_episodes}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value">{show.status}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Language:</span>
                  <span className="value">
                    {show.original_language.toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Vote Count:</span>
                  <span className="value">
                    {show.vote_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {show.production_companies && show.production_companies.length > 0 && (
              <div className="section">
                <h3>Production Companies</h3>
                <div className="companies">
                  {show.production_companies.map((company) => (
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

      {show.videos && show.videos.results && (
        <div className="details-container">
          <TrailerPlayer videos={show.videos.results} />
        </div>
      )}

      {show.credits?.cast && show.credits.cast.length > 0 && (
        <div className="details-container">
          <div className="section">
            <h3>Cast</h3>
            <div className="cast-list">
              {show.credits.cast.slice(0, 6).map((member) => (
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

export default TVShowDetails;
