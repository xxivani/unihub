import React, { useState } from 'react';
import './DetailsExt.css';
import { FaBell, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaTicketAlt, FaUserCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function DetailsExt() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const navigate = useNavigate();

  const eventData = {
    title: "Plant and Animal Social",
    description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better. A great chance to meet reps and engage in meaningful discussions!",
    organizer: "Nature & Ecosystem Society",
    location: "Second floor quiet room",
    date: "20/February/2025",
    time: "15:30 - 17:00",
    capacity: "150 people",
    price: "10 AED/-",
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

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
    navigate('/external-events');
  };

  const handlePurchaseTicket = () => {
    alert("Please sign in to purchase tickets");
  };

  return (
    <div className="page-container-details-ext">
      <div className="content-wrapper-details-ext">
        <header className="detail-header-details-ext">
          <div className="detail-title-details-ext">
            <img
              src="/assets/images/logo-paws.jpeg"
              alt="Plant and Animal Social Logo"
              className="event-logo-details-ext"
            />
            <h1 className="event-title-details-ext">{eventData.title}</h1>
          </div>
          <div className="detail-buttons-details-ext">
            <button className="follow-button-details-ext" onClick={handleFollowClick}>Follow</button>
            <button className="notification-button-details-ext">
              <FaBell />
            </button>
          </div>
        </header>

        <main className="detail-content-details-ext">
          <div className="detail-description-details-ext">
            <div className="description-image-details-ext">
              <img
                src={eventData.imageUrl}
                alt="Event"
                className="event-description-image-details-ext"
              />
            </div>
            <p className="description-text-details-ext">{eventData.description}</p>

            <div className="detailext-details-details-ext">
              <div className="detail-item-details-ext">
                <FaUsers className="icon-green-details-ext" />
                <span>Organized by: {eventData.organizer}</span>
              </div>
              <div className="detail-item-details-ext">
                <FaMapMarkerAlt className="icon-green-details-ext" />
                <span>Location: {eventData.location}</span>
              </div>
              <div className="detail-item-details-ext">
                <FaCalendarAlt className="icon-green-details-ext" />
                <span>Date: {eventData.date}</span>
              </div>
              <div className="detail-item-details-ext">
                <FaClock className="icon-green-details-ext" />
                <span>Time: {eventData.time}</span>
              </div>
              <div className="detail-item-details-ext">
                <FaUserFriends className="icon-green-details-ext" />
                <span>Capacity: {eventData.capacity}</span>
              </div>
            </div>
          </div>

          <div className="ticket-section-details-ext">
            <div className="ticket-box-details-ext">
              <div className="ticket-price-details-ext">Price: {eventData.price}</div>
              <div className="ticket-availability-details-ext">
                <div className="availability-item-details-ext">
                  <FaTicketAlt className="icon-green-details-ext" />
                  <span>Remaining slots: {eventData.remainingSlots}</span>
                </div>
                <div className="availability-item-details-ext">
                  <FaUsers className="icon-green-details-ext" />
                  <span>Waiting in line: {eventData.waitingLine}</span>
                </div>
              </div>
            </div>

            <div className="event-team-box-details-ext">
              <h2 className="section-title-details-ext">Event Team</h2>
              <div className="event-team-grid-details-ext">
                {eventData.team.map((person) => (
                  <div key={person.name} className="team-member-details-ext">
                    <div className="member-avatar-details-ext">
                      <FaUserCircle />
                    </div>
                    <div className="member-info-details-ext">
                      <div className="member-role-details-ext">{person.role}</div>
                      <div className="member-name-details-ext">{person.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sign-Up Form */}
      {isFormVisible && (
        <div className="details-ext-form-overlay">
          <div className="details-ext-form-container">
            <button 
              className="details-ext-close-form-button" 
              onClick={handleCloseForm} 
              aria-label="Close form"
            >
              <FaTimes />
            </button>
            <h3>Sign Up to Follow Event</h3>
            <form className="details-ext-signup-form" onSubmit={handleFormSubmit}>
              <div className="details-ext-form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="details-ext-form-group">
                <label htmlFor="studentId">Student ID</label>
                <input type="text" id="studentId" name="studentId" required />
              </div>
              <div className="details-ext-form-group">
                <label htmlFor="year">Year of Study</label>
                <input type="text" id="year" name="year" required />
              </div>
              <div className="details-ext-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="details-ext-form-actions">
                <button type="submit" className="details-ext-submit-button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalVisible && (
        <div className="details-ext-form-overlay">
          <div className="details-ext-success-modal">
            <button 
              className="details-ext-close-form-button" 
              onClick={handleCloseSuccessModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <h2>Event followed successfully</h2>
            <p>Please make sure to unfollow it if you won't be able to make it to the event on time to give spot to someone else!</p>
            <button 
              className="details-ext-return-button"
              onClick={handleCloseSuccessModal}
            >
              Return to Event List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsExt;