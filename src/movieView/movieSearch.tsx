import React, { useState, useEffect } from 'react';
import {
    PlayFill,
    StarFill,
    Clock,
    Calendar,
    Search,
    Grid,
    List
} from 'react-bootstrap-icons';
import '../movieView/movieSearch.css';
import common from '../service/common';
import { useNavigate, useParams } from 'react-router-dom';

// Define TypeScript interfaces
interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    overview: string;
    genre_ids: number[];
    genres?: Genre[];
}

interface Genre {
    id: number;
    name: string;
}

interface SearchResults {
    results: Movie[];
    total_pages: number;
    total_results: number;
}

const MovieSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const navigate = useNavigate();
    const { genresId } = useParams<{ genresId: string; }>();
    const genreIdNum = genresId ? parseInt(genresId, 10) : null;
    // Fetch genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    'https://api.themoviedb.org/3/genre/movie/list?api_key=0612d44670c9d53eb57dd9ec885631d6&language=en-US'
                );
                const data = await response.json();
                setGenres(data.genres || []);
            } catch (err) {
                console.error('Error fetching genres:', err);
            }
        };

        fetchGenres();
    }, []);

    // Search movies function
    const searchMovies = async (query: string) => {
        if (!query.trim()) {
            setMovies([]);
        }

        setLoading(true);
        setError(null);

        try {
            const response = await common.searchMovies(encodeURIComponent(query))
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data: SearchResults = await response.json();

            // Add genre names to movies
            const moviesWithGenres = data.results.map(movie => ({
                ...movie,
                genres: movie.genre_ids.map(id => genres.find(g => g.id === id)).filter(Boolean) as Genre[]
            }));
            setMovies(moviesWithGenres);
        } catch (err) {
            setError('Failed to search movies. Please try again.');
            console.error('Error searching movies:', err);
        } finally {
            setLoading(false);
        }
    };


    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await common.trendingMovies();

            if (!response.ok) {
                throw new Error('Failed to fetch trending movies');
            }

            const data = await response.json();
            console.log(data.results.length)
            // Add genre names to movies
            const moviesWithGenres = data.results
            // Filter by genre if genreId is provided
            if (genreIdNum) {
                const updatedWithGenres = moviesWithGenres.filter((movie: any) =>
                    movie.genre_ids.includes(genreIdNum)
                );
                console.log(updatedWithGenres.length)
                setMovies(updatedWithGenres);
            } else {
                setMovies(moviesWithGenres);
            }

        } catch (error) {
            console.error("Error fetching trending movies:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change with debounce
    useEffect(() => {
        if (!searchQuery) {
            console.log("id", genreIdNum)
            fetchData()
            return
        }
        const timer = setTimeout(() => {
            searchMovies(searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, genreIdNum]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const openMovieDetails = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const closeMovieDetails = () => {
        setSelectedMovie(null);
    };

    const viewDetails = (movieId: any) => {
        navigate(`/viewMovie/${movieId}`);
    };

    return (
        <div className="movie-search-container">
            <div className="search-header">
                <h1 className='typing'>Search Movies</h1>
                <p>Discover your next favorite movie</p>

                <div className="search-controls">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for ..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>

                    <div className="view-toggle">
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid />
                        </button>
                        <button
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                        >
                            <List />
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Searching movies...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && searchQuery && movies.length === 0 && (
                <div className="no-results">
                    <p>No movies found for "{searchQuery}"</p>
                </div>
            )}

            {!loading && !error && movies.length > 0 && (
                <>
                    <div className="results-info">
                        <p>Found {movies.length} results for "{searchQuery}"</p>
                    </div>

                    <div className={`movies-container ${viewMode}`}>
                        {movies.map(movie => (
                            <div
                                key={movie.id}
                                className="movie-card-search"
                                onClick={() => openMovieDetails(movie)}
                            >
                                <div className="movie-poster-search">
                                    <img
                                        src={movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : 'https://via.placeholder.com/500x750/2d3748/ffffff?text=No+Image'
                                        }
                                        alt={movie.title}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/500x750/2d3748/ffffff?text=No+Image';
                                        }}
                                    />
                                    <div className="movie-overlay">
                                        <div className="movie-rating">
                                            <span className="rating-badge">
                                                <StarFill className="rating-icon" />
                                                {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                        <button className="play-button">
                                            <PlayFill />
                                        </button>
                                    </div>
                                </div>

                                <div className="movie-info">
                                    <h3 className="movie-title">{movie.title}</h3>

                                    <div className="movie-meta">
                                        {movie.release_date && (
                                            <div className="meta-item">
                                                <Calendar className="meta-icon" />
                                                <span>{formatDate(movie.release_date)}</span>
                                            </div>
                                        )}

                                        <div className="meta-item">
                                            <Clock className="meta-icon" />
                                            <span>120 min</span>
                                        </div>
                                    </div>

                                    {movie.genres && movie.genres.length > 0 && (
                                        <div className="movie-genres">
                                            {movie.genres.slice(0, 3).map(genre => (
                                                <span key={genre.id} className="genre-tag">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {movie.overview && (
                                        <p className="movie-overview">
                                            {movie.overview.length > 100
                                                ? `${movie.overview.substring(0, 100)}...`
                                                : movie.overview
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {selectedMovie && (
                <div className="movie-modal" onClick={closeMovieDetails}>
                    <div className="modal-content-search" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-search">
                            <h2>{selectedMovie.title}</h2>
                            <button className="close-button" onClick={closeMovieDetails}>
                                &times;
                            </button>
                        </div>

                        <div className="modal-body-search">
                            <div className="modal-poster">
                                <img
                                    src={selectedMovie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                                        : 'https://via.placeholder.com/500x750/2d3748/ffffff?text=No+Image'
                                    }
                                    alt={selectedMovie.title}
                                />
                            </div>

                            <div className="modal-details">
                                <div className="detail-item">
                                    <strong>Release Date:</strong>
                                    <span>{formatDate(selectedMovie.release_date)}</span>
                                </div>

                                <div className="detail-item">
                                    <strong>Rating:</strong>
                                    <span>
                                        <StarFill className="rating-icon" />
                                        {selectedMovie.vote_average.toFixed(1)}/10
                                    </span>
                                </div>

                                {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                                    <div className="detail-item">
                                        <strong>Genres:</strong>
                                        <div className="genres-list">
                                            {selectedMovie.genres.map(genre => (
                                                <span key={genre.id} className="genre-tag">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="detail-item overview">
                                    <strong>Overview:</strong>
                                    <p>{selectedMovie.overview}</p>
                                </div>

                                <div className="modal-actions">
                                    <button onClick={() => viewDetails(selectedMovie.id)} className="action-button primary">
                                        <PlayFill /> Watch Details
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieSearch;