import { useState, useEffect } from "react";
import { Avatar, List, Spin } from "antd";

const BTCommitteeMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the API URL from environment
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        setLoading(true);
        
        // Get the selected club ID from session storage or URL
        const queryParams = new URLSearchParams(window.location.search);
        const urlClubId = queryParams.get('club_id');
        const storedClubId = sessionStorage.getItem("selectedClubId");
        const clubId = urlClubId || storedClubId;
        
        if (!clubId) {
          throw new Error('No club ID found');
        }
        
        const response = await fetch(`${apiUrl}/committee-members/by-club/${clubId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch committee members');
        }
        
        const data = await response.json();
        
        // Transform data for display
        const formattedMembers = data.map(member => ({
          title: member.committee_member_name,
          description: member.committee_member_position.replace(/_/g, ' '),
          avatar: `https://api.dicebear.com/9.x/miniavs/svg?seed=${member.committee_member_name}`,
        }));
        
        setMembers(formattedMembers);
        setError(null);
      } catch (err) {
        console.error('Error fetching committee members:', err);
        setError('Failed to load committee members');
        
        // Fallback data if API fails
        // setMembers([
        //   {
        //     title: "Jane Doe",
        //     description: "President",
        //     avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Andrea",
        //   },
        //   {
        //     title: "John Doe",
        //     description: "Vice-President",
        //     avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Nolan"
        //   },
        //   {
        //     title: "Jane Smith",
        //     description: "Secretary",
        //     avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Ryan"
        //   },
        //   {
        //     title: "John Smith",
        //     description: "Treasurer",
        //     avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=Mason"
        //   },
        // ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommitteeMembers();
  }, [apiUrl]);
  
  if (loading) {
    return <Spin tip="Loading committee members..." />;
  }
  
  if (error && members.length === 0) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <List
      itemLayout="horizontal"
      dataSource={members}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

export default BTCommitteeMembers;