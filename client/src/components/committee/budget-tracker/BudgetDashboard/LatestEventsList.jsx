// import "./LatestEventsList.css"
// import { Link } from "react-router-dom";


// const LatestEventsList = () => {
//   const latestEvents = [
//     { id: 1, name: "Annual Sports Day", amount: "AED 2,000" },
//     { id: 2, name: "Cultural Fest", amount: "AED 3,500" },
//     { id: 3, name: "Tech Symposium", amount: "AED 1,800" },
// ];

//   return (
//     <div>
//       <ul className="latest-events-list">
//                 {latestEvents.map((event) => (
//                     <li key={event.id} className="event-item">
//                         <span className="event-name">{event.name}</span>
//                         <span className="event-amount">{event.amount}</span>
//                     </li>
//                 ))}
//             </ul>
//             <Link to="/committee/budget-tracker/event-expenses" onClick={() => window.scrollTo(0, 0)} className="budget-view-all-events-button">View All Events</Link>
//     </div>
    
//   );
// };

// export default LatestEventsList;



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import "./LatestEventsList.css";

const LatestEventsList = ({ events: propEvents }) => {
  const [events, setEvents] = useState(propEvents || []);
  const [loading, setLoading] = useState(!propEvents);
  const [error, setError] = useState(null);

  // Get the API URL from environment
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // If events are provided as props, use them
    if (propEvents) {
      setEvents(propEvents.slice(0,3));
      setLoading(false);
      return;
    }

    const fetchLatestEvents = async () => {
      try {
        setLoading(true);
        
        // Get the selected club ID from session storage or URL
        const queryParams = new URLSearchParams(window.location.search);
        const urlClubId = queryParams.get('club_id');
        const storedClubId = sessionStorage.getItem("selectedClubId");
        const clubId = urlClubId || storedClubId;
        
        if (!clubId) {
          throw new Error('No club ID found');
        }
        
        const response = await fetch(`${apiUrl}/bt_eventRoute/latest?club_id=${clubId}&limit=3`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch latest events');
        }
        
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest events:', err);
        setError('Failed to load latest events');
        
        // Fallback data if API fails
        // setEvents([
        //   { id: 1, name: "Annual Sports Day", amount: "AED 2,000" },
        //   { id: 2, name: "Cultural Fest", amount: "AED 3,500" },
        //   { id: 3, name: "Tech Symposium", amount: "AED 1,800" },
        // ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestEvents();
  }, [apiUrl, propEvents]);
  
  if (loading) {
    return <Spin tip="Loading latest events..." />;
  }
  
  if (error && events.length === 0) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div>
      <ul className="latest-events-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <span className="event-name">{event.name}</span>
            <span className="event-amount">{event.amount}</span>
          </li>
        ))}
      </ul>
      <Link 
        to="/committee/budget-tracker/event-expenses" 
        onClick={() => window.scrollTo(0, 0)} 
        className="budget-view-all-events-button"
      >
        View All Events
      </Link>
    </div>
  );
};

export default LatestEventsList;