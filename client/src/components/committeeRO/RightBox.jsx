import './RightBox.css';
import { FaTimes, FaPaperclip } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RightBox = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    position: '',
    due_date: '',
    description: '',
    eligibility_criteria: ''
  });

  const [originalDueDate, setOriginalDueDate] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`${apiUrl}/role-openings`);
        const data = await res.json();
        const role = data.find(r => r.role_opening_id.toString() === id);

        if (!role) {
          setError("Role not found.");
          return;
        }

        setFormData({
          position: role.position,
          due_date: role.due_date.split("T")[0],
          description: role.description,
          eligibility_criteria: role.eligibility_criteria
        });
        setOriginalDueDate(new Date(role.due_date));
      } catch (err) {
        console.error("Error fetching role:", err);
        setError("Failed to load role data.");
      }
    };

    fetchRole();
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newDueDate = new Date(formData.due_date);

    if (originalDueDate && newDueDate != originalDueDate && newDueDate < originalDueDate) {
      setError("Due date can only be postponed.");
      return;
    }

    const form = new FormData();
    form.append('description', formData.description);
    form.append('eligibility_criteria', formData.eligibility_criteria);
    form.append('due_date', formData.due_date);
    if (thumbnail) {
      form.append('image', thumbnail);
    }

    try {
      const response = await fetch(`${apiUrl}/role-openings/${id}`, {
        method: 'PUT',
        body: form
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //   description: formData.description,
        //   eligibility_criteria: formData.eligibility_criteria,
        //   due_date: formData.due_date
        // })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Update failed.");
      }

      alert("Role updated successfully!");
      navigate('/committee/roles');
    } catch (err) {
      console.error("Error updating role:", err);
      setError(err.message);
    }
  };

  return (
    <div className="entity6-right-box">
      <FaTimes className="entity6-close-icon" onClick={handleBack} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="position">Position</label>
        <input type="text" id="position" name="position" value={formData.position} disabled />

        <label htmlFor="due_date">New Due Date*</label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <label htmlFor="description">Job Description*</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="eligibility_criteria">Eligibility Criteria*</label>
        <textarea
          id="eligibility_criteria"
          name="eligibility_criteria"
          value={formData.eligibility_criteria}
          onChange={handleChange}
        />

        <label htmlFor="thumbnail">
          <FaPaperclip /> Attach Thumbnail (optional)
        </label>
        <input
          type="file"
          id="thumbnail"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default RightBox;