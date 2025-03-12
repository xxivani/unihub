import "./committee-events.css"
import React, { useState, useEffect } from 'react';
import {FaEdit, FaBell, FaTrash, FaPencilAlt, FaTimes } from 'react-icons/fa';


const E4CommitteeEvents = () =>{
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
          club: "SOCIAL_GATHERING"
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
          club: "NETWORKING"
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
          club: "SOCIAL_GATHERING"
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
          club: "SOCIAL_GATHERING"
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
          club: "SOCIAL_GATHERING"
        }
      ]);
      const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this event?\nThis action is irreversible')) {
            setEvents(events.filter(event => event.id !== id));
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
      const handleEditFormChange = (field, value) => {
        setCurrentEditEvent({
          ...currentEditEvent,
          [field]: value
        });
      };
      const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const updatedEvents = events.map(event => 
            event.id === currentEditEvent.id ? currentEditEvent : event
          );
          setEvents(updatedEvents);
          localStorage.setItem('eventsList', JSON.stringify(updatedEvents));
          
          setIsEditFormVisible(false);
          setCurrentEditEvent(null);
    };
    return (
        <div>
            <div className="e4c-top-container">
            <div className="e4c-search-container">
            <h1 className="e4c-top-title">Upcoming Events</h1>
                <div className="e4c-top-search">
                    <input type="text" placeholder="Search.."></input>
                    </div>
                <div className="e4c-top-button"><span>Filter</span></div>
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
            <div className="e4c-browse-events-list">
            {events.map(event => (
                <div className="e4c-events-list" key={event.id}><div className="e4c-event-format">
                    <div className="e4c-event-image"><img src={event.image} alt={event.title} />
                    {isEditMode && (
                                    <>
                                      <button 
                                        className="e4-delete-button"
                                        onClick={() => handleDelete(event.id)}
                                        aria-label="Delete event"
                                      >
                                        <FaTrash />
                                      </button>
                                      <button 
                                        className="e4-edit-button"
                                        onClick={() => handleEdit(event.id)}
                                        aria-label="Edit event"
                                      >
                                        <FaPencilAlt />
                                      </button>
                                    </>
                                  )}</div>
                    <div className="e4-event-info-container"><div className="e4-event-title">{event.title}</div>
                    <div className="e4-event-description">{event.description}{/*Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description*/}</div>
                    <div className="e4-event-time">Location: {event.location}</div><div className="e4-event-time">Time: {event.time}</div><div className="e4-event-time">Date: {event.date}</div></div>
                    <div className="e4-event-button-container">
                    <div className="e4-event-up-down-container"><FaBell/>
                    <button className="e4-event-follow-button">Follow</button>
                    <button className="e4-event-detail-button" onClick={() => window.location.href='/event-details'}>Detail</button></div></div></div></div>
            ))}
            </div>
            {isEditFormVisible && currentEditEvent && (
                    <div className="e4-event-form-overlay">
                      <div className="e4-edit-event-form-container">
                        <button 
                          className="e4-close-form-button" 
                          onClick={handleCloseEditForm} 
                          aria-label="Close edit form"
                        >
                          <FaTimes />
                        </button>
                        <h3>Edit Event Details</h3>
                        <form className="e4-edit-event-form" onSubmit={handleEditFormSubmit}>
                          <div className="e4-edit-form-row">
                            <div className="e4-edit-form-group">
                              <label htmlFor="e4-edit-title">Event Name:</label>
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
                          
                          <div className="e4-edit-form-row">
                            <div className="e4-edit-form-group">
                              <label htmlFor="e4-edit-date">Event Date:</label>
                              <input
                                type="text"
                                id="edit-date"
                                value={currentEditEvent.date}
                                onChange={(e) => handleEditFormChange('date', e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="e4-edit-form-group">
                              <label htmlFor="e4-edit-time">Event Time:</label>
                              <input
                                type="text"
                                id="edit-time"
                                value={currentEditEvent.time}
                                onChange={(e) => handleEditFormChange('time', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="e4-edit-form-group">
                            <label htmlFor="e4-edit-location">Location:</label>
                            <input
                              type="text"
                              id="edit-location"
                              value={currentEditEvent.location}
                              onChange={(e) => handleEditFormChange('location', e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="e4-edit-form-row">
                            <div className="e4-edit-form-group">
                              <label htmlFor="e4-edit-capacity">Maximum Attendees:</label>
                              <input
                                type="text"
                                id="edit-capacity"
                                value={currentEditEvent.capacity}
                                onChange={(e) => handleEditFormChange('capacity', e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="e4-edit-form-group">
                              <label htmlFor="e4-edit-price">Ticket Price:</label>
                              <input
                                type="text"
                                id="edit-price"
                                value={currentEditEvent.price}
                                onChange={(e) => handleEditFormChange('price', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="e4-edit-form-group">
                            <label htmlFor="e4-edit-description">Description:</label>
                            <textarea
                              id="edit-description"
                              value={currentEditEvent.description}
                              onChange={(e) => handleEditFormChange('description', e.target.value)}
                              maxLength="1000"
                              required
                            />
                            <small>{currentEditEvent.description.length} / 1000</small>
                          </div>
                          
                          <div className="e4-event-team-section">
                            <h3>Event Team</h3>
                            
                            {currentEditEvent.team.map((member, index) => (
                              <div className="e4-edit-form-row" key={index}>
                                <div className="e4-edit-form-group">
                                  <label htmlFor={`e4-team-role-${index}`}>{member.role}:</label>
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
                            <div className="e4-edit-form-actions">
                                <button type="button" onClick={handleCloseEditForm} className="e4-cancel-button">
                                Cancel
                                </button>
                                <button type="submit" className="e4-update-event-button">
                                Update Event
                                </button>
                            </div>
                            </form>
                        </div>
                        </div>
                    )}
            <div className="e4-event-pagination">
            <a href="#">&laquo;</a>
            <a className="active" href="#">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#">6</a>
            <a href="#">&raquo;</a>
            </div>
        </div>
        </div>
    );
};

export default E4CommitteeEvents;