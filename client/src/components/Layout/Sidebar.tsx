import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Toolbar,
} from "@mui/material";
<<<<<<< HEAD
import { Dashboard, People, History } from "@mui/icons-material";
=======
import {
  Dashboard,
  People,
  History,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  userRole?: string;
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  currentPath = "/dashboard",
  onNavigate,
  userRole = "admin",
}) => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
<<<<<<< HEAD
      roles: ["admin", "planner"],
=======
      roles: ["admin", "planner"], 
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
    },
    {
      text: "Add Planner",
      icon: <People />,
      path: "/add-planner",
      roles: ["admin"],
    },
    {
      text: "Number Log",
      icon: <History />,
      path: "/number-log",
      roles: ["admin", "planner"],
    },
  ];

  const handleItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
<<<<<<< HEAD
    item.roles.includes(userRole)
=======
    item.roles.includes(user?.role || "planner")
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
  );

  const drawerContent = (
    <>
      <Toolbar />
<<<<<<< HEAD
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            Navigation
          </Typography>
        </Box>
        <Divider />
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={currentPath === item.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                    "&:hover": { backgroundColor: "primary.dark" },
=======
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Navigation
        </Typography>
      </Box>
      <Divider />

      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                  "&:hover": {
                    backgroundColor: "primary.dark",
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
