import api from "./axios";

// ================== INTERFACES ==================

export interface Post {
  _id: string;
  content: string;
  type: string;
  user_id: {
    _id: string;
    fullName: string;
    username: string;
    avatar_url: string;
    email: string;
  };
  reactionCount: number;
  commentCount: number;
  sharesCount: number;
  viewCount: number;
  reportCount: number;
  pendingReportCount: number;
  investigatingReportCount: number;
  resolvedReportCount: number;
  engagementScore: number;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  media: Array<{
    url: string;
    thumbnail: string;
    type: string;
    duration: number | null;
  }>;
  reports: PostReport[];
  reportTypeCount: Record<string, number>;
}

export interface PostReport {
  _id: string;
  reportType: string;
  reason: string;
  description?: string;
  status: string;
  actionTaken?: string;
  createdAt: string;
  reporter: {
    _id: string;
    fullName: string;
    avatar_url: string;
    email: string;
  };
}

export interface PostsWithReportsQuery {
  page?: number;
  limit?: number;
  search?: string;
  reportStatus?: "all" | "reported" | "pending" | "investigating" | "resolved";
  type?: string;
  hasMedia?: string;
  sortBy?:
    | "createdAt"
    | "reportCount"
    | "pendingReportCount"
    | "engagementScore";
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

export interface PostStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalPosts: number;
    postsToday: number;
    reportedPosts: number;
    deletedPosts: number;
  };
}

export interface PostReportItem {
  postId: string;
  post: {
    _id: string;
    content: string;
    type: string;
    severity?: string;
    reportStatus?: string;
    is_deleted: boolean;
    reactionCount?: number;
    commentCount?: number;
    media?: Array<{
      url: string;
      thumbnail?: string;
      type: string;
      duration?: string;
    }>;
    user_id: {
      _id: string;
      fullName: string;
      avatar_url: string;
      email: string;
      username: string;
    };
    createdAt: string;
  };
  reportCount: number;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  reports: PostReport[];
}

export interface GetPostReportsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  type?: "pending" | "investigating";
  search?: string;
}

export interface PostStatisticsResponse {
  success: boolean;
  data: {
    totalPosts: number;
    totalPostsWithPendingReports: number;
    totalPostsInvestigating: number;
  };
}

export interface ResolvedPostReportItem {
  reportCount: number;
  reports: PostReport[];
  latestReportDate: string;
  oldestReportDate: string;
  resolvedDate: string;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  dismissedCount: number;
  resolvedCount: number;
  contentRemovedCount: number;
  postId: string;
  post: {
    _id: string;
    user_id: {
      _id: string;
      email: string;
      fullName: string;
      avatar_url: string;
      username: string;
    };
    content: string;
    type: string;
    is_deleted: boolean;
    createdAt: string;
    severity?: string;
    media?: Array<{
      url: string;
      thumbnail?: string;
      type: string;
      duration?: string;
    }>;
  };
}

export interface GetResolvedReportsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface ResolvedReportsPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
}

export interface ResolvedReportsStatistics {
  totalResolvedReports: number;
  totalDismissedReports: number;
  totalResolvedWithAction: number;
  totalPosts: number;
}

export interface ResolvedPostReportsResponse {
  success: boolean;
  data: {
    postReports: ResolvedPostReportItem[];
    pagination: ResolvedReportsPagination;
    statistics: ResolvedReportsStatistics;
  };
}

// ================== API FUNCTIONS ==================

// Get post statistics
export async function getPostStats() {
  return api.get<PostStatsResponse>("/admin/posts/stats");
}

// Delete a post
export async function deletePost(postId: string) {
  return api.patch(`/posts/${postId}`, { is_deleted: true });
}

// Restore a post
export async function restorePost(postId: string) {
  return api.patch(`/posts/${postId}`, { is_deleted: false });
}

export const getPendingPostReports = async (params: GetPostReportsParams) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return api.get(`/posts/reports/by-status?${queryParams.toString()}`);
};

export const dismissAllPendingReportsOfPost = async (postId: string) => {
  return api.patch(`/posts/reports/${postId}/dismiss-all`);
};

export const markPostAsInvestigating = async (postId: string) => {
  return api.patch(`/posts/reports/${postId}/mark-investigating`);
};

export const getPostStatistics = async () => {
  return api.get<PostStatisticsResponse>("/posts/statistics");
};

export const getResolvedPostReports = async (
  params: GetResolvedReportsParams
) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return api.get<ResolvedPostReportsResponse>(
    `/posts/reports/resolved?${queryParams.toString()}`
  );
};
