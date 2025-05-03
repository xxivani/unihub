import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import FilterBar from "./FilterBar";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Alert } from 'antd';

const EventExpenses = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [clubName, setClubName] = useState('');

  const searchTimeout = useRef(null);

  // Get club_id from URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const clubId = queryParams.get('club_id') || sessionStorage.getItem('selectedClubId');

  // Redirect if no clubId is found
  useEffect(() => {
    if (!clubId) {
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
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!clubId) {
        setAllEvents([]);
        setFilteredEvents([]);
        setError("No club selected. Please select a club to view events.");
        setLoading(false);
        return;
      }

      const url = `${apiUrl}/bt_eventRoute?club_id=${clubId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const events = await response.json();

      // Only keep events that belong to this club
      const clubSpecificEvents = events.filter(event =>
        String(event.club_id) === String(clubId)
      );

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

  // Apply server-side filtering by status
  const applyServerFilter = async (status) => {
    if (status === 'all') {
      setFilteredEvents(allEvents);
      return;
    }

    try {
      setDataLoading(true);
      setError(null);

      const url = `${apiUrl}/bt_eventRoute/filter/${status}?club_id=${clubId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to filter events: ${response.status} ${response.statusText}`);
      }

      const events = await response.json();

      // Additional safety check filtering
      const clubSpecificEvents = events.filter(event =>
        String(event.club_id) === String(clubId)
      );

      setFilteredEvents(clubSpecificEvents);
    } catch (error) {
      console.error('Error filtering events:', error);
      setError(`Failed to filter events: ${error.message}`);
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

  const handleFilterChange = async (status) => {
    setActiveFilter(status);
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

  const handleSearchButton = () => {
    applyClientSearch(searchQuery);
  };

  // Preserve club_id when navigating back
  const getBackUrl = () => {
    return clubId ? `/committee/budget-tracker?club_id=${clubId}` : "/committee/budget-tracker";
  };

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
            <FaSearch className="event-expenses-search-icon" />
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
              </div>
            ) : null}
            <div className={dataLoading ? "table-container faded" : "table-container"}>
              <EventExpensesTable
                events={filteredEvents}
                onEventUpdate={() => {
                  fetchAllEvents();

                  if (activeFilter !== 'all') {
                    handleFilterChange(activeFilter);
                  }
                }}
              />
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