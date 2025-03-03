import React from "react";
import { useState } from "react";
import { IconContext } from "react-icons";
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaTicketAlt, FaUserCircle, FaTimes } from 'react-icons/fa';
import "./event-panel.css"



function E4EventPanel() {
    const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);

  const eventData = {
    description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better. A great chance to meet reps and engage in meaningful discussions!",
    organizer: "Nature & Ecosystem Society",
    location: "Second floor quiet room",
    date: "20/February/2025",
    time: "15:30 - 17:00",
    price: "10 AED/-",
    capacity: "150 people",
    remainingSlots: 12,
    waitingLine: 0,
    team: [
      { role: "Organizer", name: "Bob White" },
      { role: "Co-Organizer", name: "David Pinkman" },
      { role: "Manager", name: "Jake Schrader" },
      { role: "Speaker", name: "Kanye Goodman" }
    ],
    imageUrl: "/assets/images/picnic.webp"  // Assuming the image is located in the public folder
  };

  const handleFollowClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setIsSuccessModalVisible(true);
  };

  const handlePurchaseTicket = () => {
    alert("Please sign in to purchase tickets");
  };
    return (
        <main className="e4-main-container">
                  <div onMouseEnter={() => setHovered(true)}
                         onMouseLeave={() => setHovered(false)}
                         className="e4-description-panel" style={{transform: hovered ? "scale(1.005)" : "scale(1)", transition: "transform 0.5s ease"}}>
                    <div className="e4-description-image">
                      <img
                        src={eventData.imageUrl}
                        alt="Event Image"
                        className="e4-event-description-image"
                      />
                    </div>
                    <p className="e4-description-text">{eventData.description}</p>
        
                    <div className="e4-detailext-details">
                      <div className="e4-detail-item">
                        <FaUsers className="e4-icon-green" />
                        <span>Organized by: {eventData.organizer}</span>
                      </div>
                      <div className="e4-detail-item">
                        <FaMapMarkerAlt className="e4-icon-green" />
                        <span>Location: {eventData.location}</span>
                      </div>
                      <div className="e4-detail-item">
                        <FaCalendarAlt className="e4-icon-green" />
                        <span>Date: {eventData.date}</span>
                      </div>
                      <div className="e4-detail-item">
                        <FaClock className="e4-icon-green" />
                        <span>Time: {eventData.time}</span>
                      </div>
                    </div>
                  </div>
        
                  <div className="e4-panel-container">
                    <div onMouseEnter={() => setHovered2(true)}
                         onMouseLeave={() => setHovered2(false)}
                         className="e4-ticket-panel"
                         style={{transform: hovered2 ? "scale(1.01)" : "scale(1)", transition: "transform 0.5s ease"}}>
                      <div className="e4-ticket-price">Price: {eventData.price}</div>
                      <div className="e4-ticket-availability">
                      <div className="e4-availability-item">
                        <FaUserFriends className="e4-icon-green" />
                        <span>Capacity: {eventData.capacity}</span>
                      </div>
                        <div className="e4-availability-item">
                          <FaTicketAlt className="e4-icon-green" />
                          <span>Remaining slots: {eventData.remainingSlots}</span>
                        </div>
                        <div className="e4-availability-item">
                          <FaUsers className="e4-icon-green" />
                          <span>Waiting in line: {eventData.waitingLine}</span>
                        </div>
                      </div>
                    </div>
        
                    <div onMouseEnter={() => setHovered3(true)}
                         onMouseLeave={() => setHovered3(false)}
                         className="e4-event-team-panel"
                        style={{transform: hovered3 ? "scale(1.01)" : "scale(1)", transition: "transform 0.5s ease"}}>
                      <h2 className="e4-section-title">Event Team</h2>
                      <div className="e4-event-team-grid">
                        {eventData.team.map((person) => (
                          <div key={person.name} className="e4-team-member">
                            <div className="e4-member-avatar">
                              <FaUserCircle />
                            </div>
                            <div className="e4-member-info">
                              <div className="e4-member-role">{person.role}</div>
                              <div className="e4-member-name">{person.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </main>
    );
};

export default E4EventPanel;