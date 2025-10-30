import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Pause,
  Play,
  Search,
  SortAsc,
  SortDesc,
  TrendingUp,
  Trash2,
  Video,
  DollarSign,
  Target,
} from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout";

interface Advertisement {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  advertiser: {
    _id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
  status: "Active" | "Paused" | "Ended" | "Pending";
  type: "Banner" | "Video" | "Sponsored Post" | "Story";
  placement: "Feed" | "Sidebar" | "Header" | "Footer" | "Story";
  targetViews: number; // Số view mục tiêu
  currentViews: number; // Số view hiện tại
  viewRate: number; // Tỷ lệ view (views/impressions * 100)
  impressions: number; // Số lần hiển thị
  costPerView: number; // Giá mỗi view (VNĐ)
  totalCost: number; // Tổng chi phí (currentViews * costPerView)
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface AdFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  type: string;
  placement: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Mock data với view-based model
const MOCK_ADS: Advertisement[] = [
  {
    _id: "1",
    title: "Summer Sale - Up to 50% Off",
    description: "Get amazing discounts on all products this summer",
    image_url: "https://picsum.photos/seed/ad1/800/400",
    link_url: "https://example.com/summer-sale",
    advertiser: {
      _id: "adv1",
      name: "TechStore VN",
      email: "contact@techstore.vn",
      avatar_url: "https://picsum.photos/seed/adv1/100",
    },
    status: "Active",
    type: "Banner",
    placement: "Feed",
    targetViews: 100000,
    currentViews: 65000,
    impressions: 125000,
    viewRate: 52.0,
    costPerView: 500,
    totalCost: 65000 * 500,
    startDate: "2024-10-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    createdAt: "2024-09-25T10:00:00Z",
  },
  {
    _id: "2",
    title: "New iPhone 15 Pro",
    description: "Pre-order now and get exclusive gifts",
    image_url: "https://picsum.photos/seed/ad2/800/400",
    link_url: "https://example.com/iphone-15",
    advertiser: {
      _id: "adv2",
      name: "Mobile World",
      email: "ads@mobileworld.com",
      avatar_url: "https://picsum.photos/seed/adv2/100",
    },
    status: "Active",
    type: "Video",
    placement: "Story",
    targetViews: 200000,
    currentViews: 156000,
    impressions: 250000,
    viewRate: 62.4,
    costPerView: 800,
    totalCost: 156000 * 800,
    startDate: "2024-09-15T00:00:00Z",
    endDate: "2024-11-30T23:59:59Z",
    createdAt: "2024-09-10T14:30:00Z",
  },
  {
    _id: "3",
    title: "Travel Package - Phu Quoc",
    description: "4 days 3 nights with amazing deals",
    image_url: "https://picsum.photos/seed/ad3/800/400",
    link_url: "https://example.com/travel-phuquoc",
    advertiser: {
      _id: "adv3",
      name: "Travel Hub",
      email: "marketing@travelhub.vn",
      avatar_url: "https://picsum.photos/seed/adv3/100",
    },
    status: "Paused",
    type: "Sponsored Post",
    placement: "Feed",
    targetViews: 50000,
    currentViews: 21000,
    impressions: 80000,
    viewRate: 26.25,
    costPerView: 600,
    totalCost: 21000 * 600,
    startDate: "2024-10-10T00:00:00Z",
    endDate: "2024-12-20T23:59:59Z",
    createdAt: "2024-10-05T09:15:00Z",
  },
  {
    _id: "4",
    title: "Fashion Week 2024",
    description: "Exclusive collection launching soon",
    image_url: "https://picsum.photos/seed/ad4/800/400",
    link_url: "https://example.com/fashion-week",
    advertiser: {
      _id: "adv4",
      name: "Fashion Nova",
      email: "contact@fashionnova.vn",
      avatar_url: "https://picsum.photos/seed/adv4/100",
    },
    status: "Active",
    type: "Banner",
    placement: "Sidebar",
    targetViews: 150000,
    currentViews: 84000,
    impressions: 180000,
    viewRate: 46.67,
    costPerView: 450,
    totalCost: 84000 * 450,
    startDate: "2024-10-05T00:00:00Z",
    endDate: "2024-11-25T23:59:59Z",
    createdAt: "2024-09-30T11:20:00Z",
  },
  {
    _id: "5",
    title: "Fitness App - Free Trial",
    description: "Get 30 days free premium membership",
    image_url: "https://picsum.photos/seed/ad5/800/400",
    link_url: "https://example.com/fitness-app",
    advertiser: {
      _id: "adv5",
      name: "FitLife App",
      email: "support@fitlife.com",
      avatar_url: "https://picsum.photos/seed/adv5/100",
    },
    status: "Ended",
    type: "Video",
    placement: "Feed",
    targetViews: 80000,
    currentViews: 80000,
    impressions: 150000,
    viewRate: 53.33,
    costPerView: 700,
    totalCost: 80000 * 700,
    startDate: "2024-08-01T00:00:00Z",
    endDate: "2024-10-01T23:59:59Z",
    createdAt: "2024-07-25T08:45:00Z",
  },
  {
    _id: "6",
    title: "Food Delivery - 50% Off",
    description: "First order discount for new users",
    image_url: "https://picsum.photos/seed/ad6/800/400",
    link_url: "https://example.com/food-delivery",
    advertiser: {
      _id: "adv6",
      name: "QuickEats",
      email: "ads@quickeats.vn",
      avatar_url: "https://picsum.photos/seed/adv6/100",
    },
    status: "Pending",
    type: "Sponsored Post",
    placement: "Feed",
    targetViews: 120000,
    currentViews: 0,
    impressions: 0,
    viewRate: 0,
    costPerView: 550,
    totalCost: 0,
    startDate: "2024-11-01T00:00:00Z",
    endDate: "2024-12-15T23:59:59Z",
    createdAt: "2024-10-20T13:30:00Z",
  },
  {
    _id: "7",
    title: "Gaming Laptop Sale",
    description: "High performance laptops with special prices",
    image_url: "https://picsum.photos/seed/ad7/800/400",
    link_url: "https://example.com/gaming-laptop",
    advertiser: {
      _id: "adv7",
      name: "TechGear Store",
      email: "sales@techgear.vn",
      avatar_url: "https://picsum.photos/seed/adv7/100",
    },
    status: "Active",
    type: "Banner",
    placement: "Header",
    targetViews: 180000,
    currentViews: 112000,
    impressions: 200000,
    viewRate: 56.0,
    costPerView: 650,
    totalCost: 112000 * 650,
    startDate: "2024-09-20T00:00:00Z",
    endDate: "2024-11-20T23:59:59Z",
    createdAt: "2024-09-15T15:00:00Z",
  },
  {
    _id: "8",
    title: "Real Estate Investment",
    description: "Premium apartments with high ROI",
    image_url: "https://picsum.photos/seed/ad8/800/400",
    link_url: "https://example.com/real-estate",
    advertiser: {
      _id: "adv8",
      name: "PropertyHub",
      email: "info@propertyhub.vn",
      avatar_url: "https://picsum.photos/seed/adv8/100",
    },
    status: "Active",
    type: "Video",
    placement: "Feed",
    targetViews: 300000,
    currentViews: 184000,
    impressions: 300000,
    viewRate: 61.33,
    costPerView: 900,
    totalCost: 184000 * 900,
    startDate: "2024-10-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    createdAt: "2024-09-25T10:30:00Z",
  },
];

const AdsManagement: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>(MOCK_ADS);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAds, setSelectedAds] = useState<string[]>([]);

  const [filters, setFilters] = useState<AdFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    type: "",
    placement: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalCount: MOCK_ADS.length,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const stats = {
    totalAds: MOCK_ADS.length,
    activeAds: MOCK_ADS.filter((ad) => ad.status === "Active").length,
    totalViews: MOCK_ADS.reduce((sum, ad) => sum + ad.currentViews, 0),
    totalRevenue: MOCK_ADS.reduce((sum, ad) => sum + ad.totalCost, 0),
  };

  const handleFilterChange = (key: keyof AdFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
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

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: "",
      type: "",
      placement: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const renderSortIcon = (field: string) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === "asc" ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />;
  };

  const handleAdAction = async (adId: string, action: "pause" | "resume" | "approve" | "reject") => {
    Swal.fire({
      title: `Are you sure you want to ${action} this ad?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: `Yes, ${action} it!`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setAds((prev) =>
          prev.map((ad) => {
            if (ad._id === adId) {
              if (action === "pause") return { ...ad, status: "Paused" as const };
              if (action === "resume") return { ...ad, status: "Active" as const };
              if (action === "approve") return { ...ad, status: "Active" as const };
              if (action === "reject") return { ...ad, status: "Ended" as const };
            }
            return ad;
          })
        );
        Swal.fire("Success!", `Ad has been ${action}ed.`, "success");
      }
    });
  };

  const handleDeleteAd = async (adId: string) => {
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
        setAds((prev) => prev.filter((ad) => ad._id !== adId));
        Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
      }
    });
  };

  const handleSelectAd = (adId: string) => {
    setSelectedAds((prev) => (prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]));
  };

  const handleSelectAll = () => {
    if (selectedAds.length === filteredAds.length) {
      setSelectedAds([]);
    } else {
      setSelectedAds(filteredAds.map((ad) => ad._id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Ended":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "Pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  const filteredAds = ads.filter((ad) => {
    if (filters.search && !ad.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && ad.status !== filters.status) return false;
    if (filters.type && ad.type !== filters.type) return false;
    if (filters.placement && ad.placement !== filters.placement) return false;
    return true;
  });

  return (
    <AdminLayout title="Ads Management">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ads</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalAds}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Ads</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeAds}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalViews)}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
                <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  4607$
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl">
                <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Advertisements</h2>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
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
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Ended">Ended</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Types</option>
                      <option value="Banner">Banner</option>
                      <option value="Video">Video</option>
                      <option value="Sponsored Post">Sponsored Post</option>
                      <option value="Story">Story</option>
                    </select>
                  </div>

                  {/* Placement Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Placement
                    </label>
                    <select
                      value={filters.placement}
                      onChange={(e) => handleFilterChange("placement", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Placements</option>
                      <option value="Feed">Feed</option>
                      <option value="Sidebar">Sidebar</option>
                      <option value="Header">Header</option>
                      <option value="Footer">Footer</option>
                      <option value="Story">Story</option>
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
          </div>

          {/* Bulk Actions */}
          {selectedAds.length > 0 && (
            <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedAds.length} ad{selectedAds.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                    <Pause className="w-4 h-4 inline mr-1" />
                    Pause Selected
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

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
                      <input
                        type="checkbox"
                        checked={selectedAds.length === filteredAds.length && filteredAds.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("title")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Advertisement
                        {renderSortIcon("title")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Advertiser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type / Placement
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("currentViews")}
                        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        View Progress
                        {renderSortIcon("currentViews")}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cost & Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAds.map((ad) => (
                    <tr key={ad._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAds.includes(ad._id)}
                          onChange={() => handleSelectAd(ad._id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={ad.image_url} alt={ad.title} className="w-16 h-10 rounded object-cover" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {ad.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={ad.advertiser.avatar_url}
                            alt={ad.advertiser.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.advertiser.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{ad.advertiser.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{ad.type}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ad.placement}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Target:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatNumber(ad.targetViews)} views
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Current:</span>
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {formatNumber(ad.currentViews)} views
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                ad.currentViews >= ad.targetViews
                                  ? "bg-green-600"
                                  : ad.currentViews >= ad.targetViews * 0.7
                                  ? "bg-blue-600"
                                  : "bg-purple-600"
                              }`}
                              style={{ width: `${Math.min((ad.currentViews / ad.targetViews) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                            {((ad.currentViews / ad.targetViews) * 100).toFixed(1)}% completed
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Cost/View:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(ad.costPerView)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Total Revenue:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(ad.totalCost)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-600">
                            <span className="text-gray-600 dark:text-gray-400">View Rate:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{ad.viewRate}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            ad.status
                          )}`}
                        >
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(ad.startDate)}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">to {formatDate(ad.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" title="View">
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                          {ad.status === "Active" && (
                            <button
                              onClick={() => handleAdAction(ad._id, "pause")}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                              title="Pause"
                            >
                              <Pause className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </button>
                          )}
                          {ad.status === "Paused" && (
                            <button
                              onClick={() => handleAdAction(ad._id, "resume")}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                              title="Resume"
                            >
                              <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </button>
                          )}
                          {ad.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleAdAction(ad._id, "approve")}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                title="Approve"
                              >
                                <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </button>
                              <button
                                onClick={() => handleAdAction(ad._id, "reject")}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                title="Reject"
                              >
                                <EyeOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </>
                          )}
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" title="Edit">
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteAd(ad._id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
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

export default AdsManagement;