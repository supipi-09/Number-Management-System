import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
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
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Clear,
  FilterList,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { numbersAPI } from '../../services/api';
import { NumberRecord } from '../../types';
import AddNumberDialog from './AddNumberDialog';
import EditNumberDialog from './EditNumberDialog';

const NumberManagementPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [numbers, setNumbers] = useState<NumberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search and filters
  const [searchNumber, setSearchNumber] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilters, setServiceTypeFilters] = useState<string[]>([]);
  const [specialTypeFilters, setSpecialTypeFilters] = useState<string[]>([]);
  
  // Dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<NumberRecord | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalNumbers: 0,
    availableNumbers: 0,
    allocatedNumbers: 0,
    reservedNumbers: 0,
  });

  const fetchNumbers = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchNumber || undefined,
        status: statusFilter || undefined,
        serviceType: serviceTypeFilters.length > 0 ? serviceTypeFilters.join(',') : undefined,
        specialType: specialTypeFilters.length > 0 ? specialTypeFilters.join(',') : undefined,
        page: page + 1,
        limit: rowsPerPage,
      };

      const response = await numbersAPI.getNumbers(filters);
      if (response.success && response.data) {
        setNumbers(response.data);
        setTotalCount(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch numbers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await numbersAPI.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, [page, rowsPerPage, searchNumber, statusFilter, serviceTypeFilters, specialTypeFilters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleServiceTypeChange = (serviceType: string) => {
    setServiceTypeFilters(prev => 
      prev.includes(serviceType) 
        ? prev.filter(t => t !== serviceType)
        : [...prev, serviceType]
    );
    setPage(0);
  };

  const handleSpecialTypeChange = (specialType: string) => {
    setSpecialTypeFilters(prev => 
      prev.includes(specialType) 
        ? prev.filter(t => t !== specialType)
        : [...prev, specialType]
    );
    setPage(0);
  };

  const clearAllFilters = () => {
    setSearchNumber('');
    setStatusFilter('');
    setServiceTypeFilters([]);
    setSpecialTypeFilters([]);
    setPage(0);
  };

  const handleEdit = (number: NumberRecord) => {
    setSelectedNumber(number);
    setEditDialogOpen(true);
  };

  const handleDelete = (number: NumberRecord) => {
    setSelectedNumber(number);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNumber) return;
    
    try {
      // Note: Delete functionality would need to be implemented in the API
      console.log('Delete number:', selectedNumber.number);
      setDeleteDialogOpen(false);
      setSelectedNumber(null);
      fetchNumbers();
      fetchStats();
    } catch (err) {
      setError('Failed to delete number');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Allocated': return 'primary';
      case 'Reserved': return 'warning';
      case 'Held': return 'secondary';
      case 'Quarantined': return 'error';
      default: return 'default';
    }
  };

  const activeFiltersCount = 
    (searchNumber ? 1 : 0) + 
    (statusFilter ? 1 : 0) + 
    serviceTypeFilters.length + 
    specialTypeFilters.length;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Number Management
      </Typography>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.totalNumbers.toLocaleString()}
              </Typography>
              <Typography variant="body2">Total Numbers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.availableNumbers.toLocaleString()}
              </Typography>
              <Typography variant="body2">Available Numbers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.allocatedNumbers.toLocaleString()}
              </Typography>
              <Typography variant="body2">Allocated Numbers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {stats.reservedNumbers.toLocaleString()}
              </Typography>
              <Typography variant="body2">Reserved Numbers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {isAdmin && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ minWidth: 180 }}
            >
              Add New Number
            </Button>
          )}
          
          <TextField
            placeholder="e.g., 5551001"
            value={searchNumber}
            onChange={(e) => {
              setSearchNumber(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 200 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Allocated">Allocated</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
              <MenuItem value="Held">Held</MenuItem>
              <MenuItem value="Quarantined">Quarantined</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Advanced Filters */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Service Type:
            </Typography>
            <FormGroup row>
              {['LTE', 'IPTL', 'FTTH/Copper'].map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={serviceTypeFilters.includes(type)}
                      onChange={() => handleServiceTypeChange(type)}
                      size="small"
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Special Type:
            </Typography>
            <FormGroup row>
              {['Elite', 'Gold', 'Platinum', 'Silver', 'Standard'].map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={specialTypeFilters.includes(type)}
                      onChange={() => handleSpecialTypeChange(type)}
                      size="small"
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </Box>
          
          {activeFiltersCount > 0 && (
            <Box sx={{ ml: 'auto', alignSelf: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Clear />}
                onClick={clearAllFilters}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Filter Chips */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {searchNumber && (
            <Chip
              label={`Number: ${searchNumber}`}
              onDelete={() => setSearchNumber('')}
              size="small"
            />
          )}
          {statusFilter && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => setStatusFilter('')}
              size="small"
            />
          )}
          {serviceTypeFilters.map((type) => (
            <Chip
              key={type}
              label={`Service: ${type}`}
              onDelete={() => handleServiceTypeChange(type)}
              size="small"
            />
          ))}
          {specialTypeFilters.map((type) => (
            <Chip
              key={type}
              label={`Special: ${type}`}
              onDelete={() => handleSpecialTypeChange(type)}
              size="small"
            />
          ))}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            Showing {totalCount} numbers
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Numbers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
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
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {number.number}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={number.status}
                        color={getStatusColor(number.status) as any}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>{number.serviceType}</TableCell>
                    <TableCell>{number.specialType}</TableCell>
                    <TableCell>{number.allocatedTo || '-'}</TableCell>
                    <TableCell>
                      {number.remarks ? (
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {number.remarks}
                        </Typography>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(number)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        {isAdmin && (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(number)}
                            color="error"
                          >
                            <Delete />
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
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      {/* Dialogs */}
      <AddNumberDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => {
          fetchNumbers();
          fetchStats();
        }}
      />

      <EditNumberDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedNumber(null);
        }}
        number={selectedNumber}
        onSuccess={() => {
          fetchNumbers();
          fetchStats();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete number {selectedNumber?.number}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NumberManagementPage;