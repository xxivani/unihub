import React from "react";
import ClubCard from "./ClubCard";
import "./BrowseClubs.css";


const clubs = [
  { name: "WiSTEM Society", description: "A club for women in STEM" },
  { name: "PAWS", description: "Animal lover's club" },
  { name: "ACM", description: "Association for Computing Machinery" },
  { name: "Robotics Club", description: "Build robots!" },
  { name: "Music Club", description: "For music lovers" },
  { name: "Art Club", description: "Explore your creativity" },
];

function BrowseClubs() {
  return (
    <div className="browse-clubs">
      {/* Render the clubs */}
      <div className="browse-clubs-list">
        {clubs.map((club, index) => (
          <ClubCard key={index} club={club} />
        ))}
      </div>

      
      <div className="event-pagination">
        <a href="#">&laquo;</a>
        <a className="active" href="#">
          1
        </a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">6</a>
        <a href="#">&raquo;</a>
      </div>
    </div>
  );
}

export default BrowseClubs;


