import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayArrow, TrendingUp, Visibility } from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import LoginHeader from '../header/loginHeader';
import '../upcomingmoives/upcoming.css';
import common from '../service/common';
import Footer from '../footer/footer';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
}

const Upcoming: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function getCurrentAndNextYearDates(): { current: string; nextYear: string } {
    const currentDate: Date = new Date();
    const currentFormatted: string = currentDate.toISOString().split('T')[0];
    
    const nextYearDate: Date = new Date(currentDate);
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    const nextYearFormatted: string = nextYearDate.toISOString().split('T')[0];

    return {
      current: currentFormatted,
      nextYear: nextYearFormatted
    };
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const dates = getCurrentAndNextYearDates();

      common.upcomingMovie(dates.current, dates.nextYear).then(async (response) => {
        const data = await response.json();
        setMovies(data.results || []);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      setLoading(false);
    }
  };

  const viewMovie = (id: number) => {
    navigate(`/viewMovie/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading upcoming movies...</p>
      </div>
    );
  }

  return (
    <div className="upcoming-page">
      {location.pathname === '/viewMovies' && (
        <LoginHeader name={'Guest'} userPhoto={''} />
      )}
      
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            <TrendingUp className="title-icon" /> Upcoming Movies
          </h1>
          <div className="title-underline"></div>
          <p className="subtitle">Discover the most anticipated films coming soon</p>
        </div>

        {/* Movies Carousel */}
        {movies.length > 0 && (
          <div className="carousel-container">
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              centerMode={true}
              centerSlidePercentage={33}
              emulateTouch={true}
              swipeable={true}
              className="upcoming-carousel"
            >
              {movies.map((movie) => {
                const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';

                return (
                  <div key={movie.id} className="carousel-item">
                    <div className="card">
                      <div className="card-image-container">
                        <img
                          src={poster}
                          alt={movie.title}
                          className="card-image"
                          loading="lazy"
                        />
                        <div className="card-overlay"></div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-title">{movie.title}</h3>
                        <div className="card-chips">
                          <span className="chip chip-primary">{releaseYear}</span>
                          <span className="chip chip-secondary">⭐ {movie.vote_average.toFixed(1)}</span>
                        </div>
                        <p className="card-description">
                          {movie.overview.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => viewMovie(movie.id)}
                        >
                          <Visibility /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}

        {/* Grid Layout for mobile */}
        <div className="grid-container">
          <h2 className="grid-title">Upcoming Movies</h2>
          <div className="movie-grid">
            {movies.slice(0, 6).map((movie) => {
              const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
              const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';

              return (
                <div key={movie.id} className="grid-item">
                  <div className="card">
                    <div className="card-image-container">
                      <img
                        src={poster}
                        alt={movie.title}
                        className="card-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title-small">{movie.title}</h3>
                      <div className="card-chips">
                        <span className="chip">{releaseYear}</span>
                        <span className="chip chip-secondary">⭐ {movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-small"
                        onClick={() => viewMovie(movie.id)}
                      >
                        <Visibility /> View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {location.pathname === '/viewMovies' && (
        <Footer />
      )}

      {/* Alert Snackbar */}
      {showAlert && (
        <div className="snackbar">
          <div className="alert alert-warning">
            <span>Please sign in to view movie details</span>
            <button className="alert-close" onClick={handleCloseAlert}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upcoming;