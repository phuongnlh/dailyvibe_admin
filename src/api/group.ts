import api from "./axios";

// Types
export interface Creator {
  _id: string;
  email: string;
  fullName: string;
  avatar_url: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  cover_url: string;
  privacy: "Public" | "Private";
  post_approval: boolean;
  creator: Creator;
  created_at: string;
  __v: number;
  memberCount: number;
  postCount: number;
  reportCount: number;
  pendingReportCount: number;
  severity?: string;
  status?: string;
  warningCount: number;
  warnings?: any[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalGroups: number;
  limit: number;
}

export interface Statistics {
  totalActiveGroups: number;
  totalDeletedGroups: number;
  totalPosts: number;
  totalMembers: number;
}

export interface GetGroupsResponse {
  success: boolean;
  data: {
    groups: Group[];
    pagination: Pagination;
    statistics: Statistics;
  };
}

export interface GetGroupsParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface Reporter {
  _id: string;
  email: string;
  fullName: string;
  avatar_url: string;
}

export interface GroupReport {
  _id: string;
  reportType: string;
  reason: string;
  status: string;
  reporter: Reporter;
  createdAt: string;
}

export interface GroupReportItem {
  reportCount: number;
  reports: GroupReport[];
  latestReportDate: string;
  oldestReportDate: string;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  groupId: string;
  group: Group;
}

export interface PendingReportsPagination {
  currentPage: number;
  totalPages: number;
  totalReportedGroups: number;
  limit: number;
  totalInvestigatingGroups?: number;
  totalPendingGroups?: number;
}

export interface PendingReportsStatistics {
  totalPendingReports: number;
  totalReportedGroups: number;
}

export interface GetPendingReportsResponse {
  success: boolean;
  data: {
    groupReports: GroupReportItem[];
    pagination: PendingReportsPagination;
    statistics: PendingReportsStatistics;
  };
}

export interface GetPendingReportsParams {
  page?: number;
  limit?: number;
  type?: "pending" | "investigating";
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface GroupStatistics {
  totalGroups: number;
  totalGroupWithPendingReports: number;
  totalGroupInvestigating: number;
}

export interface GetGroupStatisticsResponse {
  success: boolean;
  data: GroupStatistics;
}

export interface DismissReportsResponse {
  success: boolean;
  message: string;
  data: {
    dismissedCount: number;
    groupStatus: string;
  };
}

export interface SendWarningRequest {
  reason?: string;
  adminNote: string;
  violationType?: string;
}

export interface SendWarningResponse {
  success: boolean;
  message: string;
  data: {
    warningCount: number;
    severity: string;
    resolvedReports: number;
    group: {
      _id: string;
      name: string;
      status: string;
      warningCount: number;
      severity: string;
    };
  };
}

export interface MarkInvestigatingResponse {
  success: boolean;
  message: string;
  data: {
    group: Group;
  };
}

export interface ResolvedGroupReport extends GroupReport {
  actionTaken: string;
  resolvedAt: string;
  assignedTo?: string;
}

export interface ResolvedGroupReportItem {
  reportCount: number;
  reports: ResolvedGroupReport[];
  latestReportDate: string;
  oldestReportDate: string;
  resolvedDate: string;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  dismissedCount: number;
  resolvedCount: number;
  warningCount: number;
  groupId: string;
  group: Group;
}

export interface ResolvedReportsPagination {
  currentPage: number;
  totalPages: number;
  totalGroups: number;
  limit: number;
}

export interface ResolvedReportsStatistics {
  totalResolvedReports: number;
  totalDismissedReports: number;
  totalResolvedWithAction: number;
  totalGroups: number;
}

export interface GetResolvedReportsResponse {
  success: boolean;
  data: {
    groupReports: ResolvedGroupReportItem[];
    pagination: ResolvedReportsPagination;
    statistics: ResolvedReportsStatistics;
  };
}

export interface GetResolvedReportsParams {
  page?: number;
  limit?: number;
  status?: "dismissed" | "resolved";
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface GroupPostUser {
  _id: string;
  username: string;
  fullName: string;
  avatar_url: string;
}

export interface GroupPostMedia {
  url: string;
  type: "image" | "video";
}

export interface GroupPost {
  _id: string;
  group_id: string;
  user_id: GroupPostUser;
  content: string;
  status: "approved" | "pending";
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  viewCount?: number;
  media: GroupPostMedia[];
}

export interface PostPagination {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PostsData {
  data: GroupPost[];
  pagination: PostPagination;
}

export interface GetGroupPostsForAdminResponse {
  approvedPosts: PostsData;
  pendingPosts: PostsData;
  statistics: {
    totalApproved: number;
    totalPending: number;
    total: number;
  };
}

export interface GetGroupPostsForAdminParams {
  approvedPage?: number;
  approvedLimit?: number;
  pendingPage?: number;
  pendingLimit?: number;
}

export interface DeleteGroupRequest {
  reason?: string;
  adminNote: string;
  violationType: string;
}

export interface DeleteGroupResponse {
  success: boolean;
  message: string;
  data: {
    action: string;
    severity: string;
    resolvedReports: number;
    groupName: string;
  };
}

// API Functions
export async function getAllGroups(params?: GetGroupsParams) {
  return api.get<GetGroupsResponse>("/groups", { params });
}

export async function getPendingGroupReports(params?: GetPendingReportsParams) {
  return api.get<GetPendingReportsResponse>("/groups/reports", { params });
}

export async function getGroupStatistics() {
  return api.get<GetGroupStatisticsResponse>("/groups/statistics");
}

export async function dismissAllPendingReportsOfGroup(groupId: string) {
  return api.patch<DismissReportsResponse>(`/groups/${groupId}/reports/dismiss`);
}

export async function sendWarningToGroup(groupId: string, data: SendWarningRequest) {
  return api.post<SendWarningResponse>(`/groups/${groupId}/reports/send-warning`, data);
}

export async function markGroupAsInvestigating(groupId: string) {
  return api.patch<MarkInvestigatingResponse>(`/groups/${groupId}/mark-investigating`);
}

export async function getResolvedGroupReports(params?: GetResolvedReportsParams) {
  return api.get<GetResolvedReportsResponse>("/groups/reports/resolved", { params });
}

export async function getGroupPostsForAdmin(group_id: string, params?: GetGroupPostsForAdminParams) {
  return api.get<GetGroupPostsForAdminResponse>(`/groups/${group_id}/posts`, {params});
}

export async function deleteGroupForSevereViolation(
  groupId: string,
  data: DeleteGroupRequest
) {
  return api.delete<DeleteGroupResponse>(`/groups/${groupId}`, {
    data,
  });
}