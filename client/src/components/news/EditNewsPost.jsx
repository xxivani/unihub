import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateNewsPost.css"; // Reuse the same CSS

const EditNewsForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [currentPdf, setCurrentPdf] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 
    `http://localhost:${import.meta.env.VITE_DEV_PORT || '8080'}/api` :
    `https://${window.location.hostname}/api`);

  useEffect(() => {
    const fetchNewsPost = async () => {
      try {
        const response = await fetch(`${apiUrl}/news/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch news post");
        }
        const data = await response.json();
        
        setTitle(data.news_title || data.title || "");
        setBody(data.news_content || data.description || "");
        setCurrentImage(data.news_thumbnail_url || data.image || "");
        setCurrentPdf(data.news_pdf_url || data.newsletterLink || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news post:", err);
        setError("Failed to load news post. Please try again.");
        setLoading(false);
      }
    };

    fetchNewsPost();
  }, [apiUrl, id]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    try {
      const response = await fetch(`${apiUrl}/news/${id}`, {
        method: "PUT",
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("News post updated successfully!");
        navigate("/news");
      } else {
        setError(data.error || "Failed to update news post");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the news post.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="create-news-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="create-news-container">
      <div className="header-row">
        <h2>Edit News Post</h2>
        <button 
          className="cancel-button"
          onClick={() => navigate("/news")}>
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
          <label htmlFor="news-image">Current Image:</label>
          {currentImage && (
            <div className="current-file">
              <img 
                src={`${apiUrl.replace('/api', '')}${currentImage}`} 
                alt="Current thumbnail" 
                className="thumbnail-preview" 
                style={{ maxWidth: '200px', maxHeight: '150px' }}
              />
            </div>
          )}
          <label htmlFor="news-image">Upload New Image (Optional):</label>
          <input
            type="file"
            id="news-image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        <div className="form-group">
          <label>Current PDF: <span className="current-filename">{currentPdf.split('/').pop()}</span></label>
          <label htmlFor="news-pdf">Upload New PDF (Optional):</label>
          <input
            type="file"
            id="news-pdf"
            accept="application/pdf"
            onChange={handlePdfChange}
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
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNewsForm;