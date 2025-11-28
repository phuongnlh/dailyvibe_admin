import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Clock, XCircle, AlertTriangle } from "lucide-react";
import type { GroupReport } from "../../api/group";

interface ExpandedReportsProps {
  reports: GroupReport[];
  reportTypeCount: Record<string, number>;
  groupId: string;
  groupName: string;
  onViewDetails: (report: GroupReport) => void;
  onDismissAll: (groupId: string) => Promise<void>;
  onSendWarning: (groupId: string, groupName: string) => void;
}

const ExpandedReports: React.FC<ExpandedReportsProps> = ({
  reports,
  reportTypeCount,
  groupId,
  groupName,
  onViewDetails,
  onDismissAll,
  onSendWarning,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDismissAll = async () => {
    setIsLoading(true);
    try {
      await onDismissAll(groupId);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportTypeBadge = (reportType: string) => {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        {reportType.replace("-", " ").replace("_", " ")}
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
            <button
              onClick={() => onSendWarning(groupId, groupName)}
              className="flex items-center px-4 py-2 text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 shadow-sm hover:shadow"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Violation & Send Warning
            </button>
            <button
              onClick={handleDismissAll}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-1.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.reporter.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {report.reporter.email}
                        </p>
                      </div>
                    </div>

                    {/* Report Type */}
                    {getReportTypeBadge(report.reportType)}

                    {/* Date */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Reason:</span>{" "}
                      {report.reason}
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="ml-4">
                  <button
                    onClick={() => onViewDetails(report)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpandedReports;
