import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { numbersAPI } from "../../services/api";
import { NumberRecord } from "../../types";

interface FilterState {
  search: string;
  status: string;
  serviceTypes: string[];
  specialTypes: string[];
}

const NumberManagementPage: React.FC = () => {
  const [numbers, setNumbers] = useState<NumberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isAdmin } = useAuth();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<NumberRecord | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    serviceType: "",
    specialType: "Standard",
    status: "Available",
    allocatedTo: "",
    remarks: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    serviceTypes: [],
    specialTypes: [],
  });

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    allocated: 0,
    reserved: 0,
    held: 0,
    quarantined: 0,
  });

  const statusOptions = [
    "Available",
    "Allocated",
    "Reserved",
    "Held",
    "Quarantined",
  ];
  const serviceTypeOptions = ["LTE", "IPTL", "FTTH/Copper"];
  const specialTypeOptions = [
    "Elite",
    "Gold",
    "Platinum",
    "Silver",
    "Standard",
  ];

  useEffect(() => {
    fetchNumbers();
  }, [filters]);

  const fetchNumbers = async () => {
    try {
      setLoading(true);
      const response = await numbersAPI.getNumbers({
        search: filters.search,
        status: filters.status,
        serviceTypes: filters.serviceTypes.join(","),
        specialTypes: filters.specialTypes.join(","),
      });

      setNumbers(response.data || []);
      calculateStats(response.data || []);
    } catch (error) {
      console.error("Error fetching numbers:", error);
      setError("Failed to fetch numbers");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (numbersData: NumberRecord[]) => {
    const stats = {
      total: numbersData.length,
      available: numbersData.filter((n) => n.status === "Available").length,
      allocated: numbersData.filter((n) => n.status === "Allocated").length,
      reserved: numbersData.filter((n) => n.status === "Reserved").length,
      held: numbersData.filter((n) => n.status === "Held").length,
      quarantined: numbersData.filter((n) => n.status === "Quarantined").length,
    };
    setStats(stats);
  };

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      serviceTypes: checked
        ? [...prev.serviceTypes, serviceType]
        : prev.serviceTypes.filter((type) => type !== serviceType),
    }));
  };

  const handleSpecialTypeChange = (specialType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      specialTypes: checked
        ? [...prev.specialTypes, specialType]
        : prev.specialTypes.filter((type) => type !== specialType),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: "",
      serviceTypes: [],
      specialTypes: [],
    });
  };

  const clearFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "search":
        handleFilterChange("search", "");
        break;
      case "status":
        handleFilterChange("status", "");
        break;
      case "serviceType":
        if (value) {
          handleServiceTypeChange(value, false);
        }
        break;
      case "specialType":
        if (value) {
          handleSpecialTypeChange(value, false);
        }
        break;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: {
      [key: string]: "success" | "primary" | "warning" | "error" | "default";
    } = {
      Available: "success",
      Allocated: "primary",
      Reserved: "warning",
      Held: "error",
      Quarantined: "default",
    };
    return colors[status] || "default";
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    count += filters.serviceTypes.length;
    count += filters.specialTypes.length;
    return count;
  };

  const handleDeleteNumber = async (numberId: string) => {
    if (!window.confirm("Are you sure you want to delete this number?")) {
      return;
    }

    try {
      await numbersAPI.deleteNumber(numberId);
      setSuccess("Number deleted successfully!");
      fetchNumbers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete number");
    }
  };

  const handleAddNumber = () => {
    setFormData({
      number: "",
      serviceType: "",
      specialType: "Standard",
      status: "Available",
      allocatedTo: "",
      remarks: "",
    });
    setEditingNumber(null);
    setAddDialogOpen(true);
  };

  const handleEditNumber = (number: NumberRecord) => {
    setFormData({
      number: number.number,
      serviceType: number.serviceType,
      specialType: number.specialType,
      status: number.status,
      allocatedTo: number.allocatedTo || "",
      remarks: number.remarks || "",
    });
    setEditingNumber(number);
    setAddDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    setFormLoading(true);
    try {
      const data = {
        ...formData,
        status: formData.status as
          | "Available"
          | "Allocated"
          | "Reserved"
          | "Held"
          | "Quarantined",
        serviceType: formData.serviceType as "LTE" | "IPTL" | "FTTH/Copper",
        specialType: formData.specialType as
          | "Elite"
          | "Gold"
          | "Platinum"
          | "Silver"
          | "Standard",
      };
      if (editingNumber) {
        await numbersAPI.updateNumber(editingNumber._id, data);
        setSuccess("Number updated successfully!");
      } else {
        await numbersAPI.createNumber(data);
        setSuccess("Number created successfully!");
      }
      setAddDialogOpen(false);
      fetchNumbers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to save number");
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Numbers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.total.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "4px solid #4caf50" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Available Numbers
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#4caf50" }}
              >
                {stats.available.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "4px solid #2196f3" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Allocated Numbers
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#2196f3" }}
              >
                {stats.allocated.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "4px solid #ff9800" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Reserved Numbers
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#ff9800" }}
              >
                {stats.reserved.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "4px solid #f44336" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Held Numbers
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#f44336" }}
              >
                {stats.held.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "4px solid #9e9e9e" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Quarantined
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#9e9e9e" }}
              >
                {stats.quarantined.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
            Number Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={handleAddNumber}
          >
            Add New Number
          </Button>
        </Box>

        {/* Action Bar - Search and Filter */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by Number (e.g., 5551001)"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Filter by Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Advanced Filters */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#fafafa" }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Advanced Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Service Type:
              </Typography>
              <FormGroup row>
                {serviceTypeOptions.map((serviceType) => (
                  <FormControlLabel
                    key={serviceType}
                    control={
                      <Checkbox
                        checked={filters.serviceTypes.includes(serviceType)}
                        onChange={(e) =>
                          handleServiceTypeChange(serviceType, e.target.checked)
                        }
                      />
                    }
                    label={serviceType}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Special Type:
              </Typography>
              <FormGroup row>
                {specialTypeOptions.map((specialType) => (
                  <FormControlLabel
                    key={specialType}
                    control={
                      <Checkbox
                        checked={filters.specialTypes.includes(specialType)}
                        onChange={(e) =>
                          handleSpecialTypeChange(specialType, e.target.checked)
                        }
                      />
                    }
                    label={specialType}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </Paper>

        {/* Filter Chips */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Active Filters:
              </Typography>
              {filters.search && (
                <Chip
                  label={`Number: ${filters.search}`}
                  onDelete={() => clearFilter("search")}
                  size="small"
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onDelete={() => clearFilter("status")}
                  size="small"
                />
              )}
              {filters.serviceTypes.map((type) => (
                <Chip
                  key={type}
                  label={`Service: ${type}`}
                  onDelete={() => clearFilter("serviceType", type)}
                  size="small"
                />
              ))}
              {filters.specialTypes.map((type) => (
                <Chip
                  key={type}
                  label={`Special: ${type}`}
                  onDelete={() => clearFilter("specialType", type)}
                  size="small"
                />
              ))}
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Showing {numbers.length} numbers
            </Typography>
          </Box>
        )}

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
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Service Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Special Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Allocated To</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : numbers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No numbers found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                numbers.map((number) => (
                  <TableRow key={number._id} hover>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontWeight: 600 }}
                    >
                      {number.number}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={number.status}
                        color={getStatusColor(number.status)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{number.serviceType}</TableCell>
                    <TableCell>{number.specialType}</TableCell>
                    <TableCell>{number.allocatedTo || "-"}</TableCell>
                    <TableCell>{number.remarks || "-"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          title="Edit number"
                          onClick={() => handleEditNumber(number)}
                        >
                          <EditIcon />
                        </IconButton>
                        {isAdmin && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteNumber(number._id)}
                            title="Delete number"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default NumberManagementPage;
