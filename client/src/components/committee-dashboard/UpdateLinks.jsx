import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaPhone, FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./UpdateLinks.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const UpdateLinks = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [links, setLinks] = useState({
        phone: "",
        email: "",
        instagram: "",
        whatsapp: "",
    });
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLinks((prev) => ({ ...prev, [name]: value }));
    };

    const fetchLinksAndPermissions = async () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem("user"));
            if (!userData || !userData.id) {
                throw new Error("User not logged in or ID missing.");
            }

            const userId = userData.id;
            console.log("Logged-in User ID: ", userId);

            const cmResponse = await fetch(`${apiUrl}/committee-members/by-user/${userId}`);
            const committeeMember = await cmResponse.json();

            if (!committeeMember || !committeeMember.committee_member_id) {
                throw new Error("Committee member not found.");
            }

            const committeeMemberId = committeeMember.committee_member_id;
            console.log("Logged-in committee ID: ", committeeMemberId);

            const permissionResponse = await fetch(`${apiUrl}/committee-member-permissions/${committeeMemberId}`);
            const permissions = await permissionResponse.json();

            const hasUpdateLink = permissions.some(p => p.permission === "UpdateLink");
            setHasPermission(hasUpdateLink);

            console.log("Logged-in user permissions: ", permissions);

            // Replace with actual API call to fetch links if needed
            setLinks({
                phone: "+971 999999999",
                email: "abcdefg@gmail.com",
                instagram: "instagram.com/xyz-society",
                whatsapp: "chat.whatsapp.com/xyz-society"
            });

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinksAndPermissions();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="update-links">
            <div className="ul-header">
                <h3>Contact Information</h3>
                {hasPermission && (
                    <button className="ul-edit-btn" onClick={handleEdit}>
                        <FiEdit2 size={18} />
                    </button>
                )}
            </div>

            <div className="ul-links">
                {["phone", "email", "instagram", "whatsapp"].map((field, i) => {
                    const Icon = [FaPhone, FaEnvelope, FaInstagram, FaWhatsapp][i];
                    return (
                        <div className="ul-link-item" key={field}>
                            <Icon className="ul-icon" />
                            {hasPermission && isEditing ? (
                                <input
                                    type="text"
                                    name={field}
                                    value={links[field]}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{links[field]}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UpdateLinks;