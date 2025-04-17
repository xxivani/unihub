import "./news.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NewsSection = () => {
  const [user, setUser] = useState(null);
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  // fallback data
  const sampleNewsPosts = [
    {
      news_id: 1,
      news_title: "Newsletter Week 6",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=1",
      news_pdf_url: "#",
    },
    {
      news_id: 2,
      news_title: "Newsletter Week 5",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=2",
      news_pdf_url: "#",
    },
    {
      news_id: 3,
      news_title: "Newsletter Week 4",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=3",
      news_pdf_url: "#",
    },
    {
      news_id: 4,
      news_title: "Newsletter Week 3",
      news_content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      news_thumbnail_url: "https://picsum.photos/200/150?random=4",
      news_pdf_url: "#",
    },
  ];


const apiUrl = import.meta.env.VITE_API_URL || 
               (window.location.hostname === 'localhost' ? 
                 `http://localhost:${import.meta.env.VITE_DEV_PORT || '8080'}/api` :
                 `https://${window.location.hostname}/api`);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this news post? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/news/${postId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNewsPosts(prevPosts => prevPosts.filter(post => (post.news_id || post.id) !== postId));
        alert("News post deleted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(`Error: ${err.message}`);
    }
  };
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const fetchNewsPosts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/news`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news posts');
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          setNewsPosts(data);
        } else {
          console.log("No news posts found in API response, using sample data");
          setNewsPosts(sampleNewsPosts);
        }
      } catch (err) {
        console.error("Error fetching news posts:", err);
        setNewsPosts(sampleNewsPosts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = newsPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(newsPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <section className="latest-news">
      <div className="title-button">
        <h2>Latest News</h2>
      </div>
      <p>Loading news posts...</p>
    </section>
  );

  return (
    <section className="latest-news">
      <div className="title-button">
        <h2>Latest News</h2>
        {user && user.role === "admin" && (
          <Link to="/news/create-news-post">
            <button className="create-news-button">Create News Post</button>
          </Link>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="news-list">
        {currentPosts.length > 0 ? (
          currentPosts.map((news) => (
            <div className="news-item" key={news.news_id || news.id}>
            <div className="news-info">
                <div className="news-image-container">
                <img
                  src={
                    news.news_thumbnail_url && news.news_thumbnail_url.startsWith('/uploads') 
                      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${news.news_thumbnail_url}`
                      : news.news_thumbnail_url || news.image || "https://picsum.photos/200/150?random=1"
                  }
                  alt={news.news_title || news.title}
                  className="news-image"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/200/150?random=1"; 
                    e.target.onerror = null;
                  }}
                />
                </div>
                <div className="news-td">
                  <h3>{news.news_title || news.title}</h3>
                  <p>{news.news_content || news.description}</p>
                  {news.news_author && news.news_author.toLowerCase() !== "admin" && (
                    <p className="news-author">By: {news.news_author}</p>
                  )}
                  {news.news_created_at && news.news_author && news.news_author.toLowerCase() !== "admin" && (
                    <p className="news-date">
                      {new Date(news.news_created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="buttons">
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${news.news_pdf_url}`}
                    className="view-newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Newsletter
                  </a>
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${news.news_pdf_url}`}
                    className="download-newsletter"
                    download
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Download Newsletter
                  </a>
                  {user && user.role === "admin" && (
                    <div className="admin-actions">
                      <Link to={`/news/edit/${news.news_id || news.id}`} className="edit-news-link">
                        Edit Post
                      </Link>
                      <a 
                        href="#" 
                        className="delete-news-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeletePost(news.news_id || news.id);
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
          <p>No news posts found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &laquo; Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
              >
                {number + 1}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsSection;