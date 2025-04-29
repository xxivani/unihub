import "./Title.css";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const Title = ({ setSelectedClubId }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState("");

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        if (!userData || !userData.id) return;

        setUserRole(userData.role); // "admin" or "committee"
        const storedClubId = sessionStorage.getItem("selectedClubId");

        if (userData.role === "admin") {
            fetchClubs().then(() => {
              if (storedClubId) {
                setSelectedClub(storedClubId);
                setSelectedClubId(storedClubId);
              }
            });
        } else {
            // If not admin, reset any previous admin-selected club
            sessionStorage.removeItem("selectedClubId");
            checkPermission(userData.id);
        }
    }, []);

    const fetchClubs = async () => {
        try {
            const res = await fetch(`${apiUrl}/clubs`);
            const data = await res.json();
            setClubs(data);
        } catch (err) {
            console.error("Failed to fetch clubs:", err);
        }
    };

    const checkPermission = async (userId) => {
        try {
            const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userId}`);
            const cmData = await cmRes.json();

            if (!cmData || !cmData.committee_member_id) return;

            const permRes = await fetch(`${apiUrl}/committee-member-permissions/${cmData.committee_member_id}`);
            const permissions = await permRes.json();

            const hasListPermission = permissions.some(p => p.permission === 'ListRoleOpening');
            setHasPermission(hasListPermission);
            if (hasListPermission) {
                setSelectedClubId(cmData.club_id); // Automatically assign their club ID
            }
        } catch (err) {
            console.error("Error checking ListRoleOpening permission:", err);
        }
    };

    const handleClubChange = (e) => {
        const clubId = e.target.value;
        setSelectedClub(clubId);
        setSelectedClubId(clubId);
        sessionStorage.setItem("selectedClubId", clubId);
    };

    return (
        <div className="entity6-title">
          <h1>View Role Openings</h1>
      
          {userRole === "admin" && (
            <div className="admin-controls">
              <select
                value={selectedClub}
                onChange={handleClubChange}
                className="select-club-dropdown"
              >
                <option value="">Select Club</option>
                {clubs.map(club => (
                  <option key={club.club_id} value={club.club_id}>
                    {club.club_name}
                  </option>
                ))}
              </select>
      
              {selectedClub && (
                <Link to={`/committee/roles/create?club_id=${selectedClub}`}>
                  <button className="create-role-btn">Create Role Opening</button>
                </Link>
              )}
            </div>
          )}
      
          {userRole === "committee" && hasPermission && (
            <Link to="/committee/roles/create">
              <button className="create-role-btn">Create Role Opening</button>
            </Link>
          )}
        </div>
      );      
};

export default Title;