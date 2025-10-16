import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import {
  Image,
  Video,
  FileText,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Grid3X3,
  List,
  Search,
  Filter,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Calendar,
  HardDrive,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const MediaManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");

  const mediaFiles = [
    {
      id: 1,
      name: "beach_sunset.jpg",
      type: "image",
      url: "/sample-image-1.jpg",
      thumbnail: "/sample-image-1-thumb.jpg",
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadedBy: "John Doe",
      uploadedAt: "2024-03-15T10:30:00Z",
      downloads: 245,
      status: "approved",
      isNSFW: false,
    },
    {
      id: 2,
      name: "coffee_tutorial.mp4",
      type: "video",
      url: "/sample-video-1.mp4",
      thumbnail: "/sample-video-1-thumb.jpg",
      size: "15.7 MB",
      dimensions: "1280x720",
      duration: "2:45",
      uploadedBy: "Mike Johnson",
      uploadedAt: "2024-03-14T16:45:00Z",
      downloads: 89,
      status: "approved",
      isNSFW: false,
    },
    {
      id: 3,
      name: "artwork_digital.png",
      type: "image",
      url: "/sample-image-2.png",
      thumbnail: "/sample-image-2-thumb.png",
      size: "5.2 MB",
      dimensions: "2560x1440",
      uploadedBy: "Jane Smith",
      uploadedAt: "2024-03-15T08:15:00Z",
      downloads: 156,
      status: "pending",
      isNSFW: false,
    },
    {
      id: 4,
      name: "inappropriate_content.jpg",
      type: "image",
      url: "/sample-image-3.jpg",
      thumbnail: "/sample-image-3-thumb.jpg",
      size: "1.8 MB",
      dimensions: "1024x768",
      uploadedBy: "Anonymous User",
      uploadedAt: "2024-03-13T20:30:00Z",
      downloads: 12,
      status: "flagged",
      isNSFW: true,
    },
    {
      id: 5,
      name: "presentation_slides.pdf",
      type: "document",
      url: "/sample-document.pdf",
      thumbnail: "/pdf-icon.png",
      size: "3.1 MB",
      dimensions: "A4",
      uploadedBy: "Sarah Wilson",
      uploadedAt: "2024-03-12T14:20:00Z",
      downloads: 78,
      status: "approved",
      isNSFW: false,
    },
    {
      id: 6,
      name: "music_video.mp4",
      type: "video",
      url: "/sample-video-2.mp4",
      thumbnail: "/sample-video-2-thumb.jpg",
      size: "24.5 MB",
      dimensions: "1920x1080",
      duration: "4:12",
      uploadedBy: "DJ Alex",
      uploadedAt: "2024-03-11T11:30:00Z",
      downloads: 234,
      status: "approved",
      isNSFW: false,
    },
  ];

  const stats = [
    {
      title: "Total Files",
      value: "12.4K",
      change: 8.5,
      icon: HardDrive,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Storage Used",
      value: "2.4 TB",
      change: 12.3,
      icon: HardDrive,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Pending Review",
      value: "23",
      change: -15.2,
      icon: AlertCircle,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      title: "Downloads Today",
      value: "1.2K",
      change: 25.8,
      icon: Download,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ];

  const tabs = [
    { id: "all", label: "All Media", count: mediaFiles.length },
    {
      id: "images",
      label: "Images",
      count: mediaFiles.filter((f) => f.type === "image").length,
    },
    {
      id: "videos",
      label: "Videos",
      count: mediaFiles.filter((f) => f.type === "video").length,
    },
    {
      id: "documents",
      label: "Documents",
      count: mediaFiles.filter((f) => f.type === "document").length,
    },
    {
      id: "flagged",
      label: "Flagged",
      count: mediaFiles.filter((f) => f.status === "flagged").length,
    },
  ];

  const filteredMedia = mediaFiles.filter((file) => {
    switch (selectedTab) {
      case "images":
        return file.type === "image";
      case "videos":
        return file.type === "video";
      case "documents":
        return file.type === "document";
      case "flagged":
        return file.status === "flagged";
      default:
        return true;
    }
  });

  const handleSelectMedia = (mediaId: number) => {
    setSelectedMedia((prev) => (prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]));
  };

  const handleSelectAll = () => {
    if (selectedMedia.length === filteredMedia.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(filteredMedia.map((file) => file.id));
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
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

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredMedia.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 group"
        >
          {/* Checkbox */}
          <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              type="checkbox"
              checked={selectedMedia.includes(file.id)}
              onChange={() => handleSelectMedia(file.id)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
          </div>

          {/* Status Badge */}
          {file.status !== "approved" && (
            <div className="absolute top-2 right-2 z-10">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  file.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : file.status === "flagged"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {file.status}
              </span>
            </div>
          )}

          {/* Media Preview */}
          <div className="aspect-square relative">
            {file.type === "video" ? (
              <div className="relative w-full h-full">
                <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {file.duration}
                </div>
              </div>
            ) : file.type === "image" ? (
              <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="p-3">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate mb-1">{file.name}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{file.size}</span>
              <span>{file.dimensions}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{file.downloads} downloads</span>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Eye className="w-3 h-3 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Download className="w-3 h-3 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedMedia.length === filteredMedia.length && filteredMedia.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMedia.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(file.id)}
                    onChange={() => handleSelectMedia(file.id)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10">
                      {file.type === "video" ? (
                        <div className="relative">
                          <img src={file.thumbnail} alt={file.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ) : file.type === "image" ? (
                        <img src={file.thumbnail} alt={file.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.dimensions}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-gray-900 dark:text-white capitalize">{file.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{file.size}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{file.uploadedBy}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      file.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : file.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                        : file.status === "flagged"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {file.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{file.downloads}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(file.uploadedAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </button>
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
    </div>
  );

  return (
    <AdminLayout title="Media Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Media Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Library</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage uploaded media files and content</p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Upload Button */}
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-800 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-800 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search media..."
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
          {selectedMedia.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedMedia.length} file
                  {selectedMedia.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Download className="w-4 h-4 inline mr-1" />
                    Download
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media Content */}
          {viewMode === "grid" ? <GridView /> : <ListView />}

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing 1 to {filteredMedia.length} of {mediaFiles.length} results
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

export default MediaManagement;
