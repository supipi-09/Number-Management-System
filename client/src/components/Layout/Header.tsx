import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, Notifications, Logout } from "@mui/icons-material";

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  userName = "Admin User",
  userRole = "Administrator",
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "primary.main",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2, display: { sm: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Number Management System
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ textAlign: "right", mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {userRole}
              </Typography>
            </Box>

            <IconButton size="large" onClick={handleMenu} color="inherit">
              <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.dark" }}>
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
