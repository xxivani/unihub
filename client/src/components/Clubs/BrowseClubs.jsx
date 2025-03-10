import React from "react";
import ClubCard from "./ClubCard";
import "./BrowseClubs.css";

// Sample clubs data
const clubs = [
  { 
    name: "WiSTEM Society", 
    description: "A club for women in STEM", 
    image: "https://picsum.photos/200/150?random=1" 
  },
  { 
    name: "PAWS", 
    description: "Animal lover's club", 
    image: "https://picsum.photos/200/150?random=2" 
  },
  { 
    name: "ACM", 
    description: "Association for Computing Machinery", 
    image: "https://picsum.photos/200/150?random=3" 
  },
  { 
    name: "Robotics Club", 
    description: "Build robots!", 
    image: "https://picsum.photos/200/150?random=4" 
  },
  { 
    name: "Music Club", 
    description: "For music lovers", 
    image: "https://picsum.photos/200/150?random=5" 
  },
];

function BrowseClubs() {
  return (
    <section className="browse-clubs-container">
      {/* Removed the second “Browse Clubs” title here */}
      
      <div className="club-cards-list">
        {clubs.map((club, index) => (
          <ClubCard key={index} club={club} />
        ))}
      </div>

      <div className="event-pagination">
        <a href="#">&laquo;</a>
        <a className="active" href="#">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">&raquo;</a>
      </div>
    </section>
  );
}

export default BrowseClubs;
