import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QualificationsSection = ({ userId, qualifications = [], isEditable = false }) => {
  const navigate = useNavigate();
  const [displayQualifications, setDisplayQualifications] = useState([]);

  useEffect(() => {
    // If we have qualifications from props, use them
    if (qualifications && qualifications.length > 0) {
      setDisplayQualifications(qualifications);
      return;
    }

    // ✅ Default qualifications (Preloaded)
    const defaultQualifications = [
      { id: '1', type: "Academic", title: "BSc Computer Science", issuer: "University", date: "2023", status: "Verified" },
      { id: '2', type: "Course", title: "Web Development", issuer: "Udemy", date: "2022", status: "Verified" },
    ];

    // ✅ Load saved qualifications from localStorage
    const savedQualifications = JSON.parse(localStorage.getItem("qualifications")) || [];

    // ✅ Use saved or default qualifications
    const qualificationsToShow = savedQualifications.length > 0 ?
      savedQualifications : defaultQualifications;

    setDisplayQualifications(qualificationsToShow);
  }, [qualifications]);

  const handleAdd = () => {
    navigate("/profile/add-certificate");
  };

  return (
    <div className="student-section mb-6">
      <h2 className="student-section-title flex items-center gap-2">
        <span role="img" aria-label="Certificate">🎓</span> Certifications
      </h2>

      <div className="student-section-content">
        {displayQualifications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">No certifications added yet</p>
            {isEditable && (
              <button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Your First Certificate
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayQualifications.map((cert, index) => (
                <div key={cert.id || index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800">{cert.title || cert.type}</h3>
                  {cert.issuer && <p className="text-sm text-gray-600">Issuer: {cert.issuer}</p>}
                  {cert.date && <p className="text-sm text-gray-600">Date: {cert.date}</p>}
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {cert.status || "Verified"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {isEditable && (
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={handleAdd}
              >
                Add New
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QualificationsSection;
