import React from 'react';
import {
  EmojiFrown,
  House,
  Search,
  ArrowCounterclockwise,
  Film
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import '../movieView/NotFound.css';

const View404: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearchMovies = () => {
    navigate('/movies');
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-row">
          <div className="error-col">
            <div className="error-card">
              <div className="error-card-body">
                {/* Animated Icon */}
                <div className="error-icon">
                  <div className="icon-wrapper">
                    <EmojiFrown className="error-icon-main" />
                    <div className="pulse-effect"></div>
                  </div>
                </div>

                {/* Error Code */}
                <h1 className="error-code">404</h1>

                {/* Error Message */}
                <h2 className="error-title">
                  Oops! Page Not Found
                </h2>

                <p className="error-message">
                  It looks like you've wandered off the red carpet. The page you're looking for
                  doesn't exist or has been moved. Let's get you back to the show!
                </p>

                {/* Action Buttons */}
                <div className="error-actions">
                  <button
                    className="error-btn error-btn-primary"
                    onClick={handleGoHome}
                  >
                    <House className="btn-icon" />
                    Go Home
                  </button>

                  <button
                    className="error-btn error-btn-outline"
                    onClick={handleGoBack}
                  >
                    <ArrowCounterclockwise className="btn-icon" />
                    Go Back
                  </button>

                  <button
                    className="error-btn error-btn-secondary"
                    onClick={handleSearchMovies}
                  >
                    <Search className="btn-icon" />
                    Browse Movies
                  </button>
                </div>

                {/* Additional Help */}
                <div className="error-help">
                  <p className="error-help-text">While you're here, why not...</p>
                  <div className="error-help-items">
                    <div className="help-item">
                      <Film className="help-icon" />
                      <small>Check out new releases</small>
                    </div>
                    <div className="help-item">
                      <Search className="help-icon" />
                      <small>Search for your favorite movies</small>
                    </div>
                    <div className="help-item">
                      <House className="help-icon" />
                      <small>Explore our homepage</small>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="error-decoration">
                  <div className="decoration-item decoration-1"></div>
                  <div className="decoration-item decoration-2"></div>
                  <div className="decoration-item decoration-3"></div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="error-footer">
              <p className="error-footer-text">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@moviefun.com" className="error-footer-link">
                  support@moviefun.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View404;