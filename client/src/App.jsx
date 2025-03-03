import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CustomNavbar from "./components/Navbar/navbar";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import RoleOpenings from "./pages/RoleOpening/RoleOpenings";
import NewsSection from "./pages/News";
import ExternalEvents from "./pages/ExternalEvents";
import Footer from "./components/footer/footer";

// Committee Pages
import Dashboard from "./pages/committee/Dashboard";
import BudgetTracker from "./pages/committee/BudgetTracker";
import CommitteeCalendar from "./pages/committee/CommitteeCalendar";

// Committee Events Pages
import ViewEvents from "./pages/committee/committee-events/ViewEvents";
import CreateEvent from "./pages/committee/committee-events/CreateEvent";
import EditEvent from "./pages/committee/committee-events/EditEvent";

// Committee Roles Pages
import ViewRoles from "./pages/committee/commitee-Roles/ViewRoles";
import CreateRole from "./pages/committee/commitee-Roles/CreateRole";
import EditRole from "./pages/committee/commitee-Roles/EditRole";
import ApplyRoleOpening from "./pages/RoleOpening/ApplyRoleOpening";

import Student from "./components/auth/Student";
import Login from "./components/auth/Login";
import Verify from "./components/auth/Verify";
import AccountVerified from "./components/auth/AccountVerified";
import CommiteeLogin from "./components/auth/Commit";
import DetailsExt from "./components/externalevents/DetailsExt";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isStudentPage = location.pathname === "/student";
  const isLoginPage = location.pathname === "/login";
  const isVerifyPage = location.pathname === "/verify";
  const isAccountVerifyPage = location.pathname == "/accountverified"

  return (
    <>
      {!isAuthPage &&  !isAccountVerifyPage && !isStudentPage && !isLoginPage && !isVerifyPage && <CustomNavbar />} {/* Hide Navbar on Auth Page */}
      <div className="main-content">
        <Routes>
          {/* Default route should be Home */}
          <Route path="/" element={<Home />} />

          {/* Public Routes */}
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/roles" element={<RoleOpenings />} />
          <Route path="/roles/apply/:index" element={<ApplyRoleOpening />} />
          <Route path="/external-events" element={<ExternalEvents />} />
          <Route path="/details-ext" element={<DetailsExt />} />
          <Route path="/news" element={<NewsSection />} />


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
          {/* <Route path="/committee/roles/view/:id" element={<ViewRoleDetail />} /> */}

          {/* Student Route */}
          <Route path="/student" element={<Student />} /> {/* Add the new route for the Student page */}
          <Route path="/login" element={<Login />} /> {/* Add the new route for the Student page */}
          <Route path="/verify" element={<Verify />} />
          <Route path="/accountverified" element={<AccountVerified />} />
          <Route path="/commiteelogin" element={<CommiteeLogin />} />
        </Routes>
      </div>
      {!isAuthPage && !isAccountVerifyPage && !isStudentPage && !isLoginPage && !isVerifyPage && <Footer />} {/* Hide Footer on Auth Page */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
