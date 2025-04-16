import { useEffect, useState } from "react";
import SidebarSettings from "./sidebarSettings";
import "./followed.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Followed = () => {
  const [userId, setUserId] = useState(null);
  const [followedRoles, setFollowedRoles] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData?.id) {
      setUserId(userData.id);
      fetchFollowedRoles(userData.id);
    }
  }, []);

  const fetchFollowedRoles = async (userId) => {
    console.log("User-id: ", userId);
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

    console.log("Roles:", rolesData);
    console.log("Registrations:", registrationsData);
    console.log("Clubs:", clubsData);
    console.log("Current User ID:", userId);

      const clubMap = Object.fromEntries(
        clubsData.map(club => [club.club_id, club.club_name])
      );

      const userRegistrations = registrationsData.filter(
        reg => reg.user_id == userId
      );

      console.log("Filtered Registrations for user:", userRegistrations);

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

  return (
    <div className="settings-layout">
      <SidebarSettings />

      <div className="followed-page">
        <h2>Followed Role Openings</h2>

        {followedRoles.length === 0 ? (
          <p>You haven’t applied to any role openings yet.</p>
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
                {/* <h3>{role.position}</h3>
                <p><strong>Club:</strong> {role.club}</p>
                <p><strong>Status:</strong> {role.status}</p> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Followed;