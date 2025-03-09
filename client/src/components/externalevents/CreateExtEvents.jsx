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
  // New event category state
  const [eventCategory, setEventCategory] = useState("");
  
  // Budget requirements state
  const [budgetRequired, setBudgetRequired] = useState(false);
  const [budgetCategories, setBudgetCategories] = useState({
    catering: false,
    materials: false,
    price: false,
    transportation: false,
    venue: false
  });
  
  const navigate = useNavigate();

  // Event categories
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
    setPrice(e.target.value);
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
  
  // New handler for event category
  const handleEventCategoryChange = (e) => {
    setEventCategory(e.target.value);
  };
  
  // Handlers for budget requirements
  const handleBudgetRequiredChange = (e) => {
    setBudgetRequired(e.target.checked);
    
    // Reset all categories if budget is not required
    if (!e.target.checked) {
      setBudgetCategories({
        catering: false,
        materials: false,
        price: false,
        transportation: false,
        venue: false
      });
    }
  };
  
  const handleBudgetCategoryChange = (category) => (e) => {
    setBudgetCategories({
      ...budgetCategories,
      [category]: e.target.checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("description", description);
    formData.append("eventDate", eventDate);
    formData.append("eventTime", eventTime);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("maxAttendees", maxAttendees);
    formData.append("organizer", organizer);
    formData.append("coOrganizer", coOrganizer);
    formData.append("manager", manager);
    formData.append("speaker", speaker);
    formData.append("imageUrl", defaultImageUrl);
    formData.append("eventCategory", eventCategory);
    
    // Add budget requirement data
    formData.append("budgetRequired", budgetRequired);
    if (budgetRequired) {
      Object.entries(budgetCategories).forEach(([category, isRequired]) => {
        formData.append(`budget_${category}`, isRequired);
      });
    }

    console.log({ 
      eventName, 
      description, 
      eventDate, 
      eventTime, 
      location, 
      price,
      maxAttendees,
      organizer,
      coOrganizer,
      manager,
      speaker,
      eventCategory,
      budgetRequired,
      budgetCategories
    });
    
    navigate("/external-events");
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
              <label htmlFor="event-price">Ticket Price (AED):</label>
              <input
                type="number"
                id="event-price"
                min="0"
                step="0.01"
                value={price}
                onChange={handlePriceChange}
                required
              />
            </div>
          </div>
          
          {/* New Event Category Section */}
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
          
          {/* Budget Requirements Section */}
          <div className="budget-requirements-section">
            <h3>Budget Requirements</h3>
            
            <div className="budget-toggle">
              <input
                type="checkbox"
                id="budget-required"
                checked={budgetRequired}
                onChange={handleBudgetRequiredChange}
              />
              <label htmlFor="budget-required">Budget Required</label>
            </div>
            
            {budgetRequired && (
              <div className="budget-categories">
                <p>Select required budget categories:</p>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="budget-catering"
                      checked={budgetCategories.catering}
                      onChange={handleBudgetCategoryChange('catering')}
                    />
                    <label htmlFor="budget-catering">Catering</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="budget-materials"
                      checked={budgetCategories.materials}
                      onChange={handleBudgetCategoryChange('materials')}
                    />
                    <label htmlFor="budget-materials">Materials</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="budget-price"
                      checked={budgetCategories.price}
                      onChange={handleBudgetCategoryChange('price')}
                    />
                    <label htmlFor="budget-price">Price</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="budget-transportation"
                      checked={budgetCategories.transportation}
                      onChange={handleBudgetCategoryChange('transportation')}
                    />
                    <label htmlFor="budget-transportation">Transportation</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="budget-venue"
                      checked={budgetCategories.venue}
                      onChange={handleBudgetCategoryChange('venue')}
                    />
                    <label htmlFor="budget-venue">Venue</label>
                  </div>
                </div>
              </div>
            )}
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