import React, { useState, useEffect } from "react";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { 
  ResolvedGroupReportItem, 
  GetResolvedReportsParams,
  ResolvedReportsPagination,
  ResolvedReportsStatistics
} from "../../../api/group";
import { getResolvedGroupReports } from "../../../api/group";
import Swal from "sweetalert2";

interface ResolvedGroupsProps {
  onRefresh?: () => void;
}

const ResolvedGroups: React.FC<ResolvedGroupsProps> = ({ onRefresh }) => {
  const [groupReports, setGroupReports] = useState<ResolvedGroupReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [params, setParams] = useState<GetResolvedReportsParams>({
    page: 1,
    limit: 10,
    sortBy: "resolvedDate",
    order: "desc",
  });
  const [pagination, setPagination] = useState<ResolvedReportsPagination>({
    currentPage: 1,
    totalPages: 1,
    totalGroups: 0,
    limit: 10,
  });
  const [statistics, setStatistics] = useState<ResolvedReportsStatistics>({
    totalResolvedReports: 0,
    totalDismissedReports: 0,
    totalResolvedWithAction: 0,
    totalGroups: 0,
  });

  const fetchResolvedReports = async () => {
    try {
      setLoading(true);
      const response = await getResolvedGroupReports(params);
      console.log("Fetched resolved reports:", response.data.data.groupReports);

      if (response.data.success) {
        setGroupReports(response.data.data.groupReports);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching resolved reports:", error);
      Swal.fire("Error", "Failed to fetch resolved reports", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolvedReports();
  }, [params]);

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;

    const severityColors = {
      low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      critical: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
          severityColors[severity as keyof typeof severityColors] || severityColors.low
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
      warning_sent: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      content_removed: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      group_suspended: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Summary */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Resolved</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {statistics.totalResolvedReports}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Dismissed</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {statistics.totalDismissedReports}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">With Action</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {statistics.totalResolvedWithAction}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Groups</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {statistics.totalGroups}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">
                Group
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Reports
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status Breakdown
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Warnings Sent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resolved Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            
            {groupReports.map((item) => (
              <React.Fragment key={item.groupId}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Group Info */}
                  <td
                    className="px-4 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => toggleGroupExpansion(item.groupId)}
                  >
                    <div className="flex items-center">
                      <img
                        src={item.group.cover_url}
                        alt={item.group.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="ml-3 max-w-[180px]">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.group.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.group.description}
                        </div>
                      </div>
                      {expandedGroups.has(item.groupId) ? (
                        <ChevronUp className="w-4 h-4 ml-2 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                      )}
                    </div>
                  </td>

                  {/* Total Reports */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {item.reportCount}
                    </span>
                  </td>

                  {/* Status Breakdown */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
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

                  {/* Warnings */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.group.warningCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
                        <AlertTriangle className="w-3 h-3 mr-1" />

                        {item.group.warningCount}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">0</span>
                    )}
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
                    {item.group.severity ? (
                      getSeverityBadge(item.group.severity)
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // View group details
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      title="View Group Details"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </td>
                </tr>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedGroups.has(item.groupId) && (
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
                              {Object.entries(item.reportTypeCount).map(([type, count]) => (
                                <span
                                  key={type}
                                  className="inline-flex items-center px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                  {type}: <span className="ml-1 font-semibold">{count}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Timeline
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-32 font-medium">First Report:</span>
                                <span>{formatDate(item.oldestReportDate)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-32 font-medium">Latest Report:</span>
                                <span>{formatDate(item.latestReportDate)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                <span className="w-32 font-medium">Resolved:</span>
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
                                        {report.reportType}
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

      {/* Empty State */}
      {groupReports.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No resolved reports found</p>
        </div>
      )}
    </div>
  );
};

export default ResolvedGroups;