import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import AddPlannerPage from "./components/AddPlanner/AddPlannerPage";
import NumberLog from "./components/NumberLog/NumberLog";
import LoginPage from "./components/Auth/LoginPage";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

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

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
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
  );
};

export default App;
