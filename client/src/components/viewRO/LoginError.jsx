import { FaTimes } from 'react-icons/fa';

const LoginError = ({ onClose }) => {
    return (
        <div className="thankyou">
            <FaTimes className="entity6-close-icon1" onClick={onClose} />
            <h3>Requires Login</h3>
            <p>You need to be logged in student to Apply to a Role Opening.</p>
        </div>
    );
}

export default LoginError;