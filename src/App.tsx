import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicAdminRoute from "./router/PublicAdminRoute";
import AdminLogin from "./pages/AdminLogin";
import PrivateAdminRoute from "./router/PrivateAdminRoute";
import Dashboard from "./pages/Home.admin";
import Analytics from "./pages/Analytics";
import UsersManagement from "./pages/UsersManagement";
import PostsManagement from "./pages/PostsManagement";
import MediaManagement from "./pages/MediaManagement";
import CommentsManagement from "./pages/CommentsManagement";
import ReportsManagement from "./pages/ReportsManagement";
import ModerationManagement from "./pages/ModerationManagement";
import VerificationManagement from "./pages/VerificationManagement";
import AdminSettings from "./pages/AdminSettings";
import LoadingScreen from "./components/Load/LoadingScreen";

function AppContent() {
  return (
    <div className="h-full bg-gradient-to-br from-[#431c66] to-[#a83279]">
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicAdminRoute>
                <AdminLogin />
              </PublicAdminRoute>
            }
          />
          {/* Dashboard */}
          <Route
            path="/"
            element={
              <PrivateAdminRoute>
                <Dashboard />
              </PrivateAdminRoute>
            }
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={
              <PrivateAdminRoute>
                <Analytics />
              </PrivateAdminRoute>
            }
          />

          {/* User Management */}
          <Route
            path="/users"
            element={
              <PrivateAdminRoute>
                <UsersManagement />
              </PrivateAdminRoute>
            }
          />

          {/* Content Management */}
          <Route
            path="/posts"
            element={
              <PrivateAdminRoute>
                <PostsManagement />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/media"
            element={
              <PrivateAdminRoute>
                <MediaManagement />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/comments"
            element={
              <PrivateAdminRoute>
                <CommentsManagement />
              </PrivateAdminRoute>
            }
          />

          {/* Moderation */}
          <Route
            path="/reports"
            element={
              <PrivateAdminRoute>
                <ReportsManagement />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/moderation"
            element={
              <PrivateAdminRoute>
                <ModerationManagement />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <PrivateAdminRoute>
                <VerificationManagement />
              </PrivateAdminRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <PrivateAdminRoute>
                <AdminSettings />
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => setLoading(false), 1000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      <ThemeProvider>
        {loading ? <LoadingScreen isFading={fade} /> : <AppContent />}
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
