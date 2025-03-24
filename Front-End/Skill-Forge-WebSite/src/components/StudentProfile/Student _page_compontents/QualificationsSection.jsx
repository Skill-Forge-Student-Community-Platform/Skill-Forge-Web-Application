import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QualificationsSection = () => {
  const navigate = useNavigate();
  const [qualifications, setQualifications] = useState([]);

  useEffect(() => {
    // ✅ Default qualifications (Preloaded)
    const defaultQualifications = [
      { type: "Academic", status: "Verified" },
      { type: "Job Experience", status: "Verified" },
      { type: "Academic", status: "Verified" },
      { type: "Job Experience", status: "Verified" },
    ];

    // ✅ Load saved qualifications from localStorage
    const savedQualifications = JSON.parse(localStorage.getItem("qualifications")) || [];

    // ✅ Prevent duplicates by checking if defaultQualifications already exist
    const isDefaultAlreadyAdded = savedQualifications.some((q) =>
      defaultQualifications.some((defaultQ) => defaultQ.type === q.type)
    );

    // ✅ If default qualifications are not already stored, add them once
    if (!isDefaultAlreadyAdded) {
      const updatedQualifications = [...defaultQualifications, ...savedQualifications];

      // ✅ Save to localStorage
      localStorage.setItem("qualifications", JSON.stringify(updatedQualifications));
      setQualifications(updatedQualifications);
    } else {
      setQualifications(savedQualifications);
    }
  }, []);

  const handleAdd = () => {
    navigate("/profile/add-certificate");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Certifications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {qualifications.map((q, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 bg-green-100 rounded-full inline-block mx-6 my-1 px-3 py-1">Verified</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

export default QualificationsSection;
