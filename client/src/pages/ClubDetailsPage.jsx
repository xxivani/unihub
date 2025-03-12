import React, { useState } from "react";
import ClubTopSection from "../components/Clubs/ClubTopSection";
import ClubSubNav from "../components/Clubs/ClubSubNav"; 
import ClubDetailsPanel from "../components/Clubs/ClubDetailsPanel";

const ClubDetailsPage = () => {
    const [activeTab, setActiveTab] = useState("about"); // Track selected tab

    return (
        <div>
            <ClubTopSection />
            <ClubSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <ClubDetailsPanel activeTab={activeTab} /> {/* Pass activeTab to dynamically switch content */}
        </div>
    );
};

export default ClubDetailsPage;
