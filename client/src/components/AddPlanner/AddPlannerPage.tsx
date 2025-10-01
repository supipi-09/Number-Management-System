import React, { useState, useEffect } from "react";
import {
  Container,
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
  CircularProgress,
  Tooltip,
  Avatar,
  Card,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  People,
  PersonAdd,
} from "@mui/icons-material";

interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const AddPlannerPage: React.FC = () => {
  const [planners, setPlanners] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlanner, setEditingPlanner] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "planner" as const,
  });

  // Mock data for demonstration
  useEffect(() => {
    fetchPlanners();
  }, []);

  const fetchPlanners = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockPlanners: User[] = [
        {
          _id: "1",
          username: "John Smith",
          email: "john.smith@example.com",
          phone: "+1234567890",
          role: "planner",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        {
          _id: "2",
          username: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "+0987654321",
          role: "planner",
          isActive: true,
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          lastLogin: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
      setPlanners(mockPlanners);
      setLoading(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (editingPlanner) {
        setSuccess("Planner updated successfully");
        setPlanners(
          planners.map((p) =>
            p._id === editingPlanner._id
              ? {
                  ...p,
                  username: formData.username,
                  email: formData.email,
                  phone: formData.phone,
                }
              : p
          )
        );
      } else {
        setSuccess("Planner created successfully");
        const newPlanner: User = {
          _id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          role: "planner",
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setPlanners([...planners, newPlanner]);
      }
      handleCloseDialog();
      setSubmitting(false);
    }, 1000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this planner?")) {
      setPlanners(planners.filter((p) => p._id !== id));
      setSuccess("Planner deleted successfully");
    }
  };

  const handleEdit = (planner: User) => {
    setEditingPlanner(planner);
    setFormData({
      username: planner.username,
      email: planner.email,
      password: "",
      phone: planner.phone || "",
      role: "planner",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlanner(null);
    setShowPassword(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
      role: "planner",
    });
  };

  const filteredPlanners = planners.filter(
    (planner) =>
      planner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (planner.phone && planner.phone.includes(searchTerm))
  );

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <People sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Planner Management
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage planner accounts and permissions
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Action Bar */}
        <Card sx={{ mb: 4, borderRadius: 2 }}>
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{ py: 1.5, px: 3, minWidth: { xs: "100%", md: 200 } }}
              >
                Add New Planner
              </Button>
              <TextField
                fullWidth
                placeholder="Search planners by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Card>

        {/* Planners Table */}
        <Card sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Planner</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Loading planners...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredPlanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <PersonAdd sx={{ fontSize: 64, color: "grey.300" }} />
                        <Typography variant="h6" color="text.secondary">
                          No planners found
                        </Typography>
                        {searchTerm ? (
                          <Typography variant="body2" color="text.secondary">
                            Try adjusting your search terms
                          </Typography>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenDialog(true)}
                          >
                            Add Your First Planner
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlanners.map((planner) => (
                    <TableRow
                      key={planner._id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "grey.50" } }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              width: 44,
                              height: 44,
                            }}
                          >
                            {getInitials(planner.username)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {planner.username}
                            </Typography>
                            <Chip
                              label="Planner"
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Email sx={{ fontSize: 18, color: "grey.500" }} />
                            <Typography variant="body2">
                              {planner.email}
                            </Typography>
                          </Box>
                          {planner.phone && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Phone sx={{ fontSize: 18, color: "grey.500" }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {planner.phone}
                              </Typography>
                            </Box>
                          )}
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
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(planner.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(planner.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {planner.lastLogin
                            ? new Date(planner.lastLogin).toLocaleDateString()
                            : "Never"}
                        </Typography>
                        {planner.lastLogin && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(planner.lastLogin).toLocaleTimeString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Tooltip title="Edit Planner">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(planner)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Planner">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(planner._id)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Footer */}
          {filteredPlanners.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: "grey.200",
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredPlanners.length} of {planners.length} planners
                {searchTerm && ` for "${searchTerm}"`}
              </Typography>
            </Box>
          )}
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {editingPlanner ? "Edit Planner" : "Add New Planner"}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
            >
              <TextField
                label="Username"
                fullWidth
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              {!editingPlanner && (
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.5 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.5 }}
            >
              {submitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : editingPlanner ? (
                "Update Planner"
              ) : (
                "Create Planner"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AddPlannerPage;
