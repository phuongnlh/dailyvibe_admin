import React from "react";
import { motion } from "framer-motion";
import { X, Clock } from "lucide-react";
import type { GroupReport } from "../../../api/group";

interface ReportDetailModalProps {
  report: GroupReport;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
}) => {
  const getReportTypeBadge = (reportType: string) => {
    const typeColors: Record<string, string> = {
      harassment:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      spam: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      "hate-speech":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      violence:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      "false-information":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      inappropriate:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          typeColors[reportType] || typeColors.other
        }`}
      >
        {reportType.replace("-", " ")}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Reporter */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Reporter
            </h4>
            <div className="flex items-center space-x-3">
              <img
                src={report.reporter.avatar_url}
                alt={report.reporter.fullName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {report.reporter.fullName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {report.reporter.email}
                </p>
              </div>
            </div>
          </div>

          {/* Report Type */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Report Type
            </h4>
            {getReportTypeBadge(report.reportType)}
          </div>

          {/* Reason */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Reason
            </h4>
            <p className="text-gray-900 dark:text-white">{report.reason}</p>
          </div>

          {/* Date */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Reported At
            </h4>
            <div className="flex items-center text-gray-900 dark:text-white">
              <Clock className="w-4 h-4 mr-2" />
              {formatDate(report.createdAt)}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Status
            </h4>
            <span className="inline-flex px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
              {report.status}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailModal;