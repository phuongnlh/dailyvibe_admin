import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./components/Load/LoadingScreen";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import AdsManagement from "./pages/AdsManagement";
import Analytics from "./pages/Analytics";
import CommentsManagement from "./pages/CommentsManagement";
import GroupManagement from "./pages/GroupManagement";
import Dashboard from "./pages/Home.admin";
import PostsManagement from "./pages/PostsManagement";
import ReportsManagement from "./pages/ReportsManagement";
import UsersManagement from "./pages/UsersManagement";
import PrivateAdminRoute from "./router/PrivateAdminRoute";
import PublicAdminRoute from "./router/PublicAdminRoute";

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
            path="/groups"
            element={
              <PrivateAdminRoute>
                <GroupManagement />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/ads"
            element={
              <PrivateAdminRoute>
                <AdsManagement />
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
      <ThemeProvider>{loading ? <LoadingScreen isFading={fade} /> : <AppContent />}</ThemeProvider>
    </AppProvider>
  );
}

export default App;
