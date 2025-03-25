import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClubCard from "./ClubCard";
import "./BrowseClubs.css";
import { FaSearch, FaFilter, FaEdit } from "react-icons/fa";

function BrowseClubs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  //const [user, setUser] = useState({ role: "admin" }); //  Temporarily force admin
  const [isEditMode, setIsEditMode] = useState(false);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch clubs from backend API
    fetch("http://localhost:5000/api/clubs") 
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((error) => {
        console.error("Error fetching clubs:", error);
      });
  }, []);

  const handleDeleteClub = async (id) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/clubs/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setClubs(clubs.filter(club => club.club_id !== id));
        } else {
          console.error("Failed to delete club");
        }
      } catch (error) {
        console.error("Error deleting club:", error);
      }
    }
  };

  const handleUpdateClub = async (id, updatedClub) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clubs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedClub)
      });

      if (!response.ok) {
        throw new Error("Failed to update club");
      }

      const data = await response.json();
      setClubs(clubs.map(club => (club.club_id === id ? data.club : club)));
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  return (
    <main className="browse-clubs-main">
      <div className="browse-clubs-header">
        <h1 className="browse-clubs-title">Browse Clubs</h1>
        <div className="browse-clubs-search-filter">
          <div className="browse-clubs-search">
            <input type="text" placeholder="Search clubs..." />
            <button className="search-button"><FaSearch /></button>
          </div>
          <div className="browse-clubs-actions">
            <button className="filter-button">
              Filter <FaFilter />
            </button>
            {user && user.role === "admin" && (
              <>
                <button 
                  className="create-club-button"
                  onClick={() => navigate('/create-club')}
                >
                  Create Club
                </button>
                <button 
                  className={`edit-clubs-button ${isEditMode ? 'active' : ''}`} 
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? "Exit Edit Mode" : "Edit Page"} <FaEdit />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="club-cards-list">
        {clubs.map((club) => (
          <ClubCard 
            key={club.club_id} 
            club={club} 
            isEditMode={isEditMode}
            onDelete={handleDeleteClub} 
            onUpdate={handleUpdateClub}
          />
        ))}
      </div>
    </main>
  );
}

export default BrowseClubs;
