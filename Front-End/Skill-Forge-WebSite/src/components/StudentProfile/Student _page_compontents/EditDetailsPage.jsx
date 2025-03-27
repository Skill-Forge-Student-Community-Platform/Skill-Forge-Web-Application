import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditDetailsPage = () => {
  const [details, setDetails] = useState({
    university: "University of Westminster",
    metroCampus: "Esoft Metro Campus, Piliyandala",
    school: "St. Sebastian's College, Moratuwa.",
    internationalSchool: "Alethea International School, Dehiwela, Sri Lanka.",
    home: "Galkissa, Sri Lanka",
    from: "Colombo, Sri Lanka",
    status: "Single",
    joined: "July 2022",
  });
  const navigate = useNavigate();

  const handleSave = () => {
    alert("Details updated successfully!");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Details</h2>
      <div className="space-y-4">
        {Object.keys(details).map((key) => (
          <input
            key={key}
            type="text"
            value={details[key]}
            onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        ))}
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditDetailsPage;
