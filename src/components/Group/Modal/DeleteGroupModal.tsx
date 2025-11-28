import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  AlertTriangle,
  Trash2,
  Shield,
  FileText,
  AlertCircle,
  Users,
} from "lucide-react";
import { deleteGroupForSevereViolation } from "../../../api/group";
import Swal from "sweetalert2";

interface DeleteGroupModalProps {
  groupId: string;
  groupName: string;
  warningCount: number;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteGroupModal: React.FC<DeleteGroupModalProps> = ({
  groupId,
  groupName,
  warningCount,
  isOpen,
  onClose,
  onDeleteSuccess,
}) => {
  const [adminNote, setAdminNote] = useState("");
  const [reason, setReason] = useState("");
  const [violationType, setViolationType] = useState("spam");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const violationTypes = [
    {
      value: "spam",
      label: "Spam",
      description: "Repeated unwanted content",
    },
    {
      value: "harassment",
      label: "Harassment",
      description: "Bullying or intimidation",
    },
    {
      value: "hate_speech",
      label: "Hate Speech",
      description: "Discriminatory content",
    },
    {
      value: "misinformation",
      label: "Misinformation",
      description: "False or misleading information",
    },
    {
      value: "inappropriate_content",
      label: "Inappropriate Content",
      description: "Unsuitable material",
    },
    {
      value: "violence",
      label: "Violence",
      description: "Violent or graphic content",
    },
    {
      value: "illegal_activities",
      label: "Illegal Activities",
      description: "Illegal content or activities",
    },
    {
      value: "other",
      label: "Other",
      description: "Other severe violations",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminNote.trim()) {
      Swal.fire({
        icon: "error",
        title: "Admin Note Required",
        text: "Please provide an internal admin note for this deletion.",
      });
      return;
    }

    if (!violationType) {
      Swal.fire({
        icon: "error",
        title: "Violation Type Required",
        text: "Please select a violation type.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await deleteGroupForSevereViolation(groupId, {
        reason: reason.trim() || undefined,
        adminNote: adminNote.trim(),
        violationType,
      });

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Group Deleted",
          text: `${groupName} has been permanently deleted.`,
          confirmButtonColor: "#dc2626",
        });
        onDeleteSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting group:", error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: error.response?.data?.message || "Failed to delete group. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Header with Gradient */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
            ></div>
          </div>

          <div className="relative">
            {/* Header Title */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Delete Group - Severe Violation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Group Information Card */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                {/* Left side - Group info */}
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-3 bg-white/25 backdrop-blur-sm rounded-xl">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                      Target Group
                    </p>
                    <p className="text-lg font-bold text-white leading-tight">
                      {groupName}
                    </p>
                  </div>
                </div>

                {/* Right side - Warning count */}
                <div className="ml-6 pl-6 border-l border-white/30">
                  <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                        Current
                      </p>
                      <p className="text-xl font-bold text-white">
                        {warningCount}/5
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-white/90">
                        Warnings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-280px)]">
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {/* Critical Warning */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-red-900 dark:text-red-300 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span>
                    PERMANENT DELETION WARNING
                  </h3>
                  <p className="text-red-800 dark:text-red-400 text-sm mb-3">
                    This action will <strong>permanently delete</strong> the group and
                    all associated data. This operation cannot be undone.
                  </p>
                  <div className="space-y-2 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                      What will be deleted:
                    </p>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                      <span className="text-sm text-red-800 dark:text-red-300">
                        All group posts and media
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                      <span className="text-sm text-red-800 dark:text-red-300">
                        All member data and relationships
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                      <span className="text-sm text-red-800 dark:text-red-300">
                        All pending reports will be marked as resolved
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>
                      <span className="text-sm text-red-800 dark:text-red-300">
                        Creator will be notified of deletion
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Violation Type Selection */}
            <div className="space-y-3">
              <label className="flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <Shield className="w-5 h-5 mr-2 text-red-500" />
                Violation Type
                <span className="ml-2 text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {violationTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setViolationType(type.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      violationType === type.value
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-500/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base text-gray-900 dark:text-white mb-0.5">
                          {type.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {type.description}
                        </div>
                      </div>
                    </div>
                    {violationType === type.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-3">
              <label className="flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Deletion Reason
                <span className="ml-2 text-gray-400 text-sm font-normal">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter a reason for deleting this group (will be sent to the creator)..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none transition-all duration-200 placeholder:text-gray-400"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {reason.length}/500
                </div>
              </div>
              <p className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
                If left empty, an automatic message will be generated based on
                the violation type
              </p>
            </div>

            {/* Admin Note */}
            <div className="space-y-3">
              <label className="flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <FileText className="w-5 h-5 mr-2 text-red-500" />
                Admin Internal Note
                <span className="ml-2 text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Internal documentation about this deletion decision (required for audit purposes)..."
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none transition-all duration-200 placeholder:text-gray-400"
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {adminNote.length}/1000
                </div>
              </div>
              <p className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
                This note is for internal admin reference only and will not be
                visible to users
              </p>
            </div>
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="px-8 py-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
              ⚠️ This action is irreversible
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !adminNote.trim()}
                className="flex items-center px-8 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting Group...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Group Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteGroupModal;