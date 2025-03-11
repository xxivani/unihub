import './RightBox.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RightBoxCreate = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };
    return (
        <div className="entity6-right-box">
            <FaTimes className="entity6-close-icon" onClick={handleBack} />
            <form>
                <label htmlFor="position">Enter Position*</label>
                <input type="text" id="position" name="position"/>

                <label htmlFor="due-date">Enter Due Date*</label>
                <input type="date" id="due-date" name="due-date" placeholder="DD/MM/YYYY" />

                <label htmlFor="job-description">Enter Job Description*</label>
                <textarea id="job-description" name="job-description"/>

                <label htmlFor="eligibility">Enter Eligibility Criteria*</label>
                <textarea id="eligibility" name="eligibility"/>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RightBoxCreate;