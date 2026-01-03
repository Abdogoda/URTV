import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo" onClick={handleNavClick}>
            <span className="logo-icon">📺</span>
            <span className="logo-text">URTV</span>
          </Link>
        </div>

        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>


        <nav className={`navbar ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={handleNavClick}>
            HOME
          </Link>
          <Link to="/movies" className={`nav-link ${isActive('/movies') ? 'active' : ''}`} onClick={handleNavClick}>
            MOVIES
          </Link>
          <Link to="/tvshows" className={`nav-link ${isActive('/tvshows') ? 'active' : ''}`} onClick={handleNavClick}>
            TV SHOWS
          </Link>
          <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`} onClick={handleNavClick}>
            ❤️ FAVORITES
          </Link>
          <Link to="/watchlist" className={`nav-link ${isActive('/watchlist') ? 'active' : ''}`} onClick={handleNavClick}>
            📋 WATCHLIST
          </Link>
          <form onSubmit={handleSearch} className="mobile-search-form">
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
