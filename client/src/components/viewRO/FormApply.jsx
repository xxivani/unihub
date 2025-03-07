import './FormApply.css';
import { useState } from "react";
import ApplyConfirmation from '../../pages/RoleOpening/ApplyConfirmation';

const FormApply = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        why: "",
        cv: null,
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        validateForm({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            cv: file,
        }));
        validateForm({ ...formData, cv: file });
    };

    const validateForm = (data) => {
        const { name, phone, email, why, cv } = data;
        setIsFormValid(name && phone && email && why && cv);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="entity6-right-box">
            <form onSubmit={handleSubmit}>
            <label htmlFor="name">Enter Name*</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="phone">Enter Phone Number*</label>
                <input type="text" id="phone" name="phone" placeholder="+971" value={formData.phone} onChange={handleChange} required />

                <label htmlFor="email">Enter Email Address*</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                <label htmlFor="why">Why should we choose you?*</label>
                <textarea id="why" name="why" value={formData.why} onChange={handleChange} required />

                <label htmlFor="cv">Attach CV*</label>
                <input type="file" id="cv" name="cv" accept=".pdf" onChange={handleFileChange} required />

                <button type="submit" disabled={!isFormValid} className={!isFormValid ? "disabled-btn" : ""}>
                    Submit
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