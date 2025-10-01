import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface AddNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: any) => void;
}

const AddNumberModal: React.FC<AddNumberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    number: "",
    serviceType: "LTE",
    specialType: "Normal",
    status: "Available",
    remarks: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onAdd) {
      onAdd(formData);
    }
    setFormData({
      number: "",
      serviceType: "LTE",
      specialType: "Normal",
      status: "Available",
      remarks: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box component="span" fontWeight="bold">
            Add New Number
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          component="div"
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
        >
          <TextField
            label="Number *"
            placeholder="e.g., 0712345678"
            fullWidth
            value={formData.number}
            onChange={(e) => handleChange("number", e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Service Type *</InputLabel>
            <Select
              label="Service Type *"
              value={formData.serviceType}
              onChange={(e) => handleChange("serviceType", e.target.value)}
            >
              <MenuItem value="LTE">LTE</MenuItem>
              <MenuItem value="IPTL">IPTL</MenuItem>
              <MenuItem value="FTTH">FTTH</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Special Type *</InputLabel>
            <Select
              label="Special Type *"
              value={formData.specialType}
              onChange={(e) => handleChange("specialType", e.target.value)}
            >
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="Silver">Silver</MenuItem>
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Platinum">Platinum</MenuItem>
              <MenuItem value="Elite">Elite</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Initial Status *</InputLabel>
            <Select
              label="Initial Status *"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
              <MenuItem value="Held">Held</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Remarks"
            multiline
            rows={3}
            placeholder="Optional notes..."
            fullWidth
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" fullWidth sx={{ py: 1.5 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          sx={{ py: 1.5 }}
          disabled={!formData.number}
        >
          Add Number
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNumberModal;
