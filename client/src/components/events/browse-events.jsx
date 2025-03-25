import "./browse-events.css"
import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';


const BrowseEvents = () =>{
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
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
          const handleFormSubmit = (e) => {
            e.preventDefault();
            setIsFormVisible(false);
            setIsSuccessModalVisible(true);
          };
          const handleCloseSuccessModal = () => {
            setIsSuccessModalVisible(false);
          };
          useEffect(() => {
            try {
            fetch("http://localhost:5000/events")
              .then((response) => response.json())
              .then((data) => {
                setEvents(JSON.parse(JSON.stringify(data, null, 2)));
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching events:", error);
                setLoading(false);
              });
            } catch (error) {
              /*offline template data*/
            }
          }, []);
            if (loading) return <h3>Loading events...</h3>;
    return (
        <div className="e4-browse-events">
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
                <h2>Event followed successfully</h2>
                <p>Please make sure to unfollow it if you won't be able to make it to the event on time to give spot to someone else!</p>
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
                {events.slice(0,5).map(event => (
                    <div className="e4-events-list" key={event.id}><div className="e4-event-format">
                        <div className="e4-event-image"><img src={event.image.thumbnail} alt={event.title} /></div>
                        <div className="e4-event-info-container"><div className="e4-event-title">{event.title}</div>
                        <div className="e4-event-description">{event.description}{/*Super duper trooper looper uper awesome jaw-dropping eye-popping lung-exploding cool event description*/}</div>
                        <div className="e4-event-time">Location: {event.location}</div><div className="e4-event-time">Time: {event.time}</div><div className="e4-event-time">Date: {event.date}</div></div>
                        <div className="e4-event-button-container">
                        <div className="e4-event-up-down-container"><FaBell/>
                        <button className="e4-event-follow-button" onClick={() => setIsFormVisible(true)}>Follow</button>
                        <button className="e4-event-detail-button" onClick={() => window.location.href=`/event-details?eventid=${event.id}`}>Detail</button></div></div></div></div>
                ))}
            </div>)}
            <div className="e4-event-pagination">
            <a href="#">&laquo;</a>
            <a class="active" href="#">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#">6</a>
            <a href="#">&raquo;</a>
            </div>
        </div>
    );
};

export default BrowseEvents;