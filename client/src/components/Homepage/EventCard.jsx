import "./EventCard.css";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { CalendarIcon, LocationIcon } from "../../assets/icons"; // Import icons

function EventCards() {
  return (

    <div className="Events-Section">
    <CardGroup>
      <Card>
        <Card.Body>
          <Card.Title>Event 1</Card.Title>
          <Card.Img variant="top" src="assets/images/img.jpeg" />
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <CalendarIcon /> 12 Feb 2025 3pm-5pm
          </ListGroup.Item>
          <ListGroup.Item>
            <LocationIcon /> The Harvard Hall
          </ListGroup.Item>
        </ListGroup>
        <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Card.Text>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Event 2</Card.Title>
          <Card.Img variant="top" src="assets/images/img.jpeg" />
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <CalendarIcon /> 12 Feb 2025 3pm-5pm
          </ListGroup.Item>
          <ListGroup.Item>
            <LocationIcon /> The Harvard Hall
          </ListGroup.Item>
        </ListGroup>
        <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Card.Text>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Event 3</Card.Title>
          <Card.Img variant="top" src="assets/images/img.jpeg" />
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <CalendarIcon /> 12 Feb 2025 3pm-5pm
          </ListGroup.Item>
          <ListGroup.Item>
            <LocationIcon /> The Harvard Hall
          </ListGroup.Item>
        </ListGroup>
        <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Card.Text>
      </Card>
    </CardGroup>
    </div>
  );
}

export default EventCards;
