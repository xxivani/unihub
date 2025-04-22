import { useEffect, useState } from "react";

const Aboutus = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isMobile = windowWidth <= 768;
  
  const aboutusStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    width: "100%",
    marginTop: isMobile ? "150px" : "300px",
  };

  const aboutusCardStyle = {
    backgroundColor: "#d9cdbe",
    width: "100%",
    minHeight: isMobile ? "auto" : "500px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "20px" : "40px",
  };

  const aboutusTextWholeStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
    alignSelf: isMobile ? "center" : "flex-start",
    marginLeft: isMobile ? "0" : "60px",
  };

  const aboutusTextStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#1D2130",
    textAlign: "left",
  };

  const aboutusTextContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: isMobile ? "30px 20px" : "150px",
  };

  const aboutusHeadingStyle = {
    fontSize: isMobile ? "28px" : "40px",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: isMobile ? "30px" : "80px",
  };

  const textStyle = {
    fontSize: "16px",
    lineHeight: 1.6,
    marginTop: "20px",
  };

  const imgStyle = {
    width: isMobile ? "100%" : "400px",
    height: isMobile ? "300px" : "504px",
    backgroundImage: 'url("/assets/images/img.jpeg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    order: isMobile ? -1 : 0,
  };

  return (
    <div style={aboutusStyle}>
      <div style={aboutusTextWholeStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isMobile ? "50" : "72"}
          height="6"
          viewBox="0 0 72 6"
          fill="none"
        >
          <path d="M0 2.99976H72" stroke="#1D2130" strokeWidth="5" />
        </svg>
        <h1 style={aboutusTextStyle}>ABOUT US</h1>
      </div>
      <div style={aboutusCardStyle}>
        <div style={aboutusTextContainerStyle}>
          <h1 style={aboutusHeadingStyle}>heading</h1>
          <p style={textStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            ipsum dolor, placerat vitae massa a, bibendum tempus velit. Duis
            leo dui, euismod ut nisi sodales, ultricies hendrerit justo. Etiam
            semper facilisis tortor, eget varius lacus commodo ut. Aliquam
            bibendum sit amet odio at tristique. Nam felis augue, mollis in
            dolor vitae, malesuada vehicula ante. Phasellus semper enim eget mi
            iaculis, eget convallis ipsum dignissim.
          </p>
        </div>
        <div style={imgStyle}></div>
      </div>
    </div>
  );
};

export default Aboutus;