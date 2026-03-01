import { NormalizedErrorT } from "../../types/auth";
import axios from "axios";
import { AxiosError } from "axios";

export function normalizeAxiosError(error: unknown): NormalizedErrorT {
  console.log(error)
  if (!axios.isAxiosError(error)) {
    return { message: "Beklenmeyen bir hata oluştu." };
  }

  const err = error as AxiosError;

  // ---- A) Server responded with error (error.response) ----
  if (err.response) {
    const status = err.response.status;

    switch (status) {
      case 401:
        // Token yenileme mantığı Interceptor'da ele alınacağı için
        // burada sadece normalize edilmiş bir hata mesajı dönüyoruz.
        return { message: "Oturum süreniz doldu veya Girdiginiz Veriler Hatalıdır.", status };
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
    console.log()
    if (err.code === "ERR_NETWORK") {
      return { message: "İnternet bağlantısı yok veya sunucuya ulaşılamıyor." };
    }
    return { message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." };
  }

  // ---- C) Something else happened ----
  return { message: "İstek hazırlanırken bir hata oluştu." };
}