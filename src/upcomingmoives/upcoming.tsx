import React, { useState, useEffect, useContext, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayArrow, TrendingUp, Visibility } from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import firebase from '../service/firebase';
import LoginHeader from '../header/loginHeader';
import '../upcomingmoives/upcoming.css';
import common from '../service/common';
import AuthContext from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
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
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  // const { logout, isLoggedIn, user, isUserLoggedIn } = useContext(AuthContext)!;
  const location = useLocation();


  function getCurrentAndNextYearDates(): { current: string; nextYear: string } {
    const currentDate: Date = new Date();

    // Format current date as YYYY-MM-DD
    const currentFormatted: string = currentDate.toISOString().split('T')[0];

    // Calculate next year's same date
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
    // setName(user ? user.displayName || 'User' : 'Guest');
    // console.log(location.pathname);
    // isUserLoggedIn(location.pathname);
    fetchData();
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {location.pathname === '/viewMovies' ?
        // <LoginHeader name={user ? user.displayName || 'User' : 'Guest'} userPhoto={user ? user.photoURL : undefined} />
        <LoginHeader name={'Guest'} userPhoto={''} />
        : ""}
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            <TrendingUp /> Upcoming Movies
          </h1>
          <div className="title-underline"></div>
        </div>

        {/* Movies Carousel */}
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
            emulateTouch={false}
          >
            {movies.map((movie) => {
              const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
              const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';

              return (
                <div key={movie.id} className="carousel-item">
                  <div className="card">
                    <img
                      src={poster}
                      alt={movie.title}
                      className="card-image"
                    />
                    <div className="card-content">
                      <h3 className="card-title">{movie.title}</h3>
                      <div className="card-chips">
                        <span className="chip chip-primary">{releaseYear}</span>
                        <span className="chip chip-secondary">⭐ {movie.vote_average.toFixed(1)}</span>
                      </div>
                      <p className="card-description">
                        {movie.overview}
                      </p>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => viewMovie(movie.id)}
                      >
                        <Visibility /> View Trailer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>

        {/* Alternative Grid Layout for smaller screens */}
        <div className="grid-container">
          <div className="movie-grid">
            {movies.slice(0, 6).map((movie) => {
              const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
              const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';

              return (
                <div key={movie.id} className="grid-item">
                  <div className="card">
                    <img
                      src={poster}
                      alt={movie.title}
                      className="card-image"
                    />
                    <div className="card-content">
                      <h3 className="card-title-small">{movie.title}</h3>
                      <div className="card-chips">
                        <span className="chip">{releaseYear}</span>
                        <span className="chip chip-secondary">⭐ {movie.vote_average}</span>
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
      {location.pathname === '/viewMovies' ?
        // <LoginHeader name={user ? user.displayName || 'User' : 'Guest'} userPhoto={user ? user.photoURL : undefined} />
        <Footer />
        : ""}

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