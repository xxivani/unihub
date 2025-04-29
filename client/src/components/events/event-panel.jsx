import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserFriends, FaTicketAlt, FaUserCircle, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "./event-panel.css"


function E4EventPanel() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventID = queryParams.get("eventid");
  const [user, setUser] = useState(null);
  const [followed, setFollowed] = useState([]);
  const [followId, setFollowId] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);
  const canvasRefs = useRef([]);
  const renderImage = (eventIndex, col) => {
    let canvas = null;
    const event = eventData;
    canvas = canvasRefs.current[eventID * 10 + col];

    if (!canvas || !event.image[`image${col}`]) return;
    const canvasCtx = canvas?.getContext("2d");
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `${apiUrl}${event.image[`image${col}`]}`;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasCtx.filter = `
        brightness(${event.image[`imageBr${col}`]}%) 
        saturate(${event.image[`imageSa${col}`]}%) 
        blur(${event.image[`imageBl${col}`]}px) 
        invert(${event.image[`imageIn${col}`]}%)`;
      canvasCtx.drawImage(img, 0, 0);
    };
  };
  const [eventData, setEventData] = useState({
    title: "Plant and Animal Social",
    image: {"image0": "/assets/images/logo-paws.jpeg", "image1": "/assets/images/picnic.webp"},
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
  const handleImage = (direction) => {
    const total = 7;
    let nextImage = currentImage;
    const isValid = (index) => {
      const image = eventData.image?.[`image${index}`];
      return typeof image === "string" && image.trim() !== "";
    };
    for (let i = 0; i < total; i++) {
      if (direction) {
        nextImage = nextImage % total + 1;
      } else {
        nextImage = nextImage - 1 || total;
      }
      if (isValid(nextImage)) {
        break;
      }
    }
    setCurrentImage(nextImage);
  };
  const handleFollowClick = async (eventId) => {
    try {
      const follow = followed.includes(Number(eventId));
      const response = await fetch(`${apiUrl}/events/${follow ? 'unfollow' : 'follow'}/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      });
      if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        alert(`Failed: ${errorData.error}`);
        return;
      }
      throw new Error(`${errorData.error || 'Unknown error'}`);
      };
      fetchData();
      setFollowId(eventId);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Error signing up for event:', error);
      alert(`Failed to sign up: ${error.message}`);
    }
  };
  /*const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setIsSuccessModalVisible(true);
  };*/
  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/events/${eventID}`);
      const data = await response.json();
      setEventData(JSON.parse(JSON.stringify(data, null, 2)));
      const user = JSON.parse(sessionStorage.getItem("user"));
      setUser(user);
      const followed = data.follower?.some(follower => Number(follower.id) === Number(user?.id)) ? [data.id] : [];
      setFollowed(followed);
      try {
        const img_response = await fetch(`${apiUrl}/image-management/`);
        const img_data = await img_response.json();
        const int_image = img_data.filter(img => img.eventType == "Internal");

        let updatedImage = {...data.image};
        const curImages = int_image.filter(img => img.eventName == data.title);
        for (let col = 0; col <= 7; col++) {
          const imgFound = curImages.find(img => img.position == col + 1) || {};
          updatedImage[`image${col}`] = imgFound?.URL;
          updatedImage[`imageBr${col}`] = imgFound.brightness;
          updatedImage[`imageSa${col}`] = imgFound.saturation;
          updatedImage[`imageBl${col}`] = imgFound.blur;
          updatedImage[`imageIn${col}`] = imgFound.inversion;
        }
        setEventData({
          ...data,
          image: updatedImage
        });
      } catch(error) {
        console.error("Error fetching images:", error);
      };
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!loading) {
      for (let col = 0; col <= 7; col++) {
        if (eventData.image[`image${col}`]) {
          renderImage(eventID, col);
        }
      }
    }
  }, [loading, eventData, currentImage]);
  useEffect(() => {
    fetchData();
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      setUser(user);
    } catch(error) {
      console.error("Error fetching users:", error);
    }
  }, []);
    if (loading) return <h3>Loading events...</h3>;
    return (
      <main className="e4d-main-detail-container">
      {/*{isFormVisible && (
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
            )}*/}
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
                  {followed.includes(followId) ? (
                    <div><h2>Event followed successfully</h2>
                  <p>Please make sure to unfollow it if you won't be able to make it to the event on time to give spot to someone else!</p></div>)
                  : (
                    <div><h2>Event unfollowed successfully</h2>
                  <p>Don't worry, you can always follow again if you change your mind!</p></div>)
                  }
                  <button 
                    className="e4d-return-button"
                    onClick={handleCloseSuccessModal}
                  >
                    Return to Event List
                  </button>
                </div>
              </div>
            )}
      <div className="e4d-back-button" onClick={() => navigate(-1)}>Back</div>
      <div className="e4d-top-container1">
        <canvas id="canvas" className="e4d-top-image" ref={(el) => canvasRefs.current[Number(eventID) * 10] = el}/>
        <h1 className="e4d-top-title1">{eventData.title}</h1>
            <div className="e4d-top-buttons-container">
                <button className="e4d-follow-button" onClick={() => user ? handleFollowClick(Number(eventID)) : window.location.href=`/auth`}>{followed.includes(Number(eventID)) ? "Unfollow" : "Follow"}</button>
            </div>
      </div>
        {/* Top and Bottom Section Splitter */}
        <div className="e4d-main-container">
            <div onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="e4d-description-panel" style={{transform: hovered ? "scale(1.005)" : "scale(1)", transition: "transform 0.2s ease, background-color 0.4s ease, color 0.4s ease"}}>
              <div className="e4d-description-image">
                <button onClick={() => handleImage(false)} className="e4d-arrow"><FaChevronLeft/></button>
                <canvas id="canvas" className="e4d-event-description-image" ref={(el) => canvasRefs.current[Number(eventID) * 10 + currentImage] = el}/>
                <button onClick={() => handleImage(true)} className="e4d-arrow"><FaChevronRight/></button>
                {/*<img
                  src={eventData.image.prev}
                  alt="Event Image"
                  className="e4d-event-description-image"
                />*/}
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
                    style={{transform: hovered2 ? "scale(1.01)" : "scale(1)", transition: "transform 0.2s ease, background-color 0.4s ease, color 0.4s ease"}}>
                <div className="e4d-ticket-price">Price: {eventData.price + " AED"}</div>
                <div className="e4d-ticket-availability">
                <div className="e4d-availability-item">
                  <FaUserFriends className="e4d-icon-green" />
                  <span>Capacity: {eventData.capacity + " people"}</span>
                </div>
                  <div className="e4d-availability-item">
                    <FaTicketAlt className="e4d-icon-green" />
                    <span>Remaining slots: {eventData.capacity - eventData.followed}</span>
                  </div>
                </div>
              </div>
  
              <div onMouseEnter={() => setHovered3(true)}
                    onMouseLeave={() => setHovered3(false)}
                    className="e4d-event-team-panel"
                  style={{transform: hovered3 ? "scale(1.01)" : "scale(1)", transition: "transform 0.2s ease, background-color 0.4s ease, color 0.4s ease"}}>
                <h2 className="e4d-section-title">Event Team</h2>
                <div className="e4d-event-team-grid">
                  {eventData.team?.map((person) => (
                    <div key={person.role} className="e4d-team-member">
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