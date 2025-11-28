import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getGroupPostsForAdmin, type GroupPost } from "../../../api/group";

interface GroupPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

const GroupPostsModal: React.FC<GroupPostsModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupName,
}) => {
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");
  const [approvedPosts, setApprovedPosts] = useState<GroupPost[]>([]);
  const [pendingPosts, setPendingPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [approvedPage, setApprovedPage] = useState(1);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);

  // Statistics
  const [statistics, setStatistics] = useState({
    totalApproved: 0,
    totalPending: 0,
    total: 0,
  });

  const LIMIT = 5; // Posts per page

  useEffect(() => {
    if (isOpen) {
      fetchPosts();
    }
  }, [isOpen, groupId, approvedPage, pendingPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getGroupPostsForAdmin(groupId, {
        approvedPage,
        approvedLimit: LIMIT,
        pendingPage,
        pendingLimit: LIMIT,
      });

      setApprovedPosts(response.data.approvedPosts.data);
      setPendingPosts(response.data.pendingPosts.data);
      setApprovedTotalPages(response.data.approvedPosts.pagination.totalPages);
      setPendingTotalPages(response.data.pendingPosts.pagination.totalPages);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching group posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovedPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= approvedTotalPages) {
      setApprovedPage(newPage);
    }
  };

  const handlePendingPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pendingTotalPages) {
      setPendingPage(newPage);
    }
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

  const renderPostCard = (post: GroupPost) => (
    <motion.div
      key={post._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.user_id.avatar_url}
            alt={post.user_id.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {post.user_id.fullName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {post.status === "pending" && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
              Pending
            </span>
          )}
          <div className="flex items-center text-gray-400 text-xs">
            <Eye className="w-3 h-3 mr-1" />
            {post.viewCount || 0}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-3">
          {post.media.length === 1 && (
            <div className="w-full rounded-lg overflow-hidden">
              {post.media[0].type === "image" ? (
                <img
                  src={post.media[0].url}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-cover"
                />
              ) : (
                <video
                  src={post.media[0].url}
                  className="w-full h-auto max-h-96 object-cover"
                  controls
                />
              )}
            </div>
          )}

          {post.media.length === 2 && (
            <div className="grid grid-cols-2 gap-2">
              {post.media.map((mediaItem, idx) => (
                <div key={idx} className="w-full h-48 rounded-lg overflow-hidden">
                  {mediaItem.type === "image" ? (
                    <img
                      src={mediaItem.url}
                      alt={`Media ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={mediaItem.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {post.media.length === 3 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 w-full h-64 rounded-lg overflow-hidden">
                {post.media[0].type === "image" ? (
                  <img
                    src={post.media[0].url}
                    alt="Media 0"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={post.media[0].url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                {post.media.slice(1, 3).map((mediaItem, idx) => (
                  <div key={idx + 1} className="w-full h-32 rounded-lg overflow-hidden">
                    {mediaItem.type === "image" ? (
                      <img
                        src={mediaItem.url}
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={mediaItem.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.media.length >= 4 && (
            <div className="grid grid-cols-2 gap-2">
              {post.media.slice(0, 4).map((mediaItem, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-40 rounded-lg overflow-hidden"
                >
                  {mediaItem.type === "image" ? (
                    <img
                      src={mediaItem.url}
                      alt={`Media ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={mediaItem.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  {post.media.length > 4 && idx === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        +{post.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {groupName} - Posts
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total: {statistics.total} posts ({statistics.totalApproved} approved,{" "}
                {statistics.totalPending} pending)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "approved"
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Approved ({statistics.totalApproved})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "pending"
                  ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Pending ({statistics.totalPending})
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : activeTab === "approved" ? (
              <>
                {approvedPosts.length > 0 ? (
                  <>
                    {approvedPosts.map((post) => renderPostCard(post))}
                    {renderPagination(
                      approvedPage,
                      approvedTotalPages,
                      handleApprovedPageChange
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No approved posts found
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {pendingPosts.length > 0 ? (
                  <>
                    {pendingPosts.map((post) => renderPostCard(post))}
                    {renderPagination(
                      pendingPage,
                      pendingTotalPages,
                      handlePendingPageChange
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No pending posts found
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GroupPostsModal;