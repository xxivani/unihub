import { FaTimes } from 'react-icons/fa';

const Error = ({ onClose }) => {
    return (
        <div className="thankyou">
            <FaTimes className="entity6-close-icon1" onClick={onClose} />
            <h3>We are sorry</h3>
            <p>You are already a committee member and cannot apply for a Role Opening.</p>
        </div>
    );
}

export default Error;