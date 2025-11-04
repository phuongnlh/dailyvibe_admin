import React, { useState } from "react";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ResolvedPostReportItem } from "../../../api/post";

interface Reporter {
  _id: string;
  email: string;
  fullName: string;
  avatar_url: string;
}

interface PostReport {
  _id: string;
  reportType: string;
  reason: string;
  status: string;
  actionTaken: string;
  reporter: Reporter;
  createdAt: string;
  resolvedAt: string;
}

interface PostUser {
  _id: string;
  email: string;
  fullName: string;
  avatar_url: string;
  username: string;
}

interface Media {
  url: string;
  thumbnail?: string;
  type: string;
  duration?: string;
}

interface Post {
  _id: string;
  user_id: PostUser;
  content: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  severity?: string;
  media?: Media[];
}

interface ResolvedTabProps {
  postReports: ResolvedPostReportItem[];
  onRefresh?: () => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export const ResolvedTab: React.FC<ResolvedTabProps> = ({
  postReports,
  onRefresh,
  sortBy = "",
  sortOrder = "desc",
  onSort,
}) => {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const togglePostExpansion = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const renderMedia = (post: Post) => {
    if (!post.media || post.media.length === 0) {
      return (
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-gray-400" />
        </div>
      );
    }

    const firstMedia = post.media[0];
    const hasMore = post.media.length > 1;

    return (
      <div className="flex-shrink-0">
        {firstMedia.type === "video" && (
          <div className="relative">
            <video
              src={firstMedia.url}
              className="w-12 h-12 object-cover rounded-lg"
            />
            {hasMore && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-50 w-full h-full rounded-lg flex items-center justify-center">
                <span className="text-xs text-white">
                  +{post.media.length - 1}
                </span>
              </div>
            )}
          </div>
        )}
        {firstMedia.type === "image" && (
          <div className="relative">
            <img
              src={firstMedia.thumbnail || firstMedia.url}
              alt="Post media"
              className="w-12 h-12 rounded-lg object-cover"
              loading="lazy"
            />
            {hasMore && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-50 w-full h-full rounded-lg flex items-center justify-center">
                <span className="text-xs text-white">
                  +{post.media.length - 1}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const getResolutionStatus = (item: ResolvedPostReportItem) => {
    const hasContentRemoved = item.contentRemovedCount > 0;
    const hasUserBanned = item.reports.some(
      (report) => report.actionTaken === "user_banned"
    );

    if (hasContentRemoved && hasUserBanned) {
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 rounded-full">
            Content Removed
          </span>
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full">
            User Banned
          </span>
        </div>
      );
    }

    if (hasUserBanned) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full">
          User Banned
        </span>
      );
    }

    if (hasContentRemoved) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 rounded-full">
          Content Removed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
        <CheckCircle className="w-3 h-3 mr-1" />
        Resolved
      </span>
    );
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;

    const severityColors = {
      low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      medium:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      critical:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
          severityColors[severity as keyof typeof severityColors] ||
          severityColors.low
        }`}
      >
        <Shield className="w-3 h-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadge = (actionTaken: string) => {
    const actionColors: Record<string, string> = {
      none: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
      content_removed:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      user_banned:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      warning_sent:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          actionColors[actionTaken] || actionColors.none
        }`}
      >
        {actionTaken.replace(/_/g, " ").toUpperCase()}
      </span>
    );
  };

  const getMediaIcon = (post: Post) => {
    if (!post.media || post.media.length === 0) return null;

    const hasImage = post.media.some((m) => m.type === "image");
    const hasVideo = post.media.some((m) => m.type === "video");

    if (hasVideo) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded">
          <Video className="w-3 h-3 mr-1" />
          Video
        </span>
      );
    }

    if (hasImage) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded">
          <ImageIcon className="w-3 h-3 mr-1" />
          Image
        </span>
      );
    }

    return null;
  };

  if (postReports.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No resolved reports found
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[300px]">
                Post
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Report Summary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resolved Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {postReports.map((item) => (
              <React.Fragment key={item.postId}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => togglePostExpansion(item.postId)}
                >
                  {/* Post Content */}
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      {renderMedia(item.post)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                          {item.post.content || "No content"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getMediaIcon(item.post)}
                          {item.post.is_deleted && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded">
                              Deleted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.post.user_id.avatar_url}
                        alt={item.post.user_id.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.post.user_id.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{item.post.user_id.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Report Summary */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.reportCount} Reports
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePostExpansion(item.postId);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          {expandedPosts.has(item.postId) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Dismissed: {item.dismissedCount}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Resolved: {item.resolvedCount}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Resolved Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(item.resolvedDate)}
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.post.severity ? (
                      getSeverityBadge(item.post.severity)
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getResolutionStatus(item)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // View post details - implement as needed
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      title="View Post Details"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </td>
                </tr>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedPosts.has(item.postId) && (
                    <tr>
                      <td colSpan={7} className="px-4 py-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-200 dark:border-gray-600"
                        >
                          {/* Report Type Breakdown */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Report Type Breakdown
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.reportTypeCount).map(
                                ([type, count]) => (
                                  <span
                                    key={type}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                  >
                                    {type.replace("_", " ")}:{" "}
                                    <span className="ml-1 font-semibold">
                                      {count}
                                    </span>
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Timeline
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-32 font-medium">
                                  First Report:
                                </span>
                                <span>{formatDate(item.oldestReportDate)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-32 font-medium">
                                  Latest Report:
                                </span>
                                <span>{formatDate(item.latestReportDate)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-32 font-medium">
                                  Resolved:
                                </span>
                                <span>{formatDate(item.resolvedDate)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Individual Reports */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Report Details ({item.reports.length})
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {item.reports.map((report) => (
                                <div
                                  key={report._id}
                                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300">
                                        {report.reportType.replace("_", " ")}
                                      </span>
                                      {report.status === "dismissed" ? (
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 rounded-full">
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Dismissed
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Resolved
                                        </span>
                                      )}
                                      {getActionBadge(report.actionTaken)}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatDate(report.resolvedAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {report.reason}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={report.reporter.avatar_url}
                                      alt={report.reporter.fullName}
                                      className="w-5 h-5 rounded-full"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Reported by {report.reporter.fullName}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResolvedTab;