import { Save, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";

const EmailPreviewModal = ({ form, onClose }) => {
  const [saveloading, setSaveLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"html" | "text">("html");
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      if (form) {
        const res = await api.post("/email-templates", {
          type: form.type,
          name: form.name,
          subject: form.subject,
          html: form.html,
          text: form.text,
        });
        if (res.status === 200 || res.status === 201) {
          Swal.fire("Success", "Template saved successfully", "success");
        }
      }
    } catch (error) {
      console.error("Error saving template:", error);
      Swal.fire("Error", "Failed to save template", "error");
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email Preview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Template: {form.name} ({form.type})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Controls */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview Mode:</span>
              <div className="flex bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setPreviewMode("html")}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    previewMode === "html"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setPreviewMode("text")}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    previewMode === "text"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Text
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Subject: <span className="font-medium text-gray-900 dark:text-white">{form.subject}</span>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-auto max-h-96">
          {previewMode === "html" ? (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Preview</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Interactive elements disabled)</span>
              </div>
              <div
                className="p-4 bg-white dark:bg-gray-800 min-h-48 preview-content"
                dangerouslySetInnerHTML={{ __html: form.html }}
                onClick={(e) => e.preventDefault()}
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plain Text Preview</span>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 font-mono text-sm whitespace-pre-wrap min-h-48">
                {form.text}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saveloading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EmailPreviewModal;
