import { Link } from 'react-router-dom';
import roleTableData from './roleTableData';
import { FaEye, FaPencilAlt } from 'react-icons/fa'; // Import icons
import './ROtable.css';

const ROTable = () => {
  return (
    <table className="ro-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Role</th>
          <th>Number of Applications</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {roleTableData.map((role, index) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{role.roleName}</td>
            <td>{role.applications}</td>
            <td>{role.deadline}</td>
            <td>{role.status}</td>
            <td>
              <Link to={`/committee/roles/view/${index}`} className="entity6-view-link">
                <FaEye />
              </Link>
              <Link to={`/committee/roles/edit/${index}`} className="entity6-edit-link">
                <FaPencilAlt />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ROTable;
