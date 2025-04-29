import React, { useState } from "react";
import "./CreateClubForm.css";

const CreateClubForm = () => {
  const [clubName, setClubName] = useState("");
  const [presidentName, setPresidentName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      alert("Please select a category for the club.");
      return;
    }

    const formData = {
      club_name: clubName,
      club_description: description,
      club_thumbnail_url: imageUrl,
      club_category: category,
    };

    try {
      const response = await fetch(`${apiUrl}/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Club created successfully!");
        console.log(result);
        setClubName("");
        setPresidentName("");
        setDescription("");
        setImageUrl("");
        setCategory("");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error creating club:", error);
      alert("Something went wrong.");
    }
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
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter club description..."
          required
        ></textarea>

        <label>Club Logo (Image URL):</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL..."
        />

        <label>Club Category:</label>
        <select
          className="dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Select a category --</option>
          <option value="Social">Social</option>
          <option value="STEM">STEM</option>
          <option value="Tech">Tech</option>
          <option value="Arts">Arts</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
        </select>

        <button type="submit" className="submit-button">Create Club</button>
      </form>
    </div>
  );
};

export default CreateClubForm;
