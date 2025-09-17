import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayFill,
  StarFill,
  ArrowRight,
  Ticket,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';
import Upcoming from '../upcomingmoives/upcoming';
import Footer from '../footer/footer';
import Loader from '../loader/loader';
import '../Home/Home.css';
import LoginHeader from '../header/loginHeader';
import common from '../service/common';
import AuthContext from '../context/AuthContext';

interface Movie {
  id: number;
  title: string;
  rating: number;
  genre: string;
  duration: string;
  releaseDate: string;
  image: string;
  backdrop: string;
}

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadFeaturedMovies = () => {
    common.genreList().then(async (response) => {
      const data = await response.json();
      const genresMap: { [key: number]: string } = {};
      (data.genres || []).forEach((genre: any) => {
        genresMap[genre.id] = genre.name;
      });

      common.trendingMovies().then(async (response) => {
        const data = await response.json();
        const movies: Movie[] = (data.results || []).slice(0, 5).map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          rating: Math.round((movie.vote_average / 2) * 10) / 10,
          genre: movie.genre_ids.map((id: number) => genresMap[id]).join(', '),
          duration: '2h 15m',
          releaseDate: movie.release_date,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        }));
        setFeaturedMovies(movies);
      });
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  useEffect(() => {
    loadFeaturedMovies();
    setIsLoading(false);

    if (featuredMovies.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  if (isLoading) {
    return <Loader state={true} />;
  }

  const movieDetail = (movieId: any) => {
    navigate(`/viewMovie/${movieId}`);
  };

  return (
    <div className="home-page">
      <LoginHeader name={'Guest'} userPhoto={""} />

      {/* Hero Carousel Section */}
      <section className="hero-carousel-home">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`hero-slide-home ${index === currentSlide ? 'active-home' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${movie.backdrop})` }}
          >
            <div className="container">
              <div className="hero-content-home">
                <span className="hero-badge-home">🎬 Now Streaming</span>
                <h1 className="hero-title-home">{movie.title}</h1>
                <div className="hero-meta-home">
                  <span className="rating-home">
                    <StarFill className="star-icon-home" />
                    {movie.rating}/5
                  </span>
                  <span>{movie.genre}</span>
                  <span>{movie.duration}</span>
                </div>
                <p className="hero-description-home">
                  Experience the epic adventure that's captivating audiences worldwide.
                  Join the journey and discover why critics are calling it a masterpiece.
                </p>
                <div className="hero-actions-home">
                  <button onClick={() => movieDetail(movie.id)} className="btn-home btn-primary-home btn-lg">
                    <PlayFill className="me-2" />
                    Watch Now
                  </button>
                  <button onClick={() => movieDetail(movie.id)} className="btn-home btn-outline-light-home btn-lg">
                    <Ticket className="me-2" />
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button className="carousel-control-home prev-home" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="carousel-control-home next-home" onClick={nextSlide}>
          <ChevronRight />
        </button>
      </section>

      {/* Featured Movies Section */}
      <section id="featured" className="section-py-home">
        <div className="container">
          <div className="section-header-home">
            <h2 className="section-title-home">Featured Movies</h2>
            <p className="section-subtitle-home">Curated selection of must-watch films</p>
          </div>
          <div className="movies-grid-home">
            {featuredMovies.map((movie) => (
              <div key={movie.id} className="movie-card-home" onClick={()=>{navigate(`/viewMovie/${movie.id}`)}}>
                <div className="movie-poster-home">
                  <img src={movie.image} alt={movie.title} />
                  <div className="movie-overlay-home">
                    <button className="play-btn-home">
                      <PlayFill />
                    </button>
                    <span className="rating-badge-home">
                      <StarFill className="me-1" />
                      {movie.rating}
                    </span>
                  </div>
                </div>
                <div className="movie-info-home">
                  <h3 className="movie-title-home">{movie.title}</h3>
                  <div className="movie-meta-home">
                    <span>{movie.genre.split(',')[0]}</span>
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Movies Section */}
      <section id="upcoming" className="section-py-home">
        <div className="container">
          <div className="section-header-home">
            <h2 className="section-title-home">Coming Soon</h2>
            <p className="section-subtitle-home">Get ready for these exciting releases</p>
          </div>
          <Upcoming />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-home">
        
          <div className="cta-content-home">
            <h2>Ready to Start Your Movie Journey?</h2>
            <p>Join thousands of movie enthusiasts and explore a world of cinema</p>
            <div className="cta-actions-home">
              <button className="btn-home btn-light-home btn-lg">
                Learn More
              </button>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;