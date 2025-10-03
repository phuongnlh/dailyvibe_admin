import api from "./axios";

export async function getAllUsers() {
  return api.get("/users");
}

export async function getPlatformStatistics() {
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