import React, { useState } from "react";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  FileText,
  ChevronsUpDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ResolvedAdsPostReportItem, AdReport } from "../../../api/ads";

interface ResolvedAdsTabProps {
  postReports: ResolvedAdsPostReportItem[];
  onRefresh?: () => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  setSelectedViewPost?: (post: any) => void;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (num: number) => string;
}

type SortableField = "reportCount" | "resolvedDate" | "severity";

export const ResolvedAdsTab: React.FC<ResolvedAdsTabProps> = ({
  postReports,
  onRefresh,
  sortBy = "",
  sortOrder = "desc",
  onSort,
  setSelectedViewPost,
  formatCurrency,
  formatNumber,
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

  const renderSortIcon = (field: SortableField) => {
    if (sortBy !== field) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 text-purple-600 dark:text-purple-400" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 text-purple-600 dark:text-purple-400" />
    );
  };

  const SortableHeader: React.FC<{
    field: SortableField;
    label: string;
    subtitle?: string;
  }> = ({ field, label, subtitle }) => (
    <th
      onClick={() => onSort && onSort(field)}
      className={`px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
        onSort
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          : ""
      }`}
    >
      <div className="flex items-center justify-start">
        <div>
          <div className="text-left">{label}</div>
          {subtitle && (
            <div className="text-[10px] font-normal text-gray-400 normal-case mt-0.5 text-left">
              {subtitle}
            </div>
          )}
        </div>
        {onSort && renderSortIcon(field)}
      </div>
    </th>
  );

  const renderMedia = (post: ResolvedAdsPostReportItem["post"]) => {
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

  const getResolutionStatus = (item: ResolvedAdsPostReportItem) => {
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

  const convertToViewablePost = (item: ResolvedAdsPostReportItem) => {
    return {
      _id: item.post._id,
      content: item.post.content,
      type: item.post.type,
      media: item.post.media,
      user_id: item.post.user_id,
      reactionCount: 0,
      commentCount: 0,
      sharesCount: 0,
      viewCount: 0,
      reportCount: item.reportCount,
      pendingReportCount: 0,
      is_deleted: item.post.is_deleted,
      createdAt: item.post.createdAt,
      updatedAt: item.post.createdAt,
      hasAds: true,
      severity: item.post.severity || "none",
    };
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
        {actionTaken.replace("_", " ")}
      </span>
    );
  };

  if (postReports.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No resolved reports
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          There are no resolved reports for posts with active ads yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Post Content
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <SortableHeader
                field="reportCount"
                label="Reports"
                subtitle="Total count"
              />
              <SortableHeader
                field="resolvedDate"
                label="Resolved"
                subtitle="Date resolved"
              />
              <SortableHeader
                field="severity"
                label="Severity"
                subtitle="Risk level"
              />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {postReports.map((item) => (
              <React.Fragment key={item.postId}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => togglePostExpansion(item.postId)}
                >
                  {/* Post Content */}
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      {renderMedia(item.post)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.post.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.post.type} post
                        </p>
                      </div>
                      {expandedPosts.has(item.postId) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-4 py-4 whitespace-nowrap">
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

                  {/* Report Count */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {item.reportCount} total
                      </span>
                      <div className="flex gap-1">
                        {item.dismissedCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded">
                            {item.dismissedCount} dismissed
                          </span>
                        )}
                        {item.resolvedCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded">
                            {item.resolvedCount} resolved
                          </span>
                        )}
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
                    {setSelectedViewPost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedViewPost(convertToViewablePost(item));
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        title="View Post Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    )}
                  </td>
                </tr>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedPosts.has(item.postId) && (
                    <tr>
                      <td colSpan={9} className="px-4 py-0">
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
                                      {report.actionTaken && getActionBadge(report.actionTaken)}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatDate(report.resolvedAt || report.createdAt)}
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

export default ResolvedAdsTab;