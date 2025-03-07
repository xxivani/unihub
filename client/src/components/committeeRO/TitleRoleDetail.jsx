import "./TitleRoleDetail.css"
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TitleRoleDetail = () => {
    const navigate = useNavigate();
    return (
        <div className="entity6-title-detail">
            <h1>Role Openings Registrations</h1>
            <button className="entity6-arrow-btn" onClick={() => navigate("/committee/roles")}>
                    <FiArrowLeft size={24} />
            </button>
        </div>
    );
};

export default TitleRoleDetail;