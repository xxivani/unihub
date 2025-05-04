import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ClubTopSection from "../components/Clubs/ClubTopSection";
import ClubSubNav from "../components/Clubs/ClubSubNav";
import ClubDetailsPanel from "../components/Clubs/ClubDetailsPanel";

function ClubDetailsPage() {
  const { id } = useParams();         // Get club ID from URL
  const [club, setClub] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    console.log("Fetching club details for ID:", id);
  
    const fetchClub = async () => {
      try {
        const res = await fetch(`${apiUrl}/clubs/${id}`);
        console.log("API call made to:", `${apiUrl}/clubs/${id}`);
  
        if (!res.ok) {
          console.error("Failed to fetch club details:", res.status);
          throw new Error("Failed to fetch club details.");
        }
  
        const data = await res.json();
        console.log("Fetched club data:", data);
  
        setClub(data);
      } catch (error) {
        console.error("Error fetching club:", error.message);
        setErrorMessage(error.message || "An unexpected error occurred");
      }
    };
  
    fetchClub();
  }, [id]);
  

  if (!club) {
    return <div>Loading club details...</div>;
  }

  return (
    <div>
      <ClubTopSection club={club} />
      <ClubSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <ClubDetailsPanel activeTab={activeTab} club={club} />
    </div>
  );
}


export default ClubDetailsPage;
