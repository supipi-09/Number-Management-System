import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import {
  Add,
  Storage as DatabaseIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ClockIcon,
} from "@mui/icons-material";
import StatCard from "./StatCard";
import AddNumberModal from "./AddNumberModal";
import NumberTable from "./NumberTable";

const generateMockData = () => {
  const statuses = [
    "Available",
    "Allocated",
    "Reserved",
    "Held",
    "Quarantined",
  ];
  const serviceTypes = ["LTE", "IPTL", "FTTH"];
  const specialTypes = ["Elite", "Gold", "Platinum", "Silver", "Normal"];
  const users = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
    null,
  ];
  const phoneNumbers = [
    "0712345678",
    "0773456789",
    "0113485346",
    "0114567890",
    "0775678901",
    "0116789012",
    "0778901234",
    "0119012345",
    "0770123456",
    "0111234567",
  ];

  return Array.from({ length: 100 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isAllocated = status === "Allocated";

    return {
      id: i + 1,
      number:
        i < 10
          ? phoneNumbers[i]
          : `0${70 + Math.floor(Math.random() * 3)}${String(
              Math.floor(Math.random() * 10000000)
            ).padStart(7, "0")}`,
      status,
      serviceType:
        serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      specialType:
        specialTypes[Math.floor(Math.random() * specialTypes.length)],
      allocatedTo: isAllocated
        ? users.filter((u) => u !== null)[
            Math.floor(Math.random() * (users.length - 1))
          ]
        : null,
      remarks:
        i % 3 === 0
          ? "Priority customer request"
          : i % 5 === 0
          ? "Under maintenance review"
          : "",
    };
  });
};

const Dashboard: React.FC = () => {
  const numbers = generateMockData();
  const [filteredNumbers, setFilteredNumbers] = useState(numbers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: string;
  }>({ key: null, direction: "asc" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [userRole] = useState("Admin");

  const stats = {
    total: numbers.length,
    available: numbers.filter((n) => n.status === "Available").length,
    allocated: numbers.filter((n) => n.status === "Allocated").length,
    reserved: numbers.filter((n) => n.status === "Reserved").length,
    held: numbers.filter((n) => n.status === "Held").length,
    quarantined: numbers.filter((n) => n.status === "Quarantined").length,
  };

  useEffect(() => {
    let filtered = numbers;
    if (searchTerm) {
      filtered = filtered.filter((n) =>
        n.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter((n) => n.status === statusFilter);
    }
    setFilteredNumbers(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, numbers]);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "null";
    }

    setSortConfig({ key, direction });

    if (direction === "null") {
      setFilteredNumbers([...numbers]);
    } else {
      const sorted = [...filteredNumbers].sort((a, b) => {
        const aValue = a[key as keyof typeof a];
        const bValue = b[key as keyof typeof b];
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return direction === "asc" ? 1 : -1;
        if (bValue === null) return direction === "asc" ? -1 : 1;
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredNumbers(sorted);
    }
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard
            title="Total Numbers"
            value={stats.total}
            icon={DatabaseIcon}
            color="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
            trend="+5.2% from last month"
          />
          <StatCard
            title="Available Numbers"
            value={stats.available}
            icon={CheckCircleIcon}
            color="linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
            trend="-2.1% from last month"
          />
          <StatCard
            title="Allocated Numbers"
            value={stats.allocated}
            icon={TrendingUpIcon}
            color="linear-gradient(135deg, #0288d1 0%, #29b6f6 100%)"
            trend="+12.3% from last month"
          />
          <StatCard
            title="Reserved Numbers"
            value={stats.reserved}
            icon={ClockIcon}
            color="linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)"
            trend="+3.4% from last month"
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowAddModal(true)}
            sx={{ py: 1.5, px: 3 }}
          >
            Add New Number
          </Button>
        </Box>
        <NumberTable
          data={filteredNumbers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredNumbers.length}
          sortConfig={sortConfig}
          userRole={userRole}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSort={handleSort}
          onPageChange={setCurrentPage}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
      </Container>
      <AddNumberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </Box>
  );
};

export default Dashboard;
