import { useState, useEffect } from "react";
import Title from "../../components/viewRO/Title";
import RoleOpeningCard from "../../components/viewRO/RoleOpeningCard";
import Pagination from "../../components/viewRO/Pagination";
import ongoingRolesSample from "../../components/viewRO/ongoing-roles"; // fallback sample data

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const RoleOpenings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const rolesPerPage = 2;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${apiUrl}/role-openings`);
        if (!response.ok) throw new Error("Failed to fetch role openings");

        const data = await response.json();
        const ongoingRoles = data.filter(role => role.status === "ONGOING");

        if (ongoingRoles.length > 0) {
          setRoles(ongoingRoles.map(role => ({
            title: role.position,
            description: role.description,
            deadline: new Date(role.due_date).toLocaleDateString(),
            imageSrc: "https://picsum.photos/200/150",
            id: role.role_opening_id
          })));
        } else {
          console.log("No ongoing roles from API. Using fallback.");
          setRoles(ongoingRolesSample);
        }
      } catch (err) {
        console.error("API error, using fallback data:", err);
        setRoles(ongoingRolesSample);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const totalPages = Math.ceil(roles.length / rolesPerPage);
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <p>Loading role openings...</p>;
  }

  return (
    <div className="role-openings-wrapper">
      <Title />
      {currentRoles.map((role, index) => (
        <RoleOpeningCard
          key={role.id || index}
          role={role}
          index={role.id || index}
        />
      ))}

      <Pagination 
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RoleOpenings;
