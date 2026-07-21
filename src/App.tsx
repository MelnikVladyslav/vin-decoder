import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Variables from './pages/Variables';
import VariableDetail from './pages/VariableDetail';
import './App.css';


function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>VIN Decoder</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/variables">Variables</a>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/variables" element={<Variables />} />
          <Route path="/variables/:variableId" element={<VariableDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
