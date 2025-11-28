import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, FileText, Flag, Search, Trash2, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import type { AdsPostReportItem } from "../../../api/ads";
import ExpandedAdsPostReports from "../ExpandedAdReports";

type AdAction = "delete" | "pause" | "resume";

interface PendingAdsTabProps {
  postReports: AdsPostReportItem[];
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
  onSelectAll?: () => void;
  onDismissAllReports: (postId: string) => Promise<void>;
  handleAdAction: (id: string, action: AdAction) => void;
  onMarkInvestigating: (postId: string) => Promise<void>;
  onBulkMarkInvestigating?: (postIds: string[]) => Promise<void>;
  onRefresh?: () => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  setSelectedViewPost?: (post: any) => void;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (num: number) => string;
  onBanUser?: (userId: string) => Promise<void>;
}

type SortableField = "reportCount" | "severity";

export const PendingAdsTab: React.FC<PendingAdsTabProps> = ({
  postReports,
  selectedPosts = [],
  onSelectPost,
  onSelectAll,
  onDismissAllReports,
  handleAdAction,
  onMarkInvestigating,
  onBulkMarkInvestigating,
  onRefresh,
  sortBy = "",
  sortOrder = "desc",
  onSort,
  setSelectedViewPost,
  formatNumber,
  onBanUser,
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

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    }
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

  const getSeverityBadge = (severity?: string) => {
    const severityConfig: Record<string, { bg: string; text: string }> = {
      critical: {
        bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
        text: "Critical",
      },
      high: {
        bg: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        text: "High",
      },
      medium: {
        bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
        text: "Medium",
      },
      low: {
        bg: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        text: "Low",
      },
      none: {
        bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
        text: "None",
      },
    };

    const config = severityConfig[severity?.toLowerCase() || "none"];

    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
        {config.text}
      </span>
    );
  };

  const convertToViewablePost = (item: AdsPostReportItem) => {
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
      pendingReportCount: item.reportCount,
      is_deleted: item.post.is_deleted,
      createdAt: item.post.createdAt,
      updatedAt: item.post.createdAt,
      hasAds: true,
      severity: item.post.severity || "none",
    };
  };

  if (!postReports || postReports.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending reports</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          There are no pending reports for posts with active ads.
        </p>
      </div>
    );
  }

  return (
    <>
      {selectedPosts && selectedPosts.length > 0 && onBulkMarkInvestigating && (
        <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-700 dark:text-purple-300">{selectedPosts.length} post(s) selected</p>
            <button
              onClick={() => onBulkMarkInvestigating(selectedPosts)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Mark as Investigating
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {onSelectPost && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === postReports.length && postReports.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
              )}

              {/* Post Content & Author */}
              <th className="px-4 py-3 text-left" style={{ minWidth: "320px" }}>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post / Author
                </span>
              </th>

              {/* Performance */}
              <th className="px-4 py-3 text-left" style={{ minWidth: "180px" }}>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </span>
              </th>

              {/* Reports */}
              <th
                onClick={() => onSort && onSort("reportCount")}
                className={`px-4 py-3 text-left ${
                  onSort ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" : ""
                }`}
                style={{ minWidth: "100px" }}
              >
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reports
                  </span>
                  {onSort && renderSortIcon("reportCount")}
                </div>
              </th>

              {/* Report Types */}
              <th className="px-4 py-3 text-left" style={{ minWidth: "200px" }}>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Report Types
                </span>
              </th>

              {/* Severity */}
              <th
                onClick={() => onSort && onSort("severity")}
                className={`px-4 py-3 text-left ${
                  onSort ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" : ""
                }`}
                style={{ minWidth: "110px" }}
              >
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Severity
                  </span>
                  {onSort && renderSortIcon("severity")}
                </div>
              </th>

              {/* Actions */}
              <th
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{ minWidth: "80px" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {postReports.map((item) => {
              const primaryAd = item.ads.length > 0 ? item.ads[0] : null;
              const progressPercentage = primaryAd
                ? Math.min((primaryAd.current_views / primaryAd.target_views) * 100, 100)
                : 0;

              return (
                <React.Fragment key={item.postId}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {onSelectPost && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(item.postId)}
                          onChange={() => onSelectPost(item.postId)}
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                    )}

                    {/* Post Content & Author */}
                    <td className="px-4 py-3">
                      <div className="flex items-start space-x-3">
                        {/* Media Thumbnail */}
                        <div className="flex-shrink-0">
                          {item.post.media && item.post.media.length > 0 ? (
                            <div className="relative">
                              {item.post.media[0].type === "video" && (
                                <video src={item.post.media[0].url} className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              {item.post.media[0].type === "image" && (
                                <img
                                  src={item.post.media[0].thumbnail || item.post.media[0].url}
                                  alt="Post media"
                                  className="w-10 h-10 rounded-lg object-cover"
                                  loading="lazy"
                                />
                              )}
                              {item.post.media.length > 1 && (
                                <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                  {item.post.media.length}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Content */}
                          <p
                            className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                            onClick={() => togglePostExpansion(item.postId)}
                          >
                            {item.post.content}
                          </p>

                          {/* Author */}
                          <div className="flex items-center space-x-2 mt-1">
                            <img
                              src={item.post.user_id.avatar_url}
                              alt={item.post.user_id.fullName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.post.user_id.fullName}
                            </p>
                          </div>

                          {/* Post type */}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.post.type} post</p>
                        </div>

                        {/* Expand icon */}
                        <button
                          onClick={() => togglePostExpansion(item.postId)}
                          className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          {expandedPosts.has(item.postId) ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="px-4 py-3">
                      {primaryAd ? (
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatNumber(primaryAd.current_views)} / {formatNumber(primaryAd.target_views)}
                            </span>
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {progressPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3" />
                            <span>{formatNumber(primaryAd.total_interactions)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">No active ads</span>
                      )}
                    </td>

                    {/* Reports */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 text-sm font-medium text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-full">
                        <Flag className="w-3.5 h-3.5 mr-1" />
                        {item.reportCount}
                      </span>
                    </td>

                    {/* Report Types */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.reportTypes.slice(0, 2).map((type, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {type.replace("-", " ").replace("_", " ")}
                          </span>
                        ))}
                        {item.reportTypes.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400">
                            +{item.reportTypes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3">{getSeverityBadge(item.post.severity)}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {setSelectedViewPost && (
                          <button
                            onClick={() => setSelectedViewPost(convertToViewablePost(item))}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                            title="View Post"
                          >
                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                        )}
                        {item.ads.length > 0 && (
                          <button
                            onClick={() => {
                              handleAdAction(item.ads[0]._id, "delete");
                              if (onRefresh) {
                                setTimeout(() => onRefresh(), 500);
                              }
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                            title="Delete Primary Ad"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Report Details */}
                  <AnimatePresence>
                    {expandedPosts.has(item.postId) && (
                      <tr>
                        <td colSpan={onSelectPost ? 7 : 6} className="px-4 py-0">
                          <ExpandedAdsPostReports
                            reports={item.reports}
                            reportTypeCount={item.reportTypeCount}
                            postId={item.postId}
                            postAuthorId={item.post.user_id._id}
                            ads={item.ads}
                            onDismissAll={onDismissAllReports}
                            onMarkInvestigating={onMarkInvestigating}
                            onBanUser={onBanUser}
                          />
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
