import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "./ClubDetailsPanel.css";

const ClubDetailsPanel = () => {
    const teamMembers = [
        { role: "President", name: "Bob White" },
        { role: "Vice President", name: "Alice Green" },
        { role: "Treasurer", name: "Charlie Black" }
    ]; // Removed the extra member

    return (
        <main className="club-details-container">
            {/* Left Section - Club Info */}
            <section className="club-info-panel">
                <h2 className="club-info-title">PAWS Club</h2>
                <p className="club-info-text">
                    PAWS Club is a student-led organization that brings together animal lovers to support rescue efforts, 
                    promote responsible pet care, and organize events that celebrate our furry friends. 
                    We collaborate with local shelters and advocate for animal welfare on campus.
                </p>
            </section>

            {/* Right Section - Our Team */}
            <aside className="club-committee-panel">
                <h2 className="committee-title">Our Team</h2>
                <div className="committee-list">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-member">
                            <FaUserCircle className="member-avatar" />
                            <div className="member-info">
                                <div className="member-role">{member.role}</div>
                                <div className="member-name">{member.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </main>
    );
};

export default ClubDetailsPanel;
