import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Friends from './pages/Friends';
import Save from './pages/Save';
import Sidebar from './sidebar/Sidebar';

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar/>
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
