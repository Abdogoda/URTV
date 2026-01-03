import axios from 'axios';

const API_KEY = 'a32eccaa3dcf029ec1662249d4b44c73';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Popular Movies
export const getPopularMovies = (page = 1) =>
  api.get('/movie/popular', { params: { page } });

// Upcoming Movies
export const getUpcomingMovies = (page = 1) =>
  api.get('/movie/upcoming', { params: { page } });

// Top Rated Movies
export const getTopRatedMovies = (page = 1) =>
  api.get('/movie/top_rated', { params: { page } });

// Popular TV Shows
export const getPopularTVShows = (page = 1) =>
  api.get('/tv/popular', { params: { page } });

// Top Rated TV Shows
export const getTopRatedTVShows = (page = 1) =>
  api.get('/tv/top_rated', { params: { page } });

// Multi-Search
export const searchMulti = (query, page = 1) =>
  api.get('/search/multi', { params: { query, page } });

// Search Movies
export const searchMovies = (query, page = 1) =>
  api.get('/search/movie', { params: { query, page } });

// Search TV Shows
export const searchTV = (query, page = 1) =>
  api.get('/search/tv', { params: { query, page } });

// Get Movie Details
export const getMovieDetails = (movieId) =>
  api.get(`/movie/${movieId}`, { params: { append_to_response: 'videos,credits' } });

// Get TV Show Details
export const getTVShowDetails = (tvId) =>
  api.get(`/tv/${tvId}`, { params: { append_to_response: 'videos,credits,seasons' } });

// Get Season Details
export const getSeasonDetails = (tvId, seasonNumber) =>
  api.get(`/tv/${tvId}/season/${seasonNumber}`);

// Get Genres
export const getMovieGenres = () => api.get('/genre/movie/list');
export const getTVGenres = () => api.get('/genre/tv/list');

// Image URL helper
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Trailer URL helper
export const getYouTubeUrl = (videoKey) => {
  return `https://www.youtube.com/embed/${videoKey}?autoplay=0`;
};

export default api;
