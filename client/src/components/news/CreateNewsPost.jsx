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
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
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
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key === "newsPosts" || key.startsWith("newsPost_"))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      sessionStorage.setItem("newsPostsUpdated", Date.now().toString());
      
      console.log(`Cleared ${keysToRemove.length} news cache items`);
    } catch (err) {
      console.error("Error clearing news cache:", err);
    }
  }, []);

  const fetchWithRetry = useCallback(async (url, options = {}, attempts = 0) => {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 413) {
        throw new Error("File size too large. Please upload smaller files (max 10MB).");
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || errorJson.message || `Server error: ${response.status}`);
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error(errorText || `Server error: ${response.status}`);
        }
      }
      return response;
    } catch (err) {
      if (attempts < MAX_RETRIES && !err.message.includes("File size too large")) {
        console.log(`Retry attempt ${attempts + 1} for ${url}`);
        const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, attempts + 1);
      }
      throw err;
    }
  }, [MAX_RETRIES]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitAttempts(prev => prev + 1);

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
      
      const startTime = Date.now();
      const response = await fetchWithRetry(`${apiUrl}/news`, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
      });
      
      const data = await response.json();
      console.log(`Server response in ${Date.now() - startTime}ms:`, data);
      
      clearNewsCache();
      
      try {
        console.log("Fetching all posts after creation to update cache");
        const allPosts = await fetchWithRetry(`${apiUrl}/news`);
        const postsData = await allPosts.json();
        
        if (Array.isArray(postsData)) {
          postsData.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
          
          sessionStorage.setItem("newsPosts", JSON.stringify(postsData));
          postsData.forEach(post => {
            sessionStorage.setItem(`newsPost_${post.news_id}`, JSON.stringify(post));
          });
          
          sessionStorage.setItem("newsPostsUpdated", Date.now().toString());
          
          console.log(`Updated cache with ${postsData.length} posts`);
        }
      } catch (err) {
        console.error("Failed to refresh posts after creation:", err);
        
        if (data && data.newsPost) {
          const newPostId = data.newsPost.news_id;
          sessionStorage.setItem(`newsPost_${newPostId}`, JSON.stringify(data.newsPost));
        }
      }
      
      alert("News post created successfully!");
      
      navigate("/news?refresh=true");
      
    } catch (err) {
      console.error('Error creating news post:', err);
      setError(err.message || "An error occurred while creating the news post.");
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
              (submitAttempts > 1 ? `Retrying... (${submitAttempts}/${MAX_RETRIES + 1})` : "Creating...") 
              : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewsForm;