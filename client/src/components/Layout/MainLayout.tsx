import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header
        onMenuClick={handleDrawerToggle}
        userName={user?.username || "User"}
        userRole={user?.role === "admin" ? "Administrator" : "Planner"}
        onLogout={logout}
      />
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        currentPath={location.pathname}
        userRole={user?.role || "planner"}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          bgcolor: "grey.50",
          ml: { xs: 0, md: "280px" },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
