import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Fab,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Phone,
  CheckCircle,
  Schedule,
  Block,
  Add,
  Edit,
  Delete,
  Refresh,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { numbersAPI, dashboardAPI } from "../../services/api";
import { NumberRecord, DashboardStats } from "../../types";

const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalNumbers: 0,
    allocatedNumbers: 0,
    availableNumbers: 0,
    reservedNumbers: 0,
    heldNumbers: 0,
    quarantinedNumbers: 0,
  });
  const [numbers, setNumbers] = useState<NumberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNumber, setEditingNumber] = useState<NumberRecord | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    serviceType: "LTE" as const,
    specialType: "Standard" as const,
    status: "Available" as const,
    allocatedTo: "",
    remarks: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getSummary();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Fetch recent numbers
      const numbersResponse = await numbersAPI.getNumbers({ limit: 10 });
      if (numbersResponse.success && numbersResponse.data) {
        setNumbers(numbersResponse.data);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingNumber) {
        const response = await numbersAPI.updateNumber(editingNumber._id, formData);
        if (response.success) {
          setSuccess("Number updated successfully");
          fetchDashboardData();
        }
      } else {
        const response = await numbersAPI.createNumber(formData);
        if (response.success) {
          setSuccess("Number created successfully");
          fetchDashboardData();
        }
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save number");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this number?")) {
      try {
        const response = await numbersAPI.deleteNumber(id);
        if (response.success) {
          setSuccess("Number deleted successfully");
          fetchDashboardData();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete number");
      }
    }
  };

  const handleEdit = (number: NumberRecord) => {
    setEditingNumber(number);
    setFormData({
      number: number.number,
      serviceType: number.serviceType,
      specialType: number.specialType,
      status: number.status,
      allocatedTo: number.allocatedTo || "",
      remarks: number.remarks || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNumber(null);
    setFormData({
      number: "",
      serviceType: "LTE",
      specialType: "Standard",
      status: "Available",
      allocatedTo: "",
      remarks: "",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
      Available: "success",
      Allocated: "info",
      Reserved: "warning",
      Held: "error",
      Quarantined: "default",
    };
    return colors[status] || "default";
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchDashboardData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Numbers"
            value={stats.totalNumbers}
            icon={<Phone sx={{ fontSize: 40 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Available"
            value={stats.availableNumbers}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Allocated"
            value={stats.allocatedNumbers}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Reserved"
            value={stats.reservedNumbers}
            icon={<Schedule sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Held"
            value={stats.heldNumbers}
            icon={<Block sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Quarantined"
            value={stats.quarantinedNumbers}
            icon={<Block sx={{ fontSize: 40 }} />}
            color="grey.500"
          />
        </Grid>
      </Grid>

      {/* Recent Numbers Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Recent Numbers
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add Number
            </Button>
          )}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Service Type</TableCell>
                <TableCell>Special Type</TableCell>
                <TableCell>Allocated To</TableCell>
                {isAdmin && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : numbers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                    No numbers found
                  </TableCell>
                </TableRow>
              ) : (
                numbers.map((number) => (
                  <TableRow key={number._id}>
                    <TableCell>{number.number}</TableCell>
                    <TableCell>
                      <Chip
                        label={number.status}
                        color={getStatusColor(number.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{number.serviceType}</TableCell>
                    <TableCell>{number.specialType}</TableCell>
                    <TableCell>{number.allocatedTo || "-"}</TableCell>
                    {isAdmin && (
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(number)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(number._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Number Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingNumber ? "Edit Number" : "Add New Number"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Number"
              fullWidth
              variant="outlined"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              required
              disabled={!!editingNumber}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={formData.serviceType}
                label="Service Type"
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value as any })
                }
              >
                <MenuItem value="LTE">LTE</MenuItem>
                <MenuItem value="IPTL">IPTL</MenuItem>
                <MenuItem value="FTTH/Copper">FTTH/Copper</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Special Type</InputLabel>
              <Select
                value={formData.specialType}
                label="Special Type"
                onChange={(e) =>
                  setFormData({ ...formData, specialType: e.target.value as any })
                }
              >
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Silver">Silver</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Platinum">Platinum</MenuItem>
                <MenuItem value="Elite">Elite</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Allocated">Allocated</MenuItem>
                <MenuItem value="Reserved">Reserved</MenuItem>
                <MenuItem value="Held">Held</MenuItem>
                <MenuItem value="Quarantined">Quarantined</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Allocated To"
              fullWidth
              variant="outlined"
              value={formData.allocatedTo}
              onChange={(e) =>
                setFormData({ ...formData, allocatedTo: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              label="Remarks"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingNumber ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;