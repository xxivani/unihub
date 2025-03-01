import "./RoleOpeningCard.css"
import { Link } from "react-router-dom";
import ongoingRoles from "./ongoing-roles";

const RoleOpeningCard = () => {
    return (
        <div className="entity6-cards-container">
            {ongoingRoles.map((role, index) => (
                <div key={index} className="entity6-rocard">
                    <img src={role.imageSrc} alt={role.title} className="entity6-card-image" />
                    <div className="entity6-card-content">
                        <h2>{role.title}</h2>
                        <p>{role.description}</p>
                        <p><strong>Deadline:</strong> {role.deadline}</p>
                    </div>
                    <div className="entity6-card-buttons">
                        <Link to="/clubs" className="entity6-view-button">View {role.title.split(' ')[2]}</Link>
                        <Link to="/roles/apply" className="entity6-apply-button">Apply</Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoleOpeningCard;