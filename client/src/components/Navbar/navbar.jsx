import "./navbar.css";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; 
import { useEffect, useState } from "react";

const CustomNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("user"); // Use sessionStorage instead
    setIsLoggedIn(!!user);
  }, []);
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
            <Nav.Link as={Link} to="/news">News</Nav.Link>
            <Nav.Link as={Link} to="/external-events">External Events</Nav.Link>

            {/* Committee Dropdown */}
            <NavDropdown title="Committee" id="committee-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/committee/dashboard">Dashboard</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/events">Events</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/roles">Role Openings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/budget-tracker">Budget Tracker</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/committee/image-management">Image Management</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Login & Notifications */}
          <Nav>
            {!isLoggedIn ? (
              <Nav.Link as={Link} to="/auth">Register / Login</Nav.Link>
            ) : (
              <>
                <Nav.Link><i className="bell-icon"></i></Nav.Link>
                <Nav.Link><i className="user-icon"></i></Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
