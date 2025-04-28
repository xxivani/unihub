import "./EventCard.css";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { CalendarIcon, LocationIcon } from "../../assets/icons"; 
import { Link } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react";

function EventCards() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const canvasRefs = useRef([]);
    const renderImage = (eventIndex, col) => {
      let event = null
      let canvas = null;
      event = events[eventIndex];
      canvas = canvasRefs.current[event.id * 10 + col];

      if (!canvas || !event.image[`image${col}`]) return;

      const canvasCtx = canvas?.getContext("2d");
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `${apiUrl}${event.image[`image${col}`]}`;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvasCtx.filter = `
          brightness(${event.image[`imageBr${col}`]}%) 
          saturate(${event.image[`imageSa${col}`]}%) 
          blur(${event.image[`imageBl${col}`]}px) 
          invert(${event.image[`imageIn${col}`]}%)`;
        canvasCtx.drawImage(img, 0, 0);
      };
    };
  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/events`);
      const data = await response.json();

      const current = new Date();
      const filterdEvent = data.filter(event => {
        if (!event.deadline) return false;
        const deadlineDate = new Date(event.deadline);
        return deadlineDate >= current;
      });
      const sortedEvent = filterdEvent.sort((a, b) => {
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        return dateA - dateB;
      });
      setEvents(sortedEvent.slice(0,3));
      try {
        const img_response = await fetch(`${apiUrl}/image-management/`);
        const img_data = await img_response.json();
        const int_image = img_data.filter(img => img.eventType == "Internal");

        const updatedEvents = sortedEvent.slice(0,3).map((event) => {
          const curImages = int_image.filter(img => img.eventName == event.title);
          for (let col = 0; col == 0; col++) {
            if (event.image[`image${col}`]) {
              const imgFound = curImages.find(img => img.position == col + 1) || {};
              event = {
                ...event,
                image: {
                  ...event.image,
                  [`image${col}`]: imgFound?.URL,
                  [`imageBr${col}`]: imgFound.brightness,
                  [`imageSa${col}`]: imgFound.saturation,
                  [`imageBl${col}`]: imgFound.blur,
                  [`imageIn${col}`]: imgFound.inversion,
                }
              };
            }
          }
          return event;
        });
        setEvents(updatedEvents);
      } catch(error) {
        console.error("Error fetching images:", error);
      };
      } catch(error) {
        console.error("Error fetching events or users:", error);
      } finally {
        setLoading(false);
      };
  }
  useEffect(() => {
    if (!loading) {
      events.forEach((event, rowIndex) => {
        for (let col = 0; col == 0; col++) {
          if (event.image[`image${col}`]) {
            renderImage(rowIndex, col);
          }
        }
      });
    }
  }, [loading, events]);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="events-section">
    <div className="events-heading-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="6" viewBox="0 0 72 6" fill="none">
            <path d="M0 2.99976H72" stroke="#1D2130" strokeWidth="5"/>
        </svg>
        <h2 className="events-heading">EVENTS UPCOMING THIS WEEK</h2>
    </div>

      <CardGroup className="events-card-group">
        {events.map((event, index) => (
          <Card key={index} className="event-card">
            <canvas className="event-img" ref={(el) => canvasRefs.current[event.id * 10] = el} onClick={() => window.location.href=`/event-details?eventid=${event.id}`}/>{/*<Card.Img variant="top" src="assets/images/img.jpeg" className="event-img" />*/}
            <Card.Body>
              <Card.Title>
                <Link to={`/event-details?eventid=${event.id}`} className="event-title-link">{event.title}</Link>
              </Card.Title>
            </Card.Body>
            <ListGroup className="event-details">
              <ListGroup.Item className="event-detail-item">
                <CalendarIcon /> {event.date} {event.time}
              </ListGroup.Item>
              <ListGroup.Item className="event-detail-item">
                <LocationIcon /> {event.location}
              </ListGroup.Item>
            </ListGroup>
            <Card.Text className="event-description">
              {event.description}
            </Card.Text>
          </Card>
        ))}
      </CardGroup>
      <Link to="/events" className="view-all-events-button">VIEW ALL EVENTS</Link>
    </div>
  );
}

export default EventCards;
