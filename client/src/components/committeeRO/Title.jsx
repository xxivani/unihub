import "./Title.css"
import { Link } from 'react-router-dom';

const Title = () => {
    return (
        <div className="entity6-title">
            <h1>View Role Openings</h1>
            <Link to="/committee/roles/create">
                <button className="create-role-btn">Create Role Opening</button>
            </Link>
        </div>
    );
};

export default Title;