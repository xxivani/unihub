import "./LatestNews.css";
import { Link } from "react-router-dom";

function LatestNews() {
  return (
    <div className="latest-news-section">
      <div className="latest-news-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="6" viewBox="0 0 72 6" fill="none">
          <path d="M0 2.99976H72" stroke="#FFF" strokeWidth="5"/>
        </svg>
        <h2 className="latest-news-title">LATEST NEWS</h2>
      </div>

      <div className="latest-news-container">
        {[1, 2].map((news, index) => (
          <div className="latest-news-card" key={index}>
            <img src="assets/images/news-img.jpeg" alt="News" className="latest-news-img" />
            <div className="latest-news-content">
              <Link to={`/news/${index}`} className="latest-news-heading">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Link>
              <p className="latest-news-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et porttitor nunc, nec pellentesque lectus. 
                Phasellus ut vestibulum erat. Nulla et sapien ut tortor condimentum feugiat pharetra et odio.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="latest-news-button-container">
        <Link to="/news" className="latest-news-button">VIEW ALL NEWS</Link>
      </div>
    </div>
  );
}

export default LatestNews;
