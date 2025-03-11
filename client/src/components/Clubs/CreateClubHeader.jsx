import React from "react";
import { useNavigate } from "react-router-dom";
import "./CreateClubHeader.css";

const CreateClubHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="create-club-header">
            <h1 className="create-club-title">Create a Club</h1>
            <button className="go-back-button" onClick={() => navigate("/clubs")}>
                Go Back
            </button>
        </div>
    );
};

export default CreateClubHeader;
