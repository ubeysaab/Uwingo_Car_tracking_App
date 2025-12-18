import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { authStore } from "../stores/authStore";
import { normalizeAxiosError } from '../utils/api/NormalizeAxiosError'

// Yeni bir field eklemek için AxiosRequestConfig'i genişletiyoruz
// interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//   _retry?: boolean;
// }

// Orijinal hata normalleştirme fonksiyonunuzu koruyoruz,
// ancak 401 hatası için artık burada tekrar deneme yapmıyoruz.


// ---- API INSTANCE ----
const api: AxiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ! Refresh token endpoint'i için kullanılan RAW Axios instance'ı
// Bu, response interceptor'a takılmamalıdır.
// const rawAxios = axios.create();


// Token yenileme isteğini gerçekleştiren asenkron fonksiyon
// async function refreshAuthToken(refreshToken: string): Promise<string> {
//   // BU KISIMDA GEREKLİ REFRESH ENDPOINT'İNİZİ ÇAĞIRMALISINIZ
//   // Örn: /api/auth/refresh
//   const response = await rawAxios.post<{ accessToken: string }>(
//     "/auth/refresh", // Refresh token endpoint'iniz
//     { refreshToken }
//   );
//   return response.data.accessToken;
// }





// --- REQUEST INTERCEPTOR (Aynı kalabilir) ----
api.interceptors.request.use((config) => {

if (authStore.getState().status === "booting") {
  const normalized = normalizeAxiosError(new Error("API call before auth bootstrap"));
   return Promise.reject(normalized);
}



  const { accessToken } = authStore.getState();


  // ATTACH ACCESS TOKEN
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});




// ---- RESPONSE INTERCEPTOR  Without Refresh ----
api.interceptors.response.use(
  // Success (status 2xx)
  (response) => response,

  



  // Error
  async (error: any) => {

 if (error.response?.status === 401) {
      await authStore.getState().logout();
    }



    const normalized = normalizeAxiosError(error);

    // Reject with the cleaned error object
    return Promise.reject(normalized);




  }
)


export default api;










//   - Response interceptor with refres

    // ! we destroyed the original Axios error in case we have token this will make refresh it impossible 

    /*
    A refresh interceptor MUST know:

      - which request failed
      - whether it was already retried
      - how to replay it





 */
  //   async (error: AxiosError) => {
  //     const originalRequest = error.config as CustomAxiosRequestConfig;
  //     const status = error.response?.status;
  //     const { refreshToken } = authStore.getState();

  //     // 1. 401 Hata Kodu Kontrolü VE Henüz Tekrar Denenmemiş Olma Kontrolü
  //     if (status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true; // Tekrar denendi olarak işaretle


  //       if (refreshToken) {
  //         try {
  //           // 2. Token yenileme endpoint'ini çağır
  //           const newAccessToken = await refreshAuthToken(refreshToken);

  //           // 3. Store'u yeni accessToken ile güncelle
  //           // accessToken(newAccessToken);
  //           await authStore.getState().loginSuccess({ refreshToken, accessToken: newAccessToken })

  //           // 4. Orijinal isteğin Authorization header'ını güncelle
  //           originalRequest.headers = {
  //             ...originalRequest.headers,
  //             Authorization: `Bearer ${newAccessToken}`,
  //           };

  //           // 5. Orijinal isteği tekrarla
  //           return api(originalRequest);
  //         } catch (refreshError) {
  //           // Token yenileme başarısız olursa (örn: refresh token süresi dolmuştur)
  //           await authStore.getState().logout() // Kullanıcıyı log out yap
  //           // Orijinal hatayı normalize et ve reddet
  //           return Promise.reject(normalizeAxiosError(error));
  //         }
  //       } else {
  //         // Refresh token yoksa, sadece log out yap ve hata dön.
  //         await authStore.getState().logout()
  //       }
  //     }

  //     // Tekrar deneme mantığı uygulanmadıysa (farklı hata kodu, veya tekrar denendiği halde 401)
  //     // Hatayı normalize et ve reddet
  //     return Promise.reject(normalizeAxiosError(error));
  //   }
  // );