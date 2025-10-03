import api from "./axios";

// ================== INTERFACES ==================

export interface ReportEvidence {
  type: "image" | "video" | "screenshot" | "link" | "document";
  url: string;
  description?: string;
}

export interface CreateReportData {
  reportedPost: string;
  reportType:
    | "spam"
    | "harassment"
    | "inappropriate_content"
    | "fake_news"
    | "copyright"
    | "violence"
    | "hate_speech"
    | "nudity"
    | "terrorism"
    | "self_harm"
    | "scam"
    | "impersonation"
    | "other";
  description: string;
  reason: string;
  evidence?: ReportEvidence[];
  reporterInfo?: {
    location?: {
      country?: string;
      city?: string;
    };
  };
}

export interface UpdateReportStatusData {
  status?: "pending" | "investigating" | "resolved" | "dismissed" | "escalated";
  priority?: "low" | "medium" | "high" | "urgent";
  actionTaken?:
    | "none"
    | "warning_sent"
    | "content_removed"
    | "user_suspended"
    | "user_banned"
    | "content_hidden"
    | "age_restricted"
    | "education_sent";
}

export interface AssignReportData {
  adminId: string;
}

export interface AddAdminNoteData {
  note: string;
}

export interface ResolveReportData {
  resolution: string;
  actionTaken?:
    | "none"
    | "warning_sent"
    | "content_removed"
    | "user_suspended"
    | "user_banned"
    | "content_hidden"
    | "age_restricted"
    | "education_sent";
}

export interface BulkUpdateReportsData {
  reportIds: string[];
  updates: {
    status?:
      | "pending"
      | "investigating"
      | "resolved"
      | "dismissed"
      | "escalated";
    priority?: "low" | "medium" | "high" | "urgent";
    assignedTo?: string;
  };
}

export interface ReportListQuery {
  page?: number;
  limit?: number;
  status?: "pending" | "investigating" | "resolved" | "dismissed" | "escalated";
  reportType?:
    | "spam"
    | "harassment"
    | "inappropriate_content"
    | "fake_news"
    | "copyright"
    | "violence"
    | "hate_speech"
    | "nudity"
    | "terrorism"
    | "self_harm"
    | "scam"
    | "impersonation"
    | "other";
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
  sortOrder?: "asc" | "desc";
}

export interface ReportStatsQuery {
  timeframe?: string; // format: "30d", "7d", etc.
}

// ================== USER API FUNCTIONS ==================

// Tạo báo cáo mới
export async function createReport(data: CreateReportData) {
  return api.post("/reports", data);
}

// Lấy báo cáo của user hiện tại
export async function getUserReports(query?: ReportListQuery) {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", query.page.toString());
  if (query?.limit) params.append("limit", query.limit.toString());
  if (query?.status) params.append("status", query.status);

  return api.get(`/reports/my-reports?${params.toString()}`);
}

// Xóa báo cáo của user (chỉ khi pending)
export async function deleteUserReport(reportId: string) {
  return api.delete(`/reports/${reportId}`);
}

// ================== ADMIN API FUNCTIONS ==================

// Lấy danh sách tất cả báo cáo (Admin)
export async function getAllReports(query?: ReportListQuery) {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", query.page.toString());
  if (query?.limit) params.append("limit", query.limit.toString());
  if (query?.status) params.append("status", query.status);
  if (query?.reportType) params.append("reportType", query.reportType);
  if (query?.priority) params.append("priority", query.priority);
  if (query?.assignedTo) params.append("assignedTo", query.assignedTo);
  if (query?.search) params.append("search", query.search);
  if (query?.sortBy) params.append("sortBy", query.sortBy);
  if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

  return api.get(`/reports?${params.toString()}`);
}

// Lấy thống kê báo cáo (Admin)
export async function getReportStats(query?: ReportStatsQuery) {
  const params = new URLSearchParams();

  if (query?.timeframe) params.append("timeframe", query.timeframe);

  return api.get(`/reports/stats?${params.toString()}`);
}

// Lấy chi tiết báo cáo (Admin)
export async function getReportById(reportId: string) {
  return api.get(`/reports/${reportId}`);
}

// Cập nhật trạng thái báo cáo (Admin)
export async function updateReportStatus(
  reportId: string,
  data: UpdateReportStatusData
) {
  return api.patch(`/reports/${reportId}/status`, data);
}

// Gán báo cáo cho admin (Admin)
export async function assignReport(reportId: string, data: AssignReportData) {
  return api.patch(`/reports/${reportId}/assign`, data);
}

// Thêm ghi chú admin (Admin)
export async function addAdminNote(reportId: string, data: AddAdminNoteData) {
  return api.post(`/reports/${reportId}/notes`, data);
}

// Giải quyết báo cáo (Admin)
export async function resolveReport(reportId: string, data: ResolveReportData) {
  return api.patch(`/reports/${reportId}/resolve`, data);
}

// Bulk update báo cáo (Admin)
export async function bulkUpdateReports(data: BulkUpdateReportsData) {
  return api.patch("/reports/bulk-update", data);
}

// ================== UTILITY FUNCTIONS ==================

// Helper function để build query string
export function buildReportQuery(query: ReportListQuery): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
}

// Helper function để format report type cho hiển thị
export function formatReportType(reportType: string): string {
  const typeMap: Record<string, string> = {
    spam: "Spam",
    harassment: "Harassment",
    inappropriate_content: "Inappropriate Content",
    fake_news: "Fake News",
    copyright: "Copyright Violation",
    violence: "Violence",
    hate_speech: "Hate Speech",
    nudity: "Nudity",
    terrorism: "Terrorism",
    self_harm: "Self Harm",
    scam: "Scam",
    impersonation: "Impersonation",
    other: "Other",
  };

  return typeMap[reportType] || reportType;
}

// Helper function để format status cho hiển thị
export function formatReportStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    investigating: "Under Investigation",
    resolved: "Resolved",
    dismissed: "Dismissed",
    escalated: "Escalated",
  };

  return statusMap[status] || status;
}

// Helper function để format priority cho hiển thị
export function formatReportPriority(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return priorityMap[priority] || priority;
}

// Helper function để format action taken cho hiển thị
export function formatActionTaken(actionTaken: string): string {
  const actionMap: Record<string, string> = {
    none: "No Action",
    warning_sent: "Warning Sent",
    content_removed: "Content Removed",
    user_suspended: "User Suspended",
    user_banned: "User Banned",
    content_hidden: "Content Hidden",
    age_restricted: "Age Restricted",
    education_sent: "Educational Content Sent",
  };

  return actionMap[actionTaken] || actionTaken;
}

// Legacy function for backward compatibility
export async function reportContent(data: CreateReportData) {
  return createReport(data);
}
