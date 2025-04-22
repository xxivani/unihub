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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

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
      
      console.log(`Cleared ${keysToRemove.length} news cache items`);
    } catch (err) {
      console.error("Error clearing news cache:", err);
    }
  }, []);

  const fetchWithRetry = useCallback(async (url, options = {}, attempts = 0) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response;
    } catch (err) {
      if (attempts < MAX_RETRIES) {
        console.log(`Retry attempt ${attempts + 1} for ${url}`);
        const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, attempts + 1);
      }
      throw err;
    }
  }, [MAX_RETRIES]);

  const fetchPosts = useCallback(async (forceFresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (forceFresh) {
        clearNewsCache();
      }

      const startTime = Date.now();
      console.log("Fetching news posts from API...");
      
      const res = await fetchWithRetry(`${API_URL}/news`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      console.log(`Successfully fetched ${data.length} news posts in ${Date.now() - startTime}ms`);
      
      data.sort((a, b) => new Date(b.news_created_at) - new Date(a.news_created_at));
      
      setNewsPosts(data);
      setRetryCount(0); 

      try {
        sessionStorage.setItem("newsPosts", JSON.stringify(data));
        
        data.forEach(post => {
          sessionStorage.setItem(`newsPost_${post.news_id}`, JSON.stringify(post));
        });
        
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
        
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith("newsPost_")) {
            keys.push(key);
          }
        }
        
        keys.forEach(key => {
          try {
            const post = JSON.parse(sessionStorage.getItem(key));
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
          const cached = sessionStorage.getItem("newsPosts");
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
  }, [API_URL, clearNewsCache, fetchWithRetry]);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.warn("Failed to parse user data:", e);
      }
    }

    console.log("Initial news fetch with API URL:", API_URL);
    fetchPosts(true); 
    
    const intervalId = setInterval(() => {
      console.log("Polling for fresh news data");
      fetchPosts();
    }, 30000);
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') === 'true') {
      console.log("Detected refresh parameter, forcing fresh data fetch");
      fetchPosts(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const handleStorageChange = (e) => {
      if (e.key === "newsPostsUpdated") {
        console.log("News posts updated in another tab, refreshing");
        fetchPosts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [API_URL, fetchPosts]);

  const handleRefresh = () => {
    console.log("Manual refresh requested");
    setRetryCount(prevCount => prevCount + 1);
    fetchPosts(true); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      setLoading(true);
      console.log(`Deleting news post ${id}...`);
      
      const res = await fetchWithRetry(`${API_URL}/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete post");
      }

      const updated = newsPosts.filter((p) => p.news_id !== id);
      setNewsPosts(updated);
      
      try {
        clearNewsCache();
        sessionStorage.setItem("newsPosts", JSON.stringify(updated));
        updated.forEach(post => {
          sessionStorage.setItem(`newsPost_${post.news_id}`, JSON.stringify(post));
        });
        
        sessionStorage.setItem("newsPostsUpdated", Date.now().toString());
      } catch (cacheErr) {
        console.warn("Failed to update cache after delete:", cacheErr);
      }
      
      fetchPosts(true);
      
      alert("Post deleted successfully");
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
          <button onClick={handleRefresh}>
            {retryCount >= MAX_RETRIES ? "Try Again" : `Retry (${retryCount}/${MAX_RETRIES})`}
          </button>
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