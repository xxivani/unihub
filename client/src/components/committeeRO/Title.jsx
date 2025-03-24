import "./Title.css";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Title = () => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const userData = JSON.parse(sessionStorage.getItem("user"));
                if (!userData || !userData.id) return;

                const userId = userData.id;

                // 1. Get committee member
                const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userId}`);
                const cmData = await cmRes.json();

                if (!cmData || !cmData.committee_member_id) return;

                // 2. Get committee permissions
                const permRes = await fetch(`${apiUrl}/committee-member-permissions/${cmData.committee_member_id}`);
                const permissions = await permRes.json();

                const hasListPermission = permissions.some(p => p.permission === 'ListRoleOpening');
                setHasPermission(hasListPermission);
            } catch (err) {
                console.error("Error checking ListRoleOpening permission:", err);
            }
        };

        checkPermission();
    }, []);

    return (
        <div className="entity6-title">
            <h1>View Role Openings</h1>
            {hasPermission && (
                <Link to="/committee/roles/create">
                    <button className="create-role-btn">Create Role Opening</button>
                </Link>
            )}
        </div>
    );
};

export default Title;