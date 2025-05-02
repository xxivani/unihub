import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Alert, Spin } from 'antd';

const EventExpenses = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [allEvents, setAllEvents] = useState([]); // Store all events for client-side filtering
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false); // For smoother transitions
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [clubName, setClubName] = useState('');

  // Create a debounce timer ref for search
  const searchTimeout = useRef(null);

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
    console.log("Current active filter:", activeFilter);
  }, [clubId, activeFilter]);

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
      fetchAllEvents();
      fetchClubName();
    } else {
      setLoading(false);
    }
  }, [clubId]);

  // Fetch club name
  const fetchClubName = async () => {
    try {
      const response = await fetch(`${apiUrl}/clubs/${clubId}`);
      if (response.ok) {
        const data = await response.json();
        setClubName(data.club_name || `Club ${clubId}`);
      } else {
        setClubName(`Club ${clubId}`);
      }
    } catch (error) {
      console.error("Error fetching club name:", error);
      setClubName(`Club ${clubId}`);
    }
  };

  // Fetch all events and store them for client-side filtering
  // const fetchAllEvents = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Validate clubId
  //     if (!clubId) {
  //       console.error('No Club ID found');
  //       setAllEvents([]);
  //       setFilteredEvents([]);
  //       setError("No club selected. Please select a club to view events.");
  //       setLoading(false);
  //       return;
  //     }

  //     // Create URL with club_id parameter
  //     const url = `${apiUrl}/bt_eventRoute?club_id=${clubId}`;
  //     console.log(`Fetching events from: ${url}`);

  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch events: ${response.status}`);
  //     }

  //     const events = await response.json();
  //     console.log("Events fetched:", events);

  //     // Only keep events that belong to this club
  //     const clubSpecificEvents = events.filter(event => 
  //       String(event.club_id) === String(clubId)
  //     );

  //     console.log("✅ Club-specific events:", clubSpecificEvents);

  //     if (clubSpecificEvents.length === 0) {
  //       console.warn("No events found for this club!");
  //     }

  //     // Store all events for client-side filtering
  //     setAllEvents(clubSpecificEvents);
  //     setFilteredEvents(clubSpecificEvents);

  //     // Reset active filter when refreshing all events
  //     setActiveFilter('all');
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //     setError(`Failed to load events: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate clubId
      if (!clubId) {
        console.error('No Club ID found');
        setAllEvents([]);
        setFilteredEvents([]);
        setError("No club selected. Please select a club to view events.");
        setLoading(false);
        return;
      }

      // Create URL with club_id parameter
      const url = `${apiUrl}/bt_eventRoute?club_id=${clubId}`;
      console.log(`Fetching events from: ${url}`);

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

      // Store all events for client-side filtering
      setAllEvents(clubSpecificEvents);
      setFilteredEvents(clubSpecificEvents);

      // Reset active filter when refreshing all events
      setActiveFilter('all');
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add this component to your EventExpenses.jsx file
  const GeneralEventsList = ({ clubId, onEventImported }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
      // Fetch general events
      const fetchGeneralEvents = async () => {
        if (!clubId) return;

        setLoading(true);
        try {
          // Get club name for filtering
          const clubResponse = await fetch(`${apiUrl}/clubs/${clubId}`);
          if (!clubResponse.ok) {
            throw new Error('Failed to fetch club info');
          }

          const clubData = await clubResponse.json();
          const clubName = clubData.club_name;

          // Fetch all events
          const eventsResponse = await fetch(`${apiUrl}/events`);
          if (!eventsResponse.ok) {
            throw new Error('Failed to fetch events');
          }

          const allEvents = await eventsResponse.json();

          // Filter by club name and events that don't have budgets
          const filteredEvents = allEvents.filter(event =>
            event.club &&
            event.club.toLowerCase().includes(clubName.toLowerCase()) &&
            !event.budget_required
          );

          setEvents(filteredEvents);
        } catch (error) {
          console.error('Error fetching general events:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchGeneralEvents();
    }, [clubId, apiUrl]);

    //new

    const handleImportEvent = async (eventId) => {
      try {
        const response = await fetch(`${apiUrl}/bt_eventRoute/create-from-general`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            club_id: clubId,
            event_id: eventId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400 && data.btEventId) {
            message.info('This event is already in the budget tracker');
          } else {
            throw new Error(data.message || 'Failed to import event');
          }
        } else {
          message.success('Event imported successfully');
          // Remove the imported event from the list
          setEvents(prev => prev.filter(e => e.id !== eventId));
          // Notify parent to refresh
          if (onEventImported) {
            onEventImported();
          }
        }
      } catch (error) {
        console.error('Error importing event:', error);
        message.error(`Failed to import event: ${error.message}`);
      }
    };

    if (loading) {
      return <div>Loading available events...</div>;
    }

    if (events.length === 0) {
      return <div>No additional events available to import</div>;
    }

    return (
      <div className="general-events-list">
        <h3>Available Events to Import</h3>
        <div className="event-cards">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p>Date: {event.date}</p>
              <button
                onClick={() => handleImportEvent(event.id)}
                className="import-button"
              >
                Import to Budget Tracker
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Apply server-side filtering by status
  const applyServerFilter = async (status) => {
    if (status === 'all') {
      setFilteredEvents(allEvents);
      return;
    }

    try {
      setDataLoading(true);
      setError(null);

      // Always include club_id when filtering - make sure status is uppercase for backend
      const url = `${apiUrl}/bt_eventRoute/filter/${status}?club_id=${clubId}`;
      console.log("Filtering events with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to filter events: ${response.status} ${response.statusText}`);
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
      // Keep the active filter state even on error
    } finally {
      setDataLoading(false);
    }
  };

  // Client-side search function
  const applyClientSearch = (query) => {
    if (!query.trim()) {
      // If search is empty, show events based on current filter
      if (activeFilter === 'all') {
        setFilteredEvents(allEvents);
      } else {
        applyServerFilter(activeFilter);
      }
      return;
    }

    // Case-insensitive search within current filter results
    const lowerQuery = query.toLowerCase().trim();

    // First filter by status if needed
    let baseEvents = allEvents;
    if (activeFilter !== 'all') {
      baseEvents = allEvents.filter(event => event.status === activeFilter);
    }

    // Then apply search filter
    const searchResults = baseEvents.filter(event =>
      event.name && event.name.toLowerCase().includes(lowerQuery)
    );

    setFilteredEvents(searchResults);
  };

  // Handle filter changes from FilterBar
  const handleFilterChange = async (status) => {
    setActiveFilter(status); // Update active filter state
    applyServerFilter(status);
  };

  // Debounced search handler for dynamic updates
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout for debouncing (300ms delay)
    searchTimeout.current = setTimeout(() => {
      applyClientSearch(query);
    }, 300);
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Search button handler (for explicit searches)
  const handleSearchButton = () => {
    applyClientSearch(searchQuery);
  };

  // Preserve club_id when navigating back
  const getBackUrl = () => {
    return clubId ? `/committee/budget-tracker?club_id=${clubId}` : "/committee/budget-tracker";
  };

  // Show loading state for initial page load
  if (loading) {
    return <div className="event-expenses-page">
      <div className="main-event-expenses">
        <div className="loading-indicator">Loading events...</div>
      </div>
    </div>;
  }

  return (
    <div className="event-expenses-page">
      <div className="main-event-expenses">
        <div>
          <div className="event-expenses-title">
            <h2>Event Expenses{clubName ? ` for ${clubName}` : ''}</h2>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '20px', maxWidth: '100%' }}
              closable
              onClose={() => setError(null)}
            />
          )}

          <div className="event-expenses-controls">
            <div className="event-expenses-filter-bar">
              <FilterBar onFilterChange={handleFilterChange} initialFilter={activeFilter} />
            </div>
          </div>
          <div className="event-expenses-search-bar">
            <FaSearch className="event-expenses-search-icon"/>
            <input
              type="text"
              placeholder="Search for events"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyUp={(e) => e.key === 'Enter' && handleSearchButton()}
            />
            <button onClick={handleSearchButton}>Search</button>
          </div>

          <div className="event-expenses-table">
            {dataLoading ? (
              <div className="table-loading-overlay">
                {/* <Spin tip="Loading..." /> */}
              </div>
            ) : null}
            <div className={dataLoading ? "table-container faded" : "table-container"}>
              <EventExpensesTable
                events={filteredEvents}
                onEventUpdate={() => {
                  fetchAllEvents();
                  // Maintain current filter after update
                  if (activeFilter !== 'all') {
                    handleFilterChange(activeFilter);
                  }
                }}
              />
              {filteredEvents.length === 0 && (
                <div className="no-events-message">
                  <p>No events found for this club yet. You can import existing events or create new ones.</p>
                  <GeneralEventsList
                    clubId={clubId}
                    onEventImported={fetchAllEvents}
                  />
                </div>
              )}
            </div>
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