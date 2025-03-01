import React, { useState } from 'react';
import './ExternalEvents.css';
import { FaTimes, FaSearch, FaFilter, FaCalendarAlt, FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


// Dummy Pagination Component (with only one page of content)
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
  const [isFormVisible, setIsFormVisible] = useState(false);  // State to control form visibility
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // State to control success modal visibility
  const navigate = useNavigate();
  const events = [
    {
      id: 1,
      title: "Student Rep Social",
      image: "/assets/images/social.jpeg",
      description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better.",
      location: "Second floor quiet room",
      time: "15:30-17:00",
      deadline: "15/02/2025"
    },
    {
      id: 2,
      title: "UoBDMUN'25 Conference",
      image: "/assets/images/mun.jpg",
      description: "A dynamic conference where delegates engage in impactful debates, tackle global issues, and refine their diplomacy skills.",
      location: "Main auditorium",
      time: "12:00-14:00",
      deadline: "15/02/2025"
    },
    {
      id: 3,
      title: "Intra-Uni Dance Competition",
      image: "/assets/images/dance.jpeg",
      description: "Show off your moves, compete with the best, and set the stage on fire! Open to all university students.",
      location: "Second floor quiet room",
      time: "17:00-18:00",
      deadline: "15/02/2025"
    },
    {
      id: 4,
      title: "Matcha Morning",
      image: "/assets/images/matcha.webp",
      description: "Have a cup of matcha and join together for a discussion of your new year plan and meet new friends.",
      location: "First floor meeting room",
      time: "9:00-10:00",
      deadline: "15/02/2025"
    },
    {
      id: 5,
      title: "Plant and Animal Social",
      image: "/assets/images/paws.jpeg",
      description: "Come join us at the PAWS social to unwind with some games, connect with fellow students, and learn more about our society!",
      location: "Room 120B",
      time: "14:00-15:30",
      deadline: "15/02/2025"
    }
  ];

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
            <button className="extevent-calendar-button">
              Event Calendar <FaCalendarAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="extevents-container">
        {events.map(event => (
          <div className="extevent-card" key={event.id}>
            <div className="extevent-image">
              <img src={event.image} alt={event.title} />
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
    </main>
  );
};

export default ExternalEvents;