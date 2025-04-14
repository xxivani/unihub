import './FormApply.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApplyConfirmation from '../../pages/RoleOpening/ApplyConfirmation';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FormApply = () => {
  const { index: role_opening_id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const user_id = user?.id;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    why: "",
    cv: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState("");

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const res = await fetch(`${apiUrl}/role-openings/${role_opening_id}`);
        if (!res.ok) throw new Error("Failed to fetch role opening");

        const data = await res.json();
        setEligibility(data.eligibility_criteria || "");
      } catch (err) {
        console.warn("Could not load eligibility criteria:", err.message);
      }
    };

    fetchEligibility();
  }, [role_opening_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      setFormData(prev => ({ ...prev, cv: file }));
      setError("");
    } else {
      setFormData(prev => ({ ...prev, cv: null }));
      setError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, phone, email, why, cv } = formData;
    if (!name || !phone || !email || !why || !cv) {
      setError("All fields are required.");
      return;
    }

    const payload = new FormData();
    payload.append("role_opening_id", role_opening_id);
    payload.append("user_id", user_id);
    payload.append("user_name", name);
    payload.append("user_phone", phone);
    payload.append("user_email", email);
    payload.append("applicant_suitability", why);
    payload.append("pdf", cv);

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/role-opening-registrations`, {
        method: "POST",
        body: payload
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entity6-right-box">
      {eligibility && (
        <div className="eligibility-box">
          <h4>Eligibility Criteria</h4>
          <p>{eligibility}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="apply-form">
        <label htmlFor="name">Enter Name*</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="phone">Enter Phone Number*</label>
        <input type="text" id="phone" name="phone" placeholder="+971" value={formData.phone} onChange={handleChange} required />

        <label htmlFor="email">Enter Email Address*</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="why">Why should we choose you?*</label>
        <textarea id="why" name="why" value={formData.why} onChange={handleChange} required />

        <label htmlFor="cv">Attach CV* (PDF only)</label>
        <input type="file" id="cv" name="cv" accept="application/pdf" onChange={handleFileChange} required />
        {formData.cv && <p>Selected file: {formData.cv.name}</p>}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {isSubmitted && (
        <div className="popup-overlay">
          <div className="popup-content">
            <ApplyConfirmation />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormApply;