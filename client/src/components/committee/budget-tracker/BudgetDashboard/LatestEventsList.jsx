import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spin, Alert } from "antd";
import "./LatestEventsList.css";

const LatestEventsList = ({ events: propEvents }) => {
  const [events, setEvents] = useState(propEvents || []);
  const [loading, setLoading] = useState(!propEvents);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    // If events are provided as props, use them
    if (propEvents && propEvents.length) {
      setEvents(propEvents.slice(0, 3));
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
          throw new Error('No club ID found. Please select a club first.');
        }

        // Make sure we're using the correct endpoint
        const endpoint = apiUrl.includes('/api')
          ? `${apiUrl}/bt_eventRoute/latest`
          : `${apiUrl}/api/bt_eventRoute/latest`;

        const response = await fetch(`${endpoint}?club_id=${clubId}&limit=3`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setEvents(data);
          setError(null);
        } else {
          throw new Error('Received invalid data format from server');
        }
      } catch (err) {
        console.error('Error fetching latest events:', err);
        setError(`Failed to load latest events: ${err.message}`);

        // Try fallback endpoint if the first one failed
        try {
          if (apiUrl.includes('/api')) {
            const fallbackEndpoint = apiUrl.replace('/api', '');

            const clubId = urlClubId || storedClubId;
            const fallbackResponse = await fetch(`${fallbackEndpoint}/api/bt_eventRoute/latest?club_id=${clubId}&limit=3`);

            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              if (Array.isArray(fallbackData)) {
                setEvents(fallbackData);
                setError(null);
              }
            }
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
        }
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
    return (
      <div>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        <ul className="latest-events-list">
          <li className="event-item">
            <span className="event-name">No events available</span>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert
          message="Warning"
          description={`Using cached events. ${error}`}
          type="warning"
          showIcon
          style={{ marginBottom: '10px' }}
          closable
        />
      )}
      <ul className="latest-events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} className="event-item">
              <span className="event-name">{event.name}</span>
              <span className="event-amount">{event.amount}</span>
            </li>
          ))
        ) : (
          <li className="event-item">
            <span className="event-name">No events available</span>
          </li>
        )}
      </ul>
      <Link
        to={`/committee/budget-tracker/event-expenses${window.location.search}`}
        onClick={() => window.scrollTo(0, 0)}
        className="budget-view-all-events-button"
      >
        View All Events
      </Link>
    </div>
  );
};

export default LatestEventsList;