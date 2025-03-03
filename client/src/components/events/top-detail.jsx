import React from "react";
import { useState } from "react";
import { IconContext } from "react-icons";
import { FaBell } from 'react-icons/fa';
import "./top-detail.css"


function E4TopSection1() {
    const [hovered, setHovered] = useState(false);

    const eventData = {
        title: "Plant and Animal Social",
        thumbnail: "/assets/images/logo-paws.jpeg"
      };
    return (
        <div className="e4-top-container1">
            <img className="e4-top-image" src={eventData.thumbnail} alt="Event Image"/>
            <h1 className="e4-top-title1">{eventData.title}</h1>
                <div className="e4-top-buttons-container">
                        <button className="e4-follow-button">Follow</button>
                        <button className="e4-notification-button"
                         onMouseEnter={() => setHovered(true)}
                         onMouseLeave={() => setHovered(false)}>
                        <IconContext.Provider value={{ size: 20 }}>
                            <FaBell style={{ transform: hovered ? "scale(1.25)" : "scale(1)", transition: "transform 0.3s ease, color 0.3s ease",
                                color: hovered ? "rgb(130, 100, 50)" : "rgb(40,40,40)"
                            }}/>
                            </IconContext.Provider>
                        </button>
                      </div>
            </div>
        );
    };

export default E4TopSection1;
