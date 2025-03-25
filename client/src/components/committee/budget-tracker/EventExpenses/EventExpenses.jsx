import "./EventExpenses.css"
import EventExpensesTable from "./EventExpenseTable";
import EventAddExpenseButton from "./EventExpensesForm";
import FilterBar from "./FilterBar";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const EventExpenses = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = async (status) => {
    try {
      const response = await fetch(`${apiUrl}/bt_eventRoute/filter/${status}`);
      if (!response.ok) {
        throw new Error('Failed to filter events');
      }
      const events = await response.json();
      setFilteredEvents(events);
    } catch (error) {
      console.error('Error filtering events:', error);
      alert('Failed to filter events');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/bt_eventRoute/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search events');
      }
      const events = await response.json();
      setFilteredEvents(events);
    } catch (error) {
      console.error('Error searching events:', error);
      alert('Failed to search events');
    }
  };

  return (
    <div className="event-expenses-page">
      <div className="main-event-expenses">
        <div>
          <div className="event-expenses-title">
            <h2>Event Expenses</h2>
          </div>
          <div className="event-expenses-controls">
            <div className="event-expenses-filter-bar">
              <FilterBar onFilterChange={handleFilterChange}/>
            </div>
            <div className="event-expenses-header">
              {/* <EventAddExpenseButton /> */}
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
              <Link to="/committee/budget-tracker" onClick={() => window.scrollTo(0, 0)} className="event-expenses-back-button">Go Back</Link>
            </div>
            <div>
              <Link to="/committee/budget-tracker/registered-students" onClick={() => window.scrollTo(0, 0)} className="event-expenses-next-button">Go Next</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventExpenses;