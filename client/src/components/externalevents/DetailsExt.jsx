import React, { useState } from 'react';
import './DetailsExt.css';
import { FaBell, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaTicketAlt, FaUserCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';


function DetailsExt() {
  const { id } = useParams(); // <-- grabs the event ID from URL
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const navigate = useNavigate();
  const [detailEventData, setdetailEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingSlots, setRemainingSlots] = useState(null);
  const [isFull, setIsFull] = useState(false); // To manage the popup visibility

	useEffect(() => {
	const fetchEvent = async () => {
		try {
		const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
		const response = await fetch(`${apiUrl}/external-events/${id}`);
		const data = await response.json();
		setdetailEventData(data);
		const remaining =
        data.external_event_max_number_of_attendees - data.number_of_attendees;
      	setRemainingSlots(remaining);
		setLoading(false);
		} catch (error) {
		console.error("Failed to fetch event data:", error);
		}
	};
	fetchEvent();
}, [id]);

const handleFollowClick = () => {
	if (remainingSlots > 0) {
	  // Reduce the remaining slots by 1
	  setRemainingSlots(prev => prev - 1);
	  setIsFormVisible(true); // Show the form or confirmation
	} else {
	  // Show the full event pop-up if no slots are available
	  setIsFull(true);
	}
  };

	const handleCloseForm = () => {
		setIsFormVisible(false);
	};
	
	const handleFormSubmit = (e) => {
		e.preventDefault();
		setRemainingSlots(prev => prev - 1);
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
	
	if (loading) return <p>Loading event details...</p>;
	if (!detailEventData) return <p>Event not found.</p>;
	const team = [
		{ role: "Organizer", name: detailEventData.external_event_organizer },
		{ role: "Co-organizer", name: detailEventData.external_event_corganizer },
		{ role: "Manager", name: detailEventData.external_event_manager },
		{ role: "Speaker", name: detailEventData.external_event_speaker },
	  ].filter(member => member.name && member.name.trim() !== "");
	  
	console.log("Event data:", detailEventData);

  return (
    <div className="page-container-details-ext">
      <div className="content-wrapper-details-ext">
        <header className="detail-header-details-ext">
          <div className="detail-title-details-ext">
            <h1 className="event-title-details-ext">{detailEventData.external_event_name}</h1>
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
                src={detailEventData.imageUrl}
                alt="Event"
                className="event-description-image-details-ext"
              />
            </div>
            <p className="description-text-details-ext">{detailEventData.external_event_description}</p>

            <div className="detailext-details-details-ext">
              <div className="detail-item-details-ext">
                <FaMapMarkerAlt className="icon-green-details-ext" />
                <span>Location: {detailEventData.external_event_location}</span>
              </div>
              <div className="detail-item-details-ext">
                <FaCalendarAlt className="icon-green-details-ext" />
				<span>
				Date: {new Date(detailEventData.external_event_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				})}
			</span>
              </div>
              <div className="detail-item-details-ext">
                <FaClock className="icon-green-details-ext" />
                <span>
			    Time: {new Date(detailEventData.external_event_time).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
				})}
			</span>
              </div>
              <div className="detail-item-details-ext">
                <FaUserFriends className="icon-green-details-ext" />
                <span>Capacity: {detailEventData.external_event_max_number_of_attendees}</span>
              </div>
            </div>
          </div>

          <div className="ticket-section-details-ext">
            <div className="ticket-box-details-ext">
              <div className="ticket-price-details-ext">Price: {detailEventData.external_event_ticket_amount}</div>
               <div className="ticket-availability-details-ext">
                <div className="availability-item-details-ext">
                  <FaTicketAlt className="icon-green-details-ext" />
				  <span>Remaining slots: {remainingSlots ?? 'N/A'}</span>

                </div> 
				
                {/* <div className="availability-item-details-ext">
                  <FaUsers className="icon-green-details-ext" />
                  <span>Waiting in line: {detailEventData.waitingLine}</span>
                </div> */}
              </div>
            </div>

            <div className="event-team-box-details-ext">
              <h2 className="section-title-details-ext">Event Team</h2>
              <div className="event-team-grid-details-ext">
				{team.map((person) => (
				<div key={person.role + person.name} className="team-member-details-ext">
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
	  {isFull && (
  <div className="event-full-popup">
    <p>Sorry, this event is full.</p>
    <button onClick={() => setIsFull(false)} className="close-popup">Close</button>
  </div>
)}

    </div>
  );
}

export default DetailsExt;