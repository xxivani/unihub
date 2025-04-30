import { useEffect, useState } from "react";
import SidebarSettings from "./sidebarSettings";
import "./followed.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Followed = () => {
  const [userId, setUserId] = useState(null);
  const [followedRoles, setFollowedRoles] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData?.id) {
      setUserId(userData.id);
      fetchFollowedRoles(userData.id);
      fetchFollowedEvents(userData.id);
      fetchUserClubs(userData.id); // ✅ fetch clubs
    }
  }, []);

  const fetchFollowedEvents = async (userId) => {
    try {
      const followedEventsIds = JSON.parse(localStorage.getItem(`followedEvents_${userId}`)) || [];

      if (followedEventsIds.length === 0) {
        setFollowedEvents([]);
        setLoading(false);
        return;
      }

      const eventsRes = await fetch(`${apiUrl}/external-events`);
      const eventsData = await eventsRes.json();

      const userFollowedEvents = eventsData.filter(event => 
        followedEventsIds.includes(Number(event.external_event_id))
      ).map(event => ({
        id: event.external_event_id,
        name: event.external_event_name,
        date: event.external_event_date,
        location: event.external_event_location
      }));

      setFollowedEvents(userFollowedEvents);
    } catch (err) {
      console.error("Error fetching followed events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowedRoles = async (userId) => {
    try {
      const [rolesRes, registrationsRes, clubsRes] = await Promise.all([
        fetch(`${apiUrl}/role-openings`),
        fetch(`${apiUrl}/role-opening-registrations`),
        fetch(`${apiUrl}/clubs`)
      ]);

      const [rolesData, registrationsData, clubsData] = await Promise.all([
        rolesRes.json(),
        registrationsRes.json(),
        clubsRes.json()
      ]);

      const clubMap = Object.fromEntries(
        clubsData.map(club => [club.club_id, club.club_name])
      );

      const userRegistrations = registrationsData.filter(
        reg => reg.user_id == userId
      );

      const mappedRoles = userRegistrations.map(reg => {
        const role = rolesData.find(r => r.role_opening_id === reg.role_opening_id);
        return role
          ? {
              position: role.position,
              club: clubMap[role.club_id] || "Unknown Club",
              status: reg.status || "Under review"
            }
          : null;
      }).filter(Boolean);

      setFollowedRoles(mappedRoles);
    } catch (err) {
      console.error("Error fetching followed roles:", err);
    }
  };

  const fetchUserClubs = async (userId) => {
    try {
      const [membershipRes, clubsRes] = await Promise.all([
        fetch(`${apiUrl}/club-memberships/user/${userId}`),
        fetch(`${apiUrl}/clubs`)
      ]);

      const [membershipIds, allClubs] = await Promise.all([
        membershipRes.json(),
        clubsRes.json()
      ]);

      const userClubs = allClubs.filter(club =>
        membershipIds.includes(Number(club.club_id))
      );

      setUserClubs(userClubs);
    } catch (err) {
      console.error("Error fetching user clubs:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="settings-layout">
      <SidebarSettings />

      <div className="followed-page">
        <h2>Followed Role Openings</h2>
        {followedRoles.length === 0 ? (
          <p>You haven't applied to any role openings yet.</p>
        ) : (
          <ul className="followed-list">
            {followedRoles.map((role, idx) => (
              <li key={idx} className="followed-item">
                <span className="role-info">
                  {role.position} for {role.club}
                </span>
                <span className={`status ${role.status.toLowerCase()}`}>
                  {role.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        <h2 style={{ marginTop: '2rem' }}>Clubs You're a Member Of</h2>
        {userClubs.length === 0 ? (
          <p>You are not a member of any clubs yet.</p>
        ) : (
          <ul className="followed-list">
            {userClubs.map((club, idx) => (
              <li key={idx} className="followed-item">
                <span className="role-info">
                  {club.club_name}
                </span>
              </li>
            ))}
          </ul>
        )}

        <h2 style={{ marginTop: '2rem' }}>Followed External Events</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : followedEvents.length === 0 ? (
          <p>You haven't followed any external events yet.</p>
        ) : (
          <ul className="followed-list">
            {followedEvents.map((event, idx) => (
              <li key={idx} className="followed-item">
                <span className="role-info">
                  {event.name} at {event.location}
                </span>
                <span className="status">
                  {formatDate(event.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Followed;
