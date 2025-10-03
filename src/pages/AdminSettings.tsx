import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";

import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Shield,
  Mail,
  Bell,
  Users,
  Image,
  Database,
  Key,
  Palette,
  Code,
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Download,
  Copy,
  ExternalLink,
  Server,
  Lock,
  Zap,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const AdminSettings: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Social Media Platform",
    siteDescription: "Connect with people around the world",
    siteUrl: "https://socialmedia.com",
    adminEmail: "admin@socialmedia.com",
    timezone: "UTC",
    language: "en",

    // Security Settings
    twoFactorAuth: true,
    passwordComplexity: true,
    sessionTimeout: 30,
    ipWhitelist: "",
    maxLoginAttempts: 5,

    // Content Settings
    autoModeration: true,
    contentFiltering: true,
    allowNSFW: false,
    maxFileSize: 10,
    allowedFileTypes: "jpg,png,gif,mp4,pdf",

    // Email Settings
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@socialmedia.com",
    smtpPassword: "••••••••••••",

    // API Settings
    rateLimit: 1000,
    apiVersion: "v1",
    corsEnabled: true,

    // Features
    userRegistration: true,
    postComments: true,
    directMessages: true,
    storyFeature: true,
    liveStreaming: false,
    marketplaceFeature: false,
  });

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "email", label: "Email", icon: Mail },
    { id: "content", label: "Content", icon: Image },
    { id: "api", label: "API", icon: Code },
    { id: "features", label: "Features", icon: Zap },
    { id: "system", label: "System", icon: Server },
  ];

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleInputChange = (key: string, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Save settings logic
    console.log("Saving settings:", settings);
  };

  const ToggleSwitch = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const SettingGroup = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const SettingItem = ({
    label,
    description,
    children,
  }: {
    label: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="Site Information"
        description="Basic information about your platform"
      >
        <SettingItem label="Site Name">
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange("siteName", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </SettingItem>

        <SettingItem label="Site Description">
          <textarea
            value={settings.siteDescription}
            onChange={(e) =>
              handleInputChange("siteDescription", e.target.value)
            }
            rows={2}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </SettingItem>

        <SettingItem label="Site URL">
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => handleInputChange("siteUrl", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </SettingItem>
      </SettingGroup>

      <SettingGroup
        title="Regional Settings"
        description="Configure regional and language preferences"
      >
        <SettingItem label="Timezone">
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange("timezone", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="CET">Central European Time</option>
          </select>
        </SettingItem>

        <SettingItem label="Default Language">
          <select
            value={settings.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="vi">Vietnamese</option>
          </select>
        </SettingItem>
      </SettingGroup>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="Authentication"
        description="Configure authentication and access control"
      >
        <SettingItem
          label="Two-Factor Authentication"
          description="Require 2FA for admin accounts"
        >
          <ToggleSwitch
            enabled={settings.twoFactorAuth}
            onToggle={() => handleToggle("twoFactorAuth")}
          />
        </SettingItem>

        <SettingItem
          label="Password Complexity"
          description="Enforce strong password requirements"
        >
          <ToggleSwitch
            enabled={settings.passwordComplexity}
            onToggle={() => handleToggle("passwordComplexity")}
          />
        </SettingItem>

        <SettingItem label="Session Timeout (minutes)">
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) =>
              handleInputChange("sessionTimeout", parseInt(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-20"
          />
        </SettingItem>

        <SettingItem label="Max Login Attempts">
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) =>
              handleInputChange("maxLoginAttempts", parseInt(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-20"
          />
        </SettingItem>
      </SettingGroup>

      <SettingGroup
        title="Access Control"
        description="Manage IP restrictions and access policies"
      >
        <SettingItem
          label="IP Whitelist"
          description="Comma-separated list of allowed IP addresses"
        >
          <textarea
            value={settings.ipWhitelist}
            onChange={(e) => handleInputChange("ipWhitelist", e.target.value)}
            placeholder="192.168.1.1, 10.0.0.1"
            rows={2}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </SettingItem>
      </SettingGroup>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="Email Configuration"
        description="Configure email delivery settings"
      >
        <SettingItem label="Email Provider">
          <select
            value={settings.emailProvider}
            onChange={(e) => handleInputChange("emailProvider", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="smtp">SMTP</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="ses">Amazon SES</option>
          </select>
        </SettingItem>

        <SettingItem label="SMTP Host">
          <input
            type="text"
            value={settings.smtpHost}
            onChange={(e) => handleInputChange("smtpHost", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </SettingItem>

        <SettingItem label="SMTP Port">
          <input
            type="number"
            value={settings.smtpPort}
            onChange={(e) =>
              handleInputChange("smtpPort", parseInt(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-24"
          />
        </SettingItem>

        <SettingItem label="SMTP Username">
          <input
            type="email"
            value={settings.smtpUser}
            onChange={(e) => handleInputChange("smtpUser", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </SettingItem>

        <SettingItem label="SMTP Password">
          <div className="flex items-center space-x-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={settings.smtpPassword}
              onChange={(e) =>
                handleInputChange("smtpPassword", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </SettingItem>
      </SettingGroup>

      <SettingGroup
        title="Email Templates"
        description="Manage email templates and notifications"
      >
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Welcome Email
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Password Reset
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Account Verification
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </SettingGroup>
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="Content Moderation"
        description="Configure automatic content moderation settings"
      >
        <SettingItem
          label="Auto Moderation"
          description="Automatically flag inappropriate content"
        >
          <ToggleSwitch
            enabled={settings.autoModeration}
            onToggle={() => handleToggle("autoModeration")}
          />
        </SettingItem>

        <SettingItem
          label="Content Filtering"
          description="Enable profanity and spam filtering"
        >
          <ToggleSwitch
            enabled={settings.contentFiltering}
            onToggle={() => handleToggle("contentFiltering")}
          />
        </SettingItem>

        <SettingItem
          label="Allow NSFW Content"
          description="Allow not-safe-for-work content with warnings"
        >
          <ToggleSwitch
            enabled={settings.allowNSFW}
            onToggle={() => handleToggle("allowNSFW")}
          />
        </SettingItem>
      </SettingGroup>

      <SettingGroup
        title="File Upload Settings"
        description="Configure file upload restrictions and limits"
      >
        <SettingItem label="Maximum File Size (MB)">
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) =>
              handleInputChange("maxFileSize", parseInt(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-24"
          />
        </SettingItem>

        <SettingItem
          label="Allowed File Types"
          description="Comma-separated list of allowed file extensions"
        >
          <input
            type="text"
            value={settings.allowedFileTypes}
            onChange={(e) =>
              handleInputChange("allowedFileTypes", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </SettingItem>
      </SettingGroup>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="API Configuration"
        description="Configure API access and rate limiting"
      >
        <SettingItem label="Rate Limit (requests/hour)">
          <input
            type="number"
            value={settings.rateLimit}
            onChange={(e) =>
              handleInputChange("rateLimit", parseInt(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-32"
          />
        </SettingItem>

        <SettingItem label="API Version">
          <select
            value={settings.apiVersion}
            onChange={(e) => handleInputChange("apiVersion", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="v1">Version 1</option>
            <option value="v2">Version 2</option>
            <option value="beta">Beta</option>
          </select>
        </SettingItem>

        <SettingItem
          label="CORS Enabled"
          description="Allow cross-origin resource sharing"
        >
          <ToggleSwitch
            enabled={settings.corsEnabled}
            onToggle={() => handleToggle("corsEnabled")}
          />
        </SettingItem>
      </SettingGroup>

      <SettingGroup
        title="API Keys"
        description="Manage API keys for external integrations"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Production API Key
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last used: 2 hours ago
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Development API Key
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last used: 1 day ago
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </SettingGroup>
    </div>
  );

  const renderFeaturesSettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="Core Features"
        description="Enable or disable core platform features"
      >
        <SettingItem
          label="User Registration"
          description="Allow new users to create accounts"
        >
          <ToggleSwitch
            enabled={settings.userRegistration}
            onToggle={() => handleToggle("userRegistration")}
          />
        </SettingItem>

        <SettingItem
          label="Post Comments"
          description="Allow users to comment on posts"
        >
          <ToggleSwitch
            enabled={settings.postComments}
            onToggle={() => handleToggle("postComments")}
          />
        </SettingItem>

        <SettingItem
          label="Direct Messages"
          description="Enable private messaging between users"
        >
          <ToggleSwitch
            enabled={settings.directMessages}
            onToggle={() => handleToggle("directMessages")}
          />
        </SettingItem>
      </SettingGroup>

      <SettingGroup
        title="Advanced Features"
        description="Optional features and experimental functionality"
      >
        <SettingItem
          label="Story Feature"
          description="Allow users to post temporary stories"
        >
          <ToggleSwitch
            enabled={settings.storyFeature}
            onToggle={() => handleToggle("storyFeature")}
          />
        </SettingItem>

        <SettingItem
          label="Live Streaming"
          description="Enable live video streaming capabilities"
        >
          <ToggleSwitch
            enabled={settings.liveStreaming}
            onToggle={() => handleToggle("liveStreaming")}
          />
        </SettingItem>

        <SettingItem
          label="Marketplace Feature"
          description="Allow users to buy and sell items"
        >
          <ToggleSwitch
            enabled={settings.marketplaceFeature}
            onToggle={() => handleToggle("marketplaceFeature")}
          />
        </SettingItem>
      </SettingGroup>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <SettingGroup
        title="System Information"
        description="Current system status and information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Server className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                Server Status
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Online
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                Database
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Connected
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                Uptime
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              99.8% (30 days)
            </span>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                Active Users
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              2,847 online
            </span>
          </div>
        </div>
      </SettingGroup>

      <SettingGroup
        title="Maintenance"
        description="System maintenance and backup options"
      >
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <span className="text-sm font-medium">Export System Logs</span>
            <Download className="w-4 h-4" />
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <span className="text-sm font-medium">Create Database Backup</span>
            <Database className="w-4 h-4" />
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <span className="text-sm font-medium">Clear Cache</span>
            <RefreshCw className="w-4 h-4" />
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <span className="text-sm font-medium">Maintenance Mode</span>
            <AlertCircle className="w-4 h-4" />
          </button>
        </div>
      </SettingGroup>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "general":
        return renderGeneralSettings();
      case "security":
        return renderSecuritySettings();
      case "email":
        return renderEmailSettings();
      case "content":
        return renderContentSettings();
      case "api":
        return renderApiSettings();
      case "features":
        return renderFeaturesSettings();
      case "system":
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <AdminLayout
      title="Admin Settings"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Platform Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure your social media platform settings and preferences
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>

              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedTab === tab.id
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
