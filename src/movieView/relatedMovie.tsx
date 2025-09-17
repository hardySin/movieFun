import React, { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  PlayFill,
  Eye,
  StarFill,
  Clock,
  Calendar,
  ArrowRight,
  Heart,
  HeartFill,
  X
} from 'react-bootstrap-icons';
import '../movieView/relatedMovie.css';
import common from '../service/common';
import Loader from '../loader/loader';
import YouTube from 'react-youtube';
import LoginHeader from '../header/loginHeader';
import Footer from '../footer/footer';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

interface RelatedMoviesProps {
  movieId?: string;
  displayName?: string;
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({ movieId: propMovieId, displayName: propDisplayName }) => {
  const { movieId: paramMovieId, displayName: paramDisplayName } = useParams<{
    movieId: string;
    displayName: string;
  }>();

  const movieId = propMovieId || paramMovieId;
  const displayName = propDisplayName || paramDisplayName;

  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [favorites, setFavorites] = useState<number[]>([]);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [youtubeKey, setYoutubeKey] = useState<string>("");
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };
  // useEffect(() => {
  //   // Load favorites from localStorage
  //   // const storedFavorites = localStorage.getItem('favoriteMovies');
  //   // if (storedFavorites) {
  //   //   setFavorites(JSON.parse(storedFavorites));
  //   // }
  // }, []);

  const fetchData = async () => {
    if (!movieId) return;

    setLoading(true);
    setError(null);

    try {
      common.popularList(movieId).then(data => {
        return data.json();
      }).then(data => {
        setSimilar(data.results || []);
      }).catch(err => {
        console.error("Error fetching similar movies:", err);
        setError('Failed to load similar movies. Please try again later.');
      }).finally(() => {
        setLoading(false);
      });
    } catch (err) {
      console.error("Error fetching similar movies:", err);
      setError('Failed to load similar movies. Please try again later.');
      setLoading(false);
    }
  };

  const viewMovie = (id: number) => {
    navigate(`/relatedViewMovie/${id}`);
  };

  // const toggleFavorite = (id: number) => {
  //   const updatedFavorites = favorites.includes(id)
  //     ? favorites.filter(favId => favId !== id)
  //     : [...favorites, id];

  //   setFavorites(updatedFavorites);
  //   localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
  // };

  const playTrailer = async (relatedMovieId: number) => {

    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${relatedMovieId}/videos?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US`);
      if (!response.ok) throw new Error('Failed to fetch videos');

      const data = await response.json();
      const trailer = data.results?.find((video: any) =>
        video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (trailer) {
        setYoutubeKey(trailer?.key);
        setShowTrailer(true);
        setTrailerMovie(similar.find(movie => movie.id === relatedMovieId) || null);
        // Set the trailer URL
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }

  };


  useEffect(() => {
    fetchData();
  }, [movieId]);


  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerMovie(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Loader state={true} />
    );
  }

  return (
    <>
      <LoginHeader name={'Guest'} userPhoto={''} />

      <div className="related-movies-section">
        <div className="related-header">
          <h2 className="related-title">
            <StarFill className="related-title-icon" />
            You Might Also Like
          </h2>
          <p className="related-subtitle">
            Discover more movies similar to this one
          </p>
        </div>

        {similar.length > 0 ? (
          <div className="movies-grid">
            {similar.map((item) => {
              if (!item.poster_path) return null;

              const poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`;

              return (
                <div key={item.id} className="movie-card">
                  <div className="movie-image-container">
                    <img
                      src={poster_path}
                      alt={item.title}
                      className="movie-poster"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/500x750/2d3748/ffffff?text=No+Image';
                      }}
                    />
                    {/* <div className="movie-overlay">
                    <div className="movie-rating">
                      <span className="rating-badge">
                        <StarFill className="rating-icon" />
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <button
                      className={`favorite-btn ${favorites.includes(item.id) ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(item.id)}
                      aria-label={favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(item.id) ? <HeartFill /> : <Heart />}
                    </button>
                    <div className="movie-actions">
                      <button
                        className="movie-action-btn movie-view-btn"
                        onClick={() => viewMovie(item.id, item.title)}
                      >
                        <Eye className="action-icon" />
                        View Details
                      </button>
                      <button
                        className="movie-action-btn movie-trailer-btn"
                        onClick={() => playTrailer(item)}
                      >
                        <PlayFill className="action-icon" />
                        Watch Trailer
                      </button>
                    </div>
                  </div> */}
                  </div>
                  <div className="movie-card-body">
                    <h3 className="movie-title" title={item.title}>
                      {item.title}
                    </h3>
                    <div className="movie-meta">
                      {item.release_date && (
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span className="meta-text">
                            {formatDate(item.release_date)}
                          </span>
                        </div>
                      )}
                      {/* <div className="meta-item">
                      <Clock className="meta-icon" />
                      <span className="meta-text">120 min</span>
                    </div> */}
                    </div>
                    {item.overview && (
                      <p className="movie-overview">
                        {item.overview.length > 100
                          ? `${item.overview.substring(0, 100)}...`
                          : item.overview
                        }
                      </p>
                    )}
                    <div className="movie-card-footer">
                      <button
                        className="view-details-btn"
                        onClick={() => viewMovie(item.id)}
                      >
                        View <ArrowRight className="btn-icon" />
                      </button>
                      <button
                        className="watch-trailer-btn"
                        onClick={() => playTrailer(item.id)}
                      >
                        <PlayFill className="btn-icon" />
                        Trailer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="related-empty">
            <div className="empty-icon">🎬</div>
            <h4 className="empty-title">No Similar Movies Available</h4>
            <p className="empty-message">
              We couldn't find any movies similar to this one.
            </p>
            <button
              className="empty-browse-btn"
              onClick={() => navigate('/movies')}
            >
              <ArrowRight className="browse-icon" />
              Browse All Movies
            </button>
          </div>
        )}

        {/* Trailer Modal */}
        {showTrailer && trailerMovie && (
          <div className="trailer-modal">
            <div className="trailer-modal-content">
              <button className="trailer-close-btn" onClick={closeTrailer}>
                <X />
              </button>
              <div className="trailer-header">
                <h3>{trailerMovie.title} - Trailer</h3>
              </div>
              <div className="trailer-video-container">
                <div className="trailer-placeholder">

                  {youtubeKey && (
                    <YouTube videoId={youtubeKey} opts={opts} />
                  )}
                </div>
              </div>
              <div className="trailer-movie-info">
                <div className="trailer-movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${trailerMovie.poster_path}`}
                    alt={trailerMovie.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x450/2d3748/ffffff?text=No+Image';
                    }}
                  />
                </div>
                <div className="trailer-movie-details">
                  <h4>{trailerMovie.title}</h4>
                  <p>{trailerMovie.overview}</p>
                  <div className="trailer-movie-meta">
                    <span className="trailer-rating">
                      <StarFill /> {trailerMovie.vote_average.toFixed(1)}
                    </span>
                    {trailerMovie.release_date && (
                      <span className="trailer-year">
                        {new Date(trailerMovie.release_date).getFullYear()}
                      </span>
                    )}
                  </div>
                  <button
                    className="view-movie-btn"
                    onClick={() => viewMovie(trailerMovie.id)}
                  >
                    View Movie Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default RelatedMovies;