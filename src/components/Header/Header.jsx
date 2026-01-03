import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo">
            <span className="logo-icon">📺</span>
            <span className="logo-text">URTV</span>
          </Link>
        </div>

        <nav className="navbar">
          <Link to="/movies" className="nav-link">
            MOVIES
          </Link>
          <Link to="/tvshows" className="nav-link">
            TV SHOWS
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search movies, shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
