import "./RoleOpeningCard.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Error from "./Error";
import LoginError from "./LoginError";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const RoleOpeningCard = ({ role, index }) => {
    const [user, setUser] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showLoginError, setShowLoginError] = useState(false);

    useEffect(() => {
        console.log("Role object:", role);
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log("Logged in user ID:", parsedUser.id);
        }
    }, []);

    const handleApplyClick = () => {
        if (!user) {
            setShowLoginError(true); 
        } else if (user.role === "committee") {
            setShowError(true); 
        }
    };

    return (
        <div className="entity6-cards-container">
            <div className="entity6-rocard">
                {/* <img src={role.imageSrc} alt={role.title} className="entity6-card-image" /> */}
                <img src={role.imageSrc} alt={role.title} className="entity6-card-image"
                    onError={(e) => {
                    e.target.src = `https://picsum.photos/200/150?random=${Math.floor(Math.random() * 1000)}`;
                  }}
                />
                <div className="entity6-card-content">
                    <h2>{role.title}</h2>
                    <p>{role.description}</p>
                    <p><strong>Deadline:</strong> {role.deadline}</p>
                </div>
                <div className="entity6-card-buttons">
                    <Link to={`/club-details/${role.club_id}`} className="entity6-view-button">
                        View {role.title.split("for")[1]?.trim() || "Club"}
                    </Link>

                    {!user ? (
                        <button className="entity6-apply-button" onClick={handleApplyClick}>
                            Apply
                        </button>
                    ) : user.role === "committee" ? (
                        <button className="entity6-apply-button" onClick={handleApplyClick}>
                            Apply
                        </button>
                    ) : (
                        <Link to={`/roles/apply/${index}`} className="entity6-apply-button">
                            Apply
                        </Link>
                    )}
                </div>
            </div>

            {showError && <Error onClose={() => setShowError(false)} />}
            {showLoginError && <LoginError onClose={() => setShowLoginError(false)} />}
        </div>
    );
};

export default RoleOpeningCard;