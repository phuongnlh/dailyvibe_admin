import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import EmailPreviewModal from "./PreviewEmail";
interface EmailTemplate {
  type: string;
  name: string;
  subject: string;
  html: string;
  text: string;
}
const EmailTemplateForm = ({ selected, onclose }: { selected: EmailTemplate | null; onclose: () => void }) => {
  // Move hooks to the top, before any conditional logic
  const [form, setForm] = useState({ ...(selected || null) });
  const [showPreview, setShowPreview] = useState(false);
  const [showPreviewForm, setShowPreviewForm] = useState({ ...form });

  // Update form when selected changes
  useEffect(() => {
    if (selected) {
      const newForm = {
        type: selected.type || "",
        name: selected.name || "",
        subject: selected.subject || "",
        html: selected.html || "",
        text: selected.text || "",
      };
      setForm(newForm);
      setShowPreviewForm(newForm);
    }
  }, [selected]);

  const handlePreview = () => {
    const currentFormData = { ...form };
    setShowPreviewForm(currentFormData);
    setShowPreview(true);
  };

  if (!selected || !selected.type) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Template to Edit</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choose an email template from the sidebar to start editing its content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            ✏️ Editing: {selected.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Template Type: {selected.type}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Subject</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Enter email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HTML Content</label>
            <textarea
              className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              value={form.html}
              onChange={(e) => setForm({ ...form, html: e.target.value })}
              placeholder="Enter HTML content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plain Text Content
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Enter plain text content..."
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handlePreview}
              disabled={!form.subject?.trim() || (!form.html?.trim() && !form.text?.trim())}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview & Save
            </button>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showPreview && (
        <EmailPreviewModal
          form={showPreviewForm}
          onClose={() => {
            setShowPreview(false);
            onclose();
          }}
        />
      )}
    </>
  );
};

export default EmailTemplateForm;
