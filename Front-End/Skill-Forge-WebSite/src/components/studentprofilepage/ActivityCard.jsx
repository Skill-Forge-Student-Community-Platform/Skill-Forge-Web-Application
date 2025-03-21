import React from "react";
import "./ActivityCard.css";

const ActivityCard = ({ user, title, description, image, likes, comments }) => {
  return (
    <div className="activity-card">
      <h3>{user}</h3>
      <h4>{title}</h4>
      <p>{description}</p>
      {image && <img src={image} alt="activity" className="activity-image" />}
      <div className="activity-footer">
        <span>👍 {likes}</span>
        <span>💬 {comments}</span>
      </div>
    </div>
  );
};

export default ActivityCard;
 