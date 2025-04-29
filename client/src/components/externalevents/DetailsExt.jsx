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
  const [isEventFullModalVisible, setIsEventFullModalVisible] = useState(false); // New state for "Event is full" modal
  const [user, setUser] = useState(null); // Added user state
  const navigate = useNavigate();
  const [detailEventData, setdetailEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingSlots, setRemainingSlots] = useState(null);
  const [isUnfollowModalVisible, setIsUnfollowModalVisible] = useState(false);
  const [followedEvents, setFollowedEvents] = useState([]);

  useEffect(() => {
	const fetchEvent = async () => {
		try {
		const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
		const response = await fetch(`${apiUrl}/external-events/${id}`);
		const data = await response.json();
		setdetailEventData(data);
		const remaining = data.external_event_max_number_of_attendees - (data.external_event_number_of_attendees || 0);
      	setRemainingSlots(remaining);
		setLoading(false);
		} catch (error) {
		console.error("Failed to fetch event data:", error);
		}
	};
	fetchEvent();
}, [id]);

useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const followed = JSON.parse(localStorage.getItem(`followedEvents_${parsedUser.id}`)) || [];
      setFollowedEvents(followed.map(Number));
    }
	const handleStorageChange = () => {
		if (storedUser) {
		  const parsedUser = JSON.parse(storedUser);
		  const followed = JSON.parse(localStorage.getItem(`followedEvents_${parsedUser.id}`)) || [];
		  setFollowedEvents(followed.map(Number));
		}
	  };
	  window.addEventListener('storage', handleStorageChange);
	  window.addEventListener('focus', handleStorageChange); // Refresh on tab focus
  
	  return () => {
		window.removeEventListener('storage', handleStorageChange);
		window.removeEventListener('focus', handleStorageChange);
	  };
  }, []);

  const handleFollowClick = () => {
    if (!user) {
      alert("Please log in to follow this event.");
      return;
    }
    if (followedEvents.includes(Number(id))) {
      handleUnfollow();
    } else if (remainingSlots > 0) {
      setIsFormVisible(true);
    } else {
      setIsEventFullModalVisible(true);
    }
  };

	const handleCloseForm = () => {
		setIsFormVisible(false);
	};

	const handleCloseUnfollowModal = () =>  {
	setIsUnfollowModalVisible(false);
	navigate('/external-events');
	};
	
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (!user) return;
	
		const formData = {
		  name: e.target.name.value,
		  studentId: e.target.studentId.value,
		  year: e.target.year.value,
		  email: e.target.email.value,
		  userId: user.id,
		  eventId: id,
		};
	
		try {
		  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
		  const response = await fetch(`${apiUrl}/external-events/${id}/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		  });
	
		  if (!response.ok) {
			const errorData = await response.json();
			if (response.status === 400 && errorData.error === 'Event is full') {
			  setIsFormVisible(false);
			  setIsEventFullModalVisible(true);
			  return;
			}
			throw new Error(`Failed to sign up: ${errorData.error || 'Unknown error'}`);
		  }
	
		  const updatedEvent = await response.json();
		  console.log("Updated event from signup:", updatedEvent);
		  setdetailEventData(updatedEvent);
		  setRemainingSlots(updatedEvent.external_event_max_number_of_attendees - updatedEvent.external_event_number_of_attendees);
		  const updatedFollowed = [...followedEvents, Number(id)];
		  setFollowedEvents(updatedFollowed);
		  localStorage.setItem(`followedEvents_${user.id}`, JSON.stringify(updatedFollowed));
		  setIsFormVisible(false);
		  setIsSuccessModalVisible(true);
		} catch (error) {
		  console.error('Error signing up for event:', error);
		  alert(`Failed to sign up: ${error.message}`);
		}
	  };
	
	  const handleUnfollow = async () => {
		if (!user) {
		  alert("Please log in to unfollow this event.");
		  return;
		}
	
		try {
		  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
		  const response = await fetch(`${apiUrl}/external-events/${id}/unfollow`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ eventId: id, userId: user.id }),
		  });
	
		  if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Failed to unfollow: ${errorData.error || 'Unknown error'}`);
		  }
	
		  const updatedEvent = await response.json();
		  setdetailEventData(updatedEvent);
		  setRemainingSlots(updatedEvent.external_event_max_number_of_attendees - updatedEvent.external_event_number_of_attendees);
		  const updatedFollowed = followedEvents.filter(eid => eid !== Number(id));
      setFollowedEvents(updatedFollowed);
      localStorage.setItem(`followedEvents_${user.id}`, JSON.stringify(updatedFollowed));
      setIsUnfollowModalVisible(true);
		} catch (error) {
		  console.error('Error unfollowing event:', error);
		  alert(`Failed to unfollow: ${error.message}`);
		}
	  };
	const handleCloseSuccessModal = () => {
		setIsSuccessModalVisible(false);
		navigate('/external-events');
	};
	const handleCloseEventFullModal = () => {
		setIsEventFullModalVisible(false);
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
		  {followedEvents.includes(Number(id)) ? (
              <button className="follow-button-details-ext" onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button className="follow-button-details-ext" onClick={handleFollowClick}>Follow</button>
            )}
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
				  <span>Remaining Slots: {remainingSlots >= 0 ? remainingSlots : 'N/A'}</span>

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
	   {isUnfollowModalVisible && (
        <div className="event-form-overlay">
          <div className="success-modal">
            <button className="close-form-button" onClick={handleCloseUnfollowModal} aria-label="Close modal">
              <FaTimes />
            </button>
            <h2>Event unfollowed successfully</h2>
            <p>You have unfollowed this event. The slot is now available for someone else.</p>
            <button className="return-button" onClick={handleCloseUnfollowModal}>
              Return to Event List
            </button>
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
	  {isEventFullModalVisible && (
        <div className="details-ext-form-overlay">
          <div className="details-ext-success-modal">
            <button
              className="details-ext-close-form-button"
              onClick={handleCloseEventFullModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <h2>Event is Full</h2>
            <p>Sorry, this event has reached its maximum capacity.</p>
            <button
              className="details-ext-return-button"
              onClick={handleCloseEventFullModal}
            >
              Return to Event Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default DetailsExt;