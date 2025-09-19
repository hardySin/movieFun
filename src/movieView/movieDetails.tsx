import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PlayFill,
  ArrowLeft,
  StarFill,
  Clock,
  Calendar,
  People,
  Chat,
  Share,
  X,
  Heart,
  Bookmark,
  Images,
  Ticket
} from 'react-bootstrap-icons';
import YouTube from 'react-youtube';
import LoginHeader from '../header/loginHeader';
import RelatedMovies from './relatedMovie';
import Comment from './commentSection';
import '../movieView/movieDetails.css';

interface Genre {
  id: number;
  name: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieDetails {
  backdrop_path: string;
  title: string;
  genres: Genre[];
  overview: string;
  vote_average: number;
  runtime: number;
  release_date: string;
  tagline: string;
  poster_path: string;
}

export default function ViewMovies() {
  const { movieId, displayName } = useParams<{
    movieId: string;
    displayName: string
  }>();
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [youTubeKey, setYouTubeKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);

  const opts = {
    height: '527',
    width: '100%',
    playerVars: {
      'autoplay': 1,
      'controls': 1,
      'rel': 0,
      'fs': 1,
      'modestbranding': 1,
      'showinfo': 0
    },
  };

  const fetchMovieDetails = async () => {
    if (!movieId) return;

    try {
      const movielink = `https://api.themoviedb.org/3/movie/${movieId}?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US`;
      const response = await fetch(movielink);

      if (!response.ok) throw new Error('Failed to fetch movie details');

      const data = await response.json();
      setMovieDetails(data);
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError('Failed to load movie details');
    }
  };

  const fetchCast = async () => {
    if (!movieId) return;

    try {
      const movielink = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=0612d44670c9d53eb57dd9ec885631d6`;
      const response = await fetch(movielink);

      if (!response.ok) throw new Error('Failed to fetch cast');
      const data = await response.json();
      console.log(data)

      setCast(data.cast || []);
    } catch (err) {
      console.error("Error fetching cast:", err);
      setError('Failed to load cast information');
    }
  };

  const fetchYouTubeVideo = async () => {
    if (!movieId) return;

    try {
      const movielink = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US`;
      const response = await fetch(movielink);

      if (!response.ok) throw new Error('Failed to fetch videos');

      const data = await response.json();
      const trailer = data.results?.find((video: any) =>
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      setYouTubeKey(trailer?.key || null);
    } catch (err) {
      console.error("Error fetching YouTube video:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchMovieDetails(),
          fetchCast(),
          fetchYouTubeVideo()
        ]);
      } catch (err) {
        setError('Failed to load movie data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  const playVideo = () => {
    if (youTubeKey) {
      setShowTrailer(true);
    }
  };

  const moveToGallery = (movieId: any) => {
    navigate(`/gallery/${movieId}`);
  };

  const watchProvider = (movieId: any) => {
    navigate(`/provider/${movieId}`);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleWatchlist = () => {
    setIsWatchlist(!isWatchlist);
  };

  const shareMovie = () => {
    if (navigator.share) {
      navigator.share({
        title: movieDetails?.title,
        text: `Check out ${movieDetails?.title} on our movie app!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="details-loading-container">
        <div className="details-spinner"></div>
        <span className="details-loading-text">Loading movie details...</span>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="details-error-container">
        <div className="details-error-icon">🎬</div>
        <h3 className="details-error-title">Oops! Something went wrong</h3>
        <p className="details-error-message">{error || 'Movie not found'}</p>
        <button className="details-primary-btn" onClick={() => navigate(-1)}>
          <ArrowLeft className="details-btn-icon" />
          Go Back
        </button>
      </div>
    );
  }

  const backdropPath = `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`;
  const posterPath = `https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`;

  return (
    <>
      <LoginHeader name={displayName ?? ''} />

      {/* Hero Section */}
      <div className="details-hero">
        <div
          className="details-hero-backdrop"
          style={{ backgroundImage: `url(${backdropPath})` }}
        >
          <div className="details-hero-overlay">
            <div className="details-container">
              <button
                className="details-back-btn"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="details-btn-icon" />
                Back
              </button>

              <div className="details-hero-content">
                <div className="details-hero-poster">
                  <img src={posterPath} alt={movieDetails.title} className="details-poster-img" />
                </div>
                
                <div className="details-hero-info">
                  <div className="details-status-badge">
                    <span className="details-status-text">Now Streaming</span>
                  </div>
                  
                  <h1 className="details-title">{movieDetails.title}</h1>

                  {movieDetails.tagline && (
                    <p className="details-tagline">{movieDetails.tagline}</p>
                  )}

                  <div className="details-meta">
                    <div className="details-meta-item">
                      <StarFill className="details-meta-icon rating" />
                      <span>{movieDetails.vote_average.toFixed(1)}/10</span>
                    </div>

                    {movieDetails.runtime > 0 && (
                      <div className="details-meta-item">
                        <Clock className="details-meta-icon" />
                        <span>{formatRuntime(movieDetails.runtime)}</span>
                      </div>
                    )}

                    {movieDetails.release_date && (
                      <div className="details-meta-item">
                        <Calendar className="details-meta-icon" />
                        <span>{formatDate(movieDetails.release_date)}</span>
                      </div>
                    )}
                  </div>

                  <div className="details-action-buttons">
                    {youTubeKey && (
                      <button
                        className="details-primary-btn details-trailer-btn"
                        onClick={playVideo}
                      >
                        <PlayFill className="details-btn-icon" />
                        Watch Trailer
                      </button>
                    )}

                    <button className="details-secondary-btn" onClick={toggleFavorite}>
                      <Heart className={`details-btn-icon ${isFavorite ? 'favorite' : ''}`} />
                      {isFavorite ? 'Liked' : 'Like'}
                    </button>

                    <button className="details-secondary-btn" onClick={toggleWatchlist}>
                      <Bookmark className={`details-btn-icon ${isWatchlist ? 'watchlist' : ''}`} />
                      Watchlist
                    </button>

                    <button className="details-secondary-btn" onClick={shareMovie}>
                      <Share className="details-btn-icon" />
                      Share
                    </button>
                  </div>

                  <div className="details-quick-actions">
                    <button onClick={() => moveToGallery(movieId)} className="details-quick-action-btn">
                      <Images className="details-quick-action-icon" />
                      Gallery
                    </button>

                    <button onClick={() => watchProvider(movieId)} className="details-quick-action-btn">
                      <Ticket className="details-quick-action-icon" />
                      Where to Watch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="details-content-container">
        <div className="details-container">
          <div className="details-tabs">
            <div className="details-tab-headers">
              <button
                className={activeTab === 'overview' ? 'details-tab-header active' : 'details-tab-header'}
                onClick={() => setActiveTab('overview')}
              >
                <Chat className="details-tab-icon" />
                <span>Overview</span>
              </button>
              <button
                className={activeTab === 'cast' ? 'details-tab-header active' : 'details-tab-header'}
                onClick={() => setActiveTab('cast')}
              >
                <People className="details-tab-icon" />
                <span>Cast</span>
              </button>
            </div>

            <div className="details-tab-content">
              {activeTab === 'overview' && (
                <div className="details-tab-pane">
                  <div className="details-content-grid">
                    <div className="details-main-content">
                      <div className="details-card">
                        <div className="details-card-body">
                          <h3 className="details-card-title">Storyline</h3>
                          <p className="details-overview">{movieDetails.overview}</p>

                          <div className="details-genres-section">
                            <h4 className="details-section-title">Genres</h4>
                            <div className="details-genres-list">
                              {movieDetails.genres.map(genre => (
                                <span
                                  key={genre.id}
                                  className="details-genre-tag"
                                  onClick={() => { navigate(`/search/${genre.id}`) }}
                                >
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="details-sidebar">
                      <div className="details-card">
                        <div className="details-card-body">
                          <h4 className="details-card-title">Movie Details</h4>

                          <div className="details-info-list">
                            <div className="details-info-item">
                              <strong>Release Date:</strong>
                              <span>{formatDate(movieDetails.release_date)}</span>
                            </div>

                            {movieDetails.runtime > 0 && (
                              <div className="details-info-item">
                                <strong>Runtime:</strong>
                                <span>{formatRuntime(movieDetails.runtime)}</span>
                              </div>
                            )}

                            <div className="details-info-item">
                              <strong>Rating:</strong>
                              <span>
                                <StarFill className="details-rating-icon" />
                                {movieDetails.vote_average.toFixed(1)}/10
                              </span>
                            </div>

                            <div className="details-info-item">
                              <strong>Genres:</strong>
                              <span>
                                {movieDetails.genres.map(g => g.name).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cast' && (
                <div className="details-tab-pane">
                  <div className="details-card">
                    <div className="details-card-body">
                      <h3 className="details-card-title">Cast</h3>
                      {cast.length > 0 ? (
                        <div className="details-cast-grid">
                          {cast.slice(0, 18).map((member) => (
                            <div key={member.id} className="details-cast-member" onClick={() => navigate(`/actor/profile/${member.id}`)}>
                              <div className="details-cast-image">
                                <img
                                  src={member.profile_path
                                    ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                                    : 'https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Image'
                                  }
                                  alt={member.name}
                                  className="details-cast-photo"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Image';
                                  }}
                                />
                                <div className="details-cast-overlay">
                                  <span className="details-cast-view">View Profile</span>
                                </div>
                              </div>
                              <div className="details-cast-info">
                                <h6 className="details-cast-name">{member.name}</h6>
                                <p className="details-cast-character">{member.character}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="details-no-cast">No cast information available.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="details-card">
            <div className="details-card-body">
              <h3 className="details-card-title">
                <Chat className="details-card-title-icon" />
                Discussion
              </h3>
              <Comment movieId={movieId ?? ''} />
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="details-modal-overlay" onClick={handleCloseTrailer}>
          <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <h3 className="details-modal-title">
                <PlayFill className="details-modal-title-icon" />
                {movieDetails.title} - Trailer
              </h3>
              <button className="details-modal-close" onClick={handleCloseTrailer}>
                <X size={24} />
              </button>
            </div>
            <div className="details-modal-body">
              {youTubeKey && (
                <YouTube videoId={youTubeKey} opts={opts} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}