import React, { useState } from 'react';
import Title from "../../components/viewRO/Title";
import RoleOpeningCard from "../../components/viewRO/RoleOpeningCard";
import Pagination from "../../components/viewRO/Pagination";
import ongoingRoles from "../../components/viewRO/ongoing-roles";

const RoleOpenings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 2; // Adjust the number of roles per page as needed

  const totalPages = Math.ceil(ongoingRoles.length / rolesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = ongoingRoles.slice(indexOfFirstRole, indexOfLastRole);

  return (
    <div>
      <Title />
      {currentRoles.map((role, index) => (
        <RoleOpeningCard key={index} role={role} index={index + indexOfFirstRole} />
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
