import React, { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type MediaObj = { type: "image" | "video" | "audio" | "document"; url: string };

interface AppContextType {
  //Media Gallery - Updated
  showMediaGallery: boolean;
  setShowMediaGallery: (show: boolean) => void;
  mediaGallery: MediaObj[];
  setMediaGallery: (media: MediaObj[]) => void;
  currentMediaIndex: number;
  setCurrentMediaIndex: React.Dispatch<React.SetStateAction<number>>;
  zoomMediaGallery: (mediaList: MediaObj[], startIndex?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Media gallery states
  const [showMediaGallery, setShowMediaGallery] = useState<boolean>(false);
  const [mediaGallery, setMediaGallery] = useState<MediaObj[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);

  const zoomMediaGallery = (mediaList: MediaObj[], startIndex: number = 0) => {
    setMediaGallery(mediaList);
    setCurrentMediaIndex(startIndex);
    setShowMediaGallery(true);
  };

  const value = useMemo(
    () => ({
      showMediaGallery,
      setShowMediaGallery,
      mediaGallery,
      setMediaGallery,
      currentMediaIndex,
      setCurrentMediaIndex,
      zoomMediaGallery,
    }),
    [showMediaGallery, mediaGallery, currentMediaIndex]
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
