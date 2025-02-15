
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar/navbar";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import RoleOpenings from "./pages/RoleOpenings";
import ExternalEvents from "./pages/ExternalEvents";

function App() {
  return (
    <Router>
      <CustomNavbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/roles" element={<RoleOpenings />} />
          <Route path="/external-events" element={<ExternalEvents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
