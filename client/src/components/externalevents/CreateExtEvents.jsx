import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateExtEvents.css";

const CreateExternalEvents = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [coOrganizer, setCoOrganizer] = useState("");
  const [manager, setManager] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  
  const navigate = useNavigate();

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

  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleEventDateChange = (e) => {
    setEventDate(e.target.value);
  };

  const handleEventTimeChange = (e) => {
    setEventTime(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleMaxAttendeesChange = (e) => {
    setMaxAttendees(e.target.value);
  };

  const handleOrganizerChange = (e) => {
    setOrganizer(e.target.value);
  };

  const handleCoOrganizerChange = (e) => {
    setCoOrganizer(e.target.value);
  };

  const handleManagerChange = (e) => {
    setManager(e.target.value);
  };

  const handleSpeakerChange = (e) => {
    setSpeaker(e.target.value);
  };
  
  const handleEventCategoryChange = (e) => {
    setEventCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = "admin"; 
    const eventDateTime = `${eventDate} ${eventTime}`;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    
    const eventData = {
      external_event_name: eventName,
      external_event_description: description,
      external_event_date: eventDate,
      external_event_time: eventDateTime,
      external_event_location: location,
      external_event_ticket_amount: price,
      external_event_max_number_of_attendees: maxAttendees,
      external_event_organizer: organizer,
      external_event_corganizer: coOrganizer,
      external_event_manager: manager,
      external_event_speaker: speaker,
      external_event_category: eventCategory,
      external_event_created_by: userId
    };
  
    try {
      const response = await fetch(`${apiUrl}/external-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
    
      console.log("Response Status:", response.status);
    
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to create event. Status: ${response.status}, Server says: ${errorText}`);
      }
    
      const result = await response.json();
      console.log("Event Created Successfully:", result);
    
      alert("Event created successfully!");
      navigate("/external-events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.message);
    }    
  };
  

  return (
    <div className="create-external-event-container">
      <div className="extheader-row">
        <h1>Create External Event</h1>
        <button 
          className="go-back-button"
          onClick={() => navigate("/external-events")}>
          Go Back
        </button>
      </div>
      <div className="form-box">
        <form onSubmit={handleSubmit} className="create-external-event-form">
          <div className="extform-group">
            <label htmlFor="event-name">Event Name:</label>
            <input
              type="text"
              id="event-name"
              maxLength="100"
              value={eventName}
              onChange={handleEventNameChange}
              required
            />
            <small>{eventName.length} / 100</small>
          </div>
          
          <div className="extform-row">
            <div className="extform-group">
              <label htmlFor="event-date">Event Date:</label>
              <input
                type="date"
                id="event-date"
                value={eventDate}
                onChange={handleEventDateChange}
                required
              />
            </div>
            
            <div className="extform-group">
              <label htmlFor="event-time">Event Time:</label>
              <input
                type="time"
                id="event-time"
                value={eventTime}
                onChange={handleEventTimeChange}
                required
              />
            </div>
          </div>
          
          <div className="extform-group">
            <label htmlFor="event-location">Location:</label>
            <input
              type="text"
              id="event-location"
              value={location}
              onChange={handleLocationChange}
              required
            />
          </div>
          
          <div className="extform-row">
            <div className="extform-group">
              <label htmlFor="event-max-attendees">Maximum Attendees:</label>
              <input
                type="number"
                id="event-max-attendees"
                min="1"
                value={maxAttendees}
                onChange={handleMaxAttendeesChange}
                required
              />
            </div>
            
            <div className="extform-group">
              <label htmlFor="price">Ticket Price (AED):</label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter ticket price"
                required
              />
            </div>
          </div>
          
          {/* Event Category Section */}
          <div className="extform-group">
            <label htmlFor="event-category">Event Category:</label>
            <select
              id="event-category"
              value={eventCategory}
              onChange={handleEventCategoryChange}
              required
              className="event-category-select"
            >
              <option value=""></option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="extform-group">
            <label htmlFor="event-description">Description:</label>
            <textarea
              id="event-description"
              maxLength="1000"
              value={description}
              onChange={handleDescriptionChange}
              required
            />
            <small>{description.length} / 1000</small>
          </div>
          
          <div className="event-team-section">
            <h3>Event Team</h3>
            
            <div className="extform-row">
              <div className="extform-group">
                <label htmlFor="event-organizer">Organizer:</label>
                <input
                  type="text"
                  id="event-organizer"
                  value={organizer}
                  onChange={handleOrganizerChange}
                  required
                />
              </div>
              
              <div className="extform-group">
                <label htmlFor="event-co-organizer">Co-Organizer:</label>
                <input
                  type="text"
                  id="event-co-organizer"
                  value={coOrganizer}
                  onChange={handleCoOrganizerChange}
                />
              </div>
            </div>
            
            <div className="extform-row">
              <div className="extform-group">
                <label htmlFor="event-manager">Manager:</label>
                <input
                  type="text"
                  id="event-manager"
                  value={manager}
                  onChange={handleManagerChange}
                />
              </div>
              
              <div className="extform-group">
                <label htmlFor="event-speaker">Speaker (if applicable):</label>
                <input
                  type="text"
                  id="event-speaker"
                  value={speaker}
                  onChange={handleSpeakerChange}
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="submit-event-button">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExternalEvents;