import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ClubDetailsPanel.css";

const ClubDetailsPanel = ({ activeTab, club }) => {
  const navigate = useNavigate();
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fallbackMembers = [
    {
      committee_member_name: "Alex Johnson",
      committee_member_email: "alex.johnson@example.com",
      committee_member_position: "President",
    },
    {
      committee_member_name: "Maria Lee",
      committee_member_email: "maria.lee@example.com",
      committee_member_position: "Treasurer",
    },
    {
      committee_member_name: "Omar Hussein",
      committee_member_email: "omar.hussein@example.com",
      committee_member_position: "Events Officer",
    }
  ];

  useEffect(() => {
    if (!club?.club_id) return;

    const fetchCommitteeMembers = async () => {
      try {
        const response = await fetch(`${apiUrl}/committee-members/by-club/${club.club_id}`);
        const data = await response.json();
        setCommitteeMembers(data);
      } catch (error) {
        console.error("Failed to load committee members", error);
      }
    };

    fetchCommitteeMembers();
  }, [club]);

  useEffect(() => {
    const fetchClubEvents = async () => {
      try {
        const response = await fetch(`${apiUrl}/events`);
        const allEvents = await response.json();
        const filtered = allEvents.filter(event => event.club === club.club_name);
        setClubEvents(filtered);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (club?.club_name) {
      fetchClubEvents();
    }
  }, [club]);

  const membersToShow = committeeMembers.length > 0 ? committeeMembers : fallbackMembers;

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
              {membersToShow.map((member, index) => (
                <div key={index} className="team-card">
                  <p><strong>{member.committee_member_position}:</strong> {member.committee_member_name}</p>
                  <p>Email: <a href={`mailto:${member.committee_member_email}`}>{member.committee_member_email}</a></p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="club-info-title">Events</h2>
            {clubEvents.length > 0 ? (
              <div className="event-card-list">
                {clubEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-info">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description">{event.description}</p>
                      <p><strong>Date:</strong> {event.date}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                    </div>
                    <button
                      className="view-event-btn"
                      onClick={() => navigate(`/event-details/${event.id}`)}
                    >
                      View Event
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events available for this club.</p>
            )}
          </>
        )}
      </section>

      <aside className="club-committee-panel">
        <h2 className="committee-title">Our Team</h2>
        <div className="committee-list">
          {membersToShow.map((member, index) => (
            <div key={index} className="team-member">
              <FaUserCircle className="member-avatar" />
              <div className="member-info">
                <div className="member-role">{member.committee_member_position}</div>
                <div className="member-name">{member.committee_member_name}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
};

export default ClubDetailsPanel;
