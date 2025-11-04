import api from "./axios";

// User Management APIs
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "blocked" | "deleted" | "";
  verified?: string | "";
  twoFA?: boolean | "";
  sortBy?: "createdAt" | "fullName" | "email" | "postsCount" | "lastLogin";
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
  gender?: "male" | "female" | "other" | "";
  location?: string | "";
}

export async function getAllUsers(filters: UserFilters = {}) {
  const params = new URLSearchParams();

  // Pagination
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  // Search
  if (filters.search) params.append("search", filters.search);

  // Filters
  if (filters.status) params.append("status", filters.status);
  if (filters.verified !== "" && filters.verified !== undefined) {
    params.append("verified", filters.verified.toString());
  }
  if (filters.twoFA !== "" && filters.twoFA !== undefined) {
    params.append("twoFA", filters.twoFA.toString());
  }
  if (filters.gender) params.append("gender", filters.gender);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.location) params.append("location", filters.location);

  // Sorting
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  return api.get(`/users?${params.toString()}`);
}

export async function getUserById(userId: string) {
  return api.get(`/users/${userId}`);
}

export async function updateUserStatus(
  userId: string,
  action: "block" | "unblock" | "activate" | "deactivate",
  reason?: string
) {
  return api.patch(`/users/${userId}/status`, { action, reason });
}

export async function deleteUser(userId: string) {
  return api.delete(`/users/${userId}`);
}

export async function getTopPosters(limit = 10, period = "30d") {
  return api.get(`/top-posters`, { params: { limit, period } });
}

// Dashboard APIs
export async function getPlatformStatistics() {
  return api.get("/statistics");
}

export async function getStatsData() {
  return api.get("/dashboard");
}

export async function getPostStats() {
  return api.get("/dashboard/post-stats");
}

export async function getUserGrowth() {
  return api.get("/dashboard/user-growth");
}

export async function getDailyInteractions() {
  return api.get("/dashboard/daily-interactions");
}

// Post Management APIs
export async function getAllPosts(
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value.toString());
  });
  return api.get(`/posts?${params.toString()}`);
}

// Payment Analytics APIs
export async function getPaymentAnalytics(period: '7' | '30' | '90' = '30') {
  return api.get("/dashboard/payment-analytics", { params: { period } });
}

export async function getPaymentSummary(period = "30d") {
  return api.get("/dashboard/payment-summary", { params: { period } });
}

export async function getPaymentMethodStats() {
  return api.get("/dashboard/payment-method-stats");
}
