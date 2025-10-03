// System Settings Types and Interfaces

export interface SystemSettingValue {
  value: any;
  dataType: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  isEditable: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
    options?: string[];
  };
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
}

export interface SystemSettingsCategory {
  [key: string]: SystemSettingValue;
}

export interface SystemSettings {
  general?: SystemSettingsCategory;
  security?: SystemSettingsCategory;
  email?: SystemSettingsCategory;
  content?: SystemSettingsCategory;
  api?: SystemSettingsCategory;
  features?: SystemSettingsCategory;
  system?: SystemSettingsCategory;
}

export interface SettingUpdateRequest {
  settings: {
    [category: string]: {
      [key: string]: any;
    };
  };
}

export interface SettingUpdateResponse {
  success: boolean;
  message: string;
  data: {
    updated: Array<{
      category: string;
      key: string;
      value: any;
      success: boolean;
    }>;
    failed: Array<{
      category: string;
      key: string;
      error: string;
      success: boolean;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}

export interface SingleSettingUpdateRequest {
  value: any;
}

export interface SettingResetRequest {
  category?: string;
  keys?: string[];
}

export interface SystemInfo {
  server: {
    status: string;
    uptime: number;
    nodeVersion: string;
    platform: string;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    env: string;
  };
  database: {
    status: string;
    host: string;
  };
  api: {
    version: string;
    rateLimit: number;
  };
  features: {
    userRegistration: boolean;
    liveStreaming: boolean;
    marketplace: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Setting Categories
export type SettingCategory =
  | "general"
  | "security"
  | "email"
  | "content"
  | "api"
  | "features"
  | "system";

// Validation helper types
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// Format helpers for display
export interface FormattedSetting {
  category: string;
  key: string;
  label: string;
  description: string;
  value: any;
  dataType: string;
  isEditable: boolean;
  validation?: any;
  component: "input" | "textarea" | "select" | "toggle" | "number";
  options?: string[];
}
