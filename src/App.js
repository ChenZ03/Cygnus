import {Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Watchlist from './components/WatchList'
import News from './components/News'
import Forum from './components/Forum'
import Stock from './components/Stock'
import Search from './components/Search'
import './assets/css/App.css';

function App() {
  console.log = function () {};
  console.disableYellowBox = true;
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/watchList" element={<Watchlist />} />
          <Route path="/news" element={<News />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
      <div className="screen d-flex align-items-center justify-content-center">
        <h1>Sorry, your device isnt supported</h1>
      </div>
    </>
  );
}

export default App;
