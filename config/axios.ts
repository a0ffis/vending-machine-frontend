import axios from "axios";

export type ResponseData<T> = {
  success: boolean;
  message: string;
  error?: any;
  data: T;
};

// Membuat instance Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // Batas waktu request dalam ms
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

// Interceptor Request
api.interceptors.request.use(
  (config) => {
    // Anda bisa menambahkan token autentikasi di sini
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log(
      "Request:",
      config.method?.toUpperCase(),
      config.url,
      config.data,
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor Response
api.interceptors.response.use(
  (response) => {
    console.log(
      "Response:",
      response.status,
      response.config.url,
      response.data,
    );
    return response;
  },
  (error) => {
    if (error.response) {
      // Server merespons dengan status di luar 2xx
      console.error(
        "Response Error:",
        error.response.status,
        error.response.data,
      );
      // Contoh penanganan error 401 (Unauthorized)
      if (error.response.status === 401) {
        // Redirect ke halaman login atau refresh token
        console.log("Unauthorized, redirecting to login...");
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      console.error("No Response Received:", error.request);
    } else {
      // Terjadi kesalahan saat menyiapkan request
      console.error("Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
