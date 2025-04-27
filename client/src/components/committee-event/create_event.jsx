import './create_event.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const E4EventCreate = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  const [lockName, setLockName] = useState(false);
  const [user, setUser] = useState(null);
  const [budgetCategories, setBudgetCategories] = useState({
    catering: false,
    materials: false,
    price: false,
    transportation: false,
    venue: false
  });
  const [eventData, setEventData] = useState({
      eventName: "",
      eventImage: JSON.stringify({"image0": "/assets/images/social.jpeg", "image1": "/assets/images/picnic.webp"}),
      eventDescription: "",
      eventLocation: "",
      eventTime: "",
      eventClub: "Admin",
      eventDate: "",
      eventCapacity: "",
      eventPrice: "",
      eventBudgetRequired: false,
      eventBudgetCategories: budgetCategories,
      eventOrganizer: "",
      eventCoOrganizer: "",
      eventManager: "",
      eventSpeaker: ""
  });

  const handleImage = () => {
    if (!lockName) {
      if (!window.confirm(`Are you sure you want ${eventData.eventName} as the event name?\nAdding image will lock the event name and you won't be able to change it`)) {
        return;
      }
    }
    sessionStorage.setItem('temp_eventData', JSON.stringify(eventData));
    sessionStorage.setItem('temp_budgetCategories', JSON.stringify(budgetCategories));
    sessionStorage.setItem('temp_lockName', JSON.stringify(true));
    window.location.href=`/committee/image-management-single?type=Internal&name=${eventData.eventName}`;
  };

  const handleChange = (e) => {
      const { id, value, type, checked, files} = e.target;
      if (id == "eventName" && lockName) {
        alert(`Event name is locked`);
        return eventData
      }
      setEventData({
          ...eventData,
          [id]: type === "checkbox" ? checked : files ? files[0] : value
      });
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

  const timeFormat = (value) => {
    const timeRegex = /^([0-1]?\d|2[0-3]):([0-5]\d)\s*-\s*([0-1]?\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!eventData.eventName || !eventData.eventImage || !eventData.eventLocation || !eventData.eventTime || !eventData.eventClub || !eventData.eventDate || !eventData.eventCapacity || !eventData.eventOrganizer) {
        alert("Required fields missing.");
        return;
      }
      if (!timeFormat(eventData.eventTime)) {
        alert("Time format incorrect.\nFormat: HH:MM - HH:MM");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("title", eventData.eventName);
        let updatedEventImage = eventData.eventImage;
        try {
          const response = await fetch(`${apiUrl}/image-management`);
          const data = await response.json();
          const image = data.filter(img => img.eventName == eventData.eventName);
          updatedEventImage = JSON.stringify({
            image0: image.find(img => img.position == 1)?.URL || "/assets/images/social.jpeg",
            image1: image.find(img => img.position == 2)?.URL || "/assets/images/picnic.webp",
            image2: image.find(img => img.position == 3)?.URL || "",
            image3: image.find(img => img.position == 4)?.URL || "",
            image4: image.find(img => img.position == 5)?.URL || "",
            image5: image.find(img => img.position == 6)?.URL || "",
            image6: image.find(img => img.position == 7)?.URL || "",
            image7: image.find(img => img.position == 8)?.URL || "",
          });

        } catch (error) {
          console.error("Error fetching images:", error);
        }
        formData.append("image", updatedEventImage);
        formData.append("description", eventData.eventDescription);
        formData.append("location", eventData.eventLocation);
        formData.append("time", eventData.eventTime);
        formData.append("club", eventData.eventClub);
        formData.append("date", eventData.eventDate);
        let deadline;
        const today = new Date().toDateString();
        const selectedDate = new Date(eventData.eventDate);

        if (selectedDate.toDateString() === today) {
          deadline = selectedDate.toISOString();
        } else {
          selectedDate.setDate(selectedDate.getDate() - 1);
          deadline = selectedDate.toISOString();
        };
        formData.append("deadline", deadline);
        formData.append("capacity", eventData.eventCapacity);
        formData.append("followed", 0);
        formData.append("waiting", 0);
        formData.append("price", eventData.eventPrice);
        formData.append("budget_required", eventData.eventBudgetRequired);
        formData.append("budget", JSON.stringify({
          catering: budgetCategories.catering,
          materials: budgetCategories.materials,
          price: budgetCategories.price,
          transportation: budgetCategories.transportation,
          venue: budgetCategories.venue
        }));
        formData.append("team", JSON.stringify([
            {role: "organizer", name: eventData.eventOrganizer || ""},
            {role: "coOrganizer", name: eventData.eventCoOrganizer || ""},
            {role: "manager", name: eventData.eventManager || ""},
            {role: "speaker", name: eventData.eventSpeaker || ""}
        ]));
        formData.append("follower", JSON.stringify([]));
        const response = await fetch(`${apiUrl}/events`, {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        sessionStorage.removeItem('temp_eventData');
        sessionStorage.removeItem('temp_budgetCategories');
        sessionStorage.removeItem('temp_lockName');
        navigate("/committee/events");
      } catch (error) {
        alert("Wrong format in some fields.");
    }
  };
  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUser(user);
    try {
      const response = await fetch(`${apiUrl}/committee-members/by-user/${user.id}`);
      const data = await response.json();

      if (!data || !data.club_id) return;

      if (user.role == "committee") {
        try {
          const club_response = await fetch(`${apiUrl}/clubs/${data.club_id}`);
          const club_data = await club_response.json();
          setEventData((prev) => ({
            ...prev,
            eventClub: club_data.club_name
          }));
          } catch(error) {
              console.error("Error fetching clubs:", error);
          }
      }
    } catch (error) {
      console.error("Error fetching committees:", error);
    }
  };
  useEffect(() => {
    const savedData = sessionStorage.getItem('temp_eventData');
    const savedBudget = sessionStorage.getItem('temp_budgetCategories');
    const savedLock = sessionStorage.getItem('temp_lockName');
  
    if (savedData) setEventData(JSON.parse(savedData));
    if (savedBudget) setBudgetCategories(JSON.parse(savedBudget));
    if (savedLock) setLockName(JSON.parse(savedLock));
    fetchData();
  }, []);
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
                type="text"
                id="eventTime"
                placeholder="HH:MM - HH:MM"
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
                id="eventCapacity"
                min="1"
                value={eventData.eventCapacity}
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
              />
            </div>
          </div>
          
          <div className="e4-form-group">
            <label htmlFor="e4-event-category">Event Images:</label>
            <button
              id="eventImage"
              value={eventData.eventImage}
              onClick={handleImage}
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