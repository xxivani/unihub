import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { FaSearch, FaSync } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Alert, Space, Spin } from 'antd';

const EventExpenses = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  const [allEvents, setAllEvents] = useState([]); // Store all events for client-side filtering
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false); // For smoother transitions
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
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
    } else {
      setLoading(false);
    }
  }, [clubId]);
  
  // Fetch all events and store them for client-side filtering
  const fetchAllEvents = async (syncEvents = false) => {
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
  
      // Create URL with club_id parameter and explicit sync_events control
      const syncParam = syncEvents ? '&sync_events=true' : '&sync_events=false';
      const url = `${apiUrl}/bt_eventRoute?club_id=${clubId}${syncParam}`;
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
  
  // Then modify the syncGeneralEvents function to explicitly request sync:
  const syncGeneralEvents = async () => {
    try {
      setSyncing(true);
      
      // First call the sync endpoint
      const response = await fetch(`${apiUrl}/bt_eventRoute/sync-general-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ club_id: clubId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync events: ${response.status}`);
      }
      
      // Then refresh events with sync_events=true to show the newly synced events
      await fetchAllEvents(true);
      
      // Show success message
      alert("Events synchronized successfully!");
    } catch (error) {
      console.error('Error syncing events:', error);
      alert(`Failed to sync events: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };
  
  // Apply server-side filtering by status
  const applyServerFilter = async (status) => {
    if (status === 'all') {
      // If filtering by "all", use the cached events
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
  
  // Sync general events with budget tracker
  // const syncGeneralEvents = async () => {
  //   try {
  //     setSyncing(true);
      
  //     // Call the new sync endpoint
  //     const response = await fetch(`${apiUrl}/bt_eventRoute/sync-general-events`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ club_id: clubId })
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`Failed to sync events: ${response.status}`);
  //     }
      
  //     // Refresh events after sync
  //     await fetchAllEvents();
      
  //     // Show success message
  //     alert("Events synchronized successfully!");
  //   } catch (error) {
  //     console.error('Error syncing events:', error);
  //     alert(`Failed to sync events: ${error.message}`);
  //   } finally {
  //     setSyncing(false);
  //   }
  // };
  
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
            <div className="event-expenses-header">
              <button 
                className="sync-events-button" 
                onClick={syncGeneralEvents}
                disabled={syncing}
              >
                <FaSync className={syncing ? "spinning" : ""} />
                {syncing ? "Syncing..." : "Sync Events"}
              </button>
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
                <Spin tip="Loading..." />
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