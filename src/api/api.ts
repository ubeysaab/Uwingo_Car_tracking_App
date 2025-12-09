
import axios, { AxiosError } from "axios";

export type NormalizedError = {
  message: string;
  status?: number;
  original?: any;
};

function normalizeAxiosError(error: unknown): NormalizedError {
  // Ensure it's really an Axios error
  if (!axios.isAxiosError(error)) {
    return { message: "Beklenmeyen bir hata oluştu." };
  }

  const err = error as AxiosError;

  // ---- A) Server responded with error (error.response) ----
  if (err.response) {
    const status = err.response.status;

    switch (status) {
      case 401:
        return { message: "Bu işlemi yapmak için lütfen giriş yapın.", status };
      case 404:
        return { message: "Aradığınız içerik bulunamadı.", status };
      case 500:
        return { message: "Sunucuda bir hata oluştu. Lütfen tekrar deneyin.", status };
      default:
        return { message: "Beklenmedik bir sunucu hatası oluştu.", status };
    }
  }

  // ---- B) Request sent but no response (error.request) ----
  if (err.request) {
    if (err.code === "ERR_NETWORK") {
      return { message: "İnternet bağlantısı yok veya sunucuya ulaşılamıyor." };
    }
    return { message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." };
  }

  // ---- C) Something else happened ----
  return { message: "İstek hazırlanırken bir hata oluştu." };
}



// ---- API INSTANCE ----
const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});



// ---- INTERCEPTOR ----
api.interceptors.response.use(
  // Success (status 2xx)
  (response) => response,

  // Error
  (error) => {
    const normalized = normalizeAxiosError(error);

    // Reject with the cleaned error object
    return Promise.reject(normalized);
  }
);

export default api;
