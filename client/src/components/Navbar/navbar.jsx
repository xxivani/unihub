import "./navbar.css";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "react-bootstrap";

const CustomNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <Navbar bg="dark" className="navbar navbar-dark" expand="lg" fixed="top"> 
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
            
            {/* Committee Dropdown: Only show if not a student */}
            {user && user.role !== "student" && (
              <NavDropdown title="Committee" id="committee-dropdown" menuVariant="dark">
                <NavDropdown.Item as={Link} to="/committee/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/events">Events</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/roles">Role Openings</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/budget-tracker">Budget Tracker</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/image-management">Image Management</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav>
            <Button variant="outline-light" onClick={toggleTheme} className="me-2">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {!user ? (
              <Nav.Link as={Link} to="/auth">Register / Login</Nav.Link>
            ) : (
              <NavDropdown
                title={<i className="user-icon"></i>}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleSettings}>Settings</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
              
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
