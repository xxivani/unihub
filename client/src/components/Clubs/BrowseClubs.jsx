import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClubCard from "./ClubCard";
import "./BrowseClubs.css";
import { FaSearch, FaFilter, FaEdit } from "react-icons/fa";

const initialClubs = [
  { id: 1, name: "WiSTEM Society", description: "A club for women in STEM", image: "https://picsum.photos/200/150?random=1" },
  { id: 2, name: "PAWS", description: "Animal lover's club", image: "https://picsum.photos/200/150?random=2" },
  { id: 3, name: "ACM", description: "Association for Computing Machinery", image: "https://picsum.photos/200/150?random=3" },
  { id: 4, name: "Robotics Club", description: "Build robots!", image: "https://picsum.photos/200/150?random=4" },
  { id: 5, name: "Music Club", description: "For music lovers", image: "https://picsum.photos/200/150?random=5" },
];

function BrowseClubs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // 🧼 No longer forcing admin
  const [isEditMode, setIsEditMode] = useState(false);
  const [clubs, setClubs] = useState(initialClubs);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleDeleteClub = (id) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      setClubs(clubs.filter(club => club.id !== id));
    }
  };

  const handleUpdateClub = (id, updatedClub) => {
    setClubs(clubs.map(club => (club.id === id ? { ...club, ...updatedClub } : club)));
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
            key={club.id} 
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
