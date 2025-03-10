import React from "react";
import ClubTopSection from "../components/Clubs/ClubTopSection";
import ClubSubNav from "../components/Clubs/ClubSubNav"; 
import ClubDetailsPanel from "../components/Clubs/ClubDetailsPanel";

const ClubDetailsPage = () => {
    return (
        <div>
            <ClubTopSection />
            <ClubSubNav /> 
            <ClubDetailsPanel />
        </div>
    );
};

export default ClubDetailsPage;