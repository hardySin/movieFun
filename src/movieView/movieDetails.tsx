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
  X
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

  if (loading) {
    return (
      <div className="min-vh-100-movie d-flex-movie align-items-center-movie justify-content-center-movie">
        <div className="spinner-movie"></div>
        <span className="ms-3-movie">Loading movie details...</span>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="container-movie text-center-movie py-5-movie">
        <div className="error-icon-movie mb-3-movie">⚠️</div>
        <h3 className="text-danger-movie">Oops! Something went wrong</h3>
        <p className="text-muted-movie mb-4-movie">{error || 'Movie not found'}</p>
        <button className="btn-primary-movie" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2-movie" />
          Go Back
        </button>
      </div>
    );
  }

  const backdropPath = `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`;

  return (
    <>
      <LoginHeader name={displayName ?? ''} />

      {/* Hero Section */}
      <div className="movie-hero-movie">
        <div
          className="hero-backdrop-movie"
          style={{ backgroundImage: `url(${backdropPath})` }}
        >
          <div className="hero-overlay-movie">
            <div className="container-movie">
              <button
                className="back-btn-movie mb-4-movie"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="me-2-movie" />
                Back
              </button>

              <div className="hero-content-movie">
                <div className="hero-info-movie">
                  <span className="badge-primary-movie mb-3-movie">Now Streaming</span>
                  <h1 className="movie-title-movie">{movieDetails.title}</h1>

                  {movieDetails.tagline && (
                    <p className="movie-tagline-movie">{movieDetails.tagline}</p>
                  )}

                  <div className="movie-meta-movie">
                    <div className="meta-item-movie">
                      <StarFill className="text-warning-movie me-1-movie" />
                      <span>{movieDetails.vote_average.toFixed(1)}/10</span>
                    </div>

                    {movieDetails.runtime > 0 && (
                      <div className="meta-item-movie">
                        <Clock className="me-1-movie" />
                        <span>{formatRuntime(movieDetails.runtime)}</span>
                      </div>
                    )}

                    {movieDetails.release_date && (
                      <div className="meta-item-movie">
                        <Calendar className="me-1-movie" />
                        <span>{formatDate(movieDetails.release_date)}</span>
                      </div>
                    )}
                  </div>

                  <div className="hero-actions-movie">
                    {youTubeKey && (
                      <button
                        className="btn-primary-movie play-btn-movie"
                        onClick={playVideo}
                      >
                        <PlayFill className="me-2-movie" />
                        Watch Trailer
                      </button>
                    )}

                    <button onClick={() => moveToGallery(movieId)} className="btn-outline-movie">
                      Gallery
                    </button>

                    <button onClick={() => watchProvider(movieId)} className="btn-outline-movie">
                      MovieProvider
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-movie movie-content">
        <div className="tabs-movie">
          <div className="tab-headers-movie">
            <button
              className={activeTab === 'overview' ? 'tab-header-movie active-movie' : 'tab-header-movie'}
              onClick={() => setActiveTab('overview')}
            >
              <Chat className="me-2-movie" />Overview
            </button>
            <button
              className={activeTab === 'cast' ? 'tab-header-movie active-movie' : 'tab-header-movie'}
              onClick={() => setActiveTab('cast')}
            >
              <People className="me-2-movie" />Cast
            </button>
          </div>

          <div className="tab-content-movie">
            {activeTab === 'overview' && (
              <div className="tab-pane-movie">
                <div className="row-movie">
                  <div className="col-lg-8-movie">
                    <div className="card-movie overview-card-movie">
                      <div className="card-body-movie">
                        <h3 className="card-title-movie">Storyline</h3>
                        <p className="overview-text-movie">{movieDetails.overview}</p>

                        <div className="genres-section-movie">
                          <h5 className="section-title-movie">Genres</h5>
                          <div className="genres-list-movie">
                            {movieDetails.genres.map(genre => (
                              <span
                                key={genre.id}
                                className="badge-outline-movie"
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

                  <div className="col-lg-4-movie">
                    <div className="card-movie info-card-movie">
                      <div className="card-body-movie">
                        <h5 className="card-title-movie">Movie Details</h5>

                        <div className="info-item-movie">
                          <strong>Release Date:</strong>
                          <span>{formatDate(movieDetails.release_date)}</span>
                        </div>

                        {movieDetails.runtime > 0 && (
                          <div className="info-item-movie">
                            <strong>Runtime:</strong>
                            <span>{formatRuntime(movieDetails.runtime)}</span>
                          </div>
                        )}

                        <div className="info-item-movie">
                          <strong>Rating:</strong>
                          <span>
                            <StarFill className="text-warning-movie me-1-movie" />
                            {movieDetails.vote_average.toFixed(1)}/10
                          </span>
                        </div>

                        <div className="info-item-movie">
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
            )}

            {activeTab === 'cast' && (
              <div className="tab-pane-movie">
                <div className="card-movie">
                  <div className="card-body-movie">
                    <h3 className="card-title-movie">Cast</h3>
                    {cast.length > 0 ? (
                      <div className="cast-grid-movie">
                        {cast.slice(0, 18).map((member) => (
                          <div key={member.id} className="cast-member-movie" onClick={() => navigate(`/actor/profile/${member.id}`)}>
                            <div className="cast-image-movie">
                              <img
                                src={member.profile_path
                                  ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                                  : 'https://via.placeholder.com/300x450/2d3748/ffffff?text=No+Image'
                                }
                                alt={member.name}
                                className="member-photo-movie"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/300x450/2d3748/ffffff?text=No+Image';
                                }}
                              />
                            </div>
                            <div className="cast-info">
                              <h6 className="member-name-movie">{member.name}</h6>
                              <p className="member-character-movie">{member.character}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-movie">No cast information available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="card-movie">
          <div className="card-body-movie">
            <h3 className="card-title-movie">
              <Chat className="me-2-movie" />
              Discussion
            </h3>
            <Comment movieId={movieId ?? ''} />
          </div>
        </div>
      </div>




      {/* Trailer Modal */}
      {showTrailer && (
        <div className="modal-overlay-movie" onClick={handleCloseTrailer}>
          <div className="modal-content-movie" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-movie">
              <h3 className="modal-title-movie">
                <PlayFill className="me-2-movie" />
                {movieDetails.title} - Trailer
              </h3>
              <button className="modal-close-movie" onClick={handleCloseTrailer}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-movie">
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