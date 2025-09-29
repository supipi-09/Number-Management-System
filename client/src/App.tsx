import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Components
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import LoginPage from "./components/Auth/LoginPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import UserManagementPage from "./components/Users/UserManagementPage";
import NumberManagementPage from "./components/Numbers/NumberManagementPage";
import ActivityLogsPage from "./components/Logs/ActivityLogsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{ flex: 1, bgcolor: "background.default" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/numbers"
            element={
              <ProtectedRoute>
                <NumberManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <ActivityLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute requireAdmin>
                <div style={{ padding: "2rem" }}>Data Import - Coming Soon</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
