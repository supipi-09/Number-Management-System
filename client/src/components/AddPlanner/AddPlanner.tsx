import React, { useState } from "react";
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Lock,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

interface Planner {
  id: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

const AddPlanner: React.FC = () => {
  const [planners, setPlanners] = useState<Planner[]>([
    {
      id: 1,
      username: "john_planner",
      email: "john.planner@company.com",
      phone: "+94 77 123 4567",
      password: "••••••••",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      username: "sarah_designer",
      email: "sarah.d@company.com",
      phone: "+94 76 234 5678",
      password: "••••••••",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      username: "mike_coordinator",
      email: "mike.c@company.com",
      phone: "+94 75 345 6789",
      password: "••••••••",
      createdAt: "2024-03-10",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // Filter planners based on search
  const filteredPlanners = planners.filter(
    (planner) =>
      planner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.phone.includes(searchTerm)
  );

  const handleAddPlanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlanner: Planner = {
      id: planners.length + 1,
      ...formData,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPlanners([...planners, newPlanner]);
    setFormData({ username: "", email: "", phone: "", password: "" });
    setShowAddModal(false);
  };

  const handleDeletePlanner = (id: number) => {
    setPlanners(planners.filter((planner) => planner.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const AddPlannerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Add New Planner</h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleAddPlanner} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <User size={16} />
                Username *
              </div>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                Email Address *
              </div>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                Phone Number *
              </div>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Lock size={16} />
                Password *
              </div>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Create Planner
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Planner Management
          </h1>
          <p className="text-gray-600">
            Manage planner accounts and permissions
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus size={20} />
              Add New Planner
            </button>

            <div className="relative flex-1 md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search planners by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Planners Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Password
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPlanners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <User size={48} className="text-gray-400" />
                        <p>No planners found</p>
                        {searchTerm && (
                          <p className="text-sm">
                            Try adjusting your search terms
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPlanners.map((planner) => (
                    <tr
                      key={planner.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {planner.username}
                            </p>
                            <p className="text-xs text-gray-500">Planner</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {planner.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {planner.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Lock size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {planner.password}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {planner.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Edit Planner"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePlanner(planner.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete Planner"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredPlanners.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {filteredPlanners.length} of {planners.length} planners
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Planner Modal */}
      {showAddModal && <AddPlannerModal />}
    </div>
  );
};

export default AddPlanner;
