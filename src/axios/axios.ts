import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public instance for unauthenticated requests
const publicInstance = axios.create({
  baseURL: axiosInstance.defaults.baseURL,
  headers: { 'Content-Type': 'application/json' },
});
const imageInstance = axios.create({
  baseURL: axiosInstance.defaults.baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

const publicImageInstance = axios.create({
  baseURL: axiosInstance.defaults.baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
});
// Private instance for authenticated requests
const privateInstance = axios.create({
  baseURL: axiosInstance.defaults.baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add Authorization header to private requests
privateInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Token already includes "Bearer " prefix, so use it directly
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Fix syntax error in imageInstance interceptor
imageInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Token already includes "Bearer " prefix, so use it directly
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptors for error handling
interface AxiosErrorResponse {
  response?: {
    status: number;
  };
}

const handleErrorResponse = (error: AxiosErrorResponse): Promise<never> => {
  const status = error.response?.status;

  // Map statuses to error routes. Update these paths if your app uses different routes.
  const ERROR_ROUTE_BY_STATUS: Record<number, string> = {
    401: '/401',
    403: '/403',
  };

  if (status && ERROR_ROUTE_BY_STATUS[status]) {
    const target = ERROR_ROUTE_BY_STATUS[status];
    if (typeof window !== 'undefined') {
      // For 401, also clear any stored auth so user is effectively logged out
      if (status === 401) {
        try {
          localStorage.clear();
        } catch (_) {
          // ignore storage errors
        }
      }
      // Prevent redirect loops if we are already on the target error route
      const currentPath = window.location.pathname;
      if (currentPath !== target) {
        window.location.href = target;
      }
    }
  }
  return Promise.reject(error);
};

privateInstance.interceptors.response.use(
  (response) => response,
  handleErrorResponse,
);

// Add response interceptor to imageInstance as well
imageInstance.interceptors.response.use(
  (response) => response,
  handleErrorResponse,
);

// Apply the same error handling to public instances as well
publicInstance.interceptors.response.use(
  (response) => response,
  handleErrorResponse,
);

publicImageInstance.interceptors.response.use(
  (response) => response,
  handleErrorResponse,
);

export default {
  public: publicInstance,
  private: privateInstance,
  image: imageInstance,
  publicImage: publicImageInstance,
};
