import React from "react";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { useLocation } from "react-router-dom";
import { FaBell, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaTicketAlt, FaUserCircle, FaTimes } from 'react-icons/fa';
import "./event-panel.css"


function E4EventPanel() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventID = queryParams.get("eventid");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);
  const [hovered4, setHovered4] = useState(false);

  const [eventData, setEventData] = useState({
    title: "Plant and Animal Social",
    image: {"thumbnail": "/assets/images/logo-paws.jpeg", "prev": "/assets/images/picnic.webp"},
    description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better. A great chance to meet reps and engage in meaningful discussions!",
    club: "Nature & Ecosystem Society",
    location: "Second floor quiet room",
    date: "20/February/2025",
    time: "15:30 - 17:00",
    price: "10 AED/-",
    capacity: "150 people",
    followed: 12,
    waiting: 0,
    team: [
      { role: "Organizer", name: "Bob White" },
      { role: "Co-Organizer", name: "David Pinkman" },
      { role: "Manager", name: "Jake Schrader" },
      { role: "Speaker", name: "Kanye Goodman" }
    ]
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setIsSuccessModalVisible(true);
  };
  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  const handlePurchaseTicket = () => {
    alert("Please sign in to purchase tickets");
  };

  useEffect(() => {
    try {
      fetch(`http://localhost:5000/events/${eventID}`)
        .then((response) => response.json())
        .then((data) => {
          setEventData(JSON.parse(JSON.stringify(data, null, 2)));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
          setLoading(false);
        });
    } catch (error) {
      /*offline template data*/
    }
  }, []);
    if (loading) return <h3>Loading events...</h3>;
    return (
      <main className="e4d-main-detail-container">
      {isFormVisible && (
              <div className="e4d-event-form-overlay">
                <div className="e4d-event-form-container">
                  <button 
                    className="e4d-close-form-button" 
                    onClick={() => setIsFormVisible(false)} 
                    aria-label="Close form"
                  >
                    <FaTimes />
                  </button>
                  <h3>Sign Up to Follow Event</h3>
                  <form className="e4d-event-signup-form" onSubmit={handleFormSubmit}>
                    <div className="e4d-event-form-group">
                      <label htmlFor="e4d-name">Name</label>
                      <input type="text" id="name" name="name" required />
                    </div>
                    <div className="e4d-event-form-group">
                      <label htmlFor="e4d-studentId">Student ID</label>
                      <input type="text" id="studentId" name="studentId" required />
                    </div>
                    <div className="e4d-event-form-group">
                      <label htmlFor="e4d-year">Year of Study</label>
                      <input type="text" id="year" name="year" required />
                    </div>
                    <div className="e4d-event-form-group">
                      <label htmlFor="e4d-email">Email</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="e4d-event-form-actions">
                      <button type="submit" className="e4d-event-submit-button">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {isSuccessModalVisible && (
              <div className="e4d-event-form-overlay">
                <div className="e4d-success-modal">
                  <button 
                    className="e4d-close-form-button" 
                    onClick={handleCloseSuccessModal}
                    aria-label="Close modal"
                  >
                    <FaTimes />
                  </button>
                  <h2>Event followed successfully</h2>
                  <p>Please make sure to unfollow it if you won't be able to make it to the event on time to give spot to someone else!</p>
                  <button 
                    className="e4d-return-button"
                    onClick={handleCloseSuccessModal}
                  >
                    Return to Event List
                  </button>
                </div>
              </div>
            )}
      <div className="e4d-top-container1">
                        <img className="e4d-top-image" src={eventData.image.thumbnail} alt="Event Image"/>
                        <h1 className="e4d-top-title1">{eventData.title}</h1>
                            <div className="e4d-top-buttons-container">
                                    <button className="e4d-follow-button" onClick={() => setIsFormVisible(true)}>Follow</button>
                                    <button className="e4d-notification-button"
                                     onMouseEnter={() => setHovered4(true)}
                                     onMouseLeave={() => setHovered4(false)}>
                                    <IconContext.Provider value={{ size: 20 }}>
                                        <FaBell style={{ transform: hovered4 ? "scale(1.25)" : "scale(1)", transition: "transform 0.3s ease, color 0.3s ease",
                                            color: hovered4 ? "rgb(130, 100, 50)" : "rgb(40,40,40)"
                                        }}/>
                                        </IconContext.Provider>
                                    </button>
                                  </div>
                        </div>
        {/* Top and Bottom Section Splitter */}
        <div className="e4d-main-container">
                  <div onMouseEnter={() => setHovered(true)}
                         onMouseLeave={() => setHovered(false)}
                         className="e4d-description-panel" style={{transform: hovered ? "scale(1.005)" : "scale(1)", transition: "transform 0.5s ease"}}>
                    <div className="e4d-description-image">
                      <img
                        src={eventData.image.prev}
                        alt="Event Image"
                        className="e4d-event-description-image"
                      />
                    </div>
                    <p className="e4d-description-text">{eventData.description}</p>
        
                    <div className="e4d-detailext-details">
                      <div className="e4d-detail-item">
                        <FaUsers className="e4d-icon-green" />
                        <span>Organized by: {eventData.club}</span>
                      </div>
                      <div className="e4d-detail-item">
                        <FaMapMarkerAlt className="e4d-icon-green" />
                        <span>Location: {eventData.location}</span>
                      </div>
                      <div className="e4d-detail-item">
                        <FaCalendarAlt className="e4d-icon-green" />
                        <span>Date: {eventData.date}</span>
                      </div>
                      <div className="e4d-detail-item">
                        <FaClock className="e4d-icon-green" />
                        <span>Time: {eventData.time}</span>
                      </div>
                    </div>
                  </div>
        
                  <div className="e4d-panel-container">
                    <div onMouseEnter={() => setHovered2(true)}
                         onMouseLeave={() => setHovered2(false)}
                         className="e4d-ticket-panel"
                         style={{transform: hovered2 ? "scale(1.01)" : "scale(1)", transition: "transform 0.5s ease"}}>
                      <div className="e4d-ticket-price">Price: {eventData.price + " AED/-"}</div>
                      <div className="e4d-ticket-availability">
                      <div className="e4d-availability-item">
                        <FaUserFriends className="e4d-icon-green" />
                        <span>Capacity: {eventData.capacity + " people"}</span>
                      </div>
                        <div className="e4d-availability-item">
                          <FaTicketAlt className="e4d-icon-green" />
                          <span>Remaining slots: {eventData.capacity - eventData.followed}</span>
                        </div>
                        <div className="e4d-availability-item">
                          <FaUsers className="e4d-icon-green" />
                          <span>Waiting in line: {eventData.waiting + " people"}</span>
                        </div>
                      </div>
                    </div>
        
                    <div onMouseEnter={() => setHovered3(true)}
                         onMouseLeave={() => setHovered3(false)}
                         className="e4d-event-team-panel"
                        style={{transform: hovered3 ? "scale(1.01)" : "scale(1)", transition: "transform 0.5s ease"}}>
                      <h2 className="e4d-section-title">Event Team</h2>
                      <div className="e4d-event-team-grid">
                        {eventData.team.map((person) => (
                          <div key={person.name} className="e4d-team-member">
                            <div className="e4d-member-avatar">
                              <FaUserCircle />
                            </div>
                            <div className="e4d-member-info">
                              <div className="e4d-member-role">{person.role}</div>
                              <div className="e4d-member-name">{person.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </main>
    );
};

export default E4EventPanel;