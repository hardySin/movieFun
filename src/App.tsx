import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Upcoming from './upcomingmoives/upcoming';
import NotFound from './movieView/NotFound';
import Home from './Home/Home';
import MovieDetails from './movieView/movieDetails';
// Update the import path to match the actual file name, e.g.:
import Account from './createAccount/createLogin';
import Related from './movieView/relatedMovie';
import { AuthProvider } from './context/AuthContext';
import Login from './createAccount/login';
import YouTubeGallery from './movieView/videoSection';
import MovieSearch from './movieView/movieSearch';
import WatchProviders from './upcomingmoives/watchproviders';
import ActorPage from './upcomingmoives/cast';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewMovie/:movieId/" element={<MovieDetails />} />
          <Route path="/relatedViewMovie/:movieId/" element={<MovieDetails />} />
          <Route path="/gallery/:movieId" element={<YouTubeGallery />} />
          <Route path="/actor/profile/:personId/" element={<ActorPage />} />
          <Route path="/viewMovies" element={<Upcoming />} />
          <Route path="/search/:genresId" element={<MovieSearch />} />
          <Route path="/provider/:movieId/" element={<WatchProviders />} />
          <Route path="/lastest" element={<Related />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;