import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import AddPlannerPage from "./components/AddPlanner/AddPlannerPage";
import NumberLog from "./components/NumberLog/NumberLog";
import LoginPage from "./components/Auth/LoginPage";
<<<<<<< HEAD
=======
import DashboardPage from "./components/Dashboard/DashboardPage";
import AddPlannerPage from "./components/AddPlanner/AddPlannerPage";
import NumberLogPage from "./components/NumberLog/NumberLogPage";
import ProtectedRoute from "./components/ProtectedRoute";
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

<<<<<<< HEAD
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState("/dashboard");
  const [user, setUser] = useState({ name: "Admin User", role: "admin" });

  const handleLogin = async (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setUser({ name: "Admin User", role: "admin" });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ name: "", role: "" });
    setCurrentPath("/dashboard");
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };
=======
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </Box>
    );
  }
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
<<<<<<< HEAD
    <ThemeProvider theme={theme}>
      <MainLayout
        currentPath={currentPath}
        onNavigate={handleNavigate}
        userName={user.name}
        userRole={user.role}
        onLogout={handleLogout}
      >
        {currentPath === "/dashboard" && <Dashboard />}
        {currentPath === "/add-planner" && <AddPlannerPage />}
        {currentPath === "/number-log" && <NumberLog />}
      </MainLayout>
    </ThemeProvider>
=======
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
            path="/add-planner"
            element={
              <ProtectedRoute requireAdmin>
                <AddPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/number-log"
            element={
              <ProtectedRoute>
                <NumberLogPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
  );
};

export default App;
