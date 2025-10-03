import api from "./axios";

export interface RegisterData {
  email: string;
  fullName: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// Profile update interface
export interface UpdateProfileData {
  username?: string;
  fullName?: string;
  email?: string;
  bio?: string;
  phone?: string;
}

export interface UpdateAvatarData {
  file: File;
}

export interface UpdateCoverPhotoData {
  file: File;
}

// // Privacy settings
export interface PrivacySetting {
  key: string;
  privacy_level: string;
  custom_group?: string; // Optional for custom groups
}

// Authentication endpoints
export async function register(data: RegisterData) {
  return api.post("/user/register", data);
}

export const loginApi = (credentials: LoginData) => {
  return api.post("/user/login", credentials);
};

export async function logoutApi() {
  return api.post("/user/logout", {}, { withCredentials: true });
}

export async function logoutAllApi() {
  return api.post("/user/logout-all", {}, { withCredentials: true });
}

export async function verifyEmail(token: string) {
  return api.get(`/user/verify-email?token=${token}`);
}

export async function changePassword(data: ChangePasswordData) {
  return api.post("/user/change-password", data);
}

export async function forgotPassword(data: ForgotPasswordData) {
  return api.post("/user/forgot-password", data);
}

export async function resetPassword(data: ResetPasswordData) {
  return api.post(`/user/reset-password?token=${data.token}`, {
    newPassword: data.newPassword,
  });
}

export const getMe = () => {
  return api.get("/user");
};

export const getUserById = (userId: string) => {
  return api.get(`/user/${userId}`);
};

// Profile update endpoints
export async function updateProfile(data: UpdateProfileData) {
  return api.put("/user/profile", data);
}

export async function updateAvatar(data: UpdateAvatarData) {
  const formData = new FormData();
  formData.append("file", data.file); // Đổi từ "avatar" thành "file" theo API mới

  // Sử dụng endpoint đã xác nhận từ BE
  return api.post("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateCoverPhoto(data: UpdateCoverPhotoData) {
  const formData = new FormData();
  formData.append("file", data.file); // Đổi tên field để phù hợp với BE

  return api.post("/user/background", formData, {
    // Đổi method và đường dẫn
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteAccount(password: string) {
  return api.delete("/user/account", { data: { password } });
}

//2FA
export async function generateTwoFASecret() {
  return api.post("/user/2fa/generate");
}
export async function enableTwoFA(token: string) {
  return api.post("/user/2fa/enable", { token });
}
export async function verifyTwoFA(token: string) {
  return api.post("/user/2fa/verify", { token });
}
export async function disableTwoFA(token: string) {
  return api.post("/user/2fa/disable", { token });
}
export async function verifyTwoFALogin(userId: string, code: string) {
  return api.post("/user/2fa/verify-login", { userId, code });
}
