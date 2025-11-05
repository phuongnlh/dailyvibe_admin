import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Flag,
  Megaphone,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { updateUserStatus } from "../api/admin";
import {
  approveAd,
  deleteAd,
  dismissAllPendingReportsOfAd,
  getAdReportStats,
  getAdsPostReportsByStatus,
  getAdStats,
  getAllAds,
  getResolvedAdsPostReports,
  markAdAsInvestigating,
  pauseAd,
  rejectAd,
  resumeAd,
  type Ad,
  type AdsPostReportItem,
  type GetAdsParams,
  type GetAdsPostReportsParams,
  type GetResolvedAdsPostReportsParams,
  type ResolvedAdsPostReportItem,
} from "../api/ads";
import AdminLayout from "../components/AdminLayout";
import { AllAdsTab } from "../components/Ads/Tabs/AllAds";
import { InvestigatingAdsTab } from "../components/Ads/Tabs/InvestigatingAdsTab";
import { PendingAdsTab } from "../components/Ads/Tabs/PendingTab";
import { ResolvedAdsTab } from "../components/Ads/Tabs/ResolvedTab";
import { ViewPost } from "../components/ViewPost";

interface AdFilters extends GetAdsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  min_views?: number;
  max_views?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

const AdsManagement: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [selectedViewAd, setSelectedViewAd] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [pendingReports, setPendingReports] = useState<AdsPostReportItem[]>([]);

  const [investigatingReports, setInvestigatingReports] = useState<AdsPostReportItem[]>([]);
  const [resolvedReports, setResolvedReports] = useState<ResolvedAdsPostReportItem[]>([]);

  // Pagination for Pending tab
  const [pendingPagination, setPendingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedAds: 0,
    limit: 10,
  });

  // Pagination for Investigating tab
  const [investigatingPagination, setInvestigatingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedAds: 0,
    limit: 10,
  });

  // Pagination for Resolved tab
  const [resolvedPagination, setResolvedPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReportedAds: 0,
    limit: 10,
  });

  const [pendingParams, setPendingParams] = useState<GetAdsPostReportsParams>({
    page: 1,
    limit: 10,
    status: "pending",
    sortBy: "latestReportDate",
    sortOrder: "desc",
  });

  const [investigatingParams, setInvestigatingParams] = useState<GetAdsPostReportsParams>({
    page: 1,
    limit: 10,
    status: "investigating",
    sortBy: "latestReportDate",
    sortOrder: "desc",
  });

  const [resolvedParams, setResolvedParams] = useState<GetResolvedAdsPostReportsParams>({
    page: 1,
    limit: 10,
    sortBy: "resolvedDate",
    sortOrder: "desc",
  });

  const [adStatistics, setAdStatistics] = useState({
    totalAds: 0,
    totalPending: 0,
    totalInvestigating: 0,
  });

  // Pagination for All Ads tab
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState<AdFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    sort_by: "created_at",
    sort_order: "desc",
    start_date: "",
    end_date: "",
  });

  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    completedAds: 0,
    pendingReviewAds: 0,
    totalRevenue: {
      VND: 0,
      USD: 0,
    },
    totalViews: 0,
    totalInteractions: 0,
  });

  // Fetch ad statistics
  // const fetchAdStatistics = useCallback(async () => {
  //   try {
  //     const response = await getAdStatistics();
  //   } catch (error) {
  //     console.error("Error fetching ad statistics:", error);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchAdStatistics();
  // }, [fetchAdStatistics]);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const [resAd, resStats] = await Promise.all([getAllAds(filters), getAdStats()]);

      setAds(resAd.data.data.docs || []);
      setPagination({
        page: resAd.data.data.page,
        totalPages: resAd.data.data.totalPages,
        limit: resAd.data.data.limit,
        totalDocs: resAd.data.data.totalDocs,
        hasNextPage: resAd.data.data.hasNextPage,
        hasPrevPage: resAd.data.data.hasPrevPage,
      });
      const statsData = resStats.data.data;
      setStats({
        totalAds: statsData.totalAds || 0,
        activeAds: statsData.activeAds || 0,
        completedAds: statsData.completedAds || 0,
        pendingReviewAds: statsData.pendingReviewAds || 0,
        totalRevenue: {
          VND: statsData.totalRevenue?.VND || 0,
          USD: statsData.totalRevenue?.USD || 0,
        },
        totalViews: statsData.totalViews || 0,
        totalInteractions: statsData.totalInteractions || 0,
      });
    } catch (error) {
      console.error("Error fetching ads:", error);
      Swal.fire("Error", "Failed to fetch ads", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (activeTab === "all") {
      fetchAds();
    }
  }, [activeTab, fetchAds]);

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
      const response = await getAdsPostReportsByStatus(pendingParams);

      if (response.data.success) {
        setPendingReports(response.data.data.postReports);

        const paginationData = response.data.data.pagination;
        setPendingPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedAds: paginationData.totalPosts,
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
      const response = await getAdsPostReportsByStatus(investigatingParams);

      if (response.data.success) {
        setInvestigatingReports(response.data.data.postReports);

        const paginationData = response.data.data.pagination;
        setInvestigatingPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedAds: paginationData.totalPosts,
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
      const response = await getResolvedAdsPostReports(resolvedParams);

      if (response.data.success) {
        setResolvedReports(response.data.data.postReports);

        const paginationData = response.data.data.pagination;
        setResolvedPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalReportedAds: paginationData.totalPosts,
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

  const fetchAdReportStats = useCallback(async () => {
    try {
      const response = await getAdReportStats();
      if (response.data.success) {
        setAdStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ad report statistics:", error);
    }
  }, []);

  useEffect(() => {
    fetchAdReportStats();
  }, [fetchAdReportStats]);

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingReports();
      fetchAdReportStats();
    } else if (activeTab === "investigating") {
      fetchInvestigatingReports();
      fetchAdReportStats();
    } else if (activeTab === "resolved") {
      fetchResolvedReports();
      fetchAdReportStats();
    } else if (activeTab === "all") {
      fetchAds();
    }
  }, [activeTab, fetchPendingReports, fetchInvestigatingReports, fetchResolvedReports, fetchAds, fetchAdReportStats]);

  const handleDismissAllReports = async (postId: string) => {
    try {
      await dismissAllPendingReportsOfAd(postId);

      // Refresh current tab
      if (activeTab === "pending") {
        await fetchPendingReports();
      } else if (activeTab === "investigating") {
        await fetchInvestigatingReports();
      }

      // Refresh statistics
      // await fetchAdStatistics();
      await fetchAdReportStats();
    } catch (error) {
      console.error("Error dismissing reports:", error);
      throw error;
    }
  };

  const handleMarkInvestigating = async (postId: string) => {
    try {
      await markAdAsInvestigating(postId);

      // Refresh pending reports and fetch investigating
      await fetchPendingReports();
      await fetchInvestigatingReports();

      // Refresh statistics
      // await fetchAdStatistics();
      await fetchAdReportStats();
    } catch (error) {
      console.error("Error marking as investigating:", error);
      throw error;
    }
  };

  const handleBulkMarkInvestigating = async (postIds: string[]) => {
    const result = await Swal.fire({
      title: "Mark as Investigating?",
      text: `Mark ${postIds.length} post(s) as investigating?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark them",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        // Call API for each post
        await Promise.all(postIds.map((id) => markAdAsInvestigating(id)));

        await fetchPendingReports();
        await fetchInvestigatingReports();
        // await fetchAdStatistics();
        await fetchAdReportStats();

        setSelectedAds([]);

        Swal.fire({
          title: "Success!",
          text: "Posts marked as investigating",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error in bulk mark investigating:", error);
        Swal.fire("Error", "Failed to mark posts as investigating", "error");
      } finally {
        setLoading(false);
      }
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
      // fetchAdStatistics();
      fetchAdReportStats();
    } catch (error) {
      console.error("Error banning user:", error);
      Swal.fire("Error", "Failed to ban user", "error");
    }
  };

  const handlePendingSort = (field: string) => {
    setPendingParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const handleInvestigatingSort = (field: string) => {
    setInvestigatingParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof AdFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = filters.sort_by === sortBy && filters.sort_order === "asc" ? "desc" : "asc";
    setFilters((prev) => ({
      ...prev,
      sort_by: sortBy,
      sort_order: newSortOrder,
    }));
  };

  const handleResolvedSort = (field: string) => {
    setResolvedParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
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
      sort_by: "created_at",
      sort_order: "desc",
      start_date: "",
      end_date: "",
    });
  };

  const renderSortIcon = (field: string) => {
    if (filters.sort_by !== field) return null;
    return filters.sort_order === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  // Tabs configuration
  const tabs = [
    {
      id: "all",
      label: "All Ads",
      icon: Megaphone,
      count: stats.totalAds,
    },
    {
      id: "pending",
      label: "Pending Reports",
      icon: Clock,
      count: adStatistics.totalPending,
    },
    {
      id: "investigating",
      label: "Investigating",
      icon: Flag,
      count: adStatistics.totalInvestigating,
    },
    {
      id: "resolved",
      label: "Resolved",
      icon: CheckCircle,
    },
  ];

  const handleSelectAd = (adId: string) => {
    setSelectedAds((prev) => (prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]));
  };

  const handleSelectAllPosts = () => {
    if (activeTab === "pending") {
      if (selectedAds.length === pendingReports.length) {
        setSelectedAds([]);
      } else {
        setSelectedAds(pendingReports.map((item) => item.postId));
      }
    }
  };

  const handleAdAction = async (adId: string, action: "delete" | "pause" | "resume" | "approve" | "reject") => {
    const actionText = {
      delete: "delete",
      pause: "pause",
      resume: "resume",
      approve: "approve",
      reject: "reject",
    }[action];

    Swal.fire({
      title: `Are you sure you want to ${actionText} this ad?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: `Yes, ${actionText}!`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          switch (action) {
            case "delete":
              await deleteAd(adId);
              break;
            case "pause":
              await pauseAd(adId);
              break;
            case "resume":
              await resumeAd(adId);
              break;
            case "approve":
              await approveAd(adId);
              break;
            case "reject":
              await rejectAd(adId);
              break;
          }
          Swal.fire("Success!", `Ad has been ${actionText}ed.`, "success");

          // Refresh data based on current tab
          if (activeTab === "pending") {
            fetchPendingReports();
          } else if (activeTab === "investigating") {
            fetchInvestigatingReports();
          } else if (activeTab === "all") {
            fetchAds();
          }

          // fetchAdStatistics();
          fetchAdReportStats();
        } catch (error) {
          Swal.fire("Error", `Failed to ${actionText} ad.`, "error");
          console.error(`Error ${actionText}ing ad:`, error);
        }
      }
    });
  };

  const convertAdToPost = (ad: any) => {
    if (!ad) return null;

    // Check if it's already a converted post object (from PendingTab/InvestigatingTab)
    if (ad._id && ad.user_id && !ad.post) {
      // Already converted, return as is
      return ad;
    }

    // Original Ad object conversion
    return {
      _id: ad.post._id,
      content: ad.post.content,
      type: ad.post.type,
      media: ad.post.media,
      user_id: {
        _id: ad.user._id,
        fullName: ad.user.fullName,
        avatar_url: ad.user.avatar_url,
        username: ad.user.username,
      },
      reactionCount: ad.total_interactions,
      commentCount: 0,
      sharesCount: 0,
      viewCount: ad.current_views,
      reportCount: ad.post.reportCount || 0,
      pendingReportCount: ad.post.pendingReportCount || 0,
      is_deleted: ad.deleted_at !== null,
      createdAt: ad.post.createdAt,
      updatedAt: ad.updated_at,
      hasAds: true,
      severity: ad.severity || "none",
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const renderPagination = () => {
    let currentPagination = pagination;

    if (activeTab === "pending") {
      currentPagination = {
        page: pendingPagination.currentPage,
        totalPages: pendingPagination.totalPages,
        limit: pendingPagination.limit,
        totalDocs: pendingPagination.totalReportedAds,
        hasNextPage: pendingPagination.currentPage < pendingPagination.totalPages,
        hasPrevPage: pendingPagination.currentPage > 1,
      };
    } else if (activeTab === "investigating") {
      currentPagination = {
        page: investigatingPagination.currentPage,
        totalPages: investigatingPagination.totalPages,
        limit: investigatingPagination.limit,
        totalDocs: investigatingPagination.totalReportedAds,
        hasNextPage: investigatingPagination.currentPage < investigatingPagination.totalPages,
        hasPrevPage: investigatingPagination.currentPage > 1,
      };
    } else if (activeTab === "resolved") {
      currentPagination = {
        page: resolvedPagination.currentPage,
        totalPages: resolvedPagination.totalPages,
        limit: resolvedPagination.limit,
        totalDocs: resolvedPagination.totalReportedAds,
        hasNextPage: resolvedPagination.currentPage < resolvedPagination.totalPages,
        hasPrevPage: resolvedPagination.currentPage > 1,
      };
    }

    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(currentPagination.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            i === currentPagination.page
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
          Showing {Math.min((currentPagination.page - 1) * currentPagination.limit + 1, currentPagination.totalDocs)} to{" "}
          {Math.min(currentPagination.page * currentPagination.limit, currentPagination.totalDocs)} of{" "}
          {currentPagination.totalDocs} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPagination.page - 1)}
            disabled={!currentPagination.hasPrevPage}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex space-x-1">{pages}</div>

          <button
            onClick={() => handlePageChange(currentPagination.page + 1)}
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            {typeof value === "object" && value !== null ? (
              <div className="space-y-0.5">
                {Object.entries(value)
                  .filter(([_, amount]) => (amount as number) > 0)
                  .map(([currency, amount]) => (
                    <p key={currency} className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {formatCurrency(amount as number, currency)}
                    </p>
                  ))}
                {Object.values(value).every((amount) => amount === 0) && (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">$0</p>
                )}
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            )}
          </div>
          <div className={`p-3 rounded-2xl ${color} flex-shrink-0`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <AllAdsTab
            ads={ads}
            handleAdAction={handleAdAction}
            setSelectedViewAd={setSelectedViewAd}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        );
      case "pending":
        return (
          <PendingAdsTab
            postReports={pendingReports}
            selectedPosts={selectedAds}
            onSelectPost={handleSelectAd}
            onSelectAll={handleSelectAllPosts}
            onDismissAllReports={handleDismissAllReports}
            handleAdAction={handleAdAction}
            onMarkInvestigating={handleMarkInvestigating}
            onBulkMarkInvestigating={handleBulkMarkInvestigating}
            onRefresh={fetchPendingReports}
            sortBy={pendingParams.sortBy}
            sortOrder={pendingParams.sortOrder}
            onSort={handlePendingSort}
            setSelectedViewPost={setSelectedViewAd}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            onBanUser={handleBanUser}
          />
        );
      case "investigating":
        return (
          <InvestigatingAdsTab
            postReports={investigatingReports}
            onDismissAllReports={handleDismissAllReports}
            handleAdAction={handleAdAction}
            onRefresh={fetchInvestigatingReports}
            sortBy={investigatingParams.sortBy}
            sortOrder={investigatingParams.sortOrder}
            onSort={handleInvestigatingSort}
            setSelectedViewPost={setSelectedViewAd}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
            onBanUser={handleBanUser}
          />
        );
      case "resolved":
        return (
          <ResolvedAdsTab
            postReports={resolvedReports}
            onRefresh={fetchResolvedReports}
            sortBy={resolvedParams.sortBy}
            sortOrder={resolvedParams.sortOrder}
            onSort={handleResolvedSort}
            setSelectedViewPost={setSelectedViewAd}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Ads Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Ads"
            value={stats.activeAds}
            icon={TrendingUp}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Total Ads"
            value={stats.totalAds}
            icon={Megaphone}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            icon={DollarSign}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Views"
            value={formatNumber(stats.totalViews)}
            icon={Eye}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Ads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ads Management</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and moderate advertising campaigns
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
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      placeholder="Search ads..."
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
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                        value={filters.status || ""}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                        <option value="pending_review">Pending Review</option>
                        <option value="rejected">Rejected</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={filters.start_date || ""}
                        onChange={(e) => handleFilterChange("start_date", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={filters.end_date || ""}
                        onChange={(e) => handleFilterChange("end_date", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
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
                      setSelectedAds([]);
                      if (tab.id !== "all") {
                        fetchAdReportStats();
                      } else {
                        fetchAds();
                      }
                    }}
                    className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
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
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">{renderPagination()}</div>
        </motion.div>
      </div>

      {selectedViewAd && <ViewPost post={convertAdToPost(selectedViewAd)} onClose={() => setSelectedViewAd(null)} />}
    </AdminLayout>
  );
};

export default AdsManagement;
