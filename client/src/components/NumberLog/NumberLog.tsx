import React, { useState } from "react";
import {
  Box,
  Card,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Search,
  Close as X,
  History as LogIcon,
  Assignment as AssignIcon,
  LockOpen as ReleaseIcon,
  Lock as ReserveIcon,
  Update as ChangeIcon,
  Phone,
} from "@mui/icons-material";

interface NumberEntry {
  id: string;
  number: string;
  status: "available" | "allocated" | "reserved";
  allocatedTo: string;
  allocatedAt: string;
  reservedUntil?: string;
  createdAt: string;
}

interface NumberLog {
  id: string;
  numberId: string;
  number: string;
  action: "allocated" | "released" | "reserved" | "changed";
  performedBy: string;
  performedAt: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

const mockNumbers: NumberEntry[] = [
  {
    id: "1",
    number: "0712345678",
    status: "allocated",
    allocatedTo: "john_planner",
    allocatedAt: "2024-01-15T10:30:00",
    createdAt: "2024-01-10T08:00:00",
  },
  {
    id: "2",
    number: "0773456789",
    status: "reserved",
    allocatedTo: "sarah_designer",
    allocatedAt: "2024-02-20T14:15:00",
    reservedUntil: "2024-12-31T23:59:59",
    createdAt: "2024-02-15T09:00:00",
  },
  {
    id: "3",
    number: "0113485346",
    status: "available",
    allocatedTo: "",
    allocatedAt: "",
    createdAt: "2024-03-01T11:00:00",
  },
  {
    id: "4",
    number: "0714567890",
    status: "allocated",
    allocatedTo: "mike_admin",
    allocatedAt: "2024-01-20T14:00:00",
    createdAt: "2024-01-15T09:00:00",
  },
  {
    id: "5",
    number: "0775678901",
    status: "available",
    allocatedTo: "",
    allocatedAt: "",
    createdAt: "2024-02-10T10:00:00",
  },
  {
    id: "6",
    number: "0116789012",
    status: "reserved",
    allocatedTo: "emma_manager",
    allocatedAt: "2024-03-05T11:30:00",
    reservedUntil: "2025-06-30T23:59:59",
    createdAt: "2024-03-01T08:00:00",
  },
  {
    id: "7",
    number: "0778901234",
    status: "allocated",
    allocatedTo: "david_planner",
    allocatedAt: "2024-02-25T15:45:00",
    createdAt: "2024-02-20T12:00:00",
  },
  {
    id: "8",
    number: "0119012345",
    status: "available",
    allocatedTo: "",
    allocatedAt: "",
    createdAt: "2024-03-10T13:00:00",
  },
  {
    id: "9",
    number: "0770123456",
    status: "reserved",
    allocatedTo: "lisa_coordinator",
    allocatedAt: "2024-01-30T09:15:00",
    reservedUntil: "2024-12-15T23:59:59",
    createdAt: "2024-01-25T11:00:00",
  },
  {
    id: "10",
    number: "0111234567",
    status: "allocated",
    allocatedTo: "robert_manager",
    allocatedAt: "2024-03-15T16:20:00",
    createdAt: "2024-03-12T10:00:00",
  },
];

const mockLogs: NumberLog[] = [
  {
    id: "log1",
    numberId: "1",
    number: "0712345678",
    action: "allocated",
    performedBy: "admin",
    performedAt: "2024-01-15T10:30:00",
    details: "Number allocated to john_planner",
  },
  {
    id: "log2",
    numberId: "2",
    number: "0773456789",
    action: "reserved",
    performedBy: "admin",
    performedAt: "2024-02-20T14:15:00",
    details: "Number reserved for sarah_designer until 2024-12-31",
  },
  {
    id: "log3",
    numberId: "1",
    number: "0712345678",
    action: "changed",
    performedBy: "admin",
    performedAt: "2024-01-20T16:45:00",
    details: "Number status updated",
    previousValue: "allocated",
    newValue: "reserved",
  },
  {
    id: "log4",
    numberId: "4",
    number: "0714567890",
    action: "allocated",
    performedBy: "admin",
    performedAt: "2024-01-20T14:00:00",
    details: "Number allocated to mike_admin",
  },
  {
    id: "log5",
    numberId: "3",
    number: "0113485346",
    action: "released",
    performedBy: "planner1",
    performedAt: "2024-03-01T11:00:00",
    details: "Number released back to pool",
  },
];

const NumberLog: React.FC = () => {
  const [numbers] = useState<NumberEntry[]>(mockNumbers);
  const [logs] = useState<NumberLog[]>(mockLogs);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<NumberEntry | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredNumbers = numbers.filter((number) => {
    const matchesSearch =
      number.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      number.allocatedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || number.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = selectedNumber
    ? logs.filter((log) => log.numberId === selectedNumber.id)
    : logs;

  const getStatusColor = (status: NumberEntry["status"]) => {
    switch (status) {
      case "available":
        return "success";
      case "allocated":
        return "primary";
      case "reserved":
        return "warning";
      default:
        return "default";
    }
  };

  const getActionIcon = (action: NumberLog["action"]) => {
    switch (action) {
      case "allocated":
        return <AssignIcon />;
      case "released":
        return <ReleaseIcon />;
      case "reserved":
        return <ReserveIcon />;
      case "changed":
        return <ChangeIcon />;
      default:
        return <LogIcon />;
    }
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <LogIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Number Activity Logs
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Track number allocation, release, reservation, and changes with
            complete audit logs
          </Typography>
        </Box>

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
              <TextField
                placeholder="Search numbers or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="allocated">Allocated</MenuItem>
                  <MenuItem value="reserved">Reserved</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Allocated To</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Allocated Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reserved Until</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNumbers.length === 0 ? (
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
                        <Phone sx={{ fontSize: 64, color: "grey.300" }} />
                        <Typography variant="h6" color="text.secondary">
                          No numbers found
                        </Typography>
                        {searchTerm && (
                          <Typography variant="body2" color="text.secondary">
                            Try adjusting your search terms
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNumbers.map((number) => (
                    <TableRow key={number.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {number.number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            number.status.charAt(0).toUpperCase() +
                            number.status.slice(1)
                          }
                          color={getStatusColor(number.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {number.allocatedTo || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {number.allocatedAt
                            ? new Date(number.allocatedAt).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {number.reservedUntil
                            ? new Date(number.reservedUntil).toLocaleString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setSelectedNumber(number);
                            setShowLogsModal(true);
                          }}
                          color="info"
                          size="small"
                          title="View Logs"
                        >
                          <LogIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredNumbers.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: "grey.200",
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {filteredNumbers.length} of {numbers.length} numbers
              </Typography>
            </Box>
          )}
        </Card>

        <Dialog
          open={showLogsModal}
          onClose={() => setShowLogsModal(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">
                Number Activity Logs{" "}
                {selectedNumber && `- ${selectedNumber.number}`}
              </Typography>
              <IconButton onClick={() => setShowLogsModal(false)} size="small">
                <X />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Performed By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Chip
                          icon={getActionIcon(log.action)}
                          label={
                            log.action.charAt(0).toUpperCase() +
                            log.action.slice(1)
                          }
                          color={
                            log.action === "allocated"
                              ? "primary"
                              : log.action === "released"
                              ? "success"
                              : log.action === "reserved"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {log.number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.details}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.performedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(log.performedAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default NumberLog;
