import "./RoleOpeningCard.css";
import { Link } from "react-router-dom";

const RoleOpeningCard = ({ role, index }) => {
    return (
        <div className="entity6-cards-container">
            <div className="entity6-rocard">
                <img src={role.imageSrc} alt={role.title} className="entity6-card-image" />
                <div className="entity6-card-content">
                    <h2>{role.title}</h2>
                    <p>{role.description}</p>
                    <p><strong>Deadline:</strong> {role.deadline}</p>
                </div>
                <div className="entity6-card-buttons">
                    <Link to="/clubs" className="entity6-view-button">View {role.title.split(' ')[2]}</Link>
                    <Link to={`/roles/apply/${index}`} className="entity6-apply-button">Apply</Link>
                </div>
            </div>
        </div>
    );
};

export default RoleOpeningCard;