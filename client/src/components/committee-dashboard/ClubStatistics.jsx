import "./ClubStatistics.css";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ClubStatistics = () => {
    const navigate = useNavigate();
    return (
        <div className="entity6-cs">
            <div className="entity6-cs-header">
                <h3>Club Statistics</h3>
                <button className="entity6-arrow-btn" onClick={() => navigate("/committee/budget-tracker")}>
                    <FiArrowRight size={24} />
                </button>
            </div>
            <h5>Engagement over the last 3 months</h5>
        </div>

    );
};

export default ClubStatistics;