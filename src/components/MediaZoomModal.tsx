import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, Music, X } from "lucide-react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useApp } from "../contexts/AppContext";

type MediaObj = { type: "image" | "video" | "audio" | "document"; url: string };

export function MediaZoomModal({
  media,
  showNavigation = false,
  currentIndex = 0,
  totalCount = 1,
}: {
  media: MediaObj;
  showNavigation?: boolean;
  currentIndex?: number;
  totalCount?: number;
}) {
  const isImage = media.type === "image";
  const isVideo = media.type === "video";
  const isAudio = media.type === "audio";
  const isDocument = media.type === "document";
  const {
    setCurrentMediaIndex,
    mediaGallery,
    showMediaGallery,
    setShowMediaGallery,
  } = useApp();

  const onClose = () => {
    setShowMediaGallery(false);
  };
  const onNext = () => {
    setCurrentMediaIndex((prev: number) =>
      prev < mediaGallery.length - 1 ? prev + 1 : 0
    );
  };
  const onPrev = () => {
    setCurrentMediaIndex((prev: number) =>
      prev > 0 ? prev - 1 : mediaGallery.length - 1
    );
  };

  useEffect(() => {
    if (showMediaGallery) {
      // chặn scroll
      document.body.style.overflow = "hidden";
    } else {
      // trả lại scroll
      document.body.style.overflow = "";
    }

    // cleanup khi unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMediaGallery]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (showNavigation) {
        if (e.key === "ArrowRight" && onNext) {
          e.preventDefault();
          onNext();
        }
        if (e.key === "ArrowLeft" && onPrev) {
          e.preventDefault();
          onPrev();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showNavigation, onNext, onPrev, onClose]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  if (!showMediaGallery) return null;
  const mediaModal = (
    <motion.div className="fixed inset-0 z-[60] w-full h-full flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-[min(92vw,1200px)] max-h-[90vh] mx-4"
        onClick={stop}
      >
        {/* Header with controls */}
        <div className="absolute -top-12 right-0 flex items-center gap-2 z-20">
          {/* Navigation indicator */}
          {showNavigation && totalCount > 1 && (
            <div className="px-3 py-2 rounded-lg text-white bg-black/50 border border-white/20 text-sm">
              {currentIndex + 1} / {totalCount}
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white bg-black/50 hover:bg-black/70 border border-white/20 transition-colors"
            aria-label="Close"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation arrows */}
        {showNavigation && totalCount > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev?.();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 z-10"
              title="Previous (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 z-10"
              title="Next (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Media container */}
        <div className="relative w-full h-[80vh] rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
          {isImage ? (
            <img
              src={media.url}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
              style={{ minWidth: "100%", minHeight: "100%" }}
              onClick={stop}
            />
          ) : isVideo ? (
            <video
              src={media.url}
              controls
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={stop}
            />
          ) : isAudio ? (
            <div
              className="w-full max-w-md p-8 bg-gray-800 rounded-lg"
              onClick={stop}
            >
              <div className="flex flex-col items-center space-y-4">
                <Music className="w-16 h-16 text-white" />
                <h3 className="text-white text-lg font-medium">Audio File</h3>
                <audio src={media.url} controls className="w-full" />
              </div>
            </div>
          ) : isDocument ? (
            <div
              className="w-full max-w-md p-8 bg-gray-800 rounded-lg"
              onClick={stop}
            >
              <div className="flex flex-col items-center space-y-4">
                <FileText className="w-16 h-16 text-white" />
                <h3 className="text-white text-lg font-medium">Document</h3>
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Open Document
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Unsupported media type
              </span>
            </div>
          )}
        </div>

        {/* Pagination dots */}
        {showNavigation && totalCount > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalCount }).map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to specific index - simplified approach
                  if (index > currentIndex) {
                    const steps = index - currentIndex;
                    for (let i = 0; i < steps; i++) {
                      setTimeout(() => onNext?.(), i * 100);
                    }
                  } else if (index < currentIndex) {
                    const steps = currentIndex - index;
                    for (let i = 0; i < steps; i++) {
                      setTimeout(() => onPrev?.(), i * 100);
                    }
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                title={`Go to media ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
  return createPortal(mediaModal, document.body);
}
