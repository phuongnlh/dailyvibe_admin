import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { TokenService } from "../api/tokenManager";
import api from "../api/axios";

interface AuthContextType {
  admin: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const init = useCallback(async () => {
    try {
      let token = TokenService.getAccessToken();

      if (!token) {
        const res = await api.post("/refresh", {}, { withCredentials: true });
        const newToken = res.data.accessToken;

        TokenService.setAccessToken(newToken);
        const meRes = await api.get("/me");
        setAdmin(meRes.data);
      }

      if (token) {
        const meRes = await api.get("/me");
        setAdmin(meRes.data);
        return;
      }
    } catch (err) {
      console.error("Auth initialization error", err);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init();

    // Đồng bộ token & user giữa các tab
    const syncAuth = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        if (e.newValue) {
          TokenService.setAccessToken(e.newValue);
          init(); // load lại admin
        } else {
          init();
        }
      }
    };
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, [init]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      TokenService.setAccessToken(res.data.accessToken);

      const userRes = await api.get("/me");
      setAdmin(userRes.data);
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      TokenService.clear();
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
