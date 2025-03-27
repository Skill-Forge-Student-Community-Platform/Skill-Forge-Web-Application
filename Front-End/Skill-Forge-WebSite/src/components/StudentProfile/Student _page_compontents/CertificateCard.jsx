import React from "react";

const CertificateCard = ({ type, degree, status }) => {
  // Map status to appropriate Tailwind color classes
  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'verified') return 'bg-green-100 text-green-800';
    if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3">
      <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
      <p className="text-md text-gray-600 mt-1">{degree}</p>
      <p className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(status)}`}>
        {status}
      </p>
    </div>
  );
};

export default CertificateCard;
