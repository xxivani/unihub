import { useState, useEffect } from 'react';
import './ExternalEvents.css';
import {
  FaTimes,
  FaSearch,
  FaFilter,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaEdit,
  FaPencilAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const formatTimestamp = (timestamp) => {
	if (!timestamp) return "";
	
	try {
	  const date = new Date(timestamp);
	  
	  if (isNaN(date.getTime())) {
		return timestamp;
	  }
	  const hours = date.getHours();
	  const minutes = date.getMinutes();
	  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	  
	  return formattedTime;
	} catch (error) {
	  console.error("Error formatting timestamp:", error);
	  return timestamp;
	}
  };
  
  const formatDate = (timestamp) => {
	if (!timestamp) return "";
	
	try {
	  const date = new Date(timestamp);
	  
	  if (isNaN(date.getTime())) {
		return timestamp;
	  }
	  
	  const day = date.getDate();
	  const month = date.toLocaleString('default', { month: 'long' });
	  const year = date.getFullYear();
	  
	  return `${day} ${month} ${year}`;
	} catch (error) {
	  console.error("Error formatting date:", error);
	  return timestamp;
	}
  };

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="pagination">
      <button
        className={`pagination-arrow ${isFirstPage ? 'disabled' : ''}`}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      <button
        className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>

      <span className="pagination-ellipsis">...</span>

      <button
        className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>

      <button
        className={`pagination-arrow ${isLastPage ? 'disabled' : ''}`}
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

const ExternalEvents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [currentEditEvent, setCurrentEditEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(false);
 

  const navigate = useNavigate();
  
  const dummyEvents = [
    {
      id: 1,
      title: "Student Rep Social",
      image: "/assets/images/social.jpeg",
      description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better.",
      location: "Second floor quiet room",
      time: "15:30-17:00",
      deadline: "15/02/2025",
      date: "20/February/2025",
      capacity: "150 people",
      price: "10 AED/-",
      team: [
        { role: "Organizer", name: "Bob White" },
        { role: "Co-Organizer", name: "David Pinkman" },
        { role: "Manager", name: "Jake Schrader" },
        { role: "Speaker", name: "Kanye Goodman" }
      ],
      category: "SOCIAL_GATHERING"
    },
    {
      id: 2,
      title: "UoBDMUN'25 Conference",
      image: "/assets/images/mun.jpg",
      description: "A dynamic conference where delegates engage in impactful debates, tackle global issues, and refine their diplomacy skills.",
      location: "Main auditorium",
      time: "12:00-14:00",
      deadline: "15/02/2025",
      date: "25/February/2025",
      capacity: "200 people",
      price: "15 AED/-",
      team: [
        { role: "Organizer", name: "John Smith" },
        { role: "Co-Organizer", name: "Emily Davis" },
        { role: "Manager", name: "Michael Johnson" },
        { role: "Speaker", name: "Sarah Williams" }
      ],
      category: "NETWORKING"
    },
    {
      id: 3,
      title: "Intra-Uni Dance Competition",
      image: "/assets/images/dance.jpeg",
      description: "Show off your moves, compete with the best, and set the stage on fire! Open to all university students.",
      location: "Second floor quiet room",
      time: "17:00-18:00",
      deadline: "15/02/2025",
      date: "01/March/2025",
      capacity: "100 people",
      price: "5 AED/-",
      team: [
        { role: "Organizer", name: "Lisa Johnson" },
        { role: "Co-Organizer", name: "Mark Brown" },
        { role: "Manager", name: "Sophie Taylor" }
      ],
      category: "SOCIAL_GATHERING"
    },
    {
      id: 4,
      title: "Matcha Morning",
      image: "/assets/images/matcha.webp",
      description: "Have a cup of matcha and join together for a discussion of your new year plan and meet new friends.",
      location: "First floor meeting room",
      time: "9:00-10:00",
      deadline: "15/02/2025",
      date: "05/March/2025",
      capacity: "50 people",
      price: "10 AED/-",
      team: [
        { role: "Organizer", name: "James Wilson" },
        { role: "Manager", name: "Emma Roberts" }
      ],
      category: "SOCIAL_GATHERING"
    },
    {
      id: 5,
      title: "Plant and Animal Social",
      image: "/assets/images/paws.jpeg",
      description: "Come join us at the PAWS social to unwind with some games, connect with fellow students, and learn more about our society!",
      location: "Room 120B",
      time: "14:00-15:30",
      deadline: "15/02/2025",
      date: "10/March/2025",
      capacity: "75 people",
      price: "8 AED/-",
      team: [
        { role: "Organizer", name: "Bob White" },
        { role: "Co-Organizer", name: "David Pinkman" },
        { role: "Manager", name: "Jake Schrader" },
        { role: "Speaker", name: "Kanye Goodman" }
      ],
      category: "SOCIAL_GATHERING"
    }
  ];
  
  
	// const handleFollowClick = () => {
	// 	if (!user) {
	// 	  promptLogin();
	// 	  return;
	// 	}
	  
	// 	setIsFormVisible(true);
	//   };
	  
	  

  // We define some categories here, so ESLint doesn't flag them as unused.
  const EVENT_CATEGORIES = [
    "HACKATHON",
    "WORKSHOP",
    "NETWORKING",
    "CAREER",
    "SPORTS",
    "GUEST_LECTURE",
    "SOCIAL_GATHERING",
    "VOLUNTEERING"
  ];

  // Fetch events from API
  const fetchEvents = async () => {
	try {
	  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
	  const response = await fetch(`${apiUrl}/external-events`);
	  if (!response.ok) {
		throw new Error('Failed to fetch external events');
	  }
	  const data = await response.json();
	  console.log("Fetched Events:", data);
	  setEvents(data);
	} catch (error) {
	  console.error('Error fetching events:', error);
	  setEvents(dummyEvents);
	}
  };
  
  useEffect(() => {
	fetchEvents();
  }, [refresh]); 
  
  const promptLogin = () => {
	alert("Please log in to follow or view event details.");
	// Alternatively, redirect to login page:
	// navigate("/login");
  };
  
  
  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Logged in user:", parsedUser);
      setUser(parsedUser);
    }
  }, []);

  // Pagination
  const totalPages = 2;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Form & Modal Handlers
  const handleFollowClick = () => {
    setIsFormVisible(true);
  };

  const handleDetailClick = () => {
    navigate('/details-ext');
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setIsSuccessModalVisible(true);
  };

//   const handleFormSubmit = () => {
// 	const storageKey = `followedEvents_${user.id}`;
// 	const followedEvents = JSON.parse(localStorage.getItem(storageKey)) || [];
  
// 	if (!followedEvents.includes(selectedEventId)) {
// 	  followedEvents.push(selectedEventId);
// 	  localStorage.setItem(storageKey, JSON.stringify(followedEvents));
// 	}
  
// 	setIsFollowing((prev) => [...prev, selectedEventId]); // Update state
// 	setIsFormVisible(false); // Hide form after submission
//   };
  

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  // Admin-only Buttons
  const handleCreateEventClick = () => {
    navigate('/create-external-event');
  };

  const handleEditPageClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        console.log("Deleting event with ID:", id);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/external-events/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
  
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.filter(event => event.external_event_id !== id);
          console.log("Updated events list:", updatedEvents);
          return updatedEvents;
        });
  
  
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleEditIconClick = (event) => {
    console.log("Editing event:", event);
    
    // Create a copy of the event with formatted time if it's a timestamp
    const formattedEvent = {
      ...event,
      time: event.external_event_time ? formatTimestamp(event.external_event_time) : event.time,
      date: event.external_event_date ? formatDate(event.external_event_date) : event.date
    };
    
    setCurrentEditEvent(formattedEvent);
    setIsEditFormVisible(true);
  };
  

  const handleCloseEditForm = () => {
    setIsEditFormVisible(false);
    setCurrentEditEvent(null);
  };

  const handleEditFormChange = (field, value) => {
    setCurrentEditEvent({
      ...currentEditEvent,
      [field]: value
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeam = [...currentEditEvent.team];
    updatedTeam[index] = {
      ...updatedTeam[index],
      [field]: value
    };
    setCurrentEditEvent({
      ...currentEditEvent,
      team: updatedTeam
    });
  };

  const handleEditFormSubmit = async (e) => {
	e.preventDefault();
  
	const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
	
	// Create a copy of the current edit event
	const updatedEvent = { ...currentEditEvent };
	
	try {
	  // Handle time conversion - convert "12:30" format to ISO string
	  if (updatedEvent.external_event_time && typeof updatedEvent.external_event_time === 'string') {
		// Check if it's in "HH:MM" format
		if (/^\d{1,2}:\d{2}$/.test(updatedEvent.external_event_time)) {
		  // Parse time parts
		  const [hours, minutes] = updatedEvent.external_event_time.split(':').map(Number);
		  
		  // Create a new Date object for today
		  const timeDate = new Date();
		  
		  // Set hours and minutes
		  timeDate.setHours(hours, minutes, 0, 0);
		  
		  // Convert to ISO string
		  updatedEvent.external_event_time = timeDate.toISOString();
		}
	  }
	  
	  // Handle date conversion if needed
	  if (updatedEvent.external_event_date && typeof updatedEvent.external_event_date === 'string') {
		// Try to parse a date like "20 February 2025" back to a Date object
		const dateParts = updatedEvent.external_event_date.split(' ');
		if (dateParts.length === 3) {
		  const day = parseInt(dateParts[0], 10);
		  const month = dateParts[1]; // February
		  const year = parseInt(dateParts[2], 10);
		  
		  // Get month number (0-based)
		  const monthNames = ["January", "February", "March", "April", "May", "June",
							 "July", "August", "September", "October", "November", "December"];
		  const monthIndex = monthNames.findIndex(m => m === month);
		  
		  if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
			// Create a new date object
			const dateObj = new Date(year, monthIndex, day);
			// Convert to ISO string
			updatedEvent.external_event_date = dateObj.toISOString();
		  }
		}
	  }
  
	  console.log("Sending updated event data:", updatedEvent);
  
	  const response = await fetch(`${apiUrl}/external-events/${currentEditEvent.external_event_id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updatedEvent),
	  });
  
	  if (!response.ok) throw new Error("Failed to update event");
	  
	  // Get the updated event data from the response
	  const updatedEventData = await response.json();
	  console.log("Event updated (from backend):", updatedEventData);
	  
	  // Update the events state with the new data
	  setEvents(prevEvents => 
		prevEvents.map(event => 
		  event.external_event_id === updatedEventData.external_event_id 
			? updatedEventData 
			: event
		)
	  );
	  
	  // Force a UI refresh
	  setRefresh(prev => !prev);
	  
	  // Close edit form
	  setIsEditFormVisible(false);
	  setCurrentEditEvent(null);
	  
	  alert("Event updated successfully!");
  
	} catch (error) {
	  console.error("Error updating event:", error);
	  alert("Failed to update event. Please try again.");
	}
  };

  return (
    <main className="extevent-main-content">
      <div className="extevent-page-header">
        <h1 className="extevent-page-title">Upcoming Events</h1>
        <div className="extevent-search-filter-container">
          <div className="extevent-search-bar">
            <input type="text" placeholder="Search" />
            <button className="extevent-search-button"><FaSearch /></button>
          </div>
          <div className="extevent-action-buttons">
            <button className="extevent-filter-button">
              Filter <FaFilter />
            </button>
            {user && user.role === "admin" && (
              <>
                <button
                  className="extevent-calendar-button"
                  onClick={handleCreateEventClick}
                >
                  Create External Event
                </button>
                <button
                  className={`extevent-edit-button ${isEditMode ? 'active' : ''}`}
                  onClick={handleEditPageClick}
                >
                  {isEditMode ? 'Exit Edit Mode' : 'Edit Page'} <FaEdit />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="extevents-container">
        {events.map((event) => (
          <div className="extevent-card" key={event.id}>
            <div className="extevent-image">
              <img src={event.image} alt={event.title} />
              {isEditMode && user && user.role === "admin" && (
                <>
                  <button
                    className="delete-extevent-button"
                    onClick={() => handleDeleteEvent(event.external_event_id)}
                    aria-label="Delete event"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="edit-extevent-button"
                    onClick={() => handleEditIconClick(event)}
                    aria-label="Edit event"
                  >
                    <FaPencilAlt />
                  </button>
                </>
              )}
            </div>
            <div className="extevent-content">
              <h2 className="extevent-title">{event.external_event_name}</h2>
              <p className="extevent-description">{event.external_event_description}</p>
              <div className="extevent-details">
                <p><strong>Location:</strong> {event.external_event_location}</p>
				<p><strong>Date:</strong> {
    			event.external_event_date 
      			? formatDate(event.external_event_date) 
      			: event.date
  				}</p>
                <p><strong>Time:</strong> {
                  event.external_event_time 
                    ? formatTimestamp(event.external_event_time) 
                    : event.time
                }</p>
              </div>
            </div>
            <div className="extevent-actions">
              <button className="view-button" onClick={() => user ? handleFollowClick() : promptLogin()}>Follow</button>
              <button className="apply-button"  onClick={() => user ? handleDetailClick() : promptLogin()}>Details</button>
            </div>
            <div className="extevent-notification-icon"><FaBell /></div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Sign-Up Form */}
      {isFormVisible && (
        <div className="event-form-overlay">
          <div className="event-form-container">
            <button
              className="close-form-button"
              onClick={handleCloseForm}
              aria-label="Close form"
            >
              <FaTimes />
            </button>
            <h3>Sign Up to Follow Event</h3>
            <form className="event-signup-form" onSubmit={handleFormSubmit}>
              <div className="event-form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="event-form-group">
                <label htmlFor="studentId">Student ID</label>
                <input type="text" id="studentId" name="studentId" required />
              </div>
              <div className="event-form-group">
                <label htmlFor="year">Year of Study</label>
                <input type="text" id="year" name="year" required />
              </div>
              <div className="event-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="event-form-actions">
                <button type="submit" className="event-submit-button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
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
              onClick={handleCloseSuccessModal}
            >
              Return to Event List
            </button>
          </div>
        </div>
      )}

      {/* Edit Event Form */}
      {isEditFormVisible && currentEditEvent && (
        <div className="event-form-overlay">
          <div className="edit-event-form-container">
            <button
              className="close-form-button"
              onClick={handleCloseEditForm}
              aria-label="Close edit form"
            >
              <FaTimes />
            </button>
            <h3>Edit Event Details</h3>
            <form className="edit-event-form" onSubmit={handleEditFormSubmit}>
              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="edit-title">Event Name:</label>
                  <input
                    type="text"
                    id="edit-title"
                    value={currentEditEvent.title}
					onChange={(e) =>
						setCurrentEditEvent({ 
						  ...currentEditEvent, 
						  external_event_name: e.target.value,
						  title: e.target.value // Keep both for compatibility
						})
					}
                    maxLength="100"
                  />
                  {/* <small>{currentEditEvent.title.length} / 100</small> */}
                </div>
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="edit-date">Event Date:</label>
                  <input
                    type="text"
                    id="edit-date"
                    value={currentEditEvent.date}
                    onChange={(e) =>
						setCurrentEditEvent({ 
						  ...currentEditEvent, 
						  external_event_date: e.target.value,
						  date: e.target.value // Keep both for compatibility
						})
					}
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-time">Event Time:</label>
                  <input
                    type="text"
                    id="edit-time"
                    value={currentEditEvent.time}
					onChange={(e) => 
						setCurrentEditEvent({ 
						  ...currentEditEvent, 
						  external_event_time: e.target.value,
						  time: e.target.value // Keep both for compatibility
						})
					}
                  />
                </div>
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-location">Location:</label>
                <input
                  type="text"
                  id="edit-location"
                  value={currentEditEvent.location}
                  onChange={(e) =>
					setCurrentEditEvent({ 
					  ...currentEditEvent, 
					  external_event_location: e.target.value,
					  location: e.target.value // Keep both for compatibility
					})
				  }
                />
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="edit-capacity">Maximum Attendees:</label>
                  <input
                    type="text"
                    id="edit-capacity"
                    value={currentEditEvent.capacity}
					onChange={(e) => 
						setCurrentEditEvent({ 
						  ...currentEditEvent, 
						  external_event_capacity: e.target.value,
						  capacity: e.target.value // Keep both for compatibility
						})
					}
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-price">Ticket Price:</label>
                  <input
                    type="text"
                    id="edit-price"
                    value={currentEditEvent.price}
					onChange={(e) => 
						setCurrentEditEvent({ 
						  ...currentEditEvent, 
						  external_event_price: e.target.value,
						  price: e.target.value // Keep both for compatibility
						})
					}
                  />
                </div>
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-category">Event Category:</label>
                <select
                  id="edit-category"
                  value={currentEditEvent.category}
				  onChange={(e) => 
					setCurrentEditEvent({ 
					  ...currentEditEvent, 
					  external_event_category: e.target.value,
					  category: e.target.value // Keep both for compatibility
					})
				}
                  className="event-category-select"
                >
                  <option value="">Select Event Category</option>
                  {EVENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-description">Description:</label>
                <textarea
                  id="edit-description"
                  value={currentEditEvent.description}
                  onChange={(e) =>
					setCurrentEditEvent({ 
					  ...currentEditEvent, 
					  external_event_description: e.target.value,
					  description: e.target.value // Keep both for compatibility
					})
				  }
                  maxLength="1000"
                />
              </div>

              <div className="event-team-section">
              <div className="event-team-section">
              <h3>Event Team</h3>
              {currentEditEvent.team?.map((member, index) => (
                <div key={member.id || index}>
                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label htmlFor={`team-role-${index}`}>{member.role}:</label>
                      <input
                        type="text"
                        id={`team-name-${index}`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="update-event-button">
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ExternalEvents;
