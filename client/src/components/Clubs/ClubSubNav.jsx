import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./ClubSubNav.css";

const ClubSubNav = () => {
    const navigate = useNavigate(); 

    return (
        <nav className="club-sub-nav">
            <button className="sub-nav-button" onClick={() => navigate("/events")}>
                Events
            </button>
            <button className="sub-nav-button">Contact Us</button>
            <button className="sub-nav-button">About Us</button>
        </nav>
    );
};

export default ClubSubNav;
