import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags } from '../../utils/MetaTags';
import {
  getPopularMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getImageUrl,
} from '../../services/api';
import './MoviesPage.css';

const MoviesPage = () => {
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    // Update SEO for movies page
    updateMetaTags(
      'Movies | Browse Popular, Upcoming & Top Rated | URTV',
      'Discover popular, upcoming, and top-rated movies. Browse detailed information, ratings, and cast for all movies on URTV.',
      '',
      'https://urtv.com/movies'
    );
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [popular, upcoming, topRated] = await Promise.all([
        getPopularMovies(1),
        getUpcomingMovies(1),
        getTopRatedMovies(1),
      ]);

      setPopularMovies(popular.data.results.slice(0, 10));
      setUpcomingMovies(upcoming.data.results.slice(0, 10));
      setTopRatedMovies(topRated.data.results.slice(0, 10));

      const allResults = [
        ...popular.data.results,
        ...upcoming.data.results,
        ...topRated.data.results,
      ];
      if (allResults.length > 0) {
        const randomIndex = Math.floor(Math.random() * allResults.length);
        setFeatured(allResults[randomIndex]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (!featured) return;
    const slug = `${featured.title.toLowerCase().replace(/\s+/g, '-')}-${featured.id}`;
    navigate(`/movie/${slug}`);
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
                alt={featured.title}
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
                  alt={featured.title}
                />
              )}
            </div>

            <div className="featured-info">
              <h1 className="featured-title">{featured.title}</h1>
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
        <h2 className="category-title">Upcoming Movies</h2>
        <motion.div
          className="grid-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {upcomingMovies.map((movie) => (
            <motion.div
              key={movie.id}
              className="grid-item"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={movie} type="movie" />
            </motion.div>
          ))}
        </motion.div>

        <h2 className="category-title" style={{ marginTop: '3rem' }}>
          Popular Movies
        </h2>
        <motion.div
          className="grid-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {popularMovies.map((movie) => (
            <motion.div
              key={movie.id}
              className="grid-item"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={movie} type="movie" />
            </motion.div>
          ))}
        </motion.div>

        <h2 className="category-title" style={{ marginTop: '3rem' }}>
          Top Rated Movies
        </h2>
        <motion.div
          className="grid-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {topRatedMovies.map((movie) => (
            <motion.div
              key={movie.id}
              className="grid-item"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard item={movie} type="movie" />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};

export default MoviesPage;
