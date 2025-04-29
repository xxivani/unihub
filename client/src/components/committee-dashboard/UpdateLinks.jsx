import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaPhone, FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./UpdateLinks.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const UpdateLinks = ({ selectedClubId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [links, setLinks] = useState({
    phone: "",
    email: "",
    instagram: "",
    whatsapp: "",
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/club-contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          club_id: selectedClubId,
          ...links
        }),
      });

      if (!response.ok) throw new Error("Failed to save contact info");

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving contact info:", err);
    }
  };

  const fetchLinksAndPermissions = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      if (!userData || !userData.id) throw new Error("User not logged in");

      // Admins automatically get permission to edit
      if (userData.role === "admin") {
        setHasPermission(true);
      } else {
        // Committee member: check permission
        const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userData.id}`);
        const cm = await cmRes.json();

        if (!cm || !cm.committee_member_id) throw new Error("Committee member not found");

        const permRes = await fetch(`${apiUrl}/committee-member-permissions/${cm.committee_member_id}`);
        const perms = await permRes.json();

        const hasUpdate = Array.isArray(perms) && perms.some(p => p.permission === "UpdateLink");
        setHasPermission(hasUpdate);
      }

      // Fetch existing contact info
      const contactRes = await fetch(`${apiUrl}/club-contacts/${selectedClubId}`);
      const contact = contactRes.ok ? await contactRes.json() : {};
      setLinks({
        phone: contact.phone || "",
        email: contact.email || "",
        instagram: contact.instagram || "",
        whatsapp: contact.whatsapp || ""
      });
    } catch (err) {
      console.error("Error fetching links/permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClubId) {
      fetchLinksAndPermissions();
    }
  }, [selectedClubId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="update-links">
      <div className="ul-header">
        <h3>Contact Information</h3>
        {hasPermission && !isEditing && (
          <button className="ul-edit-btn" onClick={handleEdit}>
            <FiEdit2 size={18} />
          </button>
        )}
        {hasPermission && isEditing && (
          <button className="ul-save-btn" onClick={handleSave}>
            Save
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
                <span>{links[field] || "Not provided"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpdateLinks;