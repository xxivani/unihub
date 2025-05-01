import "./browse-events.css"
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const BrowseEvents = () =>{
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const previousPage = queryParams.get("page");
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([
      {
        id: 1,
        title: "Student Rep Social",
        image: {"thumbnail": "/assets/images/social.jpeg", "prev": "/assets/images/picnic.webp"},
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
        club: "SOCIAL_GATHERING"
      },
      {
        id: 2,
        title: "UoBDMUN'25 Conference",
        image: {"thumbnail": "/assets/images/mun.jpg", "prev": "/assets/images/picnic.webp"},
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
        club: "NETWORKING"
      },
      {
        id: 3,
        title: "Intra-Uni Dance Competition",
        image: {"thumbnail": "/assets/images/dance.jpeg", "prev": "/assets/images/picnic.webp"},
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
        club: "SOCIAL_GATHERING"
      },
      {
        id: 4,
        title: "Matcha Morning",
        image: {"thumbnail": "/assets/images/matcha.webp", "prev": "/assets/images/picnic.webp"},
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
        club: "SOCIAL_GATHERING"
      },
      {
        id: 5,
        title: "Plant and Animal Social",
        image: {"thumbnail": "/assets/images/paws.jpeg", "prev": "/assets/images/picnic.webp"},
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
        club: "SOCIAL_GATHERING"
      }
    ]);
    const [user, setUser] = useState(null);
    const [clubs, setClubs] = useState([]);
    const filteredEvents = events.filter(event => {
      const matchesClub = selectedClubs.length === 0 || selectedClubs.includes(event.club);
      const matchesSearch = search === "" || event.title.toLowerCase().includes(search.toLowerCase());
      return matchesClub && matchesSearch;
    });
    const [followed, setFollowed] = useState([]);
    const [followId, setFollowId] = useState(0);
    const totalPages = Math.ceil(filteredEvents.length / 5);
    const [currentPage, setCurrentPage] = useState(Number(previousPage) || 1);
    const canvasRefs = useRef([]);
    const renderImage = (eventIndex, col) => {
      let event = null
      let canvas = null;
      event = events[eventIndex];
      canvas = canvasRefs.current[event.id * 10 + col];
      if (!canvas) return;
          /*console.error("Image at: (" + eventIndex + ", " + col + ") does not exist.")*/
      if (!event.image[`image${col}`] || event.image[`image${col}`] == "") {
        const canvasCtx = canvas?.getContext("2d");
        const img = new Image();
        img.src = "/assets/images/event_template.png";
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          canvasCtx.drawImage(img, 0, 0);
        }
        return;
      }
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
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      searchParams.set('page', pageNumber);
      setSearchParams(searchParams);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const handleFollowClick = async (eventId) => {
      try {
        const follow = followed.includes(eventId);
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
        const response = await fetch(`${apiUrl}/events`);
        const data = await response.json();
        setEvents(data);
        const user = JSON.parse(sessionStorage.getItem("user"));
        setUser(user);
        const followed = data.filter(event => event.follower?.some(follower => Number(follower.id) == Number(user?.id))).map(event => event.id);
        setFollowed(followed);
        try {
          const club_response = await fetch(`${apiUrl}/clubs`);
          const club_data = await club_response.json();
          setClubs(club_data);
          } catch(error) {
              console.error("Error fetching clubs:", error);
          };
        try {
          const img_response = await fetch(`${apiUrl}/image-management/`);
          const img_data = await img_response.json();
          const int_image = img_data.filter(img => img.eventType == "Internal");

          const updatedEvents = data.map((event) => {
            const curImages = int_image.filter(img => img.eventName == event.title);
            for (let col = 0; col == 0; col++) {
              if (event.image[`image${col}`]) {
                const imgFound = curImages.find(img => img.position == col + 1) || {};
                event = {
                  ...event,
                  image: {
                    ...event.image,
                    [`image${col}`]: imgFound?.URL,
                    [`imageBr${col}`]: imgFound.brightness,
                    [`imageSa${col}`]: imgFound.saturation,
                    [`imageBl${col}`]: imgFound.blur,
                    [`imageIn${col}`]: imgFound.inversion,
                  }
                };
              }
            }
            return event;
          });
          setEvents(updatedEvents);
        } catch(error) {
          console.error("Error fetching images:", error);
        };
        } catch(error) {
          console.error("Error fetching events or users:", error);
        } finally {
          setLoading(false);
        };
    }
    useEffect(() => {
      if (!loading) {
        events.forEach((event, rowIndex) => {
          for (let col = 0; col == 0; col++) {
            renderImage(rowIndex, col);
          }
        });
      }
    }, [loading, events, currentPage]);
    useEffect(() => {
      fetchData();
    }, [selectedClubs, search, currentPage]);
    if (loading) return <h3 style={{
      position: "absolute",
      top: "20%",
      left: "38vw",
      margin: 0,
    }}>Loading events...</h3>;
    return (
      <div>
      <div className="e4-top-container">
            <div className="e4-search-container">
            <h1 className="e4-top-title">Upcoming Events</h1>
                <div className="e4-top-search">
                    <input type="text" placeholder="Search.." value={search} onChange={(e) => setSearch(e.target.value)}></input>
                    </div>
                <div className="e4-top-filter-container">
                  <button className="e4-top-button" tabIndex="0" onClick={() => isFilterVisible?setIsFilterVisible(false):setIsFilterVisible(true)}><span>Filter</span></button>
                  <div className={`e4-filter-layer${isFilterVisible?' active':''}`}>
                    {clubs.map(club => (
                      <div className={`e4-filter-option${isFilterVisible?' active':''}${selectedClubs.includes(club.club_name) ? ' selected' : ''}`} tabIndex="0" key={club.club_id} onClick={() => {
                        setSelectedClubs(prev => 
                          prev.includes(club.club_name) 
                            ? prev.filter(c => c !== club.club_name) 
                            : [...prev, club.club_name]
                        );
                      }}>{club.club_name}</div>
                    ))}
                  </div>
                </div>
                </div>
            </div>
        <div className="e4-browse-events">
          {/*
          {isFormVisible && (
            <div className="e4-event-form-overlay">
              <div className="e4-event-form-container">
                <button 
                  className="e4-close-form-button" 
                  onClick={() => setIsFormVisible(false)} 
                  aria-label="Close form"
                >
                  <FaTimes />
                </button>
                <h3>Sign Up to Follow Event</h3>
                <form className="e4-event-signup-form" onSubmit={handleFormSubmit}>
                  <div className="e4-event-form-group">
                    <label htmlFor="e4-name">Name</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="e4-event-form-group">
                    <label htmlFor="e4-studentId">Student ID</label>
                    <input type="text" id="studentId" name="studentId" required />
                  </div>
                  <div className="e4-event-form-group">
                    <label htmlFor="e4-year">Year of Study</label>
                    <input type="text" id="year" name="year" required />
                  </div>
                  <div className="e4-event-form-group">
                    <label htmlFor="e4-email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="e4-event-form-actions">
                    <button type="submit" className="e4-event-submit-button">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          */}
          {isSuccessModalVisible && (
            <div className="e4-event-form-overlay">
              <div className="e4-success-modal">
                <button 
                  className="e4-close-form-button" 
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
                  className="e4-return-button"
                  onClick={handleCloseSuccessModal}
                >
                  Return to Event List
                </button>
              </div>
            </div>
          )}
            {events != null && (<div className="e4-browse-events-list">
                {filteredEvents.slice((0 + (currentPage - 1) * 5), (5 + (currentPage - 1) * 5)).map(event => (
                    <div className="e4-events-list" key={event.id}><div className="e4-event-format">
                        <div className="e4-event-image"><canvas ref={(el) => canvasRefs.current[event.id * 10] = el} onClick={() => window.location.href=`/event-details?eventid=${event.id}`}/></div>
                        <div className="e4-event-info-container"><div className="e4-event-title" onClick={() => window.location.href=`/event-details?eventid=${event.id}`}>{event.title}</div>
                        <div className="e4-event-description">{event.description}{/*Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description*/}</div>
                        <div className="e4-event-time">Location: {event.location}</div><div className="e4-event-time">Time: {event.time}</div><div className="e4-event-time">Date: {event.date}</div></div>
                        <div className="e4-event-button-container">
                        <div className="e4-event-up-down-container" style={{color: "var(--text-primary) !important",
                          transition: "color 0.4s ease",
                        }}>
                        <button className="e4-event-follow-button" onClick={() => user ? handleFollowClick(event.id) : window.location.href=`/auth`}>{followed.includes(event.id) ? "Unfollow" : "Follow"}</button>
                        <button className="e4-event-detail-button" onClick={() => window.location.href=`/event-details?eventid=${event.id}`}>Detail</button></div></div></div></div>
                ))}
            </div>)}
            {totalPages == 0 && <h3 style={{
                position: "relative",
                width: "100%",
                textAlign: "center",
                margin: "2px",
              }}>There are no events with the current settings...</h3>}
            <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
        </div>
        </div>
    );
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
const isFirstPage = currentPage === 1;
const isLastPage = currentPage === totalPages;

  return (
    <div className="e4-event-pagination">
      <button
        className={`e4-event-pagination-arrow ${isFirstPage ? 'disabled' : ''}`}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {totalPages > 4 && <button
        className={`e4-event-pagination-number ${currentPage === Math.min(Math.max(1, currentPage - 2), totalPages - 4) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(1, currentPage - 2), totalPages - 4))}
      >
        {Math.min(Math.max(1, currentPage - 2), totalPages - 4)}
      </button>}

      {totalPages > 3 && <button
        className={`e4-event-pagination-number ${currentPage === Math.min(Math.max(2, currentPage - 1), totalPages - 3) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(2, currentPage - 1), totalPages - 3))}
      >
        {Math.min(Math.max(2, currentPage - 1), totalPages - 3)}
      </button>}

      {totalPages > 2 && <button
        className={`e4-event-pagination-number ${currentPage === Math.min(Math.max(3, currentPage), totalPages - 2) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(3, currentPage), totalPages - 2))}
      >
        {Math.min(Math.max(3, currentPage), totalPages - 2)}
      </button>}

      {totalPages > 1 && <button
        className={`e4-event-pagination-number ${currentPage === Math.min(Math.max(4, currentPage + 1), totalPages - 1) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(4, currentPage + 1), totalPages - 1))}
      >
        {Math.min(Math.max(4, currentPage + 1), totalPages - 1)}
      </button>}

      {totalPages > 5 && <span className="e4c-event-pagination-ellipsis">...</span>}

      {totalPages && <button
        className={`e4-event-pagination-number ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>}

      <button
        className={`e4-event-pagination-arrow ${isLastPage ? 'disabled' : ''}`}
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default BrowseEvents;