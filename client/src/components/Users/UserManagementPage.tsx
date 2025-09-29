<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
=======
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
<<<<<<< HEAD
=======
  Button,
  Box,
  Chip,
  IconButton,
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
<<<<<<< HEAD
  Chip,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { usersAPI } from "../../services/api";
import { User } from "../../types";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "planner" as "admin" | "planner",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);
=======
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../services/api';
import { User } from '../../types';

const UserManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'number_manager',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
<<<<<<< HEAD
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
=======
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      setError('Failed to fetch users');
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleCreateUser = async () => {
    try {
      setSubmitting(true);
      setError("");

      // Validate form
      if (!formData.username || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      await usersAPI.createUser(formData);

      setSuccess("User created successfully!");
      setCreateDialogOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "planner",
      });
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await usersAPI.deleteUser(userId);
      setSuccess("User deleted successfully!");
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "error" : "primary";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user || user.role !== "admin") {
    return (
      <Container>
        <Alert severity="error">
          You don't have permission to access this page.
=======
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const response = await usersAPI.createUser(formData);
      if (response.success) {
        setAddDialogOpen(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'number_manager',
        });
        fetchUsers();
      } else {
        setFormError(response.message || 'Failed to create user');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
        </Alert>
      </Container>
    );
  }

  return (
<<<<<<< HEAD
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            User Management
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Planner
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
=======
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAddDialogOpen(true)}
          size="large"
        >
          Add Planner
        </Button>
      </Box>

      {/* User Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {users.filter(u => u.role === 'admin').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrators
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {users.filter(u => u.role === 'number_manager').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Planners
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {users.filter(u => u.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
<<<<<<< HEAD
                  <TableCell colSpan={7} align="center">
=======
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
<<<<<<< HEAD
                  <TableCell colSpan={7} align="center">
                    No users found
=======
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No users found
                    </Typography>
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
<<<<<<< HEAD
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
=======
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? 'Administrator' : 'Planner'}
                        color={user.role === 'admin' ? 'primary' : 'secondary'}
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
<<<<<<< HEAD
                        label={user.isActive ? "Active" : "Inactive"}
                        color={user.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === "admin"}
                        title={
                          user.role === "admin"
                            ? "Cannot delete admin users"
                            : "Delete user"
                        }
                      >
                        <DeleteIcon />
=======
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <Edit />
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

<<<<<<< HEAD
      {/* Create User Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Planner</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={(e) => handleFormChange("username", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => handleFormChange("email", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={(e) => handleFormChange("password", e.target.value)}
            sx={{ mb: 2 }}
            helperText="Password must be at least 6 characters long"
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => handleFormChange("role", e.target.value)}
            >
              <MenuItem value="planner">Planner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : "Create User"}
          </Button>
        </DialogActions>
=======
      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddUser}>
          <DialogTitle>Add New Planner</DialogTitle>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={formLoading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth disabled={formLoading}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <MenuItem value="number_manager">Planner</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formLoading || !formData.username || !formData.email || !formData.password}
            >
              {formLoading ? <CircularProgress size={20} /> : 'Add User'}
            </Button>
          </DialogActions>
        </form>
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
      </Dialog>
    </Container>
  );
};

<<<<<<< HEAD
export default UserManagementPage;
=======
export default UserManagementPage;
>>>>>>> b4bbeecb2f30e49c4bf086559200a2affd4935d7
