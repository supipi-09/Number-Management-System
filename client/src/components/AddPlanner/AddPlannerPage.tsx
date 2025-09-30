import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Email,
  Phone,
} from "@mui/icons-material";
import { usersAPI } from "../../services/api";
import { User } from "../../types";

const AddPlannerPage: React.FC = () => {
  const [planners, setPlanners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlanner, setEditingPlanner] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "planner" as const,
  });

  useEffect(() => {
    fetchPlanners();
  }, []);

  const fetchPlanners = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      if (response.success && response.data) {
        // Filter only planners
        const plannersOnly = response.data.filter(user => user.role === 'planner');
        setPlanners(plannersOnly);
      }
    } catch (err) {
      setError("Failed to fetch planners");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingPlanner) {
        const response = await usersAPI.updateUser(editingPlanner._id, {
          username: formData.username,
          email: formData.email,
        });
        if (response.success) {
          setSuccess("Planner updated successfully");
          fetchPlanners();
        }
      } else {
        const response = await usersAPI.createUser(formData);
        if (response.success) {
          setSuccess("Planner created successfully");
          fetchPlanners();
        }
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save planner");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this planner?")) {
      try {
        const response = await usersAPI.deleteUser(id);
        if (response.success) {
          setSuccess("Planner deleted successfully");
          fetchPlanners();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete planner");
      }
    }
  };

  const handleEdit = (planner: User) => {
    setEditingPlanner(planner);
    setFormData({
      username: planner.username,
      email: planner.email,
      password: "",
      role: "planner",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlanner(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "planner",
    });
  };

  const filteredPlanners = planners.filter(
    (planner) =>
      planner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Planner Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Add New Planner
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search planners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPlanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No planners found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlanners.map((planner) => (
                  <TableRow key={planner._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Person />
                        {planner.username}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Email />
                        {planner.email}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={planner.isActive ? "Active" : "Inactive"}
                        color={planner.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(planner.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {planner.lastLogin
                        ? new Date(planner.lastLogin).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(planner)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(planner._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingPlanner ? "Edit Planner" : "Add New Planner"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              fullWidth
              variant="outlined"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              sx={{ mb: 2 }}
            />
            {!editingPlanner && (
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                sx={{ mb: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingPlanner ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AddPlannerPage;