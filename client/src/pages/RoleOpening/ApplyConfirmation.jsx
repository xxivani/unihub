import "./ApplyConfirmation.css"
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ApplyConfirmation = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/roles");
    };

    return (
        <div className="thankyou">
            <FaTimes className="entity6-close-icon" onClick={handleBack} />
            <h3>Thank you for applying!</h3>
            <p>You will hear back from us soon.</p>
        </div>
    );
}

export default ApplyConfirmation;