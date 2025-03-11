import React from "react";
import TravelCard from "./TravelCard";
import CertificateCard from "./CertificateCard";
import ActivityCard from "./ActivityCard";
import AddCertificateForm from "./AddCertificateForm";
import "./CardContainer.css"; // Ensure styling is applied

const CardContainer = () => {
  const handleSaveCertificate = (data) => {
    console.log("Certificate Added:", data);
  };

  return (
    <div className="card-container">
      <TravelCard
        image="https://source.unsplash.com/random/250x150"
        title="Enjoy the beauty of the Floating Islands"
        location="Maldives Islands"
        rating="5.0"
        price="1270"
      />
      <CertificateCard type="Academic" degree="B.Sc" status="Verified" />
      <ActivityCard
        user="Lakshan Fernando"
        title="Hackathon Experience"
        description="Reflecting on an incredible experience at Haxpedition!"
        image="https://source.unsplash.com/random/300x200"
        likes="3"
        comments="1"
      />
      <AddCertificateForm onSave={handleSaveCertificate} />
    </div>
  );
};

export default CardContainer;
