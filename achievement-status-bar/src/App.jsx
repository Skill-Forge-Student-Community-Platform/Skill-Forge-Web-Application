import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import AchievementsTab from "./components/AchievementsTab";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/achievements" element={<AchievementsTab />} />
      </Routes>
    </Router>
  );
};

export default App;