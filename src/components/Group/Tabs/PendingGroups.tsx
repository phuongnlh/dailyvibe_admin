import React, { useState } from "react";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
  Trash2,
  ChevronsUpDown,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { GroupReportItem, GroupReport } from "../../../api/group";
import ExpandedReports from "../ExpandedReports";
import ReportDetailModal from "../Modal/ReportDetailModal";
import SendWarningModal from "../Modal/SendWarningModal";
import GroupPostsModal from "../Modal/GroupPostsModal";
import DeleteGroupModal from "../Modal/DeleteGroupModal";

interface PendingGroupsProps {
  groupReports: GroupReportItem[];
  selectedGroups?: string[];
  onSelectGroup?: (groupId: string) => void;
  onSelectAll?: () => void;
  onDismissAllReports: (groupId: string) => Promise<void>;
  onSendWarning?: (data: {
    groupId: string;
    reason?: string;
    adminNote: string;
    violationType?: string;
  }) => Promise<void>;
  onRefresh?: () => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
}

type SortableField = "warningCount" | "reportCount" | "severity";

const PendingGroups: React.FC<PendingGroupsProps> = ({
  groupReports,
  selectedGroups = [],
  onSelectGroup,
  onSelectAll,
  onDismissAllReports,
  onSendWarning,
  onRefresh,
  sortBy = "",
  sortOrder = "desc",
  onSort,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedReport, setSelectedReport] = useState<GroupReport | null>(
    null
  );
  const [warningModal, setWarningModal] = useState<{
    groupId: string;
    groupName: string;
    reportCount: number;
    warningCount: number;
  } | null>(null);

  // State for Posts Modal
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedGroupForPosts, setSelectedGroupForPosts] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
    warningCount: number;
  } | null>(null);

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleOpenWarningModal = (
    groupId: string,
    groupName: string,
    reportCount: number,
    warningCount: number
  ) => {
    setWarningModal({ groupId, groupName, reportCount, warningCount });
  };

  const handleSendWarning = async (data: {
    groupId: string;
    reason?: string;
    adminNote: string;
    violationType?: string;
  }) => {
    if (onSendWarning) {
      await onSendWarning(data);
    }
  };

  const handleViewPosts = (groupId: string, groupName: string) => {
    setSelectedGroupForPosts({ id: groupId, name: groupName });
    setIsPostsModalOpen(true);
  };

  const handleDeleteClick = (groupId: string, groupName: string, warningCount: number) => {
    setGroupToDelete({ id: groupId, name: groupName, warningCount });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;

    const severityColors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
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

  // Render sort icon based on current sort state
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

  // Sortable header component
  const SortableHeader: React.FC<{
    field: SortableField;
    label: string;
    subtitle?: string;
  }> = ({ field, label, subtitle }) => (
    <th
      onClick={() => onSort && onSort(field)}
      className={`px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
        onSort ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" : ""
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

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* Checkbox Column */}
              {onSelectGroup && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedGroups.length === groupReports.length &&
                      groupReports.length > 0
                    }
                    onChange={onSelectAll}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </th>
              )}
              
              {/* Non-sortable columns */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">
                Group
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                Creator
              </th>

              {/* Sortable columns */}
              <SortableHeader
                field="warningCount"
                label="Warnings"
                subtitle="Current / Max"
              />
              <SortableHeader
                field="reportCount"
                label="Reports"
              />

              {/* Non-sortable column */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Report Types
              </th>

              {/* Sortable column */}
              <SortableHeader
                field="severity"
                label="Severity"
              />

              {/* Non-sortable column */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {groupReports.map((item) => (
              <React.Fragment key={item.groupId}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Checkbox */}
                  {onSelectGroup && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(item.groupId)}
                        onChange={() => onSelectGroup(item.groupId)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                  )}

                  {/* Group Info */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleGroupExpansion(item.groupId)}
                    >
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

                  {/* Creator */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.group.creator.avatar_url}
                        alt={item.group.creator.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="max-w-[120px]">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.group.creator.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.group.creator.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Warning */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {(item.group.warningCount ?? 0) > 3 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          (item.group.warningCount ?? 0) > 3
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.group.warningCount ?? 0} / 5
                      </span>
                    </div>
                  </td>

                  {/* Report Count */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-300 rounded-full">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {item.reportCount}
                    </span>
                  </td>

                  {/* Report Types */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.reportTypes.slice(0, 2).map((type, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {type}
                        </span>
                      ))}
                      {item.reportTypes.length > 2 && (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400">
                          +{item.reportTypes.length - 2} more
                        </span>
                      )}
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPosts(item.groupId, item.group.name);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        title="View Group Posts"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(
                            item.groupId,
                            item.group.name,
                            item.group.warningCount ?? 0
                          );
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        title="Delete Group"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Report Details */}
                <AnimatePresence>
                  {expandedGroups.has(item.groupId) && (
                    <tr>
                      <td colSpan={onSelectGroup ? 9 : 8} className="px-4 py-0">
                        <ExpandedReports
                          reports={item.reports}
                          reportTypeCount={item.reportTypeCount}
                          onViewDetails={setSelectedReport}
                          groupId={item.groupId}
                          groupName={item.group.name}
                          onDismissAll={onDismissAllReports}
                          onSendWarning={(groupId, groupName) =>
                            handleOpenWarningModal(
                              groupId,
                              groupName,
                              item.reportCount,
                              item.group.warningCount ?? 0
                            )
                          }
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

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>

      {/* Send Warning Modal */}
      <AnimatePresence>
        {warningModal && (
          <SendWarningModal
            groupId={warningModal.groupId}
            groupName={warningModal.groupName}
            warningCount={warningModal.warningCount}
            reportCount={warningModal.reportCount}
            onClose={() => setWarningModal(null)}
            onSendWarning={handleSendWarning}
          />
        )}
      </AnimatePresence>

      {/* Group Posts Modal */}
      {selectedGroupForPosts && (
        <GroupPostsModal
          isOpen={isPostsModalOpen}
          onClose={() => {
            setIsPostsModalOpen(false);
            setSelectedGroupForPosts(null);
          }}
          groupId={selectedGroupForPosts.id}
          groupName={selectedGroupForPosts.name}
        />
      )}

      {/* Delete Group Modal */}
      {groupToDelete && (
        <DeleteGroupModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setGroupToDelete(null);
          }}
          groupId={groupToDelete.id}
          groupName={groupToDelete.name}
          warningCount={groupToDelete.warningCount}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
};

export default PendingGroups;