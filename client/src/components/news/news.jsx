import "./news.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

const NewsSection = () => {
  const [user, setUser] = useState(null);
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [serverLastModified, setServerLastModified] = useState(0);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? `http://localhost:${import.meta.env.VITE_DEV_PORT || "8080"}/api`
      : `https://${window.location.hostname}/api`);

  const sampleNewsPosts = [
    {
      news_id: 1,
      news_title: "Newsletter Week 6",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=1",
      news_pdf_url: "#",
    },
    {
      news_id: 2,
      news_title: "Newsletter Week 5",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=2",
      news_pdf_url: "#",
    },
  ];

  const checkServerUpdates = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/news/last-modified`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        console.warn('Failed to check for updates:', response.status);
        return false;
      }
      
      const data = await response.json();
      
      if (data.lastModified > serverLastModified) {
        console.log('Server has newer data:', new Date(data.lastModified).toISOString());
        setServerLastModified(data.lastModified);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error checking for updates:', err);
      return false;
    }
  }, [API_URL, serverLastModified]);

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

  const fetchPosts = useCallback(async (forceFresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (forceFresh) {
        clearNewsCache();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      console.log("Fetching news posts from API...");
      
      const res = await fetch(`${API_URL}/news`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      console.log(`Successfully fetched ${data.length} news posts`);
      
      data.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
      
      setNewsPosts(data);

      try {
        localStorage.setItem("newsPosts", JSON.stringify(data));
        data.forEach(post => {
          localStorage.setItem(`newsPost_${post.news_id}`, JSON.stringify(post));
        });
        
        localStorage.setItem("newsLastFetch", Date.now().toString());
        
        console.log("News cache successfully updated");
      } catch (cacheErr) {
        console.warn("Failed to update news cache:", cacheErr);
      }
    } catch (err) {
      console.error("Failed to fetch news posts:", err);
      setError(err.message);

      try {
        const cachedPosts = [];
        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("newsPost_")) {
            keys.push(key);
          }
        }
        
        keys.forEach(key => {
          try {
            const post = JSON.parse(localStorage.getItem(key));
            if (post && post.news_id) {
              cachedPosts.push(post);
            }
          } catch (e) {
            console.warn(`Failed to parse cached post ${key}:`, e);
          }
        });

        if (cachedPosts.length) {
          console.log(`Loaded ${cachedPosts.length} posts from individual cache entries`);
          cachedPosts.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
          setNewsPosts(cachedPosts);
        } else {
          const cached = localStorage.getItem("newsPosts");
          if (cached) {
            try {
              const parsedPosts = JSON.parse(cached);
              console.log(`Loaded ${parsedPosts.length} posts from aggregate cache`);
              setNewsPosts(parsedPosts);
            } catch (e) {
              console.warn("Failed to parse aggregate news cache:", e);
              setNewsPosts(sampleNewsPosts);
            }
          } else {
            console.log("No cache available, using sample posts");
            setNewsPosts(sampleNewsPosts);
          }
        }
      } catch (cacheErr) {
        console.error("Cache fallback also failed:", cacheErr);
        setNewsPosts(sampleNewsPosts);
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, clearNewsCache]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.warn("Failed to parse user data:", e);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const shouldRefresh = params.get('refresh') === 'true';
    
    if (shouldRefresh) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    console.log(`Initial news fetch with API URL: ${API_URL}, force refresh: ${shouldRefresh}`);
    fetchPosts(shouldRefresh);
    
    const checkInterval = setInterval(async () => {
      const hasUpdates = await checkServerUpdates();
      if (hasUpdates) {
        console.log('Server has updates, refreshing data');
        fetchPosts(true);
      }
    }, 10000); 
    
    const handleFocus = () => {
      console.log('Window focused, checking for updates');
      checkServerUpdates().then(hasUpdates => {
        if (hasUpdates) {
          fetchPosts(true);
        }
      });
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [API_URL, fetchPosts, checkServerUpdates]);

  const handleRefresh = () => {
    console.log("Manual refresh requested");
    fetchPosts(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      setLoading(true);
      console.log(`Deleting news post ${id}...`);
      
      const res = await fetch(`${API_URL}/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete post");
      }

      const updated = newsPosts.filter((p) => p.news_id !== id);
      setNewsPosts(updated);
      
      clearNewsCache();
      localStorage.setItem("newsPosts", JSON.stringify(updated));
      updated.forEach(post => {
        localStorage.setItem(`newsPost_${post.news_id}`, JSON.stringify(post));
      });
      
      alert("Post deleted successfully");
      
      fetchPosts(true);
    } catch (e) {
      console.error("Delete failed:", e);
      alert(`Error: ${e.message}`);
      fetchPosts(true);
    } finally {
      setLoading(false);
    }
  };

  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const current = newsPosts.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(newsPosts.length / postsPerPage);
  const paginate = (n) => setCurrentPage(n);
  const base = API_URL.replace(/\/api$/, "");

  if (loading && newsPosts.length === 0) {
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
        <div className="action-buttons">
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          
          {user?.role === "admin" && (
            <Link to="/news/create-news-post">
              <button className="create-news-button">Create News Post</button>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <p className="error-message">
          Error loading news: {error}{" "}
          <button onClick={handleRefresh}>Try Again</button>
        </p>
      )}

      {loading && newsPosts.length > 0 && (
        <p className="loading-message">Refreshing news posts...</p>
      )}

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
                  <a
                    href={`${base}${n.news_pdf_url}`}
                    className="view-newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                  <a
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
                      <a
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
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsSection;