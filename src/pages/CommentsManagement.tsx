import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Reply,
  Flag,
  Trash2,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  Ban,
  Heart,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ThumbsUp,
  ThumbsDown,
  User,
} from "lucide-react";

const CommentsManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [expandedComment, setExpandedComment] = useState<number | null>(null);

  const comments = [
    {
      id: 1,
      content:
        "Great post! Really helpful information about social media trends.",
      author: {
        id: 101,
        name: "John Doe",
        username: "@johndoe",
        avatar: "/avatar-1.jpg",
        verified: true,
      },
      post: {
        id: 501,
        title: "Social Media Marketing Tips 2024",
        excerpt: "The latest trends in social media marketing...",
      },
      createdAt: "2024-03-15T10:30:00Z",
      updatedAt: null,
      status: "approved",
      likes: 24,
      dislikes: 2,
      replies: 3,
      sentiment: "positive",
      flagCount: 0,
      isEdited: false,
      parentId: null,
      moderationScore: 0.95,
      language: "en",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      content:
        "This is completely wrong! You have no idea what you're talking about. Absolute garbage content.",
      author: {
        id: 102,
        name: "Angry User",
        username: "@angryuser",
        avatar: "/avatar-2.jpg",
        verified: false,
      },
      post: {
        id: 502,
        title: "Climate Change Discussion",
        excerpt: "Understanding the science behind climate change...",
      },
      createdAt: "2024-03-14T16:45:00Z",
      updatedAt: "2024-03-14T16:50:00Z",
      status: "flagged",
      likes: 1,
      dislikes: 18,
      replies: 0,
      sentiment: "negative",
      flagCount: 5,
      isEdited: true,
      parentId: null,
      moderationScore: 0.23,
      language: "en",
      ipAddress: "192.168.1.101",
    },
    {
      id: 3,
      content: "Thank you for sharing this! Very insightful analysis.",
      author: {
        id: 103,
        name: "Jane Smith",
        username: "@janesmith",
        avatar: "/avatar-3.jpg",
        verified: true,
      },
      post: {
        id: 501,
        title: "Social Media Marketing Tips 2024",
        excerpt: "The latest trends in social media marketing...",
      },
      createdAt: "2024-03-14T14:20:00Z",
      updatedAt: null,
      status: "approved",
      likes: 12,
      dislikes: 0,
      replies: 1,
      sentiment: "positive",
      flagCount: 0,
      isEdited: false,
      parentId: 1,
      moderationScore: 0.89,
      language: "en",
      ipAddress: "192.168.1.102",
    },
    {
      id: 4,
      content:
        "I disagree with some points but appreciate the discussion. Here's my perspective...",
      author: {
        id: 104,
        name: "Mike Johnson",
        username: "@mikej",
        avatar: "/avatar-4.jpg",
        verified: false,
      },
      post: {
        id: 503,
        title: "Political Discussion Thread",
        excerpt: "Open discussion about current political events...",
      },
      createdAt: "2024-03-13T20:15:00Z",
      updatedAt: null,
      status: "pending",
      likes: 5,
      dislikes: 3,
      replies: 2,
      sentiment: "neutral",
      flagCount: 1,
      isEdited: false,
      parentId: null,
      moderationScore: 0.67,
      language: "en",
      ipAddress: "192.168.1.103",
    },
    {
      id: 5,
      content: "Spam link here: buy-cheap-products.scam.com - Amazing deals!",
      author: {
        id: 105,
        name: "Spammer Bot",
        username: "@spambot",
        avatar: "/avatar-5.jpg",
        verified: false,
      },
      post: {
        id: 504,
        title: "Technology Reviews",
        excerpt: "Latest gadget reviews and recommendations...",
      },
      createdAt: "2024-03-12T11:30:00Z",
      updatedAt: null,
      status: "blocked",
      likes: 0,
      dislikes: 12,
      replies: 0,
      sentiment: "neutral",
      flagCount: 8,
      isEdited: false,
      parentId: null,
      moderationScore: 0.05,
      language: "en",
      ipAddress: "192.168.1.104",
    },
    {
      id: 6,
      content:
        "Could you provide more sources for this claim? I'd like to read more about it.",
      author: {
        id: 106,
        name: "Sarah Wilson",
        username: "@sarahw",
        avatar: "/avatar-6.jpg",
        verified: true,
      },
      post: {
        id: 502,
        title: "Climate Change Discussion",
        excerpt: "Understanding the science behind climate change...",
      },
      createdAt: "2024-03-11T09:45:00Z",
      updatedAt: null,
      status: "approved",
      likes: 8,
      dislikes: 1,
      replies: 4,
      sentiment: "neutral",
      flagCount: 0,
      isEdited: false,
      parentId: null,
      moderationScore: 0.91,
      language: "en",
      ipAddress: "192.168.1.105",
    },
  ];

  const stats = [
    {
      title: "Total Comments",
      value: "45.2K",
      change: 12.5,
      icon: MessageCircle,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Pending Review",
      value: "127",
      change: -8.3,
      icon: Clock,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      title: "Flagged Comments",
      value: "23",
      change: -15.2,
      icon: Flag,
      color: "bg-gradient-to-r from-red-500 to-red-600",
    },
    {
      title: "Auto-Moderated",
      value: "892",
      change: 25.8,
      icon: Shield,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ];

  const tabs = [
    { id: "all", label: "All Comments", count: comments.length },
    {
      id: "approved",
      label: "Approved",
      count: comments.filter((c) => c.status === "approved").length,
    },
    {
      id: "pending",
      label: "Pending",
      count: comments.filter((c) => c.status === "pending").length,
    },
    {
      id: "flagged",
      label: "Flagged",
      count: comments.filter((c) => c.status === "flagged").length,
    },
    {
      id: "blocked",
      label: "Blocked",
      count: comments.filter((c) => c.status === "blocked").length,
    },
  ];

  const filteredComments = comments.filter((comment) => {
    switch (selectedTab) {
      case "approved":
        return comment.status === "approved";
      case "pending":
        return comment.status === "pending";
      case "flagged":
        return comment.status === "flagged";
      case "blocked":
        return comment.status === "blocked";
      default:
        return true;
    }
  });

  const handleSelectComment = (commentId: number) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map((comment) => comment.id));
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "negative":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "flagged":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "blocked":
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
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
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500 mr-1 transform rotate-180" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
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
    <AdminLayout
      title="Comments Management"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Comments Management" },
      ]}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Comments Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Comments Moderation
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Review and moderate user comments across all posts
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search comments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filter */}
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Filter
                  </span>
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
          {selectedComments.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedComments.length} comment
                  {selectedComments.length !== 1 ? "s" : ""} selected
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

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedComments.includes(comment.id)}
                        onChange={() => handleSelectComment(comment.id)}
                        className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />

                      <div>
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {comment.author.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {comment.author.username}
                          </span>
                          {comment.author.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                          {comment.isEdited && (
                            <span className="text-xs text-gray-400">
                              (edited)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{formatDate(comment.createdAt)}</span>
                          <span>•</span>
                          <span>on "{comment.post.title}"</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Status Badge */}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          comment.status
                        )}`}
                      >
                        {comment.status}
                      </span>

                      {/* Sentiment Badge */}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getSentimentColor(
                          comment.sentiment
                        )}`}
                      >
                        {comment.sentiment}
                      </span>

                      {/* More Actions */}
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="ml-16 mb-4">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  {/* Comment Stats */}
                  <div className="ml-16 flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.dislikes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Reply className="w-4 h-4" />
                        <span>{comment.replies} replies</span>
                      </div>
                      {comment.flagCount > 0 && (
                        <div className="flex items-center space-x-1 text-red-500">
                          <Flag className="w-4 h-4" />
                          <span>{comment.flagCount} flags</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Moderation Score */}
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Score: {(comment.moderationScore * 100).toFixed(0)}%
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        {comment.status === "pending" && (
                          <>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <Ban className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details (Expandable) */}
                  {expandedComment === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="ml-16 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            User ID:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {comment.author.id}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            IP Address:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {comment.ipAddress}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Language:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {comment.language.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Post ID:
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {comment.post.id}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Toggle Details */}
                  <div className="ml-16 mt-3">
                    <button
                      onClick={() =>
                        setExpandedComment(
                          expandedComment === comment.id ? null : comment.id
                        )
                      }
                      className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center space-x-1"
                    >
                      {expandedComment === comment.id ? (
                        <>
                          <ArrowUp className="w-3 h-3" />
                          <span>Hide details</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-3 h-3" />
                          <span>Show details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing 1 to {filteredComments.length} of {comments.length}{" "}
              results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg">
                1
              </button>
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

export default CommentsManagement;
