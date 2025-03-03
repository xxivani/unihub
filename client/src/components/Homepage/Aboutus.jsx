
const aboutusStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "auto",
  width: "100%",
  marginTop: "300px",
};

const aboutusCardStyle = {
  backgroundColor: "#d9cdbe",
  width: "100%",
  minHeight: "500px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "40px",
};

const aboutusTextWholeStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "10px",
  alignSelf: "flex-start",
  marginLeft: "60px",
};

const aboutusTextStyle = {
  fontSize: "1.8rem",
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
  padding: "150px",
};

const aboutusHeadingStyle = {
  fontSize: "40px",
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: "80px",
};

const textStyle = {
  fontSize: "16px",
  lineHeight: 1.6,
  marginTop: "20px",
};

const imgStyle = {
  width: "400px",
  height: "504px",
  backgroundImage: 'url("/assets/images/img.jpeg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const Aboutus = () => {
  return (
    <div style={aboutusStyle}>
      <div style={aboutusTextWholeStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
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
