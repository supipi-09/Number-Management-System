import React, { useState, useEffect } from "react";
import { Database, CheckCircle, TrendingUp, Clock, Plus } from "lucide-react";
import Header from "../layout/Header";
import StatCard from "./StatCard";
import AddNumberModal from "./AddNumberModal";
import NumberTable from "./NumberTable";

// Mock data for demonstration
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

  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    number: `555${String(1001 + i).padStart(4, "0")}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
    specialType: specialTypes[Math.floor(Math.random() * specialTypes.length)],
    allocatedTo: users[Math.floor(Math.random() * users.length)],
    remarks:
      i % 3 === 0
        ? "Priority customer request"
        : i % 5 === 0
        ? "Under maintenance review"
        : "",
  }));
};

const Dashboard: React.FC = () => {
  const [numbers, setNumbers] = useState(generateMockData());
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

  // Calculate stats
  const stats = {
    total: numbers.length,
    available: numbers.filter((n) => n.status === "Available").length,
    allocated: numbers.filter((n) => n.status === "Allocated").length,
    reserved: numbers.filter((n) => n.status === "Reserved").length,
    held: numbers.filter((n) => n.status === "Held").length,
    quarantined: numbers.filter((n) => n.status === "Quarantined").length,
  };

  // Filter and search logic
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

  // Sorting logic
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
        if (a[key as keyof typeof a] < b[key as keyof typeof b])
          return direction === "asc" ? -1 : 1;
        if (a[key as keyof typeof a] > b[key as keyof typeof b])
          return direction === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredNumbers(sorted);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} />

      <main className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Numbers"
            value={stats.total}
            icon={Database}
            color="from-blue-500 to-blue-600"
            trend="+5.2% from last month"
          />
          <StatCard
            title="Available Numbers"
            value={stats.available}
            icon={CheckCircle}
            color="from-green-500 to-green-600"
            trend="-2.1% from last month"
          />
          <StatCard
            title="Allocated Numbers"
            value={stats.allocated}
            icon={TrendingUp}
            color="from-indigo-500 to-indigo-600"
            trend="+12.3% from last month"
          />
          <StatCard
            title="Reserved Numbers"
            value={stats.reserved}
            icon={Clock}
            color="from-orange-500 to-orange-600"
            trend="+3.4% from last month"
          />
        </div>

        {/* Add Number Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <Plus size={20} />
            Add New Number
          </button>
        </div>

        {/* Number Table */}
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
      </main>

      {/* Add Number Modal */}
      <AddNumberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Dashboard;
