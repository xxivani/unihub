import React, { useState } from "react";
import "./CreateClubForm.css";

const CreateClubForm = () => {
    const [clubName, setClubName] = useState("");
    const [presidentName, setPresidentName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Club Created:", { clubName, presidentName, description, image });
    };

    return (
        <div className="create-club-form-container">
            <form className="create-club-form" onSubmit={handleSubmit}>
                <label>Club Name:</label>
                <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Enter club name..."
                    required
                />

               
                <label>Club President Name:</label>
                <input
                    type="text"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    placeholder="Enter club president name..."
                    required
                />

                
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter club description..."
                    required
                ></textarea>

                
                <label>Upload Club Logo:</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                />

                
                <button type="submit" className="submit-button">Create Club</button>
            </form>
        </div>
    );
};

export default CreateClubForm;
