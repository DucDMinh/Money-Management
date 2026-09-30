import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { PERMISSION_ENUM } from "@/consts/common";
import httpService from "@/services/httpService";
import { AuthResponse, RegisterPayload, UserInfo } from "@/interfaces/user";
import { toast } from "@/components/ui/use-toast";

interface AuthenticationContextI {
  loading: boolean;
  isLogged: boolean;
  user: UserInfo | null;
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAppManager: boolean;
  isUser: boolean;
}

const AuthenticationContext = createContext<AuthenticationContextI>({
  loading: false,
  isLogged: false,
  user: {} as any,
  login: () => { },
  register: async () => { },
  logout: () => { },
  isAdmin: false,
  isAppManager: false,
  isUser: false,
});

export const useAuth = () => useContext(AuthenticationContext);

const AuthenticationProvider = ({ children }: { children: any }) => {
  //! State
  const [token, setToken] = useState(httpService.getTokenStorage());
  const [user, setUser] = useState<UserInfo | null>(
    httpService.getUserStorage()
  );
  const [isLogging, setIsLogging] = useState(false);

  //! Function
  const saveSession = useCallback((data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);

    httpService.attachTokenToHeader(data.token);
    httpService.saveTokenStorage(data.token);
    httpService.saveUserStorage(data.user);
  }, []);

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      try {
        setIsLogging(true);

        const response = await httpService.post(`/api/auth/login`, { username: username, password: password })
        if (response) {
          saveSession(response.data);
        }

      } catch (error: any) {
        console.log(error);
        toast({
          variant: "destructive",
          description: error?.response?.data?.error || "Đăng nhập thất bại",
        });
      } finally {
        setIsLogging(false);
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await httpService.post(`/api/auth/register`, payload);
      saveSession(response.data);
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    httpService.clearStorage();
    window.sessionStorage.clear();
    window.location.reload();
  }, []);

  //! Return
  const value = useMemo(() => {
    return {
      loading: isLogging,
      isLogged: !!user && !!token,
      user,
      logout,
      login,
      register,
      isAdmin: !!user?.roles?.includes(PERMISSION_ENUM.ADMIN),
      isAppManager: !!user?.roles?.includes(PERMISSION_ENUM.APP_MANAGER),
      isUser: !!user?.roles?.includes(PERMISSION_ENUM.USER),
    };
  }, [login, register, logout, user, token, isLogging]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
