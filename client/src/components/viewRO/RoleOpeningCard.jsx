import "./RoleOpeningCard.css"
import { Link } from "react-router-dom";

const RoleOpeningCard = () => {
    const roles = [
        {
            imageSrc: '../../../public/assets/images/treasurer.jpg',
            title: 'Treasurer for WiSTEM Society',
            description: 'Manages all finances, budget, reimbursements and expenses of the club.',
            deadline: '15/02/2025'
        },
        {
            imageSrc: '../../../public/assets/images/event_officer.jpg',
            title: 'Events-Officer for PAWS',
            description: 'Manages all finances, budget, reimbursements and expenses of the club.',
            deadline: '15/02/2025'
        },
        {
            imageSrc: '../../../public/assets/images/president.jpg',
            title: 'President for ACM',
            description: 'Manages all finances, budget, reimbursements and expenses of the club.',
            deadline: '15/02/2025'
        }
    ];

    return (
        <div className="cards-container">
            {roles.map((role, index) => (
                <div key={index} className="rocard">
                    <img src={role.imageSrc} alt={role.title} className="card-image" />
                    <div className="card-content">
                        <h2>{role.title}</h2>
                        <p>{role.description}</p>
                        <p><strong>Deadline:</strong> {role.deadline}</p>
                    </div>
                    <div className="card-buttons">
                        <Link to="/clubs" className="view-button">View {role.title.split(' ')[2]}</Link>
                        <Link to="/roles/apply" className="apply-button">Apply</Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoleOpeningCard;