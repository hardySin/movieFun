const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`
    }
};

const upcomingMovie = async (minDate: string, maxDate: string) => {
    return await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte=${minDate}&release_date.lte=${maxDate}`, options)
};

const lastestMovie = async () => {
    return await fetch('https://api.themoviedb.org/3/movie/latest', options)
};

const trendingMovies = async () => {
    return await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
};

const genreList = async () => {
    return await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
};

const popularList = async () => {
    return await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, options)
};


const moviesVideos = async (movieId: string) => {
    return await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, options)
};

const searchMovies = async (movieName: string) => {
    return await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&query=${movieName}&page=1&include_adult=false`, options)
};

const watchProvider = async (movieId: string) => {
    return await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, options)
};

const actorProfile = async (personId: string) => {
    return await fetch(`https://api.themoviedb.org/3/person/${personId}?language=en-US`, options)
};

export default { upcomingMovie, lastestMovie, trendingMovies, genreList, popularList, moviesVideos, searchMovies, watchProvider, actorProfile };