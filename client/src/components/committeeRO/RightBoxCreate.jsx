import './RightBox.css';
import { FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RightBoxCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const club_id_from_query = queryParams.get("club_id");

  const [formData, setFormData] = useState({
    position: '',
    due_date: '',
    description: '',
    eligibility_criteria: ''
  });

  const [error, setError] = useState('');
  const [clubId, setClubId] = useState(club_id_from_query ? parseInt(club_id_from_query) : null);

  useEffect(() => {
    if (!clubId) {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      if (userData?.role === "committee" && userData.id) {
        fetch(`${apiUrl}/committee-members/by-user/${userData.id}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.club_id) {
              setClubId(data.club_id);
            }
          })
          .catch(err => {
            console.error("Failed to fetch committee member's club:", err);
          });
      }
    }
  }, [clubId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { position, due_date, description, eligibility_criteria } = formData;

    if (!position || !due_date || !description || !eligibility_criteria) {
      setError("All fields are required.");
      return;
    }

    const dueDate = new Date(due_date);
    const today = new Date();
    const minDate = new Date(today.setDate(today.getDate() + 7));

    if (dueDate < minDate) {
      setError("Due date must be at least 7 days from today.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/role-openings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          club_id: clubId
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create role opening.");
      }

      const result = await response.json();
      console.log("Role created:", result);
      navigate('/roles'); // Go to RoleOpenings page
    } catch (err) {
      console.error("Error creating role opening:", err);
      setError(err.message);
    }
  };

  return (
    <div className="entity6-right-box">
      <FaTimes className="entity6-close-icon" onClick={handleBack} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="position">Enter Position*</label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />

        <label htmlFor="due_date">Enter Due Date*</label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <label htmlFor="description">Enter Job Description*</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="eligibility_criteria">Enter Eligibility Criteria*</label>
        <textarea
          id="eligibility_criteria"
          name="eligibility_criteria"
          value={formData.eligibility_criteria}
          onChange={handleChange}
        />

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RightBoxCreate;