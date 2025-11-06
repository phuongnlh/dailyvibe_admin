import { Listbox } from "@headlessui/react";
import { motion } from "framer-motion";
import { ChevronDown, Save, ShieldCheck, ShieldOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import { updateUserData } from "../api/admin";
import { VIETNAM_PROVINCES } from "../constants/vietnamProvinces";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  avatar_url: string;
  isActive: boolean;
  isPrivate: boolean;
  EmailVerified: boolean;
  PhoneVerified: boolean;
  isBlocked: boolean;
  is_deleted: boolean;
  twoFAEnabled: boolean;
  createdAt: string;
  postsCount: number;
  status: string;
  bio?: string;
  location?: string;
  phone?: string;
}

const locationOptions = [
  ...VIETNAM_PROVINCES.map((province) => ({
    value: province,
    label: province,
  })),
];

export default function UserInformation({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave?: (updatedUser: User) => void;
}) {
  if (!user) return null;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 🔒 Ẩn thanh cuộn khi mở modal
    document.body.style.overflow = "hidden";

    // ✅ Đóng khi click ra ngoài
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // ✅ Đóng khi nhấn ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    // 🔓 Khôi phục khi unmount
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });

  const handleChange = (key: keyof User, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, save it!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (JSON.stringify(formData) !== JSON.stringify(user)) {
          try {
            const res = await updateUserData(user._id, {
              fullName: formData.fullName,
              username: formData.username,
              email: formData.email,
              gender: formData.gender,
              location: formData.location,
              bio: formData.bio,
              twoFAEnabled: formData.twoFAEnabled,
            });

            if (res?.status !== 200) throw new Error("Update failed");
            Swal.fire("Saved!", "The user information has been updated.", "success");
            setIsEditing(false);
            onSave?.(formData);
          } catch (err) {
            Swal.fire("Error", "Failed to update user information.", "error");
          }
        }
      }
    });
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(locationOptions);

  useEffect(() => {
    const filtered = locationOptions.filter((loc) => loc.label.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredLocations(filtered);
  }, [searchTerm, locationOptions]);

  const birth = new Date(formData.dateOfBirth);
  const age = new Date().getFullYear() - birth.getFullYear();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-200 dark:border-gray-700"
        ref={modalRef}
      >
        {/* 🔘 Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 🧭 Header */}
        {user.is_deleted ? null : (
          <div className="flex items-center justify-between mb-6 pr-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit User" : "User Information"}
            </h2>

            {/* 🟢 Switch toggle */}
            <label className="flex items-center cursor-pointer">
              <span className="text-sm mr-3 text-gray-700 dark:text-gray-300">Edit Mode</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isEditing}
                  onChange={() => setIsEditing(!isEditing)}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    isEditing ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    isEditing ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center text-center mb-5">
          <img
            src={formData.avatar_url}
            alt={formData.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-sm"
          />
        </div>

        {!isEditing ? (
          // ==== CHẾ ĐỘ XEM ====
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Full Name:</span>
              <span className="font-medium">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span>Username:</span>
              <span className="font-medium">@{formData.username}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Gender:</span>
              <span className="font-medium capitalize">{formData.gender}</span>
            </div>
            <div className="flex justify-between">
              <span>Age:</span>
              <span className="font-medium">{isNaN(age) ? "—" : age}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{formData.location || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>2FA:</span>
              {formData.twoFAEnabled ? (
                <span className="flex items-center gap-1 text-green-500 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Enabled
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400">
                  <ShieldOff className="w-4 h-4" /> Disabled
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-gray-500 italic">{formData.bio || "No bio"}</p>
            </div>
            {formData.is_deleted ? (
              <div className="text-center text-red-600 dark:text-red-400 text-lg font-semibold mt-4">
                This account has been deleted.
              </div>
            ) : formData.isBlocked ? (
              <div className="text-center text-orange-600 dark:text-orange-400 text-lg font-semibold mt-4">
                This user is blocked.
              </div>
            ) : null}
          </div>
        ) : (
          // ==== CHẾ ĐỘ CHỈNH SỬA ====
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <label className="block text-gray-500 text-xs mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full rounded-lg p-2 border dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full rounded-lg p-2 border dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-lg p-2 border dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Location</label>
              <Listbox value={formData.location} onChange={(location) => handleChange("location", location)}>
                <div className="relative w-full">
                  <Listbox.Button className="w-full border px-3 py-2 rounded-lg bg-white dark:bg-gray-700 flex justify-between items-center">
                    <span>{formData.location || "Select Location"}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg bg-white dark:bg-gray-700 shadow-lg scrollbar-thin">
                    {/* 🔍 Ô tìm kiếm */}
                    <div className="sticky top-0 bg-white dark:bg-gray-700 p-2 border-b border-gray-200 dark:border-gray-600">
                      <input
                        type="text"
                        placeholder="Search location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Danh sách location có filter */}
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <Listbox.Option
                          key={location.value}
                          value={location.value}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 ${
                              active ? "bg-purple-500 text-white" : "text-gray-900 dark:text-gray-100"
                            }`
                          }
                        >
                          {location.label}
                        </Listbox.Option>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-400">No results found</div>
                    )}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Bio</label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full rounded-lg p-2 border dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>

              <button
                onClick={() => {
                  if (user.twoFAEnabled) {
                    // ✅ Chỉ cho phép toggle nếu dữ liệu gốc đang bật
                    handleChange("twoFAEnabled", !formData.twoFAEnabled);
                  }
                }}
                disabled={!user.twoFAEnabled} // ❌ Disable nếu user chưa từng bật 2FA
                title={
                  !user.twoFAEnabled
                    ? "User has not enabled 2FA — cannot modify"
                    : formData.twoFAEnabled
                    ? "Click to disable 2FA"
                    : "Click to re-enable 2FA (temporary until saved)"
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                  user.twoFAEnabled
                    ? formData.twoFAEnabled
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-200 ${
                    formData.twoFAEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
