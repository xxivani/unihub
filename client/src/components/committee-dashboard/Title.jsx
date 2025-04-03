import "./Title.css"
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Title = () => {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const fetchCommitteeName = async () => {
          try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            if (!user || !user.id) return;
    
            const res = await fetch(`${apiUrl}/committee-members/by-user/${user.id}`);
            const data = await res.json();
    
            if (data && data.committee_member_name) {
              const first = data.committee_member_name.split(" ")[0];
              setFirstName(first);
            }
          } catch (err) {
            console.error("Error fetching committee member name:", err);
          }
        };
    
        fetchCommitteeName();
      }, []);
    
    return (
        <div className="entity6-title-dashboard">
            <h1>Hey {firstName || "there"}!</h1>
            <h4>Let's take a look at your club.</h4>
        </div> 
    );
};

export default Title;
