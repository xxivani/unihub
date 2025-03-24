import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./ClubCard.css"; 
import { FaTrash, FaPencilAlt, FaTimes } from "react-icons/fa"; 

const ClubCard = ({ club, isEditMode, onDelete, onUpdate }) => {
  const { id, name, description, image } = club;
  const navigate = useNavigate(); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedClub, setEditedClub] = useState({ name, description, image });

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = () => {
    onUpdate(id, editedClub); // ✅ Update club details
    setIsEditModalOpen(false); // ✅ Close modal
  };

  return (
    <>
      <div className="club-card">
        <div className="club-image">
          <img src={image} alt={name} />
        </div>

        <div className="club-details">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>

        <div className="club-buttons">
          <button className="view-club-btn" onClick={() => navigate("/club-details")}>
            View Club Details
          </button>
          <button className="join-club-btn">Join</button>
        </div>

        {isEditMode && (
          <>
            <button className="delete-club-button" onClick={() => onDelete(id)}>
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
              value={editedClub.name} 
              onChange={(e) => setEditedClub({ ...editedClub, name: e.target.value })} 
            />

            <label>Club Logo (Image URL):</label>
            <input 
              type="text" 
              value={editedClub.image} 
              onChange={(e) => setEditedClub({ ...editedClub, image: e.target.value })} 
            />

            <label>Club Description:</label>
            <textarea 
              value={editedClub.description} 
              onChange={(e) => setEditedClub({ ...editedClub, description: e.target.value })} 
            />

            <button onClick={handleSaveChanges} className="save-changes-btn">Save Changes</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClubCard;
