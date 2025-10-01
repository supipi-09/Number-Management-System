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
<<<<<<< HEAD
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
=======
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
<<<<<<< HEAD
    if (onLogout) {
      onLogout();
    }
=======
    logout();
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
    handleClose();
  };

  return (
<<<<<<< HEAD
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "primary.main",
      }}
    >
=======
    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
<<<<<<< HEAD
          sx={{ mr: 2, display: { sm: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

=======
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Number Management System
        </Typography>

<<<<<<< HEAD
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
=======
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
<<<<<<< HEAD

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
=======
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {user?.role === 'admin' ? 'Administrator' : 'Planner'}
              </Typography>
            </Box>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>
<<<<<<< HEAD
                <Logout sx={{ mr: 1, fontSize: 20 }} />
=======
                <Logout sx={{ mr: 1 }} />
>>>>>>> fb23e715b509993ed282cf6b437a5f5fb642f511
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
