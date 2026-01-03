import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags } from '../../utils/MetaTags';
import { getMovieDetails, getTVShowDetails } from '../../services/api';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update SEO meta tags
    updateMetaTags(
      'My Favorites | URTV',
      'View all your favorite movies and TV shows on URTV.',
      '',
      'https://abdogoda.github.io/URTV/#/favorites'
    );
    
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch details for all favorites
      const favoritePromises = favoriteIds.map(async (id) => {
        try {
          // Try to fetch as movie first, if fails try as TV show
          try {
            const response = await getMovieDetails(id);
            return { ...response.data, type: 'movie' };
          } catch {
            const response = await getTVShowDetails(id);
            return { ...response.data, type: 'tv' };
          }
        } catch (err) {
          console.error(`Error fetching item ${id}:`, err);
          return null;
        }
      });

      const results = await Promise.all(favoritePromises);
      const validFavorites = results.filter((item) => item !== null);
      setFavorites(validFavorites);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newIds = favoriteIds.filter((fid) => fid !== id);
    localStorage.setItem('favorites', JSON.stringify(newIds));
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      className="favorites-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          {favorites.length > 0 && (
            <button className="clear-btn" onClick={clearAllFavorites}>
              Clear All
            </button>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {favorites.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">❤️</p>
            <p className="empty-message">No favorites yet</p>
            <p className="empty-description">
              Add movies and TV shows to your favorites to see them here
            </p>
          </div>
        ) : (
          <>
            <p className="favorites-count">{favorites.length} items in favorites</p>
            <div className="favorites-grid">
              {favorites.map((item) => (
                <motion.div
                  key={item.id}
                  className="favorite-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <MovieCard
                    item={item}
                    type={item.type || (item.title ? 'movie' : 'tv')}
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeFavorite(item.id)}
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;
