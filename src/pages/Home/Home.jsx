import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Carousel from '../../components/Carousel/Carousel';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateMetaTags, addStructuredData } from '../../utils/MetaTags';
import {
  getPopularMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getImageUrl,
} from '../../services/api';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featured, setFeatured] = useState(null);
  const category = searchParams.get('category');

  const handleViewDetails = () => {
    if (!featured) return;
    const slug = `${(featured.title || featured.name).toLowerCase().replace(/\s+/g, '-')}-${featured.id}`;
    const type = featured.title ? 'movie' : 'tv';
    navigate(`/${type}/${slug}`);
  };

  useEffect(() => {
    // Update SEO meta tags for home page
    updateMetaTags(
      'URTV - Discover Movies & TV Shows | Watch Now',
      'Explore the latest movies and TV shows with ratings, cast, and detailed information. Discover your next favorite entertainment on URTV.',
      '',
      'https://urtv.com'
    );
    
    // Add structured data for homepage
    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'URTV',
      'description': 'Movies and TV Shows Database',
      'url': 'https://urtv.com',
      'applicationCategory': 'EntertainmentApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
    
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let movieResults = [];
      let tvResults = [];

      // Filter based on category
      if (category === 'movies' || !category) {
        const [popular, upcoming, topRated] = await Promise.all([
          getPopularMovies(1),
          getUpcomingMovies(1),
          getTopRatedMovies(1),
        ]);
        movieResults = popular.data.results;
        setPopularMovies(popular.data.results.slice(0, 10));
        setUpcomingMovies(upcoming.data.results.slice(0, 10));
        setTopRatedMovies(topRated.data.results.slice(0, 10));
      } else if (category === 'tvshows') {
        const [shows, showsRated] = await Promise.all([
          getPopularTVShows(1),
          getTopRatedTVShows(1),
        ]);
        tvResults = shows.data.results;
        setPopularShows(shows.data.results.slice(0, 10));
        setTopRatedShows(showsRated.data.results.slice(0, 10));
      } else if (category === 'tvshows') {
        const [shows, showsRated] = await Promise.all([
          getPopularTVShows(1),
          getTopRatedTVShows(1),
        ]);
        tvResults = shows.data.results;
        setPopularShows(shows.data.results.slice(0, 10));
        setTopRatedShows(showsRated.data.results.slice(0, 10));
      } else {
        // Default to all
        const [popular, upcoming, topRated, shows, showsRated] = await Promise.all([
          getPopularMovies(1),
          getUpcomingMovies(1),
          getTopRatedMovies(1),
          getPopularTVShows(1),
          getTopRatedTVShows(1),
        ]);
        movieResults = popular.data.results;
        tvResults = shows.data.results;
        setPopularMovies(popular.data.results.slice(0, 10));
        setUpcomingMovies(upcoming.data.results.slice(0, 10));
        setTopRatedMovies(topRated.data.results.slice(0, 10));
        setPopularShows(shows.data.results.slice(0, 10));
        setTopRatedShows(showsRated.data.results.slice(0, 10));
      }

      // Set featured content with a random latest movie/show
      const allResults = [...movieResults, ...tvResults];
      if (allResults.length > 0) {
        const randomIndex = Math.floor(Math.random() * allResults.length);
        setFeatured(allResults[randomIndex]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <main className="home-page">
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
                alt={featured.title || featured.name}
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
                  alt={featured.title || featured.name}
                />
              )}
            </div>

            <div className="featured-info">
              <h1 className="featured-title">{featured.title || featured.name}</h1>
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
        {upcomingMovies.length > 0 && (
          <Carousel items={upcomingMovies} title="Upcoming Movies" type="movie" />
        )}

        {popularMovies.length > 0 && (
          <Carousel items={popularMovies} title="Popular Movies" type="movie" />
        )}

        {topRatedMovies.length > 0 && (
          <Carousel items={topRatedMovies} title="Top Rated Movies" type="movie" />
        )}

        {popularShows.length > 0 && (
          <Carousel items={popularShows} title="Popular Shows" type="tv" />
        )}

        {topRatedShows.length > 0 && (
          <Carousel items={topRatedShows} title="Top Rated Shows" type="tv" />
        )}
      </section>
    </main>
  );
};

export default Home;
