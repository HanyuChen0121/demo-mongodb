import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Movies from './components/Movies';
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">   
          <Routes>
            <Route path="/" element={<Movies />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
