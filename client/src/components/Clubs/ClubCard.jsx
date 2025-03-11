import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ClubCard.css"; 

const ClubCard = ({ club }) => {
  const { name, description, image } = club;
  const navigate = useNavigate(); // Hook to handle navigation

  return (
    <div className="club-card">
      <div className="club-image">
        <img src={image} alt={name} />
      </div>

      <div className="club-details">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>

      <div className="club-buttons">
        {/* Navigate to club details page when clicked */}
        <button className="view-club-btn" onClick={() => navigate("/club-details")}>
          View Club Details
        </button>
        <button className="join-club-btn">Join</button>
      </div>
    </div>
  );
};

export default ClubCard;
