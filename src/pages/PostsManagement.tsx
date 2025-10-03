import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  Lock,
  Unlock,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const PostsManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  const posts = [
    {
      id: 1,
      type: "text",
      author: "John Doe",
      authorAvatar: "/default-avatar.png",
      content:
        "Just had an amazing day at the beach! The weather was perfect and the sunset was breathtaking. Can't wait to go back next weekend! 🌅",
      media: null,
      createdAt: "2024-03-15T10:30:00Z",
      likes: 245,
      comments: 32,
      shares: 18,
      views: 1250,
      status: "published",
      isReported: false,
      reportCount: 0,
    },
    {
      id: 2,
      type: "image",
      author: "Jane Smith",
      authorAvatar: "/default-avatar.png",
      content: "New artwork I've been working on! What do you think? 🎨",
      media: {
        type: "image",
        url: "/sample-image.jpg",
        thumbnail: "/sample-image-thumb.jpg",
      },
      createdAt: "2024-03-15T08:15:00Z",
      likes: 892,
      comments: 127,
      shares: 64,
      views: 4520,
      status: "published",
      isReported: true,
      reportCount: 3,
    },
    {
      id: 3,
      type: "video",
      author: "Mike Johnson",
      authorAvatar: "/default-avatar.png",
      content: "Quick tutorial on how to make the perfect coffee at home ☕",
      media: {
        type: "video",
        url: "/sample-video.mp4",
        thumbnail: "/sample-video-thumb.jpg",
        duration: "2:45",
      },
      createdAt: "2024-03-14T16:45:00Z",
      likes: 1523,
      comments: 89,
      shares: 156,
      views: 8750,
      status: "published",
      isReported: false,
      reportCount: 0,
    },
    {
      id: 4,
      type: "text",
      author: "Sarah Wilson",
      authorAvatar: "/default-avatar.png",
      content:
        "This post contains inappropriate content that has been flagged by multiple users...",
      media: null,
      createdAt: "2024-03-14T12:20:00Z",
      likes: 12,
      comments: 45,
      shares: 2,
      views: 320,
      status: "hidden",
      isReported: true,
      reportCount: 15,
    },
  ];

  const stats = [
    {
      title: "Total Posts",
      value: "24.8K",
      change: 12.5,
      icon: FileText,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Published Today",
      value: "156",
      change: 8.3,
      icon: TrendingUp,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Reported Posts",
      value: "23",
      change: -15.2,
      icon: Flag,
      color: "bg-gradient-to-r from-red-500 to-red-600",
    },
    {
      title: "Hidden Posts",
      value: "8",
      change: -25.0,
      icon: Eye,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
  ];

  const tabs = [
    { id: "all", label: "All Posts", count: posts.length },
    {
      id: "published",
      label: "Published",
      count: posts.filter((p) => p.status === "published").length,
    },
    {
      id: "reported",
      label: "Reported",
      count: posts.filter((p) => p.isReported).length,
    },
    {
      id: "hidden",
      label: "Hidden",
      count: posts.filter((p) => p.status === "hidden").length,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    switch (selectedTab) {
      case "published":
        return post.status === "published";
      case "reported":
        return post.isReported;
      case "hidden":
        return post.status === "hidden";
      default:
        return true;
    }
  });

  const handleSelectPost = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((post) => post.id));
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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
      title="Posts Management"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Posts Management" },
      ]}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Posts Management
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage and moderate user posts
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
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

                {/* Date Range */}
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Date Range
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
          {selectedPosts.length > 0 && (
            <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedPosts.length} post
                  {selectedPosts.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    <Unlock className="w-4 h-4 inline mr-1" />
                    Publish
                  </button>
                  <button className="px-3 py-1 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Hide
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedPosts.length === filteredPosts.length &&
                        filteredPosts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {post.media ? (
                            <div className="relative">
                              <img
                                src={post.media.thumbnail || post.media.url}
                                alt="Post media"
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="absolute top-1 right-1 p-1 bg-black/50 rounded">
                                {getMediaIcon(post.media.type)}
                              </div>
                              {post.media.type === "video" && (
                                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 text-white text-xs rounded">
                                  {post.media.duration}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            {getMediaIcon(post.type)}
                            <span className="text-xs text-gray-500 capitalize">
                              {post.type} post
                            </span>
                            {post.isReported && (
                              <div className="flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span className="text-xs text-red-600">
                                  {post.reportCount} reports
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-3 h-3" />
                          <span>{post.shares}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : post.status === "hidden"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                        {post.status === "published" ? (
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </button>
                        ) : (
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </button>
                        )}
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing 1 to {filteredPosts.length} of {posts.length} results
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
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default PostsManagement;
