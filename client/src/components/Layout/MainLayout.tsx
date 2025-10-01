import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPath = "/dashboard",
  onNavigate,
  userName = "Admin User",
  userRole = "admin",
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header
        onMenuClick={handleDrawerToggle}
        userName={userName}
        userRole={userRole === "admin" ? "Administrator" : "Planner"}
        onLogout={onLogout}
      />
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        currentPath={currentPath}
        onNavigate={onNavigate}
        userRole={userRole}
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
