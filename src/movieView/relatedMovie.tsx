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

const RelatedMovies: React.FC = () => {
  const { movieId: paramMovieId } = useParams<{ movieId: string }>();
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      common.popularList().then(data => {
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
      } else {
        setError('No trailer available for this movie');
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setError('Failed to load trailer. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerMovie(null);
    setYoutubeKey("");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader state={true} />;
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

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchData} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

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
                    <div className="movie-overlay">
                      <div className="movie-rating">
                        <span className="rating-badge">
                          <StarFill className="rating-icon" />
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <div className="movie-actions">
                        <button
                          className="movie-action-btn movie-view-btn"
                          onClick={() => viewMovie(item.id)}
                        >
                          <Eye className="action-icon" />
                          View Details
                        </button>
                        <button
                          className="movie-action-btn movie-trailer-btn"
                          onClick={() => playTrailer(item.id)}
                        >
                          <PlayFill className="action-icon" />
                          Watch Trailer
                        </button>
                      </div>
                    </div>
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
                      <div className="meta-item">
                        <StarFill className="meta-icon" />
                        <span className="meta-text">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {item.overview && (
                      <p className="movie-overview">
                        {item.overview.length > 100
                          ? `${item.overview.substring(0, 100)}...`
                          : item.overview
                        }
                      </p>
                    )}
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
                {youtubeKey ? (
                  <YouTube videoId={youtubeKey} opts={opts} />
                ) : (
                  <div className="trailer-placeholder">
                    <p>Trailer not available</p>
                  </div>
                )}
              </div>
              <div className="trailer-movie-info">
                <div className="trailer-movie-poster">
                  <img
                    src={trailerMovie.poster_path 
                      ? `https://image.tmdb.org/t/p/w300${trailerMovie.poster_path}`
                      : 'https://via.placeholder.com/300x450/2d3748/ffffff?text=No+Image'
                    }
                    alt={trailerMovie.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x450/2d3748/ffffff?text=No+Image';
                    }}
                  />
                </div>
                <div className="trailer-movie-details">
                  <h4>{trailerMovie.title}</h4>
                  <p>{trailerMovie.overview || 'No overview available.'}</p>
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
                    onClick={() => {
                      closeTrailer();
                      viewMovie(trailerMovie.id);
                    }}
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