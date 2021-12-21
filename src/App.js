import {Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Watchlist from './components/WatchList'
import './assets/css/App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watchList" element={<Watchlist />} />
      </Routes>
    </div>
  );
}

export default App;
