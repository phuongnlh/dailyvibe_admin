import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Image,
  Loader,
  MessageCircle,
  MoreVertical,
  RefreshCw,
  Search,
  Shield,
  User,
  UserX,
  Video,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  bulkUpdateReports,
  getAllReports,
  getReportStats,
  resolveReport,
  updateReportStatus,
  type BulkUpdateReportsData,
  type ReportListQuery,
  type ResolveReportData,
  type UpdateReportStatusData,
} from "../api/report";
import AdminLayout from "../components/AdminLayout";

const ReportsManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch reports data
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const query: ReportListQuery = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      // Apply tab filters
      switch (selectedTab) {
        case "pending":
          query.status = "pending";
          break;
        case "investigating":
          query.status = "investigating";
          break;
        case "resolved":
          query.status = "resolved";
          break;
        case "high_priority":
          query.priority = "high";
          break;
      }

      const response = await getAllReports(query);
      if (response.data.success) {
        setReports(response.data.data.reports);
        setTotalPages(response.data.data.pagination.pages);
      } else {
        setError("Failed to fetch reports");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch reports");
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getReportStats({ timeframe: "30d" });
      if (response.data.success) {
        const data = response.data.data;
        const overview = data.overview;

        setStats([
          {
            title: "Total Reports",
            value: overview.totalReports?.toString() || "0",
            icon: Flag,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
          },
          {
            title: "Pending Review",
            value: overview.pendingReports?.toString() || "0",
            icon: Clock,
            color: "bg-gradient-to-r from-orange-500 to-orange-600",
          },
          {
            title: "High Priority",
            value: data.reportTypeStats?.filter((s: any) => s.priority === "high")?.length?.toString() || "0",
            icon: AlertTriangle,
            color: "bg-gradient-to-r from-red-500 to-red-600",
          },
          {
            title: "Resolved Today",
            value: overview.resolvedReports?.toString() || "0",
            icon: CheckCircle,
            color: "bg-gradient-to-r from-green-500 to-green-600",
          },
        ]);
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  // Handle report status update
  const handleStatusUpdate = async (reportId: string, data: UpdateReportStatusData) => {
    try {
      setActionLoading(reportId);
      const response = await updateReportStatus(reportId, data);
      if (response.data.success) {
        await fetchReports(); // Refresh data
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update report");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle resolve report
  const handleResolveReport = async (reportId: string, resolution: string, actionTaken?: string) => {
    try {
      setActionLoading(reportId);
      const data: ResolveReportData = {
        resolution,
        actionTaken: actionTaken as any,
      };
      const response = await resolveReport(reportId, data);
      if (response.data.success) {
        await fetchReports(); // Refresh data
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resolve report");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: "investigate" | "resolve" | "reject") => {
    if (selectedReports.length === 0) return;

    try {
      setActionLoading("bulk");
      let updates = {};

      switch (action) {
        case "investigate":
          updates = { status: "investigating" };
          break;
        case "resolve":
          updates = { status: "resolved" };
          break;
        case "reject":
          updates = { status: "dismissed" };
          break;
      }

      const data: BulkUpdateReportsData = {
        reportIds: selectedReports,
        updates: updates as any,
      };

      const response = await bulkUpdateReports(data);
      if (response.data.success) {
        setSelectedReports([]);
        await fetchReports(); // Refresh data
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to perform bulk action");
    } finally {
      setActionLoading(null);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [selectedTab, currentPage, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchReports();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const tabs = [
    { id: "all", label: "All Reports", count: reports.length },
    {
      id: "pending",
      label: "Pending",
      count: reports.filter((r) => r.status === "pending").length,
    },
    {
      id: "investigating",
      label: "Investigating",
      count: reports.filter((r) => r.status === "investigating").length,
    },
    {
      id: "resolved",
      label: "Resolved",
      count: reports.filter((r) => r.status === "resolved").length,
    },
    {
      id: "high_priority",
      label: "High Priority",
      count: reports.filter((r) => r.priority === "high").length,
    },
  ];

  // Since we're now filtering on the backend, we use all reports
  const filteredReports = reports;

  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "investigating":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      case "resolved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "harassment":
        return <UserX className="w-4 h-4" />;
      case "spam":
        return <Ban className="w-4 h-4" />;
      case "inappropriate_content":
        return <AlertTriangle className="w-4 h-4" />;
      case "fake_news":
        return <AlertCircle className="w-4 h-4" />;
      case "copyright":
        return <Shield className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle className="w-4 h-4" />;
      case "post":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-2xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout title="Reports Management">
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
              <button
                onClick={() => {
                  setError(null);
                  fetchReports();
                }}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats
            ? stats.map((stat: any, index: number) => <StatCard key={index} {...stat} />)
            : // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  </div>
                </div>
              ))}
        </div>

        {/* Reports Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Reports & Violations</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Review and investigate user reports and content violations
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      selectedTab === tab.id
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReports.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedReports.length} report
                  {selectedReports.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction("investigate")}
                    disabled={actionLoading === "bulk"}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Investigate
                  </button>
                  <button
                    onClick={() => handleBulkAction("resolve")}
                    disabled={actionLoading === "bulk"}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Resolve
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    disabled={actionLoading === "bulk"}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredReports.length === 0 ? (
              // Empty state
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? `No reports match your search for "${searchQuery}"`
                    : "There are no reports to display at this time."}
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    {/* Report Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report._id)}
                          onChange={() => handleSelectReport(report._id)}
                          className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                              {getTypeIcon(report.reportType)}
                              <span className="text-sm font-medium capitalize">
                                {report.reportType.replace("_", " ")}
                              </span>
                            </div>

                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                report.priority
                              )}`}
                            >
                              {report.priority} priority
                            </span>

                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {report.status}
                            </span>

                            {report.previousReports > 0 && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full">
                                {report.previousReports} prev. reports
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{report.reason}</h3>

                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Reported by {report.reportedBy?.fullName || "Unknown User"}
                            </h4>
                            <span className="text-sm text-gray-500">@{report.reportedBy?.username || "unknown"}</span>
                            <span>•</span>
                            <span>{formatDate(report.createdAt)}</span>
                            {report.assignedTo && (
                              <>
                                <span>•</span>
                                <span>Assigned to {report.assignedTo.username || report.assignedTo.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Target Content */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={report.reportedUser?.avatar_url || "/default-avatar.png"}
                          alt={report.reportedUser?.fullName || report.reportedUser?.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {report.reportedUser?.fullName || "Unknown User"}
                            </h4>
                            <span className="text-sm text-gray-500">@{report.reportedUser?.username || "unknown"}</span>
                            <div className="flex items-center space-x-1 text-gray-500">
                              {getContentIcon("post")}
                              <span className="text-xs capitalize">Post</span>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {report.reportedPost?.content || "Content not available"}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              Post ID: {report.reportedPost?._id || report.reportedPost}
                            </span>
                            <button className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center space-x-1">
                              <ExternalLink className="w-3 h-3" />
                              <span>View original</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Report Description */}
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{report.description}</p>
                    </div>

                    {/* Evidence */}
                    {report.evidence && report.evidence.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Evidence ({report.evidence.length} item
                          {report.evidence.length !== 1 ? "s" : ""})
                        </h5>
                        <div className="flex space-x-2">
                          {report.evidence.map((evidence: any, index: number) => (
                            <button
                              key={index}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              {evidence.type.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Taken */}
                    {report.actionTaken && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-1 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-400">Action Taken</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">{report.actionTaken}</p>
                      </div>
                    )}

                    {/* Resolution */}
                    {report.resolution && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-1 mb-1">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Resolution</span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{report.resolution}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 mr-1" />
                          Investigate
                        </button>
                        <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <User className="w-4 h-4 mr-1" />
                          View User
                        </button>
                        <button className="flex items-center px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Content
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(report._id, {
                                  status: "investigating",
                                })
                              }
                              disabled={actionLoading === report._id}
                              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Investigate
                            </button>
                            <button
                              onClick={() => handleResolveReport(report._id, "Report reviewed and resolved", "none")}
                              disabled={actionLoading === report._id}
                              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === report._id ? (
                                <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4 inline mr-1" />
                              )}
                              Resolve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(report._id, {
                                  status: "dismissed",
                                })
                              }
                              disabled={actionLoading === report._id}
                              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4 inline mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {report.status === "investigating" && (
                          <button
                            onClick={() => handleResolveReport(report._id, "Investigation completed", "warning_sent")}
                            disabled={actionLoading === report._id}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === report._id ? (
                              <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                            ) : (
                              "Take Action"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredReports.length > 0 && (
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          currentPage === pageNum
                            ? "bg-purple-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default ReportsManagement;
