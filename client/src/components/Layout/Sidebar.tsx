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
import { Dashboard, People, History } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPath?: string;
  userRole?: string;
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  currentPath = "/dashboard",
  userRole = "admin",
}) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
      roles: ["admin", "planner"],
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
    navigate(path);
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const drawerContent = (
    <>
      <Toolbar />
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
