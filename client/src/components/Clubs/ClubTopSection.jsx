import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; 
import "./ClubTopSection.css";

const ClubTopSection = () => {
    const navigate = useNavigate();

    return (
        <div className="club-top-container">
            
            <button className="exit-button" onClick={() => navigate("/clubs")}>
                <FaTimes size={20} /> 
            </button>

            
            <img className="club-logo" src="/assets/images/logo-paws.jpeg" alt="Club Logo" />
            <h1 className="club-title">PAWS Club</h1>

            <div className="club-actions">
                <button className="join-button">Join</button>
            </div>
        </div>
    );
};

export default ClubTopSection;
