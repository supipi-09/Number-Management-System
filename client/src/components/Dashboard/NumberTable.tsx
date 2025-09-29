import React from "react";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from "lucide-react";

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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    const colors = {
      Available: "bg-green-100 text-green-800",
      Allocated: "bg-blue-100 text-blue-800",
      Reserved: "bg-orange-100 text-orange-800",
      Held: "bg-red-100 text-red-800",
      Quarantined: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusDot = (status: string) => {
    const colors = {
      Available: "bg-green-500",
      Allocated: "bg-blue-500",
      Reserved: "bg-orange-500",
      Held: "bg-red-500",
      Quarantined: "bg-gray-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by number (e.g., 5551001)"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white min-w-[180px]"
            >
              <option>All Statuses</option>
              <option>Available</option>
              <option>Allocated</option>
              <option>Reserved</option>
              <option>Held</option>
              <option>Quarantined</option>
            </select>
          </div>
        </div>
        {(searchTerm || statusFilter !== "All Statuses") && (
          <div className="flex gap-2 mt-3">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Search: {searchTerm}
                <button
                  onClick={() => onSearchChange("")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {statusFilter !== "All Statuses" && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Status: {statusFilter}
                <button
                  onClick={() => onStatusFilterChange("All Statuses")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                onClick={() => onSort("number")}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Number
                  {sortConfig.key === "number" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => onSort("status")}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortConfig.key === "status" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => onSort("serviceType")}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Service Type
                  {sortConfig.key === "serviceType" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => onSort("specialType")}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Special Type
                  {sortConfig.key === "specialType" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Allocated To
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Remarks
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <AlertCircle className="mx-auto mb-2" size={48} />
                  <p>No numbers found matching your filters</p>
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusDot(
                          item.status
                        )}`}
                      ></span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {item.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      {item.specialType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.allocatedTo || (
                      <span className="text-gray-400 italic">
                        Not allocated
                      </span>
                    )}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                    title={item.remarks}
                  >
                    {item.remarks || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      {userRole === "Admin" && (
                        <button
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, data.length)} of {data.length} numbers
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              First
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberTable;
