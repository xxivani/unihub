import React, { useState } from 'react';
import './DetailsExt.css';
import { FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaTicketAlt, FaUserCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const DEFAULT_IMAGE = "/assets/images/default-extevent.png";

function DetailsExt() {
  const { id } = useParams(); 
  const [isUnfollowModalVisible, setIsUnfollowModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const [detailEventData, setdetailEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingSlots, setRemainingSlots] = useState(null);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]); 

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/external-events/${id}`);
        const data = await response.json();
        
        const initialEventData = {
          ...data,
          imageUrl: DEFAULT_IMAGE
        };
        setdetailEventData(initialEventData);
        
        const remaining = data.external_event_max_number_of_attendees - (data.external_event_number_of_attendees || 0);
        setRemainingSlots(remaining);

        const imgResponse = await fetch(`${apiUrl}/image-management/`);
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          const mainImage = imgData.find(img => 
            img.eventName === data.external_event_name && 
            img.eventType === "External" && 
            img.position === 1
          );
          
          if (mainImage && mainImage.URL) {
            setdetailEventData(prev => ({
              ...prev,
              imageUrl: mainImage.URL.startsWith('/uploads') 
                ? `${apiUrl}${mainImage.URL}` 
                : mainImage.URL
            }));
          }

          const eventImages = imgData.filter(img => 
            img.eventName === data.external_event_name && 
            img.eventType === "External" && 
            img.position >= 2
          );
          setAdditionalImages(eventImages);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch event data:", error);
        setLoading(false);
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
    } else {
      // Direct follow without form
      handleDirectFollow();
    }
  };

  const handleDirectFollow = async () => {
    if (!user) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/external-events/${id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          eventId: id,
          name: user.name || "User",
          email: user.email || "",
          studentId: "",
          year: ""
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error === 'Event is full') {
          alert("Sorry, this event has reached its maximum capacity.");
          return;
        }
        throw new Error(`Failed to follow: ${errorData.error || 'Unknown error'}`);
      }

      const updatedEvent = await response.json();
      setdetailEventData(prev => ({
        ...updatedEvent,
        imageUrl: prev.imageUrl
      }));
      setRemainingSlots(updatedEvent.external_event_max_number_of_attendees - updatedEvent.external_event_number_of_attendees);
      const updatedFollowed = [...followedEvents, Number(id)];
      setFollowedEvents(updatedFollowed);
      localStorage.setItem(`followedEvents_${user.id}`, JSON.stringify(updatedFollowed));
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Error following event:', error);
      alert(`Failed to follow: ${error.message}`);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  const handleReturnToEvents = () => {
    setIsSuccessModalVisible(false);
    navigate('/external-events');
  };

  const handleCloseUnfollowModal = () => {
    setIsUnfollowModalVisible(false);
  };

  const handleReturnToEventsFromUnfollow = () => {
    setIsUnfollowModalVisible(false);
    navigate('/external-events');
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
      setdetailEventData(prev => ({
        ...updatedEvent,
        imageUrl: prev.imageUrl
      }));
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
          </div>
        </header>

        <main className="detail-content-details-ext">
          <div className="detail-description-details-ext">
            <div className="description-image-details-ext">
              <img
                src={detailEventData?.imageUrl || DEFAULT_IMAGE}
                alt="Event"
                className="event-description-image-details-ext"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                  e.target.onerror = null;
                }}
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

        <div className="additional-images-container">
          <h3 className="additional-images-title">Event Gallery</h3>
          <div className="additional-images-grid">
            {additionalImages.map((img, index) => (
              <div key={index} className="additional-image-item">
                <img
                  src={img.URL && img.URL.startsWith('/uploads') 
                    ? `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}${img.URL}` 
                    : img.URL || DEFAULT_IMAGE}
                  alt={`Event image ${index + 2}`}
                  className="additional-image"
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                    e.target.onerror = null;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal for Following */}
      {isSuccessModalVisible && (
        <div className="event-form-overlay">
          <div className="success-modal">
            <button
              className="close-form-button"
              onClick={handleCloseSuccessModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <h2>Event followed successfully</h2>
            <p>
              Please make sure to unfollow it if you won't be able to make it to
              the event on time to give spot to someone else!
            </p>
            <button
              className="return-button"
              onClick={handleReturnToEvents}
            >
              Return to Event List
            </button>
          </div>
        </div>
      )}
      
      {/* Unfollow Modal */}
      {isUnfollowModalVisible && (
        <div className="event-form-overlay">
          <div className="success-modal">
            <button 
              className="close-form-button" 
              onClick={handleCloseUnfollowModal} 
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <h2>Event unfollowed successfully</h2>
            <p>You have unfollowed this event. The slot is now available for someone else.</p>
            <button 
              className="return-button" 
              onClick={handleReturnToEventsFromUnfollow}
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