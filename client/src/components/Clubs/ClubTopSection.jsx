import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "./ClubTopSection.css";

const ClubTopSection = ({ club }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userMemberships, setUserMemberships] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  const fallbackImage = "https://picsum.photos/200";

  
  useEffect(() => {
    const loadUserAndMemberships = () => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const savedMemberships = localStorage.getItem(`userMemberships_${parsedUser.id}`);
        if (savedMemberships) {
          setUserMemberships(JSON.parse(savedMemberships).map(Number)); 
        }

        fetchUserMemberships(parsedUser.id);
      } else {
        setUser(null);
        setUserMemberships([]);
      }
    };

    loadUserAndMemberships();

    const handleStorageChange = (e) => {
      if (e.key === `userMemberships_${user?.id}`) {
        const saved = JSON.parse(localStorage.getItem(`userMemberships_${user?.id}`)) || [];
        setUserMemberships(saved.map(Number));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadUserAndMemberships);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadUserAndMemberships);
    };
  }, [location.pathname]);

  const fetchUserMemberships = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/club-memberships/user/${userId}`);
      const memberships = await response.json();
      setUserMemberships(memberships.map(Number));
      localStorage.setItem(`userMemberships_${userId}`, JSON.stringify(memberships));
    } catch (error) {
      console.error("Error fetching memberships:", error);
    }
  };

  const refreshMemberships = () => {
    if (user) {
      fetchUserMemberships(user.id);
    }
  };

  const isMember = userMemberships.includes(Number(club.club_id));

  
  const handleJoinClub = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/club-memberships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: Number(club.club_id) }),
      });

      if (response.status === 201) {
        const updatedMemberships = [...userMemberships, Number(club.club_id)];
        setUserMemberships(updatedMemberships);
        localStorage.setItem(`userMemberships_${user.id}`, JSON.stringify(updatedMemberships));
        alert("Joined club successfully!");
      } else if (response.status === 400) {
        alert("You are already a member of this club.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Join club error:", error);
      alert("Failed to join club.");
    }
  };

  const handleLeaveClub = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/club-memberships/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: Number(club.club_id) }),
      });

      if (response.ok) {
        const updatedMemberships = userMemberships.filter(id => id !== Number(club.club_id));
        setUserMemberships(updatedMemberships);
        localStorage.setItem(`userMemberships_${user.id}`, JSON.stringify(updatedMemberships));
        alert("Left club successfully!");
      } else {
        alert("Failed to leave the club.");
      }
    } catch (error) {
      console.error("Leave club error:", error);
      alert("Server error while leaving the club.");
    }
  };

  
  return (
    <div className="club-top-container">
      <button className="exit-button" onClick={() => navigate("/clubs")}>
        <FaTimes size={20} />
      </button>

      <img
        className="club-logo"
        src={club.club_thumbnail_url || fallbackImage}
        alt={club.club_name}
        onError={(e) => {
          e.target.src = fallbackImage;
          e.target.onerror = null;
        }}
      />
      <h1 className="club-title">{club.club_name}</h1>

      <div className="club-actions">
        {isMember ? (
          <button className="leave-club-btn" onClick={handleLeaveClub}>
            Leave
          </button>
        ) : (
          <button className="join-club-btn" onClick={handleJoinClub}>
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubTopSection;
