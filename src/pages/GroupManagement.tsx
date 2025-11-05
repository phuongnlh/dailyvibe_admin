import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Trash2, UserCheck, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  dismissAllPendingReportsOfGroup,
  getAllGroups,
  getGroupStatistics,
  getPendingGroupReports,
  markGroupAsInvestigating,
  sendWarningToGroup,
  type GetGroupsParams,
  type GetPendingReportsParams,
  type SendWarningRequest,
} from "../api/group";
import AdminLayout from "../components/AdminLayout";
import AllGroups from "../components/Group/Tabs/AllGroups";
import PendingGroups from "../components/Group/Tabs/PendingGroups";
import ResolvedGroups from "../components/Group/Tabs/ResolvedGroups";

interface Statistics {
  totalActiveGroups: number;
  totalDeletedGroups: number;
  totalPosts: number;
  totalMembers: number;
}

const GroupManagement: React.FC = () => {
  //*=========================================================
  //================State Variables===========================
  //*=========================================================
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPendingGroups, setSelectedPendingGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "investigating" | "resolved">("all");

  const [statistics, setStatistics] = useState<Statistics>({
    totalActiveGroups: 0,
    totalDeletedGroups: 0,
    totalPosts: 0,
    totalMembers: 0,
  });

  const [params, setParams] = useState<GetGroupsParams>({
    page: 1,
    limit: 10,
    status: "",
    sortBy: "created_at",
    order: "desc",
    search: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalGroups: 0,
    limit: 10,
  });

  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [pendingPagination, setPendingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedGroups: 0,
    limit: 10,
  });
  // const [pendingStatistics, setPendingStatistics] = useState({
  //   totalPendingReports: 0,
  //   totalReportedGroups: 0,
  // });

  const [pendingParams, setPendingParams] = useState<GetPendingReportsParams>({
    page: 1,
    limit: 10,
    type: "pending",
  });

  // State for pending search and sort
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [pendingSearchInput, setPendingSearchInput] = useState("");

  const [groupStatistics, setGroupStatistics] = useState({
    totalGroups: 0,
    totalGroupWithPendingReports: 0,
    totalGroupInvestigating: 0,
  });
  //=========================================================
  //================End State Variables=======================
  //=========================================================

  //*=========================================================
  //================Fetching Data=============================
  //*=========================================================

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllGroups(params);

      if (response.data.success) {
        const transformedGroups = response.data.data.groups.map((group) => ({
          _id: group._id,
          name: group.name,
          description: group.description,
          avatar_url: group.cover_url,
          cover_url: group.cover_url,
          privacy: group.privacy,
          admin: {
            _id: group.creator._id,
            fullName: group.creator.fullName,
            avatar_url: group.creator.avatar_url,
            username: group.creator.email?.split("@")[0] || "",
            email: group.creator.email,
          },
          membersCount: group.memberCount,
          postsCount: group.postCount,
          pendingRequests: group.pendingReportCount,
          reportCount: group.reportCount,
          pendingReportCount: group.pendingReportCount,
          severity: group.severity,
          status: group.status || "active",
          warningCount: group.warningCount,
          warnings: group.warnings,
          isActive: !group.status || group.status === "active",
          createdAt: group.created_at,
        }));

        setGroups(transformedGroups);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      Swal.fire("Error", "Failed to fetch groups", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, [searchTerm]);

  // Pending search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingSearchTerm(pendingSearchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [pendingSearchInput]);

  useEffect(() => {
    if (activeTab === "pending" || activeTab === "investigating") {
      setPendingParams((prev) => ({
        ...prev,
        search: pendingSearchTerm,
        page: 1,
      }));
    }
  }, [pendingSearchTerm]);

  const fetchPendingReports = async () => {
    try {
      setLoading(true);
      const response = await getPendingGroupReports(pendingParams);

      if (response.data.success) {
        setPendingReports(response.data.data.groupReports);

        const paginationData = response.data.data.pagination;
        let totalReportedGroups = 0;
        if (pendingParams.type === "pending") {
          totalReportedGroups = paginationData.totalPendingGroups || 0;
        } else if (pendingParams.type === "investigating") {
          totalReportedGroups = paginationData.totalInvestigatingGroups || 0;
        } else {
          totalReportedGroups = paginationData.totalReportedGroups || 0;
        }

        setPendingPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedGroups: totalReportedGroups,
          limit: paginationData.limit,
        });

        // setPendingStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching pending reports:", error);
      Swal.fire("Error", "Failed to fetch pending reports", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") {
      setPendingReports([]);
      setLoading(true);
      setPendingSearchInput("");
      setPendingSearchTerm("");
      setPendingParams((prev) => ({ ...prev, type: "pending", page: 1, search: "" }));
    } else if (activeTab === "investigating") {
      setPendingReports([]);
      setLoading(true);
      setPendingSearchInput("");
      setPendingSearchTerm("");
      setPendingParams((prev) => ({ ...prev, type: "investigating", page: 1, search: "" }));
    }
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === "pending" || activeTab === "investigating") {
      fetchPendingReports();
    }
  }, [
    pendingParams.page,
    pendingParams.type,
    pendingParams.limit,
    pendingParams.search,
    pendingParams.sortBy,
    pendingParams.order,
    activeTab,
  ]);

  const fetchGroupStatistics = async () => {
    try {
      const response = await getGroupStatistics();
      if (response.data.success) {
        setGroupStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching group statistics:", error);
    }
  };
  useEffect(() => {
    fetchGroupStatistics();
  }, []);
  //=========================================================
  //================End Fetching==============================
  //=========================================================

  //*=========================================================
  //================Event Handlers============================
  //*=========================================================

  const handleSort = (field: string) => {
    setParams((prev) => {
      const newOrder = prev.sortBy === field && prev.order === "desc" ? "asc" : "desc";
      return {
        ...prev,
        sortBy: field,
        order: newOrder,
        page: 1,
      };
    });
  };

  const handlePendingSort = (field: string) => {
    setPendingParams((prev) => {
      const newOrder = prev.sortBy === field && prev.order === "desc" ? "asc" : "desc";
      return {
        ...prev,
        sortBy: field,
        order: newOrder,
        page: 1,
      };
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handlePendingSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingSearchInput(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handlePendingPageChange = (page: number) => {
    setPendingParams((prev) => ({ ...prev, page }));
  };

  const handleSelectPendingGroup = (groupId: string) => {
    setSelectedPendingGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSelectAllPendingGroups = () => {
    if (selectedPendingGroups.length === pendingReports.length) {
      setSelectedPendingGroups([]);
    } else {
      setSelectedPendingGroups(pendingReports.map((item) => item.groupId));
    }
  };

  const handleMarkAsInvestigating = async () => {
    if (selectedPendingGroups.length === 0) {
      Swal.fire("Warning", "Please select at least one group", "warning");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Mark as Investigating?",
        text: `Move ${selectedPendingGroups.length} group(s) to investigating status?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7C3AED",
        cancelButtonColor: "#9CA3AF",
        confirmButtonText: "Yes, mark as investigating",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setLoading(true);

        let successCount = 0;
        let failureCount = 0;

        for (const groupId of selectedPendingGroups) {
          try {
            await markGroupAsInvestigating(groupId);
            successCount++;
          } catch (error) {
            console.error(`Failed to mark group ${groupId}:`, error);
            failureCount++;
          }
        }

        if (successCount > 0) {
          Swal.fire({
            title: "Success!",
            text: `${successCount} group(s) marked as investigating${
              failureCount > 0 ? `, ${failureCount} failed` : ""
            }`,
            icon: successCount === selectedPendingGroups.length ? "success" : "warning",
          });

          // Refresh data
          await Promise.all([fetchPendingReports(), fetchGroupStatistics(), fetchGroups()]);
          setSelectedPendingGroups([]);
        } else {
          Swal.fire("Error", "Failed to mark groups as investigating", "error");
        }
      }
    } catch (error) {
      console.error("Error marking groups as investigating:", error);
      Swal.fire("Error", "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAllReports = async (groupId: string) => {
    try {
      const result = await Swal.fire({
        title: "Dismiss All Reports?",
        text: "This will dismiss all pending reports for this group and reset its status to active.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#9CA3AF",
        confirmButtonText: "Yes, dismiss all",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setLoading(true);

        const response = await dismissAllPendingReportsOfGroup(groupId);

        if (response.data.success) {
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#7C3AED",
          });

          // Refresh data
          await Promise.all([fetchPendingReports(), fetchGroupStatistics(), fetchGroups()]);
          setSelectedPendingGroups([]);
        }
      }
    } catch (error: any) {
      console.error("Error dismissing reports:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to dismiss reports",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendWarning = async (data: SendWarningRequest & { groupId: string }) => {
    try {
      setLoading(true);

      const response = await sendWarningToGroup(data.groupId, {
        reason: data.reason,
        adminNote: data.adminNote,
        violationType: data.violationType,
      });

      if (response.data.success) {
        Swal.fire({
          title: "Warning Sent!",
          html: `
            <div class="text-left">
              <p class="mb-2">${response.data.message}</p>
              <ul class="list-disc ml-5 text-sm">
                <li>Warning Count: ${response.data.data.warningCount}</li>
                <li>Severity: ${response.data.data.severity}</li>
                <li>Resolved Reports: ${response.data.data.resolvedReports}</li>
              </ul>
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#7C3AED",
        });

        // Refresh data
        await Promise.all([fetchPendingReports(), fetchGroupStatistics(), fetchGroups()]);
        setSelectedPendingGroups([]);
      }
    } catch (error: any) {
      console.error("Error sending warning:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to send warning",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  //=========================================================
  //================End Event Handlers===========================
  //=========================================================
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push("...");
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing page {currentPage} of {totalPages} ({pagination.totalGroups} total groups)
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              className={`px-3 py-1 border rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              } ${page === "..." ? "cursor-default" : ""}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderPendingPagination = () => {
    const { currentPage, totalPages } = pendingPagination;
    const pages = [];

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing page {currentPage} of {totalPages} ({pendingPagination.totalReportedGroups} total groups)
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePendingPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePendingPageChange(page)}
              disabled={page === "..."}
              className={`px-3 py-1 border rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              } ${page === "..." ? "cursor-default" : ""}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePendingPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title="Group Management">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Groups</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.totalActiveGroups}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {statistics.totalPosts.toLocaleString()}
                </p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {statistics.totalMembers.toLocaleString()}
                </p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deleted Groups</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.totalDeletedGroups}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Groups Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Table Header */}
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Groups</h2>
            </div>

            {/* Search Input */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={activeTab === "all" ? searchInput : pendingSearchInput}
                    onChange={activeTab === "all" ? handleSearchChange : handlePendingSearchChange}
                    placeholder={activeTab === "all" ? "Search groups by name..." : "Search pending groups by name..."}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex space-x-1 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                All Groups ({groupStatistics.totalGroups})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "pending"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Pending ({groupStatistics.totalGroupWithPendingReports})
              </button>
              <button
                onClick={() => setActiveTab("investigating")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "investigating"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Investigating ({groupStatistics.totalGroupInvestigating})
              </button>
              <button
                onClick={() => setActiveTab("resolved")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "resolved"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Bulk Actions for Pending Tab */}
          {selectedPendingGroups.length > 0 && activeTab === "pending" && (
            <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedPendingGroups.length} group
                  {selectedPendingGroups.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleMarkAsInvestigating}
                    className="flex items-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Mark as Investigating
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : activeTab === "all" ? (
            <AllGroups
              groups={groups}
              onRefresh={fetchGroups}
              sortBy={params.sortBy || "created_at"}
              sortOrder={params.order || "desc"}
              onSort={handleSort}
            />
          ) : activeTab === "pending" ? (
            <PendingGroups
              groupReports={pendingReports}
              selectedGroups={selectedPendingGroups}
              onSelectGroup={handleSelectPendingGroup}
              onSelectAll={handleSelectAllPendingGroups}
              onDismissAllReports={handleDismissAllReports}
              onSendWarning={handleSendWarning}
              onRefresh={fetchPendingReports}
              sortBy={pendingParams.sortBy || ""}
              sortOrder={pendingParams.order || "desc"}
              onSort={handlePendingSort}
            />
          ) : activeTab === "investigating" ? (
            <PendingGroups
              groupReports={pendingReports}
              onDismissAllReports={handleDismissAllReports}
              onSendWarning={handleSendWarning}
              onRefresh={fetchPendingReports}
              sortBy={pendingParams.sortBy || ""}
              sortOrder={pendingParams.order || "desc"}
              onSort={handlePendingSort}
            />
          ) : activeTab === "resolved" ? (
            <ResolvedGroups onRefresh={fetchGroups} />
          ) : (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500 dark:text-gray-400">This tab is under development</p>
            </div>
          )}

          {/* Pagination */}
          {activeTab === "all" && !loading && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">{renderPagination()}</div>
          )}

          {/* Pending Pagination */}
          {(activeTab === "pending" || activeTab === "investigating") && !loading && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {pendingReports.length > 0 ? (
                renderPendingPagination()
              ) : (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  No {activeTab} groups found
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default GroupManagement;
