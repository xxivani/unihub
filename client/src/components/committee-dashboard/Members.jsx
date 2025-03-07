import { useState } from "react";
import { Avatar, List, Popover, Checkbox } from "antd";
import { FaCog } from "react-icons/fa";
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

    const togglePermission = (memberIndex, permission) => {
        setMembers(prevMembers => {
            return prevMembers.map((member, index) => {
                if (index === memberIndex) {
                    const hasPermission = member.permissions.includes(permission);
                    return {
                        ...member,
                        permissions: hasPermission
                            ? member.permissions.filter(p => p !== permission)
                            : [...member.permissions, permission],
                    };
                }
                return member;
            });
        });
    };

    return (
        <div className="members-container">
            <h3 className="member">Committee Members</h3>
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
                            <FaCog key="settings" className="settings-icon" />
                        </Popover>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Members;