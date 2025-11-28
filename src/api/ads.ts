import api from "./axios";

// ================== INTERFACES ==================

export interface Ad {
  _id: string;
  campaign_name: string;
  user: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar_url: string;
  };
  post: {
    _id: string;
    content: string;
    type: string;
    createdAt: string;
    severity: string;
    media?: Array<{
      url: string;
      thumbnail?: string;
      type: string;
      duration?: string;
    }>;
    reportCount?: number;
    pendingReportCount?: number;
  };
  payment?: {
    _id?: string;
    method: string;
    amount: number;
    currency: string;
    status: string;
    completed_at: string;
  };
  target_location: string[];
  target_age: {
    min: number;
    max: number;
  };
  target_gender: string[];
  target_views: number;
  current_views: number;
  total_interactions: number;
  progress_percentage: number;
  started_at?: string;
  completed_at?: string;
  deleted_at: string | null;
  status:
    | "active"
    | "paused"
    | "completed"
    | "waiting_payment"
    | "pending_review"
    | "payment_failed"
    | "canceled"
    | "deleted"
    | "rejected";

  investigatingReportCount?: number;
  resolvedReportCount?: number;
  severity?: string;
  reportStatus?: string;
  created_at: string;
  updated_at: string;
}

export interface AdReport {
  _id: string;
  reportType: string;
  reason: string;
  description?: string;
  status: string;
  actionTaken?: string;
  createdAt: string;
  resolvedAt?: string;
  reporter: {
    _id: string;
    fullName: string;
    avatar_url: string;
    email: string;
  };
}

export interface AdReportItem {
  adId: string;
  ad: {
    _id: string;
    campaign_name: string;
    status: string;
    severity?: string;
    reportStatus?: string;
    current_views: number;
    target_views: number;
    progress_percentage: number;
    user: {
      _id: string;
      fullName: string;
      avatar_url: string;
      email: string;
      username: string;
    };
    post: {
      _id: string;
      content: string;
      type: string;
      createdAt: string;
      media?: Array<{
        url: string;
        thumbnail?: string;
        type: string;
        duration?: string;
      }>;
    };
    payment?: {
      method: string;
      amount: number;
      currency: string;
      status: string;
    };
    created_at: string;
  };
  reportCount: number;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  reports: AdReport[];
}

export interface ResolvedAdReportItem {
  reportCount: number;
  reports: AdReport[];
  latestReportDate: string;
  oldestReportDate: string;
  resolvedDate: string;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  dismissedCount: number;
  resolvedCount: number;
  contentRemovedCount: number;
  adId: string;
  ad: {
    _id: string;
    campaign_name: string;
    status: string;
    severity?: string;
    current_views: number;
    target_views: number;
    progress_percentage: number;
    user: {
      _id: string;
      fullName: string;
      avatar_url: string;
      email: string;
      username: string;
    };
    post: {
      _id: string;
      content: string;
      type: string;
      createdAt: string;
      media?: Array<{
        url: string;
        thumbnail?: string;
        type: string;
        duration?: string;
      }>;
    };
    payment?: {
      method: string;
      amount: number;
      currency: string;
      status: string;
    };
    created_at: string;
  };
}

export interface AdsPostReportItem {
  postId: string;
  post: {
    _id: string;
    content: string;
    type: string;
    severity?: string;
    is_deleted: boolean;
    user_id: {
      _id: string;
      fullName: string;
      avatar_url: string;
      email: string;
      username: string;
    };
    createdAt: string;
    media?: Array<{
      url: string;
      thumbnail?: string;
      type: string;
      duration?: string;
    }>;
  };
  ads: Array<{
    _id: string;
    campaign_name: string;
    status: string;
    target_views: number;
    current_views: number;
    started_at?: string;
    completed_at?: string;
    total_interactions: number;
  }>;
  reportCount: number;
  reportTypes: string[];
  reportTypeCount: Record<string, number>;
  reports: AdReport[];
  latestReportDate: string;
  oldestReportDate: string;
}

export interface ResolvedAdsPostReportItem extends AdsPostReportItem {
  resolvedDate: string;
  dismissedCount: number;
  resolvedCount: number;
  contentRemovedCount: number;
}

export interface GetAdsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  min_views?: number;
  max_views?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}


export interface GetAdsPostReportsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "investigating";
  reportType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface GetResolvedAdsPostReportsParams {
  page?: number;
  limit?: number;
  status?: "all" | "dismissed" | "resolved";
  reportType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  actionTaken?: string;
}

export interface AdsResponse {
  success: boolean;
  message: string;
  data: {
    docs: Ad[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export interface AdStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalAds: number;
    activeAds: number;
    completedAds: number;
    pendingReviewAds: number;
    totalRevenue: {
      VND?: number;
      USD?: number;
      [key: string]: number | undefined;
    };
    totalViews: number;
    totalInteractions: number;
  };
}

export interface AdStatisticsResponse {
  success: boolean;
  data: {
    totalAds: number;
    totalAdsWithPendingReports: number;
    totalAdsInvestigating: number;
  };
}

export interface AdReportsResponse {
  success: boolean;
  data: {
    adReports: AdReportItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReportedAds: number;
      limit: number;
    };
  };
}

export interface ResolvedAdReportsResponse {
  success: boolean;
  data: {
    adReports: ResolvedAdReportItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalAds: number;
      limit: number;
    };
    statistics: {
      totalResolvedReports: number;
      totalDismissedReports: number;
      totalResolvedWithAction: number;
      totalAds: number;
    };
  };
}

export interface AdsPostReportsResponse {
  success: boolean;
  data: {
    postReports: AdsPostReportItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      limit: number;
    };
    statistics: {
      totalReports: number;
      totalPosts: number;
    };
  };
}

export interface ResolvedAdsPostReportsResponse {
  success: boolean;
  data: {
    postReports: ResolvedAdsPostReportItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      limit: number;
    };
    statistics: {
      totalResolvedReports: number;
      totalDismissedReports: number;
      totalResolvedWithAction: number;
      totalPosts: number;
    };
  };
}
export interface AdReportStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalAds: number;
    totalPending: number;
    totalInvestigating: number;
  };
}

// ================== API FUNCTIONS ==================

// Get all ads with filters and pagination
export async function getAllAds(params: GetAdsParams = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return api.get<AdsResponse>(`/ads?${queryParams.toString()}`);
}

// Get ad statistics
export async function getAdStats() {
  return api.get<AdStatsResponse>("/ads/stats");
}

// Get ad statistics
export async function getAdStatistics() {
  return api.get<AdStatisticsResponse>("/ads/stats");
}

export async function getAdsPostReportsByStatus(
  params: GetAdsPostReportsParams = {}
) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return api.get<AdsPostReportsResponse>(
    `/ads/reports/by-status?${queryParams.toString()}`
  );
}

export async function getResolvedAdsPostReports(
  params: GetResolvedAdsPostReportsParams = {}
) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return api.get<ResolvedAdsPostReportsResponse>(
    `/ads/reports/resolved?${queryParams.toString()}`
  );
}

// Dismiss all pending reports for an ad
export async function dismissAllPendingReportsOfAd(adId: string) {
  return api.patch(`/ads/reports/${adId}/dismiss-all`);
}

// Mark ad as investigating
export async function markAdAsInvestigating(adId: string) {
  console.log("Marking ad as investigating:", adId);
  return api.patch(`/ads/reports/${adId}/mark-investigating`);
}

// Pause an ad
export async function pauseAd(adId: string) {
  return api.patch(`/ads/${adId}/pause`);
}

// Resume an ad
export async function resumeAd(adId: string) {
  return api.patch(`/ads/${adId}/resume`);
}

// Approve an ad (pending_review -> active)
export async function approveAd(adId: string) {
  return api.patch(`/ads/${adId}/approve`);
}

// Reject an ad (pending_review -> rejected)
export async function rejectAd(adId: string, reason?: string) {
  return api.patch(`/ads/${adId}/reject`, { reason });
}

// Delete an ad (soft delete)
export async function deleteAd(adId: string) {
  return api.delete(`/ads/${adId}`);
}

// Get ad details
export async function getAdDetails(adId: string) {
  return api.get(`/ads/${adId}`);
}

// Update ad
export async function updateAd(adId: string, data: Partial<Ad>) {
  return api.patch(`/ads/${adId}`, data);
}

// Get ad report statistics
export async function getAdReportStats() {
  return api.get<AdReportStatsResponse>("/ads/report-stats");
}
