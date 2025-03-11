import "./news.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NewsSection = () => {
  const [user, setUser] = useState(null);
  const [newsPosts] = useState([
    {
      id: 1,
      title: "Newsletter Week 6",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      image: "https://picsum.photos/200/150?random=1",
      newsletterLink: "#",
    },
    {
      id: 2,
      title: "Newsletter Week 6",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      image: "https://picsum.photos/200/150?random=2",
      newsletterLink: "#",
    },
    {
      id: 3,
      title: "Newsletter Week 6",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
      image: "https://picsum.photos/200/150?random=3",
      newsletterLink: "#",
    },
  ]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

      <div className="news-list">
        {newsPosts.length > 0 ? (
          newsPosts.map((news) => (
            <div className="news-item" key={news.id}>
              <div className="news-info">
                <img
                  src={news.image}
                  alt={news.title}
                  className="news-image"
                />
                <div className="news-td">
                  <h3>{news.title}</h3>
                  <p>{news.description}</p>
                </div>
                <div className="buttons">
                  <a
                    href={news.newsletterLink}
                    className="view-newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Newsletter
                  </a>
                  <a
                    href={news.newsletterLink}
                    className="download-newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Newsletter
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No news posts found.</p>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
