import "./navbar.css";
import "./roleTheme.css";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "react-bootstrap";
import ScreenReaderButton from "../settings/ScreenReaderButton";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const ROLE_LABEL = { student: "Student", committee: "Committee", admin: "Admin" };
const ROLE_BANNER = {
  student: "STUDENT VIEW · browse clubs, join events, apply for roles",
  committee: "COMMITTEE VIEW · manage events, roles, budget and images",
  admin: "ADMIN VIEW · manage clubs, news and external events",
};

const CustomNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      // drives the role-based colours in roleTheme.css
      document.body.setAttribute("data-role", parsed.role);
      document.title = `UniHub · ${ROLE_LABEL[parsed.role] || parsed.role}`;
    }
    return () => {
      document.body.removeAttribute("data-role");
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    document.body.removeAttribute("data-role");
    document.title = "UniHub";
    setUser(null);
    navigate("/auth");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  // Demo mode only: flip between student and committee without logging out.
  const handleSwitchView = () => {
    const toCommittee = user.role === "student";
    const next = toCommittee
      ? { ...user, role: "committee", id: 6, email: "committee@example.com" }
      : { ...user, role: "student", id: 2, email: "student@example.com" };
    sessionStorage.setItem("user", JSON.stringify(next));
    window.location.assign(toCommittee ? "/committee/dashboard" : "/");
  };

  return (
    <>
    <Navbar bg="dark" className="navbar navbar-dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">UniHub</Navbar.Brand>
        {user && (
          <span className={`role-pill role-pill--${user.role}`}>
            {ROLE_LABEL[user.role] || user.role}
          </span>
        )}
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
              <NavDropdown title="Committee Tools" id="committee-dropdown" menuVariant="dark">
                <NavDropdown.Item as={Link} to="/committee/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/events">Events</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/roles">Role Openings</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/budget-tracker">Budget Tracker</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/committee/image-management">Image Management</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav>
            <ScreenReaderButton/>
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

    {user && (
      <div className={`role-banner role-banner--${user.role}`}>
        <span>{ROLE_BANNER[user.role] || user.role}</span>
        {DEMO_MODE && user.role !== "admin" && (
          <button type="button" className="role-banner__switch" onClick={handleSwitchView}>
            Switch to {user.role === "student" ? "Committee" : "Student"} view
          </button>
        )}
      </div>
    )}
    </>
  );
};

export default CustomNavbar;
