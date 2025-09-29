import React, { useState, useEffect } from 'react';
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
import { NumberRecord } from '../../types';

interface EditNumberDialogProps {
  open: boolean;
  onClose: () => void;
  number: NumberRecord | null;
  onSuccess: () => void;
}

const EditNumberDialog: React.FC<EditNumberDialogProps> = ({ open, onClose, number, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: '',
    allocatedTo: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (number) {
      setFormData({
        status: number.status,
        allocatedTo: number.allocatedTo || '',
        remarks: number.remarks || '',
      });
    }
  }, [number]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;

    setLoading(true);
    setError('');

    try {
      const response = await numbersAPI.updateNumber(number._id, formData);
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to update number');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update number');
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

  if (!number) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Number: {number.number}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number"
                value={number.number}
                disabled
                variant="filled"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Type"
                value={number.serviceType}
                disabled
                variant="filled"
              />
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
                label="Special Type"
                value={number.specialType}
                disabled
                variant="filled"
              />
            </Grid>
            
            <Grid item xs={12}>
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Number'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditNumberDialog;