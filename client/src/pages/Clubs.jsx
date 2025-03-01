
import React from "react";
import TopSection from "../components/Clubs/topSection"; // Import the TopSection component
import BrowseClubs from "../components/Clubs/BrowseClubs"; // Import BrowseClubs component

const Clubs = () => {
  return (
    <div>
      <TopSection />
      <BrowseClubs /> {/* This renders the list of clubs */}
    </div>
  );
};

export default Clubs;
