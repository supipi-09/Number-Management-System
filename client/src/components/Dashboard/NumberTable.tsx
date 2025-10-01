import React from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Pagination,
  Typography,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Edit,
  Delete,
  Clear,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Search,
} from "@mui/icons-material";

interface NumberItem {
  id: number;
  number: string;
  status: string;
  serviceType: string;
  specialType: string;
  allocatedTo: string | null;
  remarks: string;
}

interface NumberTableProps {
  data: NumberItem[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  sortConfig: { key: string | null; direction: string };
  userRole: string;
  searchTerm: string;
  statusFilter: string;
  onSort: (key: string) => void;
  onPageChange: (page: number) => void;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (filter: string) => void;
}

const NumberTable: React.FC<NumberTableProps> = ({
  data,
  currentPage,
  itemsPerPage,
  totalItems,
  sortConfig,
  userRole,
  searchTerm,
  statusFilter,
  onSort,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
}) => {
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

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
      {/* Action Bar */}
      <Box sx={{ p: 3, bgcolor: "white" }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
          mb={2}
        >
          <TextField
            placeholder="Search by number (e.g., 5551001)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <MenuItem value="All Statuses">All Statuses</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Allocated">Allocated</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
              <MenuItem value="Held">Held</MenuItem>
              <MenuItem value="Quarantined">Quarantined</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {(searchTerm || statusFilter !== "All Statuses") && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {searchTerm && (
              <Chip
                label={`Search: ${searchTerm}`}
                onDelete={() => onSearchChange("")}
                deleteIcon={<Clear />}
                color="primary"
                size="small"
              />
            )}
            {statusFilter !== "All Statuses" && (
              <Chip
                label={`Status: ${statusFilter}`}
                onDelete={() => onStatusFilterChange("All Statuses")}
                deleteIcon={<Clear />}
                color="primary"
                size="small"
              />
            )}
          </Box>
        )}
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              {[
                { key: "number", label: "Number" },
                { key: "status", label: "Status" },
                { key: "serviceType", label: "Service Type" },
                { key: "specialType", label: "Special Type" },
                { key: "allocatedTo", label: "Allocated To" },
                { key: "remarks", label: "Remarks" },
                { key: "actions", label: "Actions" },
              ].map((column) => (
                <TableCell key={column.key}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    onClick={() =>
                      column.key !== "actions" &&
                      column.key !== "allocatedTo" &&
                      column.key !== "remarks"
                        ? onSort(column.key)
                        : undefined
                    }
                    sx={{
                      cursor:
                        column.key !== "actions" &&
                        column.key !== "allocatedTo" &&
                        column.key !== "remarks"
                          ? "pointer"
                          : "default",
                      userSelect: "none",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {column.label}
                    </Typography>
                    {sortConfig.key === column.key &&
                      sortConfig.direction !== "null" &&
                      (sortConfig.direction === "asc" ? (
                        <KeyboardArrowUp fontSize="small" />
                      ) : (
                        <KeyboardArrowDown fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Alert severity="info" sx={{ justifyContent: "center" }}>
                    No numbers found matching your filters
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.serviceType}
                      variant="outlined"
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.specialType}
                      variant="outlined"
                      color="warning"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        item.allocatedTo ? "text.primary" : "text.disabled"
                      }
                      fontStyle={item.allocatedTo ? "normal" : "italic"}
                    >
                      {item.allocatedTo || "Not allocated"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={item.remarks ? "text.primary" : "text.disabled"}
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.remarks}
                    >
                      {item.remarks || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      {userRole === "Admin" && (
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
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

      {/* Pagination */}
      {data.length > 0 && (
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          p={3}
          borderTop={1}
          borderColor="grey.200"
        >
          <Typography variant="body2" color="text.secondary">
            Showing {startIndex + 1}-{endIndex} of {data.length} numbers
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Card>
  );
};

export default NumberTable;
