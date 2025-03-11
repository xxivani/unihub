import "./LatestEventsList.css"
import { Link } from "react-router-dom";


const LatestEventsList = () => {
  const latestEvents = [
    { id: 1, name: "Annual Sports Day", amount: "AED 2,000" },
    { id: 2, name: "Cultural Fest", amount: "AED 3,500" },
    { id: 3, name: "Tech Symposium", amount: "AED 1,800" },
];

  return (
    <div>
      <ul className="latest-events-list">
                {latestEvents.map((event) => (
                    <li key={event.id} className="event-item">
                        <span className="event-name">{event.name}</span>
                        <span className="event-amount">{event.amount}</span>
                    </li>
                ))}
            </ul>
            <Link to="/committee/budget-tracker/event-expenses" onClick={() => window.scrollTo(0, 0)} className="budget-view-all-events-button">View All Events</Link>
    </div>
    
  );
};

export default LatestEventsList;
