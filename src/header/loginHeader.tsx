import React, { useContext, useEffect, useState } from 'react';
import {
  PersonCircle,
  BoxArrowRight,
  BoxArrowInRight,
  PersonPlus,
  Search,
  List,
  House,
  Film,
  Star,
  XLg,
  CameraReels
} from 'react-bootstrap-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './loginHeader.css';
import { TrendingUp } from '@mui/icons-material';

interface LoginHeaderProps {
  name: string;
  userPhoto?: string;
}

function LoginHeader({ name, userPhoto }: LoginHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, isLoggedIn, user, isUserLoggedIn } = useContext(AuthContext)!;
  useEffect(() => {

    console.log("LoginHeader mounted, isLoggedIn:", isLoggedIn);
  }, []);


  const logoutSession = async () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="login-header-container">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="header-brand">
          <a href="/" className="brand-link">
            <CameraReels className="brand-icon" />
            <span className="brand-text">MovieFun</span>
          </a>
        </div>

        {/* Navigation Links - Desktop */}

        <nav className="header-nav desktop-nav">
          <button
            className={`nav-link ${isActive('/viewMovies') ? 'active' : ''}`}
            onClick={() => navigateTo('/viewMovies')}
          >
            <Film className="nav-icon" />
            <span className="nav-text">Upcoming Movies</span>
          </button>

          <button
            className={`nav-link ${isActive('/lastest') ? 'active' : ''}`}
            onClick={() => navigateTo('/lastest')}
          >
            <TrendingUp className="nav-icon" />
            <span className="nav-text">Trending Movies</span>
          </button>
          {/* <button
            className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
            onClick={() => navigateTo('/movies')}
          >
            <Film className="nav-icon" />
            <span className="nav-text">Movies</span>
          </button>
          <button
            className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
            onClick={() => navigateTo('/favorites')}
          >
            <Star className="nav-icon" />
            <span className="nav-text">Favorites</span>
          </button> */}
        </nav>


        {/* Search Bar */}
        <div className={`header-search ${searchOpen ? 'search-open' : ''}`}>
          <form onSubmit={handleSearch} className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for ..."
              className="search-input"
              value={searchQuery}
              onClick={() => navigate('/search/28')}
            />
            {searchOpen && (
              <button
                type="button"
                className="search-close"
                onClick={() => setSearchOpen(false)}
              >
                <XLg />
              </button>
            )}
          </form>
        </div>

        {/* User Actions */}
        <div className="header-actions">
          {/* Search Toggle Button - Mobile */}
          <button
            className="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search />
          </button>

          {/* {isLoggedIn ? ( */}
          {/* <div className="user-menu">
                <button className="user-btn">
                  {userPhoto ? (
                    <img src={userPhoto} alt={name} className="user-avatar" />
                  ) : (
                    <PersonCircle className="user-icon" />
                  )}
                  <span className="user-name">{name}</span>
                </button>
                <div className="user-dropdown">
                  <button className="dropdown-item" onClick={() => navigateTo('/profile')}>
                    <PersonCircle />
                    <span>Profile</span>
                  </button>
                  <button className="dropdown-item" onClick={logoutSession}>
                    <BoxArrowRight />
                    <span>Logout</span>
                  </button>
                </div>
              </div> */}

          {/* // ) : (
          //   // Show login and signup buttons when user is not logged in
          //   <div className="auth-buttons">
          //     <button className="login-btn-header" onClick={handleLogin}>
          //       <BoxArrowInRight className="login-icon" />
          //       <span>Login</span>
          //     </button>
          //     <button className="signup-btn-header" onClick={handleSignup}>
          //       <PersonPlus className="signup-icon" />
          //       <span>Sign Up</span>
          //     </button>
          //   </div>
          // )} */}

          {/* Mobile Menu Toggle */}
          <button
            className="header-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <XLg className="toggle-icon" /> : <List className="toggle-icon" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}

      <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
        <nav className="mobile-nav-links">
          <button
            className={`mobile-nav-link ${isActive('/viewMovies') ? 'active' : ''}`}
            onClick={() => navigateTo('/viewMovies')}
          >
            <Film className="nav-icon" />
            <span className="nav-text">Upcoming Movies</span>
          </button>

          <button
            className={`mobile-nav-link ${isActive('/lastest') ? 'active' : ''}`}
            onClick={() => navigateTo('/lastest')}
          >
            <TrendingUp className="nav-icon" />
            <span className="nav-text">Trending Movies</span>
          </button>
          {/* <>
            <button
              className={`mobile-nav-link ${isActive('/viewMovies') ? 'active' : ''}`}
              onClick={() => navigateTo('/viewMovies')}
            >
              <House className="nav-icon" />
              <span className="nav-text">Home</span>
            </button>
            <button
              className={`mobile-nav-link ${isActive('/movies') ? 'active' : ''}`}
              onClick={() => navigateTo('/movies')}
            >
              <Film className="nav-icon" />
              <span className="nav-text">Movies</span>
            </button>
            <button
              className={`mobile-nav-link ${isActive('/favorites') ? 'active' : ''}`}
              onClick={() => navigateTo('/favorites')}
            >
              <Star className="nav-icon" />
              <span className="nav-text">Favorites</span>
            </button>
          </> */}

          {/* {!isLoggedIn && (
            <>
              <button
                className="mobile-nav-link"
                onClick={handleLogin}
              >
                <BoxArrowInRight className="nav-icon" />
                <span className="nav-text">Login</span>
              </button>
              <button
                className="mobile-nav-link"
                onClick={handleSignup}
              >
                <PersonPlus className="nav-icon" />
                <span className="nav-text">Sign Up</span>
              </button>
            </>
          )} */}
        </nav>
      </div>
    </header>
  );
}

export default LoginHeader;