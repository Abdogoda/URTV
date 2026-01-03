import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags } from '../../utils/MetaTags';
import { searchMulti } from '../../services/api';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      // Update SEO for search results
      updateMetaTags(
        `Search Results for "${query}" | URTV`,
        `Search results for "${query}" - movies and TV shows on URTV. Find your favorite entertainment.`,
        '',
        `https://urtv.com/search?q=${encodeURIComponent(query)}`
      );
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchMulti(query);
      const filteredResults = response.data.results.filter(
        (item) => item.poster_path && (item.title || item.name)
      );
      setResults(filteredResults);

      if (filteredResults.length === 0) {
        setError(`No results found for "${query}"`);
      }
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="search-page">
      <div className="search-header">
        <h1 className="search-title">
          Search Results for "<span>{query}</span>"
        </h1>
        <p className="results-count">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={performSearch} />
      ) : results.length > 0 ? (
        <motion.div
          className="results-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {results.map((result) => {
            const type = result.media_type === 'tv' ? 'tv' : 'movie';
            return (
              <motion.div
                key={`${result.media_type}-${result.id}`}
                className="grid-item"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard item={result} type={type} />
              </motion.div>
            );
          })}
        </motion.div>
      ) : null}
    </main>
  );
};

export default SearchResults;
