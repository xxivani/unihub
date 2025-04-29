import './Dashboard.css'
import Sidebar from '../../components/committee-dashboard/Sidebar';
import Title from '../../components/committee-dashboard/Title';
import ClubStatistics from '../../components/committee-dashboard/ClubStatistics';
import UpdateLinks from '../../components/committee-dashboard/UpdateLinks';
import Members from '../../components/committee-dashboard/Members';
import CurrentEvent from '../../components/committee-dashboard/CurrentEvent';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.id) return;

    setUserRole(user.role);

    if (user.role === "admin") {
      fetchClubs();
    } else {
      fetchCommitteeClub(user.id);
    }
  }, []);

  useEffect(() => {
    fetchEvent();
  }, [selectedClubId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${apiUrl}/events`);
      const data = await response.json();
      try {
        const club_response = await fetch(`${apiUrl}/clubs/${selectedClubId}`);
        const club_data = await club_response.json();
        const filteredEvents = data.filter(event => event.club == club_data.club_name);
        setEvents([{}, ...filteredEvents]);
        } catch(error) {
            console.error("Error fetching clubs:", error);
        }
      } catch(error) {
        console.error("Error fetching events:", error);
      };
  }

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    sessionStorage.setItem("selectedEventDB", e.target.value);
    console.log("SELCEDED:"+ e.target.value);
  };

  const fetchClubs = async () => {
    try {
      const res = await fetch(`${apiUrl}/clubs`);
      const data = await res.json();
      setClubs(data);

      // Load previously selected club or fallback to first
      const storedClub = sessionStorage.getItem("selectedClubId");
      if (storedClub) {
        setSelectedClubId(storedClub);
      } else if (data.length > 0) {
        setSelectedClubId(data[0].club_id);
        sessionStorage.setItem("selectedClubId", data[0].club_id);
      }
    } catch (err) {
      console.error("Failed to fetch clubs:", err);
    }
  };

  const fetchCommitteeClub = async (userId) => {
    try {
      const res = await fetch(`${apiUrl}/committee-members/by-user/${userId}`);
      const data = await res.json();
      setSelectedClubId(data.club_id);
    } catch (err) {
      console.error("Failed to fetch committee member's club_id:", err);
    }
  };

  const handleClubChange = (e) => {
    setSelectedClubId(e.target.value);
    sessionStorage.setItem("selectedClubId", e.target.value);
  };

    return (
      <div className="entity6-dashboard">
        <div className="select-club-container">
          {events.length > 1 && (
          <select className="select-club-dropdown" value={selectedEvent || ""} onChange={handleEventChange}>
              {events.map(event => (
                <option key={event.id} value={event.title}>{event.title}</option>
              ))}
            </select>
          )}
          {userRole === "admin" && (
              <select className="select-club-dropdown" value={selectedClubId || ""} onChange={handleClubChange}>
                {clubs.map(club => (
                  <option key={club.club_id} value={club.club_id}>{club.club_name}</option>
                ))}
              </select>
          )}
          </div>
      <div className="dashboard-header">
        <Title />
      </div>

      <div className="entity6-dashboard-part2">
        <Sidebar />
        <ClubStatistics selectedClubId={selectedClubId} />
        <div className="entity6-dashboard-part3">
          <CurrentEvent selectedClubId={selectedClubId} />
          <UpdateLinks selectedClubId={selectedClubId} />
        </div>
      </div>
      <Members selectedClubId={selectedClubId} />
    </div>
  );
  };
  
export default Dashboard;
  