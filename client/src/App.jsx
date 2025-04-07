import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CustomNavbar from "./components/Navbar/navbar";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import RoleOpenings from "./pages/RoleOpening/RoleOpenings";
import NewsSection from "./pages/news/News";
import CreateNewsPost from "./components/news/CreateNewsPost";
import ExternalEvents from "./pages/ExternalEvents";
import CreateExternalEvents from "./pages/CreateExtEvents";
import Footer from "./components/footer/footer";
import ClubDetailsPage from "./pages/ClubDetailsPage"; 
import CreateClub from "./pages/CreateClub"; 
import GDPRPolicy from "./pages/GDPRPolicy";

import { ThemeProvider } from "./ThemeContext"







// Committee Pages
import Dashboard from "./pages/committee/Dashboard";
import BudgetTracker from "./pages/committee/BudgetTracker/BudgetTracker";
import EventExpensesPage from "./pages/committee/BudgetTracker/EventExpenses";
import RegisteredStudentsPage from "./pages/committee/BudgetTracker/RegisteredStudents";
import MultiEventImages from "./pages/committee/ImageManagement"
import SingleEventImages from "./pages/committee/ImageM-SingleEvent";
import EditEventImages from "./pages/committee/ImageM-EditEvent";
// Committee Events Pages
import ViewEvents from "./pages/committee/committee-events/ViewEvents";
import CreateEvent from "./pages/committee/committee-events/CreateEvent";

// Committee Roles Pages
import ViewRoles from "./pages/committee/commitee-Roles/ViewRoles";
import CreateRole from "./pages/committee/commitee-Roles/CreateRole";
import EditRole from "./pages/committee/commitee-Roles/EditRole";
import ApplyRoleOpening from "./pages/RoleOpening/ApplyRoleOpening";
import ViewRoleDetail from "./pages/committee/commitee-Roles/ViewRoleDetail";

import Student from "./components/auth/Student";
import Welcome from "./components/auth/WelcomeModal";
import Login from "./components/auth/Login";
import Verify from "./components/auth/Verify";
import AccountVerified from "./components/auth/AccountVerified";
import CommiteeLogin from "./components/auth/Commit";
import DetailsExt from "./components/externalevents/DetailsExt";
import EditNewsForm from "./components/news/EditNewsPost";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isCommitteePage = location.pathname === "/commiteelogin";
  const isStudentPage = location.pathname === "/student";
  const isLoginPage = location.pathname === "/login";
  const isVerifyPage = location.pathname === "/verify";
  const isAccountVerifyPage = location.pathname == "/accountverified";
  const isWelcomePage = location.pathname == "/welcome"

  return (
    <>
      {!isAuthPage && !isWelcomePage && !isCommitteePage && !isAccountVerifyPage && !isStudentPage && !isLoginPage && !isVerifyPage && <CustomNavbar />} {/* Hide Navbar on Auth Page */}
      <div className="main-content">
        <Routes>
          {/* Default route should be Home */}
          <Route path="/" element={<Home />} />
          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Public Routes */}
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/club-details" element={<ClubDetailsPage />} />
          <Route path="/create-club" element={<CreateClub />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event-details" element={<EventDetails />} />
          <Route path="/roles" element={<RoleOpenings />} />
          <Route path="/roles/apply/:index" element={<ApplyRoleOpening />} />
          <Route path="/external-events" element={<ExternalEvents />} />
          <Route path="/create-external-event" element={<CreateExternalEvents />} />
		  <Route path="/external-events/:id" element={<DetailsExt />} />
          {/* news routes */}
          <Route path="/news" element={<NewsSection />} />
          <Route path="/news/create-news-post" element={<CreateNewsPost />} />
          <Route path="/news/edit/:id" element={<EditNewsForm />} /> {/* Add this route */}
          <Route path="/gdpr-policy" element={<GDPRPolicy />} />

          {/* Committee Routes */}
          <Route path="/committee/dashboard" element={<Dashboard />} />
          <Route path="/committee/budget-tracker" element={<BudgetTracker />} />
          <Route path="/committee/image-management" element={<MultiEventImages />} />
          <Route path="/committee/image-management-single" element={<SingleEventImages />} />
          <Route path="/committee/image-management-edit" element={<EditEventImages />} />   
          <Route path="/committee/budget-tracker/registered-students" element={<RegisteredStudentsPage />} />

          {/* Committee Events Routes */}
          <Route path="/committee/events" element={<ViewEvents />} />
          <Route path="/committee/events/create" element={<CreateEvent />} />
          <Route path="/committee/budget-tracker/event-expenses" element={<EventExpensesPage />} />


          {/* Committee Roles Routes */}
          <Route path="/committee/roles" element={<ViewRoles />} />
          <Route path="/committee/roles/create" element={<CreateRole />} />
          <Route path="/committee/roles/edit/:id" element={<EditRole />} />
          <Route path="/committee/roles/view/:id" element={<ViewRoleDetail />} />

          {/* Student Route */}
          <Route path="/student" element={<Student />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/accountverified" element={<AccountVerified />} />
          <Route path="/commiteelogin" element={<CommiteeLogin />} />
        </Routes>
      </div>
      {!isAuthPage && !isWelcomePage && !isCommitteePage && !isAccountVerifyPage && !isStudentPage && !isLoginPage && !isVerifyPage && <Footer />} {/* Hide Footer on Auth Page */}
    </>
  );
}

function App() {
  return (
    // <Router>
    //   <AppContent />
    // </Router>
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
