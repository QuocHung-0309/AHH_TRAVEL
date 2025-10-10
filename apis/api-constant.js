import axios from "axios";

import { useAuthStore } from "#/stores/auth";

// Cấu hình Axios để gửi cookie
const apiClient = axios.create({
    baseURL: "http://localhost:4000/", // URL API của bạn
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Cài interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        const refreshToken = useAuthStore.getState().token.refreshToken;
        const resetAuth = useAuthStore.getState().resetAuth;
        const setToken = useAuthStore.getState().setToken;

        // if (
        //     response.data.status === 401 &&
        //     response.data.message === "Invalid or expired refresh token"
        // ) {
        //     try {
        //         // Gọi API refresh token
        //         const refreshResponse = await axios.post(
        //             "http://localhost:8080/api/auth/refresh-token",
        //             {
        //                 refreshToken,
        //             },
        //         );

        //         // Lấy token mới từ response
        //         // const {
        //         //     accessToken: newAccessToken,
        //         //     refreshToken: newRefreshToken,
        //         // } = refreshResponse.data;
        //         setToken(refreshResponse.data);
        //         // if (newAccessToken && newRefreshToken) {
        //         //     // Cập nhật token trong store
        //         //     setToken({
        //         //         accessToken: newAccessToken,
        //         //         refreshToken: newRefreshToken,
        //         //     });

        //         //     // // Cập nhật header Authorization
        //         //     // error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        //         //     // // Gửi lại request ban đầu
        //         //     // return apiClient.request(error.config);
        //         // } else {
        //         //     console.error(
        //         //         "Invalid response from refresh token API. Logging out...",
        //         //     );
        //         //     resetAuth();
        //         // }
        //     } catch (refreshError) {
        //         console.error("Failed to refresh token:", refreshError);
        //         resetAuth();
        //     }
        // }
        // if (
        //     response.data.status === 401 &&
        //     response.data.message ===
        //         "Unauthorized: Full authentication is required to access this resource"
        // ) {
        //     resetAuth();
        // }

        return Promise.reject(error);
    },
);
export default apiClient;
