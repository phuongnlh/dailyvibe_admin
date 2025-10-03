// API base URL for backend calls
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// Generate token from backend server
export const generateTempToken = async (
  channelName: string,
  uid: string | number = 0
) => {
  try {
    console.log(`🔑 Requesting token for channel: ${channelName}, uid: ${uid}`);

    const response = await fetch(`${API_BASE_URL}/api/v1/agora/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        channelName,
        uid,
        role: "publisher",
      }),
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(`Token generation failed: ${data.message}`);
    }

    console.log(`✅ Token generated successfully for channel: ${channelName}`);
    return data.data.token;
  } catch (error) {
    console.error("❌ Error generating token:", error);

    // Fallback to null token for development (if App Certificate is disabled)
    console.warn(
      "Falling back to null token - this only works if App Certificate is disabled"
    );
    return null;
  }
};

// Generate channel name for calls
export const generateChannelName = (chatId: string) => {
  return `call-${chatId}-${Date.now()}`;
};

// Validate App ID format
export const validateAppId = (appId: string) => {
  // Agora App ID is typically 32 characters long
  return appId && appId.length >= 20 && appId !== "your-agora-app-id";
};
