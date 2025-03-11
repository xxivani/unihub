import './RightBox.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RightBox = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div className="entity6-right-box">
            <FaTimes className="entity6-close-icon" onClick={handleBack} />
            <form>
                <label htmlFor="position">Enter Position*</label>
                <input type="text" id="position" name="position" placeholder="Treasurer" />

                <label htmlFor="due-date">Enter Due Date*</label>
                <input type="date" id="due-date" name="due-date" placeholder="DD/MM/YYYY" />

                <label htmlFor="job-description">Enter Job Description*</label>
                <textarea id="job-description" name="job-description" placeholder="Manages finances and budgets." />

                <label htmlFor="eligibility">Enter Eligibility Criteria*</label>
                <textarea id="eligibility" name="eligibility" placeholder="Must be an Economics Student. Must have some experience regarding accounting." />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default RightBox;