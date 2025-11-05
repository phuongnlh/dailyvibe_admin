import React, { useState } from "react";
import {
  Eye,
  Globe,
  Lock,
  AlertTriangle,
  Shield,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import GroupPostsModal from "../Modal/GroupPostsModal";
import DeleteGroupModal from "../Modal/DeleteGroupModal";

interface Group {
  _id: string;
  name: string;
  description: string;
  avatar_url: string;
  cover_url: string;
  privacy: "Public" | "Private";
  post_approval: boolean;
  admin: {
    _id: string;
    fullName: string;
    avatar_url: string;
    username: string;
    email: string;
  };
  membersCount: number;
  postsCount: number;
  reportCount: number;
  pendingReportCount: number;
  severity?: string;
  status?: string;
  warningCount?: number;
  warnings?: any[];
  isActive: boolean;
  createdAt: string;
}

interface AllGroupsProps {
  groups: Group[];
  onRefresh?: () => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

type SortableField =
  | "membersCount"
  | "postsCount"
  | "reportCount"
  | "warningCount"
  | "severity"
  | "status";

const AllGroups: React.FC<AllGroupsProps> = ({
  groups,
  onRefresh,
  sortBy,
  sortOrder,
  onSort,
}) => {
  // State for modals
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const handleViewDetails = (group: Group) => {
    setSelectedGroup(group);
    setIsPostsModalOpen(true);
  };

  const handleDeleteClick = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "Public":
        return <Globe className="w-4 h-4" />;
      case "Private":
      case "Secret":
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
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

  const getStatusBadge = (status?: string) => {
    const groupStatus = status || "active";

    const statusConfig = {
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
        label: "Active",
      },
      deleted: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
        label: "Deleted",
      },
      investigating: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
        label: "Investigating",
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
        label: "Pending",
      },
      resolved: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
        label: "Resolved",
      },
    };

    const config =
      statusConfig[groupStatus as keyof typeof statusConfig] ||
      statusConfig.active;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      onClick={() => onSort(field)}
      className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
        {renderSortIcon(field)}
      </div>
    </th>
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* Non-sortable columns */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                Group
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                Admin
              </th>

              {/* Sortable columns */}
              <SortableHeader field="membersCount" label="Members" />
              <SortableHeader field="postsCount" label="Posts" />
              <SortableHeader
                field="reportCount"
                label="Reports"
                subtitle="Pending / Total"
              />
              <SortableHeader
                field="warningCount"
                label="Warnings"
                subtitle="Current / Max"
              />
              <SortableHeader field="severity" label="Severity" />
              <SortableHeader field="status" label="Status" />

              {/* Non-sortable column */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {groups.map((group) => (
              <tr
                key={group._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* Group Info */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={group.avatar_url}
                      alt={group.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="ml-3 max-w-[150px]">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {group.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {group.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Admin */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <img
                      src={group.admin.avatar_url}
                      alt={group.admin.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="max-w-[120px]">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {group.admin.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {group.admin.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Members */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {group.membersCount.toLocaleString()}
                  </div>
                </td>

                {/* Posts */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {group.postsCount.toLocaleString()}
                </td>

                {/* Reports */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${
                      (group.pendingReportCount ?? 0) > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {group.pendingReportCount ?? 0} / {group.reportCount ?? 0}
                  </span>
                </td>

                {/* Warnings */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {(group.warningCount ?? 0) > 3 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        (group.warningCount ?? 0) > 3
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {group.warningCount ?? 0} / 5
                    </span>
                  </div>
                </td>

                {/* Severity */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {group.severity ? (
                    getSeverityBadge(group.severity)
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(group.status)}
                </td>

                {/* Created */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(group.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(group)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      title="View Posts"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(group)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Posts Modal */}
      {selectedGroup && (
        <GroupPostsModal
          isOpen={isPostsModalOpen}
          onClose={() => {
            setIsPostsModalOpen(false);
            setSelectedGroup(null);
          }}
          groupId={selectedGroup._id}
          groupName={selectedGroup.name}
        />
      )}

      {/* Delete Modal */}
      {groupToDelete && (
        <DeleteGroupModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setGroupToDelete(null);
          }}
          groupId={groupToDelete._id}
          groupName={groupToDelete.name}
          warningCount={groupToDelete.warningCount ?? 0}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
};

export default AllGroups;