import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./ClubCard.css"; 
import { FaTrash, FaPencilAlt, FaTimes } from "react-icons/fa"; 

const ClubCard = ({ club, isEditMode, onDelete, onUpdate }) => {
  const {
    club_id,
    club_name,
    club_description,
    club_thumbnail_url
  } = club;

  const navigate = useNavigate(); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedClub, setEditedClub] = useState({
    club_name,
    club_description,
    club_thumbnail_url
  });

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = () => {
    onUpdate(club_id, editedClub); // 🛠 Send updated club data to parent
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="club-card">
        <div className="club-image">
          <img src={club_thumbnail_url} alt={club_name} />
        </div>

        <div className="club-details">
          <h3>{club_name}</h3>
          <p>{club_description}</p>
        </div>

        <div className="club-buttons">
          <button className="view-club-btn" onClick={() => navigate("/club-details")}>
            View Club Details
          </button>
          <button className="join-club-btn">Join</button>
        </div>

        {isEditMode && (
          <>
            <button className="delete-club-button" onClick={() => onDelete(club_id)}>
              <FaTrash />
            </button>
            <button className="edit-club-button" onClick={handleEditClick}>
              <FaPencilAlt />
            </button>
          </>
        )}
      </div>

      {/* ✅ Edit Modal */}
      {isEditModalOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <button className="close-modal-button" onClick={handleCloseEditModal}>
              <FaTimes />
            </button>
            <h2>Edit Club Details</h2>

            <label>Club Name:</label>
            <input 
              type="text" 
              value={editedClub.club_name} 
              onChange={(e) => setEditedClub({ ...editedClub, club_name: e.target.value })} 
            />

            <label>Club Logo (Image URL):</label>
            <input 
              type="text" 
              value={editedClub.club_thumbnail_url} 
              onChange={(e) => setEditedClub({ ...editedClub, club_thumbnail_url: e.target.value })} 
            />

            <label>Club Description:</label>
            <textarea 
              value={editedClub.club_description} 
              onChange={(e) => setEditedClub({ ...editedClub, club_description: e.target.value })} 
            />

            <button onClick={handleSaveChanges} className="save-changes-btn">Save Changes</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClubCard;
