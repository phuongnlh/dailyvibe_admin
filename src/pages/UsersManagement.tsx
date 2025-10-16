import { Listbox } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Search,
  Shield,
  SortAsc,
  SortDesc,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { deleteUser, getAllUsers, updateUserStatus, type UserFilters } from "../api/admin";
import AdminLayout from "../components/AdminLayout";
import UserInformation from "../components/UserInformation";
import { VIETNAM_PROVINCES } from "../constants/vietnamProvinces";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  avatar_url: string;
  isActive: boolean;
  isPrivate: boolean;
  EmailVerified: boolean;
  PhoneVerified: boolean;
  isBlocked: boolean;
  is_deleted: boolean;
  twoFAEnabled: boolean;
  location: string;
  createdAt: string;
  postsCount: number;
  status: string;
}

const locationOptions = [
  { value: "", label: "All Locations" },
  ...VIETNAM_PROVINCES.map((province) => ({
    value: province,
    label: province,
  })),
];
const genderOptions = [
  { value: "", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
const UsersManagement: React.FC = () => {
  const [searchLocationQuery, setSearchLocationQuery] = useState("");
  const filteredLocations = locationOptions.filter((loc) =>
    loc.label.toLowerCase().includes(searchLocationQuery.toLowerCase())
  );

  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    blockedUsers: 0,
    newUsersThisPeriod: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    verified: "",
    gender: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllUsers(filters);
      const data = response.data;
      setUsers(data.data.users || []);
      setStatistics(data.data.statistics || {});
      setPagination(data.data.pagination || {});
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (filters.search !== undefined) {
        setFilters((prev) => ({ ...prev, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filters.search]);

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when filtering
    }));
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: newSortOrder,
    }));
  };

  const handlePageChange = (page: number) => {
    handleFilterChange("page", page);
  };

  const handleUserAction = async (userId: string, action: "block" | "unblock" | "activate" | "deactivate") => {
    Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, " + action + " it!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateUserStatus(userId, action);
          Swal.fire("Success!", `User has been ${action}ed.`, "success");
          fetchUsers(); // Refresh the list
        } catch (error) {
          Swal.fire("Error", `Failed to ${action} user.`, "error");
          console.error(`Error ${action}ing user:`, error);
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers(); // Refresh the list
        } catch (error) {
          Swal.fire("Error", "Failed to delete user.", "error");
          console.error("Error deleting user:", error);
        }
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: "",
      verified: "",
      twoFA: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const renderSortIcon = (field: string) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />;
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            i === pagination.currentPage
              ? "bg-purple-600 text-white"
              : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {Math.min((pagination.currentPage - 1) * pagination.limit + 1, pagination.totalCount)} to{" "}
          {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex space-x-1">{pages}</div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title="Users Management">
      {selectedUser && (
        <UserInformation
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={() => {
            fetchUsers();
            setSelectedUser(null);
          }}
        />
      )}
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.newUsersThisPeriod}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.verifiedUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
                <UserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.blockedUsers}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                <UserMinus className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Users</h2>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Filter</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                >
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <Listbox value={filters.status || ""} onChange={(status) => handleFilterChange("status", status)}>
                      <div className="relative w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <Listbox.Button className="w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 flex justify-between items-center">
                          <span>
                            {filters.status === "active"
                              ? "Active"
                              : filters.status === "blocked"
                              ? "Blocked"
                              : filters.status === "deleted"
                              ? "Deleted"
                              : "All Status"}
                          </span>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg bg-white dark:bg-gray-700 shadow-lg scrollbar-thin">
                          <Listbox.Option
                            key="all"
                            value=""
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            All Status
                          </Listbox.Option>
                          <Listbox.Option
                            key="active"
                            value="active"
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            Active
                          </Listbox.Option>
                          <Listbox.Option
                            key="blocked"
                            value="blocked"
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            Blocked
                          </Listbox.Option>
                          <Listbox.Option
                            key="deleted"
                            value="deleted"
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            Deleted
                          </Listbox.Option>
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Verified Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Verified
                    </label>
                    <Listbox
                      value={filters.verified || ""}
                      onChange={(verified) => handleFilterChange("verified", verified)}
                    >
                      <div className="relative w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <Listbox.Button className="w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 flex justify-between items-center">
                          <span>
                            {filters.verified === "verified"
                              ? "Verified"
                              : filters.verified === "unverified"
                              ? "Not Verified"
                              : "All"}
                          </span>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg bg-white dark:bg-gray-700 shadow-lg scrollbar-thin">
                          <Listbox.Option
                            key="all"
                            value=""
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            All
                          </Listbox.Option>
                          <Listbox.Option
                            key="verified"
                            value="verified"
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            Verified
                          </Listbox.Option>
                          <Listbox.Option
                            key="unverified"
                            value="unverified"
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? "bg-purple-500 text-white" : "text-gray-900"
                              }`
                            }
                          >
                            Not Verified
                          </Listbox.Option>
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <Listbox value={filters.gender || ""} onChange={(gender) => handleFilterChange("gender", gender)}>
                      <div className="relative w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <Listbox.Button className="w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 flex justify-between items-center">
                          <span>{genderOptions.find((g) => g.value === filters.gender)?.label || "All Gender"}</span>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg bg-white dark:bg-gray-700 shadow-lg scrollbar-thin">
                          {genderOptions.map((gender) => (
                            <Listbox.Option
                              key={gender.value}
                              value={gender.value}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${
                                  active ? "bg-purple-500 text-white" : "text-gray-900"
                                }`
                              }
                            >
                              {gender.label}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <Listbox
                      value={filters.location || ""}
                      onChange={(location) => handleFilterChange("location", location)}
                    >
                      <div className="relative w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <Listbox.Button className="w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 flex justify-between items-center">
                          <span>{filters.location || "All Location"}</span>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg bg-white dark:bg-gray-700 shadow-lg scrollbar-thin">
                          <div className="sticky top-0 bg-white dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                            <input
                              type="text"
                              placeholder="Search location..."
                              value={searchLocationQuery}
                              onChange={(e) => setSearchLocationQuery(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          {filteredLocations.map((location) => (
                            <Listbox.Option
                              key={location.value}
                              value={location.value}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${
                                  active ? "bg-purple-500 text-white" : "text-gray-900"
                                }`
                              }
                            >
                              {location.label}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end col-span-1 md:col-span-2 lg:col-span-1">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("fullName")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        User
                        {renderSortIcon("fullName")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("gender")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Gender
                        {renderSortIcon("gender")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("location")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Location
                        {renderSortIcon("location")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Join Date
                        {renderSortIcon("createdAt")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("postsCount")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Posts
                        {renderSortIcon("postsCount")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar_url || "/default-avatar.png"}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.gender
                          ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
                          : "Other"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.location || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive && !user.isBlocked
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : user.is_deleted
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                            }`}
                          >
                            {user.is_deleted
                              ? "Deleted"
                              : user.isBlocked
                              ? "Blocked"
                              : user.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                          {user.EmailVerified && <UserCheck className="w-4 h-4 text-green-500" />}
                          {user.twoFAEnabled && <Shield className="w-4 h-4 text-blue-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.postsCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                            title="View Details"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                          {user.is_deleted ? null : (
                            <>
                              <button
                                onClick={() => handleUserAction(user._id, user.isBlocked ? "unblock" : "block")}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                title={user.isBlocked ? "Unblock User" : "Block User"}
                              >
                                <Ban
                                  className={`w-4 h-4 ${
                                    user.isBlocked
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-orange-600 dark:text-orange-400"
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">{renderPagination()}</div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
