import { AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Clock,
  Eye,
  FileText,
  Trash2,
  Unlock,
} from "lucide-react";
import React, { type JSX, useState } from "react";
import type { PostReportItem } from "../../../api/post";
import ExpandedPostReports from "../ExpandedPostReports";

type PostAction = "delete" | "restore";

interface PendingPostsTabProps {
  postReports: PostReportItem[];
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
  onSelectAll?: () => void;
  onDismissAllReports: (postId: string) => Promise<void>;
  handlePostAction: (id: string, action: PostAction) => void;
  onMarkInvestigating: (postId: string) => Promise<void>;
  onBulkMarkInvestigating?: (postIds: string[]) => Promise<void>;
  onRefresh?: () => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  setSelectedViewPost?: (post: any) => void;
  getTypeIcon: (type: string) => JSX.Element;
  onBanUser?: (userId: string) => Promise<void>;
}

type SortableField = "reportCount" | "createdAt" | "severity";

export const PendingTab: React.FC<PendingPostsTabProps> = ({
  postReports,
  selectedPosts = [],
  onSelectPost,
  onSelectAll,
  onDismissAllReports,
  handlePostAction,
  onMarkInvestigating,
  onBulkMarkInvestigating,
  onRefresh,
  sortBy = "",
  sortOrder = "desc",
  onSort,
  setSelectedViewPost,
  getTypeIcon,
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
      className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
        onSort ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" : ""
      }`}
    >
      <div className="flex items-center justify-start">
        <div>
          <div className="text-left">{label}</div>
          {subtitle && (
            <div className="text-[10px] font-normal text-gray-400 normal-case mt-0.5 text-left">{subtitle}</div>
          )}
        </div>
        {onSort && renderSortIcon(field)}
      </div>
    </th>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig: Record<string, { color: string; label: string }> = {
      low: {
        color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        label: "Low",
      },
      medium: {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
        label: "Medium",
      },
      high: {
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
        label: "High",
      },
      critical: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        label: "Critical",
      },
    };

    const config = severityConfig[severity] || severityConfig.low;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>{config.label}</span>
    );
  };

  const renderMedia = (media: any[]) => {
    if (!media || media.length === 0) return null;

    const firstMedia = media[0];
    const hasMore = media.length > 1;

    return (
      <div className="flex-shrink-0">
        {firstMedia.type === "video" && (
          <div className="relative">
            <video src={firstMedia.url} className="w-12 h-12 object-cover rounded-lg" />
            {hasMore && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-50 w-full h-full rounded-lg flex items-center justify-center">
                <span className="text-xs text-white">+{media.length - 1}</span>
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
                <span className="text-xs text-white">+{media.length - 1}</span>
              </div>
            )}
          </div>
        )}
        {firstMedia.type !== "video" && firstMedia.type !== "image" && (
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  if (postReports.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending reports</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There are currently no reports pending review.</p>
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions */}
      {selectedPosts.length > 0 && onBulkMarkInvestigating && (
        <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              {selectedPosts.length} post(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onBulkMarkInvestigating(selectedPosts)}
                className="flex items-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Mark as Investigating
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {onSelectPost && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === postReports.length && postReports.length > 0}
                    onChange={onSelectAll}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                Author
              </th>
              <SortableHeader field="reportCount" label="Reports" subtitle="Total reports" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Report Types
              </th>
              <SortableHeader field="severity" label="Severity" subtitle="Risk level" />
              <SortableHeader field="createdAt" label="Date" subtitle="Post date" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {postReports.map((item) => (
              <React.Fragment key={item.postId}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {onSelectPost && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(item.postId)}
                        onChange={() => onSelectPost(item.postId)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div
                      className="flex items-start space-x-3 cursor-pointer"
                      onClick={() => togglePostExpansion(item.postId)}
                    >
                      {item.post.media && item.post.media.length > 0 ? (
                        renderMedia(item.post.media)
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.post.content}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          {getTypeIcon(item.post.type)}
                          <span className="text-xs text-gray-500 capitalize">{item.post.type}</span>
                        </div>
                      </div>
                      {expandedPosts.has(item.postId) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.post.user_id.avatar_url}
                        alt={item.post.user_id.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.post.user_id.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{item.post.user_id.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-full">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {item.reportCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.reportTypes.slice(0, 2).map((type, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {type.replace("-", " ").replace("_", " ")}
                        </span>
                      ))}
                      {item.reportTypes.length > 2 && (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400">
                          +{item.reportTypes.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getSeverityBadge(item.post.severity || "low")}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(item.post.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      {setSelectedViewPost && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedViewPost(item.post);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                          title="View Post"
                        >
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                      {item.post.is_deleted ? (
                        <button
                          onClick={() => {
                            handlePostAction(item.post._id, "restore");
                            // Refresh after action completes
                            if (onRefresh) {
                              setTimeout(() => onRefresh(), 500);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                          title="Restore Post"
                        >
                          <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handlePostAction(item.post._id, "delete");
                            // Refresh after action completes
                            if (onRefresh) {
                              setTimeout(() => onRefresh(), 500);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                          title="Delete Post"
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
                      <td colSpan={onSelectPost ? 8 : 7} className="px-6 py-0">
                        <ExpandedPostReports
                          reports={item.reports}
                          reportTypeCount={item.reportTypeCount}
                          postId={item.postId}
                          postAuthorId={item.post.user_id._id}
                          onDismissAll={onDismissAllReports}
                          onMarkInvestigating={onMarkInvestigating}
                          onBanUser={onBanUser}
                        />
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
