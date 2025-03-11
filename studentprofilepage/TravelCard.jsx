import React from "react";
import "./TravelCard.css";

const TravelCard = ({ image, title, location, rating, price }) => {
  return (
    <div className="travel-card">
      <img src={image} alt={title} className="travel-image" />
      <div className="travel-info">
        <h3>{title}</h3>
        <p className="location">{location}</p>
        <p className="rating">⭐ {rating}</p>
        <p className="price">${price}</p>
      </div>
    </div>
  );
};

export default TravelCard;
