import "./EventCard.css";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { CalendarIcon, LocationIcon } from "../../assets/icons"; 
import { Link } from "react-router-dom"; 

function EventCards() {
  return (
    <div className="events-section">
    <div className="events-heading-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="6" viewBox="0 0 72 6" fill="none">
            <path d="M0 2.99976H72" stroke="#1D2130" strokeWidth="5"/>
        </svg>
        <h2 className="events-heading">EVENTS UPCOMING THIS WEEK</h2>
    </div>

      <CardGroup className="events-card-group">
        {[1, 2, 3].map((event, index) => (
          <Card key={index} className="event-card">
            <Card.Img variant="top" src="assets/images/img.jpeg" className="event-img" />
            <Card.Body>
              <Card.Title>
                <Link to={`/event/${index}`} className="event-title-link">Lorem ipsum dolor sit amet</Link>
              </Card.Title>
            </Card.Body>
            <ListGroup className="event-details">
              <ListGroup.Item className="event-detail-item">
                <CalendarIcon /> 12 Feb 2025 3pm-5pm
              </ListGroup.Item>
              <ListGroup.Item className="event-detail-item">
                <LocationIcon /> The Harvard Hall
              </ListGroup.Item>
            </ListGroup>
            <Card.Text className="event-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
            </Card.Text>
          </Card>
        ))}
      </CardGroup>
      <Link to="/events" className="view-all-events-button">VIEW ALL EVENTS</Link>
    </div>
  );
}

export default EventCards;
