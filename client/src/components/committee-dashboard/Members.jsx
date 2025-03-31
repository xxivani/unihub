import { useState, useEffect } from "react";
import { Avatar, List, Popover, Button, Modal, Input, Select, message } from "antd";
import { FaCog, FaTrash, FaPlus } from "react-icons/fa";
import "./Members.css";
import committeeMembersFallback from "./committee-members";

const fallbackPermissions = [
  "CreateEvent",
  "ListRoleOpening",
  "UpdateLink",
  "AssignPosition",
  "UpdateBudget",
];

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [permissionsList, setPermissionsList] = useState(fallbackPermissions);
  const [activeMember, setActiveMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [hasAssignPermission, setHasAssignPermission] = useState(false);
  const [newMember, setNewMember] = useState({
    title: "",
    position: "",
    description: "",
    avatar: "",
    permissions: [],
    email: "",
    user_id: 0,
    club_id: 1,
  });

  const getPresidentCount = () => {
    return members.filter(member => member.description === "PRESIDENT").length;
  };  

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${apiUrl}/committee-member-permissions/all-permissions`);
      if (!res.ok) throw new Error("Failed to fetch permissions");
      const data = await res.json();
      setPermissionsList(data);
    } catch (err) {
      console.warn("Using fallback permissions:", err.message);
      setPermissionsList(fallbackPermissions);
    }
  };

  const fetchMembers = async () => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (!userData || !userData.id) {
      console.warn("User not logged in or missing ID.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/committee-members`);
      if (!res.ok) throw new Error("Failed to fetch committee members");

      const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userData.id}`);
      if (!cmRes.ok) throw new Error("Failed to fetch logged-in committee member");

      const loggedInCommitteeMember = await cmRes.json();
      const userClubId = loggedInCommitteeMember.club_id;

      const allMembers = await res.json();
      const filtered = allMembers.filter(member => member.club_id === userClubId);

      const formatted = filtered.map((member) => ({
        id: member.committee_member_id,
        title: member.committee_member_name,
        description: member.committee_member_position,
        email: member.committee_member_email,
        user_id: member.user_id,
        club_id: member.club_id,
        avatar: "https://api.dicebear.com/9.x/miniavs/svg?seed=" + member.committee_member_name,
        permissions: member.permissions?.map((p) => p.permission) || [],
      }));
      setMembers(formatted);
    } catch (error) {
      console.warn("Using fallback committee members:", error.message);
      setMembers(committeeMembersFallback);
      setIsFallback(true);
    }
  };

  const checkAssignPermission = async () => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (!userData || !userData.id) return;

    try {
      const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userData.id}`);
      const cm = await cmRes.json();
      const permissionRes = await fetch(`${apiUrl}/committee-member-permissions/${cm.committee_member_id}`);
      const perms = await permissionRes.json();
      const hasPermission = perms.some(p => p.permission === "AssignPosition");
      setHasAssignPermission(hasPermission);
    } catch (err) {
      console.warn("Permission check failed:", err.message);
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchMembers();
    checkAssignPermission();
  }, []);

  const togglePermission = async (index, permission) => {
    if (!hasAssignPermission) return message.error("You do not have permission to manage roles");

    const member = members[index];
    const updatedPermissions = member.permissions.includes(permission)
      ? member.permissions.filter((p) => p !== permission)
      : [...member.permissions, permission];

    const updatedMembers = [...members];
    updatedMembers[index].permissions = updatedPermissions;
    setMembers(updatedMembers);

    if (!isFallback && member.id) {
      try {
        const res = await fetch(`${apiUrl}/committee-member-permissions/${member.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions: updatedPermissions }),
        });
        if (!res.ok) throw new Error("Failed to update permissions");
        message.success("Permissions updated!");
      } catch (err) {
        message.error("Failed to update permissions");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (selectedPermissions) => {
    setNewMember((prev) => ({ ...prev, permissions: selectedPermissions }));
  };

  const addMember = async () => {
    if (!hasAssignPermission) return message.error("You do not have permission to add members");
  
    const { title, position, description, email, avatar, permissions, club_id } = newMember;
  
    if (!title || !position || !description || !email) {
      message.error("All required fields must be filled");
      return;
    }
  
    let user_id;
  
    try {
      const userRes = await fetch(`${apiUrl}/users/by-email/${email}`);
      if (!userRes.ok) throw new Error("User not found");
  
      const user = await userRes.json();
      user_id = user.id;
    } catch (err) {
      console.error("Error fetching user by email:", err.message);
      message.error("No user found with that email.");
      return;
    }
  
    const duplicate = members.some(member => parseInt(member.user_id) === parseInt(user_id));
    if (duplicate) {
      message.error("A committee member with this user already exists.");
      return;
    }
  
    const newEntry = {
      ...newMember,
      user_id,
      club_id: parseInt(club_id),
      avatar: avatar || `https://api.dicebear.com/9.x/miniavs/svg?seed=${title}`,
    };
  
    try {
      const res = await fetch(`${apiUrl}/committee-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          committee_member_name: newEntry.title,
          committee_member_email: newEntry.email,
          committee_member_description: newEntry.description,
          committee_member_position: newEntry.position,
          user_id: newEntry.user_id,
          club_id: newEntry.club_id,
        }),
      });
  
      if (!res.ok) throw new Error("Failed to add committee member");
      const data = await res.json();
  
      if (permissions.length > 0) {
        await fetch(`${apiUrl}/committee-member-permissions/${data.data.committee_member_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions }),
        });
      }
  
      fetchMembers();
      setIsModalOpen(false);
      message.success("Committee member added!");
    } catch (err) {
      console.error(err);
      message.error("Failed to add committee member");
    }
  };  

  const deleteMember = async (index) => {
    if (!hasAssignPermission) return message.error("You do not have permission to delete members");

    const member = members[index];
    if (isFallback || !member.id) {
      setMembers(members.filter((_, i) => i !== index));
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/committee-members/${member.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete member");
      fetchMembers();
      message.success("Deleted successfully");
    } catch (err) {
      message.error("Failed to delete committee member");
    }
  };

  return (
    <div className="members-container">
      <div className="members-header">
        <h3 className="member">Committee Members</h3>
        {hasAssignPermission && (
          <Button className="add-button-cdashboard" type="primary" onClick={() => setIsModalOpen(true)}>
            Add <FaPlus />
          </Button>
        )}
      </div>

      <List
        itemLayout="horizontal"
        dataSource={members}
        renderItem={(item, index) => (
          <List.Item className="member-item">
            <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={item.title} description={item.description} />
            <div className="member-actions">
            {hasAssignPermission && (item.description !== "PRESIDENT" || getPresidentCount() > 1) && (
              <>
                <Popover  
                  content={
                    <div className="permissions-menu">
                      <h6>Manage Permissions</h6>
                      {permissionsList.map((perm, i) => (
                        <div
                          key={i}
                          className="permission-item"
                          onClick={() => togglePermission(index, perm)}
                        >
                          <span>{perm}</span>
                          {item.permissions.includes(perm) && <span className="checkmark">✔</span>}
                        </div>
                      ))} 
                    </div>
                  }
      trigger="click"
      placement="bottomRight"
      open={activeMember === index}
      onOpenChange={(visible) => setActiveMember(visible ? index : null)}
    >
      <FaCog className="settings-icon" />
    </Popover>
    <FaTrash className="delete-icon" onClick={() => deleteMember(index)} />
  </>
)}

            </div>
          </List.Item>
        )}
      />

      <Modal
        title="Add Committee Member"
        open={isModalOpen}
        onOk={addMember}
        onCancel={() => setIsModalOpen(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <Input placeholder="Name" name="title" className="input" value={newMember.title} onChange={handleInputChange} />
        <Input
          placeholder="Description"
          name="description"
          className="input"
          value={newMember.description}
          onChange={handleInputChange}
          style={{ marginTop: 10 }}
        />
        <Select
          placeholder="Select Role"
          value={newMember.position}
          onChange={(value) => setNewMember((prev) => ({ ...prev, position: value }))}
          style={{ width: "100%", marginTop: 10 }}
        >
          {[
            "PRESIDENT",
            "VICE_PRESIDENT",
            "TREASURER",
            "STUDENT_ENGAGEMENT_OFFICER",
            "SOCIAL_MEDIA_MANAGER",
            "OPERATIONS_HEAD",
            "EVENTS_OFFICER",
          ].map((role) => (
            <Select.Option key={role} value={role}>
              {role.replace(/_/g, " ")}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Avatar URL (optional)"
          name="avatar"
          className="input"
          value={newMember.avatar}
          onChange={handleInputChange}
          style={{ marginTop: 10 }}
        />
        {/* <Input
          placeholder="User ID"
          name="user_id"
          className="input"
          value={newMember.user_id}
          onChange={handleInputChange}
          style={{ marginTop: 10 }}
        /> */}
        <Input
          placeholder="Email"
          name="email"
          className="input"
          value={newMember.email}
          onChange={handleInputChange}
          style={{ marginTop: 10 }}
        />
        <Select
          mode="multiple"
          placeholder="Select Permissions"
          style={{ width: "100%", marginTop: 10 }}
          value={newMember.permissions}
          onChange={handlePermissionChange}
        >
          {permissionsList.map((perm, i) => (
            <Select.Option key={i} value={perm}>
              {perm}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Members;