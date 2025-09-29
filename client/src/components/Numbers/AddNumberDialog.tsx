import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { numbersAPI } from '../../services/api';

interface AddNumberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddNumberDialog: React.FC<AddNumberDialogProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    number: '',
    serviceType: '',
    specialType: 'Standard',
    status: 'Available',
    allocatedTo: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await numbersAPI.createNumber(formData);
      if (response.success) {
        onSuccess();
        onClose();
        setFormData({
          number: '',
          serviceType: '',
          specialType: 'Standard',
          status: 'Available',
          allocatedTo: '',
          remarks: '',
        });
      } else {
        setError(response.message || 'Failed to create number');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create number');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError('');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Number</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="e.g., 0715551001"
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.serviceType}
                  label="Service Type"
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <MenuItem value="LTE">LTE</MenuItem>
                  <MenuItem value="IPTL">IPTL</MenuItem>
                  <MenuItem value="FTTH/Copper">FTTH/Copper</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Special Type</InputLabel>
                <Select
                  value={formData.specialType}
                  label="Special Type"
                  onChange={(e) => setFormData({ ...formData, specialType: e.target.value })}
                >
                  <MenuItem value="Elite">Elite</MenuItem>
                  <MenuItem value="Gold">Gold</MenuItem>
                  <MenuItem value="Platinum">Platinum</MenuItem>
                  <MenuItem value="Silver">Silver</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Allocated">Allocated</MenuItem>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                  <MenuItem value="Held">Held</MenuItem>
                  <MenuItem value="Quarantined">Quarantined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Allocated To"
                value={formData.allocatedTo}
                onChange={(e) => setFormData({ ...formData, allocatedTo: e.target.value })}
                placeholder="Customer name or ID"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                multiline
                rows={3}
                placeholder="Additional notes or comments"
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.number || !formData.serviceType}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Number'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddNumberDialog;