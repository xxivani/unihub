import { useState, useCallback } from "react";
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
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const navigate = useNavigate();
  const MAX_RETRIES = 3;

  const apiUrl = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 
      `http://localhost:${import.meta.env.VITE_DEV_PORT || '8080'}/api` :
      `https://${window.location.hostname}/api`);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("Image file is too large. Please select an image smaller than 10MB.");
        e.target.value = null; 
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { 
        setError("PDF file is too large. Please select a PDF smaller than 10MB.");
        e.target.value = null; 
        return;
      }
      setPdfFile(file);
    } else {
      setPdfFile(null);
    }
  };

  const clearNewsCache = useCallback(() => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key === "newsPosts" || key.startsWith("newsPost_"))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Cleared ${keysToRemove.length} news cache items`);
    } catch (err) {
      console.error("Error clearing news cache:", err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitAttempts(prev => prev + 1);

    const maxRetries = MAX_RETRIES;
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        if (!title.trim() || !body.trim()) {
          throw new Error("Title and Body are required.");
        }
        
        if (!pdfFile) {
          throw new Error("Please attach a PDF for the newsletter.");
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

        console.log('Submitting news post to:', `${apiUrl}/news`);
        
        const url = `${apiUrl}/news?_t=${Date.now()}`;
        
        const response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });
        
        if (response.status === 413) {
          throw new Error('File is too large. Please upload a smaller file (max 10MB).');
        }
        
        if (!response.ok) {
          const errorResponse = await response.text();
          try {
            const errorJson = JSON.parse(errorResponse);
            throw new Error(errorJson.message || errorJson.error || `Server error: ${response.status}`);
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            throw new Error(errorResponse || `Server error: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log('Server response:', data);
        
        success = true;
        
        clearNewsCache();
        
        if (data.lastModified) {
          localStorage.setItem('newsLastModified', data.lastModified);
        }
        
        alert("News post created successfully!");
        
        navigate("/news?refresh=true");
        break;
        
      } catch (err) {
        retryCount++;
        console.error(`Attempt ${retryCount}/${maxRetries} failed:`, err);
        
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
          setError(`Attempt ${retryCount} failed. Retrying in ${Math.round(delay/1000)} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          setError(`Failed after ${maxRetries} attempts: ${err.message}`);
        }
      }
    }
    
    setLoading(false);
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
          {imageFile && (
            <p className="file-info">
              Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
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
            <p className="file-info">
              Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 
              (submitAttempts > 1 ? `Retrying... (${submitAttempts}/${MAX_RETRIES})` : "Creating...") 
              : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewsForm;