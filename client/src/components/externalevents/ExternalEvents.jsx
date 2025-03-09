import React, { useState, useEffect } from 'react';
import './ExternalEvents.css';
import { FaTimes, FaSearch, FaFilter, FaCalendarAlt, FaBell, FaChevronLeft, FaChevronRight, FaTrash, FaEdit, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [currentEditEvent, setCurrentEditEvent] = useState(null);
  const [events, setEvents] = useState([
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
  ]);
  const navigate = useNavigate();
  
  // EVENT CATEGORIES array for the dropdown
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
  
  useEffect(() => {
    const checkAdminStatus = () => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setIsAdmin(user.email === 'admin@bham');
      } else {
        // For testing purposes, set to true
        setIsAdmin(true);
      }
    };
    
    checkAdminStatus();
  }, []);

  const eventsPerPage = events.length;
  const totalPages = 2;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };
  
  const handleCreateEventClick = () => {
    navigate('/create-external-event');
  };

  const handleEditPageClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDeleteEvent = (id) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this event?')) {
      // Filter out the event with the matching id
      setEvents(events.filter(event => event.id !== id));
    }
  };
  
  const handleEditIconClick = (event) => {
    setCurrentEditEvent({...event});
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
  
  const handleEditFormSubmit = (e) => {
  e.preventDefault();
  
  // Update the event in the events array
  const updatedEvents = events.map(event => 
    event.id === currentEditEvent.id ? currentEditEvent : event
  );
  
  setEvents(updatedEvents);
  // Store in localStorage
  localStorage.setItem('eventsList', JSON.stringify(updatedEvents));
  
  setIsEditFormVisible(false);
  setCurrentEditEvent(null);
  
  // Show success message
  alert("Event updated successfully!");
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
            {isAdmin && (
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
        {events.map(event => (
          <div className="extevent-card" key={event.id}>
            <div className="extevent-image">
              <img src={event.image} alt={event.title} />
              {isEditMode && isAdmin && (
                <>
                  <button 
                    className="delete-extevent-button"
                    onClick={() => handleDeleteEvent(event.id)}
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
              <h2 className="extevent-title">{event.title}</h2>
              <p className="extevent-description">{event.description}</p>
              <div className="extevent-details">
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Time:</strong> {event.time}</p>
              </div>
            </div>
            <div className="extevent-actions">
              <button className="view-button" onClick={handleFollowClick}>Follow</button>
              <button className="apply-button" onClick={handleDetailClick}>Details</button>
            </div>
            <div className="extevent-notification-icon"><FaBell /></div>
          </div>
        ))}
      </div>

      {/* Dummy Pagination */}
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
            <p>Please make sure to unfollow it if you won't be able to make it to the event on time to give spot to someone else!</p>
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
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    maxLength="100"
                    required
                  />
                  <small>{currentEditEvent.title.length} / 100</small>
                </div>
              </div>
              
              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="edit-date">Event Date:</label>
                  <input
                    type="text"
                    id="edit-date"
                    value={currentEditEvent.date}
                    onChange={(e) => handleEditFormChange('date', e.target.value)}
                    required
                  />
                </div>
                
                <div className="edit-form-group">
                  <label htmlFor="edit-time">Event Time:</label>
                  <input
                    type="text"
                    id="edit-time"
                    value={currentEditEvent.time}
                    onChange={(e) => handleEditFormChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="edit-form-group">
                <label htmlFor="edit-location">Location:</label>
                <input
                  type="text"
                  id="edit-location"
                  value={currentEditEvent.location}
                  onChange={(e) => handleEditFormChange('location', e.target.value)}
                  required
                />
              </div>
              
              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="edit-capacity">Maximum Attendees:</label>
                  <input
                    type="text"
                    id="edit-capacity"
                    value={currentEditEvent.capacity}
                    onChange={(e) => handleEditFormChange('capacity', e.target.value)}
                    required
                  />
                </div>
                
                <div className="edit-form-group">
                  <label htmlFor="edit-price">Ticket Price:</label>
                  <input
                    type="text"
                    id="edit-price"
                    value={currentEditEvent.price}
                    onChange={(e) => handleEditFormChange('price', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="edit-form-group">
                <label htmlFor="edit-category">Event Category:</label>
                <select
                  id="edit-category"
                  value={currentEditEvent.category}
                  onChange={(e) => handleEditFormChange('category', e.target.value)}
                  required
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
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  maxLength="1000"
                  required
                />
                <small>{currentEditEvent.description.length} / 1000</small>
              </div>
              
              <div className="event-team-section">
                <h3>Event Team</h3>
                
                {currentEditEvent.team.map((member, index) => (
                  <div className="edit-form-row" key={index}>
                    <div className="edit-form-group">
                      <label htmlFor={`team-role-${index}`}>{member.role}:</label>
                      <input
                        type="text"
                        id={`team-name-${index}`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        required={member.role === 'Organizer'}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="edit-form-actions">
                <button type="button" onClick={handleCloseEditForm} className="cancel-button">
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