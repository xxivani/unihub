import "./LatestNews.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LatestNews() {
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? `http://localhost:${import.meta.env.VITE_DEV_PORT || "8080"}/api`
      : `https://${window.location.hostname}/api`);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/news`)
      .then(res => {
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid response format");
        const sorted = data.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
        setNewsPosts(sorted.slice(0, 3));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [API_URL]);

  if (loading) {
    return (
      <div className="latest-news-section">
        <p>Loading latest news…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="latest-news-section">
        <p className="error-message">Error loading news: {error}</p>
      </div>
    );
  }

  return (
    <div className="latest-news-section">
      <div className="latest-news-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="6" viewBox="0 0 72 6" fill="none">
          <path d="M0 2.99976H72" stroke="#FFF" strokeWidth="5" />
        </svg>
        <h2 className="latest-news-title">LATEST NEWS</h2>
      </div>
      <div className="latest-news-container">
        {newsPosts.map(n => (
          <div className="latest-news-card" key={n.news_id}>
            <img
              src={
                n.news_thumbnail_url.startsWith("/uploads")
                  ? `${API_URL.replace(/\/api$/, "")}${n.news_thumbnail_url}`
                  : n.news_thumbnail_url
              }
              alt={n.news_title}
              className="latest-news-img"
            />
            <div className="latest-news-content">
            <h3 className="latest-news-heading">
              {n.news_title}
            </h3>
              <p className="latest-news-description">
                {n.news_content.length > 100
                  ? n.news_content.slice(0, 100) + "…"
                  : n.news_content}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="latest-news-button-container">
        <Link to="/news" className="latest-news-button">
          VIEW ALL NEWS
        </Link>
      </div>
    </div>
  );
}
