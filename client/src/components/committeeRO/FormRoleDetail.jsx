import './FormRoleDetail.css';
// import formSubmissions from './formSubmissions.js';
import Pagination from '../viewRO/Pagination';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const FormRoleDetail = () => {
  const { id: role_opening_id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 1;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${apiUrl}/role-opening-registrations`);
        const data = await response.json();

        console.log("Fetched data from API:", data);
        console.log("role_opening_id from URL:", role_opening_id);

        // const filtered = data.filter(
        //   (entry) => entry.role_opening_id === parseInt(role_opening_id)
        // );

        const filtered = data.filter(
            (entry) => entry.role_opening_id.toString() === role_opening_id.toString()
        );
          
        console.log("Filtered data based on role_opening_id:", filtered);

        if (filtered.length > 0) {
            setSubmissions(filtered);
        } 
        // else {
        //     console.warn("No filtered data found, falling back to formSubmissions.js");
        //     setSubmissions(formSubmissions); // fallback
        // }
      } catch (error) {
            console.error("Error fetching registrations:", error);
            setSubmissions(formSubmissions); // fallback
      }
    };

    fetchSubmissions();
  }, [role_opening_id]);

  const totalPages = submissions.length;
  const currentSubmission = submissions[currentPage - 1];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      console.log("Calling PUT for ID:", currentSubmission.role_opening_registration_id);
      const res = await fetch(`${apiUrl}/role-opening-registrations/${currentSubmission.role_opening_registration_id}`, {
        method: 'PUT', // or PATCH depending on your API
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log("PUT URL:", `${apiUrl}/role-opening-registrations/${currentSubmission.role_opening_registration_id}`);
  
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
  
      const updated = await res.json();
      alert(`Status updated to ${newStatus}`);
  
      // Refresh submissions (optional)
      setSubmissions(prev => prev.map((sub, idx) =>
        idx === currentPage - 1 ? { ...sub, status: newStatus } : sub
      ));
    } catch (error) {
      console.error("Status update failed:", error.message);
      alert("Status update failed");
    }
  };  

  // const handleDownload = () => {
  //   if (currentSubmission.applicant_cv_url) {
  //     const link = document.createElement("a");
  //     link.href = `${apiUrl}${currentSubmission.applicant_cv_url}`;
  //     link.download = "CV.pdf";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  return (
    <div className="entity6-role-detail">
      {currentSubmission ? (
        <form>
          <div className="role-detail-header">
          <h3>Response #{currentPage}</h3>
          <div className="status-action-buttons">
            <button
              type="button"
              className="approve-btn"
              onClick={() => handleStatusUpdate('SELECTED')}
            >✅</button>
            <button
              type="button"
              className="reject-btn"
              onClick={() => handleStatusUpdate('REJECTED')}
            >❌</button>
          </div></div>
          <label htmlFor="name">Enter Name</label>
          <input type="text" id="name" name="name" value={currentSubmission.user_name || currentSubmission.name} readOnly />

          <label htmlFor="phone">Enter Phone Number</label>
          <input type="text" id="phone" name="phone" value={currentSubmission.user_phone || currentSubmission.phone} readOnly />

          <label htmlFor="email">Enter Email Address</label>
          <input type="email" id="email" name="email" value={currentSubmission.user_email || currentSubmission.email} readOnly />

          <label htmlFor="why">Why should we choose you?</label>
          <textarea id="why" name="why" value={currentSubmission.applicant_suitability || currentSubmission.why} readOnly />

          <label htmlFor="cv">Attach CV</label>
          {/* {currentSubmission.applicant_cv_url || currentSubmission.cv ? (
            <button type="button" className="download-btn" onClick={handleDownload}>
              Download CV
            </button>
          ) : (
            <p>No file uploaded</p>
          )} */}

          {currentSubmission.applicant_cv_url ? (
            <a
              href={`${(import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/api\/?$/, '')}${currentSubmission.applicant_cv_url}`}
              className="download-btn"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </a>
          ) : (
            <p>No file uploaded</p>
          )}

        </form>
      ) : (
        <p>No submissions available.</p>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FormRoleDetail;
