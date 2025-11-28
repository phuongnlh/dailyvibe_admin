import { Eye, FileText, Heart, Megaphone, MessageCircle, Share2, Shield, Trash2, Unlock } from "lucide-react";
import React, { type JSX } from "react";

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
  pendingReportCount: number;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  hasAds: boolean;
  severity: string;
}

interface AllPostsTabProps {
  posts: Post[];
  handlePostAction: (postId: string, action: 'delete' | 'restore') => void;
  setSelectedViewPost: (post: Post) => void;
  getTypeIcon: (type: string) => JSX.Element;
  formatDate: (date: string) => string;
  handleSort: (field: string) => void;
  renderSortIcon: (field: string) => JSX.Element | null;
}

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  }
};

export const AllPostsTab: React.FC<AllPostsTabProps> = ({
  posts,
  handlePostAction,
  setSelectedViewPost,
  getTypeIcon,
  formatDate,
  handleSort,
  renderSortIcon,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-900">
        <tr>
          <th className="px-6 py-3 text-left">
            <button
              onClick={() => handleSort("content")}
              className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
            >
              Post
              {renderSortIcon("content")}
            </button>
          </th>
          <th className="px-6 py-3 text-left">
            <button
              onClick={() => handleSort("user_id.fullName")}
              className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
            >
              Author
              {renderSortIcon("user_id.fullName")}
            </button>
          </th>
          <th className="px-6 py-3 text-left">
            <button
              onClick={() => handleSort("reactionCount")}
              className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
            >
              Engagement
              {renderSortIcon("reactionCount")}
            </button>
          </th>
          <th className="px-6 py-3 text-left">
            <button
              onClick={() => handleSort("reportCount")}
              className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
            >
              Reports
              {renderSortIcon("reportCount")}
            </button>
          </th>
          <th className="px-6 py-3 text-left">
            <button
              onClick={() => handleSort("severity")}
              className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
            >
              Severity
              {renderSortIcon("severity")}
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
              Date
              {renderSortIcon("createdAt")}
            </button>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post) => (
          <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {post.media && post.media.length > 0 ? (
                    <div className="relative">
                      {post.media[0].type === "video" && (
                        <video src={post.media[0].url} className="w-12 h-12 object-cover" />
                      )}
                      {post.media[0].type === "image" && (
                        <img
                          src={post.media[0].thumbnail || post.media[0].url}
                          alt="Post media"
                          className="w-12 h-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                      )}
                      {post.media.length > 1 && (
                        <div className="absolute top-0 right-0 bg-black bg-opacity-50 w-full h-full rounded-lg flex items-center justify-center">
                          <span className="text-xs text-white">+{post.media.length - 1}</span>
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{post.content}</p>
                  <div className="flex items-center mt-1 space-x-2 flex-wrap">
                    {getTypeIcon(post.type)}
                    <span className="text-xs text-gray-500 capitalize">{post.type}</span>
                    {post.hasAds && (
                      <div className="flex items-center space-x-1" style={{ marginLeft: "10px" }}>
                        <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Ads</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.user_id.avatar_url}
                  alt={post.user_id.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user_id.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@{post.user_id.username}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{post.reactionCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.commentCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="w-3 h-3" />
                  <span>{post.sharesCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.viewCount}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {post.pendingReportCount > 0 ? (
                  <span className="text-orange-600 dark:text-orange-400">
                    {post.pendingReportCount}/{post.reportCount}
                  </span>
                ) : (
                  <span className="text-gray-500">0/{post.reportCount}</span>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
                  post.severity
                )}`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {post.severity || "None"}
              </span>
            </td>
            <td className="px-6 py-4">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  !post.is_deleted
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {!post.is_deleted ? "Published" : "Deleted"}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(post.createdAt)}</td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                  title="View Details"
                  onClick={() => {
                    setSelectedViewPost(post);
                  }}
                >
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                {post.is_deleted ? (
                  <button
                    onClick={() => handlePostAction(post._id, "restore")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    title="Restore Post"
                  >
                    <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePostAction(post._id, "delete")}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
