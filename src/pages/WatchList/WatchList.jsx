import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags } from '../../utils/MetaTags';
import { getMovieDetails, getTVShowDetails } from '../../services/api';
import './WatchList.css';

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update SEO meta tags
    updateMetaTags(
      'My Watchlist | URTV',
      'View all movies and TV shows in your watchlist on URTV.',
      '',
      'https://abdogoda.github.io/URTV/#/watchlist'
    );
    
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const watchlistIds = JSON.parse(localStorage.getItem('watchlist') || '[]');
      
      if (watchlistIds.length === 0) {
        setWatchlist([]);
        setLoading(false);
        return;
      }

      // Fetch details for all watchlist items
      const watchlistPromises = watchlistIds.map(async (id) => {
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

      const results = await Promise.all(watchlistPromises);
      const validWatchlist = results.filter((item) => item !== null);
      setWatchlist(validWatchlist);
    } catch (err) {
      console.error('Error loading watchlist:', err);
      setError('Failed to load watchlist.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (id) => {
    const updatedWatchlist = watchlist.filter((item) => item.id !== id);
    setWatchlist(updatedWatchlist);
    
    const watchlistIds = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const newIds = watchlistIds.filter((wid) => wid !== id);
    localStorage.setItem('watchlist', JSON.stringify(newIds));
  };

  const clearAllWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      setWatchlist([]);
      localStorage.setItem('watchlist', JSON.stringify([]));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      className="watchlist-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="watchlist-container">
        <div className="watchlist-header">
          <h1>My Watchlist</h1>
          {watchlist.length > 0 && (
            <button className="clear-btn" onClick={clearAllWatchlist}>
              Clear All
            </button>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {watchlist.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📋</p>
            <p className="empty-message">Watchlist is empty</p>
            <p className="empty-description">
              Add movies and TV shows to your watchlist to keep track of what you want to watch
            </p>
          </div>
        ) : (
          <>
            <p className="watchlist-count">{watchlist.length} items in watchlist</p>
            <div className="watchlist-grid">
              {watchlist.map((item) => (
                <motion.div
                  key={item.id}
                  className="watchlist-item"
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
                    onClick={() => removeFromWatchlist(item.id)}
                    title="Remove from watchlist"
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

export default WatchList;
