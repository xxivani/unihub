import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateNewsPost.css";

const defaultImageUrl = "/assets/images/stock-news.jpeg";

const CreateNewsPost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const navigate = useNavigate();

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
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("imageUrl", defaultImageUrl);
    }
    pdfFiles.forEach((file, idx) => {
      formData.append(`pdf_${idx}`, file);
    });

    console.log({ title, body, imageFile, pdfFiles });
    
    navigate("/news");
  };

  return (
    <div className="create-news-container">
      <div className="header-row">
        <h1>Create News Post</h1>
        <button 
          className="go-back-button"
          onClick={() => navigate("/news")}>
          Go Back
        </button>
      </div>
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
            required
          />
          <small>{body.length} / 1000</small>
        </div>
        <div className="form-group">
          <label htmlFor="news-image">Upload Newsletter Image:</label>
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
          <label htmlFor="news-pdf">Attach PDF(s):</label>
          <input
            type="file"
            id="news-pdf"
            accept="application/pdf"
            multiple
            onChange={handlePdfChange}
          />
          {pdfFiles.length > 0 && (
            <ul className="pdf-list">
              {pdfFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="submit-news-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateNewsPost;
