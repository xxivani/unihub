import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/Navbar/navbar";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import RoleOpenings from "./pages/RoleOpenings";
import ExternalEvents from "./pages/ExternalEvents";
import Footer from "./components/footer/footer";

// Committee Pages
import Dashboard from "./pages/committee/Dashboard";
import BudgetTracker from "./pages/committee/BudgetTracker";  // Fixed path
import CommitteeCalendar from "./pages/committee/CommitteeCalendar";

// Committee Events Pages
import ViewEvents from "./pages/committee/committee-events/ViewEvents";
import CreateEvent from "./pages/committee/committee-events/CreateEvent";
import EditEvent from "./pages/committee/committee-events/EditEvent";

// Committee Roles Pages
import ViewRoles from "./pages/committee/commitee-Roles/ViewRoles";
import CreateRole from "./pages/committee/commitee-Roles/CreateRole";
import EditRole from "./pages/committee/commitee-Roles/EditRole";

function App() {
  return (
    <Router>
      <CustomNavbar />
      <div className="main-content">
        <Routes>
      
          <Route path="/" element={<Home />} />

          {/* Public Routes */}
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/roles" element={<RoleOpenings />} />
          <Route path="/external-events" element={<ExternalEvents />} />

          {/* Committee Routes */}
          <Route path="/committee/dashboard" element={<Dashboard />} />
          <Route path="/committee/budget-tracker" element={<BudgetTracker />} />
          <Route path="/committee/calendar" element={<CommitteeCalendar />} />

          {/* Committee Events Routes */}
          <Route path="/committee/events" element={<ViewEvents />} />
          <Route path="/committee/events/create" element={<CreateEvent />} />
          <Route path="/committee/events/edit/:id" element={<EditEvent />} />

          {/* Committee Roles Routes */}
          <Route path="/committee/roles" element={<ViewRoles />} />
          <Route path="/committee/roles/create" element={<CreateRole />} />
          <Route path="/committee/roles/edit/:id" element={<EditRole />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
