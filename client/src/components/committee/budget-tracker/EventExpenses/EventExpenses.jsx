import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const EventExpenses = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get club_id from URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const clubId = queryParams.get('club_id') || sessionStorage.getItem('selectedClubId');
  
  // Enhanced logging
  useEffect(() => {
    console.log("🚨 DEBUGGING EVENT EXPENSES");
    console.log("Current Club ID:", clubId);
    console.log("URL Parameters:", Object.fromEntries(queryParams));
    console.log("Selected Club ID from Session:", sessionStorage.getItem('selectedClubId'));
  }, [clubId]);

  // Redirect if no clubId is found
  useEffect(() => {
    if (!clubId) {
      console.warn("No Club ID found. Redirecting to budget dashboard.");
      navigate('/committee/budget-tracker');
      return;
    }
  }, [clubId, navigate]);

  // Fetch events on component mount or when clubId changes
  useEffect(() => {
    if (clubId) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [clubId]);
  
  // Fetch events filtered by club_id
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate clubId
      if (!clubId) {
        console.error('No Club ID found');
        setFilteredEvents([]);
        setError("No club selected. Please select a club to view events.");
        setLoading(false);
        return;
      }

      // Create URL with club_id parameter
      const url = `${apiUrl}/bt_eventRoute?club_id=${clubId}`;
      console.log("Fetching events from:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      
      const events = await response.json();
      console.log("Events fetched:", events);

      // Only keep events that belong to this club
      const clubSpecificEvents = events.filter(event => 
        String(event.club_id) === String(clubId)
      );

      console.log("✅ Club-specific events:", clubSpecificEvents);
      
      if (clubSpecificEvents.length === 0) {
        console.warn("No events found for this club!");
      }

      setFilteredEvents(clubSpecificEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Update filter function to include club_id
  const handleFilterChange = async (status) => {
    try {
      setLoading(true);
      setError(null);
      
      // Always include club_id when filtering
      const url = `${apiUrl}/bt_eventRoute/filter/${status}?club_id=${clubId}`;
      console.log("Filtering events with URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to filter events: ${response.status}`);
      }
      
      const events = await response.json();
      console.log("🎉 Filtered events:", events);

      // Additional safety check filtering
      const clubSpecificEvents = events.filter(event => 
        String(event.club_id) === String(clubId)
      );

      setFilteredEvents(clubSpecificEvents);
    } catch (error) {
      console.error('Error filtering events:', error);
      setError(`Failed to filter events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Update search function to include club_id
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return fetchEvents(); // Reset to all events if search is empty
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Always include club_id in search
      const url = `${apiUrl}/bt_eventRoute/search?query=${encodeURIComponent(searchQuery)}&club_id=${clubId}`;
      console.log("Searching events with URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to search events: ${response.status}`);
      }
      
      const events = await response.json();
      console.log("Search results:", events);
      
      // Additional safety check filtering
      const clubSpecificEvents = events.filter(event => 
        String(event.club_id) === String(clubId)
      );

      setFilteredEvents(clubSpecificEvents);
    } catch (error) {
      console.error('Error searching events:', error);
      setError(`Failed to search events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Preserve club_id when navigating back
  const getBackUrl = () => {
    return clubId ? `/committee/budget-tracker?club_id=${clubId}` : "/committee/budget-tracker";
  };
  
  // Show loading state
  if (loading) {
    return <div className="event-expenses-page">Loading events...</div>;
  }

  // Show error state
  if (error) {
    return <div className="event-expenses-page">
      <div className="error-message">{error}</div>
      <Link to={getBackUrl()} className="event-expenses-back-button">Go Back</Link>
    </div>;
  }
  
  // Display club name if available
  const getClubName = () => {
    // This could be enhanced to fetch and display the actual club name
    return clubId ? `Club ${clubId}` : '';
  };
  
  return (
    <div className="event-expenses-page">
      <div className="main-event-expenses">
        <div>
          <div className="event-expenses-title">
            <h2>Event Expenses{clubId ? ` for ${getClubName()}` : ''}</h2>
          </div>
          <div className="event-expenses-controls">
            <div className="event-expenses-filter-bar">
              <FilterBar onFilterChange={handleFilterChange}/>
            </div>
            <div className="event-expenses-header">
              {/* <EventAddExpenseButton onAddEvent={fetchEvents} /> */}
            </div>
          </div>
          <div className="event-expenses-search-bar">
            <FaSearch className="event-expenses-search-icon"/>
            <input
              type="text"
              placeholder="Search for events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="event-expenses-table">
            <EventExpensesTable events={filteredEvents}/>
          </div>
          <div className="event-expenses-button-container">
            <div>
              <Link to={getBackUrl()} onClick={() => window.scrollTo(0, 0)} className="event-expenses-back-button">Go Back</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventExpenses;