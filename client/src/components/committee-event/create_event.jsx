import './create_event.css';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const E4EventCreate = () => {
    const navigate = useNavigate();
    const [budgetCategories, setBudgetCategories] = useState({
      catering: false,
      materials: false,
      price: false,
      transportation: false,
      venue: false
    });
    const [eventData, setEventData] = useState({
        eventName: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        eventMaxAttendees: "",
        eventPrice: "",
        eventImage: "",
        eventDescription: "",
        eventBudgetRequired: false,
        eventBudgetCategories: budgetCategories,
        eventOrganizer: "",
        eventCoOrganizer: "",
        eventManager: "",
        eventSpeaker: ""
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleChange = (e) => {
      console.log("updating...");
        const { id, value, type, checked, files} = e.target;
        setEventData({
            ...eventData,
            [id]: type === "checkbox" ? checked : files ? files[0] : value
        });
        console.log(eventData);
        return eventData
    };

    const handleBudgetCategoryChange = (category) => (e) => {
      setBudgetCategories((prevCategories) => {
      const updatedCategories = {
        ...prevCategories,
        [category]: e.target.checked
    };

    setEventData((prevData) => ({
        ...prevData,
        eventBudgetCategories: updatedCategories
    }));

    return updatedCategories;
    })};

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
      <div className="e4-form-page">
      <div className="e4-header-row">
        <h1>Create Event</h1>
        <button 
          className="e4-go-back-button"
          onClick={() => navigate("/committee/events")}>
          Go Back
        </button>
      </div>
      <div className="e4-form-box">
        <form onSubmit={handleSubmit} className="e4-form-container">
          <div className="e4-form-group">
            <label htmlFor="e4-event-name">Event Name:</label>
            <input
              type="text"
              id="eventName"
              maxLength="100"
              value={eventData.eventName}
              onChange={handleChange}
              required
            />
            <small>{eventData.eventName.length} / 100</small>
          </div>
          
          <div className="e4-form-row">
            <div className="e4-form-group">
              <label htmlFor="e4-event-date">Event Date:</label>
              <input
                type="date"
                id="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="e4-form-group">
              <label htmlFor="e4-event-time">Event Time:</label>
              <input
                type="time"
                id="eventTime"
                value={eventData.eventTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="e4-form-group">
            <label htmlFor="e4-event-location">Location:</label>
            <input
              type="text"
              id="eventLocation"
              value={eventData.eventLocation}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="e4-form-row">
            <div className="e4-form-group">
              <label htmlFor="e4-event-max-attendees">Maximum Attendees:</label>
              <input
                type="number"
                id="eventMaxAttendees"
                min="1"
                value={eventData.eventMaxAttendees}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="e4-form-group">
              <label htmlFor="e4-event-price">Ticket Price (AED):</label>
              <input
                type="number"
                id="eventPrice"
                min="0"
                step="0.1"
                value={eventData.eventPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="e4-form-group">
            <label htmlFor="e4-event-category">Event Images:</label>
            <button
              id="eventImage"
              value={eventData.eventImage}
              onClick={handleChange} //go to image management page
              required
              className="e4-event-category-select"
            >
              Add Images
            </button>
          </div>
          
          <div className="e4-form-group">
            <label htmlFor="e4-event-description">Description:</label>
            <textarea
              id="eventDescription"
              maxLength="1000"
              value={eventData.eventDescription}
              onChange={handleChange}
              required
            />
            <small>{eventData.eventDescription.length} / 1000</small>
          </div>
          
          {/* Budget Requirements Section */}
          <div className="e4-budget-requirements-section">
            <h3>Budget Requirements</h3>
            
            <div className="e4-budget-toggle">
              <input
                type="checkbox"
                id="eventBudgetRequired"
                checked={eventData.eventBudgetRequired}
                onChange={handleChange}
              />
              <label htmlFor="e4-budget-required">Budget Required</label>
            </div>
            
            {eventData.eventBudgetRequired && (
              <div className="e4-budget-categories">
                <p>Select required budget categories:</p>
                <div className="e4-checkbox-group">
                  <div className="e4-checkbox-item">
                    <input
                      type="checkbox"
                      id="budgetCategoriesCatering"
                      checked={budgetCategories.catering}
                      onChange={handleBudgetCategoryChange('catering')}
                    />
                    <label htmlFor="e4-budget-catering">Catering</label>
                  </div>
                  
                  <div className="e4-checkbox-item">
                    <input
                      type="checkbox"
                      id="budgetCategoriesMaterials"
                      checked={budgetCategories.materials}
                      onChange={handleBudgetCategoryChange('materials')}
                    />
                    <label htmlFor="e4-budget-materials">Materials</label>
                  </div>
                  
                  <div className="e4-checkbox-item">
                    <input
                      type="checkbox"
                      id="budgetCategoriesPrice"
                      checked={budgetCategories.price}
                      onChange={handleBudgetCategoryChange('price')}
                    />
                    <label htmlFor="e4-eventBudgetPrice">Price</label>
                  </div>
                  
                  <div className="e4-checkbox-item">
                    <input
                      type="checkbox"
                      id="budgetCategoriesTransportation"
                      checked={budgetCategories.transportation}
                      onChange={handleBudgetCategoryChange('transportation')}
                    />
                    <label htmlFor="e4-budget-transportation">Transportation</label>
                  </div>
                  
                  <div className="e4-checkbox-item">
                    <input
                      type="checkbox"
                      id="budgetCategoriesVenue"
                      checked={budgetCategories.venue}
                      onChange={handleBudgetCategoryChange('venue')}
                    />
                    <label htmlFor="e4-budget-venue">Venue</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="e4-event-team-section">
            <h3>Event Team</h3>
            
            <div className="e4-form-row">
              <div className="e4-form-group">
                <label htmlFor="e4-event-organizer">Organizer:</label>
                <input
                  type="text"
                  id="eventOrganizer"
                  value={eventData.eventOrganizer}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="e4-form-group">
                <label htmlFor="e4-event-co-organizer">Co-Organizer:</label>
                <input
                  type="text"
                  id="eventCoOrganizer"
                  value={eventData.eventCoOrganizer}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="e4-form-row">
              <div className="e4-form-group">
                <label htmlFor="e4=event-manager">Manager:</label>
                <input
                  type="text"
                  id="eventManager"
                  value={eventData.eventManager}
                  onChange={handleChange}
                />
              </div>
              
              <div className="e4-form-group">
                <label htmlFor="e4-event-speaker">Speaker (if applicable):</label>
                <input
                  type="text"
                  id="eventSpeaker"
                  value={eventData.eventSpeaker}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="e4-submit-event-button" onClick={handleSubmit}>
            Create Event
          </button>
        </form>
      </div>
    </div>
    );
};

export default E4EventCreate;