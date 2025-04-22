import "./news.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NewsSection = () => {
  const [user, setUser] = useState(null);
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? `http://localhost:${import.meta.env.VITE_DEV_PORT || "8080"}/api`
      : `https://${window.location.hostname}/api`);

  // fallback data
  const sampleNewsPosts = [
    {
      news_id: 1,
      news_title: "Newsletter Week 6",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=1",
      news_pdf_url: "#"
    },
    {
      news_id: 2,
      news_title: "Newsletter Week 5",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=2",
      news_pdf_url: "#"
    },
    {
      news_id: 3,
      news_title: "Newsletter Week 4",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=3",
      news_pdf_url: "#"
    },
    {
      news_id: 4,
      news_title: "Newsletter Week 3",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=4",
      news_pdf_url: "#"
    }
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching posts from:", `${API_URL}/news`);
      
      const res = await fetch(`${API_URL}/news`);
      if (!res.ok) {
        console.error("API error response:", res.status, res.statusText);
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Posts received:", data);
      
      if (Array.isArray(data) && data.length) {
        data.forEach(post => {
          const postKey = `newsPost_${post.news_id}`;
          sessionStorage.setItem(postKey, JSON.stringify(post));
        });
        
        sessionStorage.setItem("newsPosts", JSON.stringify(data));
        setNewsPosts(data);
      } else {
        console.warn("No posts found in API response, checking session storage");
        
        const reconstructedPosts = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('newsPost_')) {
            try {
              const post = JSON.parse(sessionStorage.getItem(key));
              reconstructedPosts.push(post);
            } catch (e) {
              console.error("Failed to parse stored post:", e);
            }
          }
        }
        
        if (reconstructedPosts.length) {
          console.log("Using reconstructed posts from session storage");
          reconstructedPosts.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
          setNewsPosts(reconstructedPosts);
        } else {
          const cached = sessionStorage.getItem("newsPosts");
          if (cached) {
            console.log("Using cached posts from session storage");
            setNewsPosts(JSON.parse(cached));
          } else {
            console.log("Using sample posts as fallback");
            setNewsPosts(sampleNewsPosts);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching posts:", e);
      setError(e.message);
      
      const reconstructedPosts = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('newsPost_')) {
          try {
            const post = JSON.parse(sessionStorage.getItem(key));
            reconstructedPosts.push(post);
          } catch (e) {
            console.error("Failed to parse stored post:", e);
          }
        }
      }
      
      if (reconstructedPosts.length) {
        console.log("Using reconstructed posts from session storage due to error");
        reconstructedPosts.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
        setNewsPosts(reconstructedPosts);
      } else {
        const cached = sessionStorage.getItem("newsPosts");
        if (cached) {
          console.log("Using cached posts from session storage due to error");
          setNewsPosts(JSON.parse(cached));
        } else {
          console.log("Using sample posts as fallback due to error");
          setNewsPosts(sampleNewsPosts);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    
    fetchPosts();
    
    const refreshInterval = setInterval(() => {
      fetchPosts();
    }, 60000); 
    
    return () => clearInterval(refreshInterval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      const updatedPosts = newsPosts.filter((p) => p.news_id !== id);
      setNewsPosts(updatedPosts);
      
      sessionStorage.setItem("newsPosts", JSON.stringify(updatedPosts));
      sessionStorage.removeItem(`newsPost_${id}`);
      
      alert("Post deleted successfully");
    } catch (e) {
      console.error("Error deleting post:", e);
      alert(`Error: ${e.message}`);
    }
  };

  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const current = newsPosts.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(newsPosts.length / postsPerPage);
  const paginate = (n) => setCurrentPage(n);
  const base = API_URL.replace(/\/api$/, "");

  if (loading) {
    return (
      <section className="latest-news">
        <div className="title-button">
          <h2>Latest News</h2>
        </div>
        <p>Loading news posts...</p>
      </section>
    );
  }

  return (
    <section className="latest-news">
      <div className="title-button">
        <h2>Latest News</h2>
        {user?.role === "admin" && (
          <Link to="/news/create-news-post">
            <button className="create-news-button">Create News Post</button>
          </Link>
        )}
      </div>
      {error && <p className="error-message">Error loading news: {error}. <button onClick={fetchPosts}>Retry</button></p>}
      <div className="news-list">
        {current.length ? (
          current.map((n) => (
            <div className="news-item" key={n.news_id}>
              <div className="news-info">
                <div className="news-image-container">
                  <img
                    src={
                      n.news_thumbnail_url?.startsWith("/uploads")
                        ? `${base}${n.news_thumbnail_url}`
                        : n.news_thumbnail_url
                    }
                    alt={n.news_title}
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/200/150";
                    }}
                  />
                </div>
                <div className="news-td">
                  <h3>{n.news_title}</h3>
                  <p>{n.news_content}</p>
                  {n.news_author?.toLowerCase() !== "admin" && (
                    <>
                      <p className="news-author">By: {n.news_author}</p>
                      <p className="news-date">
                        {new Date(n.news_created_at).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
                <div className="buttons">
                  
                    href={`${base}${n.news_pdf_url}`}
                    className="view-newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                  
                    href={`${base}${n.news_pdf_url}`}
                    className="download-newsletter"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                  {user?.role === "admin" && (
                    <div className="admin-actions">
                      <Link to={`/news/edit/${n.news_id}`}>Edit</Link>
                      
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(n.news_id);
                        }}
                      >
                        Delete
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No news posts available</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            &laquo; Prev
          </button>
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            Next &raquo;
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsSection;