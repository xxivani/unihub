import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar/navbar";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import RoleOpenings from "./pages/RoleOpenings";
import ExternalEvents from "./pages/ExternalEvents";
import Footer from "./components/footer/footer";

import CommitteeEvents from "./pages/committee/CommiteeEvents";
import Dashboard from "./pages/committee/Dashboard";
import CommitteeCalendar from "./pages/committee/CommiteeCalender";
import BudgetTracker from "./pages/committee/Budget-Tracker";
import CommitteeRoles from "./pages/committee/Commitee-Role-openings";

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
          {/* Committee Routes */}
        <Route path="/committee/dashboard" element={<Dashboard />} />
        <Route path="/committee/Events" element={<CommitteeEvents />} />
        <Route path="/committee/roles" element={<CommitteeRoles />} />
        <Route path="/committee/budget-tracker" element={<BudgetTracker />} />
        <Route path="/committee/calendar" element={<CommitteeCalendar />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}


export default App;
