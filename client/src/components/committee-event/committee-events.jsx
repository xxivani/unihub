import "./committee-events.css"
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";
import {FaEdit, FaTrash, FaPencilAlt, FaTimes, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa';


const E4CommitteeEvents = () =>{
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const previousPage = queryParams.get("page");
    const [searchParams, setSearchParams] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentEditEvent, setCurrentEditEvent] = useState(null);
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
      const handleImage = (eventName) => {
        window.location.href=`/committee/image-management-single?type=Internal&name=${eventName}`;
      };
      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        searchParams.set('page', pageNumber);
        setSearchParams(searchParams);
      };
      const handleFollowClick = async (eventId) => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
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
      const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?\nThis action is irreversible')) {
          try {
            const response = await fetch(`${apiUrl}/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            localStorage.setItem('eventsList', JSON.stringify(events.filter(event => event.id !== id)));
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occured when deleting the event.');
        }
      }
      };
      const handleEdit = (id) => {
        const eventToEdit = events.find(event => event.id === id);
        if (eventToEdit) {
            setCurrentEditEvent({...eventToEdit});
            setIsEditFormVisible(true);
            setIsEditMode(false);
      }};
      const handleCloseEditForm = () => {
        setIsEditFormVisible(false);
        setCurrentEditEvent(null);
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
      const applyChange = (field, value) => {
        setCurrentEditEvent({
          ...currentEditEvent,
          [field]: value
        })
      };
      const timeFormat = (value) => {
        const timeRegex = /^([0-1]?\d|2[0-3]):([0-5]\d)\s*-\s*([0-1]?\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(value);
      };

      const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        if (!timeFormat(currentEditEvent.time)) {
          alert("Time format incorrect.\nFormat: HH:MM - HH:MM");
          return;
        }
        const response = await fetch(`${apiUrl}/events/${currentEditEvent.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentEditEvent),
      });
        const updatedEvents = events.map(event => 
            event.id === currentEditEvent.id ? currentEditEvent : event
          );
          setEvents(updatedEvents);
          localStorage.setItem('eventsList', JSON.stringify(updatedEvents));
          setIsEditFormVisible(false);
          setCurrentEditEvent(null);
      };
      const fetchData = async () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        setUser(user);
        try {
          if (user.role == "committee" || user.role == "admin") {
          const response = await fetch(`${apiUrl}/events`);
          const data = await response.json();
          setEvents(data);
          const followed = data.filter(event => event.follower?.some(follower => Number(follower.id) == Number(user?.id))).map(event => event.id);
          setFollowed(followed);
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
          }
          } catch(error) {
            console.error("Error fetching events:", error);
          } finally {
            setLoading(false);
          };
        if (user.role == "admin") {
          try {
            const response = await fetch(`${apiUrl}/clubs`);
            const data = await response.json();
            setClubs(data);
            } catch(error) {
                console.error("Error fetching clubs:", error);
            } finally {
              return;
            }
        }
        try {
          const response = await fetch(`${apiUrl}/committee-members/by-user/${user.id}`);
          const data = await response.json();

          if (!data || !data.club_id) return;

          if (user.role == "committee") {
            try {
              const club_response = await fetch(`${apiUrl}/clubs/${data.club_id}`);
              const club_data = await club_response.json();
              setClubs([club_data]);
              if (!selectedClubs.includes(club_data.club_name)) {
                setSelectedClubs([club_data.club_name]);
              }
              } catch(error) {
                  console.error("Error fetching clubs:", error);
              }; 
          }
        } catch (error) {
          console.error("Error fetching committees:", error);
        } 
      }
      useEffect(() => {
        if (!loading) {
          events.forEach((event, rowIndex) => {
            for (let col = 0; col == 0; col++) {
              if (event.image[`image${col}`]) {
                renderImage(rowIndex, col);
              }
            }
          });
        }
      }, [loading, events, currentPage]);
      useEffect(() => {
        fetchData();
      }, [selectedClubs, search, currentPage]);
        if (loading) return <h3 style={{
          position: "absolute",
          top: "35%",
          left: "38vw",
          margin: 0,
        }}>Loading events...</h3>;
      return (
          <div>
              <div className="e4c-top-container">
              <div className="e4c-search-container">
              <h1 className="e4c-top-title">Upcoming Events</h1>
                  <div className="e4c-top-search">
                      <input type="text" placeholder="Search.." value={search} onChange={(e) => setSearch(e.target.value)}></input>
                      </div>
                  <div className="e4c-filter-container">
                  <button className="e4c-top-button" tabIndex="0" onClick={() => isFilterVisible?setIsFilterVisible(false):setIsFilterVisible(true)}><span>Filter</span></button>
                  <div className={`e4c-filter-layer${isFilterVisible?' active':''}`}>
                      {clubs.map(club => (
                        <div className={`e4c-filter-option${isFilterVisible?' active':''}${selectedClubs.includes(club.club_name) ? ' selected' : ''}`} tabIndex="0" key={club.club_id} onClick={() => {
                          if (!(user.role == "committee")) {
                          setSelectedClubs(prev => 
                            prev.includes(club.club_name) 
                              ? prev.filter(c => c !== club.club_name) 
                              : [...prev, club.club_name]
                          );
                        }
                        }}>{club.club_name}</div>
                      ))}
                    </div></div>
                  <button className="e4c-top-create-button" onClick={() => window.location.href="/committee/events/create"}><span>Create Event</span></button>
                  <button 
                          className={`e4c-top-edit-button ${isEditMode ? 'active' : ''}`}
                          onClick={() => setIsEditMode(!isEditMode)}
                      >
                          {isEditMode ? 'Exit Edit' : 'Edit Event'} <FaEdit />
                      </button>
                  </div>
              </div>
          {/* Top and Bottom Section Splitter */}
          <div className="e4c-browse-events">
            {/*}
            {isFormVisible && (
              <div className="e4c-event-form-overlay">
                <div className="e4c-event-form-container">
                  <button 
                    className="e4c-close-form-button" 
                    onClick={() => setIsFormVisible(false)} 
                    aria-label="Close form"
                  >
                    <FaTimes />
                  </button>
                  <h3>Sign Up to Follow Event</h3>
                  <form className="e4c-event-signup-form" onSubmit={handleFormSubmit}>
                    <div className="e4c-event-form-group">
                      <label htmlFor="e4c-name">Name</label>
                      <input type="text" id="name" name="name" required />
                    </div>
                    <div className="e4c-event-form-group">
                      <label htmlFor="e4c-studentId">Student ID</label>
                      <input type="text" id="studentId" name="studentId" required />
                    </div>
                    <div className="e4c-event-form-group">
                      <label htmlFor="e4c-year">Year of Study</label>
                      <input type="text" id="year" name="year" required />
                    </div>
                    <div className="e4c-event-form-group">
                      <label htmlFor="e4c-email">Email</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="e4c-event-form-actions">
                      <button type="submit" className="e4c-event-submit-button">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            */}
            {isSuccessModalVisible && (
                <div className="e4c-event-form-overlay">
                  <div className="e4c-success-modal">
                    <button 
                      className="e4c-close-form-button" 
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
                      className="e4c-return-button"
                      onClick={handleCloseSuccessModal}
                    >
                      Return to Event List
                    </button>
                  </div>
                </div>
              )}
              <div className="e4c-browse-events-list">
              {filteredEvents.slice((0 + (currentPage - 1) * 5), (5 + (currentPage - 1) * 5)).map(event => (
                  <div className="e4c-events-list" key={event.id}><div className="e4c-event-format">
                      <div className="e4c-event-image"><canvas id="canvas" ref={(el) => canvasRefs.current[event.id * 10] = el} onClick={() => window.location.href=`/event-details?eventid=${event.id}`}/>
                      {isEditMode && (
                        <>
                          <button 
                            className="e4c-delete-button"
                            onClick={() => handleDelete(event.id)}
                            aria-label="Delete event"
                          >
                            <FaTrash />
                          </button>
                          <button 
                            className="e4c-edit-button"
                            onClick={() => handleEdit(event.id)}
                            aria-label="Edit event"
                          >
                            <FaPencilAlt />
                          </button>
                          <button
                            className="e4c-image-button"
                            onClick={() => handleImage(event.title)}
                            aria-label="Edit image"
                          >
                            <FaImage />
                          </button>
                        </>
                      )}</div>
                      <div className="e4c-event-info-container"><div className="e4c-event-title" onClick={() => window.location.href=`/event-details?eventid=${event.id}`}>{event.title}</div>
                      <div className="e4c-event-description">{event.description}{/*Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description*/}</div>
                      <div className="e4c-event-time">Location: {event.location}</div><div className="e4c-event-time">Time: {event.time}</div><div className="e4c-event-time">Date: {event.date}</div></div>
                      <div className="e4c-event-button-container">
                      <div className="e4c-event-up-down-container" style={{color: "var(--text-primary) !important",
                        transition: "color 0.4s ease",
                      }}>
                      <button className="e4c-event-follow-button" onClick={() => user ? handleFollowClick(event.id) : window.location.href=`/auth`}>{followed.includes(event.id) ? "Unfollow" : "Follow"}</button>
                      <button className="e4c-event-detail-button" onClick={() => window.location.href=`/event-details?eventid=${event.id}`}>Detail</button></div></div></div></div>
              ))}
              </div>
              {totalPages == 0 && <h3 style={{
                  position: "absolute",
                  top: "-10%",
                  left: "36vw",
                  margin: 0,
                }}>404: No matching events found...</h3>}
              {/*edit*/}
              {isEditFormVisible && currentEditEvent && (
                      <div className="e4c-event-form-overlay">
                        <div className="e4c-edit-event-form-container">
                          <button 
                            className="e4c-close-form-button" 
                            onClick={handleCloseEditForm} 
                            aria-label="Close edit form"
                          >
                            <FaTimes />
                          </button>
                          <h3>Edit Event Details</h3>
                          <form className="e4c-edit-event-form" onSubmit={handleEditFormSubmit}>
                            <div className="e4c-edit-form-row">
                              <div className="e4c-edit-form-group">
                                <label htmlFor="e4c-edit-title">Event Name:</label>
                                <input
                                  type="text"
                                  id="edit-title"
                                  value={currentEditEvent.title}
                                  onChange={(e) => applyChange('title', e.target.value)}
                                  maxLength="100"
                                  required
                                />
                                <small>{currentEditEvent.title.length} / 100</small>
                              </div>
                            </div>
                            
                            <div className="e4c-edit-form-row">
                              <div className="e4c-edit-form-group">
                                <label htmlFor="e4c-edit-date">Event Date:</label>
                                <input
                                  type="text"
                                  id="edit-date"
                                  value={currentEditEvent.date}
                                  onChange={(e) => applyChange('date', e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div className="e4c-edit-form-group">
                                <label htmlFor="e4c-edit-time">Event Time:</label>
                                <input
                                  type="text"
                                  id="edit-time"
                                  value={currentEditEvent.time}
                                  onChange={(e) => applyChange('time', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="e4c-edit-form-group">
                              <label htmlFor="e4c-edit-location">Location:</label>
                              <input
                                type="text"
                                id="edit-location"
                                value={currentEditEvent.location}
                                onChange={(e) => applyChange('location', e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="e4c-edit-form-row">
                              <div className="e4c-edit-form-group">
                                <label htmlFor="e4c-edit-capacity">Maximum Attendees:</label>
                                <input
                                  type="text"
                                  id="edit-capacity"
                                  value={currentEditEvent.capacity}
                                  onChange={(e) => applyChange('capacity', e.target.value)}
                                  required
                                />
                              </div>
                              
                              <div className="e4c-edit-form-group">
                                <label htmlFor="e4c-edit-price">Ticket Price:</label>
                                <input
                                  type="text"
                                  id="edit-price"
                                  value={currentEditEvent.price}
                                  onChange={(e) => applyChange('price', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="e4c-edit-form-group">
                              <label htmlFor="e4c-edit-description">Description:</label>
                              <textarea
                                id="edit-description"
                                value={currentEditEvent.description}
                                onChange={(e) => applyChange('description', e.target.value)}
                                maxLength="1000"
                                required
                              />
                              <small>{currentEditEvent.description.length} / 1000</small>
                            </div>

                            <div className="e4c-event-team-section">
                              <h3>Event Team</h3>
                              
                              {currentEditEvent.team.map((member, index) => (
                                <div className="e4c-edit-form-row" key={index}>
                                  <div className="e4c-edit-form-group">
                                    <label htmlFor={`e4c-team-role-${index}`}>{member.role}:</label>
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
                              <div className="e4c-edit-form-actions">
                                  <button type="button" onClick={handleCloseEditForm} className="e4c-cancel-button">
                                  Cancel
                                  </button>
                                  <button type="submit" className="e4c-update-event-button">
                                  Update Event
                                  </button>
                              </div>
                              </form>
                          </div>
                          </div>
                      )}
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
    <div className="e4c-event-pagination">
      <button
        className={`e4c-event-pagination-arrow ${isFirstPage ? 'disabled' : ''}`}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {totalPages > 4 && <button
        className={`e4c-event-pagination-number ${currentPage === Math.min(Math.max(1, currentPage - 2), totalPages - 4) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(1, currentPage - 2), totalPages - 4))}
      >
        {Math.min(Math.max(1, currentPage - 2), totalPages - 4)}
      </button>}

      {totalPages > 3 && <button
        className={`e4c-event-pagination-number ${currentPage === Math.min(Math.max(2, currentPage - 1), totalPages - 3) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(2, currentPage - 1), totalPages - 3))}
      >
        {Math.min(Math.max(2, currentPage - 1), totalPages - 3)}
      </button>}

      {totalPages > 2 && <button
        className={`e4c-event-pagination-number ${currentPage === Math.min(Math.max(3, currentPage), totalPages - 2) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(3, currentPage), totalPages - 2))}
      >
        {Math.min(Math.max(3, currentPage), totalPages - 2)}
      </button>}

      {totalPages > 1 && <button
        className={`e4c-event-pagination-number ${currentPage === Math.min(Math.max(4, currentPage + 1), totalPages - 1) ? 'active' : ''}`}
        onClick={() => onPageChange(Math.min(Math.max(4, currentPage + 1), totalPages - 1))}
      >
        {Math.min(Math.max(4, currentPage + 1), totalPages - 1)}
      </button>}

      {totalPages > 5 && <span className="e4c-event-pagination-ellipsis">...</span>}

      {totalPages && <button
        className={`e4c-event-pagination-number ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>}

      <button
        className={`e4c-event-pagination-arrow ${isLastPage ? 'disabled' : ''}`}
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default E4CommitteeEvents;