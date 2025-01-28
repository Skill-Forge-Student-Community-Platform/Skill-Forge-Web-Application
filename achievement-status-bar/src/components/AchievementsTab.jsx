import "../styles/TrendingSection.css";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const TrendingSection = () => {
  const [trendingData, setTrendingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/trendingData.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTrendingData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (!trendingData) return <p>Loading...</p>;

  return (
    <div className="trending-section">
      {/* Leaderboard */}
      <Card className="trending-card">
        <h2 className="text-lg font-bold mb-2">🏆 Leaderboard</h2>
        {trendingData.leaderboard.map((user, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="leaderboard-entry"
          >
            <p>{user.name}</p>
            <p className="font-semibold">XP: {user.xp}</p>
          </motion.div>
        ))}
      </Card>

      {/* Highlighted Competitions */}
      <Card className="trending-card">
        <h2 className="text-lg font-bold mb-2">🔥 Highlighted Competitions</h2>
        {trendingData.competitions.map((comp, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }} className="competition-entry">
            <p className="competition-title">{comp.title}</p>
            <p className="text-sm text-gray-500">{comp.details}</p>
            <Button className="competition-button">Join Now</Button>
          </motion.div>
        ))}
      </Card>

      {/* Suggested Communities */}
      <Card className="trending-card">
        <h2 className="text-lg font-bold mb-2">🌍 Suggested Communities</h2>
        {trendingData.communities.map((comm, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }} className="community-entry">
            <p className="community-title">{comm.name}</p>
            <p className="community-description">{comm.description}</p>
            <Button className="trending-button">Join</Button>
          </motion.div>
        ))}
      </Card>
    </div>
  );
};

export default TrendingSection;