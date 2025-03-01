import "./news.css"

const NewsSection = () => {
    const newsItems = [
        {
          title: "Newsletter Week 6",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
          image: "https://picsum.photos/200/150",          newsletterLink: "#",
        },
        {
          title: "Newsletter Week 6",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
          image: "https://picsum.photos/200/150",          newsletterLink: "#",
        },
        {
          title: "Newsletter Week 6",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum est sodales quam consectetur feugiat. Vivamus posuere non augue non finibus. Pellentesque nec rutrum libero. Curabitur fringilla, metus placerat aliquet posuere, ante libero ullamcorper justo, quis placerat ante nisl eu risus. Suspendisse eu ipsum ac eros vehicula auctor.",
          image: "https://picsum.photos/200/150",
          newsletterLink: "#",
        },
      ];
    
      return (
        <section className="latest-news">
          <h2>Latest News</h2>
          
          <div className="news-list">
            {newsItems.map((news, index) => (
              <div className="news-item" key={index}>
           

                <div className="news-info">
                <img src={news.image} alt={news.title} className="news-image" />

                <div className="news-td">
                  <h3>{news.title}</h3>
                  <p>{news.description}</p>
                  </div>
                  <div className="buttons">
                    <a href={news.newsletterLink} className="view-newsletter">View Newsletter</a>
                    <a href={news.newsletterLink} className="download-newsletter">Download Newsletter</a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      );
    };
    

export default NewsSection;
