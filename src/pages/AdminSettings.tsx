import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

import axios from "axios";
import { ChevronDown, Mail, Settings, Upload, User, Users } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api/axios";
import EmailTemplateForm from "../components/EmailTemplateForm";

const AdminSettings: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [saveloading, setSaveLoading] = useState(false);

  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "email", label: "Email Templates", icon: Mail },
  ];

  // Avatar upload handlers
  const handleAvatarUpload = async (file: File, type: "user" | "group") => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Please select an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "File size must be less than 5MB", "error");
      return;
    }

    const updateUrl = type === "user" ? "avatars/avatar.jpg" : "channels/channel-avatar.jpg";

    try {
      setSaveLoading(true);
      const res = await api.post("/upload/update", { oldFilePath: updateUrl });
      const presignedData = res.data;

      const response = await axios.put(presignedData.url, file, {
        headers: { "Content-Type": file.type },
      });

      if (response.status === 200) {
        Swal.fire("Success", `Default ${type} avatar updated successfully`, "success");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Swal.fire("Error", "Failed to upload avatar", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "user" | "group") => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file, type);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/email-templates");
        setTemplates(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        Swal.fire("Error", "Failed to load email templates", "error");
      }
    };

    fetchTemplates();
  }, []);

  const handleSelect = async (type: string) => {
    try {
      setSelected(templates.find((t) => t.type === type) || null);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  };

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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const AvatarUpload = ({
    label,
    currentAvatar,
    type,
    icon: IconComponent,
  }: {
    label: string;
    currentAvatar: string;
    type: "user" | "group";
    icon: React.ComponentType<any>;
  }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>

      <div className="flex items-center space-x-4">
        {/* Current Avatar Preview */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt={`Default ${type} avatar`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <IconComponent className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, type)}
                className="sr-only"
                disabled={saveloading}
              />
              <div className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload New</span>
              </div>
            </label>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Recommended: 200x200px, max 5MB.</p>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <SettingGroup title="Default Avatars" description="Set default avatars for new users and group chats">
        <AvatarUpload
          label="Default User Avatar"
          currentAvatar={`https://minio.dailyvibe.online/dailyvibe/avatars/avatar.jpg?v=${Date.now()}`}
          type="user"
          icon={User}
        />

        <AvatarUpload
          label="Default Group Chat Avatar"
          currentAvatar={`https://minio.dailyvibe.online/dailyvibe/channels/channel-avatar.jpg?v=${Date.now()}`}
          type="group"
          icon={Users}
        />
      </SettingGroup>
    </div>
  );

  const renderEmailSettings = () => <EmailTemplateForm selected={selected} />;

  const renderTabContent = () => {
    switch (selectedTab) {
      case "general":
        return renderGeneralSettings();
      case "email":
        return renderEmailSettings();
      default:
        return renderGeneralSettings();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <AdminLayout title="Admin Settings">
      <div className="space-y-6">
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

              {/* Email Template Dropdown - Only show when email tab is selected */}
              {selectedTab === "email" && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Select Template
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="listbox"
                      aria-label="Select email template"
                      className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white truncate">
                          {selected ? selected.name : "Choose template..."}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                            isDropdownOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-auto"
                      >
                        {templates.map((template) => (
                          <button
                            key={template.type}
                            onClick={() => handleSelect(template.type)}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                              selected?.type === template.type
                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="truncate">
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{template.type}</div>
                              </div>
                              {selected?.type === template.type && (
                                <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full flex-shrink-0 ml-2"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
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
