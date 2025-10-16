import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Bot,
  User,
  Flag,
  Ban,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  MessageCircle,
  Image,
  Video,
  FileText,
  Star,
  Activity,
  Users,
  Zap,
} from "lucide-react";

const ModerationManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("auto_queue");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const moderationQueue = [
    {
      id: 1,
      type: "auto_flagged",
      contentType: "comment",
      content: "This is a stupid post and you're an idiot for writing it!",
      author: {
        id: 301,
        name: "Toxic User",
        username: "@toxicuser",
        avatar: "/avatar-1.jpg",
      },
      post: {
        id: 601,
        title: "Discussion about AI Ethics",
      },
      flaggedBy: "AI Moderator",
      reason: "Toxic language detected",
      confidence: 0.89,
      createdAt: "2024-03-15T10:30:00Z",
      status: "pending",
      aiTags: ["harassment", "toxic_language"],
      manualReview: false,
      appealable: true,
    },
    {
      id: 2,
      type: "user_reported",
      contentType: "image",
      content: "Inappropriate image shared in family group",
      author: {
        id: 302,
        name: "Problematic User",
        username: "@problemuser",
        avatar: "/avatar-2.jpg",
      },
      post: {
        id: 602,
        title: "Family Photo Sharing",
      },
      flaggedBy: "Sarah Wilson",
      reason: "NSFW content in family space",
      confidence: null,
      createdAt: "2024-03-14T16:45:00Z",
      status: "investigating",
      aiTags: ["nsfw", "inappropriate"],
      manualReview: true,
      appealable: true,
    },
    {
      id: 3,
      type: "auto_flagged",
      contentType: "post",
      content: "Buy crypto now! 1000% guaranteed returns! Contact me for amazing deals!",
      author: {
        id: 303,
        name: "Spam Bot",
        username: "@spambot456",
        avatar: "/avatar-3.jpg",
      },
      post: {
        id: 603,
        title: "Investment Discussion",
      },
      flaggedBy: "Spam Detector",
      reason: "Suspected spam/scam content",
      confidence: 0.96,
      createdAt: "2024-03-14T14:20:00Z",
      status: "pending",
      aiTags: ["spam", "scam", "financial_fraud"],
      manualReview: false,
      appealable: false,
    },
    {
      id: 4,
      type: "manual_review",
      contentType: "video",
      content: "Video content requires manual review due to complex context",
      author: {
        id: 304,
        name: "Content Creator",
        username: "@creator123",
        avatar: "/avatar-4.jpg",
      },
      post: {
        id: 604,
        title: "Educational Content",
      },
      flaggedBy: "Content Review Team",
      reason: "Complex content requiring human judgment",
      confidence: null,
      createdAt: "2024-03-13T20:15:00Z",
      status: "pending",
      aiTags: ["complex_review", "educational"],
      manualReview: true,
      appealable: true,
    },
    {
      id: 5,
      type: "appeal",
      contentType: "comment",
      content: "User appealing previous moderation decision",
      author: {
        id: 305,
        name: "Appealing User",
        username: "@appealuser",
        avatar: "/avatar-5.jpg",
      },
      post: {
        id: 605,
        title: "Political Discussion",
      },
      flaggedBy: "User Appeal",
      reason: "Appealing harassment flag - claims misunderstanding",
      confidence: null,
      createdAt: "2024-03-12T11:30:00Z",
      status: "under_appeal",
      aiTags: ["appeal", "harassment"],
      manualReview: true,
      appealable: false,
    },
  ];

  const stats = [
    {
      title: "Queue Items",
      value: "234",
      change: -8.5,
      icon: Activity,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Auto-Flagged",
      value: "156",
      change: 15.2,
      icon: Bot,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Manual Reviews",
      value: "45",
      change: -12.3,
      icon: Eye,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      title: "Actions Taken",
      value: "89",
      change: 25.8,
      icon: Shield,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ];

  const tabs = [
    {
      id: "auto_queue",
      label: "Auto Queue",
      count: moderationQueue.filter((i) => i.type === "auto_flagged").length,
    },
    {
      id: "manual_review",
      label: "Manual Review",
      count: moderationQueue.filter((i) => i.manualReview).length,
    },
    {
      id: "user_reports",
      label: "User Reports",
      count: moderationQueue.filter((i) => i.type === "user_reported").length,
    },
    {
      id: "appeals",
      label: "Appeals",
      count: moderationQueue.filter((i) => i.type === "appeal").length,
    },
    { id: "resolved", label: "Resolved", count: 156 },
  ];

  const filteredItems = moderationQueue.filter((item) => {
    switch (selectedTab) {
      case "auto_queue":
        return item.type === "auto_flagged";
      case "manual_review":
        return item.manualReview;
      case "user_reports":
        return item.type === "user_reported";
      case "appeals":
        return item.type === "appeal";
      case "resolved":
        return item.status === "resolved";
      default:
        return true;
    }
  });

  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "investigating":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      case "under_appeal":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400";
      case "resolved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "auto_flagged":
        return <Bot className="w-4 h-4" />;
      case "user_reported":
        return <Flag className="w-4 h-4" />;
      case "manual_review":
        return <Eye className="w-4 h-4" />;
      case "appeal":
        return <Star className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => {
    const isPositive = change >= 0;

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
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500 mr-1 transform rotate-180" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout title="Moderation Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Moderation Dashboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content Moderation Queue</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Review flagged content and take moderation actions
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* AI Settings */}
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Settings
                </button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search queue..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filter */}
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Filter</span>
                </button>
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
          {selectedItems.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    <Ban className="w-4 h-4 inline mr-1" />
                    Block
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Moderation Queue */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            {getTypeIcon(item.type)}
                            <span className="text-sm font-medium capitalize">{item.type.replace("_", " ")}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            {getContentIcon(item.contentType)}
                            <span className="text-sm capitalize">{item.contentType}</span>
                          </div>

                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                          >
                            {item.status.replace("_", " ")}
                          </span>

                          {item.confidence && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                              {Math.round(item.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.reason}</h3>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Flagged by {item.flaggedBy}</span>
                          <span>•</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.author.name}</h4>
                          <span className="text-sm text-gray-500">{item.author.username}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">{item.content}</p>
                        <div className="text-xs text-gray-500">From: {item.post.title}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Tags */}
                  {item.aiTags && item.aiTags.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">AI Detection Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {item.aiTags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full"
                          >
                            {tag.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </button>
                      <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <User className="w-4 h-4 mr-1" />
                        User Profile
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Approve
                      </button>
                      <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <XCircle className="w-4 h-4 inline mr-1" />
                        Reject
                      </button>
                      <button className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Ban className="w-4 h-4 inline mr-1" />
                        Block User
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing 1 to {filteredItems.length} of {moderationQueue.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                2
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default ModerationManagement;
