import React, { type JSX, useState } from "react";
import {
  Eye,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Pause,
  Play,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Flag,
  MapPin,
  User,
} from "lucide-react";
import type { Ad } from "../../../api/ads";

interface AllAdsTabProps {
  ads: Ad[];
  handleAdAction: (id: string, action: "delete" | "pause" | "resume" | "approve" | "reject") => void;
  setSelectedViewAd: (ad: Ad) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (num: number) => string;
  handleSort: (field: string) => void;
  renderSortIcon: (field: string) => JSX.Element | null;
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: JSX.Element }
  > = {
    active: {
      bg: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      text: "Active",
      icon: <Play className="w-3 h-3 mr-1" />,
    },
    paused: {
      bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      text: "Paused",
      icon: <Pause className="w-3 h-3 mr-1" />,
    },
    completed: {
      bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      text: "Completed",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
    pending_review: {
      bg: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      text: "Pending",
      icon: <Clock className="w-3 h-3 mr-1" />,
    },
    rejected: {
      bg: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      text: "Rejected",
      icon: <XCircle className="w-3 h-3 mr-1" />,
    },
    waiting_payment: {
      bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      text: "Waiting",
      icon: <DollarSign className="w-3 h-3 mr-1" />,
    },
    payment_failed: {
      bg: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      text: "Failed",
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
    },
    canceled: {
      bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
      text: "Canceled",
      icon: <XCircle className="w-3 h-3 mr-1" />,
    },
    deleted: {
      bg: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      text: "Deleted",
      icon: <Trash2 className="w-3 h-3 mr-1" />,
    },
  };

  const config = statusConfig[status] || statusConfig.waiting_payment;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

const getSeverityBadge = (severity?: string) => {
  const severityConfig: Record<
    string,
    { bg: string; text: string; short: string }
  > = {
    critical: {
      bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      text: "Critical",
      short: "C",
    },
    high: {
      bg: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      text: "High",
      short: "H",
    },
    medium: {
      bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      text: "Medium",
      short: "M",
    },
    low: {
      bg: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      text: "Low",
      short: "L",
    },
    none: {
      bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
      text: "None",
      short: "-",
    },
  };

  const config = severityConfig[severity?.toLowerCase() || "none"];

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${config.bg}`}
      title={config.text}
    >
      {config.short}
    </span>
  );
};

// Component hiển thị target với tooltip
const TargetInfo: React.FC<{ ad: Ad }> = ({ ad }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
  }>({});
  const targetRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const tooltipHeight = 300; // Ước tính chiều cao tooltip
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Quyết định hiển thị tooltip ở trên hay dưới
      if (spaceBelow < tooltipHeight && spaceAbove > spaceBelow) {
        // Hiển thị phía trên
        setTooltipPosition({
          bottom: window.innerHeight - rect.top + 8,
          left: rect.left,
        });
      } else {
        // Hiển thị phía dưới
        setTooltipPosition({
          top: rect.bottom + 8,
          left: rect.left,
        });
      }
    }

    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 150);
  };

  return (
    <>
      <div
        ref={targetRef}
        className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Target className="w-4 h-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 w-72 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl p-4"
          style={tooltipPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Location */}
          <div className="mb-3">
            <div className="font-semibold mb-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Locations ({ad.target_location.length})</span>
            </div>
            <div className="text-gray-200 dark:text-gray-300 max-h-32 overflow-y-auto space-y-0.5">
              {ad.target_location.length > 0 ? (
                ad.target_location.map((location, index) => (
                  <div key={index}>• {location}</div>
                ))
              ) : (
                <div className="text-gray-400">All locations</div>
              )}
            </div>
          </div>

          {/* Age */}
          <div className="mb-3">
            <div className="font-semibold mb-1 flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Age Range</span>
            </div>
            <div className="text-gray-200 dark:text-gray-300">
              {ad.target_age.min}-{ad.target_age.max} years
            </div>
          </div>

          {/* Gender */}
          <div>
            <div className="font-semibold mb-1 flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Gender</span>
            </div>
            <div className="text-gray-200 dark:text-gray-300 capitalize">
              {ad.target_gender.length > 0
                ? ad.target_gender.join(", ")
                : "All genders"}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AllAdsTab: React.FC<AllAdsTabProps> = ({
  ads,
  handleAdAction,
  setSelectedViewAd,
  formatDate,
  formatCurrency,
  formatNumber,
  handleSort,
  renderSortIcon,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {/* Campaign & Advertiser combined */}
            <th className="px-4 py-3 text-left" style={{ minWidth: "280px" }}>
              <button
                onClick={() => handleSort("campaign_name")}
                className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
              >
                Campaign / Advertiser
                {renderSortIcon("campaign_name")}
              </button>
            </th>

            {/* Performance */}
            <th className="px-4 py-3 text-left" style={{ minWidth: "180px" }}>
              <button
                onClick={() => handleSort("target_views")}
                className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
              >
                Performance
                {renderSortIcon("target_views")}
              </button>
            </th>

            {/* Payment */}
            <th className="px-4 py-3 text-left" style={{ minWidth: "100px" }}>
              <button
                onClick={() => handleSort("payment.amount")}
                className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
              >
                Payment
                {renderSortIcon("payment.amount")}
              </button>
            </th>

            {/* Status & Info combined */}
            <th className="px-4 py-3 text-left" style={{ minWidth: "120px" }}>
              <button
                onClick={() => handleSort("status")}
                className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
              >
                Status / Info
                {renderSortIcon("status")}
              </button>
            </th>

            {/* Date */}
            <th className="px-4 py-3 text-left" style={{ minWidth: "100px" }}>
              <button
                onClick={() => handleSort("created_at")}
                className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
              >
                Date
                {renderSortIcon("created_at")}
              </button>
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
          {ads.map((ad) => (
            <tr
              key={ad._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {/* Campaign & Advertiser */}
              <td className="px-4 py-3">
                <div className="flex items-start space-x-3">
                  {/* Media Thumbnail */}
                  <div className="flex-shrink-0">
                    {ad.post.media && ad.post.media.length > 0 ? (
                      <div className="relative">
                        {ad.post.media[0].type === "video" && (
                          <video
                            src={ad.post.media[0].url}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        {ad.post.media[0].type === "image" && (
                          <img
                            src={
                              ad.post.media[0].thumbnail ||
                              ad.post.media[0].url
                            }
                            alt="Ad media"
                            className="w-10 h-10 rounded-lg object-cover"
                            loading="lazy"
                          />
                        )}
                        {ad.post.media.length > 1 && (
                          <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {ad.post.media.length}
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
                    {/* Campaign Name */}
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white truncate"
                      title={ad.campaign_name}
                    >
                      {ad.campaign_name}
                    </p>

                    {/* Advertiser */}
                    <div className="flex items-center space-x-2 mt-1">
                      <img
                        src={ad.user.avatar_url}
                        alt={ad.user.fullName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {ad.user.fullName}
                      </p>
                    </div>

                    {/* Content preview */}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                      {ad.post.content}
                    </p>
                  </div>
                </div>
              </td>

              {/* Performance */}
              <td className="px-4 py-3">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatNumber(ad.current_views)} /{" "}
                      {formatNumber(ad.target_views)}
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {ad.progress_percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                      style={{
                        width: `${Math.min(ad.progress_percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>{formatNumber(ad.total_interactions)}</span>
                  </div>
                </div>
              </td>

              {/* Payment */}
              <td className="px-4 py-3">
                {ad.payment ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(ad.payment.amount, ad.payment.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {ad.payment.method}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    No payment
                  </p>
                )}
              </td>

              {/* Status & Info */}
              <td className="px-4 py-3">
                <div className="flex flex-col space-y-2">
                  {/* Status */}
                  {getStatusBadge(ad.status)}

                  {/* Reports, Severity, Target icons in row */}
                  <div className="flex items-center space-x-2">
                    {/* Reports */}
                    {ad.post.pendingReportCount && ad.post.pendingReportCount > 0 ? (
                      <span
                        className="flex items-center space-x-0.5 text-orange-600 dark:text-orange-400"
                        title={`${ad.post.pendingReportCount} pending / ${ad.post.reportCount || 0} total reports`}
                      >
                        <Flag className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {ad.post.pendingReportCount}
                        </span>
                      </span>
                    ) : (
                      <span
                        className="text-gray-400 text-xs"
                        title="No reports"
                      >
                        <Flag className="w-3 h-3" />
                      </span>
                    )}

                    {/* Severity */}
                    {getSeverityBadge(ad.post.severity)}

                    {/* Target */}
                    <TargetInfo ad={ad} />
                  </div>
                </div>
              </td>

              {/* Date */}
              <td className="px-4 py-3">
                <div className="flex flex-col text-xs">
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(ad.post.createdAt)}
                  </span>
                  {ad.started_at && (
                    <span className="text-gray-500 dark:text-gray-400 mt-0.5">
                      Started: {formatDate(ad.started_at)}
                    </span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-center space-x-1">
                  <button
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                    title="View Details"
                    onClick={() => setSelectedViewAd(ad)}
                  >
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                  {ad.status !== "deleted" && ad.status !== "rejected" && (
                    <button
                      onClick={() => handleAdAction(ad._id, "delete")}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};