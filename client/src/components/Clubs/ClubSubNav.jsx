import "./ClubSubNav.css";

const ClubSubNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="club-sub-nav">
      <button
        className={`sub-nav-button ${activeTab === "about" ? "active" : ""}`}
        onClick={() => setActiveTab("about")}
      >
        About Us
      </button>
      <button
        className={`sub-nav-button ${activeTab === "team" ? "active" : ""}`}
        onClick={() => setActiveTab("team")}
      >
        Meet the Team
      </button>
      <button
        className={`sub-nav-button ${activeTab === "events" ? "active" : ""}`}
        onClick={() => setActiveTab("events")}
      >
        Events
      </button>
    </nav>
  );
};

export default ClubSubNav;
