import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

type MediaObj = { type: "image" | "video"| "audio"|"document"; url: string };

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  showPostPopup: boolean;
  setShowPostPopup: (show: boolean) => void;
  showCommentPopup: boolean;
  setShowCommentPopup: (show: boolean) => void;
  showMessagingPopup: boolean;
  setShowMessagingPopup: (show: boolean) => void;
  showSettingsPopup: boolean;
  setShowSettingsPopup: (show: boolean) => void;
  notifications: NotificationData[];
  setNotifications: (notifications: NotificationData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  // API methods
  fetchNotifications: () => Promise<void>;
  //Media Gallery - Updated
  showMediaGallery: boolean;
  setShowMediaGallery: (show: boolean) => void;
  mediaGallery: MediaObj[];
  setMediaGallery: (media: MediaObj[]) => void;
  currentMediaIndex: number;
  setCurrentMediaIndex: (index: number) => void;
  zoomMediaGallery: (mediaList: MediaObj[], startIndex?: number) => void;
  showEditPostPopup: boolean;
  setShowEditPostPopup: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostPopup, setShowPostPopup] = useState<boolean>(false);
  const [showCommentPopup, setShowCommentPopup] = useState<boolean>(false);
  const [showMessagingPopup, setShowMessagingPopup] = useState<boolean>(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Media gallery states
  const [showMediaGallery, setShowMediaGallery] = useState<boolean>(false);
  const [mediaGallery, setMediaGallery] = useState<MediaObj[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);

  const [showEditPostPopup, setShowEditPostPopup] = useState<boolean>(false);

  const zoomMediaGallery = (mediaList: MediaObj[], startIndex: number = 0) => {
    setMediaGallery(mediaList);
    setCurrentMediaIndex(startIndex);
    setShowMediaGallery(true);
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const value = useMemo(
    () => ({
      setCurrentUser,
      isAuthenticated,
      setIsAuthenticated,
      posts,
      setPosts,
      selectedPost,
      setSelectedPost,
      showPostPopup,
      setShowPostPopup,
      showCommentPopup,
      setShowCommentPopup,
      showMessagingPopup,
      setShowMessagingPopup,
      showSettingsPopup,
      setShowSettingsPopup,
      notifications,
      setNotifications,
      loading,
      setLoading,
      error,
      setError,
      fetchNotifications,
      showMediaGallery,
      setShowMediaGallery,
      mediaGallery,
      setMediaGallery,
      currentMediaIndex,
      setCurrentMediaIndex,
      zoomMediaGallery,
      showEditPostPopup,
      setShowEditPostPopup,
    }),
    [
      isAuthenticated,
      posts,
      selectedPost,
      showPostPopup,
      showCommentPopup,
      showMessagingPopup,
      showSettingsPopup,
      notifications,
      loading,
      error,
      showMediaGallery,
      mediaGallery,
      currentMediaIndex,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};