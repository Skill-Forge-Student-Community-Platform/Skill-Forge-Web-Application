import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userAPI from '../../../services/userAPI';

const CertificatePreviewPage = ({ userId, isOwnProfile = false }) => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        // In a real implementation, replace this with an actual API call
        // const response = await userAPI.getCertificate(certificateId);

        // For now, we'll use localStorage as a fallback for demo purposes
        const savedQualifications = JSON.parse(localStorage.getItem("qualifications")) || [];
        const foundCertificate = savedQualifications.find(cert => cert.id === certificateId);

        if (foundCertificate) {
          setCertificate(foundCertificate);
        } else {
          setError("Certificate not found");
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
        setError("Failed to load certificate. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">

        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Certificate Viewer</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
          >
            Back
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Certificate Viewer</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
        >
          Back
        </button>
      </div>

      {certificate && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{certificate.type} Certificate</h2>

          {certificate.file && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Document</h3>
              <div className="border rounded-lg overflow-hidden">
                {certificate.file.type === 'application/pdf' ? (
                  <iframe
                    src={URL.createObjectURL(certificate.file)}
                    className="w-full h-96"
                    title="Certificate Preview"
                  />
                ) : (
                  <div className="p-8 bg-gray-100 text-center">
                    <p>PDF preview not available. <a
                      href={URL.createObjectURL(certificate.file)}
                      download
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a> to view.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{certificate.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                certificate.status === 'Approved'
                  ? 'bg-green-100 text-green-800'
                  : certificate.status === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {certificate.status}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Actions</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
                  Download Certificate
                </button>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition">
                  Delete Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificatePreviewPage;
