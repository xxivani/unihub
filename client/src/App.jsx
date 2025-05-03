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
import { ThemeProvider } from "./ThemeContext";

import AccountSettingsPage from "./pages/settings/AccountSettingsPage";
import Followed from "./components/settings/followed";
import UserPreferences from "./components/settings/userPreferences";

import Dashboard from "./pages/committee/Dashboard";
import BudgetTracker from "./pages/committee/BudgetTracker/BudgetTracker";
import EventExpensesPage from "./pages/committee/BudgetTracker/EventExpenses";
import MultiEventImages from "./pages/committee/ImageManagement";
import SingleEventImages from "./pages/committee/ImageM-SingleEvent";
import EditEventImages from "./pages/committee/ImageM-EditEvent";

import ViewEvents from "./pages/committee/committee-events/ViewEvents";
import CreateEvent from "./pages/committee/committee-events/CreateEvent";

import ViewRoles from "./pages/committee/commitee-Roles/ViewRoles";
import CreateRole from "./pages/committee/commitee-Roles/CreateRole";
import EditRole from "./pages/committee/commitee-Roles/EditRole";
import ApplyRoleOpening from "./pages/RoleOpening/ApplyRoleOpening";
import ViewRoleDetail from "./pages/committee/commitee-Roles/ViewRoleDetail";

import Student from "./components/auth/Student";
// import Welcome from "./components/auth/WelcomeModal";
import Login from "./components/auth/Login";
// import Verify from "./components/auth/Verify";
// import AccountVerified from "./components/auth/AccountVerified";
// import CommiteeLogin from "./components/auth/Commit";
import DetailsExt from "./components/externalevents/DetailsExt";
import EditNewsForm from "./components/news/EditNewsPost";

import ProtectedRoute from "./utils/ProtectedRoute";
import { useEffect } from "react";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isCommitteePage = location.pathname === "/commiteelogin";
  const isStudentPage = location.pathname === "/student";
  const isLoginPage = location.pathname === "/login";
  const isVerifyPage = location.pathname === "/verify";
  const isAccountVerifyPage = location.pathname === "/accountverified";
  const isWelcomePage = location.pathname === "/welcome";

  // Apply stored font size when app loads
  useEffect(() => {
    const storedFontSize = sessionStorage.getItem('fontSize');
    if (storedFontSize) {
      document.documentElement.style.setProperty('--base-font-size', `${storedFontSize}px`);
    }
  }, []);

  return (
    <>
      {!isAuthPage && !isWelcomePage && !isCommitteePage && !isAccountVerifyPage && !isStudentPage && !isLoginPage && !isVerifyPage && <CustomNavbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/followed"
            element={
              <ProtectedRoute>
                <Followed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/preferences"
            element={
              <ProtectedRoute>
                <UserPreferences />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/club-details/:id" element={<ClubDetailsPage />} />
          {/* <Route path="/create-club" element={<CreateClub />} /> */}
          <Route path="/events" element={<Events />} />
          <Route path="/event-details" element={<EventDetails />} />
          <Route path="/roles" element={<RoleOpenings />} />
          <Route path="/roles/apply/:index" element={<ApplyRoleOpening />} />
          <Route path="/external-events" element={<ExternalEvents />} />
          {/* <Route path="/create-external-event" element={<CreateExternalEvents />} /> */}
          <Route path="/external-events/:id" element={<DetailsExt />} />

          {/* News Routes */}
          <Route path="/news" element={<NewsSection />} />
          <Route
            path="/news/create-news-post"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateNewsPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/news/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EditNewsForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-club"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateClub />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-external-event"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateExternalEvents />
              </ProtectedRoute>
            }
          />

          <Route path="/gdpr-policy" element={<GDPRPolicy />} />

          {/* Protected Committee Routes */}
          <Route
            path="/committee/dashboard"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/budget-tracker"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <BudgetTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/image-management"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <MultiEventImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/image-management-single"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <SingleEventImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/image-management-edit"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <EditEventImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/budget-tracker/event-expenses"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <EventExpensesPage />
              </ProtectedRoute>
            }
          />

          {/* Committee Events */}
          <Route
            path="/committee/events"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <ViewEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/events/create"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          {/* Committee Roles */}
          <Route
            path="/committee/roles"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <ViewRoles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/roles/create"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <CreateRole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/roles/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <EditRole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/committee/roles/view/:id"
            element={
              <ProtectedRoute allowedRoles={["committee", "admin"]}>
                <ViewRoleDetail />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/student" element={<Student />} />
          {/* <Route path="/welcome" element={<Welcome />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/verify" element={<Verify />} /> */}
          {/* <Route path="/accountverified" element={<AccountVerified />} /> */}
          {/* <Route path="/commiteelogin" element={<CommiteeLogin />} /> */}
        </Routes>
      </div>
      {!isAuthPage && !isWelcomePage && !isCommitteePage && !isAccountVerifyPage && !isStudentPage && !isLoginPage && !isVerifyPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;