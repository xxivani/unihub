import React, { useState } from "react";
import "./CreateClubForm.css";

const CreateClubForm = () => {
  const [clubName, setClubName] = useState("");
  const [presidentName, setPresidentName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? `http://localhost:${import.meta.env.VITE_DEV_PORT || "5000"}/api`
      : `https://${window.location.hostname}/api`);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError("Image file is too large. Please select an image under 10MB.");
      setImageFile(null);
      setPreviewImage(null);
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      alert("Please select a category for the club.");
      return;
    }

    const formData = new FormData();
    formData.append("club_name", clubName);
    formData.append("club_description", description);
    formData.append("club_category", category);
    if (imageFile) {
      formData.append("image", imageFile); 
    }

    try {
      const response = await fetch(`${apiUrl}/clubs`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert("Club created successfully!");
        setClubName("");
        setPresidentName("");
        setDescription("");
        setCategory("");
        setImageFile(null);
        setPreviewImage(null);
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

        <label>Club Logo (Upload Image):</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="club-logo-preview"
            style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
          />
        )}
        {error && <p className="error-message">{error}</p>}

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

        <button type="submit" className="submit-button">
          Create Club
        </button>
      </form>
    </div>
  );
};

export default CreateClubForm;
