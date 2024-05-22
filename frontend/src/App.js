import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import LandingPage from './App/Pages/landing';
import SignInPage from './App/Pages/signin';
import SignUpPage from './App/Pages/signup';
import ViewPage from './App/Pages/view';
import SearchPage from './App/Pages/search';
import ManualSelectionPage from './App/Pages/manualSelection';
import FlightSelectionPage from './App/Pages/flightSelection';

function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-item">Landing</Link>
        <Link to="/signIn" className="nav-item">Sign In</Link>
        <Link to="/signUp" className="nav-item">Sign Up</Link>
        <Link to="/view" className="nav-item">View</Link>
        <Link to="/search" className="nav-item">Search</Link>
        <Link to="/manualSelection" className="nav-item">Manual Selection</Link>
        <Link to="/flightSelection" className="nav-item">Flight Selection</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/manualSelection" element={<ManualSelectionPage />} />
        <Route path="/flightSelection" element={<FlightSelectionPage />} />
      </Routes>
    </div>
  );
}

export default App;
