import { useState } from "react";
import { Avatar, List, Popover, Button, Modal, Input, Select } from "antd";
import { FaCog, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Members.css";
import committeeMembers from "./committee-members";

const permissionsList = [
    { name: "Create Event", icon: "➕" },
    { name: "List Role Opening", icon: "💼" },
    { name: "Update Links", icon: "✏️" },
    { name: "Assign Position", icon: "👥" },
    { name: "Update Budget", icon: "🎛️" },
];

const Members = () => {
    const [members, setMembers] = useState(committeeMembers);
    const [activeMember, setActiveMember] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        title: "",
        description: "",
        avatar: "",
        permissions: [],
    });

    // Toggle permission for an existing member
    const togglePermission = (memberIndex, permission) => {
        setMembers(prevMembers => 
            prevMembers.map((member, index) => 
                index === memberIndex
                    ? { ...member, permissions: member.permissions.includes(permission)
                        ? member.permissions.filter(p => p !== permission)
                        : [...member.permissions, permission] }
                    : member
            )
        );
    };

    // Handle form input change for new member
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMember(prev => ({ ...prev, [name]: value }));
    };

    // Handle permission selection for new member
    const handlePermissionChange = (selectedPermissions) => {
        setNewMember(prev => ({ ...prev, permissions: selectedPermissions }));
    };

    // Add new committee member
    const addMember = () => {
        if (newMember.title && newMember.description) {
            setMembers([...members, { ...newMember, avatar: newMember.avatar || "https://api.dicebear.com/9.x/miniavs/svg?seed=Default" }]);
            setNewMember({ title: "", description: "", avatar: "", permissions: [] });
            setIsModalOpen(false);
        }
    };

    // Delete a committee member
    const deleteMember = (index) => {
        setMembers(prevMembers => prevMembers.filter((_, i) => i !== index));
    };

    return (
        <div className="members-container">
            <div className="members-header">
                <h3 className="member">Committee Members</h3>
                <Button className="add-button-cdashboard" type="primary" onClick={() => setIsModalOpen(true)}>
                    Add <FaPlus />
                </Button>

            </div>

            <List
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(item, index) => (
                    <List.Item className="member-item">
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={item.title}
                            description={item.description}
                        />
                        <div className="member-actions">
                            <Popover
                                content={
                                    <div className="permissions-menu">
                                        <h6>Manage Permissions</h6>
                                        {permissionsList.map((perm, i) => (
                                            <div
                                                key={i}
                                                className="permission-item"
                                                onClick={() => togglePermission(index, perm.name)}
                                            >
                                                <span>{perm.icon}</span> {perm.name}
                                                {item.permissions.includes(perm.name) && <span className="checkmark">✔</span>}
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
                        </div>
                    </List.Item>
                )}
            />

            <Modal
                title="Add Committee Member"
                visible={isModalOpen}
                onOk={addMember}
                onCancel={() => setIsModalOpen(false)}
                okText="Add"
                cancelText="Cancel"
            >
                <Input placeholder="Name" name="title" className="input" value={newMember.title} onChange={handleInputChange} />
                <Input placeholder="Role (e.g. Secretary)" name="description" className="input" value={newMember.description} onChange={handleInputChange} style={{ marginTop: 10 }} />
                <Input placeholder="Avatar URL (optional)" name="avatar" className="input" value={newMember.avatar} onChange={handleInputChange} style={{ marginTop: 10 }} />
                <Select
                    mode="multiple"
                    placeholder="Select Permissions"
                    style={{ width: "100%", marginTop: 10 }}
                    value={newMember.permissions}
                    onChange={handlePermissionChange}
                    className="input"
                >
                    {permissionsList.map((perm, i) => (
                        <Select.Option key={i} value={perm.name}>{perm.name}</Select.Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default Members;