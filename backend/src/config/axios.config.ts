import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

// Create Axios Instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can attach authentication tokens here dynamically
        // const token = process.env.SECRET_TOKEN;
        // if (token && config.headers) {
        // 	config.headers.Authorization = `Bearer ${token}`;
        // }

        console.log(
            `[Axios Request] ${config.method?.toUpperCase()} - ${config.url}`,
        );
        return config;
    },
    (error: AxiosError) => {
        console.error("[Axios Request Error]", error.message);
        return Promise.reject(error);
    },
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(
            `[Axios Response] ${response.status} - ${response.config.url}`,
        );
        return response;
    },
    (error: AxiosError) => {
        console.error(
            "[Axios Response Error]",
            error.response?.status,
            error.message,
        );

        // Global Error Handling based on Status Code
        if (error.response?.status === 401) {
            console.warn("Unauthorized access - handle token refresh or relogin.");
        } else if (error.response?.status === 403) {
            console.warn("Forbidden - you do not have permission to access this resource.");
        } else if (error.response?.status === 500) {
            console.error("Internal Server Error from upstream API.");
        }

        return Promise.reject(error);
    },
);
