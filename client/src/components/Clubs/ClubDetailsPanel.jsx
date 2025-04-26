import { FaUserCircle } from "react-icons/fa";
import "./ClubDetailsPanel.css";

const ClubDetailsPanel = ({ activeTab, club }) => {
  const teamMembers = [
    { role: "President", name: "Dummy President", email: "president@example.com" },
    { role: "Vice President", name: "Dummy VP", email: "vp@example.com" },
    { role: "Treasurer", name: "Dummy Treasurer", email: "treasurer@example.com" },
  ];

  return (
    <main className="club-details-container">
      <section className="club-info-panel">
        {activeTab === "about" ? (
          <>
            <h2 className="club-info-title">{club.club_name}</h2>
            <p className="club-info-text">{club.club_description}</p>
          </>
        ) : activeTab === "team" ? (
          <>
            <h2 className="club-info-title">Meet the Team</h2>
            <div className="team-list">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <p><strong>{member.role}:</strong> {member.name}</p>
                  <p>Email: <a href={`mailto:${member.email}`}>{member.email}</a></p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="club-info-title">Events</h2>
            <p>Events for this club will be shown here (coming soon).</p>
          </>
        )}
      </section>

      <aside className="club-committee-panel">
        <h2 className="committee-title">Our Team</h2>
        <div className="committee-list">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <FaUserCircle className="member-avatar" /> 
              <div className="member-info">
                <div className="member-role">{member.role}</div>
                <div className="member-name">{member.name}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
};

export default ClubDetailsPanel;
