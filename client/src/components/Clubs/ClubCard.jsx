import React from "react";
import { useNavigate } from "react-router-dom";
import "./ClubCard.css";

const ClubCard = ({ club, user, userMemberships, refreshMemberships }) => {
  const { club_id, club_name, club_description, club_thumbnail_url } = club;
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

  const isMember = userMemberships.includes(club_id);

  const fallbackImage = "https://picsum.photos/200/150?random=1";

  const handleJoinClub = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/club-memberships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: club_id }),
      });

      if (response.status === 201) {
        alert("Joined club successfully!");
        refreshMemberships();
      } else if (response.status === 400) {
        alert("You are already a member of this club.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Join club error:", error);
      alert("Failed to join club.");
    }
  };

  const handleLeaveClub = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/club-memberships/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: club_id }),
      });

      if (response.ok) {
        alert("Left club successfully!");
        refreshMemberships();
      } else {
        alert("Failed to leave the club.");
      }
    } catch (error) {
      console.error("Leave club error:", error);
      alert("Server error while leaving the club.");
    }
  };

  return (
    <div className="club-card">
      <div className="club-image">
        <img
          src={club_thumbnail_url || fallbackImage}
          alt={club_name}
          onError={(e) => {
            e.target.src = fallbackImage;
            e.target.onerror = null;
          }}
        />
      </div>

      <div className="club-details">
        <h3>{club_name}</h3>
        <p>{club_description}</p>
      </div>

      <div className="club-buttons">
        <button
          className="view-club-btn"
          onClick={() => navigate(`/club-details/${club_id}`)}
        >
          View Club Details
        </button>
        {isMember ? (
          <button className="leave-club-btn" onClick={handleLeaveClub}>
            Leave
          </button>
        ) : (
          <button className="join-club-btn" onClick={handleJoinClub}>
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubCard;
