import React, { useEffect } from 'react';
import useCompetitionStore from '../store/useCompetitionStore';

const TrendingCompetitions = () => {
  const { trendingCompetitions, getTrendingCompetitions, loading, error } = useCompetitionStore();

  useEffect(() => {
    getTrendingCompetitions();
  }, []);

  if (loading) return <p>Loading competitions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">🔥 Trending Competitions</h2>
      {trendingCompetitions.length === 0 ? (
        <p>No trending competitions found.</p>
      ) : (
        <ul>
          {trendingCompetitions.map((comp) => (
            <li key={comp._id} className="border-b py-2">
              <h3 className="text-lg font-semibold">{comp.title}</h3>
              <p className="text-gray-600">{comp.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(comp.startDate).toDateString()} - {new Date(comp.endDate).toDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingCompetitions;
