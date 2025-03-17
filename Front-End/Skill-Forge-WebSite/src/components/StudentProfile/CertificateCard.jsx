import React from "react";
import "./CertificateCard.css";

const CertificateCard = ({ type, degree, status }) => {
  return (
    <div className="certificate-card">
      <h3>{type}</h3>
      <p className="degree">{degree}</p>
      <p className={`status ${status.toLowerCase()}`}>{status}</p>
    </div>
  );
};

export default CertificateCard;
