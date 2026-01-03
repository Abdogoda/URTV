import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags } from '../../utils/MetaTags';
import {
  getPopularTVShows,
  getTopRatedTVShows,
  getImageUrl,
} from '../../services/api';
import './TVShowsPage.css';

const TVShowsPage = () => {
  const navigate = useNavigate();
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    // Update SEO for TV shows page
    updateMetaTags(
      'TV Shows | Browse Popular & Top Rated | URTV',
      'Discover popular and top-rated TV shows with detailed information about seasons, episodes, ratings, and cast on URTV.',
      '',
      'https://urtv.com/tvshows'
    );
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [popular, topRated] = await Promise.all([
        getPopularTVShows(1),
        getTopRatedTVShows(1),
      ]);

      setPopularShows(popular.data.results.slice(0, 10));
      setTopRatedShows(topRated.data.results.slice(0, 10));

      const allResults = [...popular.data.results, ...topRated.data.results];
      if (allResults.length > 0) {
        const randomIndex = Math.floor(Math.random() * allResults.length);
        setFeatured(allResults[randomIndex]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load TV shows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (!featured) return;
    const slug = `${featured.name.toLowerCase().replace(/\s+/g, '-')}-${featured.id}`;
    navigate(`/tv/${slug}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <main className="category-page">
      {featured && (
        <motion.section
          className="featured-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="featured-backdrop">
            {featured.backdrop_path && (
              <img
                src={getImageUrl(featured.backdrop_path, 'original')}
                alt={featured.name}
                className="backdrop-image"
              />
            )}
            <div className="featured-overlay"></div>
          </div>

          <div className="featured-content">
            <div className="featured-poster">
              {featured.poster_path && (
                <img
                  src={getImageUrl(featured.poster_path, 'w500')}
                  alt={featured.name}
                />
              )}
            </div>

            <div className="featured-info">
              <h1 className="featured-title">{featured.name}</h1>
              <div className="featured-meta">
                <span className="rating">⭐ {featured.vote_average.toFixed(1)}</span>
                <span className="votes">({featured.vote_count.toLocaleString()} votes)</span>
              </div>
              <p className="featured-overview">{featured.overview}</p>
              <div className="featured-actions">
                <button className="btn btn-primary" onClick={handleViewDetails}>View Details</button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <section className="content-section">
        <h2 className="category-title">Popular TV Shows</h2>
        <motion.div
          className="grid-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {popularShows.map((show) => (
            <motion.div
              key={show.id}
              className="grid-item"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={show} type="tv" />
            </motion.div>
          ))}
        </motion.div>

        <h2 className="category-title" style={{ marginTop: '3rem' }}>
          Top Rated TV Shows
        </h2>
        <motion.div
          className="grid-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {topRatedShows.map((show) => (
            <motion.div
              key={show.id}
              className="grid-item"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={show} type="tv" />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};

export default TVShowsPage;
