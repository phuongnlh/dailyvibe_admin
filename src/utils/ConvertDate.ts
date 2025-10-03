// Helper function to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffMs / (1000 * 60));
  const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `Hôm qua lúc ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Hiển thị ngày + giờ đầy đủ
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateToAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffMs / (1000 * 60));
  const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInMinutes < 60) return `${diffInMinutes} minute ago`;
  if (diffInHours < 24) return `${diffInHours} hour ago`;
  if (diffInDays < 7) return `${diffInDays} day ago`;

  return `${diffInWeeks} week ago`;
};