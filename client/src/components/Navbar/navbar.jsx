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

               {/* events dropdown*/}
              <NavDropdown title="Events" id="events-dropdown" className="customDropdown" menuVariant="dark">
                <NavDropdown.Item as={Link} to="/committee/events/create">Create Event</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/events/manage">View/Update Event</NavDropdown.Item>
              </NavDropdown>

              {/*role openings dropdown*/}
              <NavDropdown title="Role Openings" id="roles-dropdown" className="customDropdown" menuVariant="dark">
                <NavDropdown.Item as={Link} to="/committee/roles/create">Create Role Opening</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/roles/manage">View/Update Role Opening</NavDropdown.Item>
              </NavDropdown>
              
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
