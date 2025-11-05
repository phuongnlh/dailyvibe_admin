import { motion } from "framer-motion";
import { AlertTriangle, Ban, Clock, Flag, XCircle } from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import type { AdReport } from "../../api/ads";

interface ExpandedAdsPostReportsProps {
  reports: AdReport[];
  reportTypeCount: Record<string, number>;
  postId: string;
  postAuthorId: string;
  ads: Array<{
    _id: string;
    campaign_name: string;
    status: string;
    target_views: number;
    current_views: number;
    started_at?: string;
    completed_at?: string;
  }>;
  onDismissAll?: (postId: string) => Promise<void>;
  onMarkInvestigating?: (postId: string) => Promise<void>;
  onBanUser?: (userId: string) => Promise<void>;
}

const ExpandedAdsPostReports: React.FC<ExpandedAdsPostReportsProps> = ({
  reports,
  reportTypeCount,
  postId,
  postAuthorId,
  onDismissAll,
  onMarkInvestigating,
  onBanUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleDismissAll = async () => {
    if (!onDismissAll) return;

    const result = await Swal.fire({
      title: "Dismiss All Reports?",
      text: "Are you sure you want to dismiss all reports for this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, dismiss all!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await onDismissAll(postId);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "All reports have been dismissed",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to dismiss reports",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMarkInvestigating = async () => {
    if (!onMarkInvestigating) return;

    const result = await Swal.fire({
      title: "Mark as Investigating?",
      text: "Are you sure you want to mark this post as investigating?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, mark it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setActionLoading("investigating");
      try {
        await onMarkInvestigating(postId);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to mark as investigating",
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleBanUser = async () => {
    if (!onBanUser || !postAuthorId) return;

    const result = await Swal.fire({
      title: "Ban User?",
      text: "Are you sure you want to ban this user? This action will block their account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, ban user!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setActionLoading("ban");
      try {
        await onBanUser(postAuthorId);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User has been banned",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to ban user",
        });
      } finally {
        setActionLoading(null);
      }
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

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 dark:bg-gray-900/50 rounded-lg my-2"
    >
      <div className="p-4">
        {/* Header with Report Types and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
              <Flag className="w-4 h-4 mr-2" />
              Reports ({reports.length})
            </h4>

            {/* Report Type Count */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(reportTypeCount).map(([type, count]) => (
                <span
                  key={type}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {type.replace("-", " ").replace("_", " ")}
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-200 dark:bg-gray-700 rounded-full">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {onMarkInvestigating && (
              <button
                onClick={handleMarkInvestigating}
                disabled={actionLoading === "investigating"}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === "investigating" ? (
                  <>
                    <div className="w-4 h-4 mr-1.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    Mark Investigating
                  </>
                )}
              </button>
            )}

            {onBanUser && postAuthorId && (
              <button
                onClick={handleBanUser}
                disabled={actionLoading === "ban"}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === "ban" ? (
                  <>
                    <div className="w-4 h-4 mr-1.5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    Banning...
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-1.5" />
                    Ban User
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDismissAll}
              disabled={isLoading}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-1.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Dismissing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Dismiss All
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Reporter Info */}
                    <div className="flex items-center space-x-2">
                      <img
                        src={report.reporter.avatar_url}
                        alt={report.reporter.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{report.reporter.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{report.reporter.email}</p>
                      </div>
                    </div>

                    {/* Report Type */}
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {report.reportType.replace("-", " ").replace("_", " ")}
                    </span>

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Reason:</span> {report.reason}
                    </p>
                    {report.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-medium">Details:</span> {report.description}
                      </p>
                    )}
                  </div>

                  {/* Action Taken */}
                  {report.actionTaken && report.actionTaken !== "none" && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded">
                        Action: {report.actionTaken.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpandedAdsPostReports;
