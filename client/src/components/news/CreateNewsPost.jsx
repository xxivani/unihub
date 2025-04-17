import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateNewsPost.css";

const defaultImageUrl = "/assets/images/img.jpeg";

const CreateNewsForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 
    `http://localhost:${import.meta.env.VITE_DEV_PORT || '8080'}/api` :
    `https://${window.location.hostname}/api`);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    } else {
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and Body are required.");
      setLoading(false);
      return;
    }
    
    if (!pdfFile) {
      setError("Please attach a PDF for the newsletter.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("imageUrl", defaultImageUrl);
    }
    
    formData.append("pdf", pdfFile);

    try {
      const response = await fetch(`${apiUrl}/news`, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("News post created successfully!");
        navigate("/news");
      } else {
        setError(data.error || "Failed to create news post");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the news post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-container">
      <div className="header-row">
        <h2>Create News Post</h2>
        <button 
          className="cancel-button"
          onClick={() => navigate("/news")}
        >
          Go Back
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="create-news-form">
        <div className="form-group">
          <label htmlFor="news-title">Title (max 100 characters):</label>
          <input
            type="text"
            id="news-title"
            maxLength="100"
            value={title}
            onChange={handleTitleChange}
            required
          />
          <small>{title.length} / 100</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="news-body">Body (max 1000 characters):</label>
          <textarea
            id="news-body"
            maxLength="1000"
            value={body}
            onChange={handleBodyChange}
            rows="10"
            required
          />
          <small>{body.length} / 1000</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="news-image">Upload Newsletter Image (Optional):</label>
          <input
            type="file"
            id="news-image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {!imageFile && (
            <p className="stock-image-warning">
              No image uploaded. A stock image will be used.
            </p>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="news-pdf">Attach PDF (Required):</label>
          <input
            type="file"
            id="news-pdf"
            accept="application/pdf"
            onChange={handlePdfChange}
            required
          />
          {pdfFile && (
            <ul className="pdf-list">
              <li>{pdfFile.name}</li>
            </ul>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewsForm;
