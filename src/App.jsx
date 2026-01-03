import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import TVShowDetails from './pages/TVShowDetails/TVShowDetails';
import SearchResults from './pages/SearchResults/SearchResults';
import MoviesPage from './pages/MoviesPage/MoviesPage';
import TVShowsPage from './pages/TVShowsPage/TVShowsPage';
import Favorites from './pages/Favorites/Favorites';
import WatchList from './pages/WatchList/WatchList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tvshows" element={<TVShowsPage />} />
            <Route path="/movie/:slug" element={<MovieDetails />} />
            <Route path="/tv/:slug" element={<TVShowDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlist" element={<WatchList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
