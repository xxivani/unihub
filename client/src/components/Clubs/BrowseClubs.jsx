import React from "react";
import ClubCard from "./ClubCard";
import "./BrowseClubs.css";
import { FaSearch, FaFilter } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

const clubs = [
  { name: "WiSTEM Society", description: "A club for women in STEM", image: "https://picsum.photos/200/150?random=1" },
  { name: "PAWS", description: "Animal lover's club", image: "https://picsum.photos/200/150?random=2" },
  { name: "ACM", description: "Association for Computing Machinery", image: "https://picsum.photos/200/150?random=3" },
  { name: "Robotics Club", description: "Build robots!", image: "https://picsum.photos/200/150?random=4" },
  { name: "Music Club", description: "For music lovers", image: "https://picsum.photos/200/150?random=5" },
];

function BrowseClubs() {
  const navigate = useNavigate();

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
            <button 
              className="create-club-button"
              onClick={() => navigate('/create-club')}
            >
              Create Club
            </button>
          </div>
        </div>
      </div>

      
      <div className="club-cards-list">
        {clubs.map((club, index) => (
          <ClubCard key={index} club={club} />
        ))}
      </div>
    </main>
  );
}

export default BrowseClubs;
