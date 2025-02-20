import "./navbar.css"
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; 

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top"> 
      <Container>
        <Navbar.Brand as={Link} to="/">UniHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/clubs">Clubs</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            <Nav.Link as={Link} to="/roles">Role Openings</Nav.Link>
            <Nav.Link as={Link} to="/external-events">External Events</Nav.Link>

            {/* Committee Dropdown */}
            <NavDropdown title="Committee" id="committee-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/committee/dashboard">Dashboard</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/events">Events</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/roles">Role Openings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/budget-tracker">Budget Tracker</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/calendar">Committee Calendar</NavDropdown.Item>

            </NavDropdown>
          </Nav>

          {/* Right Side (Login & Notifications) */}
          <Nav>
            <Nav.Link as={Link} to="/auth">Register / Login</Nav.Link>
            <Nav.Link><i className="bi bi-bell"></i></Nav.Link>
            <Nav.Link><i className="bi bi-person-circle"></i></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
