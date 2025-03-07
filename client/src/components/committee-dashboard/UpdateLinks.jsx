import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaPhone, FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./UpdateLinks.css";

const UpdateLinks = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [links, setLinks] = useState({
        phone: "+971 999999999",
        email: "abcdefg@gmail.com",
        instagram: "instagram.com/xyz-society",
        whatsapp: "chat.whatsapp.com/xyz-society",
    });

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLinks({ ...links, [name]: value });
    };

    return (
        <div className="update-links">
            <div className="ul-header">
                <h3>Update Links</h3>
                <button className="ul-edit-btn" onClick={handleEdit}>
                    <FiEdit2 size={18} />
                </button>
            </div>

            <div className="ul-links">
                <div className="ul-link-item">
                    <FaPhone className="ul-icon" />
                    {isEditing ? (
                        <input type="text" name="phone" value={links.phone} onChange={handleChange} />
                    ) : (
                        <span>{links.phone}</span>
                    )}
                </div>

                <div className="ul-link-item">
                    <FaEnvelope className="ul-icon" />
                    {isEditing ? (
                        <input type="text" name="email" value={links.email} onChange={handleChange} />
                    ) : (
                        <span>{links.email}</span>
                    )}
                </div>

                <div className="ul-link-item">
                    <FaInstagram className="ul-icon" />
                    {isEditing ? (
                        <input type="text" name="instagram" value={links.instagram} onChange={handleChange} />
                    ) : (
                        <span>{links.instagram}</span>
                    )}
                </div>

                <div className="ul-link-item">
                    <FaWhatsapp className="ul-icon" />
                    {isEditing ? (
                        <input type="text" name="whatsapp" value={links.whatsapp} onChange={handleChange} />
                    ) : (
                        <span>{links.whatsapp}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateLinks;