import { Link } from "react-router-dom";
import "../../ui/ui.css";

const Footer = () => (
  <footer className="ux-footer">
    <div className="ux-wrap">
      <div className="ux-footer-grid">
        <div>
          <div className="ux-footer-brand">UniHub</div>
          <p>The home for student societies at the University of Birmingham Dubai: clubs, events, roles and news in one place.</p>
        </div>
        <div>
          <h4>Discover</h4>
          <Link to="/events">Events</Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/external-events">External events</Link>
          <Link to="/news">News</Link>
        </div>
        <div>
          <h4>Get involved</h4>
          <Link to="/roles">Role openings</Link>
          <Link to="/committee/dashboard">Committee tools</Link>
          <Link to="/settings">Account settings</Link>
        </div>
        <div>
          <h4>Legal</h4>
          <Link to="/gdpr-policy">GDPR policy</Link>
          <Link to="/auth">Sign in</Link>
        </div>
      </div>
      <div className="ux-footer-bottom">
        <span>© {new Date().getFullYear()} UniHub · Team 77</span>
        <span>Demo build with sample data</span>
      </div>
    </div>
  </footer>
);

export default Footer;
