import "./footer.css";

const Footer = () => {
  return (
    <div className="Footer-container">
      <div className="Unihub-text-container">
        <h1 className="UniHub-text">UniHub</h1>
      </div>
      <div className="text-containers">
        <div className="text-container-1">
          <h1 className="heading">Our team</h1>
          <a href="/about" className="normal-text">About us</a>
          <a href="/gdpr-policy" className="normal-text">Our GDPR Policy</a>
          <a href="/feedback" className="normal-text">Give us feedback!</a>
          <a href="/contact" className="normal-text">Contact us</a>
        </div>

        <div className="text-container-2">
          <h1 className="heading">Connect</h1>
          <a href="https://instagram.com" className="normal-text" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com" className="normal-text" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" className="normal-text" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com" className="normal-text" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
