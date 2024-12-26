import './App.css';
import Section1 from './sidebar section-one/Section-one';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Friends from './pages/Friends';
import Save from './pages/Save';

function App() {
  return (
    <div className="App">
      <Router>
        <Section1/>
          <Routes>
            <Route path="/pages/events" element={<Events/>}></Route>
            <Route path="/pages/friends" element={<Friends/>}></Route>
            <Route path="/pages/save" element={<Save/>}></Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
