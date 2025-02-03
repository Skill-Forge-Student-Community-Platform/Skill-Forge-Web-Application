import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Friends from './pages/Friends';
import Save from './pages/Save';
import QuickSettings from './pages/QuickSettings';
import ProfileDashboard from './pages/ProfileDashboard';
import Sidebar from './sidebar component/Sidebar';

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar/>
          <Routes>
            <Route path="/pages/events" element={<Events/>}></Route>
            <Route path="/pages/friends" element={<Friends/>}></Route>
            <Route path="/pages/save" element={<Save/>}></Route>
            <Route path="/pages/quick_settings" element={<QuickSettings/>}></Route>
            <Route path="/pages/profile_dashboard" element={<ProfileDashboard/>}></Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
