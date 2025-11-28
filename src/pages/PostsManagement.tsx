import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  Lock,
  Search,
  SortAsc,
  SortDesc,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";
import AdminLayout from "../components/AdminLayout";
import { ViewPost } from "../components/ViewPost";
import { AllPostsTab } from "../components/Post_Report/Tabs/AllPostsTab";
import { PendingTab } from "../components/Post_Report/Tabs/PendingTab";
import { InvestigatingTab } from "../components/Post_Report/Tabs/InvestigatingTab";
import { ResolvedTab } from "../components/Post_Report/Tabs/ResolvedTab";
import { updateUserStatus } from "../api/admin";
import {
  dismissAllPendingReportsOfPost,
  getPendingPostReports,
  markPostAsInvestigating,
  getPostStatistics,
  type PostReportItem,
  type GetPostReportsParams,
  type ResolvedPostReportItem,
  getResolvedPostReports,
} from "../api/post";
import type { GetResolvedReportsParams } from "../api/group";

interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  hasMedia?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
  severity?: string;
  is_deleted?: string;
}

interface Post {
  _id: string;
  content: string;
  type: string;
  media?: Array<{
    url: string;
    thumbnail?: string;
    type: string;
    duration?: string;
  }>;
  user_id: {
    _id: string;
    fullName: string;
    avatar_url: string;
    username: string;
  };
  reactionCount: number;
  commentCount: number;
  sharesCount: number;
  viewCount: number;
  reportCount: number;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  reportStatus?: string;
  pendingReportCount: number;
  hasAds: boolean;
  severity: string;
}

const PostsManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedViewPost, setSelectedViewPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [pendingReports, setPendingReports] = useState<PostReportItem[]>([]);
  const [investigatingReports, setInvestigatingReports] = useState<
    PostReportItem[]
  >([]);
  const [resolvedReports, setResolvedReports] = useState<
    ResolvedPostReportItem[]
  >([]);

  // Phân trang cho Pending tab
  const [pendingPagination, setPendingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedPosts: 0,
    limit: 10,
  });

  // Phân trang cho Investigating tab
  const [investigatingPagination, setInvestigatingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedPosts: 0,
    limit: 10,
  });

  // Phân trang cho Resolved tab
  const [resolvedPagination, setResolvedPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedPosts: 0,
    limit: 10,
  });

  const [pendingParams, setPendingParams] = useState<GetPostReportsParams>({
    page: 1,
    limit: 10,
    type: "pending",
  });

  const [investigatingParams, setInvestigatingParams] =
    useState<GetPostReportsParams>({
      page: 1,
      limit: 10,
      type: "investigating",
    });

  const [resolvedParams, setResolvedParams] =
    useState<GetResolvedReportsParams>({
      page: 1,
      limit: 10,
      sortBy: "resolvedDate",
      order: "desc",
    });

  const [postStatistics, setPostStatistics] = useState({
    totalPosts: 0,
    totalPostsWithPendingReports: 0,
    totalPostsInvestigating: 0,
  });

  // Phân trang cho All Posts tab
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    type: "",
    hasMedia: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    dateFrom: "",
    dateTo: "",
    severity: "",
    is_deleted: "",
  });

  const [stats, setStats] = useState({
    totalPosts: 0,
    postsToday: 0,
    reportedPosts: 0,
    deletedPosts: 0,
  });

  // Fetch post statistics
  const fetchPostStatistics = useCallback(async () => {
    try {
      const response = await getPostStatistics();
      if (response.data.success) {
        setPostStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching post statistics:", error);
    }
  }, []);

  useEffect(() => {
    fetchPostStatistics();
  }, [fetchPostStatistics]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const [resPost, resStats] = await Promise.all([
        api.get(`/posts?${queryParams.toString()}`),
        api.get("/posts/stats"),
      ]);

      setPosts(resPost.data.data.posts || []);
      setPagination(resPost.data.data.pagination || {});
      setStats(resStats.data.data || {});
    } catch (error) {
      console.error("Error fetching posts:", error);
      Swal.fire("Error", "Failed to fetch posts", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (activeTab === "all") {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (filters.search !== undefined) {
        setFilters((prev) => ({ ...prev, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filters.search]);

  const fetchPendingReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPendingPostReports(pendingParams);

      if (response.data.success) {
        setPendingReports(response.data.data.postReports);

        const paginationData = response.data.data.pagination;
        setPendingPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedPosts: paginationData.totalReportedPosts,
          limit: paginationData.limit,
        });
      }
    } catch (error) {
      console.error("Error fetching pending reports:", error);
      Swal.fire("Error", "Failed to fetch pending reports", "error");
    } finally {
      setLoading(false);
    }
  }, [pendingParams]);

  const fetchInvestigatingReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPendingPostReports(investigatingParams);

      if (response.data.success) {
        setInvestigatingReports(response.data.data.postReports);

        const paginationData = response.data.data.pagination;
        setInvestigatingPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedPosts: paginationData.totalReportedPosts,
          limit: paginationData.limit,
        });
      }
    } catch (error) {
      console.error("Error fetching investigating reports:", error);
      Swal.fire("Error", "Failed to fetch investigating reports", "error");
    } finally {
      setLoading(false);
    }
  }, [investigatingParams]);

  const fetchResolvedReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getResolvedPostReports(resolvedParams);

      if (response.data.success) {
        setResolvedReports(response.data.data.postReports);

        const paginationData = response.data.data.pagination;
        setResolvedPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedPosts: paginationData.totalPosts,
          limit: paginationData.limit,
        });
      }
    } catch (error) {
      console.error("Error fetching resolved reports:", error);
      Swal.fire("Error", "Failed to fetch resolved reports", "error");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams]);

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingReports();
    } else if (activeTab === "investigating") {
      fetchInvestigatingReports();
    } else if (activeTab === "resolved") {
      fetchResolvedReports();
    }
  }, [
    activeTab,
    fetchPendingReports,
    fetchInvestigatingReports,
    fetchResolvedReports,
  ]);

  const handleDismissAllReports = async (postId: string) => {
    try {
      await dismissAllPendingReportsOfPost(postId);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "All reports have been dismissed",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh data based on current tab
      if (activeTab === "pending") {
        fetchPendingReports();
      } else if (activeTab === "investigating") {
        fetchInvestigatingReports();
      }

      // Refresh statistics
      fetchPostStatistics();
    } catch (error) {
      console.error("Error dismissing reports:", error);
      Swal.fire("Error", "Failed to dismiss reports", "error");
    }
  };

  const handleMarkInvestigating = async (postId: string) => {
    try {
      await markPostAsInvestigating(postId);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Post marked as investigating",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh both tabs and statistics
      fetchPendingReports();
      fetchInvestigatingReports();
      fetchPostStatistics();
    } catch (error) {
      console.error("Error marking as investigating:", error);
      Swal.fire("Error", "Failed to mark post as investigating", "error");
    }
  };

  const handleBulkMarkInvestigating = async (postIds: string[]) => {
    if (postIds.length === 0) return;

    try {
      Swal.fire({
        title: "Processing...",
        text: `Marking ${postIds.length} post(s) as investigating`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call API for each post
      const promises = postIds.map((postId) => markPostAsInvestigating(postId));
      await Promise.all(promises);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${postIds.length} post(s) marked as investigating`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Clear selections
      setSelectedPosts([]);

      // Refresh both tabs and statistics
      fetchPendingReports();
      fetchInvestigatingReports();
      fetchPostStatistics();
    } catch (error) {
      console.error("Error in bulk mark as investigating:", error);
      Swal.fire("Error", "Failed to mark posts as investigating", "error");
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await updateUserStatus(userId, "block");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User has been banned",
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh both tabs and statistics after banning user
      if (activeTab === "pending") {
        fetchPendingReports();
      } else if (activeTab === "investigating") {
        fetchInvestigatingReports();
      }
      fetchPostStatistics();
    } catch (error) {
      console.error("Error banning user:", error);
      Swal.fire("Error", "Failed to ban user", "error");
    }
  };

  const handlePendingSort = (field: string) => {
    setPendingParams((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleInvestigatingSort = (field: string) => {
    setInvestigatingParams((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (key: keyof PostFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: newSortOrder,
    }));
  };

  const handleResolvedSort = (field: string) => {
    setResolvedParams((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    if (activeTab === "all") {
      handleFilterChange("page", page);
    } else if (activeTab === "pending") {
      setPendingParams((prev) => ({ ...prev, page }));
    } else if (activeTab === "investigating") {
      setInvestigatingParams((prev) => ({ ...prev, page }));
    } else if (activeTab === "resolved") {
      setResolvedParams((prev) => ({ ...prev, page }));
    }
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: "",
      type: "",
      hasMedia: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      dateFrom: "",
      dateTo: "",
      severity: "",
      is_deleted: "",
    });
  };

  const renderSortIcon = (field: string) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === "asc" ? (
      <SortAsc className="w-4 h-4 ml-1" />
    ) : (
      <SortDesc className="w-4 h-4 ml-1" />
    );
  };

  // Tabs configuration
  const tabs = [
    {
      id: "all",
      label: "All Posts",
      icon: FileText,
      count: postStatistics.totalPosts,
    },
    {
      id: "pending",
      label: "Pending Reports",
      icon: Clock,
      count: postStatistics.totalPostsWithPendingReports,
    },
    {
      id: "investigating",
      label: "Investigating",
      icon: Flag,
      count: postStatistics.totalPostsInvestigating,
    },
    {
      id: "resolved",
      label: "Resolved",
      icon: CheckCircle,
    },
  ];

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handlePostAction = async (
    postId: string,
    action: "delete" | "restore"
  ) => {
    const actionText = action === "delete" ? "delete" : "restore";

    Swal.fire({
      title: `Are you sure you want to ${actionText} this post?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: `Yes, ${actionText}!`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const is_deleted = action === "delete";
          await api.patch(`/posts/${postId}`, { is_deleted });
          Swal.fire("Success!", `Post has been ${actionText}ed.`, "success");

          // Refresh data based on current tab
          if (activeTab === "pending") {
            fetchPendingReports();
          } else if (activeTab === "investigating") {
            fetchInvestigatingReports();
          } else if (activeTab === "all") {
            fetchPosts();
          }

          fetchPostStatistics();
        } catch (error) {
          Swal.fire("Error", `Failed to ${actionText} post.`, "error");
          console.error(`Error ${actionText}ing post:`, error);
        }
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Public":
        return <Globe className="w-4 h-4" />;
      case "Friends":
        return <User className="w-4 h-4" />;
      case "Private":
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPagination = () => {
    // Chọn pagination data dựa trên tab hiện tại
    let currentPagination = pagination;

    if (activeTab === "pending") {
      currentPagination = {
        currentPage: pendingPagination.currentPage,
        totalPages: pendingPagination.totalPages,
        limit: pendingPagination.limit,
        totalCount: pendingPagination.totalReportedPosts,
        hasNextPage:
          pendingPagination.currentPage < pendingPagination.totalPages,
        hasPrevPage: pendingPagination.currentPage > 1,
      };
    } else if (activeTab === "investigating") {
      currentPagination = {
        currentPage: investigatingPagination.currentPage,
        totalPages: investigatingPagination.totalPages,
        limit: investigatingPagination.limit,
        totalCount: investigatingPagination.totalReportedPosts,
        hasNextPage:
          investigatingPagination.currentPage <
          investigatingPagination.totalPages,
        hasPrevPage: investigatingPagination.currentPage > 1,
      };
    } else if (activeTab === "resolved") {
      currentPagination = {
        currentPage: resolvedPagination.currentPage,
        totalPages: resolvedPagination.totalPages,
        limit: resolvedPagination.limit,
        totalCount: resolvedPagination.totalReportedPosts,
        hasNextPage:
          resolvedPagination.currentPage < resolvedPagination.totalPages,
        hasPrevPage: resolvedPagination.currentPage > 1,
      };
    }

    const pages = [];
    const maxVisible = 5;
    const start = Math.max(
      1,
      currentPagination.currentPage - Math.floor(maxVisible / 2)
    );
    const end = Math.min(currentPagination.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            i === currentPagination.currentPage
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
          Showing{" "}
          {Math.min(
            (currentPagination.currentPage - 1) * currentPagination.limit + 1,
            currentPagination.totalCount
          )}{" "}
          to{" "}
          {Math.min(
            currentPagination.currentPage * currentPagination.limit,
            currentPagination.totalCount
          )}{" "}
          of {currentPagination.totalCount} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPagination.currentPage - 1)}
            disabled={!currentPagination.hasPrevPage}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex space-x-1">{pages}</div>

          <button
            onClick={() => handlePageChange(currentPagination.currentPage + 1)}
            disabled={!currentPagination.hasNextPage}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
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
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-2xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    const commonProps = {
      posts,
      selectedPosts,
      handleSelectPost,
      handlePostAction,
      setSelectedViewPost,
      getTypeIcon,
      formatDate,
      handleSort,
      renderSortIcon,
    };

    switch (activeTab) {
      case "all":
        return <AllPostsTab {...commonProps} />;
      case "pending":
        return (
          <PendingTab
            postReports={pendingReports}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={() => {
              if (selectedPosts.length === pendingReports.length) {
                setSelectedPosts([]);
              } else {
                setSelectedPosts(pendingReports.map((item) => item.postId));
              }
            }}
            onDismissAllReports={handleDismissAllReports}
            handlePostAction={handlePostAction}
            onMarkInvestigating={handleMarkInvestigating}
            onBulkMarkInvestigating={handleBulkMarkInvestigating}
            onRefresh={fetchPendingReports}
            sortBy={pendingParams.sortBy || ""}
            sortOrder={pendingParams.order || "desc"}
            onSort={handlePendingSort}
            setSelectedViewPost={setSelectedViewPost}
            getTypeIcon={getTypeIcon}
            onBanUser={handleBanUser}
          />
        );
      case "investigating":
        return (
          <InvestigatingTab
            postReports={investigatingReports}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={() => {
              if (selectedPosts.length === investigatingReports.length) {
                setSelectedPosts([]);
              } else {
                setSelectedPosts(
                  investigatingReports.map((item) => item.postId)
                );
              }
            }}
            onDismissAllReports={handleDismissAllReports}
            handlePostAction={handlePostAction}
            onRefresh={fetchInvestigatingReports}
            sortBy={investigatingParams.sortBy || ""}
            sortOrder={investigatingParams.order || "desc"}
            onSort={handleInvestigatingSort}
            setSelectedViewPost={setSelectedViewPost}
            getTypeIcon={getTypeIcon}
            onBanUser={handleBanUser}
          />
        );
      case "resolved":
        return (
          <ResolvedTab
            postReports={resolvedReports}
            onRefresh={fetchResolvedReports}
            sortBy={resolvedParams.sortBy || ""}
            sortOrder={resolvedParams.order || "desc"}
            onSort={handleResolvedSort}
          />
        );
      default:
        return <AllPostsTab {...commonProps} />;
    }
  };

  return (
    <AdminLayout title="Posts Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Posts Today"
            value={stats.postsToday}
            icon={TrendingUp}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={FileText}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Reported Posts"
            value={stats.reportedPosts}
            icon={Flag}
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
          <StatCard
            title="Deleted Posts"
            value={stats.deletedPosts}
            icon={Eye}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Posts Management
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and moderate user posts
                </p>
              </div>

              {activeTab === "all" && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search || ""}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      placeholder="Search posts..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Filter
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Filters - Only show for "all" tab */}
            {activeTab === "all" && (
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Post Type
                      </label>
                      <select
                        value={filters.type || ""}
                        onChange={(e) =>
                          handleFilterChange("type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Types</option>
                        <option value="Public">Public</option>
                        <option value="Friends">Friends</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>

                    {/* Media Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Media
                      </label>
                      <select
                        value={filters.hasMedia || ""}
                        onChange={(e) =>
                          handleFilterChange("hasMedia", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All</option>
                        <option value="true">With Media</option>
                        <option value="false">Text Only</option>
                      </select>
                    </div>

                    {/* Severity Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Severity
                      </label>
                      <select
                        value={filters.severity || ""}
                        onChange={(e) =>
                          handleFilterChange("severity", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={filters.is_deleted || ""}
                        onChange={(e) =>
                          handleFilterChange("is_deleted", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Status</option>
                        <option value="false">Published</option>
                        <option value="true">Deleted</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
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
            )}

            {/* Tabs */}
            <div className="flex space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedPosts([]); // Clear selections when switching tabs
                    }}
                    className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {renderPagination()}
          </div>
        </motion.div>
      </div>
      {selectedViewPost && (
        <ViewPost
          post={selectedViewPost}
          onClose={() => setSelectedViewPost(null)}
        />
      )}
    </AdminLayout>
  );
};

export default PostsManagement;
