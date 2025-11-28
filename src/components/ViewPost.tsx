import { motion } from "framer-motion";
import { Eye, Globe, Lock, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../contexts/AppContext";
interface ViewPostProps {
  post: any | null;
  onClose: () => void;
}

export const ViewPost = ({ post, onClose }: ViewPostProps) => {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedShared, setExpandedShared] = useState(false);
  const { zoomMediaGallery } = useApp();
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      setMounted(false);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Convert post media to MediaObj format for gallery
  const convertToMediaObjects = (postMedia: any[]) => {
    return postMedia.map((media) => ({
      type: media.type as "image" | "video" | "audio" | "document",
      url: media.url,
    }));
  };

  // Handle media click - open gallery with all media
  const handleMediaClick = (clickedIndex: number) => {
    if (post.media && post.media.length > 0) {
      const mediaObjects = convertToMediaObjects(post.media);
      zoomMediaGallery(mediaObjects, clickedIndex);
    }
  };
  const handleSharedMediaClick = (clickedIndex: number) => {
    if (post.shared_post_id?.media && post.shared_post_id.media.length > 0) {
      const mediaObjects = convertToMediaObjects(post.shared_post_id.media);
      zoomMediaGallery(mediaObjects, clickedIndex);
    }
  };

  if (!mounted || !post) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="p-4 rounded-xl shadow-md max-w-md w-full min-w-[40%] sm:min-w-[40%]:"
        onClick={(e) => e.stopPropagation()} // tránh click vào nội dung đóng modal
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.2),0px_0px_12px_rgba(190,185,185,0.6)] dark:shadow-[0px_8px_16px_rgba(0,0,0,0.4),-6px_-6px_12px_rgb(122,117,117/0.6)] transition-all duration-100"
        >
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4 space-x-2">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <img src={post.user_id?.avatar_url} alt={post.user_id?.fullName} className="w-10 h-10 rounded-full" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 hover:underline">
                <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base hover:underline">
                  {post.user_id?.fullName}
                </div>
              </div>
              <p className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 space-x-1">
                <div className="hover:underline">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {post.type === "Public" ? (
                  <Globe className="w-4 h-4 text-gray-400" />
                ) : post.type === "Friends" ? (
                  <Users className="w-4 h-4 text-gray-400" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-black/80 dark:text-white hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p
              className={`text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words ${
                !expanded ? "line-clamp-5" : ""
              }`}
            >
              {post.content}
            </p>
            {post.content.split("\n").length > 5 || post.content.length > 200 ? (
              <button className="text-blue-500 mt-1 text-sm" onClick={() => setExpanded(!expanded)}>
                {expanded ? "Show less" : "Read more"}
              </button>
            ) : null}
          </div>

          {/* Shared Post Preview */}
          {post.shared_post_id && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900/50"
            >
              <div className="p-3 sm:p-4">
                {/* Header shared post */}
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={post.shared_post_id.user_id?.avatar_url}
                    alt={post.shared_post_id.user_id?.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white hover:underline">
                      {post.shared_post_id.user_id?.fullName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.shared_post_id?.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Content shared post */}
                <div className="mb-4">
                  <p
                    className={`text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words ${
                      !expandedShared ? "line-clamp-5" : ""
                    }`}
                  >
                    {post.shared_post_id?.content}
                  </p>
                  {post.shared_post_id?.content.split("\n").length > 5 || post.shared_post_id?.content.length > 200 ? (
                    <button className="text-blue-500 mt-1 text-sm" onClick={() => setExpandedShared(!expandedShared)}>
                      {expandedShared ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </div>

                {/* Media shared post */}
                {post.shared_post_id?.media && post.shared_post_id.media.length > 0 && (
                  <div className="mb-4">
                    {post.shared_post_id.media.length === 3 ? (
                      // 🔹 Layout riêng cho 3 ảnh: 2 trên, 1 dưới full
                      <div className="grid gap-2 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-2 gap-2">
                          {post.shared_post_id.media.slice(0, 2).map((media: any, index: number) => (
                            <motion.div
                              key={media._id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.03 }}
                              className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                              style={{ aspectRatio: "1" }}
                              onClick={() => handleSharedMediaClick(index)}
                            >
                              {media.type === "image" ? (
                                <img src={media.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                              ) : (
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                  controls
                                  muted
                                  loop
                                  playsInline
                                  preload="metadata"
                                />
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* Ảnh thứ 3 (full chiều ngang) */}
                        <motion.div
                          key={post.shared_post_id.media[2]._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.03 }}
                          className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                          style={{ aspectRatio: "16/9" }}
                          onClick={() => handleSharedMediaClick(2)}
                        >
                          {post.shared_post_id.media[2].type === "image" ? (
                            <img
                              src={post.shared_post_id.media[2].url}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={post.shared_post_id.media[2].url}
                              className="w-full h-full object-cover"
                              controls
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      // 🔹 Layout mặc định (1, 2, >=4 ảnh)
                      <div
                        className={`grid gap-2 rounded-2xl overflow-hidden ${
                          post.shared_post_id.media.length === 1
                            ? "grid-cols-1"
                            : post.shared_post_id.media.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-2"
                        }`}
                      >
                        {post.shared_post_id.media.slice(0, 4).map((media: any, index: number) => (
                          <motion.div
                            key={media._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                            style={{
                              aspectRatio: post.shared_post_id.media.length === 1 ? "16/10" : "1",
                            }}
                            onClick={() => handleSharedMediaClick(index)}
                          >
                            {media.type === "image" ? (
                              <img src={media.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                                controls
                                muted
                                loop
                                playsInline
                                preload="metadata"
                              />
                            )}

                            {/* Hiển thị overlay +N nếu có hơn 4 ảnh */}
                            {post.shared_post_id.media.length > 4 && index === 3 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">
                                  +{post.shared_post_id.media.length - 4}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Media Content */}
          {post.media && post.media.length > 0 && (
            <div className="mb-4">
              {post.media.length === 3 ? (
                // 🔹 Layout riêng cho 3 ảnh: 2 trên, 1 dưới full
                <div className="grid gap-2 rounded-2xl overflow-hidden">
                  {/* Ảnh thứ 3 (full chiều ngang) */}
                  <motion.div
                    key={post.media[0]._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                    style={{ aspectRatio: "16/9" }}
                    onClick={() => handleMediaClick(0)}
                  >
                    {post.media[0].type === "image" ? (
                      <img src={post.media[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <video
                        src={post.media[0].url}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    )}
                  </motion.div>
                  <div className="grid grid-cols-2 gap-2">
                    {post.media.slice(1, 3).map((media: any, index: number) => (
                      <motion.div
                        key={media._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                        style={{ aspectRatio: "1" }}
                        onClick={() => handleMediaClick(index)}
                      >
                        {media.type === "image" ? (
                          <img src={media.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            controls
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                // 🔹 Layout mặc định (1, 2, >=4 ảnh)
                <div
                  className={`grid gap-2 rounded-2xl overflow-hidden ${
                    post.media.length === 1 ? "grid-cols-1" : post.media.length === 2 ? "grid-cols-2" : "grid-cols-2"
                  }`}
                >
                  {post.media.slice(0, 4).map((media: any, index: number) => (
                    <motion.div
                      key={media._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                      style={{
                        aspectRatio: post.media.length === 1 ? "16/10" : "1",
                      }}
                      onClick={() => handleMediaClick(index)}
                    >
                      {media.type === "image" ? (
                        <img src={media.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                          controls
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      )}

                      {/* Hiển thị overlay +N nếu có hơn 4 ảnh */}
                      {post.media.length > 4 && index === 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">+{post.media.length - 4}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reactions Summary */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            {post.reactionCount > 0 && <span>{post.reactionCount} Reaction</span>}
            <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {post.commentCount > 0 && <span>{post.commentCount} Comments</span>}
              {post.sharesCount > 0 && <span>{post.sharesCount} Shares</span>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{post.viewCount || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};
