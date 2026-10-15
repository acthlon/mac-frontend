import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://marvelam.onrender.com/api/v1/"
).replace(/\/?$/, "/");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export const ENDPOINTS = {
  HOME: "home/",
  PRODUCTS: "products/",
  MATERIALS: "materials/",
  CART: "cart/",
  CART_ADD: "cart/add/",
  ORDERS: "orders/index/",
  ORDER_DETAILS: (orderNumber) => `orders/${orderNumber}/details/`,
  ORDER_TRACK: (orderNumber) => `orders/track/${orderNumber}/`,
  PLACE_ORDER: "orders/place-order/",
  LOGIN: "auth/login/",
  REGISTER: "auth/register/",
  TOKEN_REFRESH: "auth/token/refresh/",
  LOGOUT: "auth/logout/",
};

// Helper utilities for authentication
export const getAuthToken = () => {
  return (
    localStorage.getItem("mac_auth_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("mac_auth_token") ||
    null
  );
};

export const getRefreshToken = () => {
  return (
    localStorage.getItem("mac_refresh_token") ||
    sessionStorage.getItem("mac_refresh_token") ||
    null
  );
};

export const setAuthSession = ({ accessToken, refreshToken, email, rememberMe = true }) => {
  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    if (accessToken) {
      storage.setItem("mac_auth_token", accessToken);
    }
    if (refreshToken) {
      storage.setItem("mac_refresh_token", refreshToken);
    }
    if (email) {
      storage.setItem("mac_user_email", email);
    }
  } catch (err) {
    console.error("Failed to store auth session:", err);
  }
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const logout = () => {
  try {
    localStorage.removeItem("mac_auth_token");
    localStorage.removeItem("mac_refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("mac_user_email");
    sessionStorage.removeItem("mac_auth_token");
    sessionStorage.removeItem("mac_refresh_token");
    sessionStorage.removeItem("mac_user_email");
  } catch (err) {
    console.error("Error during logout:", err);
  }
};

// Automatically attach Django SimpleJWT Bearer authentication and normalize URLs
apiClient.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.startsWith("http://") && !config.url.startsWith("https://")) {
      // Avoid duplicate /api/v1/ and remove leading slash so baseURL subpath is preserved
      config.url = config.url.replace(/^\/?(api\/v1\/)?/, "");
    }
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("auth/login") &&
      !originalRequest.url?.includes("auth/register")
    ) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const refreshRes = await axios.post(`${API_BASE_URL}auth/token/refresh/`, {
            refresh: refreshToken,
            refresh_token: refreshToken,
          });
          const newAccessToken =
            refreshRes.data?.access_token ||
            refreshRes.data?.access ||
            refreshRes.data?.token;
          if (newAccessToken) {
            if (localStorage.getItem("mac_auth_token")) {
              localStorage.setItem("mac_auth_token", newAccessToken);
            } else {
              sessionStorage.setItem("mac_auth_token", newAccessToken);
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          console.warn("Failed to refresh token:", refreshErr);
          logout();
        }
      } else {
        // No refresh token available to rescue 401
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

