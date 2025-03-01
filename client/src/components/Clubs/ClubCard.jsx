import React from 'react';
import './ClubCard.css'; 

const ClubCard = ({ club }) => {
  const { name, description } = club;

  return (
    <div className="club-card">
      <div className="club-image">
        <span>📸</span>
      </div>
      <div className="club-info-container">
        <h2 className="club-name">{name}</h2>
        <p className="club-description">{description}</p>
      </div>
      <div className="club-button-container">
        <button className="view-details-button">View club details</button>
        <button className="join-club-button">Join</button>
      </div>
    </div>
  );
};

export default ClubCard;
