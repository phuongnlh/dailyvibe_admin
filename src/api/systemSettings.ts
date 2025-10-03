import axios, { AxiosResponse } from "axios";
import {
  SystemSettings,
  SystemSettingValue,
  SettingUpdateRequest,
  SettingUpdateResponse,
  SettingResetRequest,
  SystemInfo,
  ApiResponse,
  SettingCategory,
  ValidationResult,
  FormattedSetting,
} from "./systemSettings.types";
import api from "./axios";

export class SystemSettingsAPI {
  /**
   * Get all settings or settings by category
   */
  static async getSettings(
    category?: SettingCategory
  ): Promise<SystemSettings> {
    try {
      const params = category ? { category } : {};
      const response: AxiosResponse<ApiResponse<SystemSettings>> =
        await api.get("/admin/settings", { params });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch settings");
      }

      return response.data.data || {};
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch settings"
      );
    }
  }

  /**
   * Update multiple settings
   */
  static async updateSettings(
    settings: SettingUpdateRequest["settings"]
  ): Promise<SettingUpdateResponse> {
    try {
      const response: AxiosResponse<SettingUpdateResponse> = await api.put(
        "/admin/settings",
        { settings }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error updating settings:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update settings"
      );
    }
  }

  /**
   * Update single setting
   */
  static async updateSingleSetting(
    category: SettingCategory,
    key: string,
    value: any
  ): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.put(
        `/admin/settings/${category}/${key}`,
        { value }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error updating single setting:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update setting"
      );
    }
  }

  /**
   * Reset settings to default values
   */
  static async resetSettings(
    resetRequest: SettingResetRequest = {}
  ): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post(
        "/admin/settings/reset",
        resetRequest
      );

      return response.data;
    } catch (error: any) {
      console.error("Error resetting settings:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset settings"
      );
    }
  }

  /**
   * Validate setting value without saving
   */
  static async validateSetting(
    category: SettingCategory,
    key: string,
    value: any
  ): Promise<ValidationResult> {
    try {
      const response: AxiosResponse<ApiResponse<{ valid: boolean }>> =
        await api.post(`/admin/settings/${category}/${key}/validate`, {
          value,
        });

      return {
        valid: response.data.data?.valid || false,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        valid: false,
        message:
          error.response?.data?.message || error.message || "Validation failed",
      };
    }
  }

  /**
   * Get system information
   */
  static async getSystemInfo(): Promise<SystemInfo> {
    try {
      const response: AxiosResponse<ApiResponse<SystemInfo>> = await api.get(
        "/admin/settings/system-info"
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch system info");
      }

      return response.data.data!;
    } catch (error: any) {
      console.error("Error fetching system info:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch system info"
      );
    }
  }
}

// Utility functions
export class SettingsUtils {
  /**
   * Format settings for display in UI components
   */
  static formatSettingsForDisplay(
    settings: SystemSettings
  ): FormattedSetting[] {
    const formatted: FormattedSetting[] = [];

    // Labels for better UI display
    const labels: Record<string, Record<string, string>> = {
      general: {
        siteName: "Site Name",
        siteDescription: "Site Description",
        siteUrl: "Site URL",
        adminEmail: "Admin Email",
        timezone: "Timezone",
        language: "Default Language",
      },
      security: {
        twoFactorAuth: "Two-Factor Authentication",
        passwordComplexity: "Password Complexity",
        sessionTimeout: "Session Timeout (minutes)",
        maxLoginAttempts: "Max Login Attempts",
        ipWhitelist: "IP Whitelist",
      },
      content: {
        autoModeration: "Auto Moderation",
        contentFiltering: "Content Filtering",
        allowNSFW: "Allow NSFW Content",
        maxFileSize: "Max File Size (MB)",
        allowedFileTypes: "Allowed File Types",
      },
      api: {
        rateLimit: "Rate Limit (requests/hour)",
        apiVersion: "API Version",
        corsEnabled: "CORS Enabled",
      },
      features: {
        userRegistration: "User Registration",
        postComments: "Post Comments",
        directMessages: "Direct Messages",
        storyFeature: "Story Feature",
        liveStreaming: "Live Streaming",
        marketplaceFeature: "Marketplace Feature",
      },
    };

    Object.entries(settings).forEach(([category, categorySettings]) => {
      if (categorySettings) {
        Object.entries(categorySettings).forEach(([key, settingData]) => {
          const setting = settingData as SystemSettingValue;
          const component = SettingsUtils.getComponentType(
            setting.dataType,
            setting.validation
          );

          formatted.push({
            category,
            key,
            label: labels[category]?.[key] || key,
            description: setting.description,
            value: setting.value,
            dataType: setting.dataType,
            isEditable: setting.isEditable,
            validation: setting.validation,
            component,
            options: setting.validation?.options,
          });
        });
      }
    });

    return formatted;
  }

  /**
   * Determine appropriate UI component type for a setting
   */
  static getComponentType(
    dataType: string,
    validation?: any
  ): "input" | "textarea" | "select" | "toggle" | "number" {
    if (dataType === "boolean") {
      return "toggle";
    }
    if (dataType === "number") {
      return "number";
    }
    if (validation?.options) {
      return "select";
    }
    if (dataType === "string") {
      return "input";
    }
    return "input";
  }

  /**
   * Validate setting value on client side
   */
  static validateValue(
    setting: FormattedSetting,
    value: any
  ): ValidationResult {
    const { dataType, validation } = setting;

    try {
      // Type validation
      switch (dataType) {
        case "string":
          if (typeof value !== "string") {
            return { valid: false, message: "Value must be a string" };
          }
          if (
            validation?.pattern &&
            !new RegExp(validation.pattern).test(value)
          ) {
            return {
              valid: false,
              message: "Value does not match required pattern",
            };
          }
          if (validation?.options && !validation.options.includes(value)) {
            return {
              valid: false,
              message: `Value must be one of: ${validation.options.join(", ")}`,
            };
          }
          break;

        case "number":
          const num = Number(value);
          if (isNaN(num)) {
            return { valid: false, message: "Value must be a number" };
          }
          if (validation?.min !== undefined && num < validation.min) {
            return {
              valid: false,
              message: `Value must be at least ${validation.min}`,
            };
          }
          if (validation?.max !== undefined && num > validation.max) {
            return {
              valid: false,
              message: `Value must be at most ${validation.max}`,
            };
          }
          break;

        case "boolean":
          if (typeof value !== "boolean") {
            return { valid: false, message: "Value must be a boolean" };
          }
          break;
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, message: "Validation error" };
    }
  }

  /**
   * Group settings by category for organized display
   */
  static groupSettingsByCategory(
    settings: FormattedSetting[]
  ): Record<string, FormattedSetting[]> {
    return settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, FormattedSetting[]>);
  }

  /**
   * Format system uptime for display
   */
  static formatUptime(uptimeSeconds: number): string {
    const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Format memory usage for display
   */
  static formatMemoryUsage(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }
}
